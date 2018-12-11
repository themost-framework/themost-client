"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var components_1 = require("./components");
var client_1 = require("./client");
var ɵ0 = {
    base: "/",
    options: {
        useMediaTypeExtensions: true
    }
};
exports.ɵ0 = ɵ0;
var MostModule = /** @class */ (function () {
    function MostModule() {
    }
    MostModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [],
                    declarations: [components_1.DataComponent],
                    exports: [components_1.DataComponent],
                    providers: [{
                            provide: client_1.DATA_CONTEXT_CONFIG, useValue: ɵ0
                        }]
                },] },
    ];
    return MostModule;
}());
exports.MostModule = MostModule;
//# sourceMappingURL=module.js.map