import Navigation from "../ui/Navigation/Navigation.jsx"
import Sidebar from '../ui/Sidebar/Sidebar.jsx';
import RightBar from "../ui/RightBar/RightBar.jsx"
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../providers/AuthContext.jsx"
import "./Layout.css";

const Layout = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const { isLoggedIn } = auth;
  const path = location.pathname;

  const isProfile = path.startsWith("/profile");
  const showSidebar = !isProfile;
  const showRightBar = path !== "/friends" && !isProfile;

  if(!isLoggedIn) {
    return <Navigate to="/login" replace />;
  } else {
    return (
    <>
      <Navigation />
      {showSidebar && <Sidebar />}
      {showRightBar && <RightBar />}
      <div className={`main-content ${isProfile ? "profile-layout" : ""}`} style={{ marginRight: showRightBar ? "280px" : "0px" }}>
        <Outlet />
      </div>
    </>
  );
  }
};

export default Layout;

