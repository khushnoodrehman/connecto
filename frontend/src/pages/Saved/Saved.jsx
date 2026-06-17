import React, { useEffect, useState } from "react";
import { usePost } from "../../providers/PostContext.jsx";
import PostCard from "../../components/ui/PostCard/PostCard.jsx";
import { Link } from "react-router-dom";
import { MdBookmark } from "react-icons/md";
import "./Saved.css";

const Saved = () => {
  const { posts, setPosts, setComments } = usePost();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const res = await fetch("http://localhost:8080/saved", {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        if (data.success) {
          // Merge posts
          setPosts(prev => {
            const merged = [...prev];
            data.posts.forEach(p => {
              const exists = merged.find(x => x._id === p._id);
              if (exists) {
                Object.assign(exists, p);
              } else {
                merged.push(p);
              }
            });
            return merged;
          });

          // Merge comments
          if (setComments) {
            setComments(prev => {
              const merged = [...prev];
              data.comments.forEach(c => {
                if (!merged.some(x => x._id === c._id)) {
                  merged.push(c);
                }
              });
              return merged;
            });
          }
        }
      } catch (err) {
        console.error("Error fetching saved posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [setPosts, setComments]);

  // Filter posts to show only those saved by the current user
  const savedPosts = posts.filter(p => p.savedByMe);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-container">
      <div className="saved-header">
        <div className="saved-icon-wrapper">
          <MdBookmark size={28} />
        </div>
        <div className="saved-header-text">
          <h2>Saved Posts</h2>
          <p>Posts you've bookmarked for later</p>
        </div>
      </div>

      <div className="saved-posts-list">
        {savedPosts.length > 0 ? (
          savedPosts.map((post) => (
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
          <div className="saved-empty-state">
            <div className="empty-icon-container">
              <MdBookmark size={48} className="empty-icon" />
            </div>
            <h3>Your saved list is empty</h3>
            <p>Save posts from your Home feed to access them here anytime.</p>
            <Link to="/feed" className="go-to-feed-btn">
              Explore Feed
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
