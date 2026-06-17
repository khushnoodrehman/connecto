import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { formatDistanceToNow } from "date-fns";
import { usePost } from "../../../providers/PostContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from 'react-bootstrap/Button';
import "./PostCard.css"
import { useAuth } from "../../../providers/AuthContext";


const PostCard = ({ owner, description, media, createdAt, likesCount, likedByMe, savedByMe, id }) => {
    const { toggleLike, comment, handleCommentInput, handleCommentSubmit, comments, toggleSave } = usePost()
    const [commentShow, setCommentShow] = useState(false);
    const { auth } = useAuth();
    const { handleShow } = usePost();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    return (
        <>
            <Card className="PostCard" sx={{ mb: 2 }}>
                <CardHeader
                    avatar={
                        <Link to={`/profile/${owner._id}`}>
                            <Avatar
                                alt={owner.name}
                                src={owner.avatar || "https://via.placeholder.com/150"}
                                sx={{ width: 40, height: 40 }}
                            />
                        </Link>
                    }
                    action={
                        <IconButton aria-label="settings" id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleMenuClick} style={{ background: "white" }} >
                              <MoreVertIcon />
                        </IconButton>
                    }
                    title={
                        <Link to={`/profile/${owner._id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                            {owner.name}
                        </Link>
                    }
                    subheader={createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : ""}
                />

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    disableScrollLock
                    slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                    }}
                >
                    {auth.user._id === owner._id && <><MenuItem onClick={() => handleShow({ _id: id, description, media }, setAnchorEl)}>Edit</MenuItem>
                        <MenuItem>Delete</MenuItem></>}

                    <MenuItem onClick={() => {
                        toggleSave(id);
                        handleMenuClose();
                    }}>
                        {savedByMe ? "Unsave Post" : "Save Post"}
                    </MenuItem>
                </Menu>

                <CardContent>
                    {!media ? <h3>{description}</h3> : <Typography variant="body1">{description}</Typography>}
                </CardContent>

                {media && (
                    <CardMedia
                        className="Media"
                        component="img"
                        height=""
                        image={media}
                        alt="Post"
                    />
                )}
                <span>{likesCount} likes</span>
                <br />



                <div className="post-actions">
                    <div className="action-item" onClick={() => toggleLike(id)}>
                        <ThumbUpOffAltIcon className="fill" fontSize="small" style={{ color: likedByMe ? "blue" : "" }} /> <span>Like</span>
                    </div>
                    <div className="action-item" onClick={() => setCommentShow(true)}>
                        <ChatBubbleOutlineIcon fontSize="small" /> <span>Comment</span>
                    </div>
                    <div className="action-item">
                        <ShareOutlinedIcon fontSize="small" /> <span>Share</span>
                    </div>
                </div>
            </Card>


            <Modal
                show={commentShow}
                onHide={() => setCommentShow(false)}
                dialogClassName="custom-modal"
                scrollable
            >
                {/* Modal Header */}
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: "center", width: "100%" }}>
                        Comments
                    </Modal.Title>
                </Modal.Header>

                {/* Modal Body */}
                <Modal.Body>
                    {/* Post Info (same card layout but simplified for modal) */}
                    <div className="post-preview">
                        <CardHeader
                            avatar={
                                <Link to={`/profile/${owner._id}`}>
                                    <Avatar
                                        alt={owner.name}
                                        src={owner.avatar || "https://via.placeholder.com/150"}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                </Link>
                            }
                            title={
                                <Link to={`/profile/${owner._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <strong>{owner.name}</strong>
                                </Link>
                            }
                            subheader={
                                createdAt
                                    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
                                    : ""
                            }
                        />
                        {!media ? <h3>{description}</h3> : <Typography variant="body1">{description}</Typography>}
                        {media && (
                            <CardMedia
                                component="img"
                                image={media}
                                alt="Post"
                                className="Media"
                            />
                        )}
                        <hr />
                    </div>

                    <div
                        className="comments-section"
                        style={{

                            overflowY: "auto",
                            border: "none",
                            padding: "8px"
                        }}
                    >

                        {comments
                            .filter((c) => c.comment_to === id || c.comment_to._id === id)
                            .map((c) => (
                                <div
                                    key={c._id}
                                    className="d-flex mb-2"
                                    style={{
                                        fontSize: "0.9rem",
                                        backgroundColor: "#f7f7f7",
                                        borderRadius: "8px",
                                        padding: "6px 8px",
                                        width: "fit-content",
                                        maxWidth: "80%",
                                    }}
                                >
                                    <Link to={`/profile/${c.comment_by?._id}`}>
                                        <Avatar alt={c.comment_by?.name} src={c.comment_by?.avatar || ""} sx={{ width: 28, height: 28 }} />
                                    </Link>
                                    <div className="ms-2">
                                        <Link to={`/profile/${c.comment_by?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <strong style={{ fontSize: "0.9rem" }}>
                                                {c.comment_by?.name}
                                            </strong>
                                        </Link>
                                        <div style={{ fontSize: "0.85rem" }}>{c.comment}</div>
                                    </div>
                                </div>
                            ))}
                    </div>

                </Modal.Body>

                {/* Modal Footer (comment input box) */}
                <Modal.Footer>
                    <div className="d-flex align-items-center w-100">
                        <Avatar src={auth.user?.avatar || "https://via.placeholder.com/40"} alt={auth.user?.name || "Me"} sx={{ width: 40, height: 40 }} />
                        <input
                            type="text"
                            name="comment"
                            value={comment}
                            onChange={handleCommentInput}
                            placeholder="Write a comment..."
                            className="form-control mx-2 rounded-pill"
                        />
                        <Button style={{ width: "60px", borderRadius: "30px" }} onClick={() => handleCommentSubmit(id)}>➤</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PostCard