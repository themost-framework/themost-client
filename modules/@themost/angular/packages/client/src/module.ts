/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import {ModuleWithProviders, NgModule} from '@angular/core';
import {DataComponent} from './components';
import {AngularDataContext, ClientDataContextConfig, DATA_CONTEXT_CONFIG} from './client';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    imports: [
        HttpClientModule
    ],
    declarations: [
        DataComponent
    ],
    exports: [
        DataComponent
    ],
    providers: [
        {
            provide: DATA_CONTEXT_CONFIG, useValue: {
                base: '/',
                options: {
                    useMediaTypeExtensions: true
                }
            }
        },
        AngularDataContext
    ]
})
export class MostModule {
    constructor() {
        //
    }
    static forRoot(configuration: ClientDataContextConfig): ModuleWithProviders {
        // ensure configuration
        const contextConfiguration = configuration || {
                base: '/',
                options: {
                    useMediaTypeExtensions: true
                }
            };
        return {
            ngModule: MostModule,
            providers: [
                {
                    provide: DATA_CONTEXT_CONFIG, useValue: contextConfiguration
                },
                AngularDataContext
            ]
        };
    }
}