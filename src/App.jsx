import { Routes, Route, Navigate } from "react-router-dom";
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
import MyPapers from "./components/MyPapers"; // ✅ 1. Import your new dashboard

import "./App.css";

import { BookmarkProvider, useBookmarks } from "./BookmarkContext"; // ✅ 2. Import context and hook

/* ------------------------------------------------------------------
   🚦 THE TRAFFIC COP: Decides which home page to show
-------------------------------------------------------------------*/
function HomeOrDashboard() {
  const { isCustomHome } = useBookmarks();

  // If they flipped the switch, instantly teleport them to their dashboard
  if (isCustomHome) {
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
      <Routes>
        <Route element={<AppLayout />}>
          
          {/* ✅ 3. Swap <HomeView /> for our Traffic Cop */}
          <Route path="/" element={<HomeOrDashboard />} />
          
          {/* ✅ 4. Register the new dashboard route */}
          <Route path="/mypapers" element={<MyPapers />} />

          {/* ... The rest of your existing routes remain untouched ... */}
          <Route path=":dept/:sem" element={<PaperView />} />

          <Route path=":dept/:sem/paper/:paperId" element={<PaperLayout />}>
            <Route index element={<Navigate to="notes" replace />} />
            <Route path="notes" element={<Notes />} />
            <Route path="pyq" element={<Pyq />} />
            <Route path="syllabus" element={<Syllabus />} />
            <Route path="reference" element={<Reference />} />
          </Route>

        </Route>
        
        <Route path="/search" element={<SearchPaper />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </BookmarkProvider>
  );
}

export default App;
