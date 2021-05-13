"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var path = require("path");

var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./client/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  module: {
    rules: [{
      test: /\.jsx?/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      }
    }, {
      test: /\.s[ac]ss$/i,
      use: [// Creates `style` nodes from JS strings
      "style-loader", // Translates CSS into CommonJS
      "css-loader", // Compiles Sass to CSS
      "sass-loader"]
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      type: "asset"
    }]
  },
  plugins: [new HtmlWebpackPlugin({
    template: "index.html"
  })],
  devtool: "eval-source-map",
  devServer: {
    publicPath: "/build",
    proxy: _defineProperty({
      //SUPER IMPORTANT
      "/**": "http://localhost:3000",
      "/": "http://localhost:3000"
    }, "/", "http://localhost:3000"),
    hot: true,
    historyApiFallback: true
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  }
};