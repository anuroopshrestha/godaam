const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');
const uuid = require('uuid');
const fs = require('fs');
const Store = mongoose.model('Store');

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

exports.addCategory = async (req, res) => {
  await Store.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        categories: req.body
      }
    },
    { new: true, runValidators: true }
  );
  req.flash('success', 'Category has been added successfully.');
  res.redirect(`/store/${req.params.id}`);
};

exports.editCategoryModal = async (req, res) => {
  const store = await Store.findById(req.params.store);
  const selectedCategory = store.categories.filter((category) => {
    return category._id.equals(req.params.cat);
  });
  res.render('stores/modalForms/editCat', { title: 'Edit Category', store, category: selectedCategory[0] });
};

exports.uploadPicture = multer(multerOptions).single('image');

exports.resizePicture = async (req, res, next) => {

  if (!req.file) {
    next();
    return;
  }

  const store = await Store.findOne({ _id: req.params.store });
  // check user temp directory
  const userDirExists = fs.existsSync(`./public/uploads/${store.slug}`);
  if (!userDirExists) {
    fs.mkdirSync(`./public/uploads/${store.slug}`);
  }

  const photoName = `${uuid.v4()}-${Date.now()}`;
  const extension = req.file.mimetype.split('/')[1];
  const imageResize = sharp(req.file.buffer);

  imageResize.resize(32, 32);
  await imageResize.toFile(`./public/uploads/${store.slug}/${photoName}.${extension}`);

  req.body.catImage = `${photoName}.${extension}`;

  next();
};

exports.saveCategory = async (req, res) => {
  await Store.findOneAndUpdate(
    { _id: req.params.store, 'categories._id': req.params.cat },
    {
      $set: {
        'categories.$.name': req.body.name,
        'categories.$.parent': req.body.parent,
        'categories.$.identifier.image': req.body.catImage,
        'categories.$.identifier.color': req.body.identifier.color
      }
    }
  );
  req.flash('success', 'Category updated successfully');
  res.redirect(`/store/${req.params.store}`);
};
