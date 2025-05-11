import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations, addLocation } from "@/store/mapSlice";
import MainLayout from "../components/layouts/MainLayout";
import InteractiveMap from "../components/map/InteractiveMap";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

const MapPage = () => {
  const dispatch = useDispatch();

  const { locations, loading } = useSelector((state) => state.map);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLocations()); // Fetch user-specific pinned locations from backend
  }, [dispatch]);

  const handleAddLocation = (newLocation) => {
    console.log("Handling add location in MapPage:", newLocation);
    dispatch(addLocation(newLocation)); // Add new location via backend
  };

  // Transform backend location data for the InteractiveMap component
  const transformedLocations = locations.map(loc => ({
    id: loc._id,
    lat: loc.coordinates?.lat || 0,
    lng: loc.coordinates?.lng || 0,
    title: loc.name || "Untitled Location",
    description: loc.description || "",
    visitDate: loc.visitDate || new Date(loc.datePinned).toISOString().split("T")[0],
    color: loc.color || "#2A9D8F"
  }));

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
          <TabsContent value="my-map">
            <InteractiveMap
              locations={transformedLocations}
              onAddLocation={handleAddLocation}
              isLoading={loading}
            />
            <div className="flex justify-between items-center mt-6">
              <div>
                <p className="text-sm font-medium">
                  Locations Visited: {locations.length}
                </p>
              </div>
            </div>
          </TabsContent>


        </Tabs>

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
                <p className="text-sm text-muted-foreground">
                  Click directly on the map to place a pin at the exact location
                </p>
              </div>
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-2">Option 2: Search for a location</h4>
                <p className="text-sm text-muted-foreground">
                  Use the search function in map's "Search Mode" to find specific places
                </p>
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
