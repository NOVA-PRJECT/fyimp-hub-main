import React,{useState,useEffect} from 'react'
import "../styles/PaperView.css"
import { supabase } from "../supabaseClient";

function PaperView({selectedDept,selectedSem,setpapers,papers}){

  const paperOrder=["DSC","DSE","MDC","SEC","VAC"];
  
async function fetchpapers() {
   const {data,error} = await supabase
.from("papers")
.select("*")
.eq("department_id",selectedDept)
.eq("semester",selectedSem)
.eq("is_active",true);
 if (error){
   console.log("error : ",error);
 }
 setpapers(data || []);
}

useEffect(()=>{
  fetchpapers();
},[selectedDept,selectedSem])


const orderedPaper=[...papers].sort((a,b)=>{return paperOrder.indexOf(a.type)-paperOrder.indexOf(b.type);});

  return(
    <div className="paperview">
      <h4>{selectedDept.charAt(0).toUpperCase() +
    selectedDept.slice(1).toLowerCase()}&nbsp; &nbsp;{selectedSem} Sem</h4>
      <ul className="paperList">
  {orderedPaper.map((papers,index) => (
    <li  className="paperItem" key={papers.id}>
      {papers.name} ----{index+1}  -----{papers.type}
    </li>
  ))}
</ul>
    </div>
    
    
    )
}


export default PaperView;