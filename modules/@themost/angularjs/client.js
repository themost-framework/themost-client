"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
var common_1 = require("@themost/client/common");
var client_1 = require("@themost/client");
var REG_DATETIME_ISO = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?([+-](\d+):(\d+))?$/;
function dateParser(key, value) {
    if ((typeof value === 'string') && REG_DATETIME_ISO.test(value)) {
        return new Date(value);
    }
    return value;
}
var AngularDataContext = /** @class */ (function (_super) {
    __extends(AngularDataContext, _super);
    function AngularDataContext(base, http, q) {
        return _super.call(this, new AngularDataService(base || "/", http, q)) || this;
    }
    return AngularDataContext;
}(client_1.ClientDataContext));
exports.AngularDataContext = AngularDataContext;
var AngularDataService = /** @class */ (function (_super) {
    __extends(AngularDataService, _super);
    /**
     *
     * @param {string} base
     * @param {*} http
     * @param {*} q
     */
    function AngularDataService(base, http, q) {
        var _this = _super.call(this, base) || this;
        _this.http = http;
        _this.q = q;
        return _this;
    }
    AngularDataService.prototype.execute = function (options) {
        var _this = this;
        var $http = this.http;
        var $q = this.q;
        return $q(function (resolve, reject) {
            try {
                //options defaults
                options.method = options.method || "GET";
                options.headers = __assign({}, _this.getHeaders(), options.headers);
                //set content type
                options.headers["Content-Type"] = "application/json";
                //validate options URL
                common_1.Args.notNull(options.url, "Request URL");
                //validate URL format
                common_1.Args.check(!/^https?:\/\//i.test(options.url), "Request URL may not be an absolute URI");
                //validate request method
                common_1.Args.check(/^GET|POST|PUT|DELETE$/i.test(options.method), "Invalid request method. Expected GET, POST, PUT or DELETE.");
                var url_ = _this.resolve(options.url);
                var o = {
                    method: options.method,
                    url: url_,
                    headers: options.headers,
                    transformResponse: function (data, headers, status) {
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
                $http(o).then(function (response) {
                    resolve(response.data);
                }, function (err) {
                    reject(err);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    };
    return AngularDataService;
}(client_1.ClientDataService));
exports.AngularDataService = AngularDataService;
//# sourceMappingURL=client.js.map