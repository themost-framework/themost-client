import { ClientDataContextOptions, ClientDataContext, ClientDataService } from '@themost/client';
export declare class NodeDataContext extends ClientDataContext {
    constructor(base: string, options?: ClientDataContextOptions);
}
export declare class NodeDataService extends ClientDataService {
    /**
     * @param {string} base
     * @param {ClientDataContextOptions} options
     */
    constructor(base: string, options?: ClientDataContextOptions);
    execute(options: any): Promise<any>;
}
