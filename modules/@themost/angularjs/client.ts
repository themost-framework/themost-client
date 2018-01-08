/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import {DataServiceExecuteOptions,Args,ClientDataContextOptions} from "@themost/client/common";
import {ClientDataService, ClientDataContext} from "@themost/client";

const REG_DATETIME_ISO = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?([+-](\d+):(\d+))?$/;
function dateParser(key, value) {
    if ((typeof value === 'string') && REG_DATETIME_ISO.test(value)) {
        return new Date(value);
    }
    return value;
}

export class AngularDataContext extends ClientDataContext {
    constructor(base:string, http:any, q:any, options?:ClientDataContextOptions) {
        super(new AngularDataService(base || "/", http, q, options));
    }
}

export class AngularDataService extends ClientDataService {

    private http;
    private q;

    /**
     *
     * @param {string} base
     * @param {*} http
     * @param {*} q
     * @param {ClientDataContextOptions} options
     */
    constructor(base:string, http:any, q:any, options?:ClientDataContextOptions) {
        super(base, options);
        this.http = http;
        this.q = q;
    }

    execute(options:DataServiceExecuteOptions):Promise<any> {

        const $http = this.http;
        const $q = this.q;
        return $q((resolve, reject) => {
            try {
                //options defaults
                options.method = options.method || "GET";
                options.headers = { ...this.getHeaders(), ...options.headers };
                //set content type
                options.headers["Content-Type"] = "application/json";
                //validate options URL
                Args.notNull(options.url,"Request URL");
                //validate URL format
                Args.check(!/^https?:\/\//i.test(options.url),"Request URL may not be an absolute URI");
                //validate request method
                Args.check(/^GET|POST|PUT|DELETE$/i.test(options.method),"Invalid request method. Expected GET, POST, PUT or DELETE.");
                const url_ = this.resolve(options.url);
                const o = {
                    method: options.method,
                    url: url_,
                    headers:options.headers,
                    transformResponse:(data, headers, status) => {
                        if (typeof data === 'undefined' || data === null) {
                            return;
                        }
                        if (/^application\/json/.test(headers("Content-Type"))) {
                            if (data.length === 0) {
                                return;
                            }
                            return JSON.parse(data, dateParser);
                        }
                        return data;
                    }
                };
                if (/^GET$/i.test(o.method)) {
                    o["params"] = options.data;
                }
                else {
                    o["data"] = options.data;
                }
                $http(o).then((response) => {
                    resolve(response.data);
                }, function (err) {
                    reject(err);
                });
            }
            catch(err) {
                reject(err);
            }
        });

    }

}