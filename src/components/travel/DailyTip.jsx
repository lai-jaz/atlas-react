import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const tips = [
  {
    title: "Pack Smart, Not Heavy",
    content: "Roll your clothes instead of folding to save space and avoid wrinkles.",
    category: "Packing",
    tags: ["luggage", "clothing", "organization"],
    likes: 12
  },
  {
    title: "Offline Maps Are a Lifesaver",
    content: "Download maps ahead of time so you're never lost, even without data.",
    category: "Navigation",
    tags: ["maps", "offline", "tech"],
    likes: 24
  },
  {
    title: "Learn Key Phrases",
    content: "Knowing a few words in the local language can go a long way in connecting with locals.",
    category: "Cultural Tips",
    tags: ["language", "connection", "etiquette"],
    likes: 30
  },
  {
    title: "Stay Hydrated",
    content: "Always carry a reusable water bottle, especially on long walks or hikes.",
    category: "Health",
    tags: ["water", "wellness", "eco-friendly"],
    likes: 18
  }
];

const getRandomTip = () => {
  const index = Math.floor(Math.random() * tips.length);
  return tips[index];
};

const DailyTip = () => {
  const [tip, setTip] = useState(null);

  useEffect(() => {
    setTip(getRandomTip());
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
