import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";
import { useDispatch } from "react-redux";
import { respondToConnectionRequest } from "../store/roammateSlice";
import { useToast } from "../hooks/use-toast";

const ConnectionRequestCard = ({ request }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { _id, requester } = request;

  const handleAccept = async () => {
    try {
      await dispatch(respondToConnectionRequest({ 
        requestId: _id, 
        action: 'accepted' 
      })).unwrap();
      
      toast({
        title: "Connection Accepted",
        description: `You are now connected with ${requester.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to accept connection request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    try {
      await dispatch(respondToConnectionRequest({ 
        requestId: _id, 
        action: 'rejected' 
      })).unwrap();
      
      toast({
        title: "Connection Declined",
        description: `You have declined ${requester.name}'s connection request`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to decline connection request",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 avatar-ring">
            <AvatarImage src={requester.avatar || "/placeholder.svg"} />
            <AvatarFallback>{requester.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{requester.name}</h3>
            {requester.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{requester.location}</span>
              </div>
            )}
          </div>
        </div>
        
        {requester.bio && <p className="mt-4 text-sm">{requester.bio}</p>}
        
        {requester.interests && requester.interests.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {requester.interests.map((interest) => (
              <Badge key={interest} variant="outline" className="bg-muted/50 hover:bg-muted">
                {interest}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleReject}>
            Decline
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionRequestCard;