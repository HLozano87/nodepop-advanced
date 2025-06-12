import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    const upload = multer({dest: 'public/uploads'})
    const route = path.join(import.meta.dirname,'..', 'public', 'uploads')
    cb(null, route);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});


const uploadFile = multer({ storage });

export default uploadFile;
