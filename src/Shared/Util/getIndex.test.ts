import {assert} from 'chai';

import getIndex from './getIndex';

describe('getIndex()', () => {
    it('returns the index of a node within a `NodeList` relative to its siblings', () => {
        const temp = document.createElement('div');

        temp.innerHTML = '<span></span> <span></span> <span></span> <i></i> <span></span>';

        const node = temp.querySelector('i');

        assert.equal(getIndex(node), 3);
    });

    it('includes text nodes if instructed to', () => {
        const temp = document.createElement('div');

        temp.innerHTML = '<span></span> <span></span> <span></span> <i></i> <span></span>';

        const node = temp.querySelector('i');

        assert.equal(getIndex(node, true), 6);
    });
});
