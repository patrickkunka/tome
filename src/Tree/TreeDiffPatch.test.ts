import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import MarkupTag       from '../State/Constants/MarkupTag';
import TomeNode        from './TomeNode';
// import TreeDiffCommand from './TreeDiffCommand';
import TreeDiffPatch   from './TreeDiffPatch';

chai.use(deepEqual);

// const assert = chai.assert;

function createNode(initData = {}) {
    return Object.assign(new TomeNode(), initData);
}

// function createDiffCommand(initData = {}) {
//     return Object.assign(new TreeDiffCommand(), initData);
// }

describe('TreeDiffPatch', () => {
    describe('#diffChildren()', () => {
        it('test', () => {
            const prevChildren = [
                createNode({tag: MarkupTag.P, text: 'a'}),
                createNode({tag: MarkupTag.P, text: 'b'}),
                createNode({tag: MarkupTag.P, text: 'c'})
            ];

            const nextChildren = [
                createNode({tag: MarkupTag.P, text: 'a'}),
                createNode({tag: MarkupTag.P, text: 'b'}),
                createNode({tag: MarkupTag.P, text: 'z'}),
                createNode({tag: MarkupTag.P, text: 'c'})
            ];

            const commands = TreeDiffPatch.compareChildren(prevChildren, nextChildren);

            console.log(commands);
        });
    });
});