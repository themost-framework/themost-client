"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
describe('test client data queryable', function () {
    it('should parse url', function (done) {
        var x = index_1.ClientDataQueryable.parse("/order/index.json");
        console.log(x.takePrevious(25).toString());
        console.log(x.takeNext(25).toString());
        console.log(x.takePrevious(125).toString());
        console.log(x.takeNext(25).toString());
        x = index_1.ClientDataQueryable.parse("/order/index.json?$skip=50&$top=25&$orderby=orderedItem/price desc,orderedItem/name");
        console.log(x.takeNext(25).toString());
        console.log(x.takeNext(25).toString());
        console.log(x.takePrevious(25).toString());
        return done();
    });
});
//# sourceMappingURL=test-queryable.js.map