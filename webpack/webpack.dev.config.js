const webpack = require('webpack');

module.exports = require('./webpack.base.config')({
    node: { fs: 'empty' },
    mode: 'development',
    entry: {
        app: [
            "@babel/polyfill",
            'webpack-hot-middleware/client',
            'index.js',
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    optimization: {
        namedModules: true,
        noEmitOnErrors: true,
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
});