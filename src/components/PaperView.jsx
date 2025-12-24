import React, { useEffect,useState} from "react";
import "../styles/PaperView.css";
import { supabase } from "../supabaseClient";
import { StickyNote } from "lucide-react";




function PaperView({
  selectedDept,
  selectedSem,
  deptid,
  papers,
  setpapers,
}) {
  
  const [loading, setloading]=useState(false);
  
  async function fetchpapers() {
    if (!deptid || !selectedSem) return;

   setloading(true);

    const { data, error } = await supabase
      .from("papers_ordered")
      .select("*")
      .eq("department_id", deptid)
      .eq("semester", selectedSem);

    if (error) {
      console.error("Error fetching papers:", error);
    } else {
      setpapers(data || []);
      setloading(false);
    }
  }

  useEffect(() => {
    fetchpapers();
  }, [deptid, selectedSem]);


  const deptName = selectedDept;

  return (
    <div className="paperview">
     
{loading ? (
  <div className="loadingScreen">
    <div className="loader"></div>
    <p>Loading papers...</p>
  </div>
) : (
  <div className="paperview">
     
    <div className="pprhead">
      <h4>
        {deptName && (
          <>
            {deptName} -- {selectedSem} SEM
          </>
        )}
      </h4>
    </div>

    <ul className="paperList">
      {papers.map((paper, index) => {
        const prevType = index > 0 ? papers[index - 1].type : null;
        const showHeading = paper.type !== prevType;

        return (
          <React.Fragment key={paper.id}>
            {showHeading && (
              <li className="paperTypeHeading">{paper.type}</li>
            )}

            <li className="paperItem">
              <div className="paperIcon">
                <StickyNote size={28} />
              </div>

              <div className="paperDetails">
                <div className="paperName">
                  {paper.name.toUpperCase()}
                </div>

                <div className="paperMeta">
                  {selectedDept} • {paper.type}
                </div>
              </div>
            </li>
          </React.Fragment>
        );
      })}
    </ul>
     
  </div>
)}
    </div>
  );
}

export default PaperView;