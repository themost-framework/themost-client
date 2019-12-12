[![npm](https://img.shields.io/npm/v/@themost%2Fnode.svg)](https://www.npmjs.com/package/@themost%2Fnode)
![](https://img.shields.io/david/themost-framework/themost-client?path=modules%2F%40themost%2Fnode) ![](https://img.shields.io/david/peer/themost-framework/themost-client?path=modules%2F%40themost%2Fnode)
![](https://img.shields.io/david/dev/themost-framework/themost-client?path=modules%2F%40themost%2Fnode)
![GitHub top language](https://img.shields.io/github/languages/top/themost-framework/themost-client)
[![License](https://img.shields.io/npm/l/@themost/query)](https://github.com/themost-framework/themost-client/blob/master/LICENSE)
![GitHub last commit](https://img.shields.io/github/last-commit/themost-framework/themost-client)
![GitHub Release Date](https://img.shields.io/github/release-date/themost-framework/themost-client)
[![npm](https://img.shields.io/npm/dw/@themost/node)](https://www.npmjs.com/package/@themost%2Fnode)
[![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@themost/node)](https://snyk.io/vuln/npm:%40themost%2Fnode)

# @themost/node

![MOST Web Framework Logo](https://www.themost.io/assets/images/most_logo_sw_240.png)

[MOST Web Framework 2.0 **Codename Blueshift**](https://github.com/themost-framework/themost) - NodeJS client module

## Installation

    npm install @themost/node


### Usage

    import {NodeDataContext} from '@themost/node/client';
    const context = new NodeDataContext("http://data.example.com");
    context.model("Order")
        .select("id","customer", "orderDate", "orderNumber")
        .expand("customer")
        .where("orderStatus/alternateName")
        .equal("OrderPaymentDue")
        .orderBy("orderDate")
        .take(10)
        .getItems().then(function(result) {
            //enumerate items
        }).catch((err) =>
            console.log(err);
        });

### ClientDataContext Class

#### model(name)

Gets an instance of ClientDataModel class based on the given name.

    context.model("Order").where("orderStatus").equal(1).getItems().then(function(result) {
        //
    }).catch((err) =>
        console.log(err);
    });

#### getService()

Gets the instance of ClientDataService associated with this data context.

    console.log(context.getService().getBase());

#### setService(service)

Associates the given ClientDataService instance with this data context.

    context.setService(new MyDataService("http://data.example.com"));

### ClientDataModel Class

#### asQueryable()

Returns an instance of ClientDataQueryable class associated with this model.

    context.model("Order")
        .asQueryable()
        .select("id","customer/description as customerDescription", "orderDate", "orderedItem/name as orderedItemName")
        .where("paymentMethod/alternateName").equal("DirectDebit")
        .orderByDescending("orderDate")
        .take(10)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
            console.log(err);
    });

#### getName()

Gets a string which represents the name of this data model.

#### getService()

Gets the instance of ClientDataService associated with this data model.

#### remove(obj)

Removes the given item or array of items.

    var order = {
        id:1
    };
    context.model("Order").remove(order).then(function(result) {
        //
    }).catch((err) =>
        console.log(err);
    }

#### save(obj)

Creates or updates the given item or array of items.

    var order = {
        id:1,
        orderStatus:7
    };
    context.model("Order").save(order).then(function(result) {
        //
    }).catch((err) =>
        console.log(err);
    }

#### select(...attr)

Initializes and returns an instance of ClientDataQueryable class by selecting an attribute or a collection of attributes.

    context.model("Order")
        .select("id","customer","orderedItem","orderStatus")
        .orderBy("orderDate")
        .take(25)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
            console.log(err);
    });

#### skip(num)

Initializes and returns an instance of ClientDataQueryable class by specifying the number of records to be skipped.

    context.model("Order")
        .skip(10)
        .take(10)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
            console.log(err);
    });

#### take(num)

Initializes and returns an instance of ClientDataQueryable class by specifying the number of records to be taken.

    context.model("Order")
        .take(10)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
            console.log(err);
    });

#### where(attr)

Initializes a comparison expression by using the given attribute as left operand
and returns an instance of ClientDataQueryable class.

    context.model("Order")
        .where("orderedItem/category").equal("Laptops")
        .take(10)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
            console.log(err);
    });

### ClientDataQueryable Class

ClientDataQueryable class enables developers to perform simple and extended queries against data models.
The ClienDataQueryable class follows [DataQueryable](https://docs.themost.io/most-data/DataQueryable.html)
which is introduced by [MOST Web Framework ORM server-side module](https://github.com/kbarbounakis/most-data).

#### Logical Operators

Or:

    context.model("Product")
        .where("category").equal("Desktops")
        .or("category").equal("Laptops")
        .orderBy("price")
        .take(5)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

And:

    context.model("Product")
        .where("category").equal("Laptops")
        .and("price").between(200,750)
        .orderBy("price")
        .take(5)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

#### Comparison Operators

Equal:

    context.model("Order")
            .where("id").equal(10)
            .getItem()
            .then((result) => {
                //
            }).catch((err) =>
                console.log(err);
        });

Not equal:

    context.model("Order")
            .where("orderStatus/alternateName").notEqual("OrderProblem")
            .orderByDescending("orderDate")
            .take(10)
            .getItems()
            .then((result) => {
                //
            }).catch((err) =>
                console.log(err);
        });

Greater than:

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
            return done();
        }).catch((err) =>
        console.log(err);
        return done(err);
    });

