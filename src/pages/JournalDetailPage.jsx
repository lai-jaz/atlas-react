import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJournalById } from "../api"; 

const JournalDetailPage = () => {
  const { journalId } = useParams();
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

  if (error) return <div className="p-4">Journal not found.</div>;
  if (!journal) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{journal.title}</h1>
      <p className="text-muted-foreground text-sm mb-2">
        by {journal.author?.name || "Unknown"} • {new Date(journal.date).toLocaleDateString()}
      </p>
      <p className="mb-4">{journal.content}</p>
      {journal.location && (
        <p className="text-sm text-muted-foreground mb-2">Location: {journal.location}</p>
      )}
      {journal.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {journal.tags.map((tag) => (
            <span key={tag} className="bg-muted px-2 py-1 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalDetailPage;
