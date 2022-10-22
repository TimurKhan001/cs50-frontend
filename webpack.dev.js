const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.config');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 9000,
        static: './dist',
        client: {
            progress: true,
        },
        allowedHosts: 'all',
        host: '0.0.0.0',
        historyApiFallback: true,
    },
    stats: {
        preset: 'errors-warnings',
        errorDetails: true,
        builtAt: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            BASE_URL: JSON.stringify('/'),
        }),
    ],
});
