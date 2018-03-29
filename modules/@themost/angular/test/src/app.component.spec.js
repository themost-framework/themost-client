"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var app_component_1 = require("./app.component");
var chai_1 = require("chai");
var http_1 = require("@angular/common/http");
var client_1 = require("../../client");
describe('AppComponent', function () {
    var context;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                app_component_1.AppComponent
            ],
            providers: [
                {
                    provide: client_1.DATA_CONTEXT_CONFIG, useValue: {
                        base: 'http://localhost:3000/',
                        options: {
                            useMediaTypeExtensions: true
                        }
                    }
                },
                client_1.AngularDataContext
            ],
            imports: [http_1.HttpClientModule]
        }).compileComponents();
        var fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        context = testing_1.TestBed.get(client_1.AngularDataContext);
        context.setBasicAuthorization('alexis.rees@example.com', 'user');
    }));
    it('should use simple query', function (done) {
        context.model('Product').where('category').equal('Laptops').getItems().then(function (result) {
            console.log(result);
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use paging params', function (done) {
        context.model("Order")
            .where("orderStatus")
            .equal(1)
            .orderBy("orderDate")
            .take(10)
            .getItems().then(function (result) {
            //enumerate items
            console.log(result);
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use take', function (done) {
        context.model("Order")
            .where("orderedItem/category").equal("Laptops")
            .take(10)
            .getItems()
            .then(function (result) {
            chai_1.assert.isAtMost(result.length, 10);
            result.forEach(function (x) {
                chai_1.assert.equal(x.orderedItem.category, "Laptops");
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use or', function (done) {
        context.model("Product")
            .where("category").equal("Desktops")
            .or("category").equal("Laptops")
            .orderBy("price")
            .take(5)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.oneOf(x.category, ["Laptops", "Desktops"]);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use and', function (done) {
        context.model("Product")
            .where("category").equal("Laptops")
            .and("price").between(200, 750)
            .orderBy("price")
            .take(5)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isTrue(x.price >= 200 && x.price <= 750);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use equal', function (done) {
        context.model("Order")
            .where("id").equal(10)
            .getItem()
            .then(function (result) {
            chai_1.assert.isObject(result);
            chai_1.assert.equal(result.id, 10);
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use not equal', function (done) {
        context.model("Order")
            .where("orderStatus/alternateName").notEqual("OrderProblem")
            .orderByDescending("orderDate")
            .take(10)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.notEqual(x.orderStatus.alternateName, "OrderProblem");
            });
            return done();
        }).catch(function (err) {
            console.log(err);
        });
    });
    it('should use greater than', function (done) {
        context.model("Order")
            .where("orderedItem/price").greaterThan(968)
            .and("orderedItem/category").equal("Laptops")
            .and("orderStatus/alternateName").notEqual("OrderCancelled")
            .select("id", "orderStatus/name as orderStatusName", "customer/description as customerDescription", "orderedItem")
            .orderByDescending("orderDate")
            .take(10)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isAbove(x.orderedItem.price, 968);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use greater or equal', function (done) {
        context.model("Product")
            .where("price").greaterOrEqual(1395.9)
            .orderByDescending("price")
            .take(10)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isAtLeast(x.price, 1395.9);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use lower than', function (done) {
        context.model("Product")
            .where("price").lowerThan(263.56)
            .orderBy("price")
            .take(10)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isBelow(x.price, 263.56);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use lower or equal', function (done) {
        context.model("Product")
            .where("price").lowerOrEqual(263.56)
            .and("price").greaterOrEqual(224.52)
            .orderBy("price")
            .take(5)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isAtLeast(x.price, 224.52);
                chai_1.assert.isAtMost(x.price, 263.56);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use prepare', function (done) {
        context.model("Product")
            .where("category").equal("Desktops")
            .or("category").equal("Laptops")
            .prepare()
            .and('price').greaterThan(600)
            .take(5)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isAtLeast(x.price, 600);
                chai_1.assert.include(["Desktop", "Laptops"], x.category);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use between', function (done) {
        context.model("Product")
            .where("category").equal("Laptops")
            .or("category").equal("Desktops")
            .andAlso("price").between(200, 750)
            .orderBy("price")
            .take(5)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isAtLeast(x.price, 200);
                chai_1.assert.isAtMost(x.price, 750);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use count', function (done) {
        context.model("Product")
            .select("category", "count(id) as total")
            .groupBy("category")
            .orderByDescending("count(id)")
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.property(x, 'total');
                chai_1.assert.isNumber(x.total);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use min', function (done) {
        context.model("Product")
            .select("category", "min(price) as minimumPrice")
            .where("category").equal("Laptops")
            .or("category").equal("Desktops")
            .groupBy("category")
            .orderByDescending("min(price)")
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.property(x, 'minimumPrice');
                chai_1.assert.isNumber(x.minimumPrice);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use max', function (done) {
        context.model("Product")
            .select("category", "max(price) as maximumPrice")
            .where("category").equal("Laptops")
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.property(x, 'maximumPrice');
                chai_1.assert.isNumber(x.maximumPrice);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use indexOf', function (done) {
        context.model("Product")
            .where("name").indexOf("Intel")
            .greaterThan(0)
            .getItems()
            .then(function (result) {
            console.log(result);
            result.forEach(function (x) {
                chai_1.assert.match(x.name, /Intel/ig);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use substr', function (done) {
        context.model("Product")
            .where("name").substr(6, 4)
            .equal("Core")
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isTrue(x.name.substr(6, 4) === "Core");
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use starts with', function (done) {
        context.model("Product")
            .where("name").startsWith("Intel Core")
            .equal(true)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.match(x.name, /^Intel\sCore/g);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use ends with', function (done) {
        context.model("Product")
            .where("name").endsWith("Edition")
            .equal(true)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.match(x.name, /Edition$/g);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use lower case', function (done) {
        context.model("Product")
            .where("category").toLowerCase()
            .equal("laptops")
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.match(x.category, /^laptops$/ig);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use upper case', function (done) {
        context.model("Product")
            .where("category").toLowerCase()
            .equal("LAPTOPS")
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.match(x.category, /^LAPTOPS$/ig);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use date func', function (done) {
        context.model("Order")
            .where("orderDate").getDate()
            .equal("2015-04-18")
            .getItems()
            .then(function (result) {
            var val = new Date("2015-04-18");
            result.forEach(function (x) {
                chai_1.assert.equal(x.orderDate.getFullYear(), val.getFullYear());
                chai_1.assert.equal(x.orderDate.getMonth(), val.getMonth());
                chai_1.assert.equal(x.orderDate.getDate(), val.getDate());
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use month func', function (done) {
        context.model("Order")
            .where("orderDate").getMonth()
            .equal(4)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.equal(x.orderDate.getMonth(), 3);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use day func', function (done) {
        context.model("Order")
            .where("orderDate").getMonth().equal(4)
            .and("orderDate").getDay().lowerThan(15)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isBelow(x.orderDate.getDate(), 15);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use year func', function (done) {
        context.model("Order")
            .where("orderDate").getMonth().equal(5)
            .and("orderDate").getDay().lowerOrEqual(10)
            .and("orderDate").getFullYear().equal(2015)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.equal(x.orderDate.getFullYear(), 2015);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use hours func', function (done) {
        context.model("Order")
            .where("orderDate").getMonth().equal(5)
            .and("orderDate").getDay().lowerOrEqual(10)
            .and("orderDate").getHours().between(10, 18)
            .getItems()
            .then(function (result) {
            console.log(result);
            result.forEach(function (x) {
                chai_1.assert.isAtLeast(x.orderDate.getUTCHours(), 10);
                chai_1.assert.isAtMost(x.orderDate.getUTCHours(), 18);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use minutes func', function (done) {
        context.model("Order")
            .where("orderDate").getMonth().equal(5)
            .and("orderDate").getHours().between(9, 17)
            .and("orderDate").getMinutes().between(1, 30)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isAtLeast(x.orderDate.getUTCMinutes(), 1);
                chai_1.assert.isAtMost(x.orderDate.getUTCMinutes(), 30);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use seconds func', function (done) {
        context.model("Order")
            .where("orderDate").getMonth().equal(5)
            .and("orderDate").getHours().between(9, 17)
            .and("orderDate").getMinutes().between(1, 30)
            .and("orderDate").getSeconds().between(1, 45)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isAtLeast(x.orderDate.getUTCSeconds(), 1);
                chai_1.assert.isAtMost(x.orderDate.getUTCSeconds(), 45);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
    it('should use round func', function (done) {
        context.model("Product")
            .where("price").round().lowerOrEqual(177)
            .getItems()
            .then(function (result) {
            result.forEach(function (x) {
                chai_1.assert.isAtMost(Math.round(x.price), 177);
            });
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });
});
//# sourceMappingURL=app.component.spec.js.map