
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TaskSolution from "./pages/TaskSolution";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import TeacherPanel from "./pages/TeacherPanel";
import Calculator from "./pages/Calculator";
import Videos from "./pages/Videos";
import ExamPrep from "./pages/ExamPrep";
import Library from "./pages/Library";
import TextbookView from "./pages/TextbookView";
import Donate from "./pages/Donate";
import Puzzles from "./pages/Puzzles";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/task/:id" element={<TaskSolution />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/teacher" element={<TeacherPanel />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/exam" element={<ExamPrep />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:id" element={<TextbookView />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/puzzles" element={<Puzzles />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;