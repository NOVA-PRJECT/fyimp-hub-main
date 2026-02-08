import { supabase } from "../supabaseClient";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function SideBar({
  isSidebarOpen,
  toggleSidebar,
  departments,
  setdepartments,
  setselectedDept,
  setdeptid,
  selectedDept,
  setpaperid,
}) {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { dept: deptCode, sem } = useParams();

  async function fetchdept() {
    setLoading(true);

    const { data, error } = await supabase
      .from("departments")
      .select("*");

    if (!error) {
      setdepartments(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchdept();
  }, []);
  
  
  
  
  useEffect(() => {
  if (isSidebarOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [isSidebarOpen]);

  return (
  <>
    {isSidebarOpen && (
      <div className="overlay" onClick={toggleSidebar}></div>
    )}

    <div className={`sidebar ${isSidebarOpen ? "open" : "close"}`}>
      <div className="sidebarhead">
        <h2 className="heading">Departments</h2>
        <X className="closebtn" onClick={toggleSidebar} />
      </div>

      {loading ? (
        <div className="loadingScreen">
          <div className="loader"></div>
          <p>Loading departments...</p>
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
              {departments.map((department) => (
                <li
                  key={department.id}
                  className={`departmentItem ${
                    deptCode === department.code ? "activeDept" : ""
                 }`}
                  onClick={() => {
                    toggleSidebar();

                    // reset paper
                    setpaperid(null);

                    // sync state
                    setselectedDept(department.name);
                    setdeptid(department.id);

                    // keep semester if present, else default to 1
                    const nextSem = sem ? Number(sem) : 1;

                    navigate(`/${department.code}/${nextSem}`);
                  }}
                >
                  {department.name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  </>
);
}
export default SideBar;