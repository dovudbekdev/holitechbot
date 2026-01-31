const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("cloudinary").v2;

// Cloudinary konfiguratsiyasi
cloudinary.config({
    cloud_name: "drqsvaf78",
    api_key: "672144297336588",
    api_secret: "m0V60scNyETn7x1Lm7NhykTIpCY",
});


// Multer uchun Cloudinary storage ni sozlash
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "launchpro", // Cloudinarydagi papka nomi
        format: async (req, file) => {
            const ext = file.mimetype.split("/")[1];
            const allowedFormats = ["jpg", "jpeg", "png", "webp"];
            if (allowedFormats.includes(ext)) {
                return ext;
            } else {
                throw new Error("Fayl formati ruxsat etilmagan");
            }
        },
        public_id: (req, file) => file.originalname.split(".")[0], // Fayl nomi
    },
});

const upload = multer({ storage: storage });

module.exports = upload;

// const multer = require("multer");
// const md5 = require("md5");
// const path = require("path");

// const uploadSingleMiddleware = (req, res, next) => {
//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, path.join(__dirname, "../../img/uploads"));
//         },
//         filename: (req, file, cb) => {
//             cb(null, md5(file.originalname) + path.extname(file.originalname));
//         },
//     });

//     const upload = multer({
//         storage,
//         limits: {
//             fileSize: 10 * 2 * 1024 * 1024,
//         },
//     }).single("image");

//     try {
//         upload(req, res, (err) => {
//             if (err) {
//                 res.status(400).json({
//                     ok: false,
//                     message: err + "",
//                 });
//                 return;
//             }
//             next();
//         });
//     } catch (e) {
//         res.status(400).json({
//             ok: false,
//             message: e + "",
//         });
//         return;
//     }
// };

// module.exports = uploadSingleMiddleware;
