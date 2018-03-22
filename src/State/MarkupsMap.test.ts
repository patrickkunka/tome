import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import MarkupTag  from './Constants/MarkupTag';
import Markup     from './Markup';
import MarkupsMap from './MarkupsMap';

chai.use(deepEqual);

const {assert} = chai;

interface ITestContext {
    map: MarkupsMap;
}

describe('MarkupsMap', function() {
    // @ts-ignore
    const self: ITestContext = this;

    beforeEach(() => {
        self.map = new MarkupsMap();
    });

    describe('#add()', () => {
        it('adds a single markup to the map', () => {
            const markup = new Markup([MarkupTag.EM, 0, 0]);

            assert.equal(self.map.allOfTag(MarkupTag.EM).length, 0);

            self.map.add(markup);

            assert.equal(self.map.allOfTag(MarkupTag.EM).length, 1);
        });

        it('adds multiple markups to the map', () => {
            const markupOne = new Markup([MarkupTag.STRONG, 0, 2]);
            const markupTwo = new Markup([MarkupTag.STRONG, 2, 10]);

            self.map.add(markupOne, markupTwo);

            assert.equal(self.map.allOfTag(MarkupTag.STRONG).length, 2);
        });
    });

    describe('#overrides', () => {
        it('removes any active markup for which an override is present', () => {
            const markup = new Markup([MarkupTag.STRONG, 0, 2]);

            self.map.add(markup);

            assert.isTrue(self.map.tags.includes(MarkupTag.STRONG));

            self.map.overrides.push(MarkupTag.STRONG);

            assert.isFalse(self.map.tags.includes(MarkupTag.STRONG));
        });

        it('activates tags for inactive markups when an override is present', () => {
            assert.isFalse(self.map.tags.includes(MarkupTag.STRONG));

            self.map.overrides.push(MarkupTag.STRONG);

            assert.isTrue(self.map.tags.includes(MarkupTag.STRONG));
        });
    });

    describe('#lastOfTag', () => {
        it('returns the last active markup for a provided tag', () => {
            const markupOne = new Markup([MarkupTag.STRONG, 0, 2]);
            const markupTwo = new Markup([MarkupTag.STRONG, 2, 10]);

            self.map.add(markupOne, markupTwo);

            assert.equal(self.map.lastOfTag(MarkupTag.STRONG), markupTwo);
        });

        it('returns `null` for a provided tag if no markups are active', () => {
            assert.isNull(self.map.lastOfTag(MarkupTag.STRONG));
        });
    });

    describe('#allOfTag', () => {
        it('returns all active markups for a provided tag', () => {
            const markupOne = new Markup([MarkupTag.STRONG, 0, 2]);
            const markupTwo = new Markup([MarkupTag.STRONG, 2, 10]);

            self.map.add(markupOne, markupTwo);

            assert.deepEqual(self.map.allOfTag(MarkupTag.STRONG), [markupOne, markupTwo]);
        });

        it('returns an empty array for a provided tag if no markups are active', () => {
            assert.deepEqual(self.map.allOfTag(MarkupTag.STRONG), []);
        });
    });

    describe('#clearTag()', () => {
        it('clears all active markups for a provided tag', () => {
            const markupOne = new Markup([MarkupTag.STRONG, 0, 2]);
            const markupTwo = new Markup([MarkupTag.EM, 2, 10]);

            self.map.add(markupOne, markupTwo);

            self.map.clearTag(MarkupTag.STRONG);

            assert.deepEqual(self.map.allOfTag(MarkupTag.STRONG), []);
            assert.deepEqual(self.map.allOfTag(MarkupTag.EM), [markupTwo]);
        });
    });

    describe('#clearAll()', () => {
        it('empties the internal map', () => {
            const markupOne = new Markup([MarkupTag.STRONG, 0, 2]);
            const markupTwo = new Markup([MarkupTag.EM, 2, 10]);

            self.map.add(markupOne, markupTwo);

            self.map.clearAll();

            assert.deepEqual(self.map.allOfTag(MarkupTag.STRONG), []);
            assert.deepEqual(self.map.allOfTag(MarkupTag.EM), []);
        });
    });
});
