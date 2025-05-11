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
import { getJournals, getMemories } from '../../api';
import { useSelector } from 'react-redux';
const JournalGrid = () => {
  const user = useSelector((state) => state.auth.user);

  const [journals, setJournals] = useState([]);
  const [memoryJournals, setMemoryJournals] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memoryOption, setMemoryOption] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      setLoading(true);
      setError(false);
      try {
        if (memoryOption) {
          const data = await getMemories(user._id, memoryOption);
          setMemoryJournals(Array.isArray(data) ? data : []);
        } else {
          const data = await getJournals(user._id);
          setJournals(Array.isArray(data) ? data : []);
          setMemoryJournals([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, memoryOption]);


  const filteredJournals = journals.filter(journal =>
    (journal.title && journal.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (journal.location && journal.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (journal.tags && journal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const filteredMemoryJournals = memoryJournals.filter(journal =>
    (journal.title && journal.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (journal.location && journal.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (journal.tags && journal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
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
  const formatPeriodLabel = (period) => {
    switch (period) {
      case "year": return "You on this day last year";
      case "month": return "You on this day last month";
      case "week": return "You on this day last week";
      case "day": return "You earlier today";
      default: return "Your memory";
    }
  };


  const sortedMemoryJournals = [...filteredMemoryJournals].sort((a, b) => {
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

  const displayJournals = memoryOption ? sortedMemoryJournals : sortedJournals;

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">Failed to load journals!</div>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        {!memoryOption && (
          <Input
            type="search"
            placeholder="Search journals by title, location, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-auto flex-1"
          />
        )}

        {!memoryOption && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-atlas-teal hover:bg-atlas-teal/90 text-white">Sort By</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border border-gray-300 rounded-lg bg-white shadow-lg p-2">
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
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-atlas-teal hover:bg-atlas-teal/90 text-white">
              {memoryOption ? 'Memory Period' : 'Check Memory'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border border-gray-300 rounded-lg bg-white shadow-lg p-2">
            <DropdownMenuLabel>Select a Memory</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={memoryOption} onValueChange={setMemoryOption}>
              <DropdownMenuRadioItem value="year">1 Year Ago</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="month">1 Month Ago</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="7day">7 Days Ago</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="1day">1 Day Ago</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {memoryOption && (
          <Button variant="outline" onClick={() => setMemoryOption('')}>
            Back to All Journals
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : displayJournals.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {memoryOption
              ? 'No memories found for this period.'
              : 'No journal entries found matching your search.'}
          </p>
        </div>
      ) : (
        <>
          {memoryOption && (
            <div className="text-xl font-semibold text-center text-blue-600">
              {formatPeriodLabel(memoryOption)}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {displayJournals.map((journal) => (
              <JournalCard key={journal._id} {...journal} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};


export default JournalGrid;
