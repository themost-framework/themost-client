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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var index_1 = require("@themost/client/index");
var common_1 = require("@themost/client/common");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
exports.DATA_CONTEXT_CONFIG = {
    base: '/',
    options: {
        useMediaTypeExtensions: true
    }
};
var AngularDataContext = /** @class */ (function (_super) {
    __extends(AngularDataContext, _super);
    function AngularDataContext(http, config) {
        var _this = _super.call(this, new AngularDataService(config.base, http, config.options), config.options) || this;
        _this.http = http;
        return _this;
    }
    AngularDataContext = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject(exports.DATA_CONTEXT_CONFIG)),
        __metadata("design:paramtypes", [http_1.HttpClient, Object])
    ], AngularDataContext);
    return AngularDataContext;
}(index_1.ClientDataContext));
exports.AngularDataContext = AngularDataContext;
var AngularDataService = /** @class */ (function (_super) {
    __extends(AngularDataService, _super);
    /**
     * Initializes a new instance of ClientDataService class
     * @param {string} base - The base URI of the MOST Web Framework Application Server. The default value is '/' for accessing local services.
     * @param {Http}  http
     * @param {ClientDataContextOptions} options
     */
    function AngularDataService(base, http, options) {
        var _this = _super.call(this, base || "/", options) || this;
        _this.http = http;
        return _this;
    }
    AngularDataService.prototype.execute = function (options) {
        var _this = this;
        var self = this;
        //options defaults
        options.method = options.method || "GET";
        options.headers = __assign({}, this.getHeaders(), options.headers);
        //set content type
        options.headers["Content-Type"] = "application/json";
        //validate options URL
        common_1.Args.notNull(options.url, "Request URL");
        //validate URL format
        common_1.Args.check(!/^https?:\/\//i.test(options.url), "Request URL may not be an absolute URI");
        //validate request method
        common_1.Args.check(/^GET|POST|PUT|DELETE|PATCH$/i.test(options.method), "Invalid request method. Expected GET, POST, PUT or DELETE.");
        //set URL parameter
        var finalURL = self.getBase() + options.url.replace(/^\//i, "");
        var finalParams = new http_1.HttpParams();
        var finalBody;
        if (/^GET$/i.test(options.method) && options.data) {
            Object.getOwnPropertyNames(options.data).forEach(function (key) {
                finalParams = finalParams.append(key, options.data[key]);
            });
        }
        else {
            finalBody = options.data;
        }
        return new Promise(function (resolve, reject) {
            _this.http.request(options.method, finalURL, {
                body: finalBody,
                headers: new http_1.HttpHeaders(options.headers),
                observe: 'response',
                params: finalParams,
                reportProgress: false,
                responseType: 'text',
                withCredentials: true
            }).subscribe(function (res) {
                if (res.status === 204) {
                    return resolve();
                }
                else {
                    var finalRes = JSON.parse(res.body, function (key, value) {
                        if (common_1.TextUtils.isDate(value)) {
                            return new Date(value);
                        }
                        return value;
                    });
                    return resolve(finalRes);
                }
            }, function (err) {
                if (err.error && typeof err.error === 'string') {
                    //try parse error
                    try {
                        err.error = JSON.parse(err.error);
                    }
                    catch (parserError) {
                        //
                    }
                }
                return reject(err);
            });
        });
    };
    return AngularDataService;
}(index_1.ClientDataService));
exports.AngularDataService = AngularDataService;
//# sourceMappingURL=client.js.map