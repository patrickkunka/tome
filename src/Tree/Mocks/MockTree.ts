import * as sinon from 'sinon';

import ITree from '../Interfaces/ITree';

const {spy} = sinon;

class MockTree implements ITree {
    public root = null;
    public renderer = null;
    public render = spy();
    public positionCaret = spy();
    public mountCustomBlock = spy();
    public unmountCustomBlock = spy();
}

export default MockTree;