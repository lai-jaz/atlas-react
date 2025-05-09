import { useSelector } from "react-redux";
import { Badge } from "./ui/badge";

const ConnectionRequestBadge = () => {
  const { pending } = useSelector(state => state.roammates);
  
  if (!pending || pending.length === 0) {
    return null;
  }
  
  return (
    <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
      {pending.length}
    </Badge>
  );
};

export default ConnectionRequestBadge;