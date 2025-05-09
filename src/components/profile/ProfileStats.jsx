import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, UserPlus } from "lucide-react";

const ProfileStats = () => {
  const { user } = useSelector(state => state.auth);
  const { locations } = useSelector(state => state.map);
  
  if (!user) return null;
  
  // Use the counts from the user's profile directly
  const locationsCount = locations?.length || 0;
  const followersCount = user.profile?.followersCount || 0;
  const followingCount = user.profile?.followingCount || 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex flex-col items-center">
              <MapPin className="h-5 w-5 mb-1 text-muted-foreground" />
              <span className="text-2xl font-bold">{locationsCount}</span>
              <span className="text-xs text-muted-foreground">Locations</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex flex-col items-center">
              <Users className="h-5 w-5 mb-1 text-muted-foreground" />
              <span className="text-2xl font-bold">{followersCount}</span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex flex-col items-center">
              <UserPlus className="h-5 w-5 mb-1 text-muted-foreground" />
              <span className="text-2xl font-bold">{followingCount}</span>
              <span className="text-xs text-muted-foreground">Following</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;