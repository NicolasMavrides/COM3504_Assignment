const mongoose = require('../databases/comments');

const CommentSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    }
});

const Comment = mongoose.commentsCon.model('Comment', CommentSchema);

module.exports = Comment;