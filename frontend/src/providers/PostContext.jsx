import { createContext, useContext, useState, useEffect } from "react"
const PostContext = createContext(undefined)
import { useAuth } from "./AuthContext.jsx";

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    const [show, setShow] = useState(false);
    const [media, setMedia] = useState(null);
    const [preview, setPreview] = useState(null);
    const [description, setDescription] = useState("");
    const { auth } = useAuth();
    const [editingPost, setEditingPost] = useState(null);

    const handleShow = (post = null, setAnchorEl) => {
        if (post) {
            setEditingPost(post);
            setDescription(post.description || "");
            setPreview(post.media || null);
            setMedia(null);
        }
        setShow(true)
        setAnchorEl(null);
    };
    const handleClose = () => {
        setShow(false);
        setEditingPost(null);
        setDescription("");
        setMedia(null);
        setPreview(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            setPreview(URL.createObjectURL(file));
            setShow(true);
            e.target.value = "";
        }
    };

    const delFile = () => {
        setMedia(null);
        setPreview(null);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("description", description);
            if (media) {
                formData.append("media", media);
            }

            let url, method;
            if (editingPost) {
                // update
                url = `http://localhost:8080/post/${editingPost._id}/edit`;
                method = "PUT";
            } else {
                // new
                url = "http://localhost:8080/post/new";
                method = "POST";
            }

            const res = await fetch(url, {
                method,
                body: formData,
                credentials: "include",
            });

            const data = await res.json();
            if (!data.success) return;

            if (editingPost) {
                // update existing post in state
                setPosts(prev =>
                    prev.map(p => (p._id === editingPost._id ? data.post : p))
                );
            } else {
                // add new post
                if (data.post.owner === auth.user._id) data.post.name = auth.user.name;
                setPosts(prev => [data.post, ...prev]);
            }

            handleClose();
        } catch (err) {
            console.error(err);
        }
    };


    const getPosts = async () => {
        try {
            const res = await fetch("http://localhost:8080/feed", {
                method: "GET",
                credentials: "include"
            });
            const data = await res.json();
            setPosts(data.posts);
            setComments(data.comments);
        } catch (e) {
            console.log(e);
        }
    };

    const toggleLike = async (postId) => {
        try {
            const res = await fetch(`http://localhost:8080/post/${postId}/like`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            if (!data.success) return;

            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? {
                            ...p,
                            likesCount: data.liked
                                ? (p.likesCount || 0) + 1
                                : (p.likesCount || 1) - 1,
                            likedByMe: data.liked,
                        } : p
                )
            );
        } catch (err) {
            console.log(err);
        }
    };

    const toggleSave = async (postId) => {
        try {
            const res = await fetch(`http://localhost:8080/post/${postId}/save`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            if (!data.success) return;

            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? {
                            ...p,
                            savedByMe: data.saved,
                        } : p
                )
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handleCommentInput = (e) => {
        setComment(prev => prev = e.target.value);
    }

    const handleCommentSubmit = async (postId) => {
        if (!auth?.user?._id) {
            console.error("User not found, cannot comment");
            return;
        }

        const response = await fetch(`http://localhost:8080/post/${postId}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment: comment.trim(),
                comment_by: auth.user._id,
                comment_to: postId
            }),
            credentials: "include"
        });

        const data = await response.json();
        if (!data.success) return;

        const newComment = data.comment;

        setComments(prev => [newComment, ...prev]);
        setComment("")
    }

    useEffect(() => {
        getPosts();
    }, []);

    return <PostContext.Provider value={{ posts, setPosts, toggleLike, toggleSave, comment, handleCommentInput, comments, setComments, handleCommentSubmit, handleSubmit, delFile, handleFileChange, handleClose, handleShow, setDescription, media, show, description, preview, editingPost }}>{children}</PostContext.Provider>
}

export const usePost = () => useContext(PostContext);