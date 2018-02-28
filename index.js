'use strict';

import express from 'express';
import kraken from 'kraken-js';
import http from 'http'
import bodyParser from 'body-parser';

var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */
        next(null, config);
    }
};

app = module.exports = express();
app.use(kraken(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.on('start', function () {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});

var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});



