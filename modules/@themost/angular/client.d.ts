import { InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientDataService, ClientDataContext } from "@themost/client/index";
import { DataServiceExecuteOptions, ClientDataContextOptions } from '@themost/client/common';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
export interface ClientDataContextConfig {
    base: string;
    options: ClientDataContextOptions;
}
export declare const DATA_CONTEXT_CONFIG: InjectionToken<ClientDataContextConfig>;
export declare class AngularDataContext extends ClientDataContext {
    private http;
    constructor(http: HttpClient, config: ClientDataContextConfig);
}
export declare class AngularDataService extends ClientDataService {
    private http;
    /**
     * Initializes a new instance of ClientDataService class
     * @param {string} base - The base URI of the MOST Web Framework Application Server. The default value is '/' for accessing local services.
     * @param {Http}  http
     * @param {ClientDataContextOptions} options
     */
    constructor(base: string, http: HttpClient, options?: ClientDataContextOptions);
    execute(options: DataServiceExecuteOptions): Promise<any>;
}
