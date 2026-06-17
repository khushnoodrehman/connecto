if (process.env.NOD_ENV != 'production') {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const multer = require('multer');
const { storage } = require('../backend/cloudConfig.js');
const upload = multer({ storage });

const User = require('./models/user');
const Post = require('./models/post');
const Like = require('./models/like');
const Comment = require('./models/comment');
const Friend = require('./models/friend');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


const dbUrl = "mongodb://127.0.0.1:27017/connecto";

main()
    .then(() => {
        console.log("connected to DB")
    })
    .catch((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect(dbUrl);
}

const sessionOptions = {
    secret: 'nobodyknows',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',        // important for cross-origin (Vite 5173)
        secure: false,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.send("done");
})

app.get('/auth/check', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isLoggedIn: true, user: req.user })
    } else {
        res.json({ isLoggedIn: false })
    }
});

app.post('/signup', async (req, res) => {
    console.log(req.body);
    let data = req.body;
    let { firstName, surname, password, confirmPassword, ...newUser } = data;
    newUser.name = firstName + " " + surname;
    password = password.value;
    console.log(newUser);
    const user = new User(newUser);
    const register = await User.register(user, password);
    console.log(register);
    res.json({ success: true, message: "Received data successfully!" })
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Login failed" });
            }
            return res.json({ success: true, message: "Login successful", user });
        });
    })(req, res, next);
});

app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Logout failed" });
        }
        res.json({ success: true, message: "Logged out successfully" });
    });
});

app.get("/feed", async (req, res) => {
    const posts = await Post.find().populate('owner', 'name').sort({ createdAt: -1 }).lean();
    const comments = await Comment.find().populate('comment_by', 'name').sort({ createdAt: -1 });
    for (let post of posts) {
        const like = await Like.findOne({ liked_by: req.user, liked_post: post })
        post.likedByMe = like ? true : false;
        post.likesCount = await Like.countDocuments({ liked_post: post })
        post.savedByMe = req.user && req.user.saved ? req.user.saved.some(id => id.toString() === post._id.toString()) : false;
    }
    console.log(posts);
    res.json({ success: true, posts, comments })
})

app.post("/post/new", upload.single('media'), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const { description } = req.body;
    const path = req.file ? req.file.path : "";
    const owner = req.user._id;
    const post = new Post({ owner, description, media: path });
    const result = await post.save();
    console.log(result);
    const populatedPost = await post.populate("owner", "name");
    res.json({ success: true, post: populatedPost });
})

app.post("/post/:id/like", async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const existingLike = await Like.findOne({ liked_by: userId, liked_post: postId });

        if (existingLike) {
            await existingLike.deleteOne();
            return res.json({ success: true, liked: false });
        } else {
            const like = new Like({ liked_by: userId, liked_post: postId });
            await like.save();
            return res.json({ success: true, liked: true });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/post/:id/comment", async (req, res) => {
    const postId = req.params.id;
    let { comment, comment_to, comment_by } = req.body;
    comment_to = postId;
    comment_by = req.user;
    const com = new Comment({ comment, comment_to, comment_by })
    const result = await com.save();
    console.log(result);
    const populatedComment = await com.populate('comment_by', 'name')
    res.json({ success: true, comment: populatedComment})
})

app.put("/post/:id/edit", upload.single('media'), async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    const path = req.file ? req.file.path : "";
    const post = await Post.findByIdAndUpdate(id, {description, media: path}, {new: true});
    res.json({success: true, post})
})



