import React from 'react'; // Removed useState
import Notes from './ResourceView/Notes';
import Pyqs from './ResourceView/Pyqs';
import Syllabus from './ResourceView/Syllabus';
import Reference from './ResourceView/Reference';


function ResourceView({ selectedDept, selectedSem, selectedPaper, activeTab, paperid }) {
  
  // Group props to avoid repeating them 4 times
  const commonProps = { selectedDept, selectedSem, selectedPaper, activeTab, paperid };
  
  const p=selectedPaper.toUpperCase();
  const t = activeTab.toUpperCase();
  return (
    <div className="resourceview">
          <div className="reshead">
             <h4>{p}</h4><h4 className="s">{t}</h4>
          </div>
      {activeTab === "notes" && <Notes {...commonProps} />}
      {activeTab === "pyqs" && <Pyqs {...commonProps} />}
      {activeTab === "syllabus" && <Syllabus {...commonProps} />}
      {activeTab === "reference" && <Reference {...commonProps} />}
    </div>
  );
}

export default ResourceView;
