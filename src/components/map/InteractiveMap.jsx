import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axios from 'axios'; 
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});


const coloredIcons = {};
const createColoredIcon = (color) => {
  if (coloredIcons[color]) return coloredIcons[color];
  
  
  const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  coloredIcons[color] = icon;
  return icon;
};

// Map event handler for capturing clicks
const MapEventHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    }
  });
  return null;
};

// Location search component
const LocationSearch = ({ onLocationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5`
      );
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a location..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="bg-white rounded-md shadow-md max-h-60 overflow-y-auto z-50 relative">
          {results.map((result) => (
            <div
              key={result.place_id}
              className="p-2 hover:bg-muted cursor-pointer border-b"
              onClick={() => {
                onLocationSelect({
                  locationName: result.display_name.split(',')[0],
                  lat: parseFloat(result.lat),
                  lng: parseFloat(result.lon),
                  fullAddress: result.display_name
                });
                setResults([]);
                setSearchTerm('');
              }}
            >
              <p className="font-medium">{result.display_name.split(',')[0]}</p>
              <p className="text-xs text-muted-foreground truncate">{result.display_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main InteractiveMap component - modified to accept props from parent
const InteractiveMap = ({ locations = [], onAddLocation, isLoading = false }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const mapRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visitDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    color: '#2A9D8F',
    isPublic: true
  });

  const handleMapClick = (latlng) => {
    if (!isSearchMode) {
      setNewLocation({
        lat: latlng.lat,
        lng: latlng.lng
      });
      setIsAddDialogOpen(true);
    }
  };

  const handleLocationSelect = (location) => {
    setNewLocation({
      lat: location.lat,
      lng: location.lng
    });
    setFormData({
      ...formData,
      title: location.locationName
    });
    setIsAddDialogOpen(true);
    
    if (mapRef.current) {
      const map = mapRef.current;
      map.flyTo([location.lat, location.lng], 10);
    }
  };

  const saveLocation = () => {
    if (!newLocation || !formData.title) return;
    
    const newLocationObject = {
      lat: newLocation.lat,
      lng: newLocation.lng,
      title: formData.title,
      description: formData.description,
      visitDate: formData.visitDate,
      color: formData.color
    };
    
    // Call the parent component's handler
    if (onAddLocation) {
      onAddLocation(newLocationObject);
    }
    
    // Reset form state
    setIsAddDialogOpen(false);
    setNewLocation(null);
    setFormData({
      title: '',
      description: '',
      visitDate: new Date().toISOString().split('T')[0],
      color: '#2A9D8F',
      isPublic: true
    });
  };

  const colorOptions = [
    '#2A9D8F',
    '#E9C46A',
    '#F4A261',
    '#E76F51',
    '#264653'
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Interactive Travel Map</span>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsSearchMode(!isSearchMode)}
            >
              {isSearchMode ? 'Click Mode' : 'Search Mode'}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          View and add locations you've visited around the world
        </CardDescription>
        {isSearchMode && (
          <div className="mt-4">
            <LocationSearch onLocationSelect={handleLocationSelect} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
            <p>Loading map...</p>
          </div>
        ) : (
          <div className="map-container relative h-[400px] rounded-md overflow-hidden">
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapEventHandler onMapClick={handleMapClick} />
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={createColoredIcon(location.color)}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold">{location.title}</h3>
                      <p className="text-sm mt-1">{location.description}</p>
                      <p className="text-xs mt-2 font-medium">Visited on: {location.visitDate}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </CardContent>
        
      {/* Add Location Dialog - Moved OUTSIDE the CardContent to fix z-index issues */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="z-[9999] fixed">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Enter details about the place you visited.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Location Name</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Paris, France"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Share your experience..."
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="visitDate">Visit Date</Label>
              <Input
                id="visitDate"
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Pin Color</Label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      formData.color === color ? 'border-black' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({...formData, color: color})}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveLocation}>Save Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InteractiveMap;
