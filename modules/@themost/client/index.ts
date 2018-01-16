/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */

import {ClientDataServiceBase, ClientDataContextBase, TextUtils, DataServiceQueryParams, DataServiceExecuteOptions,Args,
    ClientDataContextOptions} from './common';
import * as parse from "url-parse";

class ClientQueryExpression {
    public left:any;
    public op:string;
    public lop:string;
    public right:any;
}


export class ClientDataQueryable {

    private model_:string;
    private url_:string;
    private service_:ClientDataServiceBase;
    private params_:any;
    private privates_:ClientQueryExpression;

    static parse(u: string, service?: ClientDataServiceBase): ClientDataQueryable {
        const uri = parse(u, true);
        const result = new ClientDataQueryable("Model",service || new ParserDataService(uri.protocol ? uri.origin : "/"));
        for(const key in uri.query) {
            if (/^\$/.test(key)) {
                if (/[+-]?\d+/.test(uri.query[key])) {
                    result.setParam(key, parseInt(uri.query[key]));
                }
                else {
                    result.setParam(key, uri.query[key]);
                }
            }
        }
        result.setUrl(uri.pathname);
        return result;
    }

    constructor(model:string, service: ClientDataServiceBase) {
        Args.notEmpty(model, "Model");
        this.model_ = model;
        Args.notNull(service, "Data Service");
        this.service_ = service;
        if (this.service_.getOptions().useMediaTypeExtensions) {
            this.url_ = TextUtils.format("%s/index.json", this.model_);
        }
        else {
            this.url_ = TextUtils.format("%s/", this.model_);
        }
        //init params
        this.params_ = { };
        //init privates
        this.privates_ = new ClientQueryExpression();
    }

    toString() {
        let uri = this.getService().resolve(this.url_);
        const params = this.getParams();
        let search = "";
        for(const key in params) {
            search = search.concat(key, '=', params[key], "&");
        }
        if (search.length) {
            return uri.concat("?",search.replace(/&$/,""));
        }
        return uri;
    }

    toExpand() {
        let model = this.getModel();
        const params = this.getParams();
        let search = "";
        for(const key in params) {
            search = search.concat(key, '=', params[key], ";");
        }
        if (search.length) {
            return model.concat("(",search.replace(/;$/,""), ")");
        }
        return model;
    }

    takeNext(n:number) {
        const p = this.getParams();
        return this.take(n).skip((p.$skip ? p.$skip : 0) + n);
    }

    takePrevious(n:number) {
        const p = this.getParams();
        if (p.$skip>0) {
            if (n<=p.$skip) {
                this.skip(p.$skip-n);
                return this.take(n);
            }
        }
        return this;
    }

    /**
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase {
        return this.service_;
    }

    /**
     * @returns {DataServiceQueryParams}
     */
    getParams(): DataServiceQueryParams {
        return this.params_;
    }

    /**
     * @returns {ClientDataQueryable}
     */
    setParam(name:string, value:any): ClientDataQueryable {
        if (/^\$/.test(name)) {
            this.params_[name] = value;
        }
        else {
            this.params_["$" + name] = value;
        }
        return this;
    }

    /**
     * Gets a string which represents the name of the data model associated with this object.
     * @returns {string}
     */
    getModel(): string {
        return this.model_;
    }

    /**
     * Gets a string which represents the relative URL associated with this object.
     * @returns {string}
     */
    getUrl():string {
        return this.url_;
    }

    /**
     * Sets the relative URL associated with this object.
     * @param value - A string which represents a relative URI.
     * @returns ClientDataQueryable
     */
    setUrl(value:string) {
        Args.notEmpty(value,"URL");
        Args.check(!TextUtils.isAbsoluteURI(value), "URL must be a relative URI");
        this.url_ = value;
        return this;
    }

    static create(model:string, service?: ClientDataServiceBase):ClientDataQueryable {
        return new ClientDataQueryable(model, service);
    }

