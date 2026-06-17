import { AiFillHome } from 'react-icons/ai'
import { MdPeople, MdGroups, MdBookmark } from 'react-icons/md'
import { RiMessengerFill } from 'react-icons/ri'
import { NavLink, Link } from "react-router-dom"
import Avatar from '@mui/material/Avatar';
import { useAuth } from "../../../providers/AuthContext.jsx"

const Feedbar = () => {
    const { auth } = useAuth();
    return (
        <>
            <Link to={`/profile/${auth.user?._id}`} className="sidebar-item profile-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Avatar
                    alt={auth.user?.name || "User"}
                    src={auth.user?.avatar || "https://via.placeholder.com/150"}
                    sx={{ width: 32, height: 32 }}
                />
                <span className="profile-name">{auth.user?.name || "My Profile"}</span>
            </Link>

            <NavLink to="/feed" className="sidebar-item">
                <AiFillHome size={22} />
                <span>Home</span>
            </NavLink>

            <NavLink to="/friends" className="sidebar-item">
                <MdPeople size={22} />
                <span>Friends</span>
            </NavLink>

            <NavLink to="/groups" className="sidebar-item">
                <MdGroups size={22} />
                <span>Groups</span>
            </NavLink>

            <NavLink to="/saved" className="sidebar-item">
                <MdBookmark size={22} />
                <span>Saved</span>
            </NavLink>

            <NavLink to="/messages" className="sidebar-item">
                <RiMessengerFill size={22} />
                <span>Messages</span>
            </NavLink>
        </>
    )
}

export default Feedbar