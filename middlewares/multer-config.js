const multer = require("multer");

console.log("Multer config is running");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads"); // Specify the directory where you want to save the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); //Specify the file name of the uploaded file (on frontend Date.now() + file.originalname)
    },
});

const upload = multer({
    storage: storage,
});

module.exports = upload;
