import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const route = path.join(import.meta.dirname, "..", "public", "uploads");
    if (!fs.existsSync(route)) {
      fs.mkdirSync(route, { recursive: true });
    }
    cb(null, route);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const uploadFile = multer({ storage });

export default uploadFile;
