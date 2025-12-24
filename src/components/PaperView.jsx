import React, { useEffect } from "react";
import "../styles/PaperView.css";
import { supabase } from "../supabaseClient";

function PaperView({
  selectedDept,
  selectedSem,
  deptid,
  papers,
  setpapers,
}) {

  async function fetchpapers() {
    if (!deptid || !selectedSem) return;

    const { data, error } = await supabase
      .from("papers_ordered") // ✅ use ordered VIEW
      .select("*")
      .eq("department_id", deptid)
      .eq("semester", selectedSem);

    if (error) {
      console.error("Error fetching papers:", error);
    } else {
      setpapers(data || []);
    }
  }

  useEffect(() => {
    fetchpapers();
  }, [deptid, selectedSem]); 

  const deptName = selectedDept

  return (
    <div className="paperview">
      <div className="pprhead">
      <h4>
        {deptName && (
          <>
            {deptName} &nbsp;&nbsp; {selectedSem} SEM
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
          <li className="paperTypeHeading">
            {paper.type}
          </li>
        )}

        <li className="paperItem">
          {paper.name}
        </li>
      </React.Fragment>
    );
  })}
</ul>
    </div>
  );
}

export default PaperView;