const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    comment_to: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    comment: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Comment = mongoose.model('Comments', commentSchema);

module.exports = Comment;