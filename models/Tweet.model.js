const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
    twitterUserId: { type: String, required: true, index: true },
    created_at: { type: String, required: true },
    id: { type: Number, required: true, unique: true },
    text: { type: String, required: true },
    hashtags: [{ type: String }],
    urls: [{ url: String, expandedURL: String, displayURL: String }],
    user: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        screen_name: { type: String, required: true },
        location: { type: String },
    },
    location: { type: String },
});

module.exports = mongoose.model('Tweet', schema);
