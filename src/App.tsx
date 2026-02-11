import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VisitorPage from "./pages/VisitorPage";
import AdminPage from "./pages/AdminPage";
import ArchivesPage from "./pages/ArchivesPage";
import HallOfFamePage from "./pages/HallOfFamePage";
import StatsPage from "./pages/StatsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VisitorPage />} />
          <Route path="/archives" element={<ArchivesPage />} />
          <Route path="/hall-of-fame" element={<HallOfFamePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/admin2604" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
