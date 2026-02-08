import { Outlet, Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomResourceNav from "./BottomResourceNav";
import { supabase } from "../supabaseClient";
import NotFound from "./NotFound";

const VALID_TABS = ["notes", "pyq", "syllabus", "reference"];

function PaperLayout() {
  const location = useLocation();
  const { paperId } = useParams();

  const [paperName, setPaperName] = useState("");
  const [paperExists, setPaperExists] = useState(true);
  const [loading, setLoading] = useState(true);

  // Split path
  const segments = location.pathname.split("/").filter(Boolean);

  // If tab exists, it will be the last segment
  const maybeTab = segments.at(-1);

  const hasTab =
    VALID_TABS.includes(maybeTab);

  const isPaperOnlyRoute =
    segments.at(-2) === "paper";

  /* -----------------------------
     Resolve paperId → paperName
  ------------------------------ */
  useEffect(() => {
    if (!paperId) return;

    const fetchPaper = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("papers")
        .select("name")
        .eq("id", paperId)
        .single();

      if (error || !data) {
        setPaperExists(false);
        setPaperName("");
      } else {
        setPaperExists(true);
        setPaperName(data.name);
      }

      setLoading(false);
    };

    fetchPaper();
  }, [paperId]);

  /* -----------------------------
     1️⃣ PAPER ID INVALID
  ------------------------------ */
  if (!loading && !paperExists) {
    return (
      <NotFound
        title="Paper not found"
        message="The paper you are looking for does not exist."
      />
    );
  }

  /* -----------------------------
     2️⃣ NO TAB → redirect to notes
     (/paper/:paperId)
  ------------------------------ */
  if (isPaperOnlyRoute) {
    return <Navigate to="notes" replace />;
  }

  /* -----------------------------
     3️⃣ INVALID TAB
  ------------------------------ */
  if (!hasTab) {
    return (
      <NotFound
        title="Page not found"
        message="The page you are looking for doesn’t exist."
      />
    );
  }

  /* -----------------------------
     VALID STATE
  ------------------------------ */
  return (
    <div className="resourceview">
      {/* HEADER */}
      <div className="reshead">
        <h4>{paperName}</h4>
        <h4 className="s">{maybeTab.toUpperCase()}</h4>
      </div>

      {/* TAB CONTENT */}
      <Outlet />

      {/* BOTTOM NAV (only for valid paper + tab) */}
      <BottomResourceNav />
    </div>
  );
}

export default PaperLayout;