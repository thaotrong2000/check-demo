require('dotenv').config();
const path = require("path");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const dotenv = require('dotenv').config( {
  path: path.join(__dirname, '.env')
});

var mode = "production";
var exportDir = "public/js";
// default entry, bundle all every environment
var entries = {
    'index': path.resolve(__dirname, "src/index.js"),
};

if(process.env.APP_ENV === 'production'){
    const encodedPublisherId = process.env.ENCODED_PUBLISHER_ID;
    if (!encodedPublisherId) {
        throw new Error("Missing ENCODED_PUBLISHER_ID in .env");
    }

    // build and put bundled file into Production Folder
    mode = "production";
    exportDir = "";
    entries = {
        [`Published-Masoffer-Popup-Script/${encodedPublisherId}/index.min`]: path.resolve(__dirname, "src/index.js"),
        'public/js/index.min': path.resolve(__dirname, "src/index.js"),
    };
}

if(process.env.APP_ENV === 'local'){
    mode = "none";
}

if(process.env.APP_ENV === 'dev'){
    mode = "development";
}

module.exports = {
    mode: mode,
    entry: entries,
    output: {
        path: path.resolve(__dirname, exportDir),
        filename: "[name].js",
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
        }, ],
    },
    plugins: [
        new webpack.DefinePlugin( {
            "process.env": JSON.stringify(dotenv.parsed)
        } ),
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin({
            uglifyOptions: {
                warnings: false,
                parse: {},
                compress: {},
                mangle: true,
                output: null,
                toplevel: false,
                nameCache: null,
                ie8: false,
                keep_fnames: false,
              },
        })],
    }
}