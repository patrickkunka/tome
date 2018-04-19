import * as chai from 'chai';

import MarkupTag       from '../Constants/MarkupTag';
import Markup          from '../Markup';
import State           from '../State';
import moveCustomBlock from './moveCustomBlock';

const assert = chai.assert;

describe('moveCustomBlock()', () => {
    it('moves a custom block forwards by the provided offset', () => {
        const prevState = Object.assign(new State(), {
            text: 'Foo.\n\nBar.\n\n\n\nBaz.',
            markups: [
                new Markup([MarkupTag.P, 0, 4]),
                new Markup([MarkupTag.P, 6, 10]),
                new Markup(['foo', 12, 12, {foo: 'bar'}]),
                new Markup([MarkupTag.P, 14, 18])
            ]
        });

        const nextState = moveCustomBlock(prevState, {
            markup: prevState.markups[2],
            index: 2,
            offset: 1
        });

        assert.equal(nextState.text, 'Foo.\n\nBar.\n\nBaz.\n\n\n\n');
        assert.equal(nextState.markups.length, 5);
        assert.deepEqual(nextState.markups[3], new Markup(['foo', 18, 18, {foo: 'bar'}]));
        assert.deepEqual(nextState.markups[4], new Markup([MarkupTag.P, 20, 20]));
    });

    it('moves a custom block backwards by the provided offset', () => {
        const prevState = Object.assign(new State(), {
            text: 'Foo.\n\nBar.\n\n\n\nBaz.',
            markups: [
                new Markup([MarkupTag.P, 0, 4]),
                new Markup([MarkupTag.P, 6, 10]),
                new Markup(['foo', 12, 12, {foo: 'bar'}]),
                new Markup([MarkupTag.P, 14, 18])
            ]
        });

        const nextState = moveCustomBlock(prevState, {
            markup: prevState.markups[2],
            index: 2,
            offset: -2
        });

        assert.equal(nextState.text, '\n\nFoo.\n\nBar.\n\nBaz.');
        assert.equal(nextState.markups.length, 4);
        assert.deepEqual(nextState.markups[0], new Markup(['foo', 0, 0, {foo: 'bar'}]));
    });

    it('will not move a markup beyond a minimum index', () => {
        const prevState = Object.assign(new State(), {
            text: 'Foo.\n\nBar.\n\n\n\nBaz.',
            markups: [
                new Markup([MarkupTag.P, 0, 4]),
                new Markup([MarkupTag.P, 6, 10]),
                new Markup(['foo', 12, 12, {foo: 'bar'}]),
                new Markup([MarkupTag.P, 14, 18])
            ]
        });

        const nextState = moveCustomBlock(prevState, {
            markup: prevState.markups[2],
            index: 2,
            offset: -4000
        });

        assert.equal(nextState.text, '\n\nFoo.\n\nBar.\n\nBaz.');
        assert.equal(nextState.markups.length, 4);
        assert.deepEqual(nextState.markups[0], new Markup(['foo', 0, 0, {foo: 'bar'}]));
    });

    it('will not move a markup beyond a maximum index', () => {
        const prevState = Object.assign(new State(), {
            text: 'Foo.\n\nBar.\n\n\n\nBaz.',
            markups: [
                new Markup([MarkupTag.P, 0, 4]),
                new Markup([MarkupTag.P, 6, 10]),
                new Markup(['foo', 12, 12, {foo: 'bar'}]),
                new Markup([MarkupTag.P, 14, 18])
            ]
        });

        const nextState = moveCustomBlock(prevState, {
            markup: prevState.markups[2],
            index: 2,
            offset: 4000
        });

        assert.equal(nextState.text, 'Foo.\n\nBar.\n\nBaz.\n\n\n\n');
        assert.equal(nextState.markups.length, 5);
        assert.deepEqual(nextState.markups[3], new Markup(['foo', 18, 18, {foo: 'bar'}]));
        assert.deepEqual(nextState.markups[4], new Markup([MarkupTag.P, 20, 20]));
    });

    it('will return the previous state for an offset of `0`', () => {
        const prevState = Object.assign(new State(), {
            text: 'Foo.\n\nBar.\n\n\n\nBaz.',
            markups: [
                new Markup([MarkupTag.P, 0, 4]),
                new Markup([MarkupTag.P, 6, 10]),
                new Markup(['foo', 12, 12, {foo: 'bar'}]),
                new Markup([MarkupTag.P, 14, 18])
            ]
        });

        const nextState = moveCustomBlock(prevState, {
            markup: prevState.markups[2],
            index: 2,
            offset: 0
        });

        assert.equal(prevState, nextState);
    });
});