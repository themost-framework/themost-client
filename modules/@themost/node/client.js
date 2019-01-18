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
var unirest = require("unirest");
var client_1 = require("@themost/client");
var common_1 = require("@themost/client/common");
var REG_DATETIME_ISO = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?([+-](\d+):(\d+))?$/;
function dateParser(key, value) {
    if ((typeof value === 'string') && REG_DATETIME_ISO.test(value)) {
        return new Date(value);
    }
    return value;
}
var NodeDataContext = /** @class */ (function (_super) {
    __extends(NodeDataContext, _super);
    function NodeDataContext(base, options) {
        return _super.call(this, new NodeDataService(base || "/", options)) || this;
    }
    return NodeDataContext;
}(client_1.ClientDataContext));
exports.NodeDataContext = NodeDataContext;
var NodeDataService = /** @class */ (function (_super) {
    __extends(NodeDataService, _super);
    /**
     * @param {string} base
     * @param {ClientDataContextOptions} options
     */
    function NodeDataService(base, options) {
        return _super.call(this, base, options) || this;
    }
    NodeDataService.prototype.execute = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                //options defaults
                options.method = options.method || "GET";
                options.headers = __assign({}, _this.getHeaders(), options.headers);
                //validate options URL
                common_1.Args.notNull(options.url, "Request URL");
                //validate URL format
                common_1.Args.check(!/^https?:\/\//i.test(options.url), "Request URL may not be an absolute URI");
                //validate request method
                common_1.Args.check(/^GET|POST|PUT|DELETE$/i.test(options.method), "Invalid request method. Expected GET, POST, PUT or DELETE.");
                //initialize unirest method e.g. unirest.get(URL), unirest.post(URL) etc.
                var requestURL = _this.resolve(options.url);
                var request = unirest[options.method.toLowerCase()](requestURL);
                //set request type
                request.type("application/json");
                //set headers
                request.headers(options.headers);
                //set query params
                if (/^GET$/i.test(options.method) && options.data) {
                    request.query(options.data);
                }
                else if (options.data) {
                    request.send(options.data);
                }
                //complete request
                request.end(function (response) {
                    if (response.status === 200) {
                        if (typeof response.raw_body === 'object') {
                            //stringify raw_body
                            var raw_body_str = JSON.stringify(response.raw_body);
                            //and parse final raw_body string (with date reviver)
                            return resolve(JSON.parse(raw_body_str, dateParser));
                        }
                        else if ((typeof response.raw_body === 'string') && response.raw_body.length > 0) {
                            return resolve(JSON.parse(response.raw_body, dateParser));
                        }
                        return resolve();
                    }
                    else if (response.status === 204) {
                        return resolve();
                    }
                    else {
                        var res = response.toJSON();
                        if (typeof res.body === 'object') {
                            var err = Object.assign(new common_1.ResponseError(res.body.message || response.statusMessage, response.status), res.body);
                            if (err.hasOwnProperty("status")) {
                                //delete status because of ResponseError.statusCode property
                                delete err.status;
                            }
                            return reject(err);
                        }
                        return reject(new common_1.ResponseError(response.statusMessage, response.status));
                    }
                });
            }
            catch (err) {
                reject(err);
            }
        });
    };
    ;
    return NodeDataService;
}(client_1.ClientDataService));
exports.NodeDataService = NodeDataService;
//# sourceMappingURL=client.js.map