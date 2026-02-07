import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import HomeView from "./components/HomeView";
import PaperView from "./components/PaperView";
import PaperLayout from "./components/PaperLayout";
import Notes from "./components/ResourceView/Notes";


function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeView />} />
        <Route path=":dept/:sem" element={<PaperView />} />

        {/* ADD THIS ONLY */}
        <Route
          path=":dept/:sem/paper/:paperId"
          element={<PaperLayout />}
        />
      </Route>
    </Routes>
  );
}

export default App;