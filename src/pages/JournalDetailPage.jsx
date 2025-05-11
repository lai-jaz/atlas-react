import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJournalById, deleteJournal } from "../api";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const JournalDetailPage = () => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user._id);
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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this journal?")) return;

    try {
    await deleteJournal(journalId, userId); 
    navigate("/");
  } catch (err) {
    console.error("Failed to delete journal:", err);
    alert("Failed to delete journal.");
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

        {isAuthor && (
          <div className="space-x-2">
            <Button onClick={() => navigate(`/edit/${journal._id}`)} variant="secondary">
              Edit
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-extrabold mb-2">{journal.title}</h1>
        <p className="text-sm text-muted-foreground mb-4">
          by <span className="font-medium">{journal.author?.name || "Unknown"}</span> •{" "}
          {new Date(journal.date).toLocaleDateString()}
        </p>
        <p className="text-lg leading-relaxed mb-6">{journal.content}</p>
      </div>

      {journal.location && (
        <div className="text-sm text-muted-foreground">
          <strong>Location:</strong> {journal.location}
        </div>
      )}

      {journal.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4">
          {journal.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalDetailPage;
