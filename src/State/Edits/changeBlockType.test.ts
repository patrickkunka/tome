import * as chai from 'chai';

import MarkupTag       from '../Constants/MarkupTag';
import Markup          from '../Markup';
import State           from '../State';
import changeBlockType from './changeBlockType';

const assert = chai.assert;

describe('changeBlockType()', () => {
    it(
        'should change the block type of a single enveloped block markup',
        () => {
            const paragraph = new Markup([MarkupTag.P, 0, 3]);

            const prevState = Object.assign(new State(), {
                text: 'foo',
                markups: [paragraph],
                envelopedBlockMarkups: [paragraph]
            });

            const nextState = changeBlockType(prevState, MarkupTag.H1);

            assert.equal(nextState.markups[0].tag, MarkupTag.H1);
        }
    );

    it(
        'should change the block type of multiple enveloped block markups',
        () => {
            const heading = new Markup([MarkupTag.H2, 0, 3]);
            const paragraph = new Markup([MarkupTag.P, 5, 8]);

            const prevState = Object.assign(new State(), {
                text: 'foo\n\nbar\n\nbaz',
                markups: [
                    heading,
                    paragraph,
                    new Markup([MarkupTag.P, 10, 13])
                ],
                envelopedBlockMarkups: [heading, paragraph]
            });

            const nextState = changeBlockType(prevState, MarkupTag.H4);

            assert.equal(nextState.markups[0].tag, MarkupTag.H4);
            assert.equal(nextState.markups[1].tag, MarkupTag.H4);
            assert.equal(nextState.markups[2].tag, MarkupTag.P);
        }
    );

    it(
        'should change a single non-list block to a list by wrapping it in a list and converting it to a <li>',
        () => {
            const paragraph = new Markup([MarkupTag.P, 5, 8]);

            const prevState = Object.assign(new State(), {
                text: 'foo\n\nbar\n\nbaz',
                markups: [
                    new Markup([MarkupTag.H2, 0, 3]),
                    paragraph,
                    new Markup([MarkupTag.P, 10, 13])
                ],
                envelopedBlockMarkups: [paragraph]
            });

            const nextState = changeBlockType(prevState, MarkupTag.OL);

            assert.equal(nextState.markups.length, 4);

            assert.equal(nextState.markups[0].tag, MarkupTag.H2);
            assert.equal(nextState.markups[1].tag, MarkupTag.OL);
            assert.equal(nextState.markups[2].tag, MarkupTag.LI);
            assert.equal(nextState.markups[3].tag, MarkupTag.P);
        }
    );

    it(
        'should change mulitple non-list blocks to a list by wrapping them ' +
        'in a list and converting each block to a <li>',
        () => {
            const heading = new Markup([MarkupTag.H2, 0, 3]);
            const paragraph = new Markup([MarkupTag.P, 5, 8]);

            const prevState = Object.assign(new State(), {
                text: 'foo\n\nbar\n\nbaz',
                markups: [
                    heading,
                    paragraph,
                    new Markup([MarkupTag.P, 10, 13])
                ],
                envelopedBlockMarkups: [heading, paragraph]
            });

            const nextState = changeBlockType(prevState, MarkupTag.OL);

            assert.equal(nextState.markups.length, 4);

            assert.equal(nextState.markups[0].tag, MarkupTag.OL);
            assert.equal(nextState.markups[1].tag, MarkupTag.LI);
            assert.equal(nextState.markups[2].tag, MarkupTag.LI);
            assert.equal(nextState.markups[3].tag, MarkupTag.P);
        }
    );

    it(
        'should change a list from one type to another',
        () => {
            const heading = new Markup([MarkupTag.H2, 0, 3]);
            const ol = new Markup([MarkupTag.OL, 5, 8]);
            const li = new Markup([MarkupTag.LI, 5, 8]);

            const prevState = Object.assign(new State(), {
                text: 'foo\n\nbar\n\nbaz',
                markups: [
                    heading,
                    ol,
                    li,
                    new Markup([MarkupTag.P, 10, 13])
                ],
                envelopedBlockMarkups: [heading, li],
                activeListMarkup: ol
            });

            const nextState = changeBlockType(prevState, MarkupTag.UL);

            assert.equal(nextState.markups.length, 4);

            assert.equal(nextState.markups[0].tag, MarkupTag.UL);
            assert.equal(nextState.markups[1].tag, MarkupTag.LI);
            assert.equal(nextState.markups[2].tag, MarkupTag.LI);
            assert.equal(nextState.markups[3].tag, MarkupTag.P);
        }
    );
});
