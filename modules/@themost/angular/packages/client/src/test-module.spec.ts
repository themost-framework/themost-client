import {Injectable, Injector, ModuleWithProviders, NgModule} from '@angular/core';
import {DATA_CONTEXT_CONFIG} from './client';

@Injectable()
export class TestConfigurationService {
    constructor(private _injector: Injector) {
        //
    }
    public load() {
        return new Promise((resolve) => {
            const dataContextConfig = this._injector.get(DATA_CONTEXT_CONFIG);
            dataContextConfig.base = '/api/';
            return resolve();
        });
    }
}

// @ts-ignore
@NgModule({
    providers: [
        TestConfigurationService
    ]
})
export class TestModule {
    constructor() {
        //
    }
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: TestModule,
            providers: [
                TestConfigurationService
            ]
        };
    }
}
