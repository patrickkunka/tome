import * as chai from 'chai';

import MarkupTag          from '../Constants/MarkupTag';
import SelectionDirection from '../Constants/SelectionDirection';
import Markup             from '../Markup';
import State              from '../State';
import TomeSelection      from '../TomeSelection';
import addInlineMarkup    from './addInlineMarkup';

const assert = chai.assert;

describe('addInlineMarkup()', () => {
    it('should add an inline markup within a selection', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28])
            ]
        });

        const newState = addInlineMarkup(state, MarkupTag.STRONG, 6, 11);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 11]));
    });

    it('should add an inline markup at the start of a selection', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28])
            ]
        });

        const newState = addInlineMarkup(state, MarkupTag.STRONG, 0, 5);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 0, 5]));
    });

    it('should add an inline markup at the end of a selection', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28])
            ]
        });

        const newState = addInlineMarkup(state, MarkupTag.STRONG, 23, 28);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 23, 28]));
    });

    it('should add an inline markup at the start of second block element', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.\nSit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 50])
            ]
        });

        const newState = addInlineMarkup(state, MarkupTag.STRONG, 19, 22);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.STRONG, 19, 22]));
    });

    it('should add an inline markups accross multiple blocks', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.\n\nSit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 19]),
                new Markup([MarkupTag.P, 20, 29])
            ],
            selection: {from: 0, to: 29, direction: SelectionDirection.LTR}
        });

        state.envelopedBlockMarkups = state.markups;

        const newState = addInlineMarkup(state, MarkupTag.EM, 0, 29);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 6);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 18]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.EM, 0, 18]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.P, 19, 19]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.EM, 19, 19]));
        assert.deepEqual(newState.markups[4], new Markup([MarkupTag.P, 20, 29]));
        assert.deepEqual(newState.markups[5], new Markup([MarkupTag.EM, 20, 29]));
        assert.deepEqual(
            newState.selection,
            Object.assign(new TomeSelection(), {from: 0, to: 29, direction: SelectionDirection.LTR})
        );
    });

    it('should not add inline markups over breaks between block markups', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.\nSit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 29])
            ]
        });

        state.envelopedBlockMarkups = [state.markups[1]];

        const newState = addInlineMarkup(state, MarkupTag.STRONG, 18, 29);

        assert.equal(newState.text, 'Lorem ipsum dolor.\nSit amet.');

        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 18]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 19, 29]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.STRONG, 19, 29]));
    });

    it('should not add inline markups over multiple breaks between block markups', () => {
        const state = Object.assign(new State(), {
            text: 'awd\n\nawd\nawd',
            markups: [
                new Markup([MarkupTag.P, 0, 3]),
                new Markup([MarkupTag.P, 4, 4]),
                new Markup([MarkupTag.P, 5, 8]),
                new Markup([MarkupTag.P, 9, 12])
            ]
        });

        state.envelopedBlockMarkups = state.markups.slice(1, 4);

        const newState = addInlineMarkup(state, MarkupTag.STRONG, 3, 12);

        assert.equal(newState.text, 'awd\n\nawd\nawd');

        assert.equal(newState.markups.length, 7);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 3]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 4, 4]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.STRONG, 4, 4]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.P, 5, 8]));
        assert.deepEqual(newState.markups[4], new Markup([MarkupTag.STRONG, 5, 8]));
        assert.deepEqual(newState.markups[5], new Markup([MarkupTag.P, 9, 12]));
        assert.deepEqual(newState.markups[6], new Markup([MarkupTag.STRONG, 9, 12]));
    });

    it('should merge like inline markups when adjacent', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 11])
            ]
        });

        const newState = addInlineMarkup(state, MarkupTag.STRONG, 11, 17);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 17]));
    });

    it('should insert an inline markup within another inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 17])
            ]
        });

        const newState = addInlineMarkup(state, MarkupTag.EM, 8, 11);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 17]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.EM, 8, 11]));
    });

    it('should insert a multiblock inline markup within an existing one', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9]),
                new Markup([MarkupTag.P, 10, 19]),
                new Markup([MarkupTag.STRONG, 10, 14])
            ]
        });

        state.envelopedBlockMarkups = [state.markups[0], state.markups[2]];

        const newState = addInlineMarkup(state, MarkupTag.EM, 8, 11);

        assert.equal(newState.text, 'Line one.\nLine two.');
        assert.equal(newState.markups.length, 6);

        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 9]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 5, 9]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.EM, 8, 9]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.P, 10, 19]));
        assert.deepEqual(newState.markups[4], new Markup([MarkupTag.STRONG, 10, 14]));
        assert.deepEqual(newState.markups[5], new Markup([MarkupTag.EM, 10, 11]));
    });

    it('should add an inline link with data', () => {
        const anchorData = {
            href: 'https://www.kunkalabs.com',
            target: '_blank'
        };

        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28])
            ]
        });

        const newState = addInlineMarkup(state, MarkupTag.A, 6, 11, anchorData);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.A, 6, 11, anchorData]));
    });
});