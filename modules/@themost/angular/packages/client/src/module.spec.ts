import {TestBed, async, inject} from '@angular/core/testing';
import {MostModule, AngularDataContext, DATA_CONTEXT_CONFIG, DataComponent} from './public_api';
import {APP_INITIALIZER} from '@angular/core';
import {TestConfigurationService, TestModule} from './test-module.spec';
import {CommonModule} from '@angular/common';

describe('MostModule forRoot', () => {
    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            imports: [
                MostModule.forRoot({
                    base: '/',
                    options: {
                        useMediaTypeExtensions: true
                    }
                })
            ]
        }).compileComponents();
    }));
    it('should inject AngularDataContext', inject([AngularDataContext], (context: AngularDataContext) => {
        expect(context).toBeTruthy();
    }));
    it('should get context base', inject([AngularDataContext], (context: AngularDataContext) => {
        expect(context.getBase()).toBe('/');
    }));
    it('should update context base', inject([AngularDataContext], (context: AngularDataContext) => {
        context.setBase('/api/');
        expect(context.getService().getBase()).toBe('/api/');
    }));
});

describe('MostModule', () => {
    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            imports: [
                MostModule
            ],
            providers: [
                {
                    provide: DATA_CONTEXT_CONFIG, useValue: {
                        base: '/api/',
                        options: {
                            useMediaTypeExtensions: true
                        }
                    }
                },
                AngularDataContext
            ]
        }).compileComponents();
    }));
    it('should inject AngularDataContext', inject([AngularDataContext], (context: AngularDataContext) => {
        expect(context).toBeTruthy();
    }));
    it('should get context base', inject([AngularDataContext], (context: AngularDataContext) => {
        expect(context.getBase()).toBe('/api/');
    }));
});

describe('MostModule async configuration', () => {


    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            imports: [
                CommonModule,
                TestModule.forRoot(),
                MostModule
            ],
            providers: [
                {
                    provide: DATA_CONTEXT_CONFIG, useValue: {
                        base: '/',
                        options: {
                            useMediaTypeExtensions: false
                        }
                    }
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: (configurationService: TestConfigurationService) =>
                        () => {
                            return configurationService.load();
                    },
                    deps: [ TestConfigurationService ],
                    multi: true
                },
                AngularDataContext
            ]
        }).compileComponents();
    }));
    it('should inject AngularDataContext', inject([AngularDataContext], (context: AngularDataContext) => {
        expect(context).toBeTruthy();
    }));
    it('should get context base', inject([AngularDataContext], (context: AngularDataContext) => {
        expect(context.getBase()).toBe('/api/');
    }));
});

describe('AngularDataContext', () => {
    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            imports: [
                MostModule
            ],
            providers: [
                {
                    provide: DATA_CONTEXT_CONFIG, useValue: {
                        base: '/api/',
                        options: {
                            useMediaTypeExtensions: true
                        }
                    }
                },
                AngularDataContext
            ]
        }).compileComponents();
    }));
    it('should inject AngularDataContext', inject([AngularDataContext], (context: AngularDataContext) => {
        expect(context).toBeTruthy();
    }));
    it('should get context base', inject([AngularDataContext], (context: AngularDataContext) => {
        expect(context.getBase()).toBe('/api/');
    }));
});
