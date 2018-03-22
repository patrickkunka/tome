import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import MarkupTag from './Constants/MarkupTag';
import IValue    from './Interfaces/IValue';
import Markup    from './Markup';
import State     from './State';

chai.use(deepEqual);

const {assert} = chai;

describe('State', () => {
    it('instantiates with default values if a raw state not passed', () => {
        const state = new State();

        assert.equal(state.text, '');
        assert.deepEqual(state.markups, []);
        assert.equal(state.selection.from, -1);
        assert.equal(state.selection.to, -1);
    });

    it('instantiates with the provided raw state values if passed', () => {
        const rawState: IValue = {
            text: 'foo',
            markups: [
                [MarkupTag.P, 0, 3],
                [MarkupTag.STRONG, 2, 3]
            ]
        };

        const state = new State(rawState);

        assert.equal(state.text, rawState.text);
        assert.equal(state.markups.length, 2);
        assert.instanceOf(state.markups[0], Markup);
        assert.deepEqual(state.markups[0], new Markup(rawState.markups[0]));
        assert.equal(state.selection.from, 0);
        assert.equal(state.selection.to, 0);
    });

    it('preserves any `Markup` instances passed via raw state', () => {
        const rawState: IValue = {
            text: 'foo',
            markups: [
                new Markup([MarkupTag.P, 0, 3]),
                new Markup([MarkupTag.STRONG, 2, 3])
            ]
        };

        const state = new State(rawState);

        assert.equal(state.markups.length, 2);
        assert.equal(state.markups[0], rawState.markups[0]);
        assert.equal(state.markups[1], rawState.markups[1]);
    });

    it('creates a wrapping paragraph markup if no markups are provided with a raw state', () => {
        const rawState: IValue = {
            text: 'foo'
        };

        const state = new State(rawState);

        assert.equal(state.markups.length, 1);
        assert.deepEqual(state.markups[0], new Markup([MarkupTag.P, 0, 3]));
    });

    describe('#length', () => {
        it('has a value equal to length of `text`', () => {
            const rawState: IValue = {
                text: 'foo'
            };

            const state = new State(rawState);

            assert.equal(state.length, 3);
        });
    });

    describe('#isTagActive()', () => {
        it('returns `true` is the provided tag is present in `activeInlineMarkups` map', () => {
            const rawState: IValue = {
                text: 'foo'
            };

            const state = new State(rawState);

            state.activeInlineMarkups.add(new Markup([MarkupTag.STRONG, 0, 3]));

            assert.isTrue(state.isTagActive(MarkupTag.STRONG));
        });
    });
});