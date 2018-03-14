import {Injectable, EventEmitter, Component, Inject} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpParams} from '@angular/common/http';
import {ClientDataService,ClientDataContext} from "@themost/client/index";
import {Args,DataServiceExecuteOptions,TextUtils,ClientDataContextOptions} from '@themost/client/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export interface ClientDataContextConfig {
    base:string,
    options: ClientDataContextOptions
}
export const DATA_CONTEXT_CONFIG:ClientDataContextConfig = {
    base: '/',
    options: {
        useMediaTypeExtensions:true
    }
};

@Injectable()
export class AngularDataContext extends ClientDataContext {

    constructor(private http:HttpClient, @Inject(DATA_CONTEXT_CONFIG) config:ClientDataContextConfig) {
        super(new AngularDataService(config.base, http, config.options), config.options);
    }
}

export class AngularDataService extends ClientDataService {

    /**
     * Initializes a new instance of ClientDataService class
     * @param {string} base - The base URI of the MOST Web Framework Application Server. The default value is '/' for accessing local services.
     * @param {Http}  http
     * @param {ClientDataContextOptions} options
     */
    constructor(base:string, private http:HttpClient, options?:ClientDataContextOptions) {
        super(base || "/", options);
    }

    execute(options:DataServiceExecuteOptions):Promise<any> {
        const self = this;
        //options defaults
        options.method = options.method || "GET";
        options.headers = { ...this.getHeaders(), ...options.headers };
        //set content type
        options.headers["Content-Type"] = "application/json";
        //validate options URL
        Args.notNull(options.url,"Request URL");
        //validate URL format
        Args.check(!/^https?:\/\//i.test(options.url),"Request URL may not be an absolute URI");
        //validate request method
        Args.check(/^GET|POST|PUT|DELETE|PATCH$/i.test(options.method),"Invalid request method. Expected GET, POST, PUT or DELETE.");
        //set URL parameter
        const finalURL = self.getBase() + options.url.replace(/^\//i,"");
        let finalParams = new HttpParams();
        let finalBody;
        if (/^GET$/i.test(options.method) && options.data) {
            Object.getOwnPropertyNames(options.data).forEach((key)=> {
                finalParams = finalParams.append(key, options.data[key]);
            });
        }
        else {
            finalBody = options.data;
        }
        return new Promise<any>((resolve,reject) => {
            this.http.request(options.method, finalURL, {
                body:finalBody,
                headers: new HttpHeaders(options.headers),
                observe: 'response',
                params: finalParams,
                reportProgress: false,
                responseType: 'text',
                withCredentials: true
        }).subscribe((res)=> {
                if (res.status ===204) {
                    return resolve();
                }
                else {
                    const finalRes = JSON.parse(res.body, function(key,value) {
                        if (TextUtils.isDate(value)) {
                            return new Date(value);
                        }
                        return value;
                    });
                    return resolve(finalRes);
                }
            }, (err)=> {
                reject(err);
            });
        });
    }
}

