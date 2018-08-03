import {assert} from 'chai';

import pascalCase from './pascalCase';

describe('pascalCase()', () => {
    it('should convert a camel case string to pascal case', () => {
        const result = pascalCase('camelCaseInput');

        assert.equal(result, 'CamelCaseInput');
    });

    it('should convert a snake case string to pascal case', () => {
        const result = pascalCase('snake_case_input');

        assert.equal(result, 'SnakeCaseInput');
    });

    it('should convert a dash case string to pascal case', () => {
        const result = pascalCase('dash-case-input');

        assert.equal(result, 'DashCaseInput');
    });

    it('handles an empty string', () => {
        const result = pascalCase('');

        assert.equal(result, '');
    });
});
