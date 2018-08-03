import {assert} from 'chai';

import buildTreeFromValue from './buildTreeFromValue';
import MarkupTag from '../../State/Constants/MarkupTag';
import TomeNode from '../TomeNode';
import Markup from '../../State/Markup';

describe('buildTreeFromValue()', () => {
    it('returns a tree with a `TomeNode` as its root', () => {
        const tree = buildTreeFromValue({
            markups: [
                [MarkupTag.P, 0, 5]
            ],
            text: 'Lorem'
        });

        assert.instanceOf(tree, TomeNode);
        assert.equal(tree.childNodes[0].tag, MarkupTag.P);
        assert.equal(tree.childNodes[0].childNodes[0].tag, MarkupTag.TEXT);
        assert.equal(tree.childNodes[0].childNodes[0].text, 'Lorem');
    });

    it('coerces accepts plain arrays or `Markup` instances', () => {
        const tree = buildTreeFromValue({
            markups: [
                [MarkupTag.P, 0, 5],
                new Markup([MarkupTag.P, 7, 12])
            ],
            text: 'Lorem\n\nIpsum'
        });

        assert.instanceOf(tree, TomeNode);
        assert.equal(tree.childNodes[0].tag, MarkupTag.P);
        assert.equal(tree.childNodes[0].childNodes[0].tag, MarkupTag.TEXT);
        assert.equal(tree.childNodes[0].childNodes[0].text, 'Lorem');
        assert.equal(tree.childNodes[1].tag, MarkupTag.TEXT);
        assert.equal(tree.childNodes[1].text, '\n\n');
        assert.equal(tree.childNodes[2].tag, MarkupTag.P);
        assert.equal(tree.childNodes[2].childNodes[0].tag, MarkupTag.TEXT);
        assert.equal(tree.childNodes[2].childNodes[0].text, 'Ipsum');
    });
});
