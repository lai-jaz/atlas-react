import { useState, useEffect } from 'react';
import JournalCard from './JournalCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getJournals } from '../../api'; 

const JournalGrid = () => {
  const [journals, setJournals] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await getJournals();
        if (Array.isArray(data)) {
          setJournals(data);
        } else {
          console.error("Expected an array but got:", data);
          setJournals([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
        setJournals([]);
      }
    };

    fetchJournals();
  }, []);

  const filteredJournals = journals.filter(journal =>
    journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedJournals = [...filteredJournals].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'mostLiked':
        return b.likes - a.likes;
      case 'mostCommented':
        return b.comments - a.comments;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">Failed to load journals!</div>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          type="search"
          placeholder="Search journals by title, location, or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-auto flex-1"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Sort By</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort Journals</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
              <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="mostLiked">Most Liked</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="mostCommented">Most Commented</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {sortedJournals.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No journal entries found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedJournals.map((journal) => (
            <JournalCard key={journal._id} {...journal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalGrid;