Greater or equal:

    context.model("Product")
        .where("price").greaterOrEqual(1395.9)
        .orderByDescending("price")
        .take(10)
        .getItems()
        .then((result) => {
           //
        }).catch((err) =>
        console.log(err);
    });

Lower than:

    context.model("Product")
        .where("price").lowerThan(263.56)
        .orderBy("price")
        .take(10)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Lower or equal:

    context.model("Product")
        .where("price").lowerOrEqual(263.56)
        .and("price").greaterOrEqual(224.52)
        .orderBy("price")
        .take(5)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Contains:

    context.model("Product")
        .where("name").contains("Book")
        .and("category").equal("Laptops")
        .orderBy("price")
        .take(5)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Between:

    context.model("Product")
        .where("category").equal("Laptops")
        .or("category").equal("Desktops")
        .andAlso("price").between(200,750)
        .orderBy("price")
        .take(5)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

#### Aggregate Functions

Count:

    context.model("Product")
        .select("category", "count(id) as total")
        .groupBy("category")
        .orderByDescending("count(id)")
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Min:

    context.model("Product")
        .select("category", "min(price) as minimumPrice")
        .where("category").equal("Laptops")
        .or("category").equal("Desktops")
        .groupBy("category")
        .orderByDescending("min(price)")
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Max:

    context.model("Product")
        .select("category", "max(price) as maximumPrice")
        .where("category").equal("Laptops")
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

### String Functions:

Index Of:

    context.model("Product")
        .where("name").indexOf("Intel")
        .greaterOrEqual(0)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Substring:

    context.model("Product")
        .where("name").substr(6,4)
        .equal("Core")
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Starts with:

    context.model("Product")
        .where("name").startsWith("Intel Core")
        .equal(true)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Ends with:

    context.model("Product")
        .where("name").endsWith("Edition")
        .equal(true)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Lower case:

    context.model("Product")
        .where("category").toLowerCase()
        .equal("laptops")
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Upper case:

    context.model("Product")
        .where("category").toUpperCase()
        .equal("LAPTOPS")
        .take(10)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

#### Date Functions:

Date:

    context.model("Order")
        .where("orderDate").getDate()
        .equal("2015-04-18")
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Month:

    context.model("Order")
        .where("orderDate").getMonth()
        .equal(4)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Day:

    context.model("Order")
        .where("orderDate").getMonth().equal(4)
        .and("orderDate").getDay().lowerThan(15)
        .getItems()
        .then((result) => {
           //
        }).catch((err) =>
        console.log(err);
    });

Year:

    context.model("Order")
        .where("orderDate").getMonth().equal(5)
        .and("orderDate").getDay().lowerOrEqual(10)
        .and("orderDate").getFullYear().equal(2015)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Hours:

    context.model("Order")
        .where("orderDate").getMonth().equal(5)
        .and("orderDate").getDay().lowerOrEqual(10)
        .and("orderDate").getHours().between(10,18)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Minutes:

    context.model("Order")
        .where("orderDate").getMonth().equal(5)
        .and("orderDate").getHours().between(9,17)
        .and("orderDate").getMinutes().between(1,30)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Seconds:

    context.model("Order")
        .where("orderDate").getMonth().equal(5)
        .and("orderDate").getHours().between(9,17)
        .and("orderDate").getMinutes().between(1,30)
        .and("orderDate").getSeconds().between(1,45)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

