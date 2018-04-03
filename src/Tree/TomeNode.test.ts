import * as chai from 'chai';

import MarkupTag  from '../State/Constants/MarkupTag';
import MarkupType from '../State/Constants/MarkupType';
import TomeNode   from './TomeNode';

chai.config.truncateThreshold = 0;

const assert = chai.assert;

describe('TomeNode', () => {
    it('exposes the `TomeNode` interface with reasonable defaults', () => {
        const node = new TomeNode();

        assert.deepEqual(node.childNodes, []);
        assert.equal(node.parent, null);
        assert.equal(node.start, -1);
        assert.equal(node.end, -1);
        assert.equal(node.tag, null);
        assert.equal(node.text, '');
        assert.deepEqual(node.path, []);
        assert.equal(node.data, null);
        assert.equal(node.index, -1);
    });

    it('exposes a `type` getter which returns a type based on the node\'s `tag`', () => {
        const node = new TomeNode();

        node.tag = MarkupTag.EM;

        assert.equal(node.type, MarkupType.INLINE);
    });

    it('exposes an `isBlock` getter which returns a boolean based on the node\'s `type`', () => {
        const node = new TomeNode();

        node.tag = MarkupTag.H1;

        assert.isTrue(node.isBlock);

        node.tag = MarkupTag.DIV;

        assert.isTrue(node.isBlock);
    });

    it('exposes an `isCustomBlock` getter which returns a boolean based on the node\'s `type`', () => {
        const node = new TomeNode();

        node.tag = MarkupTag.DIV;

        assert.isTrue(node.isCustomBlock);
    });

    it('exposes an `isListItem` getter which returns a boolean based on the node\'s `type`', () => {
        const node = new TomeNode();

        node.tag = MarkupTag.LI;

        assert.isTrue(node.isListItem);
    });

    it('exposes an `isInline` getter which returns a boolean based on the node\'s `type`', () => {
        const node = new TomeNode();

        node.tag = MarkupTag.BR;

        assert.isTrue(node.isInline);
    });

    it('exposes an `isText` getter which returns a boolean based on the node\'s `type`', () => {
        const node = new TomeNode();

        node.tag = MarkupTag.TEXT;

        assert.isTrue(node.isText);
    });

    it('exposes an `isSelfClosing` getter which returns `true` for nodes with a `<BR>` tag', () => {
        const node = new TomeNode();

        node.tag = MarkupTag.BR;

        assert.isTrue(node.isSelfClosing);
    });

    it('exposes a `length` getter which returns the delta of the node\'s start and end', () => {
        const node = new TomeNode();

        node.start = 12;
        node.end = 20;

        assert.equal(node.length, 8);
    });

    it('exposes a `lastChild` getter which returns the node\'s last child or `null`', () => {
        const node = new TomeNode();

        assert.equal(node.lastChild, null);

        node.childNodes = [new TomeNode(), new TomeNode()];

        assert.equal(node.lastChild, node.childNodes[1]);
    });
});