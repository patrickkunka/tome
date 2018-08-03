import {assert} from 'chai';

import camelCase from './camelCase';

describe('camelCase()', () => {
    it('should convert a pascal case string to camel case', () => {
        const result = camelCase('PascalCaseInput');

        assert.equal(result, 'pascalCaseInput');
    });

    it('should convert a snake case string to camel case', () => {
        const result = camelCase('snake_case_input');

        assert.equal(result, 'snakeCaseInput');
    });

    it('should convert a dash case string to camel case', () => {
        const result = camelCase('dash-case-input');

        assert.equal(result, 'dashCaseInput');
    });

    it('handles an empty string', () => {
        const result = camelCase('');

        assert.equal(result, '');
    });
});
