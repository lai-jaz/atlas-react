import MainLayout from "../components/layouts/MainLayout";
import InteractiveMap from "../components/map/InteractiveMap";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const MapPage = () => {
  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Travel Map</h1>
            <p className="text-muted-foreground">
              Explore and add places you've visited around the world
            </p>
          </div>
          <Button>Add New Location</Button>
        </div>

        <Tabs defaultValue="my-map" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="my-map">My Map</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="my-map">
            <InteractiveMap />
            <div className="flex justify-between items-center mt-6">
              <div>
                <p className="text-sm font-medium">Locations Visited: 4</p>
                <p className="text-sm text-muted-foreground">Countries Visited: 4</p>
              </div>
              <Button variant="outline">Download Map</Button>
            </div>
          </TabsContent>

          <TabsContent value="community">
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium mb-2">Community Map Feature</h3>
              <p className="text-muted-foreground mb-4">
                This feature will show locations popular among other Atlas users.
              </p>
              <Button>Sign Up to Access</Button>
            </div>
          </TabsContent>

          <TabsContent value="wishlist">
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium mb-2">Travel Wishlist</h3>
              <p className="text-muted-foreground mb-4">
                Mark places you want to visit in the future.
              </p>
              <Button>Sign Up to Create Wishlist</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MapPage;
