import React from 'react';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, User, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function JournalCard(props) {
  const {
    _id, title, excerpt, location, date, imageUrl, author, likes, comments, tags
  } = props;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="journal-card group animate-enter">
      <div className="relative">
        {imageUrl && (
          <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg">
            <img 
              src={backendUrl + imageUrl} 
              alt={title}
              className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className={`p-4 ${imageUrl ? '' : 'pt-0'}`}>
          <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage className="object-cover" src={backendUrl + author?.avatar || '/placeholder.svg'} />
            <AvatarFallback>{author?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{author?.name || 'Unknown'}</span>
        </div>

<span className="text-xs text-muted-foreground">
  {date ? formatDistance(new Date(date), new Date(), { addSuffix: true }) : 'Unknown date'}
</span>

          </div>

          <Link to={`/journal/${_id}`}>
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{excerpt}</p>

          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1 text-atlas-teal" />
            <span>{location}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
  {tags && typeof tags === 'string' ? (
    // If tags is a plain comma-separated string
    tags.split(',').map((tag, idx) => (
      <Badge key={idx} variant="outline" className="bg-muted/50 hover:bg-muted">
        #{tag.trim().replace(/^#/, '')}
      </Badge>
    ))
  ) : Array.isArray(tags) && tags.length === 1 && typeof tags[0] === 'string' && tags[0].includes(',') ? (
    // If tags is an array with a single comma-separated string
    tags[0].split(',').map((tag, idx) => (
      <Badge key={idx} variant="outline" className="bg-muted/50 hover:bg-muted">
        #{tag.trim().replace(/^#/, '')}
      </Badge>
    ))
  ) : Array.isArray(tags) && tags.length > 0 ? (
    // Normal array case
    tags.map((tag, idx) => (
      <Badge key={idx} variant="outline" className="bg-muted/50 hover:bg-muted">
        #{tag.trim().replace(/^#/, '')}
      </Badge>
    ))
  ) : (
    <p className="text-xs text-muted-foreground">No tags available</p>
  )}
</div>




          <div className="flex items-center justify-between mt-2 pt-2 border-t">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 h-8 px-2">
                <Heart className="h-4 w-4 text-atlas-orange" />
                <span className="text-xs">{likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 h-8 px-2">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{comments}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/journal/${_id}`}>Read more</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalCard;
