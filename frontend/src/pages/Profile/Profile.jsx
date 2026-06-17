import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthContext.jsx";
import { usePost } from "../../providers/PostContext.jsx";
import PostBox from "../../components/ui/PostBox/PostBox.jsx";
import PostCard from "../../components/ui/PostCard/PostCard.jsx";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Avatar from "@mui/material/Avatar";
import {
  MdCameraAlt,
  MdEdit,
  MdCake,
  MdFavorite,
  MdEmail,
  MdPerson,
  MdCalendarToday,
  MdLink,
} from "react-icons/md";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import { useFriend } from "../../providers/FriendContext.jsx";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const { posts, setPosts } = usePost();
  const { sendFriendRequest, acceptFriendRequest, declineFriendRequest } = useFriend();

  // Profile owner state
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  // Edit profile state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editRelStatus, setEditRelStatus] = useState("");
  const [editSocialLinks, setEditSocialLinks] = useState({
    instagram: "",
    tiktok: "",
    youtube: "",
    x: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const isOwnProfile = auth.user?._id === id;

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/user/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setProfileUser(data.user);
        setFriendshipStatus(data.friendshipStatus);
        setRequestId(data.requestId);
        setFriends(data.friends || []);
        // Merge user posts into the global context posts to keep comments/likes synchronized
        if (data.posts && data.posts.length > 0) {
          setPosts((prev) => {
            const newPosts = data.posts.filter(
              (p) => !prev.some((x) => x._id === p._id)
            );
            return [...newPosts, ...prev];
          });
        }
      } else {
        setError(data.message || "Failed to load user profile");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile data from server");
    } finally {
      setLoading(false);
    }
  };

  const handleFriendAction = async (action) => {
    if (action === "send") {
      const success = await sendFriendRequest(profileUser._id);
      if (success) {
        setFriendshipStatus("Sent");
        fetchProfileData();
      }
    } else if (action === "accept") {
      const success = await acceptFriendRequest(requestId);
      if (success) {
        setFriendshipStatus("Friends");
      }
    } else if (action === "decline" || action === "cancel") {
      const success = await declineFriendRequest(requestId);
      if (success) {
        setFriendshipStatus(null);
        setRequestId(null);
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  // Open edit modal and initialize field values
  const handleOpenEdit = () => {
    setEditName(profileUser?.name || "");
    setEditBio(profileUser?.bio || "");
    setEditRelStatus(profileUser?.rel_status || "");
    setEditSocialLinks({
      instagram: profileUser?.social_links?.instagram || "",
      tiktok: profileUser?.social_links?.tiktok || "",
      youtube: profileUser?.social_links?.youtube || "",
      x: profileUser?.social_links?.x || "",
    });
    setAvatarFile(null);
    setAvatarPreview(profileUser?.avatar || "");
    setCoverFile(null);
    setCoverPreview(profileUser?.bg_photo || "");
    setShowEditModal(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("bio", editBio);
      formData.append("rel_status", editRelStatus);
      formData.append(
        "social_links",
        JSON.stringify({
          instagram: editSocialLinks.instagram,
          tiktok: editSocialLinks.tiktok,
          youtube: editSocialLinks.youtube,
          x: editSocialLinks.x,
        })
      );

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if (coverFile) {
        formData.append("bg_photo", coverFile);
      }

      const res = await fetch(`http://localhost:8080/user/${id}/edit`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setProfileUser(data.user);
        // Propagate updates to our logged-in context so headers/navbars match immediately
        setAuth((prev) => ({ ...prev, user: data.user }));
        setShowEditModal(false);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile edits");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error || "User profile not found."}
        </div>
        <Button onClick={() => navigate("/feed")}>Back to Home</Button>
      </div>
    );
  }

  // Filter posts to show only posts that belong to this profile owner
  const filteredPosts = posts.filter((p) => {
    const ownerId = typeof p.owner === "object" ? p.owner?._id : p.owner;
    return ownerId === profileUser._id;
  });

  return (
    <div className="profile-container">
      {/* Profile Header Block */}
      <div className="profile-header-card">
        {/* Cover Photo */}
        <div className="cover-wrapper">
          <img
            src={
              profileUser.bg_photo ||
              "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1200&auto=format&fit=crop"
            }
            alt="Cover"
            className="cover-photo"
          />
          {isOwnProfile && (
            <button className="edit-cover-btn" onClick={handleOpenEdit}>
              <MdCameraAlt size={18} />
              <span>Edit cover photo</span>
            </button>
          )}
        </div>

        {/* Avatar & Name Info Grid */}
        <div className="profile-info-section">
          <div className="avatar-wrapper">
            <img
              src={profileUser.avatar || "https://via.placeholder.com/150"}
              alt={profileUser.name}
              className="profile-avatar"
            />
            {isOwnProfile && (
              <button className="edit-avatar-btn" onClick={handleOpenEdit}>
                <MdCameraAlt size={18} style={{ color: "#050505" }} />
              </button>
            )}
          </div>

          <div className="profile-name-wrapper">
            <h1>{profileUser.name}</h1>
            <p className="profile-bio-text">
              {profileUser.bio || "No bio added yet."}
            </p>
          </div>

          <div className="profile-action-buttons">
            {isOwnProfile ? (
              <button
                className="profile-action-btn secondary"
                onClick={handleOpenEdit}
              >
                <MdEdit size={16} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                {friendshipStatus === null && (
                  <button className="profile-action-btn primary" onClick={() => handleFriendAction("send")}>
                    <span>Add Friend</span>
                  </button>
                )}
                {friendshipStatus === "Sent" && (
                  <button className="profile-action-btn secondary" onClick={() => handleFriendAction("cancel")}>
                    <span>Cancel Request</span>
                  </button>
                )}
                {friendshipStatus === "Received" && (
                  <>
                    <button className="profile-action-btn primary" onClick={() => handleFriendAction("accept")}>
                      <span>Confirm Request</span>
                    </button>
                    <button className="profile-action-btn secondary" onClick={() => handleFriendAction("decline")}>
                      <span>Decline Request</span>
                    </button>
                  </>
                )}
                {friendshipStatus === "Friends" && (
                  <button className="profile-action-btn secondary" onClick={() => handleFriendAction("cancel")}>
                    <span>Unfriend</span>
                  </button>
                )}
                <button className="profile-action-btn secondary">
                  <span>Message</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="profile-tabs-wrapper">
          <hr className="profile-tabs-divider" />
          <ul className="profile-tabs">
            <li className={`profile-tab ${activeTab === "posts" ? "active" : ""}`} onClick={() => setActiveTab("posts")}>Posts</li>
            <li className={`profile-tab ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>About</li>
            <li className={`profile-tab ${activeTab === "friends" ? "active" : ""}`} onClick={() => setActiveTab("friends")}>Friends</li>
            <li className={`profile-tab ${activeTab === "photos" ? "active" : ""}`} onClick={() => setActiveTab("photos")}>Photos</li>
            <li className={`profile-tab ${activeTab === "videos" ? "active" : ""}`} onClick={() => setActiveTab("videos")}>Videos</li>
          </ul>
        </div>
      </div>

      {/* Main Split Grid (Intro Cards & Posts Feed) */}
      <div className="profile-content-grid">
        {/* Left Column (Intro / details) */}
        <div className="profile-sidebar-column">
          <div className="intro-card">
            <h3>Intro</h3>
            {profileUser.bio && (
              <div className="intro-bio-section">
                <p className="intro-bio-text">{profileUser.bio}</p>
                <hr />
              </div>
            )}

            <div className="intro-details-list">
              <div className="intro-detail-item">
                <MdEmail size={20} className="detail-icon" />
                <span className="detail-label">
                  Email: <strong>{profileUser.email}</strong>
                </span>
              </div>
              <div className="intro-detail-item">
                <MdPerson size={20} className="detail-icon" />
                <span className="detail-label">
                  Gender:{" "}
                  <strong>
                    {profileUser.gender?.charAt(0).toUpperCase() +
                      profileUser.gender?.slice(1)}
                  </strong>
                </span>
              </div>
              {profileUser.dob && (
                <div className="intro-detail-item">
                  <MdCake size={20} className="detail-icon" />
                  <span className="detail-label">
                    Birthday:{" "}
                    <strong>
                      {new Date(profileUser.dob).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </strong>
                  </span>
                </div>
              )}
              {profileUser.rel_status && (
                <div className="intro-detail-item">
                  <MdFavorite size={20} className="detail-icon" />
                  <span className="detail-label">
                    Relationship: <strong>{profileUser.rel_status}</strong>
                  </span>
                </div>
              )}
              <div className="intro-detail-item">
                <MdCalendarToday size={20} className="detail-icon" />
                <span className="detail-label">
                  Joined:{" "}
                  <strong>
                    {new Date(profileUser.created_At).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long" }
                    )}
                  </strong>
                </span>
              </div>
            </div>

            {/* Social Media Links */}
            {profileUser.social_links &&
              Object.values(profileUser.social_links).some((val) => val) && (
                <div className="social-links-grid">
                  {profileUser.social_links.instagram && (
                    <a
                      href={`https://instagram.com/${profileUser.social_links.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link-badge"
                    >
                      <FaInstagram size={18} style={{ color: "#E1306C" }} />
                      <span>{profileUser.social_links.instagram}</span>
                    </a>
                  )}
                  {profileUser.social_links.tiktok && (
                    <a
                      href={`https://tiktok.com/@${profileUser.social_links.tiktok}`}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link-badge"
                    >
                      <FaTiktok size={18} style={{ color: "#000000" }} />
                      <span>{profileUser.social_links.tiktok}</span>
                    </a>
                  )}
                  {profileUser.social_links.youtube && (
                    <a
                      href={`https://youtube.com/${profileUser.social_links.youtube}`}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link-badge"
                    >
                      <FaYoutube size={18} style={{ color: "#FF0000" }} />
                      <span>{profileUser.social_links.youtube}</span>
                    </a>
                  )}
                  {profileUser.social_links.x && (
                    <a
                      href={`https://x.com/${profileUser.social_links.x}`}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link-badge"
                    >
                      <FaTwitter size={18} style={{ color: "#1DA1F2" }} />
                      <span>{profileUser.social_links.x}</span>
                    </a>
                  )}
                </div>
              )}
          </div>

          <div className="intro-card friends-list-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>Friends</h3>
                <span style={{ fontSize: "0.85rem", color: "#65676b", fontWeight: 600 }}>
                  {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
                </span>
              </div>
              <span className="see-all-link" style={{ color: "#1877f2", fontSize: "0.9rem", cursor: "pointer", fontWeight: 500 }} onClick={() => setActiveTab("friends")}>
                See all friends
              </span>
            </div>

            <div className="friends-grid">
              {friends.slice(0, 9).map(friend => (
                <div key={friend._id} className="friend-grid-item" onClick={() => navigate(`/profile/${friend._id}`)}>
                  <img src={friend.avatar || "https://via.placeholder.com/100"} alt={friend.name} className="friend-grid-img" />
                  <span className="friend-grid-name">{friend.name}</span>
                </div>
              ))}
              {friends.length === 0 && (
                <p style={{ color: "#65676b", fontSize: "0.9rem", textAlign: "center", width: "100%", margin: "10px 0" }}>
                  No friends to show
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Feed Posts or Tab Content) */}
        <div className="profile-feed-column">
          {activeTab === "posts" && (
            <>
              {isOwnProfile && <PostBox />}
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    owner={post.owner}
                    description={post.description}
                    media={post.media || ""}
                    createdAt={post.createdAt}
                    likesCount={post.likesCount}
                    likedByMe={post.likedByMe}
                    savedByMe={post.savedByMe}
                    id={post._id}
                  />
                ))
              ) : (
                <div className="no-posts-card">
                  <p>No posts available</p>
                </div>
              )}
            </>
          )}

          {activeTab === "about" && (
            <div className="intro-card" style={{ width: "100%" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px" }}>About</h3>
              <div className="intro-details-list">
                <div className="intro-detail-item">
                  <MdEmail size={20} className="detail-icon" />
                  <span className="detail-label">Email: <strong>{profileUser.email}</strong></span>
                </div>
                <div className="intro-detail-item">
                  <MdPerson size={20} className="detail-icon" />
                  <span className="detail-label">Gender: <strong>{profileUser.gender?.charAt(0).toUpperCase() + profileUser.gender?.slice(1)}</strong></span>
                </div>
                {profileUser.dob && (
                  <div className="intro-detail-item">
                    <MdCake size={20} className="detail-icon" />
                    <span className="detail-label">Birthday: <strong>{new Date(profileUser.dob).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</strong></span>
                  </div>
                )}
                {profileUser.rel_status && (
                  <div className="intro-detail-item">
                    <MdFavorite size={20} className="detail-icon" />
                    <span className="detail-label">Relationship Status: <strong>{profileUser.rel_status}</strong></span>
                  </div>
                )}
                <div className="intro-detail-item">
                  <MdCalendarToday size={20} className="detail-icon" />
                  <span className="detail-label">Joined Connecto: <strong>{new Date(profileUser.created_At).toLocaleDateString(undefined, { year: "numeric", month: "long" })}</strong></span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "friends" && (
            <div className="intro-card" style={{ width: "100%" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px" }}>All Friends</h3>
              <div className="d-flex flex-wrap gap-3">
                {friends.map((friend) => (
                  <div key={friend._id} className="d-flex align-items-center justify-content-between p-2 border rounded" style={{ width: "calc(50% - 8px)", minWidth: "250px", backgroundColor: "#f8f9fa", cursor: "pointer" }} onClick={() => navigate(`/profile/${friend._id}`)}>
                    <div className="d-flex align-items-center gap-3">
                      <Avatar src={friend.avatar || ""} alt={friend.name} sx={{ width: 60, height: 60 }} />
                      <div>
                        <strong style={{ fontSize: "0.95rem" }}>{friend.name}</strong>
                        {friend.bio && <div style={{ fontSize: "0.8rem", color: "#65676b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>{friend.bio}</div>}
                      </div>
                    </div>
                    <Button variant="light" size="sm" style={{ fontWeight: 600, border: "1px solid #ddd" }}>View Profile</Button>
                  </div>
                ))}
                {friends.length === 0 && (
                  <div className="text-center py-4 w-100" style={{ color: "#65676b" }}>
                    No friends to show.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="intro-card" style={{ width: "100%" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px" }}>Photos</h3>
              <div className="d-flex flex-wrap gap-2">
                {filteredPosts.filter(p => p.media).map(p => (
                  <img key={p._id} src={p.media} alt="Post media" style={{ width: "calc(33.33% - 6px)", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }} onClick={() => navigate(`/profile/${profileUser._id}`)} />
                ))}
                {filteredPosts.filter(p => p.media).length === 0 && (
                  <div className="text-center py-4 w-100" style={{ color: "#65676b" }}>
                    No photos to show.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div className="intro-card" style={{ width: "100%" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px" }}>Videos</h3>
              <div className="text-center py-4 w-100" style={{ color: "#65676b" }}>
                No videos to show.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Bootstrap Modal */}
      {isOwnProfile && (
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
          size="lg"
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontWeight: 700, fontSize: "1.3rem" }}>
              Edit Profile
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="px-4 py-3">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Cover Photo Upload Preview */}
              <div className="mb-4">
                <label className="form-label fw-bold">Cover Photo</label>
                <div
                  className="mb-2"
                  style={{
                    height: "180px",
                    width: "100%",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#eee",
                  }}
                >
                  <img
                    src={coverPreview || "https://via.placeholder.com/600x200"}
                    alt="Cover Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleCoverChange}
                />
              </div>

              {/* Avatar Upload Preview */}
              <div className="mb-4">
                <label className="form-label fw-bold">Profile Picture</label>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <Avatar
                    src={avatarPreview || "https://via.placeholder.com/150"}
                    sx={{ width: 80, height: 80 }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <hr />

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-bold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your display name"
                  required
                />
              </div>

              {/* Bio */}
              <div className="mb-3">
                <label className="form-label fw-bold">Bio</label>
                <textarea
                  rows="3"
                  className="form-control"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Describe who you are..."
                ></textarea>
              </div>

              {/* Relationship Status */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Relationship Status
                </label>
                <select
                  className="form-select"
                  value={editRelStatus}
                  onChange={(e) => setEditRelStatus(e.target.value)}
                >
                  <option value="">Select status...</option>
                  <option value="Single">Single</option>
                  <option value="In a relationship">In a relationship</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>

              <hr />
              <h5 className="fw-bold mb-3">Social Media Handles</h5>

              {/* Instagram */}
              <div className="mb-3 input-group">
                <span className="input-group-text bg-light">
                  <FaInstagram size={18} style={{ color: "#E1306C" }} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={editSocialLinks.instagram}
                  onChange={(e) =>
                    setEditSocialLinks((prev) => ({
                      ...prev,
                      instagram: e.target.value,
                    }))
                  }
                  placeholder="Instagram username"
                />
              </div>

              {/* TikTok */}
              <div className="mb-3 input-group">
                <span className="input-group-text bg-light">
                  <FaTiktok size={18} style={{ color: "#000000" }} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={editSocialLinks.tiktok}
                  onChange={(e) =>
                    setEditSocialLinks((prev) => ({
                      ...prev,
                      tiktok: e.target.value,
                    }))
                  }
                  placeholder="TikTok username"
                />
              </div>

              {/* YouTube */}
              <div className="mb-3 input-group">
                <span className="input-group-text bg-light">
                  <FaYoutube size={18} style={{ color: "#FF0000" }} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={editSocialLinks.youtube}
                  onChange={(e) =>
                    setEditSocialLinks((prev) => ({
                      ...prev,
                      youtube: e.target.value,
                    }))
                  }
                  placeholder="YouTube channel name/handle"
                />
              </div>

              {/* X / Twitter */}
              <div className="mb-3 input-group">
                <span className="input-group-text bg-light">
                  <FaTwitter size={18} style={{ color: "#1DA1F2" }} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={editSocialLinks.x}
                  onChange={(e) =>
                    setEditSocialLinks((prev) => ({
                      ...prev,
                      x: e.target.value,
                    }))
                  }
                  placeholder="X (Twitter) handle"
                />
              </div>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
