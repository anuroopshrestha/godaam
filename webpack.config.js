/*
  Okay folks, want to learn a little bit about webpack?
*/

const path = require('path');
const webpack = require('webpack');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/*
  webpack sees every file as a module.
  How to handle those files is up to loaders.
  We only have a single entry point (a .js file) and everything is required from that js file
*/

// This is our JavaScript rule that specifies what to do with .js files
const javascript = {
    test: /\.(js)$/, // see how we match anything that ends in `.js`? Cool
    use: [{
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env'] } // this is one way of passing options
    }]
};

// We can also use plugins - this one will compress the crap out of our JS
const uglify = new webpack.optimize.UglifyJsPlugin({ // eslint-disable-line
    compress: { warnings: false }
});

// OK - now it's time to put it all together
const config = {
    entry: {
    // we only have 1 entry, but I've set it up for multiple in the future
        portalscripts: './public/js/thescripts.js'
    },
    // we're using sourcemaps and here is where we specify which kind of sourcemap to use
    devtool: 'source-map',
    // Once things are done, we kick it out to a file.
    output: {
    // path is a built in node module
    // __dirname is a variable from node that gives us the
        path: path.resolve(__dirname, 'public', 'dist/js'),
        // we can use "substitutions" in file names like [name] and [hash]
        // name will be `App` because that is what we used above in our entry
        filename: '[name].bundle.js'
    },

    // remember we said webpack sees everthing as modules and how different loaders are responsible for different file types? Here is is where we implement them. Pass it the rules for our JS and our styles
    module: {
        rules: [javascript]
    },
    // finally we pass it an array of our plugins - uncomment if you want to uglify
    plugins: [uglify]
    // plugins: [
    // // here is where we tell it to output our css to a separate file
    //     new UglifyJSPlugin()
    // ]
};
// webpack is cranky about some packages using a soon to be deprecated API. shhhhhhh
process.noDeprecation = true;

module.exports = config;
