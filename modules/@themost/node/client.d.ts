import { Promise } from 'q';
import { ClientDataContext, ClientDataService } from "@themost/client";
export declare class NodeDataContext extends ClientDataContext {
    constructor(base: string);
}
export declare class NodeDataService extends ClientDataService {
    /**
     * @param {string} base
     */
    constructor(base: string);
    execute(options: any): Promise<any>;
}
