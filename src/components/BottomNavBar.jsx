import React from 'react'
import "../styles/BottomNavBar.css";
import SEMESTERS from '../constants.js'
import { CircleQuestionMark } from 'lucide-react';


function BottmNavBar({setselectedSem}){
  
  const handleSemSelect  = (e)=>{
    const semval=Number(e.target.value);
    setselectedSem(semval);
  }
  
  return(
     <div className="homebottom">
       <CircleQuestionMark className="questmark"/>
       <select  onClick={handleSemSelect} className="semselect">
        {SEMESTERS.map((sem) => (
  <option  key={sem.id} value={sem.id}>
    {sem.label}
  </option>
))}

       </select>
     </div>
    
    )
}

export default BottmNavBar;