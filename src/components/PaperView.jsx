import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { StickyNote } from "lucide-react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";

const VALID_SEMS = [1,2,3,4,5,6,7,8,9,10];

function PaperView() {
  const { dept: deptCode, sem } = useParams();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

  const {
    selectedDept,
    setselectedDept,
    setselectedSem,
    papers,
    setpapers,
    setdeptid,
    setselectedPaper,
    setpaperid,
    setIsRouteValid,   // ✅ THIS
  } = useOutletContext();

  useEffect(() => {
    async function fetchData() {
      setloading(true);
      setIsRouteValid(true); // assume valid until proven otherwise

      /* -----------------------------
         VALIDATE SEM
      ------------------------------ */
      const semNumber = Number(sem);
      if (!VALID_SEMS.includes(semNumber)) {
        setIsRouteValid(false);
        setloading(false);
        return;
      }

      /* -----------------------------
         RESOLVE DEPARTMENT
      ------------------------------ */
      const { data: deptData, error: deptError } = await supabase
        .from("departments")
        .select("id, name")
        .eq("code", deptCode)
        .single();

      if (deptError || !deptData) {
        setIsRouteValid(false);   // 🚫 INVALID DEPT
        setpapers([]);
        setselectedDept(null);
        setdeptid(null);
        setloading(false);
        return;
      }

      /* -----------------------------
         VALID DEPT + SEM
      ------------------------------ */
      setdeptid(deptData.id);
      setselectedDept(deptData.name);
      setselectedSem(semNumber);

      const { data: paperData, error: paperError } = await supabase
        .from("papers_ordered")
        .select("*")
        .eq("department_id", deptData.id)
        .eq("semester", semNumber);

      setpapers(paperError ? [] : paperData || []);
      setloading(false);
    }

    fetchData();
  }, [deptCode, sem]);

  /* -----------------------------
     INVALID ROUTE UI
  ------------------------------ */
  if (!loading && !selectedDept) {
    return (
      <NotFound
        title="Page not found"
        message="The page you are looking for doesn't exist."
      />
    );
  }

  /* -----------------------------
     NORMAL UI
  ------------------------------ */
  return (
    <div className="paperview">
      {loading ? (
        <div className="loadingScreen">
          <div className="loader"></div>
          <p>Loading papers...</p>
        </div>
      ) : (
        <>
          <div className="pprhead">
            <h4>{selectedDept?.toUpperCase()}</h4>
            <h5>SEMESTER {sem}</h5>
          </div>

          {papers.length === 0 ? (
            <p className="nopapers">No papers available</p>
          ) : (
            <ul className="paperList">
              {papers.map((paper, index) => {
                const prevType = index > 0 ? papers[index - 1].type : null;
                const showHeading = paper.type !== prevType;

                return (
                  <React.Fragment key={paper.id}>
                    {showHeading && (
                      <li className="paperTypeHeading">{paper.type}</li>
                    )}

                    <li
                      className="paperItem"
                      onClick={() => {
                        setselectedPaper(paper.name);
                        setpaperid(paper.id);
                        navigate(`paper/${paper.id}/notes`);
                      }}
                    >
                      <div className="paperIcon">
                        <StickyNote size={28} />
                      </div>

                      <div className="paperDetails">
                        <div className="paperName">
                          {paper.name.toUpperCase()}
                        </div>
                        <div className="paperMeta">
                          {deptCode} • {paper.type}
                        </div>
                      </div>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default PaperView;