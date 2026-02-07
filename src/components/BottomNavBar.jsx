import React from "react";
import { SEMESTERS } from "../constants.js";
import { CircleQuestionMark } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function BottmNavBar({ setabout, about }) {
  const navigate = useNavigate();
  const { dept, sem } = useParams();

  const handleSemSelect = (e) => {
    const semval = Number(e.target.value);

    // 🔥 URL is the source of truth
    if (dept) {
      navigate(`/${dept}/${semval}`);
    }
  };

  return (
    <div className="homebottom">
      <CircleQuestionMark
        onClick={() => {
          setabout(!about);
        }}
        className="questmark"
      />

      <select
        className="semselect"
        value={sem || ""}
        onChange={handleSemSelect}
      >
        {SEMESTERS.map((sem) => (
          <option key={sem.id} value={sem.id}>
            {sem.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BottmNavBar;