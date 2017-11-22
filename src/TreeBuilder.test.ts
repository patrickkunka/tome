import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import MarkupTag      from './constants/MarkupTag';
import Markup         from './models/Markup';
import TomeNode       from './models/TomeNode';
import TreeBuilder    from './TreeBuilder';

chai.use(deepEqual);

const assert = chai.assert;

describe('TreeBuilder', () => {
    it('should create a tree', () => {
        const text = 'Lorem ipsum dolor sit.';
        const markups = [
            new Markup([MarkupTag.P, 0, 22])
        ];

        const root = new TomeNode();

        TreeBuilder.build(root, text, markups);

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
            new Markup([MarkupTag.P, 0, 0])
        ];

        const root = new TomeNode();

        TreeBuilder.build(root, text, markups);

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
            new Markup([MarkupTag.P, 0, 18]),
            new Markup([MarkupTag.EM, 0, 18]),
            new Markup([MarkupTag.P, 19, 19]),
            new Markup([MarkupTag.EM, 19, 19]),
            new Markup([MarkupTag.P, 20, 29]),
            new Markup([MarkupTag.EM, 20, 29])
        ];

        const root = new TomeNode();

        TreeBuilder.build(root, text, markups);

        assert.equal(root.childNodes.length, 5);

        // <p><em>...</em></p>#text<p><em>#text</em></p>#text<p><em>...</em></p>

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

    it('should correctly split overlapping inline markups', () => {
        const text = 'Lorem ipsum dolor.';
        const markups = [
            new Markup([MarkupTag.P, 0, 18]),
            new Markup([MarkupTag.STRONG, 6, 11]),
            new Markup([MarkupTag.EM, 8, 14])
        ];

        // <p>Lorem <strong>ip<em>sum</em></strong><em> do</em>lor</p>

        const root = new TomeNode();

        TreeBuilder.build(root, text, markups);

        assert.equal(root.childNodes.length, 1);

        const pNode = root.childNodes[0];

        assert.equal(pNode.childNodes.length, 4);
        assert.equal(pNode.childNodes[0].text, 'Lorem ');
        assert.equal(pNode.childNodes[1].childNodes[0].text, 'ip');
        assert.equal(pNode.childNodes[1].childNodes[1].childNodes[0].text, 'sum');
        assert.equal(pNode.childNodes[2].tag, 'em');
        assert.equal(pNode.childNodes[2].childNodes.length, 1);
        assert.equal(pNode.childNodes[2].childNodes[0].text, ' do');
        assert.equal(pNode.childNodes[3].text, 'lor.');
    });

    it('should correctly wrap two consecutive blocks', () => {
        const text = 'Line one.\nLine two.';
        const markups = [
            new Markup([MarkupTag.P, 0, 9]),
            new Markup([MarkupTag.P, 10, 19])
        ];

        const root = new TomeNode();

        TreeBuilder.build(root, text, markups);

        assert.equal(root.childNodes.length, 3);

        const pNode1 = root.childNodes[0];

        assert.equal(pNode1.tag, MarkupTag.P);
        assert.equal(pNode1.childNodes.length, 1);
        assert.equal(pNode1.start, 0);
        assert.equal(pNode1.end, 9);

        const pText1 = pNode1.childNodes[0];

        assert.equal(pText1.start, 0);
        assert.equal(pText1.end, 9);
        assert.equal(pText1.text, 'Line one.');

        const breakNode = root.childNodes[1];

        assert.equal(breakNode.tag, MarkupTag.TEXT);
        assert.equal(breakNode.childNodes.length, 0);
        assert.equal(breakNode.text, MarkupTag.LINE_BREAK);
        assert.equal(breakNode.start, 9);
        assert.equal(breakNode.end, 10);

        const pNode2 = root.childNodes[2];

        assert.equal(pNode2.tag, MarkupTag.P);
        assert.equal(pNode2.childNodes.length, 1);
        assert.equal(pNode2.start, 10);
        assert.equal(pNode2.end, 19);

        const pText2 = pNode2.childNodes[0];

        assert.equal(pText2.start, 10);
        assert.equal(pText2.end, 19);
        assert.equal(pText2.text, 'Line two.');
    });

    it('should correctly map an inline markup spanning several blocks', () => {
        const text = 'Line one.\nLine two.\nLine three.';
        const markups = [
            new Markup([MarkupTag.P, 0, 9]),
            new Markup([MarkupTag.STRONG, 4, 9]),
            new Markup([MarkupTag.P, 10, 19]),
            new Markup([MarkupTag.STRONG, 10, 19]),
            new Markup([MarkupTag.P, 20, 31]),
            new Markup([MarkupTag.STRONG, 20, 24])
        ];

        // <p>Line <b>one.</b></p> <p><b>Line two.</b></p> <p><b>Line</b> three.</p>

        const root = new TomeNode();

        TreeBuilder.build(root, text, markups);

        assert.equal(root.childNodes.length, 5);

        const pNode1 = root.childNodes[0];
        const pNode2 = root.childNodes[2];
        const pNode3 = root.childNodes[4];

        assert.equal(pNode1.childNodes.length, 2);
        assert.equal(pNode2.childNodes.length, 1);
        assert.equal(pNode3.childNodes.length, 2);

        assert.equal(pNode2.childNodes[0].tag, MarkupTag.STRONG);
        assert.equal(pNode2.childNodes[0].childNodes[0].tag, MarkupTag.TEXT);
    });
});