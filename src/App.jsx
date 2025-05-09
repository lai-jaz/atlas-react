import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import JournalPage from "./pages/JournalPage";
import ProfilePage from "./pages/ProfilePage";
import RoammatesPage from "./pages/RoammatesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/prot-route/ProtectedRoute";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initAuth } from "./store/authSlice";
import JournalDetailPage from "./pages/JournalDetailPage";

const queryClient = new QueryClient();

const App = () => {
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/roammates" element={<ProtectedRoute><RoammatesPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/journal/:journalId" element={<ProtectedRoute><JournalDetailPage /></ProtectedRoute>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>

)};

export default App;
