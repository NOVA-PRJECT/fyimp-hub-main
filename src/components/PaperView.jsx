import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { StickyNote } from "lucide-react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";

function PaperView() {
  const { dept: deptCode, sem } = useParams();
  const [loading, setloading] = useState(false);

   const navigate = useNavigate();

  const {
    selectedDept,
    setselectedDept,
    setselectedSem,
    papers,
    setpapers,
    setdeptid,
    setselectedPaper,
    setpaperid,
  } = useOutletContext();

  useEffect(() => {
    async function fetchData() {
      if (!deptCode || !sem) return;

      setloading(true);

      try {
        // 1. Resolve Department
        const { data: deptData, error: deptError } = await supabase
          .from("departments")
          .select("id, name")
          .eq("code", deptCode)
          .single();

        if (deptError || !deptData) {
          console.error("Invalid department:", deptCode);
          setpapers([]);
          setselectedDept(null);
          setdeptid(null);
          setloading(false);
          return;
        }

        // Update Parent States
        setdeptid(deptData.id);
        setselectedDept(deptData.name);
        setselectedSem(Number(sem));

        // 2. Fetch Papers immediately using resolved ID
        const { data: paperData, error: paperError } = await supabase
          .from("papers_ordered")
          .select("*")
          .eq("department_id", deptData.id)
          .eq("semester", Number(sem));

        if (paperError) {
          console.error("Error fetching papers:", paperError);
          setpapers([]);
        } else {
          setpapers(paperData || []);
        }
      } catch (err) {
        console.error("System Error:", err);
      } finally {
        setloading(false);
      }
    }

    fetchData();
    // Only trigger when URL params change, ignoring internal state updates
  }, [deptCode, sem]); 


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

  navigate(`/${deptCode}/${sem}/paper/${paper.id}/notes`);
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
