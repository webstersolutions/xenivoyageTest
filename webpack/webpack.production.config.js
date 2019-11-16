const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = require('./webpack.base.config')({
    node: { fs: 'empty' },
    mode: 'production',
    entry: {
        app: [
            "@babel/polyfill",
            'index.js',
        ],
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                exclude: /node_modules/,
                parallel: 4,
                terserOptions: {
                    warnings: true,
                    compress: {
                        hoist_funs: true,
                        sequences: true,
                        dead_code: true,
                        conditionals: true,
                        booleans: true,
                        unused: true,
                        if_return: true,
                        join_vars: true,
                        drop_console: false,
                        comparisons: true,
                        loops: true,
                        drop_debugger: true,
                        warnings: false,
                    },
                    comments: false,
                    minimize: false,
                    sourceMap: true,
                },
            }),
        ],
        splitChunks: {
            // minSize: 10000,
            // maxChunks: 15,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial',
                },
            },
        },
    },
    plugins: [
        new OptimizeCssAssetsPlugin(),
        new CleanWebpackPlugin(),
        new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 2,
            minSize: 10000,
            maxSize: 30000,
            moveToParents: true,
        }),
    ],
});
