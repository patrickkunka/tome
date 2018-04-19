import * as chai from 'chai';

import MarkupTag     from '../Constants/MarkupTag';
import Markup        from '../Markup';
import State         from '../State';
import TomeSelection from '../TomeSelection';
import setSelection  from './setSelection';

const assert = chai.assert;

describe('setSelection()', () => {
    it('should remove inline markup overrides when the selection is changed', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        prevState.activeInlineMarkups.overrides.push(MarkupTag.STRONG);

        const nextState = setSelection(prevState, {from: 2, to: 2});

        assert.equal(nextState.activeInlineMarkups.overrides.length, 0);
    });

    it('should jump to the next markup if a selection would end up within a custom markup', () => {
        const prevState = Object.assign(new State(), {
            text: 'Foo.\n\nBar.\n\n\n\nBaz.',
            markups: [
                new Markup([MarkupTag.P, 0, 4]),
                new Markup([MarkupTag.P, 6, 10]),
                new Markup(['foo', 12, 12, {foo: 'bar'}]),
                new Markup([MarkupTag.P, 14, 18])
            ]
        });

        const nextState = setSelection(prevState, {from: 12, to: 15});

        assert.deepEqual(nextState.selection, new TomeSelection(14, 14));
    });
});