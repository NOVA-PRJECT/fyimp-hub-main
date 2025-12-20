import { supabase } from "../supabaseClient";
import React, { useState , useEffect} from "react";
import "../styles/SideBar.css"
import {X} from "lucide-react"


function SideBar({ isSidebarOpen,toggleSidebar,departments,setdepartments}) {
 async function fetchdept() {
   const {data,error} = await supabase
.from("departments")
.select("*");
 if (error){
   console.log("error : ",error);
 }
 setdepartments(data || []);
}

useEffect(()=>{
  fetchdept();
},[])
  return (
    <div className={`sidebarr ${isSidebarOpen ? 'open' : 'close'}`}>
      <div className="sidebarhead">
        <h2 className="heading">Departments</h2>
        <X className="closebtn" onClick ={toggleSidebar}/>
      </div>
      <ul className="departmentList">
  {departments.map((dept) => (
    <li onClick={toggleSidebar} className="departmentItem" key={dept.id}>
      {dept.name}
    </li>
  ))}
</ul>
    </div>
  );
}

    export default SideBar;