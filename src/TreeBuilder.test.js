/* eslint-disable no-magic-numbers */

import chai         from 'chai';
import deepEqual    from 'chai-shallow-deep-equal';
import TreeBuilder  from './TreeBuilder';
import Node         from './models/Node';

chai.use(deepEqual);

const assert = chai.assert;

describe('TreeBuilder', () => {
    it('should create a tree', () => {
        const text = 'Lorem ipsum dolor sit.';
        const markups = [
            ['p', 0, 22]
        ];

        const root = new Node();

        TreeBuilder.buildTreeFromRoot(root, text, markups);

        assert.equal(root.childNodes.length, 1);
        assert.equal(root.childNodes[0].tag, 'p');
        assert.equal(root.childNodes[0].start, 0);
        assert.equal(root.childNodes[0].end, 22);
        assert.equal(root.childNodes[0].childNodes.length, 1);
        assert.equal(root.childNodes[0].childNodes[0].tag, '#text');
        assert.equal(root.childNodes[0].childNodes[0].start, 0);
        assert.equal(root.childNodes[0].childNodes[0].end, 22);
        assert.equal(root.childNodes[0].childNodes[0].text, 'Lorem ipsum dolor sit.');
    });

    it('should create a tree with an empty block', () => {
        const text = '';
        const markups = [
            ['p', 0, 0]
        ];

        const root = new Node();

        TreeBuilder.buildTreeFromRoot(root, text, markups);

        assert.equal(root.childNodes.length, 1);
        assert.equal(root.childNodes[0].tag, 'p');
        assert.equal(root.childNodes[0].start, 0);
        assert.equal(root.childNodes[0].end, 0);
        assert.equal(root.childNodes[0].childNodes.length, 1);
        assert.equal(root.childNodes[0].childNodes[0].tag, '#text');
        assert.equal(root.childNodes[0].childNodes[0].start, 0);
        assert.equal(root.childNodes[0].childNodes[0].end, 0);
    });

    it('should allow inline markups to be applied to an empty block', () => {
        const text = 'Lorem ipsum dolor.\n\nSit amet.';
        const markups = [
            ['p', 0, 18],
            ['em', 0, 18],
            ['p', 19, 19],
            ['em', 19, 19],
            ['p', 20, 29],
            ['em', 20, 29]
        ];

        const root = new Node();

        TreeBuilder.buildTreeFromRoot(root, text, markups);

        assert.equal(root.childNodes.length, 5);

        for (let i = 0, pNode; (pNode = root.childNodes[i]); i++) {
            if (pNode.tag === '#text') {
                assert.isOk(i % 2);
                assert.equal(pNode.childNodes.length, 0);

                continue;
            }

            assert.isNotOk(i % 2);

            assert.equal(pNode.childNodes.length, 1);
            assert.equal(pNode.tag, 'p');

            const emNode = pNode.childNodes[0];

            assert.equal(emNode.tag, 'em');
            assert.equal(emNode.start, pNode.start);
            assert.equal(emNode.end, pNode.end);

            assert.equal(emNode.childNodes.length, 1);

            const leafNode = emNode.childNodes[0];

            assert.equal(leafNode.tag, '#text');
            assert.equal(leafNode.start, emNode.start);
            assert.equal(leafNode.end, emNode.end);
        }
    });
});