#### Math Functions

Round:

    context.model("Product")
        .where("price").round().lowerOrEqual(177)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Floor:

    context.model("Product")
        .where("price").floor().lowerOrEqual(177)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

Ceiling:

    context.model("Product")
        .where("price").ceil().greaterOrEqual(177)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

#### Methods

##### and(name)

Prepares a logical AND expression.

Parameters:
- name: The name of field that is going to be used in this expression

##### andAlso(name)

Prepares a logical AND expression.
If an expression is already defined, it will be wrapped with the new AND expression

Parameters:
- name: The name of field that is going to be used in this expression

        context.model("Product")
            .where("category").equal("Laptops")
            .or("category").equal("Desktops")
            .andAlso("price").floor().lowerOrEqual(177)
            .getItems()
            .then((result) => {
                //
            }).catch((err) =>
            console.log(err);
        });

##### expand(...attr)

Parameters:
- attr: A param array of strings which represents the field or the array of fields that are going to be expanded.
If attr is missing then all the previously defined expandable fields will be removed

Defines an attribute or an array of attributes to be expanded in the final result. This operation should be used
when a non-expandable attribute is required to be expanded in the final result.

    context.model("Order")
        .where("customer").equal(337)
        .orderByDescending("orderDate")
        .expand("customer")
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

##### first()

Executes the specified query and returns the first item.

    context.model("User")
        .where("name").equal("alexis.rees@example.com")
        .first()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

##### getItem()

Executes the specified query and returns the first item.

    context.model("User")
        .where("name").equal("alexis.rees@example.com")
        .item()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

##### getItems()

Executes the specified query and returns an array of items.

    context.model("Product")
        .where("category").equal("Laptops")
        .take(10)
        .getItems()
        .then((result) => {
            //
        }).catch((err) =>
        console.log(err);
    });

##### getList()

Executes the underlying query and returns a result set based on the specified paging parameters. The result set
contains the following attributes:

- total (number): The total number of records
- skip (number): The number of skipped records
- records (Array): An array of objects which represents the query results.

        context.model("Product")
            .where("category").equal("Laptops")
            .skip(10)
            .take(10)
            .getList()
            .then((result) => {
                //
            }).catch((err) =>
            console.log(err);
        });

##### skip(val)

Prepares a paging operation by skipping the specified number of records

Parameters:
- val: The number of records to be skipped

         context.model("Product")
                 .where("category").equal("Laptops")
                 .skip(10)
                 .take(10)
                 .getList()
                 .then((result) => {
                     //
                 }).catch((err) =>
                 console.log(err);
             });

##### take(val)

Prepares a data paging operation by taking the specified number of records

Parameters:
- val: The number of records to take

         context.model("Product")
                 .where("category").equal("Laptops")
                 .skip(10)
                 .take(10)
                 .getList()
                 .then((result) => {
                     //
                 }).catch((err) =>
                 console.log(err);
             });

##### groupBy(...attr)

Prepares a group by expression

    context.model("Order")
     .select("orderedItem/model as productModel", "orderedItem/name as productName","count(id) as orderCount")
     .where("orderDate').getFullYear().equal(2015)
     .groupBy("orderedItem")
     .orderByDescending("count(id)")
     .take(5).getItems().then(function(result) {
            //
        }).catch((err) =>
           console.log(err);
        });

##### orderBy(...attr)

Prepares an ascending sorting operation

    context.model("Product")
         .orderBy("category","name")
         .take(25).getItems().then(function(result) {
                //
            }).catch((err) =>
               console.log(err);
            });

##### thenBy(...attr)

 Continues a descending sorting operation

     context.model("Product")
          .orderBy("category")
          .thenBy("name")
          .take(25).getItems().then(function(result) {
                 //
             }).catch((err) =>
                console.log(err);
             });

##### orderByDescending(...attr)

 Prepares an descending sorting operation

     context.model("Product")
          .orderByDescending("price")
          .take(25).getItems().then(function(result) {
                 //
             }).catch((err) =>
                console.log(err);
             });

##### thenByDescending(...attr)

 Continues a descending sorting operation

     context.model("Product")
          .orderBy("category")
          .thenByDescending("price")
          .take(25).getItems().then(function(result) {
                 //
             }).catch((err) =>
                console.log(err);
             });
