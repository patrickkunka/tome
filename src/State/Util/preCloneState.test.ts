import {assert} from 'chai';

import preCloneState from './preCloneState';
import State from '../State';
import Markup from '../Markup';
import MarkupTag from '../Constants/MarkupTag';

describe('preCloneState()', () => {
    it('deep copies a provided `State` object, maintaing types', () => {
        const sourceState = new State();

        sourceState.text = 'foo';
        sourceState.selection.from = 10;
        sourceState.selection.to = 14;

        const clonedState = preCloneState(sourceState);

        assert.deepEqual(sourceState, clonedState);

        assert.notEqual(sourceState.selection, clonedState.selection);
    });

    it('does not copy markups by default', () => {
        const sourceState = new State();

        sourceState.markups = [
            new Markup([MarkupTag.H1, 5, 7])
        ];

        const clonedState = preCloneState(sourceState);

        assert.equal(clonedState.markups.length, 0);
    });

    it('deep copies markups if instructed to', () => {
        const sourceState = new State();

        sourceState.markups = [
            new Markup([MarkupTag.P, 0, 3]),
            new Markup([MarkupTag.H1, 5, 7]),
            new Markup([MarkupTag.P, 9, 13])
        ];

        const clonedState = preCloneState(sourceState, true);

        assert.equal(clonedState.markups.length, 3);
        assert.notEqual(sourceState.markups[0], clonedState.markups[0]);
    });
});