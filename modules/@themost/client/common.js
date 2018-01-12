"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CodedError = /** @class */ (function (_super) {
    __extends(CodedError, _super);
    function CodedError(message, code) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        _this.code = code;
        //set prototype for a class that extends Error in typescript
        _this["__proto__"] = _newTarget.prototype;
        return _this;
    }
    return CodedError;
}(Error));
exports.CodedError = CodedError;
var ResponseError = /** @class */ (function (_super) {
    __extends(ResponseError, _super);
    function ResponseError(message, statusCode) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        //set prototype for a class that extends Error in typescript
        _this["__proto__"] = _newTarget.prototype;
        return _this;
    }
    return ResponseError;
}(Error));
exports.ResponseError = ResponseError;
var Base64 = /** @class */ (function () {
    function Base64() {
        this.PADCHAR = '=';
        this.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    }
    Base64.prototype.getByte = function (s, i) {
        var x = s.charCodeAt(i);
        return x;
    };
    Base64.prototype.getByte64 = function (s, i) {
        var idx = this.ALPHA.indexOf(s.charAt(i));
        return idx;
    };
    Base64.prototype.decode = function (s) {
        var pads = 0, i, b10, imax = s.length, x = [];
        s = String(s);
        if (imax === 0) {
            return s;
        }
        if (s.charAt(imax - 1) === this.PADCHAR) {
            pads = 1;
            if (s.charAt(imax - 2) === this.PADCHAR) {
                pads = 2;
            }
            imax -= 4;
        }
        for (i = 0; i < imax; i += 4) {
            b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6) | this.getByte64(s, i + 3);
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
    };
    Base64.prototype.encode = function (s) {
        s = String(s);
        var i, b10, x = [], imax = s.length - s.length % 3;
        if (s.length === 0) {
            return s;
        }
        for (i = 0; i < imax; i += 3) {
            b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
            x.push(this.ALPHA.charAt(b10 >> 18));
            x.push(this.ALPHA.charAt((b10 >> 12) & 63));
            x.push(this.ALPHA.charAt((b10 >> 6) & 63));
            x.push(this.ALPHA.charAt(b10 & 63));
        }
        switch (s.length - imax) {
            case 1:
                b10 = this.getByte(s, i) << 16;
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.PADCHAR + this.PADCHAR);
                break;
            case 2:
                b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.ALPHA.charAt((b10 >> 6) & 63) + this.PADCHAR);
                break;
        }
        return x.join('');
    };
    return Base64;
}());
exports.Base64 = Base64;
var TextUtils = /** @class */ (function () {
    function TextUtils() {
    }
    TextUtils.isNotEmptyString = function (s) {
        return (s != null) && (s != undefined) && (s.length > 0);
    };
    TextUtils.isNullOrUndefined = function (s) {
        return (s != null) && (s != undefined);
    };
    TextUtils.zeroPad = function (num, length) {
        num = num || 0;
        var res = num.toString();
        while (res.length < length) {
            res = '0' + res;
        }
        return res;
    };
    TextUtils.isDate = function (s) {
        if (typeof s === "string") {
            return TextUtils.REG_DATETIME_ISO.test(s);
        }
        return false;
    };
    TextUtils.isGuid = function (s) {
        if (typeof s === "string") {
            return TextUtils.REG_GUID_STRING.test(s);
        }
        return false;
    };
    TextUtils.isAbsoluteURI = function (s) {
        if (typeof s === "string") {
            return TextUtils.REG_ABSOLUTE_URI.test(s);
        }
        return false;
    };
    TextUtils.isRelativeURI = function (s) {
        if (typeof s === "string") {
            return TextUtils.REG_RELATIVE_URI.test(s);
        }
        return false;
    };
    TextUtils.isNumber = function (s) {
        if (typeof s === "string") {
            return TextUtils.REG_NUMBER_STRING.test(s);
        }
        else if (typeof s === 'number') {
            return true;
        }
        return false;
    };
    TextUtils.parseDate = function (s) {
        if (TextUtils.isDate(s)) {
            return new Date(s);
        }
        return;
    };
    /**
     * Encodes the given string to Base-64 format
     * @param {string} s - A string to encode
     * @returns {string}
     */
    TextUtils.toBase64 = function (s) {
        var cv = new Base64();
        return cv.encode(s);
    };
    /**
     * Decodes the given string from Base-64 format
     * @param {string} s - A base-64 encoded string
     * @returns {string}
     */
    TextUtils.fromBase64 = function (s) {
        var cv = new Base64();
        return cv.decode(s);
    };
    TextUtils.format = function (s) {
        var p = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            p[_i - 1] = arguments[_i];
        }
        var i = 0;
        return s.replace(/%[sdfj%]/g, function (x) {
            if (x === "%%")
                return "%";
            if (i >= p.length)
                return x;
            var p1 = p[i++];
            if (((p1 == null) && (p1 == undefined))) {
                return "";
            }
            switch (x) {
                case "%s":
                    return p1.toString();
                case "%d":
                    return parseInt(p1);
                case "%f":
                    return parseFloat(p1);
                case "%j":
                    return JSON.stringify(p1);
                default:
                    return x;
            }
        });
    };
    TextUtils.escape = function (val) {
        if ((val == null) || (val == undefined)) {
            return "null";
        }
        if (typeof val === 'boolean') {
            return (val) ? "true" : "false";
        }
        if (typeof val === 'number') {
            return val + "";
        }
        if (val instanceof Date) {
            var dt = val;
            var year = dt.getFullYear();
            var month = TextUtils.zeroPad(dt.getMonth() + 1, 2);
            var day = TextUtils.zeroPad(dt.getDate(), 2);
            var hour = TextUtils.zeroPad(dt.getHours(), 2);
            var minute = TextUtils.zeroPad(dt.getMinutes(), 2);
            var second = TextUtils.zeroPad(dt.getSeconds(), 2);
            var millisecond = TextUtils.zeroPad(dt.getMilliseconds(), 3);
            //format timezone
            var offset = (new Date()).getTimezoneOffset(), timezone = (offset >= 0 ? '+' : '') + TextUtils.zeroPad(Math.floor(offset / 60), 2) + ':' + TextUtils.zeroPad(offset % 60, 2);
            return "'" + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millisecond + timezone + "'";
        }
        if (val instanceof Array) {
            var values_1 = [];
            val.forEach(function (x) {
                values_1.push(TextUtils.escape(x));
            });
            return values_1.join(',');
        }
        if (typeof val === "string") {
            var res = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
                switch (s) {
                    case "\0": return "\\0";
                    case "\n": return "\\n";
                    case "\r": return "\\r";
                    case "\b": return "\\b";
                    case "\t": return "\\t";
                    case "\x1a": return "\\Z";
                    default: return "\\" + s;
                }
            });
            return "'" + res + "'";
        }
        //otherwise get valueOf
        if (val.hasOwnProperty("$name"))
            return val["$name"];
        else
            return TextUtils.escape(val.valueOf());
    };
    TextUtils.REG_DATETIME_ISO = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?([+-](\d+):(\d+))?$/;
    TextUtils.REG_GUID_STRING = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/;
    TextUtils.REG_ABSOLUTE_URI = /^((https?|ftps?):\/\/)([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    TextUtils.REG_RELATIVE_URI = /^([\/\w .-]*)*\/?$/;
    TextUtils.REG_NUMBER_STRING = /^\d+$/;
    return TextUtils;
}());
exports.TextUtils = TextUtils;
var Args = /** @class */ (function () {
    function Args() {
    }
    Args.check = function (expr, message, code) {
        if (!expr) {
            throw new CodedError(message, code || "EARG");
        }
    };
    Args.notNull = function (obj, name) {
        Args.check((obj != null) && (obj !== undefined), name + " may not be null or undefined", "ENULL");
    };
    Args.notEmpty = function (obj, name) {
        Args.check((obj != null) && (obj !== undefined) && (obj.length > 0), name + " may not be empty", "ENULL");
    };
    Args.notNegative = function (obj, name) {
        Args.check((typeof obj === 'number'), name + " may be a number", "ENUMBER");
        Args.check((obj >= 0), name + " may not be negative", "ENUMBER");
    };
    Args.Positive = function (obj, name) {
        Args.check((typeof obj === 'number'), name + " may be a number", "ENUMBER");
        Args.check((obj > 0), name + " must be a positive number", "ENUMBER");
    };
    return Args;
}());
exports.Args = Args;
//# sourceMappingURL=common.js.map