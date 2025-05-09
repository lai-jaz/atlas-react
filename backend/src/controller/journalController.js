import Journal from "../models/Journal.js";
import mongoose from 'mongoose';

export const getAllJournals = async (req, res) => {
  try {
    const journals = await Journal.find().sort({ date: -1 }); // Retrieve all journals from the database
    res.status(200).json(journals);
  } catch (error) {
    console.error("Error fetching journals: ", error)
    res.status(500).json({ message: 'Error fetching journals', error });
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
  const { title, content, location, tags, author, userId, date } = req.body;

  if (!title || !content || !userId || !author?.name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newJournal = new Journal({ title, content, location, tags, author, userId, date });
    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (err) {
    res.status(500).json({ message: 'Error creating journal' });
  }
};





