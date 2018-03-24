import * as sinon from 'sinon';

import Config           from '../../Config/Root';
import MockEventManager from '../../Events/Mocks/MockEventManager';
import MockTree         from '../../Tree/Mocks/MockTree';
import ITome            from '../Interfaces/ITome';

const {spy} = sinon;

class MockTome implements ITome {
    public config = new Config();
    public dom = {root: null};
    public eventManager = new MockEventManager();
    public stateManager = null;
    public tree = new MockTree();

    public addInlineLink = spy();
    public redo = spy();
    public undo = spy();
    public getState = spy();
}

export default MockTome;