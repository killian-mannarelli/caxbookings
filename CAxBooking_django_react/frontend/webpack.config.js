const path = require("path");
const webpack = require("webpack");
require('dotenv').config({ path: 'src/.env' }); 


module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {

        test: /\.css$/,

        use: ['style-loader', 'css-loader'],

      },

      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.DefinePlugin({
      'process.env.PRODIP': JSON.stringify(process.env.PRODIP),
    }),

  ]
};