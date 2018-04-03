import * as chai      from 'chai';

import MarkupTag     from '../Constants/MarkupTag';
import Markup        from '../Markup';
import State         from '../State';
import TomeSelection from '../TomeSelection';
import backspace     from './backspace';

const assert = chai.assert;

const customTag = 'foo' as MarkupTag;

describe('backspace()', () => {
    it(
        'should return the previous state if backspacing from the start',
        () => {
            const prevState = Object.assign(new State(), {
                text: 'foo',
                markups: [
                    new Markup([MarkupTag.P, 0, 3])
                ]
            });

            const nextState = backspace(prevState, new TomeSelection(0, 0));

            assert.equal(prevState, nextState);
        }
    );

    it(
        'should delete a single character for a collapsed selection',
        () => {
            const prevState = Object.assign(new State(), {
                text: 'foo',
                markups: [
                    new Markup([MarkupTag.P, 0, 3])
                ]
            });

            const nextState = backspace(prevState, new TomeSelection(1, 1));

            assert.equal(nextState.text, 'oo');
        }
    );

    it(
        'should delete multiple characters for a collapsed selection',
        () => {
            const prevState = Object.assign(new State(), {
                text: 'foo',
                markups: [
                    new Markup([MarkupTag.P, 0, 3])
                ]
            });

            const nextState = backspace(prevState, new TomeSelection(1, 3));

            assert.equal(nextState.text, 'f');
        }
    );

    it(
        'should convert the first list item of a list into a paragraph ' +
        'when backspacing from its start and when there is no previous markup',
        () => {
            const firstListItem = new Markup([MarkupTag.LI, 0, 12]);

            const prevState = Object.assign(new State(), {
                text: 'List item 1.\n\nList item 2.',
                markups: [
                    new Markup([MarkupTag.UL, 0, 42]),
                    firstListItem,
                    new Markup([MarkupTag.LI, 14, 26])
                ],
                envelopedBlockMarkups: [
                    firstListItem
                ],
                activeBlockMarkup: firstListItem
            });

            const nextState = backspace(prevState, new TomeSelection(0, 0));
            const {markups} = nextState;

            assert.equal(markups.length, 3);

            const [firstMarkup, secondMarkup, thirdMarkup] = markups;

            assert.equal(firstMarkup.tag, MarkupTag.P);
            assert.equal(secondMarkup.tag, MarkupTag.UL);
            assert.equal(thirdMarkup.tag, MarkupTag.LI);
        }
    );

    it(
        'should convert the first list item of a list into a paragraph ' +
        'when backspacing from its start and when the previous markup is a' +
        'paragraph block',
        () => {
            const firstListItem = new Markup([MarkupTag.LI, 6, 18]);

            const prevState = Object.assign(new State(), {
                text: 'Foo.\n\nList item 1.\n\nList item 2.',
                markups: [
                    new Markup([MarkupTag.P, 0, 4]),
                    new Markup([MarkupTag.UL, 6, 32]),
                    firstListItem,
                    new Markup([MarkupTag.LI, 20, 32])
                ],
                envelopedBlockMarkups: [
                    firstListItem
                ],
                activeBlockMarkup: firstListItem
            });

            const nextState = backspace(prevState, new TomeSelection(6, 6));
            const {markups} = nextState;

            assert.equal(markups.length, 4);

            const [firstMarkup, secondMarkup, thirdMarkup, fourthMarkup] = markups;

            assert.equal(firstMarkup.tag, MarkupTag.P);
            assert.equal(secondMarkup.tag, MarkupTag.P);
            assert.equal(thirdMarkup.tag, MarkupTag.UL);
            assert.equal(fourthMarkup.tag, MarkupTag.LI);
        }
    );

    it(
        'should join two lists together when backspacing from one to the other',
        () => {
            const secondListItem = new Markup([MarkupTag.UL, 14, 26]);

            const prevState = Object.assign(new State(), {
                text: 'List item 1.\n\nList item 2.',
                markups: [
                    new Markup([MarkupTag.UL, 0, 12]),
                    new Markup([MarkupTag.LI, 0, 12]),
                    secondListItem,
                    new Markup([MarkupTag.LI, 14, 26])
                ],
                envelopedBlockMarkups: [
                    secondListItem
                ],
                activeBlockMarkup: secondListItem
            });

            const nextState = backspace(prevState, new TomeSelection(14, 14));
            const {markups, text} = nextState;

            assert.equal(markups.length, 2);
            assert.equal(markups[0].tag, MarkupTag.UL);
            assert.equal(markups[1].tag, MarkupTag.LI);
            assert.equal(text, 'List item 1.List item 2.');
        }
    );

    it('should delete a custom block when backspacing from the start of its subsequent block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\n\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([customTag, 11, 11]),
                new Markup([MarkupTag.P, 13, 22])
            ]
        });

        const {markups} = backspace(prevState, new TomeSelection(13, 13));

        assert.equal(markups.length, 2);

        const [firstMarkup, secondMarkup] = markups;

        assert.equal(firstMarkup.tag, MarkupTag.P);
        assert.equal(secondMarkup.tag, MarkupTag.P);
        assert.equal(secondMarkup.start, 11);
        assert.equal(secondMarkup.end, 20);
    });

    it('should delete a custom block when backspacing from the start of a subsequent empty block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\n\n\n',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([customTag, 11, 11]),
                new Markup([MarkupTag.P, 13, 13])
            ]
        });

        const {markups, text} = backspace(prevState, new TomeSelection(13, 13));

        assert.equal(markups.length, 2);
        assert.equal(text, 'Line one.\n\n');

        const [firstMarkup, secondMarkup] = markups;

        assert.deepEqual(firstMarkup, new Markup([MarkupTag.P, 0, 9]));
        assert.deepEqual(secondMarkup, new Markup([MarkupTag.P, 11, 11]));
    });
});
