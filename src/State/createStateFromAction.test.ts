import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import Action                from './Action';
import createStateFromAction from './createStateFromAction';
import State                 from './State';

chai.use(deepEqual);

const assert = chai.assert;

describe('createStateFromAction()', () => {
    it('should return the previous state if an unknown action type is passed', () => {
        const prevState = new State();

        const nextState = createStateFromAction(prevState, Object.assign(new Action(), {type: 'foo'}));

        assert.equal(prevState, nextState);
    });
});
