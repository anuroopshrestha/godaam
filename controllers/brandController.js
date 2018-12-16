const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const sharp = require('sharp');
const uuid = require('uuid');
const fs = require('fs');
const imageHandler = require('../handlers/imageHandler');

exports.addBrand = async (req, res) => {
  await Store.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        brands: req.body
      }
    },
    { new: true, runValidators: true }
  );
  req.flash('success', 'Brand has been added successfully');
  res.redirect(`/store/${req.params.store}`);
};

exports.editBrandModal = async (req, res) => {
  const store = await Store.findById(req.params.store);
  const selectedBrand = store.brands.filter((brand) => {
    return brand._id.equals(req.params.brand);
  });
  res.render('stores/modalForms/editBrand', { title: 'Edit brand', store, brand: selectedBrand[0] });
};

exports.uploadBrandImg = multer(imageHandler.getMulterOptions({
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

exports.resizeBrandImg = async (req, res, next) => {
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

  req.body.image = `${photoName}.${extension}`;

  next();
};

exports.saveBrand = async (req, res) => {
  await Store.findOneAndUpdate(
    { _id: req.params.store, 'brands._id': req.params.brand },
    {
      $set: {
        'brands.$.name': req.body.name,
        'brands.$.image': req.body.image
      }
    }
  );
  req.flash('success', 'Brand updated successfully');
  res.redirect(`/store/${req.params.store}`);
};

exports.delBrand = async (req, res) => {
  await Store.findByIdAndUpdate(
    { _id: req.params.store},
    {
      $pull: {
        brands: { _id: req.params.brand}
      }
    }
  );
  // todo update products
  req.flash('success', 'Brand deleted successfully');
  res.redirect(`/store/${req.params.store}`);
};
