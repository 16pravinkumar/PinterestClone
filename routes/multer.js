const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Images/UserFiles");
  },
  filename: (req, file, cb) => {
    let uniqueFileName = uuidv4();
    cb(null, uniqueFileName + path.extname(file.originalname));
  },
});

module.exports = multer({ storage: storage });
