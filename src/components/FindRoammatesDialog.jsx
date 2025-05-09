import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchForRoammates, fetchAllUsers } from "../store/roammateSlice";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { 
  Search, 
  MapPin, 
  Tag, 
  User
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import RoammateCard from "./RoammateCard";
import { useToast } from "../hooks/use-toast";

const FindRoammatesDialog = ({ open, onOpenChange, searchQuery = "" }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [query, setQuery] = useState(searchQuery);
  const [searchType, setSearchType] = useState(null);
  const { searchResults, allUsers, loading, error } = useSelector(state => state.roammates);
  const [hasSearched, setHasSearched] = useState(false);

  // When dialog opens, fetch all users if we don't have a search query
  useEffect(() => {
    if (open) {
      if (searchQuery) {
        handleSearch();
      } else {
        dispatch(fetchAllUsers());
      }
    }
  }, [open, dispatch, searchQuery]);

  useEffect(() => {
    setQuery(searchQuery);
    if (open && searchQuery) {
      handleSearch();
    }
  }, [searchQuery, open]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Add error handling for the search
  const handleSearch = () => {
    if (query.trim()) {
      dispatch(searchForRoammates({ query, searchType }))
        .unwrap()
        .catch(error => {
          toast({
            title: "Error",
            description: error || "Failed to search for roammates",
            variant: "destructive",
          });
        });
      setHasSearched(true);
    }
  };

  // Determine which users to display
  const usersToDisplay = hasSearched ? searchResults : allUsers;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Find Roammates</DialogTitle>
          <DialogDescription>
            Search for travelers by name, location, or interests to connect with them.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search travelers..."
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={!query.trim() || loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Search by:</span>
              <div className="flex gap-2">
                <Button 
                  variant={searchType === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSearchType(null)}
                  className="flex items-center gap-1"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>All</span>
                </Button>
                <Button 
                  variant={searchType === 'location' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSearchType('location')}
                  className="flex items-center gap-1"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Location</span>
                </Button>
                <Button 
                  variant={searchType === 'interest' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSearchType('interest')}
                  className="flex items-center gap-1"
                >
                  <Tag className="h-3.5 w-3.5" />
                  <span>Interest</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Loading travelers...</div>
        ) : usersToDisplay.length > 0 ? (
          <div className="space-y-4">
            {usersToDisplay.map((user) => (
              <RoammateCard 
                key={user._id} 
                traveler={user} 
                connectionStatus={user.connectionStatus}
              />
            ))}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-8 text-muted-foreground">
            No travelers found matching "{query}".
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No travelers available. Try searching for specific names or locations.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FindRoammatesDialog;