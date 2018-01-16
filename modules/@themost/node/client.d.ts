import { ClientDataContextOptions } from "@themost/client/common";
import { ClientDataContext, ClientDataService } from "@themost/client";
import { DataServiceExecuteOptions } from "../client/common";
export declare class NodeDataContext extends ClientDataContext {
    constructor(base: string);
}
export declare class NodeDataService extends ClientDataService {
    /**
     * @param {string} base
     * @param {ClientDataContextOptions} options
     */
    constructor(base: string, options?: ClientDataContextOptions);
    execute(options: DataServiceExecuteOptions): Promise<any>;
}
