import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import MarkupTag       from '../State/Constants/MarkupTag';
import TreeChangeType  from './Constants/TreeChangeType';
import TomeNode        from './TomeNode';
import TreeDiffCommand from './TreeDiffCommand';
import TreeDiffPatch   from './TreeDiffPatch';

chai.use(deepEqual);

const assert = chai.assert;

function createNode(initData = {}) {
    return Object.assign(new TomeNode(), initData);
}

function createDiffCommand(initData = {}) {
    return Object.assign(new TreeDiffCommand(), initData);
}

describe('TreeDiffPatch', () => {
    describe('#diff()', () => {
        it('should recognise an unchanged node', () => {
            const prev = createNode();
            const next = createNode();
            const diffCommand = TreeDiffPatch.diff(prev, next);

            assert.deepEqual(diffCommand, createDiffCommand({type: TreeChangeType.NONE}));
        });

        it('should recognise a change of tag', () => {
            const prev = createNode({tag: MarkupTag.P});
            const next = createNode({tag: MarkupTag.H1});
            const diffCommand = TreeDiffPatch.diff(prev, next);

            assert.deepEqual(diffCommand, createDiffCommand({type: TreeChangeType.REPLACE}));
        });

        it('should recognise a change of text', () => {
            const prev = createNode({text: 'foo'});
            const next = createNode({text: 'bar'});
            const diffCommand = TreeDiffPatch.diff(prev, next);

            assert.deepEqual(diffCommand, createDiffCommand({type: TreeChangeType.UPDATE}));
        });
    });
});