const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const VENDOR_LIBS = [
  'react', 'react-dom'
];

module.exports = {
  context: `${__dirname}/src`,

  entry: {
    bundle: './index.jsx',
    vendor: VENDOR_LIBS
  },

  devtool: 'inline-source-map',

  output: {
    path: `${__dirname}/dist`,
    filename: '[name].[chunkhash].js',
  },

  devtool: 'inline-source-map',

  devServer: {
    contentBase: `${__dirname}/src/`,
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                sourceMap: true,
                localIdentName: '[path]--[name]-[local]--[hash:base64:5]',
              },
            }],
        }),
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new Dotenv()
  ]
};
