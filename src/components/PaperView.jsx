import React,{useState} from 'react'
import "../styles/PaperView.css"


function PaperView({selectedDept,selectedSem}){
  
  
  return(
    <div className="paperview">
      <h4>{selectedDept.charAt(0).toUpperCase() +
    selectedDept.slice(1).toLowerCase()}&nbsp;>>&nbsp;{selectedSem} Sem</h4>
    </div>
    
    
    )
}


export default PaperView;