import * as sinon from 'sinon';

import Config           from '../Config/Root';
import ITome            from '../Tome/Interfaces/ITome';
import MockEventManager from './MockEventManager';
import MockTree         from './MockTree';

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