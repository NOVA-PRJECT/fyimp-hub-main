import { supabase } from "../supabaseClient";
import React, { useState , useEffect} from "react";
import "../styles/SideBar.css"


function SideBar({ isSidebarOpen }) {


  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'close'}`}>
      <h2>Departments</h2>y
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