import { AiFillHome } from 'react-icons/ai'
import { MdPeople, MdGroups, MdNotifications, MdBookmark } from 'react-icons/md'
import { RiMessengerFill } from 'react-icons/ri'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from "../../../providers/AuthContext.jsx"
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import {
    Drawer,
    Box,
    ListItemIcon,
    TextField,
    List,
    ListItem,
    ListItemText,
    Divider,
    Typography
} from "@mui/material";
import Logo from '../Logo/Logo.jsx'
import "./Navigation.css"

const Navigation = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();
    const [open, setOpen] = useState(false);
    const searchInputRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleClose();
        try {
            const res = await fetch("http://localhost:8080/logout", {
                method: "POST",
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setAuth({ isLoggedIn: false, user: {} });
                navigate("/login");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    useEffect(() => {
        if (open && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [open]);


    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
        if (!newOpen) {
            setSearchQuery("");
            setSearchResults([]);
        }
    };

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:8080/search?q=${value}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                setSearchResults(data.users);
            }
        } catch (err) {
            console.error("Search error:", err);
        }
    };


    return (
        <nav className='Navigation'>
            <div className="nav-left">
                <Link to="/feed">
                    <Logo size="md" showText={false} />
                </Link>
                <input type="search" placeholder='Search Connecto' onClick={toggleDrawer(true)} readOnly />

                <Drawer
                    anchor=""
                    open={open}
                    onClose={toggleDrawer(false)}
                    ModalProps={{
                        keepMounted: true, // improve performance
                        disableScrollLock: true, // allow background scroll
                        BackdropProps: { invisible: true } // no dim background
                    }}
                    PaperProps={{
                        sx: {
                            width: 280,
                            //borderRight: "1px solid #ddd",
                            borderRadius: "0 0 12px 12px",
                            height: "auto",
                            maxHeight: "70vh",
                        }
                    }}
                >
                    <Box className="nav-left" p={2}>
                        <Link to="/feed">
                            <Logo size="md" showText={false} />
                        </Link>
                        <input 
                            type="search" 
                            placeholder='Search Connecto' 
                            ref={searchInputRef} 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Box>
                    <List>
                        {searchQuery.trim() === "" ? (
                            <Link to={`/profile/${auth.user?._id}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={toggleDrawer(false)}>
                                <ListItem button>
                                    <Avatar src={auth.user?.avatar || ""} sx={{ width: 24, height: 24, mr: 1 }} />
                                    <ListItemText primary={auth.user?.name || "My Profile"} />
                                </ListItem>
                            </Link>
                        ) : (
                            searchResults.map((user) => (
                                <Link key={user._id} to={`/profile/${user._id}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={toggleDrawer(false)}>
                                    <ListItem button>
                                        <Avatar src={user.avatar || ""} sx={{ width: 24, height: 24, mr: 1 }} />
                                        <ListItemText primary={user.name} />
                                    </ListItem>
                                </Link>
                            ))
                        )}
                        {searchQuery.trim() !== "" && searchResults.length === 0 && (
                            <ListItem>
                                <ListItemText primary="No users found" style={{ textAlign: "center", color: "#65676b" }} />
                            </ListItem>
                        )}
                    </List>
                </Drawer>




            </div>

            <div className="nav-middle">
                <Tooltip title="feed">
                    <Link to="/feed" className={location.pathname === '/feed' || location.pathname === '/' ? 'active' : ''}>
                        <AiFillHome size={26} />
                    </Link>
                </Tooltip>
                <Tooltip title="friends">
                    <Link to="/friends" className={location.pathname === '/friends' ? 'active' : ''}>
                        <MdPeople size={26} />
                    </Link>
                </Tooltip>
                <Tooltip title="groups">
                    <Link to="/groups" className={location.pathname === '/groups' ? 'active' : ''}>
                        <MdGroups size={26} />
                    </Link>
                </Tooltip>
                <Tooltip title="saved">
                    <Link to="/saved" className={location.pathname === '/saved' ? 'active' : ''}>
                        <MdBookmark size={26} />
                    </Link>
                </Tooltip>
            </div>

            <div className="right">
                <Tooltip title="notifications">
                    <Link to="/notifications" className={location.pathname === '/notifications' ? 'active' : ''}>
                        <MdNotifications size={26} />
                    </Link>
                </Tooltip>
                <Tooltip title="messages">
                    <Link to="/messages" className={location.pathname === '/messages' ? 'active' : ''}>
                        <RiMessengerFill size={26} />
                    </Link>
                </Tooltip>
                <Tooltip title="profile">
                    <Box style={{cursor: "pointer"}} aria-controls={openMenu ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}>
                        <Avatar
                            alt={auth.user?.name || "User"}
                            src={auth.user?.avatar || "https://via.placeholder.com/150"}
                            sx={{ width: 32, height: 32 }}  // optional: size
                        />
                    </Box>
                </Tooltip>

                <Menu
                    anchorEl={anchorEl}
                    id="basic-menu"
                    open={openMenu}
                    onClose={handleClose}
                    onClick={handleClose}
                    disableScrollLock
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Link to={`/profile/${auth.user?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem onClick={handleClose}>
                            <Avatar src={auth.user?.avatar || ""} /> Profile
                        </MenuItem>
                    </Link>
                    <Divider />
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </nav>
    )
}

export default Navigation
