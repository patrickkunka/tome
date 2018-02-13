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
});
