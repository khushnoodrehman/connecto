import React, { useState } from "react";
import "./PostBox.css";
import { MdPhotoLibrary, MdVideocam } from "react-icons/md";
import { BsEmojiSmileFill } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Avatar from "@mui/material/Avatar";
import { usePost } from "../../../providers/PostContext.jsx";
import { useAuth } from "../../../providers/AuthContext.jsx";

const PostBox = () => {

  const { setPosts, handleSubmit, delFile, handleFileChange, handleClose, handleShow, setDescription, description, media, show, preview, editingPost } = usePost();
  const { auth } = useAuth();



  const validateFields = () => description.trim() !== "" || media;

  return (
    <>
      {/* Small trigger card */}
      <div className="PostBox">
        <div className="post-top">
          <Avatar src={auth.user?.avatar || "https://via.placeholder.com/150"} alt={auth.user?.name || "User"} />
          <input
            type="text"
            placeholder={`What's on your mind, ${auth.user?.name?.split(" ")[0] || "User"}?`}
            className="post-input"
            readOnly
            onClick={handleShow}
          />
        </div>
        <hr />

        <input
          type="file"
          accept="image/*"
          id="post-image"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div className="post-bottom">
          <label
            htmlFor="post-image"
            style={{ cursor: "pointer", padding: "5px" }}
          >
            <MdVideocam size={24} style={{ color: "#f3425f" }} />
            &nbsp;
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              Live Video
            </span>
          </label>
          <label
            htmlFor="post-image"
            style={{ cursor: "pointer", padding: "5px" }}
          >
            <MdPhotoLibrary size={20} style={{ color: "#45bd62" }} />
            &nbsp;
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              Photo/Video
            </span>
          </label>
          <label
            htmlFor="post-image"
            style={{ cursor: "pointer", padding: "5px" }}
          >
            <BsEmojiSmileFill size={18} style={{ color: "#f7b928" }} />
            &nbsp;
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              Feeling/Activity
            </span>
          </label>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center", width: "100%" }}>
            {editingPost ? "Edit Post" : "Create Post"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="profile">
            <Avatar src={auth.user?.avatar || "https://via.placeholder.com/150"} alt={auth.user?.name || "User"} />
            <span>{auth.user?.name || "User"}</span>
          </div>
          <br />
          <textarea
            rows="4"
            className="form-control mb-3"
            placeholder={`What's on your mind, ${auth.user?.name?.split(" ")[0] || "User"}?`}
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ fontSize: "1rem", border: "none", boxShadow: "none" }}
            autoFocus
          ></textarea>

          {preview && (
            <div className="image-preview mb-3">
              <div className="del" onClick={delFile}>
                X
              </div>
              <img
                src={preview}
                alt="Preview"
                className="img-fluid"
                style={{ borderRadius: "8px" }}
              />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <label htmlFor="post-image" className="btn btn-light">
            <MdPhotoLibrary style={{ color: "#45bd62", marginRight: "6px" }} />
            Photo/Video
          </label>

          <Button
            variant="primary"
            disabled={!validateFields()}
            onClick={handleSubmit}
          >
            {editingPost ? "Save" : "Post"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostBox;
