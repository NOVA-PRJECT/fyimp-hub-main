import React from 'react'
import './Syllabus.css' 
import { FileText } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { Eye } from 'lucide-react';
 
 
 
 function Syllabus({selectedDept, selectedSem, selectedPaper, activeTab, paperid
})   {
  
  return(
      
        <div className="syllabus">
        <div class="syllabus-card">
  <div class="icon-container">
    <FileText class="card-icon"/>
  </div>

  <div class="card-content">
    <h3>Course Syllabus</h3>
    <p>{`Official syllabus document for ${selectedPaper} (Semester ${selectedSem})`}</p>
  </div>
  <div className="button">
  <button class="view-btn">
    View Syllabus 
    <Eye class="btn-icon"/>
  </button>
  <button class="view-btn">
    Download Syllabus 
    <ExternalLink class="btn-icon"/>
  </button> 
  </div>
</div>
        
        
</div>
      
    
    )
}
    
   export default Syllabus; 
    
    
