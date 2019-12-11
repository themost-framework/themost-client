/**
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import fetch from 'node-fetch';
import {ClientDataContextOptions, ClientDataContext, ClientDataService, EdmSchema} from '@themost/client';
import {Args, ResponseError} from '@themost/client';
import {URL, URLSearchParams} from 'url';
// tslint:disable max-line-length
const REG_DATETIME_ISO = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?([+-](\d+):(\d+))?$/;
// tslint:enable max-line-length
function dateParser(key, value) {
    if ((typeof value === 'string') && REG_DATETIME_ISO.test(value)) {
        return new Date(value);
    }
    return value;
}

export class NodeDataContext extends ClientDataContext {

    constructor(base: string, options?: ClientDataContextOptions) {
        super(new NodeDataService(base || '/', options));
    }
}

export class NodeDataService extends ClientDataService {

    /**
     * @param {string} base
     * @param {ClientDataContextOptions} options
     */
    constructor(base: string, options?: ClientDataContextOptions) {
        super(base, options);
    }

    public getMetadata(): Promise<EdmSchema> {
        const headers = this.getHeaders();
        return fetch(this.resolve('$metadata'), {
            headers: {
                ...headers,
                ... {
                    'Accept': 'application/xml',
                    'Content-Type': 'application/xml'
                }
            }
        }).then((response) => {
            if (response.ok) {
                return response.text().then( (result) => {
                    return EdmSchema.loadXML(result);
                });
            }
            throw new ResponseError(response.statusText, response.status);
        });
    }

    public execute(options: any): Promise<any> {
            try {
                // options defaults
                const method = options.method || 'GET';
                const headers = { ...this.getHeaders(), ... {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }, ...options.headers };
                // validate options URL
                Args.notNull(options.url, 'Request URL');
                // validate URL format
                Args.check(!/^https?:\/\//i.test(options.url), 'Request URL may not be an absolute URI');
                // validate request method
                Args.check(/^GET|POST|PUT|DELETE$/i.test(options.method), 'Invalid request method. Expected GET, POST, PUT or DELETE.');
                // create request info
                const requestInfo = new URL(this.resolve(options.url));
                let requestInit;
                if (/^GET$/i.test(method)) {
                    if (options.data) {
                        const searchParams = new URLSearchParams(options.data);
                        searchParams.forEach((value, name) => {
                            requestInfo.searchParams.append(name, value);
                        });
                    }
                    requestInit = {
                        method,
                        headers
                    };
                } else {
                    requestInit = {
                        method,
                        headers,
                        body: options.data
                    };
                }
                // execute request
                return fetch(requestInfo, requestInit)
                    .then( (res) => {
                        if (res.ok) {
                            return res.text();
                        } else {
                            return res.json().then( (body) => {
                                const err = (Object as any).assign(new ResponseError(body.message || res.statusText, res.status), body);
                                // tslint:enable max-line-length
                                if (err.hasOwnProperty('status')) {
                                    // delete status because of ResponseError.statusCode property
                                    delete err.status;
                                }
                                return Promise.reject(err);
                            });
                        }
                    })
                    .then( (body) => {
                        return JSON.parse(body, dateParser);
                    });
            } catch (err) {
                return Promise.reject(err);
            }
    }

}
