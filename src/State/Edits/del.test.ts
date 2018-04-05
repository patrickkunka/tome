import * as chai from 'chai';

import MarkupTag     from '../Constants/MarkupTag';
import Markup        from '../Markup';
import State         from '../State';
import TomeSelection from '../TomeSelection';
import del           from './del';

const assert = chai.assert;

describe('del()', () => {
    it(
        'should return the previous state if deleting from the end',
        () => {
            const prevState = Object.assign(new State(), {
                text: 'foo',
                markups: [
                    new Markup([MarkupTag.P, 0, 3])
                ]
            });

            const nextState = del(prevState, new TomeSelection(3, 3));

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

            const nextState = del(prevState, new TomeSelection(1, 1));

            assert.equal(nextState.text, 'fo');
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

            const nextState = del(prevState, new TomeSelection(1, 3));

            assert.equal(nextState.text, 'f');
        }
    );

    it(
        'should join two lists together when deleting from one to the other',
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

            const nextState = del(prevState, new TomeSelection(12, 12));
            const {markups, text} = nextState;

            assert.equal(markups.length, 2);
            assert.equal(markups[0].tag, MarkupTag.UL);
            assert.equal(markups[1].tag, MarkupTag.LI);
            assert.equal(text, 'List item 1.List item 2.');
        }
    );

    it('should delete a custom block when deleting from the end of its preceeding block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\n\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup(['foo' as MarkupTag, 11, 11]),
                new Markup([MarkupTag.P, 13, 22])
            ]
        });

        const {markups} = del(prevState, new TomeSelection(9, 9));

        assert.equal(markups.length, 2);

        const [firstMarkup, secondMarkup] = markups;

        assert.equal(firstMarkup.tag, MarkupTag.P);
        assert.equal(secondMarkup.tag, MarkupTag.P);
        assert.equal(secondMarkup.start, 11);
        assert.equal(secondMarkup.end, 20);
    });
});
