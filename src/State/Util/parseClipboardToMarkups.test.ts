import {assert} from 'chai';

import parseClipboardToMarkups from './parseClipboardToMarkups';
import Markup from '../Markup';
import MarkupTag from '../Constants/MarkupTag';

describe('parseClipboardToMarkups()', () => {
    it(
        'receives a plain text string from the clipboard and outputs a' +
        '`Markup` array based on the line and block breaks present',
        () => {
            const input = 'foo\nbar\n\nbaz';

            const output = [
                new Markup([MarkupTag.P, 0, 7]),
                new Markup([MarkupTag.BR, 3, 3]),
                new Markup([MarkupTag.P, 9, 12])
            ];

            assert.deepEqual(parseClipboardToMarkups(input), output);
        }
    );

    it('can handle a single line with no breaks', () => {
        const input = 'foo bar baz';

        const output = [
            new Markup([MarkupTag.P, 0, 11])
        ];

        assert.deepEqual(parseClipboardToMarkups(input), output);
    });

    it('can handle multiple block breaks', () => {
        const input = 'foo\n\nbar\n\nbaz';

        const output = [
            new Markup([MarkupTag.P, 0, 3]),
            new Markup([MarkupTag.P, 5, 8]),
            new Markup([MarkupTag.P, 10, 13])
        ];

        assert.deepEqual(parseClipboardToMarkups(input), output);
    });
});