var express = require("express");
const passport = require("passport");
var router = express.Router();

const userModel = require('./users');
const postModel = require('./post')
const localStrategy  = require('passport-local')
const upload = require('./multer')

passport.use(new localStrategy(userModel.authenticate()));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/", (req, res) => {
  res.render("index", {nav: false});
});

router.get("/profile", isLoggedIn, async(req, res) => {
  const user = await userModel.findById(req.user._id).populate('posts')
  res.render("profile", {user, nav: true});
});

router.get("/register", function (req, res, next) {
  res.render("register", {nav : false});
});
router.get("/login", function (req, res, next) {
  res.render("index", {nav: false});
});


router.post("/profileUpload", isLoggedIn,  upload.single('profileImage') , async (req,res,next) => {
  const user = await userModel.findOne({username : req.session.passport.user});
  user.profileImage  = req.file.filename;
  await user.save();
  res.redirect("/profile");
})


router.post('/uploadData', isLoggedIn, upload.single('contentImage'), async (req,res) => {
  let user = req.user
  const {title, content, bio } = req.body

  const postData = await postModel.create({
    user: user._id,
    postTitle : title,
    postDes: content,
    imageUrl: req.file.filename,
  })

  user.posts.push(postData._id)
  user.bio = bio
  await user.save()
  res.redirect("/profile")

})

router.post("/register", async (req, res) => {
  const userData = new userModel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    bio: req.body.bio,
  });

  userModel.register(userData, req.body.password).then((registereduser) => {
    passport.authenticate("local")(req, res, () => {
      // req.flash("success", "Registration successful! You are now logged in.");
      res.redirect("/login");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    // session: true  // session is kept alive until you explicitly log out.
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
