import { Outlet, Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomResourceNav from "./BottomResourceNav";
import { supabase } from "../supabaseClient";
import NotFound from "./NotFound";
// Make sure you import your CSS!
import ShareButton from "./ShareButton";
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

        const { data: paperData, error: paperError } = await supabase
          .from("papers")
          .select("id, name")
          .eq("id", paperId)
          .eq("semester", Number(sem))
          .or(`department_id.eq.${deptData.id},type.eq.AEC`) 
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
     LOADING STATE (THE FIX)
  ------------------------------ */
  if (loading) {
    return (
      <div className="resourceview">
        <div className="reshead">
          {/* This empty div reserves space and shows a loading animation */}
          <div className="skeleton-title"></div>
          {hasValidTab && <h4 className="s">{currentTab.toUpperCase()}</h4>}
        </div>
        
        {/* We hold off rendering the Outlet so child components don't fetch data yet */}
        <div className="skeleton-outlet-placeholder">
          {/* You can add a subtle spinner here if you want */}
        </div>
        
        <BottomResourceNav />
      </div>
    );
  }

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
      <div className="reshead">
        <h4>{paperName}</h4>
        <h4 className="s">{currentTab.toUpperCase()}</h4>
      </div>

      <Outlet context={{ paperName }} />
      <ShareButton/>

      <BottomResourceNav />
    </div>
  );
}

export default PaperLayout;
