import * as chai from 'chai';

import HtmlEntity         from '../Constants/HtmlEntity';
import MarkupTag          from '../Constants/MarkupTag';
import SelectionDirection from '../Constants/SelectionDirection';
import Markup             from '../Markup';
import State              from '../State';
import TomeSelection      from '../TomeSelection';
import setActiveMarkups   from '../Util/setActiveMarkups';
import insert             from './insert';

const assert = chai.assert;

describe('insert', () => {
    it('should insert a single character within a markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum',
            markups: [
                new Markup([MarkupTag.P, 0, 11])
            ]
        });

        const newState = insert(state, {from: 5, to: 5}, 's');

        assert.equal(newState.text, 'Lorems ipsum');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 12]));
    });

    it('should insert multiple characters within a markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum.',
            markups: [
                new Markup([MarkupTag.P, 0, 12])
            ]
        });

        const newState = insert(state, {from: 11, to: 11}, ' dolor');

        assert.equal(newState.text, 'Lorem ipsum dolor.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 18]));
    });

    it('should extend an inline markup if characters are inserted at its end', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 27]),
                new Markup([MarkupTag.EM, 6, 17])
            ]
        });

        const newState = insert(state, {from: 17, to: 17}, 's');

        assert.equal(newState.text, 'Lorem ipsum dolors sit amet.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 28]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.EM, 6, 18]));
    });

    it('should extend a block markup if characters are inserted at its end', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum.',
            markups: [
                new Markup([MarkupTag.P, 0, 12])
            ]
        });

        const newState = insert(state, {from: 12, to: 12}, ' Sit');

        assert.equal(newState.text, 'Lorem ipsum. Sit');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 16]));
    });

    it('should extend a block markup if characters are inserted at its start', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum.',
            markups: [
                new Markup([MarkupTag.P, 0, 12])
            ]
        });

        const newState = insert(state, {from: 0, to: 0}, 'Foo ');

        assert.equal(newState.text, 'Foo Lorem ipsum.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 16]));
    });

    it('should shunt an inline markup at the start if characters are inserted at its start', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum.',
            markups: [
                new Markup([MarkupTag.P, 0, 12]),
                new Markup([MarkupTag.STRONG, 0, 5])
            ]
        });

        const newState = insert(state, {from: 0, to: 0}, 'Foo ');

        assert.equal(newState.text, 'Foo Lorem ipsum.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 16]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 4, 9]));
    });

    it('should shunt an inline markup if characters are replaced at its start', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum.',
            markups: [
                new Markup([MarkupTag.P, 0, 12]),
                new Markup([MarkupTag.STRONG, 6, 11])
            ]
        });

        const newState = insert(state, {from: 3, to: 6}, 'f');

        assert.equal(newState.text, 'Lorfipsum.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 10]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 4, 9]));
    });

    it('should increment the position of subsequent markups as are characters are inserted', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 12]),
                new Markup([MarkupTag.P, 13, 22])
            ]
        });

        const newState = insert(state, {from: 11, to: 11}, ' dolor');

        assert.equal(newState.text, 'Lorem ipsum dolor. Sit amet.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 18]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 19, 28]));
    });

    it('should maintain markups that exist before the position that characters are inserted', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 12]),
                new Markup([MarkupTag.P, 13, 22])
            ]
        });

        const newState = insert(state, {from: 21, to: 21}, ', consectetur');

        assert.equal(newState.text, 'Lorem ipsum. Sit amet, consectetur.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 12]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 13, 35]));
    });

    it('should replace a range of characters with inserted characters', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum.',
            markups: [
                new Markup([MarkupTag.P, 0, 12])
            ]
        });

        const newState = insert(state, {from: 6, to: 11}, 'dolor');

        assert.equal(newState.text, 'Lorem dolor.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 12]));
    });

    it('should completely remove any markups which are enveloped by the range', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum.',
            markups: [
                new Markup([MarkupTag.P, 0, 12]),
                new Markup([MarkupTag.STRONG, 6, 11])
            ]
        });

        const newState = insert(state, {from: 5, to: 12}, 'dolor.');

        assert.equal(newState.text, 'Loremdolor.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 11]));
        assert.equal(newState.markups.length, 1);
    });

    it('should completely remove inline any markups which are equal to the range', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.STRONG, 6, 11])
            ]
        });

        const newState = insert(state, {from: 5, to: 11}, '');

        assert.equal(newState.text, 'Lorem dolor.');
        assert.equal(newState.markups.length, 1);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 12]));
    });

    it('should preserve block markups which are equal to the range', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.',
            markups: [
                new Markup([MarkupTag.P, 0, 18])
            ]
        });

        const newState = insert(state, {from: 0, to: 18}, '');

        assert.equal(newState.text, '');
        assert.equal(newState.markups.length, 1);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 0]));
    });

    it('should maintain inline markups which are partially enveloped by the range from the start', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum.',
            markups: [
                new Markup([MarkupTag.P, 0, 12]),
                new Markup([MarkupTag.STRONG, 6, 11])
            ]
        });

        const newState = insert(state, {from: 3, to: 8}, 'foo');

        assert.equal(newState.text, 'Lorfoosum.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 10]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 9]));
    });

    it('should expand inline markups which are partially enveloped by the range from the end', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum.',
            markups: [
                new Markup([MarkupTag.P, 0, 12]),
                new Markup([MarkupTag.STRONG, 0, 5])
            ]
        });

        const newState = insert(state, {from: 3, to: 8}, 'foo');

        assert.equal(newState.text, 'Lorfoosum.');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 10]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 0, 6]));
    });

    it('should expand inline markups which are partially enveloped by the range from the end', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.STRONG, 6, 11])
            ]
        });

        const newState = insert(state, {from: 8, to: 14}, 'foo');

        assert.equal(newState.text, 'Lorem ipfoolor.');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 15]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 11]));
    });

    it('should combine two block markups which are each partially enveloped', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 28])
            ]
        });

        const newState = insert(state, {from: 11, to: 22}, '');

        assert.equal(newState.text, 'Lorem ipsum amet.');
        assert.equal(newState.markups.length, 1);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 17]));
    });

    it('should combine two block markups containing inline markups which are each partially enveloped', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.EM, 6, 11]),
                new Markup([MarkupTag.P, 19, 28])
            ]
        });

        const newState = insert(state, {from: 11, to: 22}, '');

        assert.equal(newState.text, 'Lorem ipsum amet.');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 17]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.EM, 6, 11]));
    });

    it('should split a block markup into two block markups at an arbitrary point', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28])
            ]
        });

        const newState = insert(state, {from: 3, to: 3}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Lor\n\nem ipsum dolor. Sit amet.');
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 3]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 5, 30]));

        assert.equal(newState.selection.from, 5);
    });

    it('should ingest a block break if inserted over', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 20])
            ]
        });

        const newState = insert(state, {from: 9, to: 11}, 'a');

        assert.equal(newState.text, 'Line one.aLine two.');
        assert.deepEqual(newState.markups.length, 1);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 19]));

        assert.equal(newState.selection.from, 10);
    });

    it('should ingest a block break if enveloped', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 20])
            ]
        });

        const newState = insert(state, {from: 1, to: 11}, 'a');

        assert.equal(newState.text, 'LaLine two.');
        assert.deepEqual(newState.markups.length, 1);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 11]));

        assert.equal(newState.selection.from, 2);
    });

    // Reinstate once whitespace trim option is reinstated

    // it('should split a block markup into two block markups at a whitespace,
    // removing whitespace before the break', () => {
    //     const state = Object.assign(new State(), {
    //         text: 'Lorem ipsum dolor. Sit amet.',
    //         markups: [
    //             new Markup([MarkupTag.P, 0, 28])
    //         ]
    //     });

    //     const newState = insert(state, {from: 19, to: 19}, '\n');

    //     assert.equal(newState.text, 'Lorem ipsum dolor.\nSit amet.');
    //     assert.equal(newState.text.length, 28);
    //     assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 18]));
    //     assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 19, 28]));
    //     assert.equal(newState.selection.from, 19);
    // });

    // it('should split a block markup into two block markups at a whitespace,
    // removing whitespace after the break', () => {
    //     const state = Object.assign(new State(), {
    //         text: 'Lorem ipsum dolor. Sit amet.',
    //         markups: [
    //             new Markup([MarkupTag.P, 0, 28])
    //         ]
    //     });

    //     const newState = insert(state, {from: 18, to: 18}, '\n');

    //     assert.equal(newState.text, 'Lorem ipsum dolor.\nSit amet.');
    //     assert.equal(newState.text.length, 28);
    //     assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 18]));
    //     assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 19, 28]));
    //     assert.equal(newState.selection.from, 19);
    // });

    it('should split a subsequent block markup into two block markups at an arbitrary point', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.\n\nTest Heading',
            markups: [
                new Markup([MarkupTag.P, 0, 28]),
                new Markup([MarkupTag.H2, 30, 42])
            ]
        });

        const newState = insert(state, {from: 35, to: 35}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Lorem ipsum dolor. Sit amet.\n\nTest \n\nHeading');
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.H2, 37, 44]));
        assert.equal(newState.selection.from, 37);
    });

    it('should create a new empty block markup when a block is split at its end', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.STRONG, 6, 11]),
                new Markup([MarkupTag.EM, 8, 14])
            ]
        });

        const newState = insert(state, {from: 18, to: 18}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Lorem ipsum dolor.\n\n');
        assert.equal(newState.markups.length, 4);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 18]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 11]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.EM, 8, 14]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.P, 20, 20]));
    });

    it('should split a block markup and maintain incremental order of existing inline markups', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.STRONG, 6, 11]),
                new Markup([MarkupTag.EM, 8, 14])
            ]
        });

        const newState = insert(state, {from: 6, to: 6}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Lorem \n\nipsum dolor.');
        assert.equal(newState.markups.length, 4);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 6]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 8, 20]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.STRONG, 8, 13]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.EM, 10, 16]));
    });

    it('should split a block markup and any affected inline markups', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.STRONG, 6, 11])
            ]
        });

        const newState = insert(state, {from: 8, to: 8}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Lorem ip\n\nsum dolor.');
        assert.equal(newState.markups.length, 4);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 8]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 8]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.P, 10, 20]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.STRONG, 10, 13]));
    });

    it('should remove inline markups when split over', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.STRONG, 6, 11])
            ]
        });

        const newState = insert(state, {from: 6, to: 11}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Lorem \n\n dolor.');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 6]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 8, 15]));
    });

    it('should split a block markup and any affected inline markups when broken on a trailing space', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.STRONG, 4, 11])
            ]
        });

        const newState = insert(state, {from: 6, to: 6}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Lorem \n\nipsum dolor.');
        assert.equal(newState.markups.length, 4);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 6]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 4, 6]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.P, 8, 20]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.STRONG, 8, 13]));
    });

    it('should insert a line break', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const newState = insert(state, {from: 6, to: 6}, HtmlEntity.LINE_BREAK);

        assert.equal(newState.text, 'Line o\nne.');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.BR, 6, 6]));
    });

    it('should insert a line break at the start of a block', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const newState = insert(state, {from: 0, to: 0}, HtmlEntity.LINE_BREAK);

        assert.equal(newState.text, '\nLine one.');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.BR, 0, 0]));
    });

    it('should insert a line break at the start of a block', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const newState = insert(state, {from: 9, to: 9}, HtmlEntity.LINE_BREAK);

        assert.equal(newState.text, 'Line one.\n');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.BR, 9, 9]));
    });

    it('should insert characters immediately after a line break', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\n',
            markups: [
                new Markup([MarkupTag.P, 0, 10]),
                new Markup([MarkupTag.BR, 9, 9])
            ]
        });

        const newState = insert(state, {from: 10, to: 10}, 'a');

        assert.equal(newState.text, 'Line one.\na');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 11]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.BR, 9, 9]));
    });

    it('should insert characters immediately before a line break', () => {
        const state = Object.assign(new State(), {
            text: '\nLine one.',
            markups: [
                new Markup([MarkupTag.P, 0, 10]),
                new Markup([MarkupTag.BR, 0, 0])
            ]
        });

        const newState = insert(state, {from: 0, to: 0}, 'a');

        assert.equal(newState.text, 'a\nLine one.');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 11]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.BR, 1, 1]));
    });

    it('should delete characters immediately before a line break', () => {
        const state = Object.assign(new State(), {
            text: 'awd\nLine one.',
            markups: [
                new Markup([MarkupTag.P, 0, 13]),
                new Markup([MarkupTag.BR, 3, 3])
            ]
        });

        const newState = insert(state, {from: 2, to: 3}, '');

        assert.equal(newState.text, 'aw\nLine one.');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 12]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.BR, 2, 2]));
    });

    it('should join two block markups into one block markups on deletion of line break', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.\nSit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 28])
            ]
        });

        const newState = insert(state, {from: 18, to: 19}, '');

        assert.equal(newState.text, 'Lorem ipsum dolor.Sit amet.');
        assert.equal(newState.markups.length, 1);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 27]));
    });

    it('should insert a block break without affecting the position of inline markups', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28]),
                new Markup([MarkupTag.STRONG, 6, 11]),
                new Markup([MarkupTag.EM, 8, 14])
            ]
        });

        const newState = insert(state, {from: 19, to: 19}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Lorem ipsum dolor. \n\nSit amet.');
        assert.equal(newState.markups.length, 4);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 19]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 11]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.EM, 8, 14]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.P, 21, 30]));
    });

    it('should remove an empty line between two blocks', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.\n\nSit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 19]),
                new Markup([MarkupTag.P, 20, 29])
            ]
        });

        const newState = insert(state, {from: 18, to: 19}, '');

        assert.equal(newState.text, 'Lorem ipsum dolor.\nSit amet.');
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 18]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 19, 28]));
    });

    it('should remove a range enveloping multiple blocks including empty lines', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.\n\nSit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 19]),
                new Markup([MarkupTag.P, 20, 29])
            ]
        });

        const newState = insert(state, {from: 12, to: 24}, '');

        assert.equal(newState.text, 'Lorem ipsum amet.');
        assert.equal(newState.markups.length, 1);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 17]));
    });

    it('should remove all blocks in a selection', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.\n\nSit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 19]),
                new Markup([MarkupTag.P, 20, 29])
            ]
        });

        const newState = insert(state, {from: 0, to: 29}, '');

        assert.equal(newState.text, '');
        assert.equal(newState.markups.length, 1);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 0]));
    });

    it('should create an empty paragraph between two block breaks when breaking at the end of first block', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 20])
            ]
        });

        const newState = insert(state, {from: 9, to: 9}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Line one.\n\n\n\nLine two.');
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 9]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 11, 11]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.P, 13, 22]));

        assert.deepEqual(newState.selection, Object.assign(new TomeSelection(), {
            direction: SelectionDirection.LTR,
            from: 11,
            to: 11
        }));
    });

    it('should create an empty paragraph between two block breaks when breaking at the start of second block', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 20])
            ]
        });

        const newState = insert(state, {from: 11, to: 11}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Line one.\n\n\n\nLine two.');
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 9]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 11, 11]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.P, 13, 22]));
    });

    it('should respect inline markup overrides when inserting character(s)', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        prevState.activeInlineMarkups.overrides.push(MarkupTag.EM);

        const nextState = insert(prevState, {from: 9, to: 9}, 't');

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.EM, 9, 10])
        ]);

        assert.equal(nextState.activeInlineMarkups.overrides.length, 0);
    });

    it('should respect inline markup overrides when inserting character(s) within an existing inline markup', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.EM, 7, 9])
            ],
            selection: new TomeSelection(9, 9)
        });

        setActiveMarkups(prevState, prevState.selection);

        prevState.activeInlineMarkups.overrides.push(MarkupTag.EM);

        const nextState = insert(prevState, {from: 9, to: 9}, 't');

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.EM, 7, 9])
        ]);

        assert.equal(nextState.activeInlineMarkups.overrides.length, 0);
    });

    it('should preserve inline markup overrides when inserting a line-break', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        prevState.activeInlineMarkups.overrides.push(MarkupTag.STRONG);

        const nextState = insert(prevState, {from: 9, to: 9}, HtmlEntity.LINE_BREAK);

        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.BR, 9, 9])
        ]);

        assert.equal(nextState.activeInlineMarkups.overrides.length, 1);
        assert.equal(nextState.activeInlineMarkups.overrides[0], MarkupTag.STRONG);
    });

    it('should preserve inline markup overrides when inserting a block-break', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        prevState.activeInlineMarkups.overrides.push(MarkupTag.STRONG);

        const nextState = insert(prevState, {from: 9, to: 9}, HtmlEntity.BLOCK_BREAK);

        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 9]),
            new Markup([MarkupTag.P, 11, 11])
        ]);

        assert.equal(nextState.activeInlineMarkups.overrides.length, 1);
        assert.equal(nextState.activeInlineMarkups.overrides[0], MarkupTag.STRONG);
    });

    it('should insert characters into an empty list item', () => {
        const prevState = Object.assign(new State(), {
            text: '',
            markups: [
                new Markup([MarkupTag.UL, 0, 0]),
                new Markup([MarkupTag.LI, 0, 0])
            ]
        });

        const nextState = insert(prevState, {from: 0, to: 0}, 'foo');
        const {markups} = nextState;

        assert.equal(markups.length, 2);

        const wrappingList = markups[0];
        const listItem = markups[1];

        assert.equal(wrappingList.tag, MarkupTag.UL);
        assert.equal(wrappingList.start, 0);
        assert.equal(wrappingList.end, 3);

        assert.equal(listItem.tag, MarkupTag.LI);
        assert.equal(listItem.start, 0);
        assert.equal(listItem.end, 3);
    });

    it('should split a list item and extend the wrapping list', () => {
        const prevState = Object.assign(new State(), {
            text: 'List item 1.\n\nList item 2.\n\nList item 3.',
            markups: [
                new Markup([MarkupTag.UL, 0, 40]),
                new Markup([MarkupTag.LI, 0, 12]),
                new Markup([MarkupTag.LI, 14, 26]),
                new Markup([MarkupTag.LI, 28, 40])
            ]
        });

        const nextState = insert(prevState, {from: 33, to: 33}, HtmlEntity.BLOCK_BREAK);

        const {markups} = nextState;

        assert.equal(markups.length, 5);

        const originalListItem = markups[3];
        const newListItem = markups[4];
        const wrappingList = markups[0];

        assert.equal(originalListItem.tag, MarkupTag.LI);
        assert.equal(originalListItem.start, 28);
        assert.equal(originalListItem.end, 33);

        assert.equal(newListItem.tag, MarkupTag.LI);
        assert.equal(newListItem.start, 35);
        assert.equal(newListItem.end, 42);

        assert.equal(wrappingList.tag, MarkupTag.UL);
        assert.equal(wrappingList.start, 0);
        assert.equal(wrappingList.end, 42);
    });

    it('should create an empty list item when a block break is inserted at the end of a list item', () => {
        const prevState = Object.assign(new State(), {
            text: 'List item 1.\n\nList item 2.\n\nList item 3.',
            markups: [
                new Markup([MarkupTag.UL, 0, 40]),
                new Markup([MarkupTag.LI, 0, 12]),
                new Markup([MarkupTag.LI, 14, 26]),
                new Markup([MarkupTag.LI, 28, 40])
            ]
        });

        const nextState = insert(prevState, {from: 26, to: 26}, HtmlEntity.BLOCK_BREAK);
        const {markups} = nextState;

        assert.equal(markups.length, 5);

        const newListItem = markups[3];
        const nextListItem = markups[4];
        const wrappingList = markups[0];

        assert.equal(wrappingList.tag, MarkupTag.UL);
        assert.equal(wrappingList.start, 0);
        assert.equal(wrappingList.end, 42);

        assert.equal(newListItem.tag, MarkupTag.LI);
        assert.equal(newListItem.start, 28);
        assert.equal(newListItem.end, 28);

        assert.equal(nextListItem.tag, MarkupTag.LI);
        assert.equal(nextListItem.start, 30);
        assert.equal(nextListItem.end, 42);
    });

    it('should delete characters in a list and contract the wrapping list accordingly', () => {
        const prevState = Object.assign(new State(), {
            text: 'a',
            markups: [
                new Markup([MarkupTag.UL, 0, 1]),
                new Markup([MarkupTag.LI, 0, 1])
            ]
        });

        const nextState = insert(prevState, {from: 0, to: 1}, '');
        const {markups} = nextState;

        assert.equal(markups.length, 2);

        const wrappingList = markups[0];
        const listItem = markups[1];

        assert.equal(wrappingList.tag, MarkupTag.UL);
        assert.equal(wrappingList.start, 0);
        assert.equal(wrappingList.end, 0);

        assert.equal(listItem.tag, MarkupTag.LI);
        assert.equal(listItem.start, 0);
        assert.equal(listItem.end, 0);
    });

    it('should remove a list item when backspacing from its start', () => {
        const prevState = Object.assign(new State(), {
            text: 'List item 1.\n\n',
            markups: [
                new Markup([MarkupTag.UL, 0, 14]),
                new Markup([MarkupTag.LI, 0, 12]),
                new Markup([MarkupTag.LI, 14, 14])
            ]
        });

        const nextState = insert(prevState, {from: 12, to: 14}, '');
        const {markups} = nextState;

        assert.equal(markups.length, 2);

        const wrappingList = markups[0];
        const listItem = markups[1];

        assert.equal(wrappingList.tag, MarkupTag.UL);
        assert.equal(wrappingList.start, 0);
        assert.equal(wrappingList.end, 12);

        assert.equal(listItem.tag, MarkupTag.LI);
        assert.equal(listItem.start, 0);
        assert.equal(listItem.end, 12);
    });

    it('should join a list item to the following list item or block if deleting from its end', () => {
        const prevState = Object.assign(new State(), {
            text: 'List item 1.\n\nParagraph.',
            markups: [
                new Markup([MarkupTag.UL, 0, 14]),
                new Markup([MarkupTag.LI, 0, 12]),
                new Markup([MarkupTag.P, 14, 24])
            ]
        });

        const nextState = insert(prevState, {from: 12, to: 14}, '');
        const {markups} = nextState;

        assert.equal(markups.length, 2);

        const wrappingList = markups[0];
        const listItem = markups[1];

        assert.equal(wrappingList.tag, MarkupTag.UL);
        assert.equal(wrappingList.start, 0);
        assert.equal(wrappingList.end, 22);

        assert.equal(listItem.tag, MarkupTag.LI);
        assert.equal(listItem.start, 0);
        assert.equal(listItem.end, 22);
    });

    it('should join two list items if a range of characters is deleted crossing both items', () => {
        const prevState = Object.assign(new State(), {
            text: 'List item 1.\n\nList item 2.',
            markups: [
                new Markup([MarkupTag.UL, 0, 26]),
                new Markup([MarkupTag.LI, 0, 12]),
                new Markup([MarkupTag.LI, 14, 26])
            ]
        });

        const nextState = insert(prevState, {from: 5, to: 19}, '');
        const {markups, text} = nextState;

        assert.equal(markups.length, 2);

        const wrappingList = markups[0];
        const listItem = markups[1];

        assert.equal(text, 'List item 2.');

        assert.equal(wrappingList.tag, MarkupTag.UL);
        assert.equal(wrappingList.start, 0);
        assert.equal(wrappingList.end, 12);

        assert.equal(listItem.tag, MarkupTag.LI);
        assert.equal(listItem.start, 0);
        assert.equal(listItem.end, 12);
    });

    it('should join two adjacent lists when the separating block break is removed', () => {
        const prevState = Object.assign(new State(), {
            text: 'List 1.\n\nList 2.',
            markups: [
                new Markup([MarkupTag.UL, 0, 7]),
                new Markup([MarkupTag.LI, 0, 7]),
                new Markup([MarkupTag.UL, 9, 16]),
                new Markup([MarkupTag.LI, 9, 16])
            ]
        });

        const nextState = insert(prevState, {from: 7, to: 9}, '');
        const {markups, text} = nextState;

        assert.equal(markups.length, 2);

        const [wrappingList, listItem] = markups;

        assert.equal(text, 'List 1.List 2.');

        assert.equal(wrappingList.tag, MarkupTag.UL);
        assert.equal(wrappingList.start, 0);
        assert.equal(wrappingList.end, 14);

        assert.equal(listItem.tag, MarkupTag.LI);
        assert.equal(listItem.start, 0);
        assert.equal(listItem.end, 14);
    });
});