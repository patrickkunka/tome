import * as chai          from 'chai';
import * as deepEqual     from 'chai-shallow-deep-equal';
import ActionType         from './constants/ActionType';
import MarkupTag          from './constants/MarkupTag';
import Action             from './models/Action';
import Markup             from './models/Markup';
import State              from './models/State';
import reducer            from './reducer';

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

        const nextState = (reducer(prevState, Object.assign(new Action(), {
            type: ActionType.SHIFT_RETURN,
            range: {from: 7, to: 7}
        })) as State);

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

        const nextState = (reducer(prevState, Object.assign(new Action(), {
            type: ActionType.SHIFT_RETURN,
            range: {from: 6, to: 6}
        })) as State);

        assert.equal(nextState.text, 'Line o\n\nne.');
        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[0], new Markup([MarkupTag.P, 0, 6]));
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.P, 8, 11]));
    });
});
