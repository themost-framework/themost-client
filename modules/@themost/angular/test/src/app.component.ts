import { Component } from '@angular/core';
import {AngularDataContext} from "../../client";
@Component({
    selector: 'test-app',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    public laptops:any[];

    constructor(private context:AngularDataContext) {
        this.context.setBasicAuthorization('alexis.rees@example.com','user');
    }

    ngOnInit() {
        this.context.model('Product')
            .where('category').equal('Laptops')
            .orderBy('price')
            .take(5)
            .getItems().then((result)=> {
            this.laptops = result;
        });
    }

}