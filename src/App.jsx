import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import AppLayout from "./layouts/AppLayout";
import HomeView from "./components/HomeView";
import PaperView from "./components/PaperView";
import PaperLayout from "./components/PaperLayout";
import NotFound from "./components/NotFound";
import Notes from "./components/ResourceView/Notes";
import Pyq from "./components/ResourceView/Pyqs";
import Syllabus from "./components/ResourceView/Syllabus";
import Reference from "./components/ResourceView/Reference";
import About from "./components/About";
import SearchPaper from "./components/SearchPaper";
import MyPapers from "./components/MyPapers"; // ✅ Dashboard imported

import "./App.css";
import { Toaster } from "react-hot-toast"; 
import { BookmarkProvider, useBookmarks } from "./BookmarkContext"; // ✅ Context imported

/* ------------------------------------------------------------------
   🚦 THE TRAFFIC COP: Decides which home page to show
-------------------------------------------------------------------*/
function HomeOrDashboard() {
  const { isCustomHome } = useBookmarks();
  const location = useLocation();

  // ✅ Check if the NavBar Star button passed the secret bypass message
  const forceHome = location.state?.forceHome;

  // Only redirect if they have the setting ON *AND* they didn't explicitly click to leave
  if (isCustomHome && !forceHome) {
    return <Navigate to="/mypapers" replace />;
  }
  
  // Otherwise, show the normal department list
  return <HomeView />;
}

/* ------------------------------------------------------------------
   MAIN APP
-------------------------------------------------------------------*/
function App() {
  return (
    <BookmarkProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 1700,
          style: {
            background: 'var(--surface-card, #333)', 
            color: 'var(--text-heading, #fff)',
            borderRadius: '8px',
            border: '1px solid var(--border-global, #444)',
          },
        }} 
      />
      <Routes>
        <Route element={<AppLayout />}>
          
          {/* ✅ The Traffic Cop guards the root route */}
          <Route path="/" element={<HomeOrDashboard />} />
          
          {/* ✅ The Dashboard route */}
          <Route path="/mypapers" element={<MyPapers />} />

          <Route path=":dept/:sem" element={<PaperView />} />

          <Route path=":dept/:sem/paper/:paperId" element={<PaperLayout />}>
            <Route index element={<Navigate to="notes" replace />} />
            <Route path="notes" element={<Notes />} />
            <Route path="pyq" element={<Pyq />} />
            <Route path="syllabus" element={<Syllabus />} />
            <Route path="reference" element={<Reference />} />
          </Route>

          <Route path="/about" element={<About />} />

        </Route>
        
        <Route path="/search" element={<SearchPaper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Analytics />
    </BookmarkProvider>
  );
}

export default App;
