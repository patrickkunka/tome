import * as chai from 'chai';

import MarkupTag             from '../Constants/MarkupTag';
import Markup                from '../Markup';
import State                 from '../State';
import insertLineBreak from './insertLineBreak';

const assert = chai.assert;

describe('insertLineBreak()', () => {
    it('should coerce consecutive line breaks into a block break from behind', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line o\nne.',
            markups: [
                new Markup([MarkupTag.P, 0, 10]),
                new Markup([MarkupTag.BR, 6, 6])
            ]
        });

        const nextState = insertLineBreak(prevState, {from: 7, to: 7});

        assert.equal(nextState.text, 'Line o\n\nne.');
        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[0], new Markup([MarkupTag.P, 0, 6]));
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.P, 8, 11]));
    });

    it('should coerce consecutive line breaks into a block break from in front', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line o\nne.',
            markups: [
                new Markup([MarkupTag.P, 0, 10]),
                new Markup([MarkupTag.BR, 6, 6])
            ]
        });

        const nextState = insertLineBreak(prevState, {from: 6, to: 6});

        assert.equal(nextState.text, 'Line o\n\nne.');
        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[0], new Markup([MarkupTag.P, 0, 6]));
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.P, 8, 11]));
    });
});