import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Book, Map, Users, Compass, Globe, Mountain } from "lucide-react";
import MainLayout from "../components/layouts/MainLayout";
import JournalGrid from "../components/journal/JournalGrid";
import DailyTip from "../components/travel/DailyTip";
import { motion } from "framer-motion";
import { mockTravelTips } from "../lib/mockData.js";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Index = () => {
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const features = [
    {
      title: "Travel Journal",
      description: "Document your journeys with immersive stories and stunning photos.",
      icon: <Book className="h-8 w-8 text-atlas-teal" />,
    },
    {
      title: "Interactive Map",
      description: "Visualize your adventures and discover new destinations.",
      icon: <Globe className="h-8 w-8 text-atlas-orange" />,
    },
    {
      title: "Connect Travelers",
      description: "Find travel companions and share experiences worldwide.",
      icon: <Users className="h-8 w-8 text-atlas-yellow" />,
    },
    {
      title: "Travel Memories",
      description: "Relive your favorite moments through location-based memories.",
      icon: <Mountain className="h-8 w-8 text-atlas-lightblue" />,
    },
  ];

  if (isLoggedIn) {
    return (
      <MainLayout>
        <div className="container py-6 space-y-8">
          {/*---------------------WELCOME---------------------- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-atlas-navy/10 to-atlas-teal/5 p-6 rounded-xl">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user.name}! 👋
              </h1>
            </div>
            <Button asChild>
              <Link to="/journal/new">Create New Memory</Link>
            </Button>
          </div>

          {/*--------------DAILY TIP--------------------*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Your Travel Feed</h2>
              <JournalGrid />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Today's Tips</h2>
              {mockTravelTips.map((tip) => (
                <DailyTip key={tip.id} tip={tip} />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/*---------------------------HERO SECTION----------------*/}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-atlas-navy/90 to-atlas-teal/90">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
            alt="Travel background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="container relative z-10 py-12 md:py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="rounded-full bg-atlas-teal/20 p-6 backdrop-blur-sm">
              <Compass className="h-16 w-16 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
              Your Journey Begins <span className="text-atlas-yellow">Here</span>
            </h1>
            
            <p className="max-w-[42rem] text-lg md:text-xl text-white/90 leading-relaxed">
              Join a community of passionate travelers. Document your adventures, connect with 
              fellow explorers, and discover your next destination with Atlas.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button 
                size="lg" 
                className="bg-atlas-teal hover:bg-atlas-teal/90 text-white"
                asChild
              >
                <Link to="/register">Start Your Journey</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/*-----------------FEATURES---------------------*/}
      <section className="container py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-atlas-teal to-atlas-lightblue bg-clip-text text-transparent">
            Your Ultimate Travel Companion
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Atlas combines the best of travel journaling, mapping, and social networking to create 
            a complete platform for travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-muted p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-atlas-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
