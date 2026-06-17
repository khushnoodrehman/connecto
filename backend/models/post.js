const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        trim: true
    },
    media: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

postSchema.pre("validate", function (next) {
    if (!this.description && !this.file) {
        this.invalidate("description", "Either description or file is required.");
        this.invalidate("file", "Either description or file is required.");
    }
    next();
});

module.exports = Post;
