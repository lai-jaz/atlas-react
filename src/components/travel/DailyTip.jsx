import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRandomTip } from "@/api"; 

const DailyTip = () => {
  const [tip, setTip] = useState(null);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const data = await getRandomTip();
        setTip(data);
      } catch (error) {
        console.error("Failed to fetch tip:", error);
      }
    };

    fetchTip();
  }, []);

  if (!tip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-atlas-teal/10 to-atlas-navy/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="text-atlas-teal">Daily Travel Tip</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">{tip.title}</h3>
          <p className="text-muted-foreground mb-4">{tip.content}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tip.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-atlas-teal/20 text-atlas-teal px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">#{tip.category}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-atlas-orange"
              aria-label="Like this tip"
            >
              <Heart className="h-4 w-4 mr-1" />
              {tip.likes}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyTip;
