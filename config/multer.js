const multer = require('multer');

const upload = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) =>{
        callback(null, Date.now() + '-' + file.originalname);
    }
});


module.exports = upload; 