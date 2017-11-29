/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import unirest = require('unirest');
import {Promise} from 'q';
import {ClientDataContext, ClientDataService} from "@themost/client"
import {Args,ResponseError} from "@themost/client/common";

const REG_DATETIME_ISO = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?([+-](\d+):(\d+))?$/;
function dateParser(key, value) {
    if ((typeof value === 'string') && REG_DATETIME_ISO.test(value)) {
        return new Date(value);
    }
    return value;
}

export class NodeDataContext extends ClientDataContext {
    constructor(base:string) {
        super(new NodeDataService(base || "/"));
    }
}

export class NodeDataService extends ClientDataService {

    /**
     * @param {string} base
     */
    constructor(base:string) {
        super(base);
    }

    execute(options):Promise<any> {
        return Promise((resolve, reject) =>{
            try {
                //options defaults
                options.method = options.method || "GET";
                options.headers = { ...this.getHeaders(), ...options.headers };
                //validate options URL
                Args.notNull(options.url,"Request URL");
                //validate URL format
                Args.check(!/^https?:\/\//i.test(options.url),"Request URL may not be an absolute URI");
                //validate request method
                Args.check(/^GET|POST|PUT|DELETE$/i.test(options.method),"Invalid request method. Expected GET, POST, PUT or DELETE.");
                //initialize unirest method e.g. unirest.get(URL), unirest.post(URL) etc.
                const requestURL = this.resolve(options.url);
                const request = unirest[options.method.toLowerCase()](requestURL);
                //set request type
                request.type("application/json");
                //set headers
                request.headers(options.headers);
                //set query params
                if (/^GET$/i.test(options.method) && options.data) {
                    request.query(options.data);
                }
                //or data to send
                else if (options.data) {
                    request.send(options.data);
                }
                //complete request
                request.end(function (response) {
                    if (response.status === 200) {
                        if ((typeof response.raw_body === 'string') && response.raw_body.length>0) {
                            resolve(JSON.parse(response.raw_body, dateParser));
                        }
                        else {
                            resolve();
                        }
                    }
                    else {
                        var res = response.toJSON();
                        if (typeof res.body === 'object') {
                            const err = (<any>Object).assign(new ResponseError(res.body.message || response.statusMessage, response.status),res.body);
                            if (err.hasOwnProperty("status")) {
                                //delete status because of ResponseError.statusCode property
                                delete err.status;
                            }
                            return reject(err);
                        }
                        return reject(new ResponseError(response.statusMessage, response.status));
                    }
                });
            }
            catch(err) {
                reject(err);
            }
        });
    };

}