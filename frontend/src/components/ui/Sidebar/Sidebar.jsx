import Feedbar from "./Feedbar.jsx"
import Friendsbar from "./Friendsbar"
import { useLocation } from "react-router-dom"
import "./Sidebar.css"

const Sidebar = () => {
  const location = useLocation()
  return (
    <aside className="Sidebar">
      { location.pathname !== "/friends" && <Feedbar /> }
      { location.pathname === "/friends" && <Friendsbar/> }
    </aside>
  )
}

export default Sidebar
