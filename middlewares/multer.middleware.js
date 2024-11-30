const multer = require("multer");
const { diskStorage } = multer;
const path = require("path");
const fs = require("fs");

// --- Storage Configuration ---
const storage = diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = "/tmp"; // Use /tmp for temporary storage in Vercel

    try {
      await fs.promises.mkdir(uploadDir, { recursive: true }); // Ensure directory exists
      cb(null, uploadDir); // Pass the directory to multer
    } catch (err) {
      console.error("Error creating upload directory:", err);
      cb(err); // Pass error to multer
    }
  },

  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(
      /[^a-zA-Z0-9_.-]/g,
      "_"
    ); // Sanitize file name
    cb(null, `${Date.now()}-${sanitizedFilename}`); // Add timestamp to avoid conflicts
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
      return cb(new Error("Invalid file type")); // Reject invalid files
    }
    cb(null, true); // Accept valid files
  },
});

// Named export (not default)
module.exports = upload;
