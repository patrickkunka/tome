import {assert} from 'chai';

import joinMarkups from './joinMarkups';
import Markup      from '../Markup';
import MarkupTag   from '../Constants/MarkupTag';

describe('joinMarkups()', () => {
    it('joins two block markups of the same tag at the provided index', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.P, 10, 20])
        ];

        joinMarkups(markups, 10);

        assert.equal(markups.length, 1);
        assert.deepEqual(markups[0], new Markup([MarkupTag.P, 0, 20]));
    });

    it('joins two block markups of differnt tags at the provided index', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.H4, 10, 20])
        ];

        joinMarkups(markups, 10);

        assert.equal(markups.length, 1);
        assert.deepEqual(markups[0], new Markup([MarkupTag.P, 0, 20]));
    });

    it('joins two list items at the provided index', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.LI, 0, 10]),
            new Markup([MarkupTag.LI, 10, 20])
        ];

        joinMarkups(markups, 10);

        assert.equal(markups.length, 1);
        assert.deepEqual(markups[0], new Markup([MarkupTag.LI, 0, 20]));
    });

    it('joins multiple inline markups at the provided index', () => {
        const markups: Markup[] = [
            new Markup([MarkupTag.P, 0, 20]),
            new Markup([MarkupTag.EM, 5, 8]),
            new Markup([MarkupTag.STRONG, 5, 8]),
            new Markup([MarkupTag.EM, 8, 10]),
            new Markup([MarkupTag.STRONG, 8, 10])
        ];

        joinMarkups(markups, 8);

        assert.equal(markups.length, 3);
        assert.deepEqual(markups[1], new Markup([MarkupTag.EM, 5, 10]));
        assert.deepEqual(markups[2], new Markup([MarkupTag.STRONG, 5, 10]));
    });
});