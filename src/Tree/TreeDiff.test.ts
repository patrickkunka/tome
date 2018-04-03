import * as chai from 'chai';

import MarkupTag      from '../State/Constants/MarkupTag';
import NodeChangeType from './Constants/NodeChangeType';
import TomeNode       from './TomeNode';
import TreeDiff       from './TreeDiff';

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

interface ITestCase {
    prev: string[];
    next: string[];
    diffs: NodeChangeType[];
}

const testCases: ITestCase[] = [
    {
        prev: ['a', 'b', 'c', 'd'],
        next: ['a', 'b', 'c', 'd'],
        diffs: []
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
        diffs: [ADD, ADD, NONE, REMOVE, REMOVE]
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
    },
    {
        prev: ['a', 'b', 'c', 'd'],
        next: ['c', 'd'],
        diffs: [REMOVE, REMOVE, NONE, NONE]
    }
];

describe('TreeDiff', () => {
    describe('#diff()', () => {
        testCases.forEach(({prev, next, diffs}, i) => {
            it('should build up an accurate list of diff commands', () => {
                const prevNode = createNode({childNodes: prev.map(text => createNode({text, tag: MarkupTag.TEXT}))});
                const nextNode = createNode({childNodes: next.map(text => createNode({text, tag: MarkupTag.TEXT}))});
                const command = TreeDiff.diff(prevNode, nextNode);

                try {
                    assert.deepEqual(
                        command.childCommands.map(childCommand => childCommand.type),
                        diffs
                    );
                } catch (err) {
                    console.error(testCases[i]);

                    throw err;
                }
            });
        });

        it(
            'should return an `UPDATE_NODE` command for two equivalent custom ' +
            'blocks with different data',
            () => {
                const prevNode = createNode({
                    childNodes: [
                        createNode({
                            tag: 'foo',
                            data: {}
                        })
                    ]
                });

                const nextNode = createNode({
                    childNodes: [
                        createNode({
                            tag: 'foo',
                            data: {}
                        })
                    ]
                });

                const command = TreeDiff.diff(prevNode, nextNode);

                assert.deepEqual(
                    command.childCommands[0].type,
                    NodeChangeType.UPDATE_NODE
                );
            }
        );

        it(
            'should return an `UPDATE_TAG` command for two equivalent block nodes ' +
            'blocks with a different tag',
            () => {
                const prevNode = createNode({
                    childNodes: [
                        createNode({
                            tag: MarkupTag.H1
                        })
                    ]
                });

                const nextNode = createNode({
                    childNodes: [
                        createNode({
                            tag: MarkupTag.H2
                        })
                    ]
                });

                const command = TreeDiff.diff(prevNode, nextNode);

                assert.deepEqual(
                    command.childCommands[0].type,
                    NodeChangeType.UPDATE_TAG
                );
            }
        );

        it(
            'should return an `UPDATE_NODE` command for two equivalent block nodes ' +
            'blocks with a different tag and different children',
            () => {
                const prevNode = createNode({
                    childNodes: [
                        createNode({
                            tag: MarkupTag.H1
                        })
                    ]
                });

                const nextNode = createNode({
                    childNodes: [
                        createNode({
                            tag: MarkupTag.H2,
                            childNodes: [
                                createNode({
                                    tag: MarkupTag.TEXT,
                                    text: 'foo'
                                })
                            ]
                        })
                    ]
                });

                const command = TreeDiff.diff(prevNode, nextNode);

                assert.deepEqual(
                    command.childCommands[0].type,
                    NodeChangeType.UPDATE_NODE
                );
            }
        );
    });
});