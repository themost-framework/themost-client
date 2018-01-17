import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {DATA_CONTEXT_CONFIG, AngularDataContext } from '../../client';
@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: DATA_CONTEXT_CONFIG, useValue: {
                base: 'http://localhost:3000/',
                options: {
                    useMediaTypeExtensions: false
                }
            }
        },
        AngularDataContext
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
export class AppModule { }