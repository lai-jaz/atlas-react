
import MainLayout from "@/components/layouts/MainLayout";
import ProfileCard from "@/components/profile/ProfileCard";
import JournalGrid from "@/components/journal/JournalGrid";
import InteractiveMap from "@/components/map/InteractiveMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const mockUser = {
  name: "Alex Johnson",
  username: "alexjourneys",
  avatar: "/placeholder.svg",
  bio: "Travel enthusiast and photographer. Exploring the world one city at a time.",
  location: "San Francisco, CA",
  joinedDate: new Date("2023-01-15"),
  placesVisited: 27,
  followers: 148,
  following: 92,
  travelInterests: ["Photography", "Hiking", "Street Food", "Architecture", "Cultural Experiences"]
};

const ProfilePage = () => {
  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <ProfileCard user={mockUser} />
        
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
              <Button variant="outline">Find Roammates</Button>
            </div>
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium mb-2">Connect with Fellow Travelers</h3>
              <p className="text-muted-foreground mb-4">Sign up to connect with other travelers and share your experiences.</p>
              <Button>Sign Up Now</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
