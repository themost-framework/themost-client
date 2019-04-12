import { TextUtils } from '../src/common';
import { assert } from 'chai';
describe('TextUtils Test', () => {
    it('should parse date', () => {
        const x: boolean = true;
        assert.isOk(TextUtils.isDate('2017-01-01T12:45:00.000Z'));
    });
    it('should parse date only', () => {
        assert.isOk(TextUtils.isDate('2017-01-01'));
    });
});
