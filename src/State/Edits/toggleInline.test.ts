import * as chai from 'chai';

import Action        from '../Action';
import MarkupTag     from '../Constants/MarkupTag';
import Markup        from '../Markup';
import MarkupsMap    from '../MarkupsMap';
import State         from '../State';
import TomeSelection from '../TomeSelection';
import toggleInline  from './toggleInline';

const assert = chai.assert;

describe('toggleInline()', () => {
    it('should throw an error if an invalid tag is provided', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        assert.throws(() => toggleInline(prevState, Object.assign(new Action(), {
            tag: 'awdawd' as MarkupTag
        })), /Unknown markup tag/);
    });

    it('returns the previous state if no range is provided', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const nextState = toggleInline(prevState, Object.assign(new Action(), {
            tag: MarkupTag.EM,
            range: new TomeSelection()
        }));

        assert.equal(nextState, prevState);
    });

    it('sets an override if a collapsed selection is provided', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const nextState = toggleInline(prevState, Object.assign(new Action(), {
            tag: MarkupTag.EM,
            range: new TomeSelection(0, 0)
        }));

        assert.deepEqual(nextState.activeInlineMarkups.overrides, [MarkupTag.EM]);
    });

    it('unsets an override if a collapsed selection is provided and the override is already active', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ],
            activeInlineMarkups: {
                overrides: [MarkupTag.EM]
            }
        });

        const nextState = toggleInline(prevState, Object.assign(new Action(), {
            tag: MarkupTag.EM,
            range: new TomeSelection(0, 0)
        }));

        assert.deepEqual(nextState.activeInlineMarkups.overrides, []);
    });

    it('adds an inline markup to the provided range', () => {
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9])
            ]
        });

        const nextState = toggleInline(prevState, Object.assign(new Action(), {
            tag: MarkupTag.EM,
            range: new TomeSelection(0, 4)
        }));

        assert.equal(nextState.markups.length, 2);
        assert.deepEqual(nextState.markups[1], new Markup([MarkupTag.EM, 0, 4]));
    });

    it('removes an inline markup from the provided range', () => {
        const em = new Markup([MarkupTag.EM, 0, 4]);
        const prevState = Object.assign(new State(), {
            text: 'Line one.',
            markups: [
                new Markup([MarkupTag.P, 0, 9]),
                em
            ],
            activeInlineMarkups: Object.assign(new MarkupsMap(), {
                map: {
                    [MarkupTag.EM]: [em]
                }
            })
        });

        const nextState = toggleInline(prevState, Object.assign(new Action(), {
            tag: MarkupTag.EM,
            range: new TomeSelection(0, 4)
        }));

        assert.equal(nextState.markups.length, 1);
    });
});