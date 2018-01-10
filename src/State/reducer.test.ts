import * as chai          from 'chai';
import * as deepEqual     from 'chai-shallow-deep-equal';
import Action             from './Action';
import ActionType         from './Constants/ActionType';
import MarkupTag          from './Constants/MarkupTag';
import Markup             from './Markup';
import reducer            from './reducer';
import State              from './State';

chai.use(deepEqual);

const assert = chai.assert;

describe('reducer', () => {
    it('should coerce consecutive line breaks into a block break from behind', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line o\nne.',
            markups: [
                new Markup([MarkupTag.P, 0, 10]),
                new Markup([MarkupTag.BR, 6, 6])
            ]
        });

        const nextState = reducer(prevState, Object.assign(new Action(), {
            type: ActionType.SHIFT_RETURN,
            range: {from: 7, to: 7}
        }));

        assert.equal(nextState.text, 'Line o\n\nne.');
        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[0], new Markup([MarkupTag.P, 0, 6]));
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.P, 8, 11]));
    });

    it('should coerce consecutive line breaks into a block break from in front', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line o\nne.',
            markups: [
                new Markup([MarkupTag.P, 0, 10]),
                new Markup([MarkupTag.BR, 6, 6])
            ]
        });

        const nextState = reducer(prevState, Object.assign(new Action(), {
            type: ActionType.SHIFT_RETURN,
            range: {from: 6, to: 6}
        }));

        assert.equal(nextState.text, 'Line o\n\nne.');
        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[0], new Markup([MarkupTag.P, 0, 6]));
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.P, 8, 11]));
    });

    it('should completely replace an existing state when using REPLACE_VALUE', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const nextState = reducer(prevState, Object.assign(new Action(), {
            type: ActionType.REPLACE_VALUE,
            data: {
                text: 'Lorem ipsum\ndolor sit.',
                markups: [
                    [MarkupTag.P, 0, 22],
                    [MarkupTag.BR, 11, 11]
                ]
            }
        }));

        assert.equal(nextState.text, 'Lorem ipsum\ndolor sit.');
        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[0], new Markup([MarkupTag.P, 0, 22]));
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.BR, 11, 11]));
        assert.equal(nextState.selection.from, 22);
    });
});
