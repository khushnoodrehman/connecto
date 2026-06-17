const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: String,
    bg_photo: String,
    bio: String,
    rel_status: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'In a relationship']
    },
    social_links: {
        instagram: String,
        tiktok: String,
        youtube: String,
        x: String
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'custom'],
        required: true
    },
    dob: {
        type: Date,
        required: true,
    },
    created_At: {
        type: Date,
        default: new Date(Date.now()),
    },
    saved: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: []
    }]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;