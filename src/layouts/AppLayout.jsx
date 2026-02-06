import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
// import SideBar from "../components/SideBar";
import BottomNavBar from "../components/BottomNavBar";

function AppLayout() {
  return (
    <>
      <NavBar />
      {/* <SideBar /> */}

      <main>
        <Outlet />
      </main>
      <BottomNavBar/>
    </>
  );
}

export default AppLayout;