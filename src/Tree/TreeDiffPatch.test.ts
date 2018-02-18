import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import NodeChangeType   from './Constants/NodeChangeType';
import TomeNode         from './TomeNode';
import TreeDiffPatch    from './TreeDiffPatch';
import TreePatchCommand from './TreePatchCommand';

chai.use(deepEqual);

const assert = chai.assert;

const {
    NONE,
    ADD,
    REMOVE,
    UPDATE_TEXT
} = NodeChangeType;

function createNode(initData = {}) {
    return Object.assign(new TomeNode(), initData);
}

function createDiffCommand(initData = {}) {
    return Object.assign(new TreePatchCommand(), initData);
}

interface ITestCase {
    prev: string[];
    next: string[];
    diffs: NodeChangeType[];
}

const testCases: ITestCase[] = [
    {
        prev: ['a', 'b', 'c', 'd'],
        next: ['a', 'b', 'c', 'd'],
        diffs: [NONE, NONE, NONE, NONE]
    },
    {
        prev: ['a', 'b', 'c', 'd'],
        next: ['a', 'z', 'c', 'd'],
        diffs: [NONE, UPDATE_TEXT, NONE, NONE]
    },
    {
        prev: ['a', 'b', 'c', 'd'],
        next: ['a', 'b', 'z', 'c', 'd'],
        diffs: [NONE, NONE, ADD, NONE, NONE]
    },
    {
        prev: ['a', 'b', 'c', 'd'],
        next: ['a', 'c', 'd'],
        diffs: [NONE, REMOVE, NONE, NONE]
    },
    {
        prev: ['a', 'b', 'c', 'd'],
        next: ['x', 'a', 'b', 'c', 'd', 'y'],
        diffs: [ADD, NONE, NONE, NONE, NONE, ADD]
    },
    {
        prev: ['a', 'b', 'c'],
        next: ['c', 'b', 'a'],
        diffs: [UPDATE_TEXT, NONE, UPDATE_TEXT]
    },
    {
        prev: ['a', 'b', 'c', 'd'],
        next: [],
        diffs: [REMOVE, REMOVE, REMOVE, REMOVE]
    },
    {
        prev: [],
        next: ['a', 'b', 'c', 'd'],
        diffs: [ADD, ADD, ADD, ADD]
    },
    {
        prev: ['a', 'b', 'c', 'd'],
        next: ['b', 'c', 'd', 'e'],
        diffs: [REMOVE, NONE, NONE, NONE, ADD]
    },
    {
        prev: ['a', 'b', 'c', 'd'],
        next: ['e', 'f', 'g', 'h'],
        diffs: [UPDATE_TEXT, UPDATE_TEXT, UPDATE_TEXT, UPDATE_TEXT]
    },
    {
        prev: ['a', 'b', 'c', 'd'],
        next: ['x', 'y', 'a', 'b', 'c', 'd'],
        diffs: [ADD, ADD, NONE, NONE, NONE, NONE]
    }
];

describe('TreeDiffPatch', () => {
    describe('#diffChildren()', () => {
        it('should build up an accurate list of diff commands', () => {
            testCases.forEach(({prev, next, diffs}, i) => {
                const prevChildren = prev.map(text => createNode({text}));
                const nextChildren = next.map(text => createNode({text}));
                const expectedDiffs = diffs.map(type => createDiffCommand({type}));

                const commands = TreeDiffPatch.diffChildren(prevChildren, nextChildren);

                try {
                    assert.deepEqual(commands, expectedDiffs);
                } catch (err) {
                    console.error(testCases[i]);

                    throw err;
                }
            });
        });
    });
});