
import {NodeDataContext} from "../client";
import mocha = require('mocha');
import {assert} from 'chai';
import Table = require('easy-table');
describe('test node client', ()=> {

    this.timeout = 45000;
    const context = new NodeDataContext("http://localhost:5150/api/v2/");
    context.setBasicAuthorization("Villy@profile","123456");

    it('should get data', (done) => {
        context.model('Patients').where('ID').equal('5a86745d-a543-e711-80ce-00155d58e1d4')
            .getItem().then((result) => {
            console.log(Table.print(result));
            return done();
        }).catch((error)=> {
            return done(error);
        });
    });


});