const { resolve } = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = options => ({
    node: { fs: 'empty' },
    mode: options.mode,
    entry: options.entry,
    output: {
        path: resolve(__dirname, '../dist'),
        filename: 'main.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(jsx?)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|ico)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ],
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                    options: {}
                }
            },
            {
                test: /\.(eot|woff|woff2|ttf)([?]?.*)$/,
                use: 'file-loader',
            },
            {
                test: /\.s?css$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    resolve: {
        modules: [resolve(__dirname, '../src'), 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.json'],
    },
    plugins: options.plugins.concat([
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            filename: "./index.html",
            favicon: "./public/favIconXeni.png",
        }),
        new Dotenv({
            path: resolve(__dirname, '../.env'),
            systemvars: true,
        })
    ]),
    optimization: options.optimization,
});