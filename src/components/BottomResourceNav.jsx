import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BOTTOM_TABS } from "../constants.js";

function BottomResourceNav() {
  const navigate = useNavigate();
  const { dept, sem, paperId, resource } = useParams();

  return (
    <div className="resourcebottom">
      {BOTTOM_TABS.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = resource === tab.id;

        return (
          <div
            key={tab.id}
            className={`part ${isActive ? "active" : ""}`}
            onClick={() =>
              navigate(`/${dept}/${sem}/paper/${paperId}/${tab.id}`)
            }
          >
            <IconComponent className="svg" />
            <p>{tab.label.toLowerCase()}</p>
          </div>
        );
      })}
    </div>
  );
}

export default BottomResourceNav;