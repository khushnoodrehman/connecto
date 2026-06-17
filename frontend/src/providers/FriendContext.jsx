import React, { createContext, useContext, useState, useEffect } from "react";

const FriendContext = createContext(undefined);

export const FriendProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFriendsData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/friends", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setRequests(data.requests || []);
        setSuggestions(data.suggestions || []);
      }
    } catch (err) {
      console.error("Error fetching friends data:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (targetUserId) => {
    try {
      const response = await fetch(`http://localhost:8080/friends/request/${targetUserId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        // Remove from suggestions list in UI since the request is sent
        setSuggestions((prev) => prev.filter((user) => user._id !== targetUserId));
        return true;
      } else {
        alert(data.message || "Failed to send friend request");
        return false;
      }
    } catch (err) {
      console.error("Error sending friend request:", err);
      return false;
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8080/friends/accept/${requestId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        // Remove from pending requests list in UI
        setRequests((prev) => prev.filter((req) => req._id !== requestId));
        return true;
      } else {
        alert(data.message || "Failed to accept friend request");
        return false;
      }
    } catch (err) {
      console.error("Error accepting friend request:", err);
      return false;
    }
  };

  const declineFriendRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8080/friends/decline/${requestId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        // Remove from pending requests list in UI
        setRequests((prev) => prev.filter((req) => req._id !== requestId));
        return true;
      } else {
        alert(data.message || "Failed to decline friend request");
        return false;
      }
    } catch (err) {
      console.error("Error declining friend request:", err);
      return false;
    }
  };

  useEffect(() => {
    getFriendsData();
  }, []);

  return (
    <FriendContext.Provider
      value={{
        requests,
        suggestions,
        loading,
        getFriendsData,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        setSuggestions,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export const useFriend = () => {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error("useFriend must be used within a FriendProvider");
  }
  return context;
};