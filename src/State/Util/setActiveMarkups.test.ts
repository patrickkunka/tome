import * as chai from 'chai';

import MarkupTag          from '../Constants/MarkupTag';
import SelectionDirection from '../Constants/SelectionDirection';
import Markup             from '../Markup';
import State              from '../State';
import TomeSelection      from '../TomeSelection';
import setActiveMarkups   from './setActiveMarkups';

const assert = chai.assert;

describe('setActiveMarkupts', () => {
    it('should detect an active inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9])
            ]
        });

        setActiveMarkups(
            state,
            Object.assign(new TomeSelection(), {from: 5, to: 9, direction: SelectionDirection.LTR})
        );

        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.STRONG).length, 1);
    });

    it('should detect an multiple active inline markups', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9]),
                new Markup([MarkupTag.EM, 5, 9])
            ]
        });

        setActiveMarkups(
            state,
            Object.assign(new TomeSelection(), {from: 5, to: 9, direction: SelectionDirection.LTR})
        );

        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.STRONG).length, 1);
        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.EM).length, 1);
    });

    it('should detect an active inline markup across multiple blocks', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9]),
                new Markup([MarkupTag.P, 10, 19]),
                new Markup([MarkupTag.STRONG, 10, 14])
            ]
        });

        setActiveMarkups(
            state,
            Object.assign(new TomeSelection(), {from: 5, to: 14, direction: SelectionDirection.LTR})
        );

        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.STRONG).length, 2);
    });

    it('should detect multiple active inline markups across multiple blocks', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9]),
                new Markup([MarkupTag.EM, 5, 9]),
                new Markup([MarkupTag.P, 10, 19]),
                new Markup([MarkupTag.STRONG, 10, 14]),
                new Markup([MarkupTag.EM, 10, 14])
            ]
        });

        setActiveMarkups(
            state,
            Object.assign(new TomeSelection(), {from: 5, to: 14, direction: SelectionDirection.LTR})
        );

        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.STRONG).length, 2);
        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.EM).length, 2);
    });

    it('should detect only the appropriate active inline markups even if multiple exist', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\nLine two.\nLine three.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 0, 9]),
                new Markup([MarkupTag.P, 10, 19]),
                new Markup([MarkupTag.STRONG, 10, 19]),
                new Markup([MarkupTag.P, 20, 31]),
                new Markup([MarkupTag.STRONG, 20, 31])
            ]
        });

        setActiveMarkups(
            state,
            Object.assign(new TomeSelection(), {from: 0, to: 14, direction: SelectionDirection.LTR})
        );

        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.STRONG).length, 2);
    });
});