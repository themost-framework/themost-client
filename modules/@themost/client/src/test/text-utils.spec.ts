import {TextUtils} from '../common';
describe('TextUtils', () => {
    it('execute TextUtils.isNotEmptyString(value)', () => {
        expect(TextUtils.isNotEmptyString(null)).toBe(false);
        expect(TextUtils.isNotEmptyString(undefined)).toBe(false);
        expect(TextUtils.isNotEmptyString('test')).toBe(true);
        expect(TextUtils.isNotEmptyString('')).toBe(false);
    });
    it('execute TextUtils.isNullOrUndefined(value)', () => {
        expect(TextUtils.isNullOrUndefined(null)).toBe(true);
        expect(TextUtils.isNullOrUndefined(undefined)).toBe(true);
        expect(TextUtils.isNullOrUndefined('test')).toBe(false);
    });
    it('execute TextUtils.zeroPad(value)', () => {
        expect(TextUtils.zeroPad(4, 2)).toBe('04');
        expect(TextUtils.zeroPad(14, 2)).toBe('14');
        expect(() => {
            TextUtils.zeroPad(4.5, 2);
        }).toThrow(new TypeError('Expected a positive integer.'));
        expect(() => {
            TextUtils.zeroPad(-10, 2);
        }).toThrow(new TypeError('Expected a positive integer.'));
    });
    it('execute TextUtils.isDate(value)', () => {
        expect(TextUtils.isDate(null)).toBe(false);
        expect(TextUtils.isDate(undefined)).toBe(false);
        expect(TextUtils.isDate('')).toBe(false);
        expect(TextUtils.isDate('2010-01-24 12:45:00.000+02:00')).toBe(true, '2010-01-24 12:45:00.000+02:00');
        expect(TextUtils.isDate('2010-01-24 12:45:00.000')).toBe(true, '2010-01-24 12:45:00.000');
        expect(TextUtils.isDate('2010-01-24 12:45:00')).toBe(true, '2010-01-24 12:45:00');
        expect(TextUtils.isDate('2010-01-24 12:45')).toBe(true, '2010-01-24 12:45');
        expect(TextUtils.isDate('2010-01-24')).toBe(false, '2010-01-24');
        expect(TextUtils.isDate('2010-01-24T12:45:00.000Z')).toBe(true, '2010-01-24T12:45:00.000Z');
        expect(TextUtils.isDate('2010-01-24T12:45:00Z')).toBe(true, '2010-01-24T12:45:00Z');
        expect(TextUtils.isDate('2019-04-13T15:34:14+00:00')).toBe(true, '2019-04-13T15:34:14+00:00');
    });
    it('execute TextUtils.escape(null)', () => {
        expect(TextUtils.escape(null)).toBe('null');
    });
    it('execute TextUtils.escape(undefined)', () => {
        expect(TextUtils.escape(undefined)).toBe('null');
    });
    it('execute TextUtils.escape(int)', () => {
       expect(TextUtils.escape(5)).toBe('5');
    });
    it('execute TextUtils.escape(number)', () => {
        expect(TextUtils.escape(5.4)).toBe('5.4');
    });
    it('execute TextUtils.escape(boolean)', () => {
        expect(TextUtils.escape(true)).toBe('true');
    });
    it('execute TextUtils.escape(Date)', () => {
        // get timezone from string
        let timezone = new Date(2001, 0, 20).toString().match(/([-+][0-9]+)\s/)[1];
        timezone = timezone.substr(0, timezone.length - 2) + ':' + timezone.substr(timezone.length - 2, 2);
        // validate date
        expect(TextUtils.escape(new Date(2001, 0, 20))).toBe(`'2001-01-20 00:00:00.000${timezone}'`);
    });
    it('execute TextUtils.escape(array)', () => {
        expect(TextUtils.escape([1, 2, 3])).toBe('1,2,3');
    });
    it('execute TextUtils.escape(string)', () => {
        expect(TextUtils.escape('Testing')).toBe('\'Testing\'');
    });
    it('execute TextUtils.escape(object)', () => {
        expect(TextUtils.escape({
            $name: 'me'
        })).toBe('me');
    });
});
