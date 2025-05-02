import { MapPin, User, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const ProfileCard = ({ user }) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-atlas-teal to-atlas-lightblue" />
      <CardContent className="pt-0 relative">
        <div className="absolute -top-16 left-4 border-4 border-background rounded-full">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user.avatar || '/placeholder.svg'} />
            <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="ml-36 pb-4 pt-3 flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            {user.username && (
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            )}
          </div>
          <Button variant="outline" className="flex items-center gap-1">
            <Users className="h-4 w-4 mr-1" />
            Follow
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {user.bio && <p className="text-sm">{user.bio}</p>}

          <div className="flex flex-wrap gap-4">
            {user.location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1 text-atlas-teal" />
                <span>{user.location}</span>
              </div>
            )}

            {user.joinedDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Joined{' '}
                  {new Date(user.joinedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="text-center">
              <p className="font-bold">{user.placesVisited || 0}</p>
              <p className="text-xs text-muted-foreground">Places</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{user.followers || 0}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{user.following || 0}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>

          {user.travelInterests && user.travelInterests.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Travel Interests:</p>
              <div className="flex flex-wrap gap-1">
                {user.travelInterests.map((interest) => (
                  <Badge key={interest} variant="outline" className="bg-muted/50">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
