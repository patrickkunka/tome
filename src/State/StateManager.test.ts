import 'jsdom-global/register';

import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';
import * as sinon     from 'sinon';

import MockTome     from '../Mock/MockTome';
import ITome        from '../Tome/Interfaces/ITome';
import ActionType   from './Constants/ActionType';
import MarkupTag    from './Constants/MarkupTag';
import IValue       from './Interfaces/IValue';
import State        from './State';
import StateManager from './StateManager';

chai.use(deepEqual);

const {assert} = chai;
const {spy, stub} = sinon;

interface ITestContext {
    tome: ITome;
    stateManager: StateManager;
    initialValue: IValue;
    nextValue: IValue;
    mockInit();
    mockPushState(nextState?: State);
    mockUndo();
}

describe('StateManager', function() {
    // @ts-ignore
    const self: ITestContext = this;

    self.initialValue = {
        text: 'foo',
        markups: [
            [MarkupTag.P, 0, 3]
        ]
    };

    self.nextValue = {
        text: 'fooo',
        markups: [
            [MarkupTag.P, 0, 4]
        ]
    };

    self.mockInit = () => {
        self.stateManager.init(self.initialValue);
    };

    self.mockPushState = (nextState = new State(self.nextValue)) => {
        // @ts-ignore
        self.stateManager.pushStateToHistory(nextState);
    };

    beforeEach(() => {
        self.tome = new MockTome();
        self.stateManager = new StateManager(self.tome);
    });

    it('instantiates with no state or history', () => {
        assert.isNull(self.stateManager.state);
        assert.equal(self.stateManager.historyIndex, -1);
    });

    describe('#init()', () => {
        it('loads an initial state into the history', () => {
            self.stateManager.init(self.initialValue);

            assert.instanceOf(self.stateManager.state, State);
            assert.equal(self.stateManager.historyIndex, 0);
        });

        it('renders the tree and positions the caret', () => {
            self.stateManager.init(self.initialValue);

            assert.isTrue((self.tome.tree.render as any).calledWith(true));
            assert.isTrue((self.tome.tree.positionCaret as any).calledWith({
                from: 0, to: 0, direction: 'LTR'
            }));
        });
    });

    describe('#undo()', () => {
        it('removes an item from the history', () => {
            self.mockInit();

            const initialState = self.stateManager.state;
            const nextState = new State(self.nextValue);

            self.mockPushState(nextState);

            assert.equal(self.stateManager.state, nextState);
            assert.equal(self.stateManager.historyIndex, 1);

            self.stateManager.undo();

            assert.equal(self.stateManager.state, initialState);
            assert.equal(self.stateManager.historyIndex, 0);
        });

        it('invokes `raiseIsActioningFlag()`', () => {
            self.mockInit();
            self.mockPushState();
            self.stateManager.undo();

            assert.isTrue((self.tome.eventManager.raiseIsActioningFlag as sinon.SinonSpy).calledOnce);
        });

        it('renders the tree and positions the caret', () => {
            self.mockInit();
            self.mockPushState();
            self.stateManager.undo();

            assert.isTrue((self.tome.tree.render as sinon.SinonSpy).calledTwice);
            assert.isTrue((self.tome.tree.positionCaret as sinon.SinonSpy).calledTwice);
        });

        it('aborts if `historyIndex` is `0`', () => {
            self.mockInit();
            self.mockPushState();

            assert.equal(self.stateManager.historyIndex, 1);

            self.stateManager.undo();

            assert.equal(self.stateManager.historyIndex, 0);

            self.stateManager.undo();

            assert.equal(self.stateManager.historyIndex, 0);
        });

        it('invokes an `onStateChange` callback if provided', () => {
            const cb = self.tome.config.callbacks.onStateChange = spy();

            self.mockInit();
            self.mockPushState();
            self.stateManager.undo();

            assert.isTrue(cb.calledOnce);
            assert.isTrue(cb.calledWith(self.stateManager.state, ActionType.UNDO));
        });

        it('logs to the `console.info()` if `debug` mode enabled', () => {
            self.tome.config.debug.enable = true;

            const consoleInfoStub = stub(console, 'info');

            self.mockInit();
            self.mockPushState();
            self.stateManager.undo();

            assert.isTrue(consoleInfoStub.calledOnce);
            assert.isTrue(consoleInfoStub.calledWith('UNDO (0)'));

            consoleInfoStub.restore();
        });
    });

    describe('#redo()', () => {
        it('reverts to a future state after an undo', () => {
            self.mockInit();

            const nextState = new State(self.nextValue);

            self.mockPushState(nextState);
            self.stateManager.undo();

            assert.notEqual(self.stateManager.state, nextState);
            assert.equal(self.stateManager.historyIndex, 0);

            self.stateManager.redo();

            assert.equal(self.stateManager.state, nextState);
            assert.equal(self.stateManager.historyIndex, 1);
        });

        it('invokes `raiseIsActioningFlag()`', () => {
            self.mockInit();
            self.mockPushState();
            self.stateManager.undo();
            self.stateManager.redo();

            assert.isTrue((self.tome.eventManager.raiseIsActioningFlag as sinon.SinonSpy).calledTwice);
        });

        it('renders the tree and positions the caret', () => {
            self.mockInit();
            self.mockPushState();
            self.stateManager.undo();
            self.stateManager.redo();

            assert.isTrue((self.tome.tree.render as sinon.SinonSpy).calledThrice);
            assert.isTrue((self.tome.tree.positionCaret as sinon.SinonSpy).calledThrice);
        });

        it('aborts if there is no future state(s)', () => {
            self.mockInit();
            self.mockPushState();

            assert.equal(self.stateManager.historyIndex, 1);

            self.stateManager.redo();

            assert.equal(self.stateManager.historyIndex, 1);
        });

        it('invokes an `onStateChange` callback if provided', () => {
            const cb = self.tome.config.callbacks.onStateChange = spy();

            self.mockInit();
            self.mockPushState();
            self.stateManager.undo();

            assert.isTrue(cb.calledOnce);
            assert.isTrue(cb.calledWith(self.stateManager.state, ActionType.UNDO));

            self.stateManager.redo();

            assert.isTrue(cb.calledTwice);
            assert.isTrue(cb.calledWith(self.stateManager.state, ActionType.REDO));
        });

        it('logs to the `console.info()` if `debug` mode enabled', () => {
            self.tome.config.debug.enable = true;

            const consoleInfoStub = stub(console, 'info');

            self.mockInit();
            self.mockPushState();
            self.stateManager.undo();

            assert.isTrue(consoleInfoStub.calledOnce);

            self.stateManager.redo();

            assert.isTrue(consoleInfoStub.calledTwice);
            assert.isTrue(consoleInfoStub.calledWith('REDO (1)'));

            consoleInfoStub.restore();
        });
    });
});