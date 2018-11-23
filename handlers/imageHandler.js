// const sharp = require('sharp');
// const uuid = require('uuid');
const multer = require('multer');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'The image you uploaded is invalid' }, false);
    }
  }
};

exports.getMulterOptions = (params) => {
  return {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
      const isPhoto = file.mimetype.startsWith('image/');
      if (isPhoto) {
        next(null, true);
      } else {
        next({ message: 'The image you uploaded is invalid' }, false);
      }
    },
    limits: {
      fileSize: params.fileSize * 1000000
    }
  };
};

exports.uploadImage = (fieldName) => {
  multer(multerOptions).single(fieldName);
  return (req, res, next) => {
    console.log(req.body);
    next();
  };
};
