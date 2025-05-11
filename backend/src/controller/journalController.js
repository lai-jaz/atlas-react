import Journal from "../models/Journal.js";
import mongoose from 'mongoose';
import Connection from "../models/Connection.js";

export const getAllJournals = async (req, res) => {
  const { userId } = req.query;

  try {
    let journals = [];

    if (userId) {
      journals = await Journal.find({
        $or: [
          { userId }, 
          { sharedWith: userId } 
        ]
      }).sort({ date: -1 });
    } else {
      journals = await Journal.find().sort({ date: -1 });
    }

    res.status(200).json(journals);
  } catch (error) {
    console.error("Error fetching journals:", error);
    res.status(500).json({ message: "Error fetching journals", error });
  }
};

export const getUserJournals= async (req, res) => {
  const userId = req.user._id; 

  try {
    const journals = await Journal.find({
      $or: [
        { userId: userId },
        { sharedWith: userId }
      ]
    }).sort({ date: -1 });

    res.json(journals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching journals' });
  }
};

export const getJournalById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid journal ID format' });
  }

  try {
    const journal = await Journal.findById(id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }
    res.status(200).json(journal);
  } catch (error) {
    console.error('Error fetching journal by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const createJournal = async (req, res) => {
  const { title, content, location, tags, userId, date } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

  if (!title || !content || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    
    const connections = await Connection.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    });

    const roammateIds = connections.map(conn =>
      conn.requester.toString() === userId ? conn.recipient : conn.requester
    );

   
    const newJournal = new Journal({
      title,
      content,
      location,
      tags,
      userId,
      date,
      imageUrl,
      sharedWith: roammateIds,
    });

    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (err) {
    console.error("Error creating journal:", err);
    res.status(500).json({ message: 'Error creating journal' });
  }
};

export const deleteJournal = async (req, res) => {
  try {
    console.log("DELETE req.body:", req.body); 
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).send("Journal not found");

    const userId = req.body.userId;

    if (journal.userId.toString() !== userId) {
      return res.status(403).send("You do not have permission to delete this journal.");
    }

    await journal.deleteOne();
    res.status(200).send("Journal deleted successfully.");
  } catch (err) {
    console.error("Error deleting journal:", err);
    res.status(500).send("Error deleting journal");
  }
};

export const updateJournal = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, location, userId } = req.body;

  try {
    const journal = await Journal.findById(id);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    if (journal.userId.toString() !== userId) {
      return res.status(403).json({ message: "You do not have permission to edit this journal" });
    }

    if (title !== undefined) journal.title = title;
    if (content !== undefined) journal.content = content;
    if (tags !== undefined) journal.tags = tags;
    if (location !== undefined) journal.location = location;


    await journal.save();
    res.status(200).json(journal);
  } catch (err) {
    console.error("Error updating journal:", err);
    res.status(500).json({ message: "Error updating journal", error: err });
  }
};
export const memoryJournals= async (req, res) => {
  try {
    const today = new Date();
    const memories = await Journal.find({
      $or: [
        {
          createdAt: {
            $gte: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
            $lt: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate() + 1),
          },
        },
        {
          createdAt: {
            $gte: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() + 1),
          },
        },
        {
          createdAt: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
          },
        },
        {
          createdAt: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          },
        },
      ],
    });

    res.json(memories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
};

export const memory = async (req, res) => {
  const { userId } = req.query;  
  const { period } = req.query;  

  if (!userId || !period) {
    return res.status(400).json({ message: 'Missing userId or period' });
  }

  try {
    
    const journals = await Journal.find({
      userId: userId 
    });

    const now = new Date();
    const target = new Date(now);

    switch (period) {
      case 'year':
        target.setFullYear(now.getFullYear() - 1);
        break;
      case 'month':
        target.setMonth(now.getMonth() - 1);
        break;
      case '7day':
        target.setDate(now.getDate() - 7);
        break;
      case '1day':
        target.setDate(now.getDate() - 1);
        break;
      default:
        return res.status(400).json({ message: 'Invalid period' });
    }

   
    const sameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    const memoryJournals = journals.filter(journal =>
      sameDay(new Date(journal.date), target)
    );

    res.status(200).json(memoryJournals);
  } catch (err) {
    console.error("Error fetching memory journals:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


