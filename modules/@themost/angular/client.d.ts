import { DataServiceExecuteOptions } from '@themost/client/common';
import { Http } from '@angular/http';
import { ClientDataService, ClientDataContext } from "@themost/client";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
export interface ClientDataContextConfig {
    base: string;
}
export declare const DATA_CONTEXT_CONFIG: ClientDataContextConfig;
export declare class AngularDataContext extends ClientDataContext {
    private http;
    constructor(http: Http, config: ClientDataContextConfig);
}
export declare class AngularDataService extends ClientDataService {
    getHeaders(): void;
    resolve(relative: string): string;
    private http_;
    /**
     * Initializes a new instance of ClientDataService class
     * @param {string} base - The base URI of the MOST Web Framework Application Server. The default value is '/' for accessing local services.
     * @param {Http}  http
     */
    constructor(base: string, http: Http);
    execute(options: DataServiceExecuteOptions): Promise<any>;
}
