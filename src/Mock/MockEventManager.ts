import * as sinon from 'sinon';

import IEventManager from '../Events/Interfaces/IEventManager';

const {spy} = sinon;

class MockEventManager implements IEventManager {
    public root = null;
    public bindEvents = spy();
    public unbindEvents = spy();
    public raiseIsActioningFlag = spy();
}

export default MockEventManager;