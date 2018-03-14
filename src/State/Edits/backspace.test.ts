import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import MarkupTag     from '../Constants/MarkupTag';
import Markup        from '../Markup';
import State         from '../State';
import TomeSelection from '../TomeSelection';
import backspace     from './backspace';

chai.use(deepEqual);

const assert = chai.assert;

describe('backspace()', () => {
    it(
        'should convert the first list item of a list into a paragraph ' +
        'when backspacing from its start',
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

    it('should delete a custom block when backspacing from the start of its subsequent block', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\n\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup(['foo' as MarkupTag, 11, 11]),
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
                new Markup(['foo' as MarkupTag, 11, 11]),
                new Markup([MarkupTag.P, 13, 13])
            ]
        });

        const {markups} = backspace(prevState, new TomeSelection(13, 13));

        assert.equal(markups.length, 2);

        const [firstMarkup, secondMarkup] = markups;

        assert.equal(firstMarkup.tag, MarkupTag.P);
        assert.deepEqual(secondMarkup, new Markup([MarkupTag.P, 13, 13]));
    });
});