    private append_() {
        Args.notNull(this.privates_.left,"Left operand");
        Args.notNull(this.privates_.op,"Comparison operator");
        let expr;
        if (Array.isArray(this.privates_.right)) {
            Args.check((this.privates_.op==="eq") || (this.privates_.op==="ne"),"Wrong operator. Expected equal or not equal");
            Args.check(this.privates_.right.length>0,"Array may not be empty");
            const arr = this.privates_.right.map((x) => {
                return this.privates_.left + " " + this.privates_.op + " " + this.escape_(x);
            });
            if (this.privates_.op === "eq") {
                expr = "(" + arr.join(" or ") + ")";
            }
            else {
                expr = "(" + arr.join(" or ") + ")";
            }
        }
        else {
            expr = this.privates_.left + " " + this.privates_.op + " " + this.escape_(this.privates_.right);
        }
        this.privates_.lop = this.privates_.lop || "and";
        if (TextUtils.isNotEmptyString(this.params_.$filter)) {
            this.params_.$filter = this.params_.$filter + " " + this.privates_.lop + " " + expr;
        }
        else {
            this.params_.$filter = expr;
        }
        //clear object
        this.privates_.left = null; this.privates_.op = null; this.privates_.right = null;
        return this;
    }



    private escape_(val:any) {
        if ((val == null) || (val==undefined)) {
            return "null";
        }
        if (typeof val === 'boolean') {
            return (val) ? "true" : "false";
        }
        if (typeof val === 'number') {
            return val+"";
        }
        if (val instanceof Date) {
            const dt = val;
            const year   = dt.getFullYear();
            const month  = TextUtils.zeroPad(dt.getMonth() + 1, 2);
            const day    = TextUtils.zeroPad(dt.getDate(), 2);
            const hour   = TextUtils.zeroPad(dt.getHours(), 2);
            const minute = TextUtils.zeroPad(dt.getMinutes(), 2);
            const second = TextUtils.zeroPad(dt.getSeconds(), 2);
            const millisecond = TextUtils.zeroPad(dt.getMilliseconds(), 3);
            //format timezone
            const offset = (new Date()).getTimezoneOffset(),
                timezone = (offset>=0 ? '+' : '') + TextUtils.zeroPad(Math.floor(offset/60),2) + ':' + TextUtils.zeroPad(offset%60,2);
            return "'" + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millisecond + timezone + "'";
        }
        if (val instanceof Array) {
            const values = [];
            val.forEach((x) => {
                values.push(this.escape_(x));
            });
            return values.join(',');
        }
        if (typeof val === "string") {
            const res = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function(s) {
                switch(s) {
                    case "\0": return "\\0";
                    case "\n": return "\\n";
                    case "\r": return "\\r";
                    case "\b": return "\\b";
                    case "\t": return "\\t";
                    case "\x1a": return "\\Z";
                    default: return "\\"+s;
                }
            });
            return "'" + res + "'";
        }
        //otherwise get valueOf
        if (val.hasOwnProperty("$name"))
            return val["$name"];
        else
            return this.escape_(val.valueOf());
    }

    where(name:string):ClientDataQueryable {
        Args.notEmpty(name,"Left operand");
        this.privates_.left = name;
        return this;
    }

    and(name:string):ClientDataQueryable {
        Args.notEmpty(name,"Left operand");
        this.privates_.left = name;
        this.privates_.lop = "and";
        return this;
    }

    andAlso(name:string):ClientDataQueryable {
        Args.notEmpty(name,"Left operand");
        this.privates_.left = name;
        this.privates_.lop = "and";
        if (!TextUtils.isNullOrUndefined(this.params_.$filter)) {
            this.params_.$filter = "(" + this.params_.$filter + ")";
        }
        return this;
    }

    or(name:string):ClientDataQueryable {
        Args.notEmpty(name,"Left operand");
        this.privates_.left = name;
        this.privates_.lop = "or";
        return this;
    }

    orElse(name:string):ClientDataQueryable {
        Args.notEmpty(name,"Left operand");
        this.privates_.left = name;
        this.privates_.lop = "or";
        if (!TextUtils.isNullOrUndefined(this.params_.$filter)) {
            this.params_.$filter = "(" + this.params_.$filter + ")";
        }
        return this;
    }

    private compare_(op, value):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.op = op;
        this.privates_.right = value; return this.append_();
    }

    equal(value:any):ClientDataQueryable {
        return this.compare_("eq", value);
    }

    notEqual(value:any):ClientDataQueryable {
        return this.compare_("ne", value);
    }

    greaterThan(value:any):ClientDataQueryable {
        return this.compare_("gt", value);
    }

    greaterOrEqual(value:any):ClientDataQueryable {
        return this.compare_("ge", value);
    }

    lowerThan(value:any):ClientDataQueryable {
        return this.compare_("lt", value);
    }

    lowerOrEqual(value:any):ClientDataQueryable {
        return this.compare_("le", value);
    }

    /**
     * @param {*} value1
     * @param {*} value2
     * @returns {ClientDataQueryable}
     */
    between(value1:any, value2:any):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        //generate new filter
        const s = ClientDataQueryable.create(this.getModel())
            .where(this.privates_.left).greaterOrEqual(value1)
            .and(this.privates_.left).lowerOrEqual(value2).toFilter();
        this.privates_.lop = this.privates_.lop || "and";
        if (this.params_.$filter) {
            this.params_.$filter = "(" + this.params_.$filter + ") " + this.privates_.lop + " (" + s + ")";
        }
        else {
            this.params_.$filter = "(" + s + ")";
        }
        //clear object
        this.privates_.left = null; this.privates_.op = null; this.privates_.right = null; this.privates_.lop = null;
        return this;
    }

    toFilter():string {
        return this.params_.$filter;
    }

    contains(value:any):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.op = 'ge';
        this.privates_.left = TextUtils.format('indexof(%s,%s)', this.privates_.left, this.escape_(value));
        this.privates_.right = 0;
        return this.append_();
    }

    private aggregate_(fn:string): ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.left = TextUtils.format('%s(%s)', fn, this.privates_.left);
        return this;
    }

    getDate():ClientDataQueryable {
        return this.aggregate_("date");
    }

    getDay():ClientDataQueryable {
        return this.aggregate_("day");
    }

    getMonth():ClientDataQueryable {
        return this.aggregate_("month");
    }

    getYear():ClientDataQueryable {
        return this.aggregate_("year");
    }

    getFullYear():ClientDataQueryable {
        return this.aggregate_("year");
    }

    getHours():ClientDataQueryable {
        return this.aggregate_("hour");
    }

    getMinutes():ClientDataQueryable {
        return this.aggregate_("minute");
    }

    getSeconds():ClientDataQueryable {
        return this.aggregate_("second");
    }

    length():ClientDataQueryable {
        return this.aggregate_("length");
    }

    trim():ClientDataQueryable {
        return this.aggregate_("trim");
    }

    toLocaleLowerCase():ClientDataQueryable {
        return this.aggregate_("tolower");
    }

    toLowerCase():ClientDataQueryable {
        return this.aggregate_("tolower");
    }

    toLocaleUpperCase():ClientDataQueryable {
        return this.aggregate_("toupper");
    }

    toUpperCase():ClientDataQueryable {
        return this.aggregate_("toupper");
    }

    round():ClientDataQueryable {
        return this.aggregate_("round");
    }

    floor():ClientDataQueryable {
        return this.aggregate_("floor");
    }

    ceil():ClientDataQueryable {
        return this.aggregate_("ceiling");
    }

    indexOf(s:string):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.left = TextUtils.format('indexof(%s,%s)', this.privates_.left, this.escape_(s));
        return this;
    }

    substr(pos:number,length:number):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.left = TextUtils.format('substring(%s,%s,%s)',this.privates_.left, pos, length);
        return this;
    }

    startsWith(s:string):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.left = TextUtils.format('startswith(%s,%s)',this.privates_.left, this.escape_(s));
        return this;
    }

    endsWith(s:string):ClientDataQueryable {
        Args.notNull(this.privates_.left,"The left operand");
        this.privates_.left = TextUtils.format('endswith(%s,%s)',this.privates_.left, this.escape_(s));
        return this;
    }

    select(...attr:string[]):ClientDataQueryable {
        Args.notNull(attr, "Attributes");
        Args.check(attr.length>0,"Attributes may not be empty");
        const arr = [];
        for (let i = 0; i < attr.length; i++) {
            Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
            arr.push(attr[i]);
        }
        this.params_.$select = arr.join(",");
        return this;
    }

    groupBy(...attr:string[]):ClientDataQueryable {
        Args.notNull(attr, "Attributes");
        Args.check(attr.length>0,"Attributes may not be empty");
        const arr = [];
        for (let i = 0; i < attr.length; i++) {
            Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
            arr.push(attr[i]);
        }
        this.params_.$groupby = arr.join(",");
        return this;
    }

    expand(...attr:string[]):ClientDataQueryable {
        Args.notNull(attr, "Attributes");
        Args.check(attr.length>0,"Attributes may not be empty");
        const arr = [];
        for (let i = 0; i < attr.length; i++) {
            Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
            arr.push(attr[i]);
        }
        this.params_.$expand = arr.join(",");
        return this;
    }

    orderBy(attr:string):ClientDataQueryable {
        Args.notEmpty(attr,"Order by attribute");
        this.params_.$orderby = attr.toString();
        return this;
    }

    thenBy(attr:string):ClientDataQueryable {
        Args.notEmpty(attr,"Order by attribute");
        this.params_.$orderby += (this.params_.$orderby ? ',' + attr.toString() : attr.toString());
        return this;
    }

    orderByDescending(attr:string):ClientDataQueryable {
        Args.notEmpty(attr,"Order by attribute");
        this.params_.$orderby = attr.toString() + " desc";
        return this;
    }

    thenByDescending(attr:string):ClientDataQueryable {
        Args.notEmpty(attr,"Order by attribute");
        this.params_.$orderby += (this.params_.$orderby ? ',' + attr.toString() : attr.toString()) + " desc";
        return this;
    }

    skip(num:number):ClientDataQueryable {
        this.params_.$skip = num;
        return this;
    }

    take(num:number):ClientDataQueryable {
        this.params_.$top = num;
        return this;
    }

    first():Promise<any> {
        delete this.params_.$top;
        delete this.params_.$skip;
        delete this.params_.$count;
        this.params_.$first = true;
        return this.getService().execute({
            method:"GET",
            url:this.getUrl(),
            data:this.params_,
            headers:[]
        });
    }

    list():Promise<any> {
        delete this.params_.$first;
        this.params_.$count = true;
        return this.getService().execute({
            method:"GET",
            url:this.getUrl(),
            data:this.params_,
            headers:{}
        });
    }

    item():Promise<any> {
        return this.first();
    }

    getItem():Promise<any> {
        return this.first();
    }

    items():Promise<any> {
        delete this.params_.$first;
        this.params_.$count = false;
        return this.getService().execute({
            method:"GET",
            url:this.getUrl(),
            data:this.params_,
            headers:{}
        });
    }

    getItems():Promise<any> {
        return this.items();
    }

    getList():Promise<any> {
        return this.list();
    }

    filter(s:string):ClientDataQueryable {
        Args.notEmpty("s","Filter expression");
        this.params_.$filter = s;
        return this;
    }

    levels(n:number):ClientDataQueryable {
        Args.Positive(n, 'Levels');
        this.params_.$levels = n;
        return this;
    }

}

