import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import MarkupTag    from '../Constants/MarkupTag';
import Markup       from '../Markup';
import State        from '../State';
import setSelection from './setSelection';

chai.use(deepEqual);

const assert = chai.assert;

describe('setSelection()', () => {
    it('should remove inline markup overrides when the selection is changed', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        prevState.activeInlineMarkups.overrides.push(MarkupTag.STRONG);

        const nextState = setSelection(prevState, {from: 2, to: 2});

        assert.equal(nextState.activeInlineMarkups.overrides.length, 0);
    });
});