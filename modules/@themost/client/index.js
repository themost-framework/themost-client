"use strict";
/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var ClientQueryExpression = /** @class */ (function () {
    function ClientQueryExpression() {
    }
    return ClientQueryExpression;
}());
var ClientDataQueryable = /** @class */ (function () {
    function ClientDataQueryable(model, service) {
        common_1.Args.notEmpty(model, "Model");
        this.model_ = model;
        common_1.Args.notNull(service, "Data Service");
        this.service_ = service;
        this.url_ = common_1.TextUtils.format("%s/index.json", this.model_);
        //init params
        this.params_ = {};
        //init privates
        this.privates_ = new ClientQueryExpression();
    }
    /**
     * @returns {ClientDataServiceBase}
     */
    ClientDataQueryable.prototype.getService = function () {
        return this.service_;
    };
    /**
     * @returns {DataServiceQueryParams}
     */
    ClientDataQueryable.prototype.getParams = function () {
        return this.params_;
    };
    /**
     * @returns {ClientDataQueryable}
     */
    ClientDataQueryable.prototype.setParam = function (name, value) {
        if (/^\$/.test(name)) {
            this.params_[name] = value;
        }
        else {
            this.params_["$" + name] = value;
        }
        return this;
    };
    /**
     * Gets a string which represents the name of the data model associated with this object.
     * @returns {string}
     */
    ClientDataQueryable.prototype.getModel = function () {
        return this.model_;
    };
    /**
     * Gets a string which represents the relative URL associated with this object.
     * @returns {string}
     */
    ClientDataQueryable.prototype.getUrl = function () {
        return this.url_;
    };
    /**
     * Sets the relative URL associated with this object.
     * @param value - A string which represents a relative URI.
     */
    ClientDataQueryable.prototype.setUrl = function (value) {
        common_1.Args.notEmpty(value, "URL");
        common_1.Args.check(!common_1.TextUtils.isAbsoluteURI(value), "URL must be a relative URI");
        this.url_ = value;
    };
    ClientDataQueryable.create = function (model, service) {
        return new ClientDataQueryable(model, service);
    };
    ClientDataQueryable.prototype.append_ = function () {
        common_1.Args.notNull(this.privates_.left, "Left operand");
        common_1.Args.notNull(this.privates_.op, "Comparison operator");
        var expr;
        if (Array.isArray(this.privates_.right)) {
            common_1.Args.check((this.privates_.op === "eq") || (this.privates_.op === "ne"), "Wrong operator. Expected equal or not equal");
            common_1.Args.check(this.privates_.right.length > 0, "Array may not be empty");
            var arr = this.privates_.right.map(function (x) {
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
        if (common_1.TextUtils.isNotEmptyString(this.params_.$filter)) {
            this.params_.$filter = this.params_.$filter + " " + this.privates_.lop + " " + expr;
        }
        else {
            this.params_.$filter = expr;
        }
        //clear object
        this.privates_.left = null;
        this.privates_.op = null;
        this.privates_.right = null;
        return this;
    };
    ClientDataQueryable.prototype.escape_ = function (val) {
        if ((val == null) || (val == undefined)) {
            return "null";
        }
        if (typeof val === 'boolean') {
            return (val) ? "true" : "false";
        }
        if (typeof val === 'number') {
            return val + "";
        }
        if (val instanceof Date) {
            var dt = new Date(val);
            var year = dt.getFullYear();
            var month = common_1.TextUtils.zeroPad(dt.getMonth() + 1, 2);
            var day = common_1.TextUtils.zeroPad(dt.getDate(), 2);
            var hour = common_1.TextUtils.zeroPad(dt.getHours(), 2);
            var minute = common_1.TextUtils.zeroPad(dt.getMinutes(), 2);
            var second = common_1.TextUtils.zeroPad(dt.getSeconds(), 2);
            var millisecond = common_1.TextUtils.zeroPad(dt.getMilliseconds(), 3);
            //format timezone
            var offset = (new Date()).getTimezoneOffset(), timezone = (offset >= 0 ? '+' : '') + common_1.TextUtils.zeroPad(Math.floor(offset / 60), 2) + ':' + common_1.TextUtils.zeroPad(offset % 60, 2);
            return "'" + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millisecond + timezone + "'";
        }
        if (val instanceof Array) {
            var values_1 = [];
            val.forEach(function (x) {
                values_1.push(this.escape_(x));
            });
            return values_1.join(',');
        }
        if (typeof val === "string") {
            var res = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
                switch (s) {
                    case "\0": return "\\0";
                    case "\n": return "\\n";
                    case "\r": return "\\r";
                    case "\b": return "\\b";
                    case "\t": return "\\t";
                    case "\x1a": return "\\Z";
                    default: return "\\" + s;
                }
            });
            return "'" + res + "'";
        }
        //otherwise get valueOf
        if (val.hasOwnProperty("$name"))
            return val["$name"];
        else
            return this.escape_(val.valueOf());
    };
    ClientDataQueryable.prototype.where = function (name) {
        common_1.Args.notEmpty(name, "Left operand");
        this.privates_.left = name;
        return this;
    };
    ClientDataQueryable.prototype.and = function (name) {
        common_1.Args.notEmpty(name, "Left operand");
        this.privates_.left = name;
        this.privates_.lop = "and";
        return this;
    };
    ClientDataQueryable.prototype.andAlso = function (name) {
        common_1.Args.notEmpty(name, "Left operand");
        this.privates_.left = name;
        this.privates_.lop = "and";
        if (!common_1.TextUtils.isNullOrUndefined(this.params_.$filter)) {
            this.params_.$filter = "(" + this.params_.$filter + ")";
        }
        return this;
    };
    ClientDataQueryable.prototype.or = function (name) {
        common_1.Args.notEmpty(name, "Left operand");
        this.privates_.left = name;
        this.privates_.lop = "or";
        return this;
    };
    ClientDataQueryable.prototype.orElse = function (name) {
        common_1.Args.notEmpty(name, "Left operand");
        this.privates_.left = name;
        this.privates_.lop = "or";
        if (!common_1.TextUtils.isNullOrUndefined(this.params_.$filter)) {
            this.params_.$filter = "(" + this.params_.$filter + ")";
        }
        return this;
    };
    ClientDataQueryable.prototype.compare_ = function (op, value) {
        common_1.Args.notNull(this.privates_.left, "The left operand");
        this.privates_.op = op;
        this.privates_.right = value;
        return this.append_();
    };
    ClientDataQueryable.prototype.equal = function (value) {
        return this.compare_("eq", value);
    };
    ClientDataQueryable.prototype.notEqual = function (value) {
        return this.compare_("ne", value);
    };
    ClientDataQueryable.prototype.greaterThan = function (value) {
        return this.compare_("gt", value);
    };
    ClientDataQueryable.prototype.greaterOrEqual = function (value) {
        return this.compare_("ge", value);
    };
    ClientDataQueryable.prototype.lowerThan = function (value) {
        return this.compare_("lt", value);
    };
    ClientDataQueryable.prototype.lowerOrEqual = function (value) {
        return this.compare_("le", value);
    };
    /**
     * @param {*} value1
     * @param {*} value2
     * @returns {ClientDataQueryable}
     */
    ClientDataQueryable.prototype.between = function (value1, value2) {
        common_1.Args.notNull(this.privates_.left, "The left operand");
        //generate new filter
        var s = ClientDataQueryable.create(this.getModel())
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
        this.privates_.left = null;
        this.privates_.op = null;
        this.privates_.right = null;
        this.privates_.lop = null;
        return this;
    };
    ClientDataQueryable.prototype.toFilter = function () {
        return this.params_.$filter;
    };
    ClientDataQueryable.prototype.contains = function (value) {
        common_1.Args.notNull(this.privates_.left, "The left operand");
        this.privates_.op = 'ge';
        this.privates_.left = common_1.TextUtils.format('indexof(%s,%s)', this.privates_.left, this.escape_(value));
        this.privates_.right = 0;
        return this.append_();
    };
    ClientDataQueryable.prototype.aggregate_ = function (fn) {
        common_1.Args.notNull(this.privates_.left, "The left operand");
        this.privates_.left = common_1.TextUtils.format('%s(%s)', fn, this.privates_.left);
        return this;
    };
    ClientDataQueryable.prototype.getDate = function () {
        return this.aggregate_("date");
    };
    ClientDataQueryable.prototype.getDay = function () {
        return this.aggregate_("day");
    };
    ClientDataQueryable.prototype.getMonth = function () {
        return this.aggregate_("month");
    };
    ClientDataQueryable.prototype.getYear = function () {
        return this.aggregate_("year");
    };
    ClientDataQueryable.prototype.getFullYear = function () {
        return this.aggregate_("year");
    };
    ClientDataQueryable.prototype.getHours = function () {
        return this.aggregate_("hour");
    };
    ClientDataQueryable.prototype.getMinutes = function () {
        return this.aggregate_("minute");
    };
    ClientDataQueryable.prototype.getSeconds = function () {
        return this.aggregate_("second");
    };
    ClientDataQueryable.prototype.length = function () {
        return this.aggregate_("length");
    };
    ClientDataQueryable.prototype.trim = function () {
        return this.aggregate_("trim");
    };
    ClientDataQueryable.prototype.toLocaleLowerCase = function () {
        return this.aggregate_("tolower");
    };
    ClientDataQueryable.prototype.toLowerCase = function () {
        return this.aggregate_("tolower");
    };
    ClientDataQueryable.prototype.toLocaleUpperCase = function () {
        return this.aggregate_("toupper");
    };
    ClientDataQueryable.prototype.toUpperCase = function () {
        return this.aggregate_("toupper");
    };
    ClientDataQueryable.prototype.round = function () {
        return this.aggregate_("round");
    };
    ClientDataQueryable.prototype.floor = function () {
        return this.aggregate_("floor");
    };
    ClientDataQueryable.prototype.ceil = function () {
        return this.aggregate_("ceiling");
    };
    ClientDataQueryable.prototype.indexOf = function (s) {
        common_1.Args.notNull(this.privates_.left, "The left operand");
        this.privates_.left = common_1.TextUtils.format('indexof(%s,%s)', this.privates_.left, this.escape_(s));
        return this;
    };
    ClientDataQueryable.prototype.substr = function (pos, length) {
        common_1.Args.notNull(this.privates_.left, "The left operand");
        this.privates_.left = common_1.TextUtils.format('substring(%s,%s,%s)', this.privates_.left, pos, length);
        return this;
    };
    ClientDataQueryable.prototype.startsWith = function (s) {
        common_1.Args.notNull(this.privates_.left, "The left operand");
        this.privates_.left = common_1.TextUtils.format('startswith(%s,%s)', this.privates_.left, this.escape_(s));
        return this;
    };
    ClientDataQueryable.prototype.endsWith = function (s) {
        common_1.Args.notNull(this.privates_.left, "The left operand");
        this.privates_.left = common_1.TextUtils.format('endswith(%s,%s)', this.privates_.left, this.escape_(s));
        return this;
    };
    ClientDataQueryable.prototype.select = function () {
        var attr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attr[_i] = arguments[_i];
        }
        common_1.Args.notNull(attr, "Attributes");
        common_1.Args.check(attr.length > 0, "Attributes may not be empty");
        var arr = [];
        for (var i = 0; i < attr.length; i++) {
            common_1.Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
            arr.push(attr[i]);
        }
        this.params_.$select = arr.join(",");
        return this;
    };
    ClientDataQueryable.prototype.groupBy = function () {
        var attr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attr[_i] = arguments[_i];
        }
        common_1.Args.notNull(attr, "Attributes");
        common_1.Args.check(attr.length > 0, "Attributes may not be empty");
        var arr = [];
        for (var i = 0; i < attr.length; i++) {
            common_1.Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
            arr.push(attr[i]);
        }
        this.params_.$groupby = arr.join(",");
        return this;
    };
    ClientDataQueryable.prototype.expand = function () {
        var attr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attr[_i] = arguments[_i];
        }
        common_1.Args.notNull(attr, "Attributes");
        common_1.Args.check(attr.length > 0, "Attributes may not be empty");
        var arr = [];
        for (var i = 0; i < attr.length; i++) {
            common_1.Args.check(typeof attr[i] === "string", "Invalid attribute. Expected string.");
            arr.push(attr[i]);
        }
        this.params_.$expand = arr.join(",");
        return this;
    };
    ClientDataQueryable.prototype.orderBy = function (attr) {
        common_1.Args.notEmpty(attr, "Order by attribute");
        this.params_.$orderby = attr.toString();
        return this;
    };
    ClientDataQueryable.prototype.thenBy = function (attr) {
        common_1.Args.notEmpty(attr, "Order by attribute");
        this.params_.$orderby += (this.params_.$orderby ? ',' + attr.toString() : attr.toString());
        return this;
    };
    ClientDataQueryable.prototype.orderByDescending = function (attr) {
        common_1.Args.notEmpty(attr, "Order by attribute");
        this.params_.$orderby = attr.toString() + " desc";
        return this;
    };
    ClientDataQueryable.prototype.thenByDescending = function (attr) {
        common_1.Args.notEmpty(attr, "Order by attribute");
        this.params_.$orderby += (this.params_.$orderby ? ',' + attr.toString() : attr.toString()) + " desc";
        return this;
    };
    ClientDataQueryable.prototype.skip = function (num) {
        this.params_.$skip = num;
        return this;
    };
    ClientDataQueryable.prototype.take = function (num) {
        this.params_.$top = num;
        return this;
    };
    ClientDataQueryable.prototype.first = function () {
        delete this.params_.$top;
        delete this.params_.$skip;
        delete this.params_.$count;
        this.params_.$first = true;
        return this.getService().execute({
            method: "GET",
            url: this.getUrl(),
            data: this.params_,
            headers: []
        });
    };
    ClientDataQueryable.prototype.list = function () {
        delete this.params_.$first;
        this.params_.$count = true;
        return this.getService().execute({
            method: "GET",
            url: this.getUrl(),
            data: this.params_,
            headers: {}
        });
    };
    ClientDataQueryable.prototype.item = function () {
        return this.first();
    };
    ClientDataQueryable.prototype.getItem = function () {
        return this.first();
    };
    ClientDataQueryable.prototype.items = function () {
        delete this.params_.$first;
        this.params_.$count = false;
        return this.getService().execute({
            method: "GET",
            url: this.getUrl(),
            data: this.params_,
            headers: {}
        });
    };
    ClientDataQueryable.prototype.getItems = function () {
        return this.items();
    };
    ClientDataQueryable.prototype.getList = function () {
        return this.list();
    };
    ClientDataQueryable.prototype.filter = function (s) {
        common_1.Args.notEmpty("s", "Filter expression");
        this.params_.$filter = s;
        return this;
    };
    ClientDataQueryable.prototype.levels = function (n) {
        common_1.Args.Positive(n, 'Levels');
        this.params_.$levels = n;
        return this;
    };
    return ClientDataQueryable;
}());
exports.ClientDataQueryable = ClientDataQueryable;
var ClientDataModel = /** @class */ (function () {
    function ClientDataModel(name, service) {
        this.name_ = name;
        this.service_ = service;
    }
    /**
     * @returns {ClientDataServiceBase}
     */
    ClientDataModel.prototype.getService = function () {
        return this.service_;
    };
    ClientDataModel.prototype.getName = function () {
        return this.name_;
    };
    ClientDataModel.prototype.asQueryable = function () {
        return ClientDataQueryable.create(this.getName(), this.service_);
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
    ClientDataModel.prototype.save = function (obj) {
        return this.getService().execute({
            method: "POST",
            url: common_1.TextUtils.format("%s/index.json", this.getName()),
            data: obj,
            headers: {}
        });
    };
    ClientDataModel.prototype.schema = function () {
        return this.getService().execute({ method: "GET",
            url: common_1.TextUtils.format("%s/schema.json", this.getName()),
            data: null,
            headers: {}
        });
    };
    ClientDataModel.prototype.remove = function (obj) {
        return this.getService().execute({ method: "DELETE",
            url: common_1.TextUtils.format("%s/index.json", this.getName()),
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
    function ClientDataContext(service) {
        this.service_ = service;
    }
    ClientDataContext.prototype.setBasicAuthorization = function (username, password) {
        this.getService().setHeader("Authorization", "Basic " + common_1.TextUtils.toBase64(username + ":" + password));
        return this;
    };
    ClientDataContext.prototype.setBearerAuthorization = function (access_token) {
        this.getService().setHeader("Authorization", "Bearer " + access_token);
        return this;
    };
    /**
     * Gets a string which represents the base URL of the MOST Web Application Server.
     * @returns {string}
     */
    ClientDataContext.prototype.getBase = function () {
        return this.base_;
    };
    /**
     * Sets a string which represents the base URL of the MOST Web Application Server.
     */
    ClientDataContext.prototype.setBase = function (value) {
        common_1.Args.notEmpty(value, "Base URL");
        this.base_ = value;
        return this;
    };
    /**
     * Gets the instance of ClientDataService class which is associated with this data context.
     * @returns {ClientDataServiceBase}
     */
    ClientDataContext.prototype.getService = function () {
        return this.service_;
    };
    /**
     * Gets an instance of ClientDataModel class
     * @param name - A string which represents the name of the data model.
     * @returns {ClientDataModel}
     */
    ClientDataContext.prototype.model = function (name) {
        common_1.Args.notEmpty(name, "Model name");
        return new ClientDataModel(name, this.getService());
    };
    return ClientDataContext;
}());
exports.ClientDataContext = ClientDataContext;
var ClientDataService = /** @class */ (function () {
    function ClientDataService(base) {
        this.headers_ = {};
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
    ClientDataService.prototype.setHeader = function (name, value) {
        this.headers_[name] = value;
    };
    ClientDataService.prototype.getHeaders = function () {
        return this.headers_;
    };
    ClientDataService.prototype.getBase = function () {
        return this.base_;
    };
    ClientDataService.prototype.resolve = function (relative) {
        if (typeof relative === 'string' && relative.length > 0) {
            if (/^\//.test(relative))
                return this.getBase() + relative.substr(1);
            else
                return this.getBase() + relative;
        }
        throw new Error("Invalid argument. Expected a not empty string.");
    };
    ClientDataService.prototype.execute = function (options) {
        throw new Error("Method not implemented.");
    };
    return ClientDataService;
}());
exports.ClientDataService = ClientDataService;
//# sourceMappingURL=index.js.map