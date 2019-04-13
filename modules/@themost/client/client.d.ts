/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import { ClientDataServiceBase, ClientDataContextBase, DataServiceQueryParams, DataServiceExecuteOptions, ClientDataContextOptions } from './common';
export interface ListResponse<T> {
    total?: number;
    skip?: number;
    value?: T[];
}
export declare class ClientDataQueryable {
    static parse(u: string, service?: ClientDataServiceBase): ClientDataQueryable;
    static create(model: string, service?: ClientDataServiceBase): ClientDataQueryable;
    private readonly _model;
    private _url;
    private readonly _service;
    private readonly _params;
    private $prepare;
    private _privates;
    constructor(model: string, service: ClientDataServiceBase);
    toString(): any;
    toExpand(): string;
    takeNext(n: number): ClientDataQueryable;
    takePrevious(n: number): ClientDataQueryable;
    /**
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase;
    /**
     * @returns {DataServiceQueryParams}
     */
    getParams(): DataServiceQueryParams;
    /**
     * @returns {ClientDataQueryable}
     */
    setParam(name: string, value: any): ClientDataQueryable;
    /**
     * Gets a string which represents the name of the data model associated with this object.
     * @returns {string}
     */
    getModel(): string;
    /**
     * Gets a string which represents the relative URL associated with this object.
     * @returns {string}
     */
    getUrl(): string;
    /**
     * Sets the relative URL associated with this object.
     * @param value - A string which represents a relative URI.
     * @returns ClientDataQueryable
     */
    setUrl(value: string): this;
    where(name: string): ClientDataQueryable;
    and(name: string): ClientDataQueryable;
    andAlso(name: string): ClientDataQueryable;
    or(name: string): ClientDataQueryable;
    orElse(name: string): ClientDataQueryable;
    equal(value: any): ClientDataQueryable;
    notEqual(value: any): ClientDataQueryable;
    greaterThan(value: any): ClientDataQueryable;
    greaterOrEqual(value: any): ClientDataQueryable;
    lowerThan(value: any): ClientDataQueryable;
    lowerOrEqual(value: any): ClientDataQueryable;
    /**
     * @param {*} value1
     * @param {*} value2
     * @returns {ClientDataQueryable}
     */
    between(value1: any, value2: any): ClientDataQueryable;
    toFilter(): string;
    contains(value: any): ClientDataQueryable;
    getDate(): ClientDataQueryable;
    getDay(): ClientDataQueryable;
    getMonth(): ClientDataQueryable;
    getYear(): ClientDataQueryable;
    getFullYear(): ClientDataQueryable;
    getHours(): ClientDataQueryable;
    getMinutes(): ClientDataQueryable;
    getSeconds(): ClientDataQueryable;
    length(): ClientDataQueryable;
    trim(): ClientDataQueryable;
    toLocaleLowerCase(): ClientDataQueryable;
    toLowerCase(): ClientDataQueryable;
    toLocaleUpperCase(): ClientDataQueryable;
    toUpperCase(): ClientDataQueryable;
    round(): ClientDataQueryable;
    floor(): ClientDataQueryable;
    ceil(): ClientDataQueryable;
    indexOf(s: string): ClientDataQueryable;
    substr(pos: number, length: number): ClientDataQueryable;
    startsWith(s: string): ClientDataQueryable;
    endsWith(s: string): ClientDataQueryable;
    select(...attr: string[]): ClientDataQueryable;
    groupBy(...attr: string[]): ClientDataQueryable;
    expand(...attr: string[]): ClientDataQueryable;
    orderBy(attr: string): ClientDataQueryable;
    thenBy(attr: string): ClientDataQueryable;
    orderByDescending(attr: string): ClientDataQueryable;
    thenByDescending(attr: string): ClientDataQueryable;
    skip(num: number): ClientDataQueryable;
    take(num: number): ClientDataQueryable;
    first(): Promise<any>;
    list(): Promise<any>;
    item(): Promise<any>;
    getItem(): Promise<any>;
    items(): Promise<any>;
    getItems(): Promise<any>;
    getList(): Promise<any>;
    filter(s: string): ClientDataQueryable;
    levels(n: number): ClientDataQueryable;
    prepare(or?: boolean): ClientDataQueryable;
    private aggregate_;
    private compare_;
    private append_;
    private escape_;
}
export declare class ClientDataModel {
    private readonly _name;
    private readonly _service;
    constructor(name: string, service: ClientDataServiceBase);
    /**
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase;
    getName(): string;
    /**
     * @param {DataServiceQueryParams} params
     * @returns {ClientDataQueryable}
     */
    asQueryable(params?: DataServiceQueryParams): ClientDataQueryable;
    /**
     * @returns {Promise}
     */
    getItems(): Promise<any>;
    /**
     * @returns {Promise}
     */
    getList(): Promise<any>;
    where(attr: string): ClientDataQueryable;
    select(...attr: string[]): ClientDataQueryable;
    skip(num: number): ClientDataQueryable;
    take(num: number): ClientDataQueryable;
    getUrl(): string;
    save(obj: any): Promise<any>;
    schema(): Promise<any>;
    remove(obj: any): Promise<any>;
    levels(n: number): ClientDataQueryable;
}
export declare class ClientDataContext implements ClientDataContextBase {
    private readonly _service;
    private options;
    constructor(service: ClientDataServiceBase, options?: ClientDataContextOptions);
    setBasicAuthorization(username: string, password: string): ClientDataContext;
    setBearerAuthorization(access_token: string): ClientDataContext;
    /**
     * Gets a string which represents the base URL of the MOST Web Application Server.
     * @returns {string}
     */
    getBase(): string;
    /**
     * Sets a string which represents the base URL of the MOST Web Application Server.
     */
    setBase(value: string): ClientDataContextBase;
    /**
     * Gets the instance of ClientDataService class which is associated with this data context.
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase;
    /**
     * Gets an instance of ClientDataModel class
     * @param name - A string which represents the name of the data model.
     * @returns {ClientDataModel}
     */
    model(name: string): ClientDataModel;
}
export declare class ClientDataService implements ClientDataServiceBase {
    private _base;
    private readonly _options;
    private readonly _headers;
    constructor(base: string, options?: ClientDataContextOptions);
    getOptions(): ClientDataContextOptions;
    setHeader(name: string, value: string): void;
    getHeaders(): any;
    getBase(): string;
    /**
     * Sets a string which represents the base URL of a client data service.
     */
    setBase(value: string): ClientDataService;
    resolve(relative: string): string;
    execute(options: DataServiceExecuteOptions): Promise<any>;
}
