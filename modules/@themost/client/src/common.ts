import {EdmSchema} from './metadata';

export class CodedError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        // set prototype for a class that extends Error in typescript
        // @ts-ignore
        this.__proto__ = new.target.prototype;
    }
}

export class ResponseError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        // set prototype for a class that extends Error in typescript
        // @ts-ignore
        this.__proto__ = new.target.prototype;
    }
}

export class Base64 {
    private PADCHAR: string = '=';
    private ALPHA: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';


    // tslint:disable no-bitwise
    public decode(s: string): string {
        let pads = 0;
        let i;
        let b10;
        let iMax = s.length;
        const x = [];

        s = String(s);

        if (iMax === 0) {
            return s;
        }

        if (s.charAt(iMax - 1) === this.PADCHAR) {
            pads = 1;
            if (s.charAt(iMax - 2) === this.PADCHAR) {
                pads = 2;
            }
            iMax -= 4;
        }

        for (i = 0; i < iMax; i += 4) {
            b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) |
                (this.getByte64(s, i + 2) << 6) | this.getByte64(s, i + 3);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255));
        }

        switch (pads) {
            case 1:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255));
                break;
            case 2:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12);
                x.push(String.fromCharCode(b10 >> 16));
                break;
        }

        return x.join('');
    }
    // tslint:enable no-bitwise

    // tslint:disable no-bitwise
    public encode(s: string): string {
        s = String(s);

        let i;
        let b10;
        const x = [];
        const iMax = s.length - s.length % 3;

        if (s.length === 0) {
            return s;
        }

        for (i = 0; i < iMax; i += 3) {
            b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
            x.push(this.ALPHA.charAt(b10 >> 18));
            x.push(this.ALPHA.charAt((b10 >> 12) & 63));
            x.push(this.ALPHA.charAt((b10 >> 6) & 63));
            x.push(this.ALPHA.charAt(b10 & 63));
        }

        switch (s.length - iMax) {
            case 1:
                b10 = this.getByte(s, i) << 16;
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.PADCHAR + this.PADCHAR);
                break;
            case 2:
                b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) +
                    this.ALPHA.charAt((b10 >> 6) & 63) + this.PADCHAR);
                break;
        }

        return x.join('');
    }
    // tslint:enable no-bitwise
    // noinspection JSMethodCanBeStatic
    private getByte(s: string, i: number): number {
        return s.charCodeAt(i);
    }

    private getByte64(s: string, i: number): number {
        return this.ALPHA.indexOf(s.charAt(i));
    }

}

export class TextUtils {

    public static isNotEmptyString(s: string): boolean {
        return (s != null) && (s.length > 0);
    }

    public static isNullOrUndefined(s: string): boolean {
        return (s == null);
    }

    public static zeroPad(num: number, length: number): string {
        num = num || 0;
        if (typeof num !== 'number') {
            throw new TypeError('Expected number.');
        }
        let res = num.toString();
        if (!/^\d+$/g.test(res)) {
            throw new TypeError('Expected a positive integer.');
        }
        while (res.length < length) {
            res = '0' + res;
        }
        return res;
    }

    public static isDate(s: string): boolean {
        if (typeof s === 'string') {
            return TextUtils.REG_DATETIME_ISO.test(s);
        }
        return false;
    }

    public static isDateOnly(s: string): boolean {
        if (typeof s === 'string') {
            return TextUtils.REG_DATE_ISO.test(s);
        }
        return false;
    }

    public static isGuid(s: any): boolean {
        if (typeof s === 'string') {
            return TextUtils.REG_GUID_STRING.test(s);
        }
        return false;
    }


    public static isAbsoluteURI(s: any): boolean {
        if (typeof s === 'string') {
            return TextUtils.REG_ABSOLUTE_URI.test(s);
        }
        return false;
    }

    public static isRelativeURI(s: any): boolean {
        if (typeof s === 'string') {
            return TextUtils.REG_RELATIVE_URI.test(s);
        }
        return false;
    }

    public static isNumber(s: any): boolean {
        if (typeof s === 'string') {
            return TextUtils.REG_NUMBER_STRING.test(s);
        } else if (typeof  s === 'number') {
            return true;
        }
        return false;
    }

    public static parseDate(s: string): Date {
        if (TextUtils.isDate(s)) {
            return new Date(s);
        }
        return;
    }

    /**
     * Encodes the given string to Base-64 format
     * @param {string} s - A string to encode
     * @returns {string}
     */
    public static toBase64(s: string): string {
        const cv = new Base64();
        return cv.encode(s);
    }

    /**
     * Decodes the given string from Base-64 format
     * @param {string} s - A base-64 encoded string
     * @returns {string}
     */
    public static fromBase64(s: string): string {
        const cv = new Base64();
        return cv.decode(s);
    }

