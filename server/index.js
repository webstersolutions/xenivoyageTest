import path from 'path';
import http from 'http';
import express from 'express';
import compression from 'compression';
import fallback from 'express-history-api-fallback';
import https from 'https';
import fs from 'fs';

import './boot';

const __DEVELOPMENT__ = !['production', 'test'].includes(process.env.NODE_ENV);
const {
    APP_PORT,
} = process.env;

// SERVER CONFIGURATIONS
// =============================================================================

const app = express();
const server = new http.Server(app);
app.use(compression());
app.use('/', new express.Router());
app.use('/public', express.static(path.join(__dirname, '../public')));

if (__DEVELOPMENT__) {
    /* eslint-disable */
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../webpack/webpack.dev.config');
    /* eslint-enable */

    const compiler = webpack(config);

    app.use(webpackHotMiddleware(compiler));
    app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: { colors: true },
    }));

    app.use('*', (req, res, next) => {
        const filename = path.join(compiler.outputPath, 'index.html');
        compiler.outputFileSystem.readFile(filename, (err, result) => {
            if (err) return next(err);

            res.set('content-type', 'text/html');
            res.send(result);
            res.end();
        });
    });
} else {
    const root = path.join(__dirname, '../dist');

    app.use(express.static(root));
    app.use(fallback('index.html', { root }));
}

// START THE SERVER
server.listen(APP_PORT, () => (console.log(`===Server started on port ${APP_PORT}`)));

export default server;

