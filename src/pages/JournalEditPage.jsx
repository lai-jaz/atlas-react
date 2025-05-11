import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJournalById, updateJournal } from "../api";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const JournalEditPage = () => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?._id);

  const [journal, setJournal] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const data = await getJournalById(journalId);
        setJournal(data);
      } catch (err) {
        console.error("Error fetching journal:", err);
        setError(true);
      }
    };

    fetchJournal();
  }, [journalId]);

  const handleUpdate = async (updatedJournal) => {
    try {
      await updateJournal(journalId, { ...updatedJournal, userId });
      alert("Journal updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("Failed to update journal:", err);
      alert("Failed to update journal.");
    }
  };



  if (error) return <div className="p-6 text-center text-red-500">Journal not found.</div>;
  if (!journal) return <div className="p-6 text-center text-muted-foreground">Loading...</div>;

  const isAuthor = journal?.userId === userId;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => navigate(-1)} variant="ghost">
          ← Back
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold mb-2">Edit Journal</h1>

        <form onSubmit={(e) => {
  e.preventDefault();

  const updatedJournal = {
    title: journal.title || "",
    content: journal.content || "",
    tags: (journal.tags || "")
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => (tag.startsWith("#") ? tag : `#${tag}`))
      .join(","),
    userId,
  };

  handleUpdate(updatedJournal);
}}>

  <div>
    <label className="block mb-2" htmlFor="title">Title</label>
    <input
      type="text"
      id="title"
      className="w-full p-2 border border-gray-300 rounded"
      value={journal.title}
      onChange={(e) => setJournal({ ...journal, title: e.target.value })}
    />
  </div>
  <div className="mt-4">
    <label className="block mb-2" htmlFor="content">Content</label>
    <textarea
      id="content"
      className="w-full p-2 border border-gray-300 rounded"
      rows="6"
      value={journal.content}
      onChange={(e) => setJournal({ ...journal, content: e.target.value })}
    />
  </div>
  <div className="mt-4">
    <label className="block mb-2" htmlFor="tags">Hashtags (comma-separated)</label>
    <input
      type="text"
      id="tags"
      className="w-full p-2 border border-gray-300 rounded"
      value={journal.tags || ""}
      onChange={(e) => setJournal({ ...journal, tags: e.target.value })}
    />
  </div>
  <div className="mt-4">
    <Button type="submit" variant="primary">
      Save Changes
    </Button>
  </div>
</form>
      </div>
    </div>
  );
};

export default JournalEditPage;
