import {assert} from 'chai';

import getPathFromDomNode from './getPathFromDomNode';

interface ITestContext {
    parentNode: HTMLDivElement;
}

describe('getPathFromDomNode()', function() {
    // @ts-ignore
    const self: ITestContext = this;

    beforeEach(() => {
        const parent = document.createElement('div');

        parent.innerHTML = `
            <div></div>
            <div>
                <div></div>
                <div id="bar"></div>
                <div>
                    <div></div>
                    <div id="foo"></div>
                </div>
                <div></div>
            </div>
        `;

        self.parentNode = parent;
    });

    it('it returns an empty path if the root and parent are equal', () => {
        const path = getPathFromDomNode(self.parentNode, self.parentNode);

        assert.deepEqual(path, []);
    });

    it('it returns a path array with length equal to the depth of the child node', () => {
        const childNode = self.parentNode.querySelector('#bar');
        const path = getPathFromDomNode(childNode, self.parentNode);

        assert.equal(path.length, 2);
    });

    it('it populates the path array with the child node\'s index at each depth, inclusive of whitespace nodes', () => {
        const childNode = self.parentNode.querySelector('#foo');
        const path = getPathFromDomNode(childNode, self.parentNode);

        assert.deepEqual(path, [3, 5, 3]);
    });
});