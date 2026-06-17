import { AiFillHome } from 'react-icons/ai'
import { MdPeople, MdGroups, MdBookmark } from 'react-icons/md'
import { NavLink } from "react-router-dom"

const Friendsbar = () => {
    const style = {
        padding: ' 10px 0 0 20px',
        fontSize: '26px',
        fontWeight: '700'

    }
    return (
        <>
            <div className="BarHeader" style={style}>
                <p>Friends</p>
            </div>
            <NavLink to="/friends" className="sidebar-item">
                <AiFillHome size={22} />
                <span>Home</span>
            </NavLink>

            <NavLink to="/" className="sidebar-item">
                <MdPeople size={22} />
                <span>Friend requests</span>
            </NavLink>

            <NavLink to="/groups" className="sidebar-item">
                <MdGroups size={22} />
                <span>Suggestions</span>
            </NavLink>

            <NavLink to="/saved" className="sidebar-item">
                <MdBookmark size={22} />
                <span>All Friends</span>
            </NavLink>
        </>
    )
}

export default Friendsbar