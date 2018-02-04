import * as chai          from 'chai';
import * as deepEqual     from 'chai-shallow-deep-equal';
import Action             from './Action';
import ActionType         from './Constants/ActionType';
import MarkupTag          from './Constants/MarkupTag';
import Markup             from './Markup';
import reducer            from './reducer';
import State              from './State';
import TomeSelection from './TomeSelection';

chai.use(deepEqual);

const assert = chai.assert;

describe('reducer', () => {
    it('should coerce consecutive line breaks into a block break from behind', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line o\nne.',
            markups: [
                new Markup([MarkupTag.P, 0, 10]),
                new Markup([MarkupTag.BR, 6, 6])
            ]
        });

        const nextState = reducer(prevState, Object.assign(new Action(), {
            type: ActionType.SHIFT_RETURN,
            range: {from: 7, to: 7}
        }));

        assert.equal(nextState.text, 'Line o\n\nne.');
        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[0], new Markup([MarkupTag.P, 0, 6]));
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.P, 8, 11]));
    });

    it('should coerce consecutive line breaks into a block break from in front', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line o\nne.',
            markups: [
                new Markup([MarkupTag.P, 0, 10]),
                new Markup([MarkupTag.BR, 6, 6])
            ]
        });

        const nextState = reducer(prevState, Object.assign(new Action(), {
            type: ActionType.SHIFT_RETURN,
            range: {from: 6, to: 6}
        }));

        assert.equal(nextState.text, 'Line o\n\nne.');
        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[0], new Markup([MarkupTag.P, 0, 6]));
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.P, 8, 11]));
    });

    it('should completely replace an existing state when using REPLACE_VALUE', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const nextState = reducer(prevState, Object.assign(new Action(), {
            type: ActionType.REPLACE_VALUE,
            data: {
                text: 'Lorem ipsum\ndolor sit.',
                markups: [
                    [MarkupTag.P, 0, 22],
                    [MarkupTag.BR, 11, 11]
                ]
            }
        }));

        assert.equal(nextState.text, 'Lorem ipsum\ndolor sit.');
        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[0], new Markup([MarkupTag.P, 0, 22]));
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.BR, 11, 11]));
        assert.equal(nextState.selection.from, 22);
    });

    it('should remove inline markup overrides when the selection is changed', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        prevState.activeInlineMarkups.overrides.push(MarkupTag.STRONG);

        const nextState = reducer(prevState, Object.assign(new Action(), {
            type: ActionType.SET_SELECTION,
            range: {from: 2, to: 2}
        }));

        assert.equal(nextState.activeInlineMarkups.overrides.length, 0);
    });

    it('should convert the last empty list item of a list into paragraph if a block return is inserted there', () => {
        const emptyListItem = new Markup([MarkupTag.LI, 42, 42]);

        const prevState = Object.assign(new State(), {
            text: 'List item 1.\n\nList item 2.\n\nList item 3.\n\n',
            markups: [
                new Markup([MarkupTag.UL, 0, 42]),
                new Markup([MarkupTag.LI, 0, 12]),
                new Markup([MarkupTag.LI, 14, 26]),
                new Markup([MarkupTag.LI, 28, 40]),
                emptyListItem
            ],
            envelopedBlockMarkups: [
                emptyListItem
            ],
            activeBlockMarkup: emptyListItem
        });

        const nextState = reducer(prevState, Object.assign(new Action(), {
            type: ActionType.RETURN,
            range: new TomeSelection(42, 42)
        }));

        const {markups} = nextState;

        assert.equal(markups.length, 5);

        const wrappingList = markups[0];
        const newParagraph = markups[4];

        assert.equal(wrappingList.tag, MarkupTag.UL);
        assert.equal(wrappingList.start, 0);
        assert.equal(wrappingList.end, 40);

        assert.equal(newParagraph.tag, MarkupTag.P);
        assert.equal(newParagraph.start, 42);
        assert.equal(newParagraph.end, 42);
    });
});
