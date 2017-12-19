import {ClientDataQueryable} from "../index";

describe('test client data queryable', ()=> {
    it('should parse url', (done) => {

        let x = ClientDataQueryable.parse("/order/index.json");
        console.log(x.takePrevious(25).toString());
        console.log(x.takeNext(25).toString());
        console.log(x.takePrevious(125).toString());
        console.log(x.takeNext(25).toString());

        x = ClientDataQueryable.parse("/order/index.json?$skip=50&$top=25&$orderby=orderedItem/price desc,orderedItem/name");
        console.log(x.takeNext(25).toString());
        console.log(x.takeNext(25).toString());
        console.log(x.takePrevious(25).toString());
        return done();
    });
});