export class ClientDataModel {

    private name_:string;
    private service_:ClientDataServiceBase;
    constructor(name:string, service:ClientDataServiceBase) {
        this.name_ = name;
        this.service_ = service;

    }

    /**
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase {
        return this.service_;
    }

    getName(): string {
        return this.name_;
    }

    /**
     * @param {DataServiceQueryParams} params
     * @returns {ClientDataQueryable}
     */
    asQueryable(params?:DataServiceQueryParams):ClientDataQueryable {
        const q =  ClientDataQueryable.create(this.getName(), this.service_);
        if (params) {
            for(let key in params) {
                q.setParam(key, params[key]);
            }
        }
        return q;
    }

    /**
     * @returns {Promise}
     */
    getItems():Promise<any> {
        return this.asQueryable().getItems();
    }

    /**
     * @returns {Promise}
     */
    getList():Promise<any> {
        return this.asQueryable().getList();
    }

    where(attr:string):ClientDataQueryable {
        return this.asQueryable().where(attr);
    }

    select(...attr:string[]):ClientDataQueryable {
        const q = this.asQueryable();
        return q.select.apply(q,attr);
    }

    skip(num:number):ClientDataQueryable {
        return this.asQueryable().skip(num);
    }

    take(num:number):ClientDataQueryable {
        return this.asQueryable().take(num);
    }

