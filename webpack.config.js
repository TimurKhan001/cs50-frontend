const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        embed: './src/embed.js',
        app: ['./src/index.jsx'],
    },
    resolve: {
        extensions: [
            '*',
            '.js',
            '.jsx',
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {static: './dist'},
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.ejs',
            inject: false,
            chunks: ['embed'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/assets/images',
                    to: 'images',
                    noErrorOnMissing: true,
                },
            ],
        }),
        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules|bower_components|vendor/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules|bower_components|vendor/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: !isProduction ? '[name]-[local]--[hash:base64:6]' : '[hash:base64:8]',
                            },
                            importLoaders: 1,
                        },
                    },
                    'postcss-loader',
                ],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
};
