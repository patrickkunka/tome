import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import MarkupTag             from '../Constants/MarkupTag';
import Markup                from '../Markup';
import State                 from '../State';
import TomeSelection         from '../TomeSelection';
import insertCustomBlock     from './insertCustomBlock';

chai.use(deepEqual);

const assert = chai.assert;

const customTag = 'foo' as MarkupTag;

describe('insertCustomBlock()', () => {
    it('inserts a block break before a custom block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const nextState = insertCustomBlock(prevState, new TomeSelection(9, 9), {
            type: 'foo',
            data: {}
        });

        assert.equal(nextState.text, 'Line one.\n\n');
        assert.equal(nextState.selection.from, 11);
        assert.equal(nextState.selection.to, 11);
        assert.equal(nextState.markups.length, 2);
        assert.equal(nextState.markups[1].tag, 'foo');
    });

    it('inserts a block break on either side of a custom block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const nextState = insertCustomBlock(prevState, new TomeSelection(5, 5), {
            type: customTag,
            data: {}
        });

        assert.equal(nextState.text, 'Line \n\n\n\none.');
        assert.equal(nextState.selection.from, 7);
        assert.equal(nextState.selection.to, 7);
        assert.equal(nextState.markups.length, 3);
        assert.deepEqual(nextState.markups[1], new Markup([customTag, 7, 7]));
    });
});