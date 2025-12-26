import React from 'react'; // Removed useState
import '../styles/ResourceView.css';
import Notes from './ResourceView/Notes';
import Pyqs from './ResourceView/Pyqs';
import Syllabus from './ResourceView/Syllabus';
import Reference from './ResourceView/Reference';
import Marquee from 'react-fast-marquee'



function ResourceView({ selectedDept, selectedSem, selectedPaper, activeTab, paperid }) {
  
  // Group props to avoid repeating them 4 times
  const commonProps = { selectedDept, selectedSem, selectedPaper, activeTab, paperid };

  return (
    <div className="resourceview">
          <div className="reshead">
             <h4>{selectedPaper. toUpperCase()}</h4>
          </div>
      {activeTab === "notes" && <Notes {...commonProps} />}
      {activeTab === "pyqs" && <Pyqs {...commonProps} />}
      {activeTab === "syllabus" && <Syllabus {...commonProps} />}
      {activeTab === "reference" && <Reference {...commonProps} />}
    </div>
  );
}

export default ResourceView;
