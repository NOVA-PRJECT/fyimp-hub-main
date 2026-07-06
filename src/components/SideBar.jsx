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
    const { data, error } = await supabase.from("departments").select("*");

    if (!error) {
      setdepartments(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchdept();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleScrollLock = () => {
      if (isSidebarOpen && !mediaQuery.matches) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };

    handleScrollLock();
    mediaQuery.addEventListener("change", handleScrollLock);
    return () => {
      mediaQuery.removeEventListener("change", handleScrollLock);
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar Container */}
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
          <ul className="departmentList">
            {departments.map((department) => (
              <li
                key={department.id}
                className={`departmentItem ${
                  deptCode === department.code ? "activeDept" : ""
                }`}
                onClick={() => {
                  toggleSidebar();

                  // Reset paper and sync state
                  setpaperid(null);
                  setselectedDept(department.name);
                  setdeptid(department.id);

                  // 🔥 Grab the saved semester from local storage, default to 1 if none exists
                  const savedSem = localStorage.getItem("savedSemester");
                  const nextSem = savedSem ? Number(savedSem) : 1;

                  // Navigate using the department code and the saved semester
                  navigate(`/${department.code}/${nextSem}`);
                }}
              >
                {department.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default SideBar;
