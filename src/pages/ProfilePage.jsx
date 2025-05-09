  import MainLayout from "@/components/layouts/MainLayout";
  import ProfileCard from "@/components/profile/ProfileCard";
  import JournalGrid from "@/components/journal/JournalGrid";
  import InteractiveMap from "@/components/map/InteractiveMap";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Button } from "@/components/ui/button";
  import { useSelector, useDispatch } from "react-redux"; 
  import ProfileStats from "@/components/profile/ProfileStats";
  import { useEffect } from "react";
  import { fetchConnectedRoammates } from "@/store/roammateSlice";
  import { fetchLocations } from "@/store/mapSlice";
  import RoammateCard from "@/components/RoammateCard";

  const ProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { connected } = useSelector((state) => state.roammates);
    const { locations } = useSelector((state) => state.map);

    useEffect(() => {
      // Fetch data when component mounts
      dispatch(fetchConnectedRoammates());
      dispatch(fetchLocations());
    }, [dispatch]);

    if (!user) 
      return <div className="text-center mt-10"><h2 className="text-2xl font-bold">Loading...</h2></div>;

    return (
      <MainLayout>
        <div className="container py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ProfileCard user={user} />
            
              {/* Use the ProfileStats component */}
              <div className="mt-6">
                <ProfileStats />
              </div>
            </div>
          
            <div className="md:col-span-2">
              <Tabs defaultValue="journals" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="journals">Journals</TabsTrigger>
                  <TabsTrigger value="map">Travel Map</TabsTrigger>
                  <TabsTrigger value="roammates">Roammates</TabsTrigger>
                </TabsList>
                <TabsContent value="journals">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Travel Journals</h2>
                    <Button variant="outline">Share Journals</Button>
                  </div>
                  <JournalGrid />
                </TabsContent>
                <TabsContent value="map">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Travel Map</h2>
                    <Button variant="outline">Share Map</Button>
                  </div>
                  <InteractiveMap />
                </TabsContent>
                <TabsContent value="roammates">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Roammates</h2>
                    <Button variant="outline" asChild>
                      <a href="/roammates">Find Roammates</a>
                    </Button>
                  </div>
                
                  {connected && connected.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
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
                    <div className="p-12 text-center">
                      <h3 className="text-lg font-medium mb-2">Connect with Fellow Travelers</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't connected with any travelers yet. Start building your network!
                      </p>
                      <Button asChild>
                        <a href="/roammates">Find Roammates</a>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  };

  export default ProfilePage;
