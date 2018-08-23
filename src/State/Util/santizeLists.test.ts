import {assert} from 'chai';

import Markup from '../Markup';
import MarkupTag from '../Constants/MarkupTag';

import sanitizeLists from './sanitizeLists';

describe('sanitizeLists()', () => {
    it('joins back-to-back lists into a single list', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.UL, 0, 10]),
            new Markup([MarkupTag.LI, 0, 4]),
            new Markup([MarkupTag.LI, 6, 10]),
            new Markup([MarkupTag.UL, 12, 20]),
            new Markup([MarkupTag.LI, 12, 14]),
            new Markup([MarkupTag.LI, 16, 20])
        ];

        sanitizeLists(markups);

        assert.equal(markups.length, 5);
    });

    it('does not join back-to-back lists into a single list of the lists are of different types', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.UL, 0, 10]),
            new Markup([MarkupTag.LI, 0, 4]),
            new Markup([MarkupTag.LI, 6, 10]),
            new Markup([MarkupTag.OL, 12, 20]),
            new Markup([MarkupTag.LI, 12, 14]),
            new Markup([MarkupTag.LI, 16, 20]),
            new Markup([MarkupTag.P, 22, 24]),
            new Markup([MarkupTag.EM, 23, 24])
        ];

        sanitizeLists(markups);

        assert.equal(markups.length, 8);
    });

    it('removes lists which are enveloped by other lists', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.UL, 0, 10]),
            new Markup([MarkupTag.OL, 6, 10]),
            new Markup([MarkupTag.LI, 0, 4]),
            new Markup([MarkupTag.LI, 6, 10])
        ];

        sanitizeLists(markups);

        assert.equal(markups.length, 3);
    });

    it('extends lists which don\'t fully envelop their child list item', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.UL, 0, 10]),
            new Markup([MarkupTag.LI, 0, 14]),
        ];

        sanitizeLists(markups);

        assert.equal(markups[0].end, 14);
    });

    it('collapses lists which over extend their child list items', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.UL, 0, 10]),
            new Markup([MarkupTag.LI, 0, 8]),
            new Markup([MarkupTag.P, 10, 14])
        ];

        sanitizeLists(markups);

        assert.equal(markups[0].end, 8);
    });

    it('removes lists with no child list items', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.UL, 0, 10]),
            new Markup([MarkupTag.P, 10, 14])
        ];

        sanitizeLists(markups);

        assert.equal(markups.length, 1);
    });

    it('wraps orphaned list items with a `<ul>`', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.LI, 0, 5]),
            new Markup([MarkupTag.LI, 7, 10])
        ];

        sanitizeLists(markups);

        assert.equal(markups.length, 3);

        const firstMarkup = markups[0];

        assert.equal(firstMarkup.tag, MarkupTag.UL);
        assert.equal(firstMarkup.start, 0);
        assert.equal(firstMarkup.end, 10);
    });
});