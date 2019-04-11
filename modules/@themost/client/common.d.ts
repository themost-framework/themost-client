export declare class CodedError extends Error {
    code: string;
    constructor(message: string, code: string);
}
export declare class ResponseError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class Base64 {
    private PADCHAR;
    private ALPHA;
    private getByte(s, i);
    private getByte64(s, i);
    decode(s: string): string;
    encode(s: string): string;
}
export declare class TextUtils {
    static isNotEmptyString(s: string): boolean;
    static isNullOrUndefined(s: string): boolean;
    static zeroPad(num: number, length: number): string;
    private static REG_DATETIME_ISO;
    private static REG_DATE_ISO;
    static isDate(s: string): boolean;
    static isDateOnly(s: string): boolean;
    private static REG_GUID_STRING;
    static isGuid(s: any): boolean;
    private static REG_ABSOLUTE_URI;
    static isAbsoluteURI(s: any): boolean;
    private static REG_RELATIVE_URI;
    static isRelativeURI(s: any): boolean;
    private static REG_NUMBER_STRING;
    static isNumber(s: any): boolean;
    static parseDate(s: string): Date;
    /**
     * Encodes the given string to Base-64 format
     * @param {string} s - A string to encode
     * @returns {string}
     */
    static toBase64(s: string): string;
    /**
     * Decodes the given string from Base-64 format
     * @param {string} s - A base-64 encoded string
     * @returns {string}
     */
    static fromBase64(s: string): string;
    static format(s: string, ...p: any[]): string;
    static escape(val: any): string;
}
export declare class Args {
    static check(expr: boolean, message: string, code?: string): void;
    static notNull(obj: any, name: string): void;
    static notEmpty(obj: string, name: string): void;
    static notNegative(obj: number, name: string): void;
    static Positive(obj: number, name: string): void;
}
export interface DataServiceQueryParams {
    $filter: string;
    $groupby: string;
    $select: string;
    $orderby: string;
    $expand: string;
    $count: boolean;
    $top: number;
    $skip: number;
    $first: boolean;
    $levels: number;
}
export interface ClientDataContextOptions {
    useMediaTypeExtensions?: boolean;
    useResponseConversion?: boolean;
    /**
     * Sets reviver to use while parsing a JSON string
     * @param key
     * @param value
     */
    useJsonReviver?: (key: any, value: any) => any;
    /**
     * Sets replacer to use while stringify an object
     * @param key
     * @param value
     */
    useJsonReplacer?: (key: any, value: any) => any;
}
export interface DataServiceExecuteOptions {
    method: string;
    url: string;
    data: any;
    headers: any;
}
export interface ClientDataServiceBase {
    setHeader(name: string, value: string): any;
    getHeaders(): any;
    /**
     * Gets a string which represents the base URL of the MOST Web application server
     */
    getBase(): string;
    /**
     * Executes an HTTP request against the defined MOST Web application server
     * @param {DataServiceExecuteOptions} options
     */
    execute(options: DataServiceExecuteOptions): Promise<any>;
    /**
     * Converts a URL into one that is usable on the requesting client.
     * @param {string} relative
     */
    resolve(relative: string): any;
    getOptions(): ClientDataContextOptions;
}
export interface ClientDataContextBase {
    /**
     * Gets a string which represents the base URL of the MOST Web application server
     */
    getBase(): string;
    /**
     * Sets a string which represents the base URL of the MOST Web application server
     * @param {string} value - The base URL
     * @returns ClientDataContextBase
     */
    setBase(value: string): ClientDataContextBase;
    /**
     * Gets the instance of ClientDataServiceBase class which is associated with this data context
     */
    getService(): ClientDataServiceBase;
}
