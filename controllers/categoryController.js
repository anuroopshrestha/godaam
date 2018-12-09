const mongoose = require('mongoose');
const sharp = require('sharp');
const uuid = require('uuid');
const fs = require('fs');
const multer = require('multer');
const Store = mongoose.model('Store');

const imageHandler = require('../handlers/imageHandler');

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

exports.uploadPicture = multer(imageHandler.getMulterOptions({
  fileSize: 1
}))
  .single('image');

exports.catchUploadErrors = (err, req, res, next) => {
  if (err) {
    req.flash('error', err.message);
    res.redirect(`/store/${req.params.store}`);
  } else {
    next();
  }
};

exports.resizePicture = async (req, res, next) => {
  console.log('resize', req.body, req.file);
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

  imageResize.resize(250, 250);
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

exports.delCat = async (req, res) => {
  await Store.findByIdAndUpdate(
    { _id: req.params.store},
    {
      $pull: {
        categories: { _id: req.params.cat}
      }
    }
  );
  req.flash('success', 'Category deleted successfully');
  res.redirect(`/store/${req.params.store}`);
};
