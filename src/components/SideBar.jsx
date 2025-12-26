import { supabase } from "../supabaseClient";
import React, { useState, useEffect } from "react";
import "../styles/SideBar.css";
import { X } from "lucide-react";

function SideBar({
  isSidebarOpen,
  toggleSidebar,
  departments,
  setdepartments,
  setselectedDept,
  setdeptid,
  selectedDept,setpaperid
}) {

  const [loading, setLoading] = useState(false); // ✅ added

  async function fetchdept() {
    setLoading(true); // ✅ added

    const { data, error } = await supabase
      .from("departments")
      .select("*");

    if (error) {
      console.log("error : ", error);
    }

    setdepartments(data || []);
    setLoading(false); // ✅ added
  }

  useEffect(() => {
    fetchdept();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loadingScreen">
          <div className="loader"></div>
          <p>Loading papers...</p>
        </div>
      ) : (
        <>
          {isSidebarOpen && (
            <div className="overlay" onClick={toggleSidebar}></div>
          )}

          <div className={`sidebar ${isSidebarOpen ? "open" : "close"}`}>
            <div className="sidebarhead">
              <h2 className="heading">Departments</h2>
              <X className="closebtn" onClick={toggleSidebar} />
            </div>

            <ul className="departmentList">
              {departments.map((dept) => (
                <li
                  key={dept.id}
                  onClick={() => {
                    toggleSidebar();
                    setselectedDept(dept.name);
                    setdeptid(dept.id);
                    setpaperid(null);
                  }}
                  className={`departmentItem ${
                    selectedDept === dept.name ? "activeDept" : ""
                  }`}
                >
                  {dept.name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

export default SideBar;