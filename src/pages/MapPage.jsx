import { useState, useEffect } from "react";
import MainLayout from "../components/layouts/MainLayout";
import InteractiveMap from "../components/map/InteractiveMap";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";

const MapPage = () => {
  
  const [locations, setLocations] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    const savedLocations = localStorage.getItem("userLocations");
    if (savedLocations) {
      try {
        setLocations(JSON.parse(savedLocations));
      } catch (e) {
        console.error("Error parsing saved locations:", e);
      }
    }
  }, []);

  
  useEffect(() => {
    if (locations.length > 0) {
      localStorage.setItem("userLocations", JSON.stringify(locations));
    }
  }, [locations]);

 
  const handleAddLocation = (newLocation) => {
    
    const locationWithId = {
      ...newLocation,
      id: `loc_${Date.now()}`
    };
    
    setLocations(prev => [...prev, locationWithId]);
  };

  
  const countCountries = () => {
    const countries = new Set();
    locations.forEach(location => {
      const locationParts = location.title.split(', ');
      if (locationParts.length > 1) {
        countries.add(locationParts[locationParts.length - 1]);
      }
    });
    return countries.size;
  };

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
          <Button onClick={() => setIsDialogOpen(true)}>Add New Location</Button>
        </div>

        <Tabs defaultValue="my-map" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="my-map">My Map</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="my-map">
            <InteractiveMap 
              locations={locations} 
              onAddLocation={handleAddLocation}
              isLoading={isLoading}
            />
            <div className="flex justify-between items-center mt-6">
              <div>
                <p className="text-sm font-medium">Locations Visited: {locations.length}</p>
                <p className="text-sm text-muted-foreground">Countries Visited: {countCountries()}</p>
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

        {/* This dialog adds an alternative way to trigger adding a location */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                To add a new location, you can either:
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-2">Option 1: Click on the map</h4>
                <p className="text-sm text-muted-foreground">Click directly on the map to place a pin at the exact location</p>
              </div>
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-2">Option 2: Search for a location</h4>
                <p className="text-sm text-muted-foreground">Use the search function in map's "Search Mode" to find specific places</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Got it</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default MapPage;
