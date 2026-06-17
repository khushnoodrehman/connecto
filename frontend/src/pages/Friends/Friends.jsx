import React, { useEffect } from "react";
import ProfileCard from "../../components/ui/ProfileCard/ProfileCard.jsx";
import { useFriend } from "../../providers/FriendContext.jsx";
import "./Friends.css";

const Friends = () => {
  const { requests, suggestions, loading, getFriendsData } = useFriend();

  useEffect(() => {
    getFriendsData();
  }, []);

  const styles = {
    padding: "10px",
    fontSize: "18px",
    fontWeight: "700"
  };

  if (loading && requests.length === 0 && suggestions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <p style={styles}>Friend requests</p>
      <div className="requests">
        {requests.length > 0 ? (
          requests.map((req) => (
            <ProfileCard
              key={req._id}
              user={req.requester}
              type="request"
              requestId={req._id}
            />
          ))
        ) : (
          <p style={{ color: "#65676b", fontSize: "0.95rem", padding: "10px", margin: 0 }}>
            No pending friend requests
          </p>
        )}
      </div>

      <br /> <hr />

      <p style={styles}>People you may know</p>
      <div className="suggestions">
        {suggestions.length > 0 ? (
          suggestions.map((user) => (
            <ProfileCard
              key={user._id}
              user={user}
              type="suggestion"
            />
          ))
        ) : (
          <p style={{ color: "#65676b", fontSize: "0.95rem", padding: "10px", margin: 0 }}>
            No suggestions available right now
          </p>
        )}
      </div>
    </>
  );
};

export default Friends;