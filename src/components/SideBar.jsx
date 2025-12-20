import { supabase } from "../supabaseClient";
import React, { useState , useEffect} from "react";
import "../styles/SideBar.css"
import {X} from "lucide-react"


function SideBar({ isSidebarOpen,toggleSidebar }) {


  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'close'}`}>
      <div className="sidebarhead">
        <h2 className="heading">Departments</h2>
        <X className="closebtn" onClick ={toggleSidebar}/>
      </div>
      <ul className="departmentList">
        <li className="departmentItem">Computer Science</li>
        <li className="departmentItem">Electrical Engineering</li>
        <li className="departmentItem">Mechanical Engineering</li>
        <li className="departmentItem">Civil Engineering</li>
      </ul>
    </div>
  );
}

    export default SideBar;