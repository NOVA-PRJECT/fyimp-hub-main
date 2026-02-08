import { NavLink, useParams } from "react-router-dom";
import { BOTTOM_TABS } from "../constants";

function BottomResourceNav() {
  const { dept, sem, paperId } = useParams();

  return (
    <div className="resourcebottom">
      {BOTTOM_TABS.map((tab) => (
        <NavLink
          key={tab.id}
          to={`/${dept}/${sem}/paper/${paperId}/${tab.id}`}
          className={({ isActive }) =>
            `part ${isActive ? "active" : ""}`
          }
        >
          <tab.icon className="svg" />
          <p>{tab.label.toLowerCase()}</p>
        </NavLink>
      ))}
    </div>
  );
}

export default BottomResourceNav;