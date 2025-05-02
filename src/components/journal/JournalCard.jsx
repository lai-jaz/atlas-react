import React from 'react';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, User, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function JournalCard(props) {
  const {
    id,
    title,
    excerpt,
    location,
    date,
    imageUrl,
    author,
    likes,
    comments,
    tags
  } = props;

  return (
    <div className="journal-card group animate-enter">
      <div className="relative">
        {imageUrl && (
          <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg">
            <img 
              src={imageUrl} 
              alt={title}
              className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className={`p-4 ${imageUrl ? '' : 'pt-0'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={author.avatar || '/placeholder.svg'} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{author.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistance(new Date(date), new Date(), { addSuffix: true })}
            </span>
          </div>

          <Link to={`/journal/${id}`}>
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
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-muted/50 hover:bg-muted">
                {tag}
              </Badge>
            ))}
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
              <Link to={`/journal/${id}`}>Read more</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalCard;
