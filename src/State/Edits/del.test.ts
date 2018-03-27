import * as chai from 'chai';

import MarkupTag     from '../Constants/MarkupTag';
import Markup        from '../Markup';
import State         from '../State';
import TomeSelection from '../TomeSelection';
import del           from './del';

const assert = chai.assert;

describe('del()', () => {
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
