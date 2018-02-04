import * as chai from 'chai';

import MarkupTag    from '../Constants/MarkupTag';
import Markup       from '../Markup';
import splitMarkups from './splitMarkups';

const assert = chai.assert;

describe('splitMarkups', () => {
    it('should split a block markup by creating a new one a block break later', () => {
        const markups = [
            new Markup([MarkupTag.P, 0, 10])
        ];

        const newMarkups = splitMarkups(markups, 5);

        assert.equal(newMarkups.length, 2);

        const originalMarkup = markups[0];
        const newMarkup = markups[1];

        assert.equal(originalMarkup.tag, newMarkup.tag);
        assert.equal(originalMarkup.start, 0);
        assert.equal(originalMarkup.end, 5);

        assert.equal(newMarkup.start, 7);
        assert.equal(newMarkup.end, 10);
    });

    it('should split a list item and extend the wrapping list', () => {
        const markups = [
            new Markup([MarkupTag.UL, 0, 40]),
            new Markup([MarkupTag.LI, 0, 12]),
            new Markup([MarkupTag.LI, 14, 26]),
            new Markup([MarkupTag.LI, 28, 40])
        ];

        const newMarkups = splitMarkups(markups, 33);

        assert.equal(newMarkups.length, 5);

        const originalListItem = markups[3];
        const newListItem = markups[4];
        const wrappingList = markups[0];

        assert.equal(originalListItem.tag, MarkupTag.LI);
        assert.equal(originalListItem.start, 28);
        assert.equal(originalListItem.end, 33);

        assert.equal(newListItem.tag, MarkupTag.LI);
        assert.equal(newListItem.start, 35);
        assert.equal(newListItem.end, 40);

        assert.equal(wrappingList.tag, MarkupTag.UL);
        assert.equal(wrappingList.start, 0);
        assert.equal(wrappingList.end, 40);
    });
});
