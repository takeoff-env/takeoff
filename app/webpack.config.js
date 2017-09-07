const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DIST_URL = 'dist';

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './public/index.html',
    inject: true
});

const HotModuleReplacementPluginConfig = new webpack.HotModuleReplacementPlugin();

module.exports = {
    name: 'app',
    target: 'web',
    devtool: 'source-map',
    entry: ['babel-polyfill', 'react-hot-loader/patch', './src/index.js'],
    output: {
        path: path.resolve(DIST_URL),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: ['react-hot-loader/webpack', 'babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|^(?!.*\.inline\.svg$).*\.svg$/,
                loader: 'url-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        HtmlWebpackPluginConfig,
        HotModuleReplacementPluginConfig,
        new webpack.DefinePlugin({
            REDUX_DEV_TOOLS: process.env.REDUX_DEV_TOOLS === 'true' || false,
            NODE_ENV: process.env.NODE_ENV || 'development'
        })
    ],
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, DIST_URL),
        publicPath: '/',
        historyApiFallback: true,
        disableHostCheck: true
    }
};
