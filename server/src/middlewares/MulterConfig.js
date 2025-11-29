const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const MAX_FILE_SIZE =2*1024 * 1024  // 2mb

// MULTER DISK STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    console.log(file);
    const encryptedUserId = crypto
      .createHash("md5")
      .update(req.user.id)
      .digest("hex");
    const filename = encryptedUserId + path.extname(file.originalname);
    cb(null, filename);
  },
});

// ONLY ALLOWING JPEG,JPG,PNG IMAGES 
function customFileFilter(req, file, cb) {
    const isValidFileType = {
      "image/png": "png",
      "image/jpeg": "jpeg",
      "image/jpg": "jpg",
    }[file.mimetype];

    if (isValidFileType) {
      cb(null, true);
    } else {
      cb(
        new multer.MulterError( 
          "Only jpg, jpeg, png images can be uploaded." // RECEIVED IN ERROR.CODE
        ),
        false
      );
    }
  }

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }, // 2MB FILESIZE
  fileFilter: customFileFilter
});
const handleSingleImageUpload = (req,res,next)=>{
  upload.single('profile')(req,res,err=>{
    if(err instanceof multer.MulterError){
      if(err.code === "LIMIT_FILE_SIZE"){
        return res.status(400).json({success:false,message:err.message})
      }
      return res.status(400).json({success:false,message:err.code})
    }
    next();
  })
}
module.exports = { handleSingleImageUpload };
