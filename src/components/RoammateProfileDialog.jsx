import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { MapPin, Calendar, Users, Globe } from "lucide-react";
import { useDispatch } from "react-redux";
import { sendRequest } from "../store/roammateSlice";
import { useToast } from "../hooks/use-toast";

const RoammateProfileDialog = ({ 
  open, 
  onOpenChange, 
  traveler, 
  connectionStatus 
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  if (!traveler) return null;

  const handleConnect = async () => {
    try {
      await dispatch(sendRequest(traveler._id)).unwrap();
      toast({
        title: "Connection Request Sent",
        description: `Your connection request has been sent to ${traveler.name}`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to send connection request",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 avatar-ring">
              <AvatarImage src={traveler.avatar || "/placeholder.svg"} />
              <AvatarFallback>{traveler.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{traveler.name}</DialogTitle>
              <DialogDescription className="flex items-center mt-1">
                @{traveler.username || "username"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {traveler.bio && (
            <p className="text-sm">{traveler.bio}</p>
          )}
          
          {traveler.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{traveler.location}</span>
            </div>
          )}
          
          {traveler.joinedDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Joined {new Date(traveler.joinedDate).toLocaleDateString()}</span>
            </div>
          )}
          
          {traveler.placesVisited && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Globe className="h-4 w-4 mr-2" />
              <span>Visited {traveler.placesVisited} places</span>
            </div>
          )}
          
          {traveler.mutualConnections > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>{traveler.mutualConnections} mutual connections</span>
            </div>
          )}
          
          {traveler.interests && traveler.interests.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Interests</h4>
              <div className="flex flex-wrap gap-1">
                {traveler.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="bg-muted/50">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {connectionStatus === null && (
            <Button onClick={handleConnect}>
              Connect with {traveler.name.split(' ')[0]}
            </Button>
          )}
          
          {connectionStatus === "pending" && (
            <Badge variant="secondary" className="ml-auto">Request Sent</Badge>
          )}
          
          {connectionStatus === "accepted" && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-auto">
              Connected
            </Badge>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoammateProfileDialog;