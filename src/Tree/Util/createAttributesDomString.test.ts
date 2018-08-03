import {assert} from 'chai';

import createAttributesDomString from './createAttributesDomString';
import RenderMode                from '../Constants/RenderMode';
import MarkupTag                 from '../../State/Constants/MarkupTag';

describe('createAttributesDomString()', () => {
    it('returns a space-seperated string representing the attribtues of an <a> element and in `CONSUMER` mode', () => {
        const attributes = createAttributesDomString(RenderMode.CONSUMER, MarkupTag.A, {
            href: 'bar',
            target: '_blank',
            title: 'bar'
        });

        assert.equal(attributes, ' href="bar" target="_blank" title="bar"');
    });

    it('it always renders and `href` attribute, but omits others if not provided', () => {
        const attributes = createAttributesDomString(RenderMode.CONSUMER, MarkupTag.A, {});

        assert.equal(attributes, ' href=""');
    });

    it('returns an unclickable <a> element and w `EDITOR` mode', () => {
        const attributes = createAttributesDomString(RenderMode.EDITOR, MarkupTag.A, {
            href: 'bar'
        });

        assert.equal(attributes, ' data-href="bar" href="javascript:void(0)"');
    });

    it('returns contenteditable="false" when provided with a <div> element', () => {
        const attributes = createAttributesDomString(RenderMode.EDITOR, MarkupTag.DIV, {});

        assert.equal(attributes, ' contenteditable="false"');
    });
});