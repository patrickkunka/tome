import * as chai from 'chai';

import MarkupTag          from '../Constants/MarkupTag';
import Markup             from '../Markup';
import State              from '../State';
import removeInlineMarkup from './removeInlineMarkup';

const assert = chai.assert;

describe('removeInlineMarkup', () => {
    it('should remove a portion of an inline link, creating two equal copies of it', () => {
        const anchorData = {
            href: 'https://www.kunkalabs.com',
            target: '_blank'
        };

        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28]),
                new Markup([MarkupTag.A, 6, 17, anchorData])
            ]
        });

        const newState = removeInlineMarkup(state, MarkupTag.A, 11, 12);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.A, 6, 11, anchorData]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.A, 12, 17, anchorData]));
    });

    it('should remove an inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 17])
            ]
        });

        const newState = removeInlineMarkup(state, MarkupTag.STRONG, 6, 17);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 1);
    });

    it('should remove the start of inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 17])
            ]
        });

        const newState = removeInlineMarkup(state, MarkupTag.STRONG, 6, 12);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 12, 17]));
    });

    it('should remove the end of inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 17])
            ]
        });

        const newState = removeInlineMarkup(state, MarkupTag.STRONG, 11, 17);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 11]));
    });

    it('should remove an internal section of an inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 17])
            ]
        });

        const newState = removeInlineMarkup(state, MarkupTag.STRONG, 12, 14);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 12]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.STRONG, 14, 17]));
    });
});