import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';
import * as sinon     from 'sinon';

import Action                from './Action';
import ActionType            from './Constants/ActionType';
import {createBoundCreateStateFromAction} from './createStateFromAction';
import State                 from './State';

chai.use(deepEqual);

const {assert} = chai;
const {spy}    = sinon;

describe('createStateFromAction()', function() {
    const self: any = this;

    beforeEach(() => {
        self.backspace = spy();
        self.changeBlockType = spy();
        self.del = spy();
        self.editAnchor = spy();
        self.insert = spy();
        self.insertBlockBreak = spy();
        self.insertCustomBlock = spy();
        self.insertFromClipboard = spy();
        self.insertLineBreak = spy();
        self.moveCustomBlock = spy();
        self.removeCustomBlock = spy();
        self.replaceValue = spy();
        self.setSelection = spy();
        self.toggleInline = spy();

        self.createStateFromAction = createBoundCreateStateFromAction(
            self.backspace,
            self.changeBlockType,
            self.del,
            self.editAnchor,
            self.insert,
            self.insertBlockBreak,
            self.insertCustomBlock,
            self.insertFromClipboard,
            self.insertLineBreak,
            self.moveCustomBlock,
            self.removeCustomBlock,
            self.replaceValue,
            self.setSelection,
            self.toggleInline
        );

        self.testAction = (actionType, actionSpy) => {
            const prevState = new State();

            self.createStateFromAction(
                prevState,
                Object.assign(new Action(), {type: actionType})
            );

            assert.isTrue(actionSpy.called);
        };
    });

    it('should return the previous state if an unknown action type is passed', () => {
        const prevState = new State();

        const nextState = self.createStateFromAction(prevState, Object.assign(new Action(), {type: 'foo'}));

        assert.equal(prevState, nextState);
    });

    it('should return the previous state if a `COPY` action type is passed', () => {
        const prevState = new State();

        const nextState = self.createStateFromAction(prevState, Object.assign(new Action(), {type: ActionType.COPY}));

        assert.equal(prevState, nextState);
    });

    it('should return the previous state if a `SAVE` action type is passed', () => {
        const prevState = new State();

        const nextState = self.createStateFromAction(prevState, Object.assign(new Action(), {type: ActionType.SAVE}));

        assert.equal(prevState, nextState);
    });

    it('should invoke a `backspace` edit if a `BACKSPACE` action type is passed', () => {
        self.testAction(ActionType.BACKSPACE, self.backspace);
    });

    it('should invoke a `changeBlockType` edit if a `CHANGE_BLOCK_TYPE` action type is passed', () => {
        self.testAction(ActionType.CHANGE_BLOCK_TYPE, self.changeBlockType);
    });

    it('should invoke a `del` edit if a `DELETE` action type is passed', () => {
        self.testAction(ActionType.DELETE, self.del);
    });

    it('should invoke an `editAnchor` edit if an `EDIT_ANCHOR` action type is passed', () => {
        self.testAction(ActionType.EDIT_ANCHOR, self.editAnchor);
    });

    it('should invoke an `insert` edit if an `INSERT` action type is passed', () => {
        self.testAction(ActionType.INSERT, self.insert);
    });

    it('should invoke an `insert` edit if a `CUT` action type is passed', () => {
        self.testAction(ActionType.CUT, self.insert);
    });

    it('should invoke an `insert` edit if a `MUTATE` action type is passed', () => {
        self.testAction(ActionType.MUTATE, self.insert);
    });

    it('should invoke an `insertBlockBreak` edit if an `INSERT_BLOCK_BREAK` action type is passed', () => {
        self.testAction(ActionType.INSERT_BLOCK_BREAK, self.insertBlockBreak);
    });

    it('should invoke an `insertCustomBlock` edit if an `INSERT_CUSTOM_BLOCK` action type is passed', () => {
        self.testAction(ActionType.INSERT_CUSTOM_BLOCK, self.insertCustomBlock);
    });

    it('should invoke an `insertFromClipboard` edit if a `PASTE` action type is passed', () => {
        self.testAction(ActionType.PASTE, self.insertFromClipboard);
    });

    it('should invoke an `insertLineBreak` edit if an `INSERT_LINE_BREAK` action type is passed', () => {
        self.testAction(ActionType.INSERT_LINE_BREAK, self.insertLineBreak);
    });

    it('should invoke a `moveCustomBlock` edit if a `MOVE_CUSTOM_BLOCK` action type is passed', () => {
        self.testAction(ActionType.MOVE_CUSTOM_BLOCK, self.moveCustomBlock);
    });

    it('should invoke a `removeCustomBlock` edit if a `REMOVE_CUSTOM_BLOCK` action type is passed', () => {
        self.testAction(ActionType.REMOVE_CUSTOM_BLOCK, self.removeCustomBlock);
    });

    it('should invoke a `replaceValue` edit if a `REPLACE_VALUE` action type is passed', () => {
        self.testAction(ActionType.REPLACE_VALUE, self.replaceValue);
    });

    it('should invoke a `setSelection` edit if a `SET_SELECTION` action type is passed', () => {
        self.testAction(ActionType.SET_SELECTION, self.setSelection);
    });

    it('should invoke a `toggleInline` edit if a `TOGGLE_INLINE` action type is passed', () => {
        self.testAction(ActionType.TOGGLE_INLINE, self.toggleInline);
    });
});
