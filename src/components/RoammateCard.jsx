import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { MapPin, Users, Tag, Check, Clock, UserPlus, UserMinus } from "lucide-react";
import { sendRequest, removeConnection } from "../store/roammateSlice";
import { useToast } from "../hooks/use-toast";

const RoammateCard = ({ traveler, connectionStatus, showRelevanceScore = false, connectionId = null }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    if (connectionStatus) return;
    
    setIsConnecting(true);
    try {
      await dispatch(sendRequest(traveler._id)).unwrap();
      toast({
        title: "Connection Request Sent",
        description: `Your connection request to ${traveler.name} has been sent.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to send connection request",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!connectionId) return;
    
    setIsDisconnecting(true);
    try {
      await dispatch(removeConnection(connectionId)).unwrap();
      toast({
        title: "Connection Removed",
        description: `You are no longer connected with ${traveler.name}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to remove connection",
        variant: "destructive",
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const getConnectionButton = () => {
    if (connectionStatus === 'accepted') {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDisconnect}
          disabled={isDisconnecting}
          className="flex items-center gap-1 text-destructive hover:bg-destructive/10"
        >
          <UserMinus className="h-3.5 w-3.5" />
          <span>{isDisconnecting ? "Disconnecting..." : "Disconnect"}</span>
        </Button>
      );
    } else if (connectionStatus === 'pending') {
      return (
        <Button variant="outline" size="sm" disabled className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>Pending</span>
        </Button>
      );
    } else if (connectionStatus === 'incoming') {
      return (
        <Button variant="outline" size="sm" disabled className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>Incoming Request</span>
        </Button>
      );
    } else {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleConnect} 
          disabled={isConnecting}
          className="flex items-center gap-1"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>{isConnecting ? "Connecting..." : "Connect"}</span>
        </Button>
      );
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 avatar-ring">
            <AvatarImage src={traveler.profile?.avatar || "/placeholder.svg"} />
            <AvatarFallback>{traveler.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{traveler.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{traveler.profile?.location || "No location set"}</span>
                </div>
              </div>
              {getConnectionButton()}
            </div>
          </div>
        </div>
        
        {traveler.profile?.bio && (
          <p className="mt-4 text-sm">{traveler.profile.bio}</p>
        )}
        
        {traveler.profile?.interests && traveler.profile.interests.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" />
              <span>Interests</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {traveler.profile.interests.map((interest) => (
                <Badge key={interest} variant="outline" className="bg-muted/50 hover:bg-muted">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{traveler.profile?.locationsCount || 0} locations</span>
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{traveler.profile?.followersCount || 0} followers</span>
            </div>
          </div>
          
          {showRelevanceScore && traveler.relevanceScore > 0 && (
            <Badge variant="secondary" className="text-xs">
              {traveler.commonInterests > 0 && `${traveler.commonInterests} common interests`}
              {traveler.commonInterests > 0 && traveler.locationMatch && " • "}
              {traveler.locationMatch && "Same location"}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoammateCard;