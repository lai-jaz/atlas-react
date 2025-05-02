import MainLayout from "../components/layouts/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Search, Users, MapPin } from "lucide-react";

// Mock data for roammates/travelers
const mockTravelers = [
  {
    id: '1',
    name: 'Emma Wilson',
    avatar: '/placeholder.svg',
    location: 'Tokyo, Japan',
    bio: 'Adventure seeker and food lover.',
    interests: ['Mountains', 'Photography', 'Local Cuisine'],
    mutualConnections: 3,
  },
  {
    id: '2',
    name: 'David Chen',
    avatar: '/placeholder.svg',
    location: 'Barcelona, Spain',
    bio: 'Digital nomad and photography enthusiast.',
    interests: ['Architecture', 'Beaches', 'City Life'],
    mutualConnections: 5,
  },
  {
    id: '3',
    name: 'Sofia Martinez',
    avatar: '/placeholder.svg',
    location: 'Rio de Janeiro, Brazil',
    bio: 'Passionate about nature and sustainable travel.',
    interests: ['Hiking', 'Sustainability', 'Local Culture'],
    mutualConnections: 2,
  },
  {
    id: '4',
    name: 'James Taylor',
    avatar: '/placeholder.svg',
    location: 'Cape Town, South Africa',
    bio: 'Explorer, wine enthusiast, and amateur photographer.',
    interests: ['Wildlife', 'Wine Tasting', 'Landscapes'],
    mutualConnections: 0,
  }
];

const RoammatesPage = () => {
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
          <Button>Find Roammates</Button>
        </div>
        
        <div className="relative w-full max-w-md mx-auto">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search travelers by name, location or interests..."
            className="pl-9 w-full"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTravelers.map((traveler) => (
            <Card key={traveler.id} className="overflow-hidden hover:shadow-md transition-all animate-scale-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 avatar-ring">
                    <AvatarImage src={traveler.avatar} />
                    <AvatarFallback>{traveler.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{traveler.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{traveler.location}</span>
                    </div>
                  </div>
                </div>
                
                <p className="mt-4 text-sm">{traveler.bio}</p>
                
                <div className="mt-4 flex flex-wrap gap-1">
                  {traveler.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="bg-muted/50 hover:bg-muted">
                      {interest}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  {traveler.mutualConnections > 0 && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{traveler.mutualConnections} mutual connections</span>
                    </div>
                  )}
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default RoammatesPage;