    public static format(s: string, ...p: any[]): string {
        let i = 0;
        return s.replace(/%[sdfj%]/g, (x) => {
            if (x === '%%') { return '%'; }
            if (i >= p.length) { return x; }
            const p1 = p[i++];
            if (p1 == null) {
                return '';
            }
            switch (x) {
                case '%s':
                    return p1.toString();
                case '%d':
                    return parseInt(p1, 10);
                case '%f':
                    return parseFloat(p1);
                case '%j':
                    return JSON.stringify(p1);
                default:
                    return x;
            }
        });
    }

    public static escape(val: any): string {
        if (val == null) {
            return 'null';
        }
        if (typeof val === 'boolean') {
            return (val) ? 'true' : 'false';
        }
        if (typeof val === 'number') {
            return val + '';
        }
        if (val instanceof Date) {
            const dt = val;
            const year   = dt.getFullYear();
            const month  = TextUtils.zeroPad(dt.getMonth() + 1, 2);
            const day    = TextUtils.zeroPad(dt.getDate(), 2);
            const hour   = TextUtils.zeroPad(dt.getHours(), 2);
            const minute = TextUtils.zeroPad(dt.getMinutes(), 2);
            const second = TextUtils.zeroPad(dt.getSeconds(), 2);
            const millisecond = TextUtils.zeroPad(dt.getMilliseconds(), 3);
            // format timezone
            const offset = -1 * dt.getTimezoneOffset();
            const timezone = (offset >= 0 ? '+' : '') + TextUtils.zeroPad(Math.floor(offset / 60), 2) +
                ':' + TextUtils.zeroPad(offset % 60, 2);
            return '\'' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millisecond + timezone + '\'';
        }
        if (val instanceof Array) {
            const values = [];
            val.forEach((x) => {
                values.push(TextUtils.escape(x));
            });
            return values.join(',');
        }
        if (typeof val === 'string') {
            const res = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, (s) => {
                switch (s) {
                    case '\0': return '\\0';
                    case '\n': return '\\n';
                    case '\r': return '\\r';
                    case '\b': return '\\b';
                    case '\t': return '\\t';
                    case '\x1a': return '\\Z';
                    default: return '\\' + s;
                }
            });
            return '\'' + res + '\'';
        }
        // otherwise get valueOf
        if (val.hasOwnProperty('$name')) {
            return val.$name;
        } else {
            return TextUtils.escape(val.valueOf());
        }
    }

    // tslint:disable max-line-length
    private static REG_DATETIME_ISO = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)(?:Z(-?\d*))?([+-](\d+):(\d+))?$/;
    private static REG_DATE_ISO = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/;
    private static REG_GUID_STRING = /^({?([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}}?)$/;
    private static REG_ABSOLUTE_URI = /^((https?|ftps?):\/\/)([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    private static REG_RELATIVE_URI = /^([\/\w .-]*)*\/?$/;
    private static REG_NUMBER_STRING = /^\d+$/;
    // tslint:enable max-line-length


}

export class Args {

    public static check(expr: boolean, message: string, code?: string): void {
        if (!expr) {
            throw new CodedError(message, code || 'EARG');
        }
    }

    public static notNull(obj: any, name: string): void {
        Args.check(obj != null, name + ' may not be null or undefined', 'ENULL');
    }

    public static notEmpty(obj: string, name: string): void {
        Args.check((obj != null) && (obj.length > 0), name + ' may not be empty', 'ENULL');
    }

    public static notNegative(obj: number, name: string): void {
        Args.check((typeof obj === 'number'), name + ' may be a number', 'ENUMBER');
        Args.check((obj >= 0), name + ' may not be negative', 'ENUMBER');
    }

    public static Positive(obj: number, name: string): void {
        Args.check((typeof obj === 'number'), name + ' may be a number', 'ENUMBER');
        Args.check((obj > 0), name + ' must be a positive number', 'ENUMBER');
    }

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

    setHeader(name: string, value: string);

    getHeaders(): any;
    /**
     * Gets a string which represents the base URL of a client data service
     */
    getBase(): string;
    /**
     * Sets a string which represents the base URL of a client data service
     * @param {string} value - The base URL
     * @returns ClientDataContextBase
     */
    setBase(value: string): ClientDataServiceBase;
    /**
     * Executes an HTTP request against the defined OData v4 application server
     * @param {DataServiceExecuteOptions} options
     */
    execute(options: DataServiceExecuteOptions): Promise<any>;

    /**
     * Returns the metadata document provided by an OData v4 application server
     */
    getMetadata(): Promise<EdmSchema>;

    /**
     * Converts a URL into one that is usable on the requesting client.
     * @param {string} relative
     */
    resolve(relative: string);

    getOptions(): ClientDataContextOptions;

}

export interface ClientDataContextBase {
    /**
     * Gets a string which represents the base URL of the OData v4 application server
     */
    getBase(): string;
    /**
     * Sets a string which represents the base URL of the OData v4 application server
     * @param {string} value - The base URL
     * @returns ClientDataContextBase
     */
    setBase(value: string): ClientDataContextBase;
    /**
     * Gets the instance of ClientDataServiceBase class which is associated with this data context
     */
    getService(): ClientDataServiceBase;
}
