// const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// eslint-disable-next-line no-unused-vars
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
    // alias: {
    //   components: path.resolve(__dirname, 'src/components'),
    // },
  },
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              compact: true,
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\/node_modules\//,
        use: [
          // 'MiniCssExtractPlugin.loader,'
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          // 'MiniCssExtractPlugin.loader,'
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                math: 'always',
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              context: 'src',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  stats: {
    children: false,
    modules: false,
  },
  performance: {
    hints: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: 'public',
      },
    ]),
    new CleanWebpackPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      ignoreOrder: true,
    }),
  ],
  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    useLocalIp: true,
    host: '0.0.0.0',
    proxy: {
      target: 'http://localhost:3000',
      pathRewrite: { '^/api': '' },
    },
    // proxy: [{
    //   context: ['/api', '/cas'],
    //   target: 'http://localhost:8098/',
    //   pathRewrite: {
    //     '^/api': '',
    //   },
    // }],
    stats: {
      children: false,
      modules: false,
    },
    hot: true,
  },
};
