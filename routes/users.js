const mongoose = require("mongoose");
const passport = require("passport");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/PinterestDB");

const userSchema = mongoose.Schema({
  username: String,
  fullname: String,
  email: String,
  password: String,
  profileImage: String,
  bio: {
    type : String,
    default: ""
  },
  boards: {
    type: Array,
    default: [],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

mongoose.plugin(plm);

module.exports = mongoose.model("User", userSchema);
