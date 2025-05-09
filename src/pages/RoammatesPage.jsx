import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../components/layouts/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Users, MapPin } from "lucide-react";
import FindRoammatesDialog from "../components/FindRoammatesDialog";
import RoammateCard from "../components/RoammateCard";
import { 
  fetchConnectedRoammates, 
  fetchPendingRequests,
  fetchRoammateSuggestions,
  respondToConnectionRequest
} from "../store/roammateSlice";
import { useToast } from "../hooks/use-toast";

const RoammatesPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFindDialog, setShowFindDialog] = useState(false);
  const { connected, pending, suggestions, loading, error } = useSelector(state => state.roammates);
  
  useEffect(() => {
    // Fetch data when component mounts
    dispatch(fetchConnectedRoammates());
    dispatch(fetchPendingRequests());
    dispatch(fetchRoammateSuggestions());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowFindDialog(true);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await dispatch(respondToConnectionRequest({ requestId, action: 'accepted' })).unwrap();
      toast({
        title: "Connection Accepted",
        description: "You are now connected with this traveler",
      });
      // Refresh data
      dispatch(fetchConnectedRoammates());
      dispatch(fetchPendingRequests());
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to accept connection",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await dispatch(respondToConnectionRequest({ requestId, action: 'rejected' })).unwrap();
      toast({
        title: "Connection Rejected",
        description: "The connection request has been rejected",
      });
      // Refresh pending requests
      dispatch(fetchPendingRequests());
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to reject connection",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Roammates</h1>
            <p className="text-muted-foreground">
              Connect with fellow travelers and explorers
            </p>
          </div>
          <Button onClick={() => setShowFindDialog(true)}>Find Roammates</Button>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search travelers by name, location or interests..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <Tabs defaultValue="connected" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="connected">
              Connected ({connected.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Requests ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="suggestions">
              Suggestions ({suggestions.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected">
            {loading ? (
              <div className="text-center py-8">Loading connections...</div>
            ) : connected.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connected.map((traveler) => (
                  <RoammateCard 
                    key={traveler._id} 
                    traveler={traveler} 
                    connectionStatus="accepted" 
                    connectionId={traveler.connectionId}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <Users className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No connections yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start connecting with other travelers to build your network
                  </p>
                  <Button onClick={() => setShowFindDialog(true)}>
                    Find Roammates
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {loading ? (
              <div className="text-center py-8">Loading requests...</div>
            ) : pending.length > 0 ? (
              <div className="space-y-4">
                {pending.map((request) => (
                  <Card key={request._id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <RoammateCard 
                            traveler={request.requester} 
                            connectionStatus="incoming" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            onClick={() => handleAcceptRequest(request._id)}
                            className="w-full"
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleRejectRequest(request._id)}
                            className="w-full"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <Users className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                  <p className="text-muted-foreground">
                    You don't have any connection requests at the moment
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="suggestions">
            {loading ? (
              <div className="text-center py-8">Loading suggestions...</div>
            ) : suggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((traveler) => (
                  <RoammateCard 
                    key={traveler._id} 
                    traveler={traveler} 
                    connectionStatus={null}
                    showRelevanceScore={true}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <Users className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No suggestions available</h3>
                  <p className="text-muted-foreground mb-4">
                    Try updating your profile with more interests to get better suggestions
                  </p>
                  <Button onClick={() => setShowFindDialog(true)}>
                    Find Roammates
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <FindRoammatesDialog 
        open={showFindDialog} 
        onOpenChange={setShowFindDialog} 
        searchQuery={searchQuery}
      />
    </MainLayout>
  );
};

export default RoammatesPage;
