import * as chai          from 'chai';
import * as deepEqual     from 'chai-shallow-deep-equal';
import HtmlEntity         from './constants/HtmlEntity';
import MarkupTag          from './constants/MarkupTag';
import SelectionDirection from './constants/SelectionDirection';
import Editor             from './Editor';
import Markup             from './models/Markup';
import State              from './models/State';
import TomeSelection      from './models/TomeSelection';

chai.use(deepEqual);

const assert = chai.assert;

describe('Editor', () => {
    it('should insert a single character within a markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum',
            markups: [
                new Markup([MarkupTag.P, 0, 11])
            ]
        });

        const newState = Editor.insert(state, {from: 5, to: 5}, 's');

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

        const newState = Editor.insert(state, {from: 11, to: 11}, ' dolor');

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

        const newState = Editor.insert(state, {from: 17, to: 17}, 's');

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

        const newState = Editor.insert(state, {from: 12, to: 12}, ' Sit');

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

        const newState = Editor.insert(state, {from: 0, to: 0}, 'Foo ');

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

        const newState = Editor.insert(state, {from: 0, to: 0}, 'Foo ');

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

        const newState = Editor.insert(state, {from: 3, to: 6}, 'f');

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

        const newState = Editor.insert(state, {from: 11, to: 11}, ' dolor');

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

        const newState = Editor.insert(state, {from: 21, to: 21}, ', consectetur');

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

        const newState = Editor.insert(state, {from: 6, to: 11}, 'dolor');

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

        const newState = Editor.insert(state, {from: 5, to: 12}, 'dolor.');

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

        const newState = Editor.insert(state, {from: 5, to: 11}, '');

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

        const newState = Editor.insert(state, {from: 0, to: 18}, '');

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

        const newState = Editor.insert(state, {from: 3, to: 8}, 'foo');

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

        const newState = Editor.insert(state, {from: 3, to: 8}, 'foo');

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

        const newState = Editor.insert(state, {from: 8, to: 14}, 'foo');

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

        const newState = Editor.insert(state, {from: 11, to: 22}, '');

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

        const newState = Editor.insert(state, {from: 11, to: 22}, '');

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

        const newState = Editor.insert(state, {from: 3, to: 3}, HtmlEntity.BLOCK_BREAK);

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

        const newState = Editor.insert(state, {from: 9, to: 11}, 'a');

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

        const newState = Editor.insert(state, {from: 1, to: 11}, 'a');

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

    //     const newState = Editor.insert(state, {from: 19, to: 19}, '\n');

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

    //     const newState = Editor.insert(state, {from: 18, to: 18}, '\n');

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

        const newState = Editor.insert(state, {from: 35, to: 35}, HtmlEntity.BLOCK_BREAK);

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

        const newState = Editor.insert(state, {from: 18, to: 18}, HtmlEntity.BLOCK_BREAK);

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

        const newState = Editor.insert(state, {from: 6, to: 6}, HtmlEntity.BLOCK_BREAK);

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

        const newState = Editor.insert(state, {from: 8, to: 8}, HtmlEntity.BLOCK_BREAK);

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

        const newState = Editor.insert(state, {from: 6, to: 11}, HtmlEntity.BLOCK_BREAK);

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

        const newState = Editor.insert(state, {from: 6, to: 6}, HtmlEntity.BLOCK_BREAK);

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

        const newState = Editor.insert(state, {from: 6, to: 6}, HtmlEntity.LINE_BREAK);

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

        const newState = Editor.insert(state, {from: 0, to: 0}, HtmlEntity.LINE_BREAK);

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

        const newState = Editor.insert(state, {from: 9, to: 9}, HtmlEntity.LINE_BREAK);

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

        const newState = Editor.insert(state, {from: 10, to: 10}, 'a');

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

        const newState = Editor.insert(state, {from: 0, to: 0}, 'a');

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

        const newState = Editor.insert(state, {from: 2, to: 3}, '');

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

        const newState = Editor.insert(state, {from: 18, to: 19}, '');

        assert.equal(newState.text, 'Lorem ipsum dolor.Sit amet.');
        assert.equal(newState.markups.length, 1);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 27]));
    });

    it('should add an inline markup within a selection', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28])
            ]
        });

        const newState = Editor.addInlineMarkup(state, MarkupTag.STRONG, 6, 11);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 11]));
    });

    it('should add an inline markup at the start of a selection', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28])
            ]
        });

        const newState = Editor.addInlineMarkup(state, MarkupTag.STRONG, 0, 5);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 0, 5]));
    });

    it('should add an inline markup at the end of a selection', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28])
            ]
        });

        const newState = Editor.addInlineMarkup(state, MarkupTag.STRONG, 23, 28);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 23, 28]));
    });

    it('should add an inline markup at the start of second block element', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.\nSit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 50])
            ]
        });

        const newState = Editor.addInlineMarkup(state, MarkupTag.STRONG, 19, 22);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.STRONG, 19, 22]));
    });

    it('should add an inline markups accross multiple blocks', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.\n\nSit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 19]),
                new Markup([MarkupTag.P, 20, 29])
            ],
            selection: {from: 0, to: 29, direction: SelectionDirection.LTR}
        });

        state.envelopedBlockMarkups = state.markups;

        const newState = Editor.addInlineMarkup(state, MarkupTag.EM, 0, 29);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 6);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 18]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.EM, 0, 18]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.P, 19, 19]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.EM, 19, 19]));
        assert.deepEqual(newState.markups[4], new Markup([MarkupTag.P, 20, 29]));
        assert.deepEqual(newState.markups[5], new Markup([MarkupTag.EM, 20, 29]));
        assert.deepEqual(
            newState.selection,
            Object.assign(new TomeSelection(), {from: 0, to: 29, direction: SelectionDirection.LTR})
        );
    });

    it('should not add inline markups over breaks between block markups', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor.\nSit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 18]),
                new Markup([MarkupTag.P, 19, 29])
            ]
        });

        state.envelopedBlockMarkups = [state.markups[1]];

        const newState = Editor.addInlineMarkup(state, MarkupTag.STRONG, 18, 29);

        assert.equal(newState.text, 'Lorem ipsum dolor.\nSit amet.');

        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 18]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 19, 29]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.STRONG, 19, 29]));
    });

    it('should not add inline markups over multiple breaks between block markups', () => {
        const state = Object.assign(new State(), {
            text: 'awd\n\nawd\nawd',
            markups: [
                new Markup([MarkupTag.P, 0, 3]),
                new Markup([MarkupTag.P, 4, 4]),
                new Markup([MarkupTag.P, 5, 8]),
                new Markup([MarkupTag.P, 9, 12])
            ]
        });

        state.envelopedBlockMarkups = state.markups.slice(1, 4);

        const newState = Editor.addInlineMarkup(state, MarkupTag.STRONG, 3, 12);

        assert.equal(newState.text, 'awd\n\nawd\nawd');

        assert.equal(newState.markups.length, 7);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 3]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 4, 4]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.STRONG, 4, 4]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.P, 5, 8]));
        assert.deepEqual(newState.markups[4], new Markup([MarkupTag.STRONG, 5, 8]));
        assert.deepEqual(newState.markups[5], new Markup([MarkupTag.P, 9, 12]));
        assert.deepEqual(newState.markups[6], new Markup([MarkupTag.STRONG, 9, 12]));
    });

    it('should merge like inline markups when adjacent', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 11])
            ]
        });

        const newState = Editor.addInlineMarkup(state, MarkupTag.STRONG, 11, 17);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 17]));
    });

    it('should insert an inline markup within another inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 17])
            ]
        });

        const newState = Editor.addInlineMarkup(state, MarkupTag.EM, 8, 11);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 17]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.EM, 8, 11]));
    });

    it('should insert a multiblock inline markup within an existing one', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9]),
                new Markup([MarkupTag.P, 10, 19]),
                new Markup([MarkupTag.STRONG, 10, 14])
            ]
        });

        state.envelopedBlockMarkups = [state.markups[0], state.markups[2]];

        const newState = Editor.addInlineMarkup(state, MarkupTag.EM, 8, 11);

        assert.equal(newState.text, 'Line one.\nLine two.');
        assert.equal(newState.markups.length, 6);

        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 9]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 5, 9]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.EM, 8, 9]));
        assert.deepEqual(newState.markups[3], new Markup([MarkupTag.P, 10, 19]));
        assert.deepEqual(newState.markups[4], new Markup([MarkupTag.STRONG, 10, 14]));
        assert.deepEqual(newState.markups[5], new Markup([MarkupTag.EM, 10, 11]));
    });

    it('should add an inline link with data', () => {
        const anchorData = {
            href: 'https://www.kunkalabs.com',
            target: '_blank'
        };

        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28])
            ]
        });

        const newState = Editor.addInlineMarkup(state, MarkupTag.A, 6, 11, anchorData);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.A, 6, 11, anchorData]));
    });

    it('should remove a portion of an inline link, creating two equal copies of it', () => {
        const anchorData = {
            href: 'https://www.kunkalabs.com',
            target: '_blank'
        };

        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 28]),
                new Markup([MarkupTag.A, 6, 17, anchorData])
            ]
        });

        const newState = Editor.removeInlineMarkup(state, MarkupTag.A, 11, 12);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.A, 6, 11, anchorData]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.A, 12, 17, anchorData]));
    });

    it('should remove an inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 17])
            ]
        });

        const newState = Editor.removeInlineMarkup(state, MarkupTag.STRONG, 6, 17);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 1);
    });

    it('should remove the start of inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 17])
            ]
        });

        const newState = Editor.removeInlineMarkup(state, MarkupTag.STRONG, 6, 12);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 12, 17]));
    });

    it('should remove the end of inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 17])
            ]
        });

        const newState = Editor.removeInlineMarkup(state, MarkupTag.STRONG, 11, 17);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 2);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 11]));
    });

    it('should remove an internal section of an inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Lorem ipsum dolor. Sit amet.',
            markups: [
                new Markup([MarkupTag.P, 0, 50]),
                new Markup([MarkupTag.STRONG, 6, 17])
            ]
        });

        const newState = Editor.removeInlineMarkup(state, MarkupTag.STRONG, 12, 14);

        assert.equal(newState.text, state.text);
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.STRONG, 6, 12]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.STRONG, 14, 17]));
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

        const newState = Editor.insert(state, {from: 19, to: 19}, HtmlEntity.BLOCK_BREAK);

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

        const newState = Editor.insert(state, {from: 18, to: 19}, '');

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

        const newState = Editor.insert(state, {from: 12, to: 24}, '');

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

        const newState = Editor.insert(state, {from: 0, to: 29}, '');

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

        const newState = Editor.insert(state, {from: 9, to: 9}, HtmlEntity.BLOCK_BREAK);

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

        const newState = Editor.insert(state, {from: 11, to: 11}, HtmlEntity.BLOCK_BREAK);

        assert.equal(newState.text, 'Line one.\n\n\n\nLine two.');
        assert.equal(newState.markups.length, 3);
        assert.deepEqual(newState.markups[0], new Markup([MarkupTag.P, 0, 9]));
        assert.deepEqual(newState.markups[1], new Markup([MarkupTag.P, 11, 11]));
        assert.deepEqual(newState.markups[2], new Markup([MarkupTag.P, 13, 22]));
    });

    it('should detect an active inline markup', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9])
            ]
        });

        Editor.setActiveMarkups(
            state,
            Object.assign(new TomeSelection(), {from: 5, to: 9, direction: SelectionDirection.LTR})
        );

        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.STRONG).length, 1);
    });

    it('should detect an multiple active inline markups', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9]),
                new Markup([MarkupTag.EM, 5, 9])
            ]
        });

        Editor.setActiveMarkups(
            state,
            Object.assign(new TomeSelection(), {from: 5, to: 9, direction: SelectionDirection.LTR})
        );

        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.STRONG).length, 1);
        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.EM).length, 1);
    });

    it('should detect an active inline markup across multiple blocks', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9]),
                new Markup([MarkupTag.P, 10, 19]),
                new Markup([MarkupTag.STRONG, 10, 14])
            ]
        });

        Editor.setActiveMarkups(
            state,
            Object.assign(new TomeSelection(), {from: 5, to: 14, direction: SelectionDirection.LTR})
        );

        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.STRONG).length, 2);
    });

    it('should detect multiple active inline markups across multiple blocks', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 5, 9]),
                new Markup([MarkupTag.EM, 5, 9]),
                new Markup([MarkupTag.P, 10, 19]),
                new Markup([MarkupTag.STRONG, 10, 14]),
                new Markup([MarkupTag.EM, 10, 14])
            ]
        });

        Editor.setActiveMarkups(
            state,
            Object.assign(new TomeSelection(), {from: 5, to: 14, direction: SelectionDirection.LTR})
        );

        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.STRONG).length, 2);
        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.EM).length, 2);
    });

    it('should detect only the appropriate active inline markups even if multiple exist', () => {
        const state = Object.assign(new State(), {
            text: 'Line one.\nLine two.\nLine three.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.STRONG, 0, 9]),
                new Markup([MarkupTag.P, 10, 19]),
                new Markup([MarkupTag.STRONG, 10, 19]),
                new Markup([MarkupTag.P, 20, 31]),
                new Markup([MarkupTag.STRONG, 20, 31])
            ]
        });

        Editor.setActiveMarkups(
            state,
            Object.assign(new TomeSelection(), {from: 0, to: 14, direction: SelectionDirection.LTR})
        );

        assert.equal(state.activeInlineMarkups.allOfTag(MarkupTag.STRONG).length, 2);
    });

    it('should insert a single unformatted line from the clipboard', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 20])
            ]
        });

        const nextState = Editor.insertFromClipboard(prevState, {
            text: 'Lorem ipsum',
            html: ''
        }, 20, 20);

        assert.equal(nextState.text, 'Line one.\n\nLine two.Lorem ipsum');
        assert.equal(nextState.markups.length, 2);

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 9]),
            new Markup([MarkupTag.P, 11, 31])
        ]);
    });

    it('should insert a line with a break from the clipboard', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 20])
            ]
        });

        const nextState = Editor.insertFromClipboard(prevState, {
            text: 'Lorem\nipsum',
            html: ''
        }, 20, 20);

        assert.equal(nextState.text, 'Line one.\n\nLine two.Lorem\nipsum');
        assert.equal(nextState.markups.length, 3);

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 9]),
            new Markup([MarkupTag.P, 11, 31]),
            new Markup([MarkupTag.BR, 25, 25])
        ]);
    });

    it('should insert a single line at a line break from the clipboard', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n',
            markups: [
                new Markup([MarkupTag.P, 0, 10]),
                new Markup([MarkupTag.BR, 9, 9])
            ]
        });

        const nextState = Editor.insertFromClipboard(prevState, {
            text: 'Line two.',
            html: ''
        }, 10, 10);

        assert.equal(nextState.text, 'Line one.\nLine two.');
        assert.equal(nextState.markups.length, 2);

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 19]),
            new Markup([MarkupTag.BR, 9, 9])
        ]);
    });

    it('should insert multiple paragraphs from the clipboard', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.\n\nLine two.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                new Markup([MarkupTag.P, 11, 20])
            ]
        });

        const nextState = Editor.insertFromClipboard(prevState, {
            text: 'Line three.\n\nLine four.',
            html: ''
        }, 20, 20);

        assert.equal(nextState.text, 'Line one.\n\nLine two.Line three.\n\nLine four.');
        assert.equal(nextState.markups.length, 3);

        assert.deepEqual(nextState.markups, [
            new Markup([MarkupTag.P, 0, 9]),
            new Markup([MarkupTag.P, 11, 31]),
            new Markup([MarkupTag.P, 33, 43])
        ]);
    });

    // TODO: test that inline markups are not extended when pasting multi block content
});