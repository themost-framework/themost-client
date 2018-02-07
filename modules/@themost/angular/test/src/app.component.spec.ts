import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { assert } from 'chai';
import { HttpClientModule } from '@angular/common/http';
import {DATA_CONTEXT_CONFIG, AngularDataContext } from '../../client';

describe('AppComponent', () => {

    let context:AngularDataContext;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
        providers: [
            {
                provide: DATA_CONTEXT_CONFIG, useValue: {
                    base: 'http://localhost:3000/',
                    options: {
                        useMediaTypeExtensions: true
                    }
                }
            },
            AngularDataContext
        ],
        imports: [ HttpClientModule ]
    }).compileComponents();
      const fixture = TestBed.createComponent(AppComponent);
      context = TestBed.get(AngularDataContext);
      context.setBasicAuthorization('alexis.rees@example.com','user');
  }));


    it('should use simple query', (done:(err?:Error)=>void) => {
        context.model('Product').where('category').equal('Laptops').getItems().then(function (result) {
            console.log(result);
            return done();
        }).catch(function (err) {
            return done(err);
        });
    });

    it('should use paging params', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderStatus")
            .equal(1)
            .orderBy("orderDate")
            .take(10)
            .getItems().then((result) => {
            //enumerate items
            console.log(result);
            return done();
        }).catch((err) => {
            return done(err);
        });
    });

    it('should use take', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderedItem/category").equal("Laptops")
            .take(10)
            .getItems()
            .then((result) => {
                assert.isAtMost(result.length,10);
                result.forEach(function(x) {
                    assert.equal(x.orderedItem.category,"Laptops" );
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use or', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("category").equal("Desktops")
            .or("category").equal("Laptops")
            .orderBy("price")
            .take(5)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.oneOf(x.category,["Laptops","Desktops"]);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use and', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("category").equal("Laptops")
            .and("price").between(200,750)
            .orderBy("price")
            .take(5)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isTrue(x.price>=200 && x.price<=750);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use equal', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("id").equal(10)
            .getItem()
            .then((result) => {
                assert.isObject(result);
                assert.equal(result.id,10);
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use not equal', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderStatus/alternateName").notEqual("OrderProblem")
            .orderByDescending("orderDate")
            .take(10)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.notEqual(x.orderStatus.alternateName, "OrderProblem");
                });
                return done();
            }).catch((err) => {
            console.log(err);
        });
    });

    it('should use greater than', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderedItem/price").greaterThan(968)
            .and("orderedItem/category").equal("Laptops")
            .and("orderStatus/alternateName").notEqual("OrderCancelled")
            .select("id",
                "orderStatus/name as orderStatusName",
                "customer/description as customerDescription",
                "orderedItem")
            .orderByDescending("orderDate")
            .take(10)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isAbove(x.orderedItem.price, 968);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use greater or equal', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("price").greaterOrEqual(1395.9)
            .orderByDescending("price")
            .take(10)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isAtLeast(x.price, 1395.9);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use lower than', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("price").lowerThan(263.56)
            .orderBy("price")
            .take(10)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isBelow(x.price, 263.56);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use lower or equal', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("price").lowerOrEqual(263.56)
            .and("price").greaterOrEqual(224.52)
            .orderBy("price")
            .take(5)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isAtLeast(x.price, 224.52);
                    assert.isAtMost(x.price, 263.56);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use prepare', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("category").equal("Desktops")
            .or("category").equal("Laptops")
            .prepare()
            .and('price').greaterThan(600)
            .take(5)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isAtLeast(x.price, 600);
                    assert.include(["Desktop", "Laptops"], x.category);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use between', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("category").equal("Laptops")
            .or("category").equal("Desktops")
            .andAlso("price").between(200,750)
            .orderBy("price")
            .take(5)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isAtLeast(x.price, 200);
                    assert.isAtMost(x.price, 750);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use count', (done:(err?:Error)=>void) => {
        context.model("Product")
            .select("category", "count(id) as total")
            .groupBy("category")
            .orderByDescending("count(id)")
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.property(x, 'total');
                    assert.isNumber(x.total);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use min', (done:(err?:Error)=>void) => {
        context.model("Product")
            .select("category", "min(price) as minimumPrice")
            .where("category").equal("Laptops")
            .or("category").equal("Desktops")
            .groupBy("category")
            .orderByDescending("min(price)")
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.property(x, 'minimumPrice');
                    assert.isNumber(x.minimumPrice);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use max', (done:(err?:Error)=>void) => {
        context.model("Product")
            .select("category", "max(price) as maximumPrice")
            .where("category").equal("Laptops")
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.property(x, 'maximumPrice');
                    assert.isNumber(x.maximumPrice);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use indexOf', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("name").indexOf("Intel")
            .greaterThan(0)
            .getItems()
            .then((result) => {
                console.log(result);
                result.forEach(function(x) {
                    assert.match(x.name,/Intel/ig);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use substr', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("name").substr(6,4)
            .equal("Core")
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isTrue(x.name.substr(6,4)==="Core");
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use starts with', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("name").startsWith("Intel Core")
            .equal(true)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.match(x.name, /^Intel\sCore/g);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use ends with', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("name").endsWith("Edition")
            .equal(true)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.match(x.name, /Edition$/g);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use lower case', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("category").toLowerCase()
            .equal("laptops")
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.match(x.category, /^laptops$/ig);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use upper case', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("category").toLowerCase()
            .equal("LAPTOPS")
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.match(x.category, /^LAPTOPS$/ig);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use date func', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderDate").getDate()
            .equal("2015-04-18")
            .getItems()
            .then((result) => {
                const val = new Date("2015-04-18");
                result.forEach(function(x) {
                    assert.equal(x.orderDate.getFullYear(), val.getFullYear());
                    assert.equal(x.orderDate.getMonth(), val.getMonth());
                    assert.equal(x.orderDate.getDate(), val.getDate());
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use month func', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderDate").getMonth()
            .equal(4)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.equal(x.orderDate.getMonth(), 3);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use day func', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderDate").getMonth().equal(4)
            .and("orderDate").getDay().lowerThan(15)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isBelow(x.orderDate.getDate(), 15);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use year func', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderDate").getMonth().equal(5)
            .and("orderDate").getDay().lowerOrEqual(10)
            .and("orderDate").getFullYear().equal(2015)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.equal(x.orderDate.getFullYear(), 2015);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use hours func', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderDate").getMonth().equal(5)
            .and("orderDate").getDay().lowerOrEqual(10)
            .and("orderDate").getHours().between(10,18)
            .getItems()
            .then((result) => {
                console.log(result);
                result.forEach(function(x) {
                    assert.isAtLeast(x.orderDate.getUTCHours(), 10);
                    assert.isAtMost(x.orderDate.getUTCHours(), 18);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use minutes func', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderDate").getMonth().equal(5)
            .and("orderDate").getHours().between(9,17)
            .and("orderDate").getMinutes().between(1,30)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isAtLeast(x.orderDate.getUTCMinutes(), 1);
                    assert.isAtMost(x.orderDate.getUTCMinutes(), 30);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use seconds func', (done:(err?:Error)=>void) => {
        context.model("Order")
            .where("orderDate").getMonth().equal(5)
            .and("orderDate").getHours().between(9,17)
            .and("orderDate").getMinutes().between(1,30)
            .and("orderDate").getSeconds().between(1,45)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isAtLeast(x.orderDate.getUTCSeconds(), 1);
                    assert.isAtMost(x.orderDate.getUTCSeconds(), 45);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });

    it('should use round func', (done:(err?:Error)=>void) => {
        context.model("Product")
            .where("price").round().lowerOrEqual(177)
            .getItems()
            .then((result) => {
                result.forEach(function(x) {
                    assert.isAtMost(Math.round(x.price), 177);
                });
                return done();
            }).catch((err) => {
            return done(err);
        });
    });


});
