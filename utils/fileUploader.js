const _ = require("lodash");
const cloudinaryConfig = require("../config/cloudinaryConfig.js");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Call cloudinaryConfig
cloudinaryConfig();

async function imageUpload(imageFiles) {
  let imagePathArray = [];

  const uploadDir = path.join(__dirname, "../tmp");

  // Create the uploads directory if it does not exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  for (const file of imageFiles) {
    const filePath = path.join(uploadDir, file.filename);

    try {
      // Upload the image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: "famliya",
        resource_type: "auto",
      });
      imagePathArray.push(uploadResult.secure_url);

      // Delete the file from the uploads folder
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error("Error uploading file:", error);
      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }
  }

  return imagePathArray;
}

const handleFileUploads = async (
  files,
  fileType,
  key,
  dataToSave,
  array = false
) => {
  if (files[fileType]) {
    const filePaths = [];

    const fileArray = Array.isArray(files[fileType][0])
      ? files[fileType][0]
      : files[fileType];

    const validFiles = fileArray.filter((file) => file && file.path);
    if (validFiles.length !== fileArray.length) {
      console.warn(
        `Some files are missing paths or invalid for fileType: ${fileType}`
      );
    }

    const uploadPromises = validFiles.map((file) => imageUpload([file]));
    const results = await Promise.all(uploadPromises);

    results.forEach((result) => {
      if (result.length > 0) {
        filePaths.push(result[0]);
      }
    });

    if (filePaths.length > 0) {
      if (array) {
        const existingArray = _.get(dataToSave, key, []);
        _.set(dataToSave, key, [...existingArray, ...filePaths]);
      } else if (filePaths.length > 1) {
        _.set(dataToSave, key, filePaths);
      } else {
        _.set(dataToSave, key, filePaths[0]);
      }
    }
  } else if (fileType === "none") {
    const fallbackFiles = Object.values(files).flat();
    if (fallbackFiles.length > 0) {
      const fallbackUploadPromises = fallbackFiles.map((file) =>
        imageUpload([file])
      );
      const fallbackResults = await Promise.all(fallbackUploadPromises);

      const fallbackFilePaths = fallbackResults
        .filter((result) => result.length > 0)
        .map((result) => result[0]);

      if (fallbackFilePaths.length > 0) {
        if (array) {
          const existingArray = _.get(dataToSave, key, []);
          _.set(dataToSave, key, [...existingArray, ...fallbackFilePaths]);
        } else if (fallbackFilePaths.length > 1) {
          _.set(dataToSave, key, fallbackFilePaths);
        } else {
          _.set(dataToSave, key, fallbackFilePaths[0]);
        }
      }
    } else {
      console.warn(`No fallback files available to upload for key: ${key}`);
    }
  }
};

module.exports = { handleFileUploads };
