import * as chai from 'chai';

import MarkupTag       from '../Constants/MarkupTag';
import Markup          from '../Markup';
import State           from '../State';
import removeCustomBlock from './removeCustomBlock';

const assert = chai.assert;

describe('removeCustomBlock()', () => {
    it('removes the provided custom block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Foo.\n\nBar.\n\n\n\nBaz.',
            markups: [
                new Markup([MarkupTag.P, 0, 4]),
                new Markup([MarkupTag.P, 6, 10]),
                new Markup(['foo', 12, 12, {foo: 'bar'}]),
                new Markup([MarkupTag.P, 14, 18])
            ]
        });

        const nextState = removeCustomBlock(prevState, {
            markup: prevState.markups[2]
        });

        assert.equal(nextState.text, 'Foo.\n\nBar.\n\nBaz.');
        assert.equal(nextState.markups.length, 3);
    });

    it('removes a final custom block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Foo.\n\nBar.\n\n',
            markups: [
                new Markup([MarkupTag.P, 0, 4]),
                new Markup([MarkupTag.P, 6, 10]),
                new Markup(['foo', 12, 12, {foo: 'bar'}])
            ]
        });

        const nextState = removeCustomBlock(prevState, {
            markup: prevState.markups[2]
        });

        assert.equal(nextState.text, 'Foo.\n\nBar.');
        assert.equal(nextState.markups.length, 2);
    });
});