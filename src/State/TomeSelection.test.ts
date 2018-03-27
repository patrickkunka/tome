import * as chai from 'chai';

import SelectionDirection from './Constants/SelectionDirection';
import TomeSelection      from './TomeSelection';

const {assert} = chai;

describe('TomeSelection', () => {
    it('instantiates with default values if parameters not passed', () => {
        const selection = new TomeSelection();

        assert.equal(selection.from, -1);
        assert.equal(selection.to, -1);
        assert.equal(selection.direction, SelectionDirection.LTR);
    });

    it('instantiates with the provided parameter values if passed', () => {
        const selection = new TomeSelection(321, 450, SelectionDirection.RTL);

        assert.equal(selection.from, 321);
        assert.equal(selection.to, 450);
        assert.isTrue(selection.isRtl);
    });

    describe('#isCollapsed', () => {
        it('returns `true` if the range does not span multiple characters', () => {
            const selection = new TomeSelection(0, 0);

            assert.isTrue(selection.isCollapsed);
        });
    });

    describe('#isUnselected', () => {
        it('returns `true` if the selection is unmapped', () => {
            const selection = new TomeSelection();

            assert.isTrue(selection.isUnselected);
        });

        it('returns `true` if the selection is partially mapped', () => {
            const selection = new TomeSelection();

            selection.from = 4;

            assert.isTrue(selection.isUnselected);
        });
    });

    describe('#anchor', () => {
        it('returns the `from` value if a left-to-right selection', () => {
            const selection = new TomeSelection(1, 2, SelectionDirection.LTR);

            assert.equal(selection.anchor, selection.from);
        });

        it('returns the `to` value if a right-to-left selection', () => {
            const selection = new TomeSelection(1, 2, SelectionDirection.RTL);

            assert.equal(selection.anchor, selection.to);
        });
    });

    describe('#extent', () => {
        it('returns the `to` value if a left-to-right selection', () => {
            const selection = new TomeSelection(1, 2, SelectionDirection.LTR);

            assert.equal(selection.extent, selection.to);
        });

        it('returns the `from` value if a right-to-left selection', () => {
            const selection = new TomeSelection(1, 2, SelectionDirection.RTL);

            assert.equal(selection.extent, selection.from);
        });
    });
});