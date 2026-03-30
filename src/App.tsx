import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import BookCourt from "./pages/BookCourt";
import FindGroup from "./pages/FindGroup";
import FindServices from "./pages/FindServices";
import FindCoach from "./pages/FindCoach";
import VideoAnalysis from "./pages/VideoAnalysis";
import InfoHub from "./pages/InfoHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book-court" element={<BookCourt />} />
            <Route path="/find-group" element={<FindGroup />} />
            <Route path="/find-services" element={<FindServices />} />
            <Route path="/find-coach" element={<FindCoach />} />
            <Route path="/video-analysis" element={<VideoAnalysis />} />
            <Route path="/info-hub" element={<InfoHub />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
