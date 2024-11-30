const multer = require("multer");
const { diskStorage } = multer;
const path = require("path");
const fs = require("fs");

// --- Storage Configuration ---
const storage = diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../temp");

    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      console.error("Error creating upload directory:", err);
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(
      /[^a-zA-Z0-9_.-]/g,
      "_"
    );
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  },
});

// --- Multer Instance ---
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Optional: 10MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    console.log("File MIME Type:", file.mimetype); // Log MIME type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
  
});

// Named export (not default)
module.exports = upload;
