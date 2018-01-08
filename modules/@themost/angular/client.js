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
var common_1 = require("@themost/client/common");
var http_1 = require("@angular/common/http");
var client_1 = require("@themost/client");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
exports.DATA_CONTEXT_CONFIG = {
    base: '/',
    options: {
        useMediaTypeExtensions: true
    }
};
var AngularDataContext = /** @class */ (function (_super) {
    __extends(AngularDataContext, _super);
    function AngularDataContext(http, config) {
        var _this = _super.call(this, new AngularDataService(config.base, http), config.options) || this;
        _this.http = http;
        return _this;
    }
    AngularDataContext = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject(exports.DATA_CONTEXT_CONFIG)),
        __metadata("design:paramtypes", [http_1.HttpClient, Object])
    ], AngularDataContext);
    return AngularDataContext;
}(client_1.ClientDataContext));
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
        _this.http_ = http;
        return _this;
    }
    AngularDataService.prototype.getHeaders = function () {
        throw new Error("Method not implemented.");
    };
    AngularDataService.prototype.resolve = function (relative) {
        throw new Error("Method not implemented.");
    };
    AngularDataService.prototype.execute = function (options) {
        var self = this;
        //options defaults
        options.method = options.method || "GET";
        options.headers = options.headers || {};
        //set content type
        options.headers["Content-Type"] = "application/json";
        //validate options URL
        common_1.Args.notNull(options.url, "Request URL");
        //validate URL format
        common_1.Args.check(!/^https?:\/\//i.test(options.url), "Request URL may not be an absolute URI");
        //validate request method
        common_1.Args.check(/^GET|POST|PUT|DELETE$/i.test(options.method), "Invalid request method. Expected GET, POST, PUT or DELETE.");
        //set URL parameter
        var url_ = self.getBase() + options.url.replace(/^\//i, "");
        var requestOptions = {
            headers: options.headers,
            search: null,
            body: null
        };
        //if request is a GET HTTP Request
        if (/^GET$/i.test(options.method)) {
            requestOptions.search = options.data;
        }
        else {
            requestOptions.body = options.data;
        }
        return this.http_.request(options.method, url_, requestOptions).map(function (res) {
            if (res.status === 204) {
                return;
            }
            else {
                return res.text().then(function (text) {
                    return JSON.parse(text, function (key, value) {
                        if (common_1.TextUtils.isDate(value)) {
                            return new Date(value);
                        }
                        return value;
                    });
                });
            }
        }).toPromise();
    };
    return AngularDataService;
}(client_1.ClientDataService));
exports.AngularDataService = AngularDataService;
//# sourceMappingURL=client.js.map