const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postTitle: String,
  postDes: String,
  imageUrl: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

module.exports = mongoose.model('Post', postSchema);
