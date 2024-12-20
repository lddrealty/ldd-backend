const cloudinary = require("cloudinary").v2;
const _ = require("lodash");

const extractPublicId = (url) => {
  const regex = /\/([^/]+)\.[^/]+$/; // Adjust regex if you have other formats
  const match = url.match(regex);
  return match ? match[1] : null; // Return the public ID or null if not found
};

const deleteCloudinaryImage = async (publicId) => {
  try {
    const result = await cloudinary.api.delete_resources([`ldd/${publicId}`], {
      type: "upload",
      resource_type: "image",
    });
    console.log("Delete Result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

const handleFileRemovalAndUploads = async (
  dataToSave,
  { filesToRemove, arrayTargetKeys = [], stringTargetKeys = [] }
) => {
  let filesToRemoveArray = [];

  if (filesToRemove) {
    if (_.isString(filesToRemove)) {
      try {
        const parsed = JSON.parse(filesToRemove);
        filesToRemoveArray = _.castArray(parsed);
      } catch (e) {
        filesToRemoveArray = [filesToRemove];
      }
    } else if (_.isArray(filesToRemove)) {
      filesToRemoveArray = _.clone(filesToRemove);
    } else {
      filesToRemoveArray = _.castArray(filesToRemove);
    }
  }

  if (filesToRemoveArray.length > 0) {
    const deletionPromises = [];
    const removedFiles = [];

    for (const file of filesToRemoveArray) {
      const publicId = extractPublicId(file);
      if (publicId) {
        deletionPromises.push(deleteCloudinaryImage(publicId));
        removedFiles.push(file);
      }
    }

    await Promise.all(deletionPromises);

    arrayTargetKeys.forEach((key) => {
      const existingFiles = _.get(dataToSave, key, []);
      _.set(
        dataToSave,
        key,
        existingFiles.filter((file) => !removedFiles.includes(file))
      );
    });

    stringTargetKeys.forEach((key) => {
      const existingFile = _.get(dataToSave, key, null);
      if (removedFiles.includes(existingFile)) {
        _.set(dataToSave, key, null);
      }
    });
  }
};

module.exports = handleFileRemovalAndUploads;
