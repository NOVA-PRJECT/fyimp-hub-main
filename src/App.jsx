import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import HomeView from "./components/HomeView";
import PaperView from "./components/PaperView";
import PaperLayout from "./components/PaperLayout";

import Notes from "./components/ResourceView/Notes";
import Pyq from  "./components/ResourceView/Pyqs";
import Syllabus from "./components/ResourceView/Syllabus";
import Reference from "./components/ResourceView/Reference";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeView />} />
        <Route path=":dept/:sem" element={<PaperView />} />

        {/* PAPER LAYOUT */}
        <Route path=":dept/:sem/paper/:paperId" element={<PaperLayout />}>
          {/* DEFAULT TAB */}
          <Route index element={<Navigate to="notes" replace />} />

          {/* RESOURCE TABS */}
          <Route path="notes" element={<Notes />} />
          <Route path="pyq" element={<Pyq />} />
          <Route path="syllabus" element={<Syllabus />} />
          <Route path="reference" element={<Reference />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;