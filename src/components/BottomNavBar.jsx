import React from 'react'
import {SEMESTERS} from '../constants.js'
import { CircleQuestionMark } from 'lucide-react';


function BottmNavBar({setselectedSem, setabout, about}){
  
  const handleSemSelect  = (e)=>{
    const semval=Number(e.target.value);
    setselectedSem(semval);
  }
  
  return(
     <div className="homebottom">
       <CircleQuestionMark onClick={()=>{setabout(!about);}} className="questmark"/>
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