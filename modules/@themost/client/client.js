"use strict";
/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
// a workaround of calling parse namespace -exported by url-parse- in typescript
var parse_ = require("url-parse");
var parse = parse_;
var ClientQueryExpression = /** @class */ (function () {
    function ClientQueryExpression() {
    }
    return ClientQueryExpression;
}());
var ClientDataQueryable = /** @class */ (function () {
    function ClientDataQueryable(model, service) {
        common_1.Args.notEmpty(model, 'Model');
        this._model = model;
        common_1.Args.notNull(service, 'Data Service');
        this._service = service;
        if (this._service.getOptions().useMediaTypeExtensions) {
            this._url = common_1.TextUtils.format('%s/index.json', this._model);
        }
        else {
            this._url = common_1.TextUtils.format('%s/', this._model);
        }
        // init params
        this._params = {};
        // init privates
        this._privates = new ClientQueryExpression();
    }
    ClientDataQueryable.parse = function (u, service) {
        var uri = parse(u);
        var result = new ClientDataQueryable('Model', service || new ParserDataService(uri.protocol ? uri.origin : '/'));
        for (var key in uri.query) {
            if (/^\$/.test(key)) {
                if (/[+-]?\d+/.test(uri.query[key])) {
                    result.setParam(key, parseInt(uri.query[key], 10));
                }
                else {
                    result.setParam(key, uri.query[key]);
                }
            }
        }
        result.setUrl(uri.pathname);
        return result;
    };
    ClientDataQueryable.create = function (model, service) {
        return new ClientDataQueryable(model, service);
    };
    ClientDataQueryable.prototype.toString = function () {
        var uri = this.getService().resolve(this._url);
        var params = this.getParams();
        var search = '';
        for (var key in params) {
            search = search.concat(key, '=', params[key], '&');
        }
        if (search.length) {
            return uri.concat('?', search.replace(/&$/, ''));
        }
        return uri;
    };
    ClientDataQueryable.prototype.toExpand = function () {
        var model = this.getModel();
        var params = this.getParams();
        var search = '';
        for (var key in params) {
            search = search.concat(key, '=', params[key], ';');
        }
        if (search.length) {
            return model.concat('(', search.replace(/;$/, ''), ')');
        }
        return model;
    };
    ClientDataQueryable.prototype.takeNext = function (n) {
        var p = this.getParams();
        return this.take(n).skip((p.$skip ? p.$skip : 0) + n);
    };
    ClientDataQueryable.prototype.takePrevious = function (n) {
        var p = this.getParams();
        if (p.$skip > 0) {
            if (n <= p.$skip) {
                this.skip(p.$skip - n);
                return this.take(n);
            }
        }
        return this;
    };
    /**
     * @returns {ClientDataServiceBase}
     */
    ClientDataQueryable.prototype.getService = function () {
        return this._service;
    };
    /**
     * @returns {DataServiceQueryParams}
     */
    ClientDataQueryable.prototype.getParams = function () {
        if (typeof this.$prepare === 'string' && this.$prepare.length) {
            if (typeof this._params.$filter === 'string' && this._params.$filter) {
                return Object.assign({}, this._params, {
                    $filter: "(" + this.$prepare + ") and (" + this._params.$filter + ")"
                });
            }
            else {
                return Object.assign({}, this._params, {
                    $filter: this.$prepare
                });
            }
        }
        return Object.assign({}, this._params);
    };
    /**
     * @returns {ClientDataQueryable}
     */
    ClientDataQueryable.prototype.setParam = function (name, value) {
        if (/^\$/.test(name)) {
            this._params[name] = value;
        }
        else {
            this._params['$' + name] = value;
        }
        return this;
    };
    /**
     * Gets a string which represents the name of the data model associated with this object.
     * @returns {string}
     */
    ClientDataQueryable.prototype.getModel = function () {
        return this._model;
    };
    /**
     * Gets a string which represents the relative URL associated with this object.
     * @returns {string}
     */
    ClientDataQueryable.prototype.getUrl = function () {
        return this._url;
    };
    /**
     * Sets the relative URL associated with this object.
     * @param value - A string which represents a relative URI.
     * @returns ClientDataQueryable
     */
    ClientDataQueryable.prototype.setUrl = function (value) {
        common_1.Args.notEmpty(value, 'URL');
        common_1.Args.check(!common_1.TextUtils.isAbsoluteURI(value), 'URL must be a relative URI');
        this._url = value;
        return this;
    };
    ClientDataQueryable.prototype.where = function (name) {
        common_1.Args.notEmpty(name, 'Left operand');
        this._privates.left = name;
        return this;
    };
    ClientDataQueryable.prototype.and = function (name) {
        common_1.Args.notEmpty(name, 'Left operand');
        this._privates.left = name;
        this._privates.lop = 'and';
        return this;
    };
    ClientDataQueryable.prototype.andAlso = function (name) {
        common_1.Args.notEmpty(name, 'Left operand');
        this._privates.left = name;
        this._privates.lop = 'and';
        if (!common_1.TextUtils.isNullOrUndefined(this._params.$filter)) {
            this._params.$filter = '(' + this._params.$filter + ')';
        }
        return this;
    };
    ClientDataQueryable.prototype.or = function (name) {
        common_1.Args.notEmpty(name, 'Left operand');
        this._privates.left = name;
        this._privates.lop = 'or';
        return this;
    };
    ClientDataQueryable.prototype.orElse = function (name) {
        common_1.Args.notEmpty(name, 'Left operand');
        this._privates.left = name;
        this._privates.lop = 'or';
        if (!common_1.TextUtils.isNullOrUndefined(this._params.$filter)) {
            this._params.$filter = '(' + this._params.$filter + ')';
        }
        return this;
    };
    ClientDataQueryable.prototype.equal = function (value) {
        return this.compare_('eq', value);
    };
    ClientDataQueryable.prototype.notEqual = function (value) {
        return this.compare_('ne', value);
    };
    ClientDataQueryable.prototype.greaterThan = function (value) {
        return this.compare_('gt', value);
    };
    ClientDataQueryable.prototype.greaterOrEqual = function (value) {
        return this.compare_('ge', value);
    };
    ClientDataQueryable.prototype.lowerThan = function (value) {
        return this.compare_('lt', value);
    };
    ClientDataQueryable.prototype.lowerOrEqual = function (value) {
        return this.compare_('le', value);
    };
    /**
     * @param {*} value1
     * @param {*} value2
     * @returns {ClientDataQueryable}
     */
    ClientDataQueryable.prototype.between = function (value1, value2) {
        common_1.Args.notNull(this._privates.left, 'The left operand');
        // generate new filter
        var s = ClientDataQueryable.create(this.getModel(), this.getService())
            .where(this._privates.left).greaterOrEqual(value1)
            .and(this._privates.left).lowerOrEqual(value2).toFilter();
        this._privates.lop = this._privates.lop || 'and';
        if (this._params.$filter) {
            this._params.$filter = '(' + this._params.$filter + ') ' + this._privates.lop + ' (' + s + ')';
        }
        else {
            this._params.$filter = '(' + s + ')';
        }
        // clear object
        this._privates.left = null;
        this._privates.op = null;
        this._privates.right = null;
        this._privates.lop = null;
        return this;
    };
    ClientDataQueryable.prototype.toFilter = function () {
        return this.getParams().$filter;
    };
    ClientDataQueryable.prototype.contains = function (value) {
        common_1.Args.notNull(this._privates.left, 'The left operand');
        this._privates.op = 'ge';
        this._privates.left = common_1.TextUtils.format('indexof(%s,%s)', this._privates.left, this.escape_(value));
        this._privates.right = 0;
        return this.append_();
    };
    ClientDataQueryable.prototype.getDate = function () {
        return this.aggregate_('date');
    };
    ClientDataQueryable.prototype.getDay = function () {
        return this.aggregate_('day');
    };
    ClientDataQueryable.prototype.getMonth = function () {
        return this.aggregate_('month');
    };
    ClientDataQueryable.prototype.getYear = function () {
        return this.aggregate_('year');
    };
    ClientDataQueryable.prototype.getFullYear = function () {
        return this.aggregate_('year');
    };
    ClientDataQueryable.prototype.getHours = function () {
        return this.aggregate_('hour');
    };
    ClientDataQueryable.prototype.getMinutes = function () {
        return this.aggregate_('minute');
    };
    ClientDataQueryable.prototype.getSeconds = function () {
        return this.aggregate_('second');
    };
    ClientDataQueryable.prototype.length = function () {
        return this.aggregate_('length');
    };
    ClientDataQueryable.prototype.trim = function () {
        return this.aggregate_('trim');
    };
    ClientDataQueryable.prototype.toLocaleLowerCase = function () {
        return this.aggregate_('tolower');
    };
    ClientDataQueryable.prototype.toLowerCase = function () {
        return this.aggregate_('tolower');
    };
    ClientDataQueryable.prototype.toLocaleUpperCase = function () {
        return this.aggregate_('toupper');
    };
    ClientDataQueryable.prototype.toUpperCase = function () {
        return this.aggregate_('toupper');
    };
    ClientDataQueryable.prototype.round = function () {
        return this.aggregate_('round');
    };
    ClientDataQueryable.prototype.floor = function () {
        return this.aggregate_('floor');
    };
    ClientDataQueryable.prototype.ceil = function () {
        return this.aggregate_('ceiling');
    };
    ClientDataQueryable.prototype.indexOf = function (s) {
        common_1.Args.notNull(this._privates.left, 'The left operand');
        this._privates.left = common_1.TextUtils.format('indexof(%s,%s)', this._privates.left, this.escape_(s));
        return this;
    };
    ClientDataQueryable.prototype.substr = function (pos, length) {
        common_1.Args.notNull(this._privates.left, 'The left operand');
        this._privates.left = common_1.TextUtils.format('substring(%s,%s,%s)', this._privates.left, pos, length);
        return this;
    };
    ClientDataQueryable.prototype.startsWith = function (s) {
        common_1.Args.notNull(this._privates.left, 'The left operand');
        this._privates.left = common_1.TextUtils.format('startswith(%s,%s)', this._privates.left, this.escape_(s));
        return this;
    };
    ClientDataQueryable.prototype.endsWith = function (s) {
        common_1.Args.notNull(this._privates.left, 'The left operand');
        this._privates.left = common_1.TextUtils.format('endswith(%s,%s)', this._privates.left, this.escape_(s));
        return this;
    };
    ClientDataQueryable.prototype.select = function () {
        var attr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attr[_i] = arguments[_i];
        }
        common_1.Args.notNull(attr, 'Attributes');
        common_1.Args.check(attr.length > 0, 'Attributes may not be empty');
        var arr = [];
        for (var i = 0; i < attr.length; i++) {
            common_1.Args.check(typeof attr[i] === 'string', 'Invalid attribute. Expected string.');
            arr.push(attr[i]);
        }
        this._params.$select = arr.join(',');
        return this;
    };
    ClientDataQueryable.prototype.groupBy = function () {
        var attr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attr[_i] = arguments[_i];
        }
        common_1.Args.notNull(attr, 'Attributes');
        common_1.Args.check(attr.length > 0, 'Attributes may not be empty');
        var arr = [];
        for (var i = 0; i < attr.length; i++) {
            common_1.Args.check(typeof attr[i] === 'string', 'Invalid attribute. Expected string.');
            arr.push(attr[i]);
        }
        this._params.$groupby = arr.join(',');
        return this;
    };
    ClientDataQueryable.prototype.expand = function () {
        var attr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attr[_i] = arguments[_i];
        }
        common_1.Args.notNull(attr, 'Attributes');
        common_1.Args.check(attr.length > 0, 'Attributes may not be empty');
        var arr = [];
        for (var i = 0; i < attr.length; i++) {
            common_1.Args.check(typeof attr[i] === 'string', 'Invalid attribute. Expected string.');
            arr.push(attr[i]);
        }
        this._params.$expand = arr.join(',');
        return this;
    };
    ClientDataQueryable.prototype.orderBy = function (attr) {
        common_1.Args.notEmpty(attr, 'Order by attribute');
        this._params.$orderby = attr.toString();
        return this;
    };
    ClientDataQueryable.prototype.thenBy = function (attr) {
        common_1.Args.notEmpty(attr, 'Order by attribute');
        this._params.$orderby += (this._params.$orderby ? ',' + attr.toString() : attr.toString());
        return this;
    };
    ClientDataQueryable.prototype.orderByDescending = function (attr) {
        common_1.Args.notEmpty(attr, 'Order by attribute');
        this._params.$orderby = attr.toString() + ' desc';
        return this;
    };
    ClientDataQueryable.prototype.thenByDescending = function (attr) {
        common_1.Args.notEmpty(attr, 'Order by attribute');
        this._params.$orderby += (this._params.$orderby ? ',' + attr.toString() : attr.toString()) + ' desc';
        return this;
    };
    ClientDataQueryable.prototype.skip = function (num) {
        this._params.$skip = num;
        return this;
    };
    ClientDataQueryable.prototype.take = function (num) {
        this._params.$top = num;
        return this;
    };
    ClientDataQueryable.prototype.first = function () {
        delete this._params.$top;
        delete this._params.$skip;
        delete this._params.$count;
        this._params.$first = true;
        return this.getService().execute({
            method: 'GET',
            url: this.getUrl(),
            data: this.getParams(),
            headers: {}
        });
    };
    ClientDataQueryable.prototype.list = function () {
        delete this._params.$first;
        this._params.$count = true;
        return this.getService().execute({
            method: 'GET',
            url: this.getUrl(),
            data: this.getParams(),
            headers: {}
        });
    };
    ClientDataQueryable.prototype.item = function () {
        return this.first();
    };
    ClientDataQueryable.prototype.getItem = function () {
        // delete $first param
        delete this._params.$first;
        // delete $count param
        delete this._params.$count;
        // get first item only
        return this.take(1).skip(0).getItems().then(function (result) {
            // if result and result.value is array
            if (result && Array.isArray(result.value)) {
                // get first item only
                return Promise.resolve(result.value[0]);
            }
            if (Array.isArray(result)) {
                return Promise.resolve(result[0]);
            }
            // otherwise return result
            return Promise.resolve(result);
        });
    };
    ClientDataQueryable.prototype.items = function () {
        delete this._params.$first;
        this._params.$count = false;
        return this.getService().execute({
            method: 'GET',
            url: this.getUrl(),
            data: this.getParams(),
            headers: {}
        });
    };
    ClientDataQueryable.prototype.getItems = function () {
        var _this = this;
        return this.items().then(function (result) {
            // if current service uses response conversion
            if (_this.getService().getOptions().useResponseConversion) {
                // validate response
                // if response has property value and this property is an array
                if (result && Array.isArray(result.value)) {
                    // this operation is equivalent with DataModel.getItems() and DataQueryable.getItems of @themost/data
                    // return this array
                    return Promise.resolve(result.value);
                }
            }
            return Promise.resolve(result);
        });
    };
    ClientDataQueryable.prototype.getList = function () {
        var _this = this;
        return this.list().then(function (result) {
            // if current service uses response conversion
            if (_this.getService().getOptions().useResponseConversion) {
                // validate response
                // if result has OData paging attributes
                if (result.hasOwnProperty('@odata.count') && result.hasOwnProperty('@odata.skip')) {
                    // convert result to EntitySetResponse
                    return Promise.resolve({
                        total: result['@odata.count'],
                        skip: result['@odata.skip'],
                        value: result.value
                    });
                }
            }
            return Promise.resolve(result);
        });
    };
    ClientDataQueryable.prototype.filter = function (s) {
        common_1.Args.notEmpty('s', 'Filter expression');
        this._params.$filter = s;
        return this;
    };
    ClientDataQueryable.prototype.levels = function (n) {
        common_1.Args.Positive(n, 'Levels');
        this._params.$levels = n;
        return this;
    };
    ClientDataQueryable.prototype.prepare = function (or) {
        var lop = or ? 'or' : 'and';
        if (typeof this._params.$filter === 'string' && this._params.$filter.length) {
            if (typeof this.$prepare === 'string' && this.$prepare.length) {
                this.$prepare = this.$prepare + " " + lop + " " + this._params.$filter;
            }
            else {
                this.$prepare = this._params.$filter;
            }
        }
        delete this._params.$filter;
        return this;
    };
    ClientDataQueryable.prototype.aggregate_ = function (fn) {
        common_1.Args.notNull(this._privates.left, 'The left operand');
        this._privates.left = common_1.TextUtils.format('%s(%s)', fn, this._privates.left);
        return this;
    };
    ClientDataQueryable.prototype.compare_ = function (op, value) {
        common_1.Args.notNull(this._privates.left, 'The left operand');
        this._privates.op = op;
        this._privates.right = value;
        return this.append_();
    };
    ClientDataQueryable.prototype.append_ = function () {
        var _this = this;
        common_1.Args.notNull(this._privates.left, 'Left operand');
        common_1.Args.notNull(this._privates.op, 'Comparison operator');
        var expr;
        if (Array.isArray(this._privates.right)) {
            common_1.Args.check((this._privates.op === 'eq') || (this._privates.op === 'ne'), 'Wrong operator. Expected equal or not equal');
            common_1.Args.check(this._privates.right.length > 0, 'Array may not be empty');
            var arr = this._privates.right.map(function (x) {
                return _this._privates.left + ' ' + _this._privates.op + ' ' + _this.escape_(x);
            });
            if (this._privates.op === 'eq') {
                expr = '(' + arr.join(' or ') + ')';
            }
            else {
                expr = '(' + arr.join(' or ') + ')';
            }
        }
        else {
            expr = this._privates.left + ' ' + this._privates.op + ' ' + this.escape_(this._privates.right);
        }
        this._privates.lop = this._privates.lop || 'and';
        if (common_1.TextUtils.isNotEmptyString(this._params.$filter)) {
            this._params.$filter = this._params.$filter + ' ' + this._privates.lop + ' ' + expr;
        }
        else {
            this._params.$filter = expr;
        }
        // clear object
        this._privates.left = null;
        this._privates.op = null;
        this._privates.right = null;
        return this;
    };
    ClientDataQueryable.prototype.escape_ = function (val) {
        var _this = this;
        if ((val == null) || (typeof val === 'undefined')) {
            return 'null';
        }
        if (typeof val === 'boolean') {
            return (val) ? 'true' : 'false';
        }
        if (typeof val === 'number') {
            return val + '';
        }
        if (val instanceof Date) {
            var dt = val;
            var year = dt.getFullYear();
            var month = common_1.TextUtils.zeroPad(dt.getMonth() + 1, 2);
            var day = common_1.TextUtils.zeroPad(dt.getDate(), 2);
            var hour = common_1.TextUtils.zeroPad(dt.getHours(), 2);
            var minute = common_1.TextUtils.zeroPad(dt.getMinutes(), 2);
            var second = common_1.TextUtils.zeroPad(dt.getSeconds(), 2);
            var millisecond = common_1.TextUtils.zeroPad(dt.getMilliseconds(), 3);
            // format timezone
            var offset = (new Date()).getTimezoneOffset();
            var timezone = (offset >= 0 ? '+' : '') + common_1.TextUtils.zeroPad(Math.floor(offset / 60), 2) +
                ':' + common_1.TextUtils.zeroPad(offset % 60, 2);
            return '\'' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millisecond + timezone + '\'';
        }
        if (val instanceof Array) {
            var values_1 = [];
            val.forEach(function (x) {
                values_1.push(_this.escape_(x));
            });
            return values_1.join(',');
        }
        if (typeof val === 'string') {
            var res = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
                switch (s) {
                    case '\0': return '\\0';
                    case '\n': return '\\n';
                    case '\r': return '\\r';
                    case '\b': return '\\b';
                    case '\t': return '\\t';
                    case '\x1a': return '\\Z';
                    default: return '\\' + s;
                }
            });
            return '\'' + res + '\'';
        }
        // otherwise get valueOf
        if (val.hasOwnProperty('$name')) {
            return val.$name;
        }
        else {
            return this.escape_(val.valueOf());
        }
    };
    return ClientDataQueryable;
}());
exports.ClientDataQueryable = ClientDataQueryable;
var ClientDataModel = /** @class */ (function () {
    function ClientDataModel(name, service) {
        this._name = name;
        this._service = service;
    }
    /**
     * @returns {ClientDataServiceBase}
     */
    ClientDataModel.prototype.getService = function () {
        return this._service;
    };
    ClientDataModel.prototype.getName = function () {
        return this._name;
    };
    /**
     * @param {DataServiceQueryParams} params
     * @returns {ClientDataQueryable}
     */
    ClientDataModel.prototype.asQueryable = function (params) {
        var q = ClientDataQueryable.create(this.getName(), this._service);
        if (params) {
            for (var key in params) {
                q.setParam(key, params[key]);
            }
        }
        return q;
    };
    /**
     * @returns {Promise}
     */
    ClientDataModel.prototype.getItems = function () {
        return this.asQueryable().getItems();
    };
    /**
     * @returns {Promise}
     */
    ClientDataModel.prototype.getList = function () {
        return this.asQueryable().getList();
    };
    ClientDataModel.prototype.where = function (attr) {
        return this.asQueryable().where(attr);
    };
    ClientDataModel.prototype.select = function () {
        var attr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attr[_i] = arguments[_i];
        }
        var q = this.asQueryable();
        return q.select.apply(q, attr);
    };
    ClientDataModel.prototype.skip = function (num) {
        return this.asQueryable().skip(num);
    };
    ClientDataModel.prototype.take = function (num) {
        return this.asQueryable().take(num);
    };
    ClientDataModel.prototype.getUrl = function () {
        if (this._service.getOptions().useMediaTypeExtensions) {
            return common_1.TextUtils.format('%s/index.json', this.getName());
        }
        else {
            return common_1.TextUtils.format('%s/', this.getName());
        }
    };
    ClientDataModel.prototype.save = function (obj) {
        return this.getService().execute({
            method: 'POST',
            url: this.getUrl(),
            data: obj,
            headers: {}
        });
    };
    ClientDataModel.prototype.schema = function () {
        return this.getService().execute({ method: 'GET',
            url: common_1.TextUtils.format('%s/schema.json', this.getName()),
            data: null,
            headers: {}
        });
    };
    ClientDataModel.prototype.remove = function (obj) {
        return this.getService().execute({ method: 'DELETE',
            url: this.getUrl(),
            data: obj,
            headers: {}
        });
    };
    ClientDataModel.prototype.levels = function (n) {
        common_1.Args.Positive(n, 'Levels');
        return this.asQueryable().levels(n);
    };
    return ClientDataModel;
}());
exports.ClientDataModel = ClientDataModel;
var ClientDataContext = /** @class */ (function () {
    function ClientDataContext(service, options) {
        this._service = service;
    }
    ClientDataContext.prototype.setBasicAuthorization = function (username, password) {
        this.getService().setHeader('Authorization', 'Basic ' + common_1.TextUtils.toBase64(username + ':' + password));
        return this;
    };
    ClientDataContext.prototype.setBearerAuthorization = function (access_token) {
        this.getService().setHeader('Authorization', 'Bearer ' + access_token);
        return this;
    };
    /**
     * Gets a string which represents the base URL of the MOST Web Application Server.
     * @returns {string}
     */
    ClientDataContext.prototype.getBase = function () {
        return this._service.getBase();
    };
    /**
     * Sets a string which represents the base URL of the MOST Web Application Server.
     */
    ClientDataContext.prototype.setBase = function (value) {
        this._service.setBase(value);
        return this;
    };
    /**
     * Gets the instance of ClientDataService class which is associated with this data context.
     * @returns {ClientDataServiceBase}
     */
    ClientDataContext.prototype.getService = function () {
        return this._service;
    };
    /**
     * Gets an instance of ClientDataModel class
     * @param name - A string which represents the name of the data model.
     * @returns {ClientDataModel}
     */
    ClientDataContext.prototype.model = function (name) {
        common_1.Args.notEmpty(name, 'Model name');
        return new ClientDataModel(name, this.getService());
    };
    return ClientDataContext;
}());
exports.ClientDataContext = ClientDataContext;
var ClientDataService = /** @class */ (function () {
    function ClientDataService(base, options) {
        this._headers = {};
        this._options = options || {
            useMediaTypeExtensions: true
        };
        if (typeof base === 'undefined' || base == null) {
            this._base = '/';
        }
        else {
            this._base = base;
            if (!/\/$/.test(this._base)) {
                this._base += '/';
            }
        }
    }
    ClientDataService.prototype.getOptions = function () {
        return this._options;
    };
    ClientDataService.prototype.setHeader = function (name, value) {
        this._headers[name] = value;
    };
    ClientDataService.prototype.getHeaders = function () {
        return this._headers;
    };
    ClientDataService.prototype.getBase = function () {
        return this._base;
    };
    /**
     * Sets a string which represents the base URL of a client data service.
     */
    ClientDataService.prototype.setBase = function (value) {
        // validate
        common_1.Args.notEmpty(value, 'Base URL');
        // set service base
        this._base = /\/$/.test(value) ? value : value + '/';
        // return this
        return this;
    };
    ClientDataService.prototype.resolve = function (relative) {
        if (typeof relative === 'string' && relative.length > 0) {
            if (/^\//.test(relative)) {
                return this.getBase() + relative.substr(1);
            }
            else {
                return this.getBase() + relative;
            }
        }
        throw new Error('Invalid argument. Expected a not empty string.');
    };
    ClientDataService.prototype.execute = function (options) {
        throw new Error('Method not implemented.');
    };
    return ClientDataService;
}());
exports.ClientDataService = ClientDataService;
var ParserDataService = /** @class */ (function (_super) {
    __extends(ParserDataService, _super);
    function ParserDataService(base, options) {
        return _super.call(this, base, options) || this;
    }
    ParserDataService.prototype.execute = function (options) {
        throw new Error('Method not allowed.');
    };
    return ParserDataService;
}(ClientDataService));
exports.ParserDataService = ParserDataService;
//# sourceMappingURL=client.js.map