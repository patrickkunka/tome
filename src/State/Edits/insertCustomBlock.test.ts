import * as chai from 'chai';

import MarkupTag             from '../Constants/MarkupTag';
import Markup                from '../Markup';
import State                 from '../State';
import TomeSelection         from '../TomeSelection';
import insertCustomBlock     from './insertCustomBlock';

const assert = chai.assert;

const customTag = 'foo' as MarkupTag;

describe('insertCustomBlock()', () => {
    it('inserts a custom block at the end of a block', () => {
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

        assert.equal(nextState.text, 'Line one.\n\n\n\n');
        assert.equal(nextState.selection.from, 13);
        assert.equal(nextState.selection.to, 13);
        assert.equal(nextState.markups.length, 3);
        assert.equal(nextState.markups[1].tag, 'foo');
    });

    it('inserts a custom block at the start of a block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const nextState = insertCustomBlock(prevState, new TomeSelection(0, 0), {
            type: 'foo',
            data: {}
        });

        assert.equal(nextState.text, '\n\nLine one.');
        assert.equal(nextState.selection.from, 2);
        assert.equal(nextState.selection.to, 2);
        assert.equal(nextState.markups.length, 2);
        assert.equal(nextState.markups[0].tag, 'foo');
    });

    it('inserts a custom block within a block', () => {
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
        assert.equal(nextState.selection.from, 9);
        assert.equal(nextState.selection.to, 9);
        assert.equal(nextState.markups.length, 3);
        assert.deepEqual(nextState.markups[1], new Markup([customTag, 7, 7, {}]));
    });

    it('replaces an empty block with a custom block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\n\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 11]),
                new Markup([MarkupTag.P, 13, 22])
            ]
        });

        const nextState = insertCustomBlock(prevState, new TomeSelection(11, 11), {
            type: customTag,
            data: {}
        });

        assert.equal(nextState.text, 'Line one.\n\n\n\nLine two.');
        assert.equal(nextState.selection.from, 13);
        assert.equal(nextState.selection.to, 13);
        assert.equal(nextState.markups.length, 3);
        assert.deepEqual(nextState.markups[1], new Markup([customTag, 11, 11, {}]));
    });

    it('inserts a custom block within an inline markup', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 2, 6])
            ]
        });

        const nextState = insertCustomBlock(prevState, new TomeSelection(5, 5), {
            type: customTag,
            data: {}
        });

        assert.equal(nextState.text, 'Line \n\n\n\none.');
        assert.equal(nextState.selection.from, 9);
        assert.equal(nextState.selection.to, 9);
        assert.equal(nextState.markups.length, 5);
        assert.deepEqual(nextState.markups[2], new Markup([customTag, 7, 7, {}]));
    });

    it('inserts a custom block within a multi-line inline markup', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9]),
                new Markup([MarkupTag.P, 11, 20]),
                new Markup([MarkupTag.STRONG, 11, 15])
            ]
        });

        const nextState = insertCustomBlock(prevState, new TomeSelection(9, 9), {
            type: customTag,
            data: {}
        });

        assert.equal(nextState.text, 'Line one.\n\n\n\nLine two.');
        assert.equal(nextState.selection.from, 13);
        assert.equal(nextState.selection.to, 13);
        assert.equal(nextState.markups.length, 5);
        assert.deepEqual(nextState.markups[2], new Markup([customTag, 11, 11, {}]));
    });

    it('inserts a custom block at the end of an inline markup', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9])
            ]
        });

        const nextState = insertCustomBlock(prevState, new TomeSelection(9, 9), {
            type: customTag,
            data: {}
        });

        assert.equal(nextState.text, 'Line one.\n\n');
        assert.equal(nextState.selection.from, 11);
        assert.equal(nextState.selection.to, 11);
        assert.equal(nextState.markups.length, 3);
        assert.deepEqual(nextState.markups[2], new Markup([customTag, 11, 11, {}]));
    });

    it('inserts a custom block before an existing custom block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\n\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([customTag, 11, 11, {}]),
                new Markup([MarkupTag.P, 13, 22])
            ]
        });

        const nextState = insertCustomBlock(prevState, new TomeSelection(9, 9), {
            type: customTag,
            data: {}
        });

        assert.equal(nextState.text, 'Line one.\n\n\n\n\n\nLine two.');
        assert.equal(nextState.markups.length, 4);
        assert.deepEqual(nextState.markups[1], new Markup([customTag, 11, 11, {}]));
        assert.deepEqual(nextState.markups[2], new Markup([customTag, 13, 13, {}]));
        assert.deepEqual(nextState.markups[3], new Markup([MarkupTag.P, 15, 24]));
    });

    it('clears the selection before inserting a custom block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const nextState = insertCustomBlock(prevState, new TomeSelection(5, 9), {
            type: customTag,
            data: {}
        });

        assert.equal(nextState.markups.length, 3);
        assert.equal(nextState.text, 'Line \n\n\n\n');
    });
});