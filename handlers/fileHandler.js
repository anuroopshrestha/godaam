const fs = require('fs');

exports.checkDirectory = (directory, callback) => {
  fs.stat(directory, function(err) {
    // Check if error defined and the error code is "not exists"
    if (err && err.errno === 34) {
      // Create the directory, call the callback.
      fs.mkdir(directory, callback);
    } else {
      // just in case there was a different error:
      callback(err);
    }
  });
};
