
import { useState } from 'react';
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
const MOCK_JOURNALS = [
  {
    id: '1',
    title: 'Exploring the streets of Paris',
    excerpt: 'Walking through the charming streets of Paris, I discovered hidden cafes and spectacular views of the Eiffel Tower.',
    location: 'Paris, France',
    date: new Date('2023-08-15'),
    imageUrl: 'https://images.unsplash.com/photo-1471623432079-b009d30b911d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    author: {
      name: 'Alex Johnson',
      avatar: '/placeholder.svg',
    },
    likes: 24,
    comments: 5,
    tags: ['Europe', 'City', 'Culture'],
  },
  {
    id: '2',
    title: 'Mountain hiking in the Swiss Alps',
    excerpt: 'The breathtaking views and fresh mountain air made this hike unforgettable. Every step was worth the challenge.',
    location: 'Swiss Alps, Switzerland',
    date: new Date('2023-07-22'),
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    author: {
      name: 'Emma Wilson',
      avatar: '/placeholder.svg',
    },
    likes: 42,
    comments: 8,
    tags: ['Nature', 'Mountains', 'Hiking'],
  },
  {
    id: '3',
    title: 'Beach camping in Bali',
    excerpt: 'Falling asleep to the sound of waves and waking up to a stunning sunrise on the beach was a magical experience.',
    location: 'Bali, Indonesia',
    date: new Date('2023-09-05'),
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    author: {
      name: 'David Chen',
      avatar: '/placeholder.svg',
    },
    likes: 37,
    comments: 12,
    tags: ['Beach', 'Island', 'Camping'],
  },
  {
    id: '4',
    title: 'Food tour in Tokyo',
    excerpt: 'A culinary adventure through the vibrant streets of Tokyo, sampling everything from street food to Michelin-starred sushi.',
    location: 'Tokyo, Japan',
    date: new Date('2023-06-18'),
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
    author: {
      name: 'Sofia Martinez',
      avatar: '/placeholder.svg',
    },
    likes: 29,
    comments: 7,
    tags: ['Food', 'City', 'Asia'],
  },
];

const JournalGrid = () => {
  const [sortOption, setSortOption] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');


  const filteredJournals = MOCK_JOURNALS.filter(journal =>
    journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const sortedJournals = [...filteredJournals].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return b.date.getTime() - a.date.getTime();
      case 'oldest':
        return a.date.getTime() - b.date.getTime();
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative w-full md:w-auto md:flex-1">
          <Input
            type="search"
            placeholder="Search journals by title, location, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
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
            <JournalCard key={journal.id} {...journal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalGrid;
