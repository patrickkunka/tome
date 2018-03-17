/* eslint-disable no-magic-numbers */

import * as chai from 'chai';
import isGreaterPath from './isGreaterPath';

const assert = chai.assert;

describe('#isGreaterPath()', () => {
    it('should return true if the first node is greater than the second one', () => {
        assert.isOk(isGreaterPath([1], [0]));
        assert.isNotOk(isGreaterPath([0], [1]));
        assert.isOk(isGreaterPath([5], [0]));
        assert.isOk(isGreaterPath([500], [60]));
        assert.isOk(isGreaterPath([1, 10], [1, 5]));
        assert.isOk(isGreaterPath([10, 0], [6, 0]));
        assert.isNotOk(isGreaterPath([1, 10], [1, 10]));
        assert.isNotOk(isGreaterPath([10, 1], [15, 10, 3]));
        assert.isNotOk(isGreaterPath([0, 1, 0], [2, 0, 0]));
    });
});