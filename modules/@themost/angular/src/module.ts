import {NgModule} from '@angular/core';
import {DataComponent} from './components';
import {DATA_CONTEXT_CONFIG} from "./client";

@NgModule({
    imports: [],
    declarations: [DataComponent],
    exports: [DataComponent],
    providers: [{
        provide: DATA_CONTEXT_CONFIG, useValue: {
            base: "/",
            options: {
                useMediaTypeExtensions: true
            }
        }
    }]
})

export class MostModule {

}
