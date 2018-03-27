import * as chai from 'chai';

import MarkupTag    from '../Constants/MarkupTag';
import Markup       from '../Markup';
import replaceValue from './replaceValue';

const assert = chai.assert;

describe('replaceValue()', () => {
    it('should completely replace an existing state', () => {
        const nextState = replaceValue({
            text: 'Lorem ipsum\ndolor sit.',
            markups: [
                [MarkupTag.P, 0, 22],
                [MarkupTag.BR, 11, 11]
            ]
        });

        assert.equal(nextState.text, 'Lorem ipsum\ndolor sit.');
        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[0], new Markup([MarkupTag.P, 0, 22]));
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.BR, 11, 11]));
        assert.equal(nextState.selection.from, 22);
    });
});