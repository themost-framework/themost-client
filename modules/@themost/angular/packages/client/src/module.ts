/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import {NgModule} from '@angular/core';
import {DataComponent} from './components';
import {DATA_CONTEXT_CONFIG} from '@themost/angular/client';

@NgModule({
    imports: [],
    declarations: [DataComponent],
    exports: [DataComponent],
    providers: [{
        provide: DATA_CONTEXT_CONFIG, useValue: {
            base: '/',
            options: {
                useMediaTypeExtensions: true
            }
        }
    }]
})
export class MostModule {
    constructor() {
        //
    }
}