app.get("/friends", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        // Fetch active/pending received friend requests
        const requests = await Friend.find({ recipient: req.user._id, status: 'Pending' })
            .populate("requester", "name avatar bio")
            .lean();

        // Get suggestions (users who are not current user and have no pending/accepted relationships with current user)
        const friendships = await Friend.find({
            $or: [
                { requester: req.user._id },
                { recipient: req.user._id }
            ]
        });

        const excludedUserIds = friendships.map(f => 
            f.requester.toString() === req.user._id.toString() ? f.recipient.toString() : f.requester.toString()
        );
        excludedUserIds.push(req.user._id.toString());

        const suggestions = await User.find({ _id: { $nin: excludedUserIds } })
            .select("name avatar bio")
            .limit(12)
            .lean();

        res.json({ success: true, requests, suggestions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/friends/request/:id", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        if (targetUserId === currentUserId.toString()) {
            return res.status(400).json({ success: false, message: "Cannot request yourself" });
        }

        // Check if relationship already exists
        const existingRelation = await Friend.findOne({
            $or: [
                { requester: currentUserId, recipient: targetUserId },
                { requester: targetUserId, recipient: currentUserId }
            ]
        });

        if (existingRelation) {
            return res.status(400).json({ success: false, message: "Relationship/Request already exists" });
        }

        const friendRequest = new Friend({
            requester: currentUserId,
            recipient: targetUserId,
            status: 'Pending'
        });

        await friendRequest.save();
        res.json({ success: true, message: "Friend request sent successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/friends/accept/:id", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const requestId = req.params.id;
        const friendship = await Friend.findById(requestId);
        if (!friendship) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // Ensure the recipient is the logged in user
        if (friendship.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to accept this request" });
        }

        friendship.status = 'Accepted';
        await friendship.save();

        res.json({ success: true, message: "Friend request accepted!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/friends/decline/:id", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const requestId = req.params.id;
        const friendship = await Friend.findById(requestId);
        if (!friendship) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // Ensure the logged in user is either the requester or the recipient
        if (
            friendship.recipient.toString() !== req.user._id.toString() &&
            friendship.requester.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ success: false, message: "Unauthorized to cancel or decline this request" });
        }

        await Friend.findByIdAndDelete(requestId);
        res.json({ success: true, message: "Friend request declined/removed!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-salt -hash");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const posts = await Post.find({ owner: id }).populate('owner', 'name avatar').sort({ createdAt: -1 }).lean();
        const postIds = posts.map(p => p._id);
        const comments = await Comment.find({ comment_to: { $in: postIds } }).populate('comment_by', 'name avatar').sort({ createdAt: -1 });

        for (let post of posts) {
            const like = await Like.findOne({ liked_by: req.user, liked_post: post })
            post.likedByMe = like ? true : false;
            post.likesCount = await Like.countDocuments({ liked_post: post })
            post.savedByMe = req.user && req.user.saved ? req.user.saved.some(id => id.toString() === post._id.toString()) : false;
        }

        // Query friendship status
        let friendshipStatus = null;
        let requestId = null;
        if (req.user && req.user._id.toString() !== id) {
            const friendship = await Friend.findOne({
                $or: [
                    { requester: req.user._id, recipient: id },
                    { requester: id, recipient: req.user._id }
                ]
            });

            if (friendship) {
                requestId = friendship._id;
                if (friendship.status === 'Accepted') {
                    friendshipStatus = 'Friends';
                } else if (friendship.status === 'Pending') {
                    if (friendship.requester.toString() === req.user._id.toString()) {
                        friendshipStatus = 'Sent';
                    } else {
                        friendshipStatus = 'Received';
                    }
                }
            }
        }
        // Query accepted friends list
        const friendsList = await Friend.find({
            $or: [
                { requester: id, status: 'Accepted' },
                { recipient: id, status: 'Accepted' }
            ]
        }).populate("requester", "name avatar").populate("recipient", "name avatar");

        const friends = friendsList.map(f => 
            f.requester._id.toString() === id ? f.recipient : f.requester
        );

        res.json({ success: true, user, posts, comments, friendshipStatus, requestId, friends });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put("/user/:id/edit", upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'bg_photo', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user || req.user._id.toString() !== id) {
            return res.status(403).json({ success: false, message: "Unauthorized to edit this profile" });
        }

        const updateData = {};
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.bio !== undefined) updateData.bio = req.body.bio;
        if (req.body.rel_status !== undefined) updateData.rel_status = req.body.rel_status;

        // Parse social links
        if (req.body.social_links) {
            try {
                updateData.social_links = typeof req.body.social_links === 'string'
                    ? JSON.parse(req.body.social_links)
                    : req.body.social_links;
            } catch (e) {
                // fallback
            }
        }

        if (!updateData.social_links) {
            updateData.social_links = {
                instagram: req.body.instagram || "",
                tiktok: req.body.tiktok || "",
                youtube: req.body.youtube || "",
                x: req.body.x || ""
            };
        }

        if (req.files) {
            if (req.files.avatar && req.files.avatar[0]) {
                updateData.avatar = req.files.avatar[0].path;
            }
            if (req.files.bg_photo && req.files.bg_photo[0]) {
                updateData.bg_photo = req.files.bg_photo[0].path;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-salt -hash");
        res.json({ success: true, user: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/post/:id/save", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const postId = req.params.id;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isSaved = user.saved && user.saved.some(id => id.toString() === postId);
        if (isSaved) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { saved: postId } });
            return res.json({ success: true, saved: false, message: "Post removed from saved list" });
        } else {
            await User.findByIdAndUpdate(req.user._id, { $push: { saved: postId } });
            return res.json({ success: true, saved: true, message: "Post saved successfully" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/saved", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await User.findById(req.user._id).populate({
            path: 'saved',
            populate: {
                path: 'owner',
                select: 'name avatar'
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const posts = [];
        const comments = await Comment.find({ comment_to: { $in: user.saved.map(p => p._id) } }).populate('comment_by', 'name avatar').sort({ createdAt: -1 });

        for (let post of user.saved) {
            if (!post) continue;
            const postObj = post.toObject();
            const like = await Like.findOne({ liked_by: req.user._id, liked_post: post._id });
            postObj.likedByMe = like ? true : false;
            postObj.likesCount = await Like.countDocuments({ liked_post: post._id });
            postObj.savedByMe = true;
            posts.push(postObj);
        }

        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ success: true, posts, comments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.json({ success: true, users: [] });
        }
        const users = await User.find({
            name: { $regex: query, $options: "i" }
        }).select("name avatar bio").limit(10).lean();

        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


app.listen(8080, () => {
    console.log("server is listening to port 8080")
})