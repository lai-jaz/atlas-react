import { MapPin, User, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const ProfileCard = ({ user }) => {
  const interestsArr = user.profile?.interests ? user.profile?.interests.split(',') : [];
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-atlas-teal to-atlas-lightblue" />
      <CardContent className="pt-0 relative">
        <div className="absolute -top-16 left-4 border-4 border-background rounded-full">
          <Avatar className="h-32 w-32">
            <AvatarImage className="object-cover" src={backendUrl + user.profile?.avatar || '/placeholder.svg'} />
            <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="ml-36 pb-4 pt-3 flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>

          </div>
          
        </div>

        <div className="mt-1 space-y-4">
          <p className="text-sm text-muted-foreground">
              {user.profile?.bio} 
            </p>

            {interestsArr && interestsArr.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {interestsArr.map((interest) => (
                  <Badge key={interest} variant="outline" className="bg-muted/50">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}

          <div className="flex flex-wrap gap-4">
            {user.profile?.location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1 text-atlas-teal" />
                <span>{user.profile?.location}</span>
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
