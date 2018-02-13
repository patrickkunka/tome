import * as chai from 'chai';

import HtmlEntity          from '../Constants/HtmlEntity';
import MarkupTag           from '../Constants/MarkupTag';
import Markup              from '../Markup';
import State               from '../State';
import TomeSelection       from '../TomeSelection';
import setActiveMarkups    from '../Util/setActiveMarkups';
import insertFromClipboard from './insertFromClipboard';

const assert = chai.assert;

describe('removeInlineMarkup()', () => {
    it('should insert a single unformatted line from the clipboard', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 20])
            ]
        });

        const nextState = insertFromClipboard(prevState, {
            text: 'Lorem ipsum',
            html: ''
        }, 20, 20);

        assert.equal(nextState.text, 'Line one.\n\nLine two.Lorem ipsum');
        assert.equal(nextState.markups.length, 2);

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 9]),
            new Markup([MarkupTag.P, 11, 31])
        ]);
    });

    it('should insert a line with a break from the clipboard', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 20])
            ]
        });

        const nextState = insertFromClipboard(prevState, {
            text: 'Lorem\nipsum',
            html: ''
        }, 20, 20);

        assert.equal(nextState.text, 'Line one.\n\nLine two.Lorem\nipsum');
        assert.equal(nextState.markups.length, 3);

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 9]),
            new Markup([MarkupTag.P, 11, 31]),
            new Markup([MarkupTag.BR, 25, 25])
        ]);
    });

    it('should insert a single line at a line break from the clipboard', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n',
            markups: [
                new Markup([MarkupTag.P, 0, 10]),
                new Markup([MarkupTag.BR, 9, 9])
            ]
        });

        const nextState = insertFromClipboard(prevState, {
            text: 'Line two.',
            html: ''
        }, 10, 10);

        assert.equal(nextState.text, 'Line one.\nLine two.');
        assert.equal(nextState.markups.length, 2);

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 19]),
            new Markup([MarkupTag.BR, 9, 9])
        ]);
    });

    it('should insert multiple paragraphs from the clipboard', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 20])
            ]
        });

        const nextState = insertFromClipboard(prevState, {
            text: 'Line three.\n\nLine four.',
            html: ''
        }, 20, 20);

        assert.equal(nextState.text, 'Line one.\n\nLine two.Line three.\n\nLine four.');
        assert.equal(nextState.markups.length, 3);

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 9]),
            new Markup([MarkupTag.P, 11, 31]),
            new Markup([MarkupTag.P, 33, 43])
        ]);
    });

    it('should respect inline markup overrides when pasting character(s)', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        prevState.activeInlineMarkups.overrides.push(MarkupTag.EM);

        const nextState = insertFromClipboard(prevState, {
            text: ' Line two.',
            html: ''
        }, 9, 9);

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 19]),
            new Markup([MarkupTag.EM, 9, 19])
        ]);

        assert.equal(nextState.activeInlineMarkups.overrides.length, 0);
    });

    it('should respect inline markup overrides when pasting multi-block content', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ],
            selection: new TomeSelection(9, 9)
        });

        setActiveMarkups(prevState, prevState.selection);

        prevState.activeInlineMarkups.overrides.push(MarkupTag.EM);

        const nextState = insertFromClipboard(prevState, {
            text: ' Line two.' + HtmlEntity.BLOCK_BREAK + 'Line three.',
            html: ''
        }, 9, 9);

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 19]),
            new Markup([MarkupTag.EM, 9, 19]),
            new Markup([MarkupTag.P, 21, 32]),
            new Markup([MarkupTag.EM, 21, 32])
        ]);

        assert.equal(nextState.activeInlineMarkups.overrides.length, 0);
        assert.equal(nextState.activeInlineMarkups.tags.length, 1);
        assert.equal(nextState.activeInlineMarkups.tags[0], MarkupTag.EM);

        assert.deepEqual(nextState.selection, new TomeSelection(32, 32));
    });
});