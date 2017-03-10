// app/models/post.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    date: Date,
    title: String,
    story: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    country: {
        id: Number,
        name: String
    },
    state: {
        id: Number,
        name: String
    },
    image: {
        link: String,
        safelink: String,
        filename: String,
        mime: String,
        originalname: String,
        size: Number,
        thumbnail: String
    }
},
{
  timestamps: true
});

// create the model for posts and expose it to our app
module.exports = mongoose.model('Post', postSchema);
