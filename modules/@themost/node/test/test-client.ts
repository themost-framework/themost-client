import {NodeDataContext} from "../client";
import mocha = require('mocha');
import {assert} from 'chai';
import Table = require('easy-table');
describe('test node client', ()=> {

    const context = new NodeDataContext("http://localhost:3000/");

    context.setBasicAuthorization("alexis.rees@example.com","user");

    it('should authenticate and get products', (done)=> {
        context.model('Product').where('category').equal('Laptops').getItems().then((result) => {
            result.forEach(function(x) {
                assert.equal(x.category,'Laptops','Invalid category');
            });
            console.log(Table.print(result));
            return done();
        }).catch((err)=> {
            return done(err);
        });
    });

    it('should use select and expand', (done)=> {
        context.model("Order")
            .select("id","customer", "orderedDate", "orderNumber", "orderStatus/alternateName")
            .expand("customer")
            .where("orderStatus/alternateName")
            .equal("OrderPaymentDue")
            .orderBy("orderedDate")
            .take(10)
            .getItems().then(function(result) {
            result.forEach(function(x) {
                assert.typeOf(x.customer,'object','Customer should be an object');
            });
            console.log(Table.print(result));
            return done();
        }).catch((err) => {
            return done(err);
        });
    });

    it('should use property aliases', (done)=> {
        context.model("Order")
            .asQueryable()
            .select("id","customer/description as customerDescription", "orderDate", "orderedItem/name as orderedItemName")
            .where("paymentMethod/alternateName").equal("DirectDebit")
            .orderByDescending("orderDate")
            .take(10)
            .getItems()
            .then(function (result) {
                result.forEach(function(x) {
                    assert.typeOf(x.customerDescription,'string','Customer description');
                });
                console.log(Table.print(result));
                return done();
            }).catch(function (err) {
            return done(err);
        });
    });

    it('should use greater than expression', (done)=> {
        context.model("Order")
            .where("orderedItem/price").greaterThan(968)
            .and("orderedItem/category").equal("Laptops")
            .and("orderStatus/alternateName").notEqual("OrderCancelled")
            .select("id",
                "orderedItem/price as price",
                "orderStatus/name as orderStatusName",
                "customer/description as customerDescription",
                "orderedItem")
            .orderByDescending("orderDate")
            .take(10)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isAtLeast(x.price,968,'Invalid product price');
                });
                console.log(Table.print(result));
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

});