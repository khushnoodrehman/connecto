const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['Accepted', 'Declined', 'Pending'],
    },
    created_At: {
        type: Date,
        default: new Date(Date.now()),
    }
});

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;