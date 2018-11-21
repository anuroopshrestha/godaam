const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.getAllStores = async () => {
  const stores = await Store.find();
  return stores;
};

exports.getStoreByUserID = async (id) => {
  const stores = await Store
    .find({ users: id });
  return stores;
};
