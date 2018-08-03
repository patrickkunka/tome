import {assert} from 'chai';

import TypedArray from './TypedArray';

describe('TypedArray()', () => {
    it('enherits from `Array`', () => {
        const arr = new TypedArray();

        assert.instanceOf(arr, Array);
    });

    it('accepts a generic type which restricts the `push()` method to that type', () => {
        const arr = new TypedArray<boolean>();

        arr.push(false);

        assert.equal(arr.length, 1);
    });

    describe('.map()', () => {
        it('accepts a generic type which maps the output of the `.map()` method to that type', () => {
            const arr = new TypedArray<boolean>();

            arr.push(false, true, false);

            const mapped = arr.map<string>(value => value ? 'fizz' : 'buzz');

            assert.deepEqual(mapped, ['buzz', 'fizz', 'buzz']);
        });
    })
});
