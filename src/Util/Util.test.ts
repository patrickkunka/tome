/* eslint-disable no-magic-numbers */

import * as chai from 'chai';
import Util      from './Util';

const assert = chai.assert;

describe('Util', () => {
    describe('#isGreaterPath()', () => {
        it('should return true if the first node is greater than the second one', () => {
            assert.isOk(Util.isGreaterPath([1], [0]));
            assert.isNotOk(Util.isGreaterPath([0], [1]));
            assert.isOk(Util.isGreaterPath([5], [0]));
            assert.isOk(Util.isGreaterPath([500], [60]));
            assert.isOk(Util.isGreaterPath([1, 10], [1, 5]));
            assert.isOk(Util.isGreaterPath([10, 0], [6, 0]));
            assert.isNotOk(Util.isGreaterPath([1, 10], [1, 10]));
            assert.isNotOk(Util.isGreaterPath([10, 1], [15, 10, 3]));
            assert.isNotOk(Util.isGreaterPath([0, 1, 0], [2, 0, 0]));
        });
    });
});