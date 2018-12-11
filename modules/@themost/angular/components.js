"use strict";
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
            q.setParam('$top', this.top);
        }
        if (this.count) {
            q.setParam('$count', true);
        }
        if (this.count) {
            return q.getList().then(function (result) {
                _this.value = result;
            }).catch(function (err) {
                //
            });
        }
        //set queryable
        q.getItems().then(function (result) {
            if (_this.top === 1) {
                if (result && result.value instanceof Array) {
                    _this.value = result.value[0];
                }
                else {
                    _this.value = result[0];
                }
            }
            else {
                _this.value = result;
            }
        }).catch(function (err) {
            //
        });
    };
    DataComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'most-data',
                    template: '<div></div>'
                },] },
    ];
    /** @nocollapse */
    DataComponent.ctorParameters = function () { return [
        { type: client_1.AngularDataContext }
    ]; };
    DataComponent.propDecorators = {
        filter: [{ type: core_1.Input }],
        model: [{ type: core_1.Input }],
        select: [{ type: core_1.Input }],
        group: [{ type: core_1.Input }],
        order: [{ type: core_1.Input }],
        top: [{ type: core_1.Input }],
        count: [{ type: core_1.Input }],
        skip: [{ type: core_1.Input }],
        expand: [{ type: core_1.Input }],
        url: [{ type: core_1.Input }],
        value: [{ type: core_1.Output }]
    };
    return DataComponent;
}());
exports.DataComponent = DataComponent;
//# sourceMappingURL=components.js.map