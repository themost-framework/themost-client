/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import { DataServiceExecuteOptions } from "@themost/client/common";
import { ClientDataService, ClientDataContext } from "@themost/client";
export declare class AngularDataContext extends ClientDataContext {
    constructor(base: string, http: any, q: any);
}
export declare class AngularDataService extends ClientDataService {
    private http;
    private q;
    /**
     *
     * @param {string} base
     * @param {*} http
     * @param {*} q
     */
    constructor(base: string, http: any, q: any);
    execute(options: DataServiceExecuteOptions): Promise<any>;
}
