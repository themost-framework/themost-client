/**
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
const {getApplication, serveApplication, getServerAddress} = require('@themost/test');
const { URL } = require('url');
function serveKarmaTestApiServer(proxies) {
    const app = getApplication();
    return serveApplication(app).then( function(liveServer) {
        const serverAddress = getServerAddress(liveServer);
        Object.assign(proxies, {
            '/api/': new URL('/api/', serverAddress).toString(),
            '/auth/': new URL('/auth/', serverAddress).toString()
        });
    });
}

serveKarmaTestApiServer.$inject = ['config.proxies'];

module.exports =  {
    'framework:api': [
        'factory',
        serveKarmaTestApiServer
    ]
};
