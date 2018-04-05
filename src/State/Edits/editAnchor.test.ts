import * as chai from 'chai';

import MarkupTag  from '../Constants/MarkupTag';
import Markup     from '../Markup';
import MarkupsMap from '../MarkupsMap';
import State      from '../State';
import editAnchor from './editAnchor';

const assert = chai.assert;

describe('editAnchor()', () => {
    it(
        'should return the previous state if no anchor markup is selected',
        () => {
            const prevState = Object.assign(new State(), {
                text: 'foo',
                markups: [
                    new Markup([MarkupTag.P, 0, 3])
                ]
            });

            const nextState = editAnchor(prevState, {href: 'foo'});

            assert.equal(prevState, nextState);
        }
    );

    it(
        'should return the previous state if no anchor markup is selected',
        () => {
            const anchor = new Markup([MarkupTag.A, 1, 2, {href: 'foo'}]);
            const activeInlineMarkups = new MarkupsMap();

            activeInlineMarkups.add(anchor);

            const prevState = Object.assign(new State(), {
                text: 'foo',
                markups: [
                    new Markup([MarkupTag.P, 0, 3]),
                    anchor
                ],
                activeInlineMarkups
            });

            const nextState = editAnchor(prevState, {href: 'foo'});

            assert.notEqual(prevState, nextState);
            assert.notEqual(prevState.markups[1], nextState.markups[1]);
            assert.notEqual(prevState.markups[1].data, nextState.markups[1].data);
        }
    );
});