    getUrl() {
        if (this.service_.getOptions().useMediaTypeExtensions) {
            return TextUtils.format("%s/index.json", this.getName());
        }
        else {
            return TextUtils.format("%s/", this.getName());
        }
    }

    save(obj:any):Promise<any> {
        return this.getService().execute({
            method:"POST",
            url:this.getUrl(),
            data:obj,
            headers:{}
        });
    }

    schema():Promise<any> {
        return this.getService().execute({ method:"GET",
            url:TextUtils.format("%s/schema.json", this.getName()),
            data:null,
            headers:{}
        });
    }

    remove(obj:any):Promise<any> {
        return this.getService().execute({ method:"DELETE",
            url:this.getUrl(),
            data:obj,
            headers:{}
        });
    }

    levels(n:number):ClientDataQueryable {
        Args.Positive(n, 'Levels');
        return this.asQueryable().levels(n);
    }

}


export class ClientDataContext implements ClientDataContextBase {

    private service_:ClientDataServiceBase;
    private base_:string;
    private options:ClientDataContextOptions;

    constructor(service : ClientDataServiceBase, options?:ClientDataContextOptions) {
        this.service_ = service;

    }

    setBasicAuthorization (username:string, password:string):ClientDataContext {
        this.getService().setHeader("Authorization", "Basic " + TextUtils.toBase64(username + ":" + password));
        return this;
    }

