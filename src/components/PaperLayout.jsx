import { Outlet, Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomResourceNav from "./BottomResourceNav";
import { supabase } from "../supabaseClient";
import NotFound from "./NotFound";

const VALID_TABS = ["notes", "pyq", "syllabus", "reference"];

function PaperLayout() {
  const location = useLocation();
  const { dept, sem, paperId } = useParams();

  const [paperName, setPaperName] = useState("");
  const [paperValid, setPaperValid] = useState(true);
  const [loading, setLoading] = useState(true);

  /* -----------------------------
     URL ANALYSIS
  ------------------------------ */
  const segments = location.pathname.split("/").filter(Boolean);
  const currentTab = segments.at(-1);
  const isPaperOnlyRoute = segments.at(-2) === "paper";

  /* -----------------------------
     VALIDATE TAB
  ------------------------------ */
  const hasValidTab = VALID_TABS.includes(currentTab);

  /* -----------------------------
     RESOLVE & VALIDATE PAPER
  ------------------------------ */
  useEffect(() => {
    if (!dept || !sem || !paperId) return;

    const validatePaper = async () => {
      setLoading(true);

      try {
        // 1️⃣ Resolve department code → id
        const { data: deptData, error: deptError } = await supabase
          .from("departments")
          .select("id")
          .eq("code", dept)
          .single();

        if (deptError || !deptData) {
          setPaperValid(false);
          setLoading(false);
          return;
        }

        // 2️⃣ Validate paper ownership
        const { data: paperData, error: paperError } = await supabase
          .from("papers")
          .select("id, name")
          .eq("id", paperId)
          .eq("department_id", deptData.id)
          .eq("semester", Number(sem))
          .single();

        if (paperError || !paperData) {
          setPaperValid(false);
          setPaperName("");
        } else {
          setPaperValid(true);
          setPaperName(paperData.name);
        }
      } catch (err) {
        console.error("Paper validation failed:", err);
        setPaperValid(false);
      } finally {
        setLoading(false);
      }
    };

    validatePaper();
  }, [dept, sem, paperId]);

  /* -----------------------------
     HARD FAIL STATES
  ------------------------------ */
  if (!loading && !paperValid) {
    return (
      <NotFound
        title="Paper not found"
        message="This paper does not belong to the selected department or semester."
      />
    );
  }

  /* -----------------------------
     NO TAB → REDIRECT
     /paper/:paperId
  ------------------------------ */
  if (!loading && paperValid && isPaperOnlyRoute) {
    return <Navigate to="notes" replace />;
  }

  /* -----------------------------
     INVALID TAB
  ------------------------------ */
  if (!loading && paperValid && !hasValidTab) {
    return (
      <NotFound
        title="Page not found"
        message="The section you are looking for does not exist."
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
        <h4 className="s">{currentTab.toUpperCase()}</h4>
      </div>

      {/* TAB CONTENT */}
      <Outlet context={{paperName}} />

      {/* BOTTOM NAV */}
      <BottomResourceNav />
    </div>
  );
}

export default PaperLayout;