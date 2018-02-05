"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var client_1 = require("./client");
var DataComponent = /** @class */ (function () {
    function DataComponent(context) {
        this.context = context;
        //
    }
    DataComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (typeof this.model === 'undefined' || this.model === null) {
            return;
        }
        var q = this.context.model(this.model).asQueryable();
        if (typeof this.url === 'string' && this.url.length > 0) {
            q.setUrl(this.url);
        }
        if (typeof this.filter === 'string' && this.filter.length > 0) {
            q.setParam('$filter', this.filter);
        }
        if (typeof this.select === 'string' && this.select.length > 0) {
            q.setParam('$select', this.select);
        }
        if (typeof this.group === 'string' && this.group.length > 0) {
            q.setParam('$group', this.group);
        }
        if (typeof this.order === 'string' && this.order.length > 0) {
            q.setParam('$order', this.order);
        }
        if (typeof this.expand === 'string' && this.expand.length > 0) {
            q.setParam('$expand', this.expand);
        }
        if (this.skip > 0) {
            q.setParam('$skip', this.skip);
        }
        if (this.top > 0) {
            q.setParam('$top', this.skip);
        }
        if (this.count) {
            q.setParam('$count', true);
        }
        //set queryable
        q.getItems().then(function (result) {
            if (_this.top === 1) {
                _this.value = result[0];
            }
            else {
                _this.value = result;
            }
            console.log(_this.value);
        }).catch(function (err) {
            //
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataComponent.prototype, "filter", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataComponent.prototype, "model", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataComponent.prototype, "select", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataComponent.prototype, "group", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataComponent.prototype, "order", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], DataComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataComponent.prototype, "count", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], DataComponent.prototype, "skip", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataComponent.prototype, "expand", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataComponent.prototype, "url", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DataComponent.prototype, "value", void 0);
    DataComponent = __decorate([
        core_1.Component({
            selector: 'most-data',
            template: '<div></div>'
        }),
        __metadata("design:paramtypes", [client_1.AngularDataContext])
    ], DataComponent);
    return DataComponent;
}());
exports.DataComponent = DataComponent;
//# sourceMappingURL=components.js.map