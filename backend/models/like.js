const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    liked_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    liked_post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;