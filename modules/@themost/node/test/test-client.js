"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("../client");
var chai_1 = require("chai");
var Table = require("easy-table");
describe('test node client', function () {
    var context = new client_1.NodeDataContext("http://localhost:3000/");
    context.setBasicAuthorization("alexis.rees@example.com", "user");
    it('should authenticate and get products', function (done) {
        context.model('Product').where('category').equal('Laptops').getItems().then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.equal(x.category, 'Laptops', 'Invalid category');
            });
            console.log(Table.print(result));
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use select and expand', function (done) {
        context.model("Order")
            .select("id", "customer", "orderedDate", "orderNumber", "orderStatus/alternateName")
            .expand("customer")
            .where("orderStatus/alternateName")
            .equal("OrderPaymentDue")
            .orderBy("orderedDate")
            .take(10)
            .getItems().then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.typeOf(x.customer, 'object', 'Customer should be an object');
            });
            console.log(Table.print(result));
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use property aliases', function (done) {
        context.model("Order")
            .asQueryable()
            .select("id", "customer/description as customerDescription", "orderDate", "orderedItem/name as orderedItemName")
            .where("paymentMethod/alternateName").equal("DirectDebit")
            .orderByDescending("orderDate")
            .take(10)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.typeOf(x.customerDescription, 'string', 'Customer description');
            });
            console.log(Table.print(result));
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use greater than expression', function (done) {
        context.model("Order")
            .where("orderedItem/price").greaterThan(968)
            .and("orderedItem/category").equal("Laptops")
            .and("orderStatus/alternateName").notEqual("OrderCancelled")
            .select("id", "orderedItem/price as price", "orderStatus/name as orderStatusName", "customer/description as customerDescription", "orderedItem")
            .orderByDescending("orderDate")
            .take(10)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isAtLeast(x.price, 968, 'Invalid product price');
            });
            console.log(Table.print(result));
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
});
//# sourceMappingURL=test-client.js.map