import {assert} from 'chai';

import MarkupTag     from '../Constants/MarkupTag';
import Markup        from '../Markup';
import ingestMarkups from './ingestMarkups';

const createMarkups = () => [
    new Markup([MarkupTag.P, 0, 5]),
    new Markup([MarkupTag.P, 7, 11]),
    new Markup([MarkupTag.H1, 13, 17]),
    new Markup([MarkupTag.P, 19, 22])
];

describe('ingestMarkups()', () => {
    it('removes any markups matching the provided tag within the provided range', () => {
        const markups = createMarkups();

        ingestMarkups(markups, MarkupTag.H1, 10, 20);

        assert.equal(markups.length, 3);
        assert.isUndefined(markups.find(markup => markup.tag === MarkupTag.H1));
    });

    it('shortens any matching markups overlapping the start of the provided range', () => {
        const markups = createMarkups();

        ingestMarkups(markups, MarkupTag.H1, 15, 17);

        assert.deepEqual(markups[2], new Markup([MarkupTag.H1, 13, 15]));
    });

    it('splits any markups in two that overlap the start of the range, and extend past the end of it', () => {
        const markups = createMarkups();

        ingestMarkups(markups, MarkupTag.H1, 14, 16);

        assert.deepEqual(markups[2], new Markup([MarkupTag.H1, 13, 14]));
        assert.deepEqual(markups[3], new Markup([MarkupTag.H1, 16, 17]));
        assert.equal(markups.length, 5);
    });

    it('shortens any matching markups overlapping the end of the provided range', () => {
        const markups = createMarkups();

        ingestMarkups(markups, MarkupTag.H1, 12, 15);

        assert.deepEqual(markups[2], new Markup([MarkupTag.H1, 15, 17]));
    });
});