    setBearerAuthorization (access_token: string):ClientDataContext {
        this.getService().setHeader("Authorization", "Bearer " + access_token);
        return this;
    }

    /**
     * Gets a string which represents the base URL of the MOST Web Application Server.
     * @returns {string}
     */
    getBase(): string {
        return this.base_;
    }

    /**
     * Sets a string which represents the base URL of the MOST Web Application Server.
     */
    setBase(value:string):ClientDataContextBase {
        Args.notEmpty(value,"Base URL");
        this.base_ = value;
        return this;
    }

    /**
     * Gets the instance of ClientDataService class which is associated with this data context.
     * @returns {ClientDataServiceBase}
     */
    getService(): ClientDataServiceBase {
        return this.service_;
    }

    /**
     * Gets an instance of ClientDataModel class
     * @param name - A string which represents the name of the data model.
     * @returns {ClientDataModel}
     */
    model(name:string): ClientDataModel {
        Args.notEmpty(name,"Model name");
        const model = new ClientDataModel(name, this.getService());
        return model;
    }


}

export class ClientDataService implements ClientDataServiceBase {


    private base_:string;
    private options_:ClientDataContextOptions;
    private headers_: any;

    constructor(base:string, options?: ClientDataContextOptions) {
        this.headers_ = {};
        this.options_ = options || {
            useMediaTypeExtensions:true
        };
        if (typeof base === 'undefined' || base == null) {
            this.base_ = "/";
        }
        else {
            this.base_ = base;
            if (!/\/$/.test(this.base_)) {
                this.base_ += "/";
            }
        }
    }

    getOptions(): ClientDataContextOptions {
        return this.options_;
    }

    setHeader(name:string, value:string) {
        this.headers_[name] = value;
    }

    getHeaders():any {
        return this.headers_;
    }

    getBase(): string {
        return this.base_;
    }

    resolve(relative: string) {
        if (typeof relative === 'string' && relative.length>0) {
            if (/^\//.test(relative))
                return this.getBase() + relative.substr(1);
            else
                return this.getBase() + relative;
        }
        throw  new Error("Invalid argument. Expected a not empty string.");
    }


    execute(options: DataServiceExecuteOptions): Promise<any> {
        throw new Error("Method not implemented.");
    }

}


class ParserDataService extends ClientDataService {

    constructor(base:string) {
        super(base);
    }

    execute(options: DataServiceExecuteOptions): Promise<any> {
        throw new Error("Method not allowed.");
    }

}
