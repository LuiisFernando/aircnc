const multer = require('multer');
const path = require('path');

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            // fieldname is the orignal name of file sent, date.now() timeStamp of current date
            // extname is the extension of the file of original name

            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);

            cb(null, `${name}-${Date.now()}${ext}`)
        },
    }),
};