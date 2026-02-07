import { Outlet, Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomResourceNav from "./BottomResourceNav";
import { supabase } from "../supabaseClient";

const VALID_TABS = ["notes", "pyq", "syllabus", "reference"];

function PaperLayout() {
  const location = useLocation();
  const { paperId } = useParams();

  const [paperName, setPaperName] = useState("");
  const [loading, setLoading] = useState(true);

  /* -----------------------------
     CURRENT TAB FROM URL
  ------------------------------ */
  const currentTab = location.pathname.split("/").at(-1);

  if (!VALID_TABS.includes(currentTab)) {
    return <Navigate to="notes" replace />;
  }

  /* -----------------------------
     RESOLVE PAPER NAME (ID → NAME)
     SAME PATTERN AS DEPT
  ------------------------------ */
  useEffect(() => {
    if (!paperId) return;

    const fetchPaperName = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("papers")
        .select("name")
        .eq("id", paperId)
        .single();

      if (!error && data) {
        setPaperName(data.name);
      } else {
        console.error("Invalid paper id:", paperId);
        setPaperName("");
      }

      setLoading(false);
    };

    fetchPaperName();
  }, [paperId]);

  /* -----------------------------
     TAB LABEL (DERIVED)
  ------------------------------ */
  const tabLabel = currentTab.toUpperCase();

  return (
    <div className="resourceview">
      {/* HEADER */}
      <div className="reshead">
        <h4>{paperName}</h4>
        <h4 className="s">{tabLabel}</h4>
      </div>

      {/* TAB CONTENT */}
      <Outlet />

      {/* BOTTOM NAV */}
      <BottomResourceNav />
    </div>
  );
}

export default PaperLayout;