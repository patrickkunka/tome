import {assert} from 'chai';

import getNodeByPath from './getNodeByPath';

interface ITestContext {
    root: HTMLDivElement;
}

describe('getNodeByPath()', function() {
    // @ts-ignore
    const self: ITestContext = this;

    beforeEach(() => {
        const root = document.createElement('div');

        root.innerHTML = `
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

        self.root = root;
    });

    it('it returns a the root node if an empty path provided', () => {
        const node = getNodeByPath([], self.root);

        assert.equal(node, self.root);
    });

    it('it returns a nested node if a path provided, inclusive of whitespace nodes', () => {
        const node = getNodeByPath([3, 3], self.root);

        assert.equal(node.id, 'bar');
    });

    it('it returns a deeply nested node if a path provided, inclusive of whitespace nodes', () => {
        const node = getNodeByPath([3, 5, 3], self.root);

        assert.equal(node.id, 'foo');
    });

    it('it returns whitespace nodes', () => {
        const node = getNodeByPath([0], self.root);

        assert.equal(node.nodeType, node.TEXT_NODE);
    });

    it('it returns `null` for an unresolvable path', () => {
        const node = getNodeByPath([6, 3, 10], self.root);

        assert.isNull(node);
    });
});
