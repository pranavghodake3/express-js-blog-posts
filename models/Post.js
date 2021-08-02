const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: String,
    content: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogUser' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
