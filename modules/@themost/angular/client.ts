import {Injectable, EventEmitter, Component, Inject} from '@angular/core';
import {Args,DataServiceExecuteOptions,TextUtils} from '@themost/client/common';
import {HttpClient} from '@angular/common/http';
import {ClientDataService,ClientDataContext} from "@themost/client";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


export interface ClientDataContextConfig {
    base:string
}

export const DATA_CONTEXT_CONFIG:ClientDataContextConfig = {
    base: '/'
};


@Injectable()
export class AngularDataContext extends ClientDataContext {

    constructor(private http:HttpClient, @Inject(DATA_CONTEXT_CONFIG) config:ClientDataContextConfig) {
        super(new AngularDataService(config.base, http));
    }
}

export class AngularDataService extends ClientDataService {

    getHeaders() {
        throw new Error("Method not implemented.");
    }

    resolve(relative: string): string {
        throw new Error("Method not implemented.");
    }

    private http_:HttpClient;

    /**
     * Initializes a new instance of ClientDataService class
     * @param {string} base - The base URI of the MOST Web Framework Application Server. The default value is '/' for accessing local services.
     * @param {Http}  http
     */
    constructor(base:string, http:HttpClient) {
        super(base || "/");
        this.http_ = http;
    }

    execute(options:DataServiceExecuteOptions):Promise<any> {
        const self = this;
        //options defaults
        options.method = options.method || "GET";
        options.headers = options.headers || { };
        //set content type
        options.headers["Content-Type"] = "application/json";
        //validate options URL
        Args.notNull(options.url,"Request URL");
        //validate URL format
        Args.check(!/^https?:\/\//i.test(options.url),"Request URL may not be an absolute URI");
        //validate request method
        Args.check(/^GET|POST|PUT|DELETE$/i.test(options.method),"Invalid request method. Expected GET, POST, PUT or DELETE.");
        //set URL parameter
        const url_ = self.getBase() + options.url.replace(/^\//i,"");
        let requestOptions = {
            headers:options.headers,
            search:null,
            body:null
        };
        //if request is a GET HTTP Request
        if (/^GET$/i.test(options.method)) {
            requestOptions.search = options.data;
        }
        else {
            requestOptions.body = options.data;
        }
        return this.http_.request(options.method ,url_, requestOptions).map(
            (res:Response) => {
                if (res.status===204) {
                    return;
                }
                else {
                    return res.text().then(function(text) {
                        return JSON.parse(text, function(key,value) {
                            if (TextUtils.isDate(value)) {
                                return new Date(value);
                            }
                            return value;
                        });
                    });

                }
            }
        ).toPromise();
    }
}

