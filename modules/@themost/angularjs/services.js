"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var client_1 = require("./client");
var ngModule = angular.module('most.services', []);
var ContextProvider = /** @class */ (function () {
    function ContextProvider() {
        this.defaults = {
            "base": "/",
            "options": {
                "useMediaTypeExtensions": true
            }
        };
    }
    ContextProvider.prototype.$get = function ($http, $q) {
        return new client_1.AngularDataContext(this.defaults.base, $http, $q, this.defaults.options);
    };
    ;
    return ContextProvider;
}());
ngModule.provider("$context", ContextProvider);
exports.default = 'most.services';
//# sourceMappingURL=services.js.map