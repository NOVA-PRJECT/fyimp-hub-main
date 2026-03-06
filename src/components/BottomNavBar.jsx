import React, { useEffect, useState } from "react";
import { SEMESTERS } from "../constants.js";
import { CircleQuestionMark } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function BottmNavBar({ setabout, about }) {
  const navigate = useNavigate();
  const { dept, sem } = useParams();

  // 1. Create local state to keep the dropdown UI instantly responsive
  const [activeSem, setActiveSem] = useState(() => {
    return sem || localStorage.getItem("savedSemester") || "";
  });

  // 2. Watch for URL changes (like hitting the back button) and sync
  useEffect(() => {
    if (sem) {
      setActiveSem(sem); // Update UI
      localStorage.setItem("savedSemester", sem); // Save to storage
    } else {
      const savedSem = localStorage.getItem("savedSemester");
      if (dept && savedSem) {
        navigate(`/${dept}/${savedSem}`, { replace: true });
      }
    }
  }, [dept, sem, navigate]);

  // 3. Handle the user manually picking a new semester
  const handleSemSelect = (e) => {
    const semval = e.target.value;

    // Update the UI immediately so it never feels "stuck"
    setActiveSem(semval);
    localStorage.setItem("savedSemester", semval);

    // Update the URL
    if (dept) {
      navigate(`/${dept}/${semval}`);
    }
  };

  return (
    <div className="homebottom">
      <CircleQuestionMark
        onClick={() => {
          navigate('/about');
        }}
        className="questmark"
      />

      <select
        className="semselect"
        value={activeSem} // Bind directly to our responsive local state
        onChange={handleSemSelect}
      >
        {SEMESTERS.map((semOption) => (
          <option key={semOption.id} value={semOption.id}>
            {semOption.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BottmNavBar;
