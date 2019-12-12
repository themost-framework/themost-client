/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import {Injectable, Inject, InjectionToken} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ClientDataService, ClientDataContext, Args, DataServiceExecuteOptions,
    TextUtils, ClientDataContextOptions, EdmSchema} from '@themost/client';

export interface ClientDataContextConfig {
    base: string;
    options: ClientDataContextOptions;
}

export const DATA_CONTEXT_CONFIG = new InjectionToken<ClientDataContextConfig>('data.config');

@Injectable()
export class AngularDataContext extends ClientDataContext {

    constructor(http: HttpClient, @Inject(DATA_CONTEXT_CONFIG) config: ClientDataContextConfig) {
        super(new AngularDataService(config.base, http, config.options), config.options);
    }
}

/**
 * The default JSON reviver which converts an ISO date string to Date object
 * @param key
 * @param value
 */
function jsonReviver(key, value) {
    if (TextUtils.isDate(value)) {
        return new Date(value);
    }
    return value;
}

export class AngularDataService extends ClientDataService {

    constructor(base: string, private http: HttpClient, options?: ClientDataContextOptions) {
        super(base || '/', options);
    }

    getMetadata(): Promise<EdmSchema> {
        const headers = { ...this.getHeaders(), ...{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }};
        return new Promise<any>((resolve, reject) => {
            this.http.request('GET', this.resolve('$metadata'), {
                headers: new HttpHeaders(headers),
                observe: 'response',
                reportProgress: false,
                responseType: 'text',
                withCredentials: true
            }).subscribe((res) => {
                if (res.status === 204) {
                    return resolve();
                } else {
                    // safely handle empty body
                    if ((res.body == null) || (typeof res.body === 'string' && res.body.length === 0)) {
                        return resolve();
                    }
                    return resolve(EdmSchema.loadXML(res.body));
                }
            }, (err) => {
                if (err.error && typeof err.error === 'string') {
                    // try parse error
                    try {
                        err.error = JSON.parse(err.error);
                    } catch (parserError) {
                        //
                    }
                }
                return reject(err);
            });
        });
    }

    execute(options: DataServiceExecuteOptions): Promise<any> {
        const self = this;
        // options defaults
        options.method = options.method || 'GET';
        options.headers = { ...this.getHeaders(), ...{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, ...options.headers };
        // validate options URL
        Args.notNull(options.url, 'Request URL');
        // validate URL format
        Args.check(!/^https?:\/\//i.test(options.url), 'Request URL may not be an absolute URI');
        // validate request method
        Args.check(/^GET|POST|PUT|DELETE|PATCH$/i.test(options.method),
            'Invalid request method. Expected GET, POST, PUT or DELETE.');
        // set URL parameter
        const finalURL = self.getBase() + options.url.replace(/^\//i, '');
        let finalParams = new HttpParams();
        let finalBody;
        if (/^GET$/i.test(options.method) && options.data) {
            Object.getOwnPropertyNames(options.data).forEach((key) => {
                finalParams = finalParams.append(key, options.data[key]);
            });
        } else {
            finalBody = options.data;
        }
        // get custom JSON reviver or default
        const reviver = this.getOptions().useJsonReviver || jsonReviver;
        return new Promise<any>((resolve, reject) => {
            this.http.request(options.method, finalURL, {
                body: finalBody,
                headers: new HttpHeaders(options.headers),
                observe: 'response',
                params: finalParams,
                reportProgress: false,
                responseType: 'text',
                withCredentials: true
        }).subscribe((res) => {
                if (res.status === 204) {
                    return resolve();
                } else {
                    // safely handle empty body
                    if ((res.body == null) || (typeof res.body === 'string' && res.body.length === 0)) {
                        return resolve();
                    }
                    const finalRes = JSON.parse(res.body, reviver);
                    return resolve(finalRes);
                }
            }, (err) => {
                if (err.error && typeof err.error === 'string') {
                    // try parse error
                    try {
                        err.error = JSON.parse(err.error);
                    } catch (parserError) {
                        //
                    }
                }
                return reject(err);
            });
        });
    }
}

