import * as chai from 'chai';

import MarkupTag     from '../Constants/MarkupTag';
import Markup        from '../Markup';
import adjustMarkups from './adjustMarkups';

const assert = chai.assert;

describe('adjustMarkups()', () => {
    it('should copy unaffected markups by reference and clone affected markups', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 5]),
            new Markup([MarkupTag.P, 7, 11])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 11, 11, 0, 0);

        assert.notEqual(prevMarkups, nextMarkups);
        assert.equal(prevMarkups[0], nextMarkups[0]);
        assert.deepEqual(prevMarkups[1], nextMarkups[1]);
    });

    it('should remove self-closing markups starting at the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 20]),
            new Markup([MarkupTag.BR, 10, 10])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 10, 15, 0, -5);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 15])
        ]);
    });

    it('should adjust block markups starting at the selection and within the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.P, 12, 22])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 12, 22, 1, -9);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.P, 12, 13])
        ]);
    });

    it('should adjust list items starting at the selection and within the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.UL, 0, 22]),
            new Markup([MarkupTag.LI, 0, 10]),
            new Markup([MarkupTag.LI, 12, 22])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 12, 22, 1, -9);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.UL, 0, 13]),
            new Markup([MarkupTag.LI, 0, 10]),
            new Markup([MarkupTag.LI, 12, 13])
        ]);
    });

    it('should adjust inline markups starting at the selection and within the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 20]),
            new Markup([MarkupTag.STRONG, 10, 10])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 10, 10, 5, 5);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 25]),
            new Markup([MarkupTag.STRONG, 10, 15])
        ]);
    });

    it('should shunt self-closing markups starting at the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 20]),
            new Markup([MarkupTag.BR, 10, 10])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 10, 10, 1, 1);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 21]),
            new Markup([MarkupTag.BR, 11, 11])
        ]);
    });

    it('should positively shunt self-closing markups starting at the end of the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 20]),
            new Markup([MarkupTag.BR, 10, 10])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 8, 10, 2, 2);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 22]),
            new Markup([MarkupTag.BR, 12, 12])
        ]);
    });

    it('should negatively shunt self-closing markups starting at the end of the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 20]),
            new Markup([MarkupTag.BR, 10, 10])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 8, 10, 0, -2);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 18]),
            new Markup([MarkupTag.BR, 8, 8])
        ]);
    });

    it('should remove inline markups enveloped by the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 20]),
            new Markup([MarkupTag.STRONG, 10, 15])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 8, 17, 2, -7);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 13])
        ]);
    });

    it('should remove custom blocks enveloped by the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup(['foo' as MarkupTag, 12, 12]),
            new Markup([MarkupTag.P, 14, 24])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 12, 14, 0, -2);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.P, 12, 22])
        ]);
    });

    it('should remove blocks enveloped by the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.H1, 14, 24]),
            new Markup([MarkupTag.P, 26, 36])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 8, 28, 0, -20);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 16])
        ]);
    });

    it('adjusts a block markup containing the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 5, 7, 4, 2);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 12])
        ]);
    });

    it('adjusts an inline markup containing the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.EM, 3, 9])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 5, 7, 0, -2);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 8]),
            new Markup([MarkupTag.EM, 3, 7])
        ]);
    });

    it('shunts an inline markup with a collapsed selection at its start', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.EM, 3, 9])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 3, 3, 5, 5);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 15]),
            new Markup([MarkupTag.EM, 8, 14])
        ]);
    });

    it('slices an inline markup partially enveloped by the selection from its start', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.EM, 3, 9])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 0, 5, 2, -3);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 7]),
            new Markup([MarkupTag.EM, 2, 6])
        ]);
    });

    it('extends an inline markup partially enveloped by the selection from its end', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.EM, 3, 6])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 5, 8, 5, 2);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 12]),
            new Markup([MarkupTag.EM, 3, 10])
        ]);
    });

    it('extends an inline markup with the selection at its end', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.EM, 3, 6])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 6, 6, 1, 1);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 11]),
            new Markup([MarkupTag.EM, 3, 7])
        ]);
    });

    it('extends a block markup partially enveloped by the selection from its end', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.P, 12, 22])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 6, 14, 0, -8);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 14])
        ]);
    });

    it('adjusts a block markup partially enveloped by the selection from its end', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10])
        ];

        // Extends past the selectable range:

        const nextMarkups = adjustMarkups(prevMarkups, 6, 12, 0, -6);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 4])
        ]);
    });

    it('moves all markups beyond the affected selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.H1, 12, 22]),
            new Markup([MarkupTag.EM, 15, 18])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 5, 5, 2, 2);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 12]),
            new Markup([MarkupTag.H1, 14, 24]),
            new Markup([MarkupTag.EM, 17, 20])
        ]);
    });

    it('pre-joins empty blocks at the start of the selection', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.P, 12, 12]),
            new Markup([MarkupTag.P, 14, 24])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 12, 14, 0, -2);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.P, 12, 12]),
            new Markup([MarkupTag.P, 12, 22])
        ]);
    });

    it('preserves empty blocks after a deleted custom block', () => {
        const prevMarkups = [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup(['foo' as MarkupTag, 12, 12]),
            new Markup([MarkupTag.P, 14, 14])
        ];

        const nextMarkups = adjustMarkups(prevMarkups, 12, 14, 0, -2);

        assert.deepEqual(nextMarkups, [
            new Markup([MarkupTag.P, 0, 10]),
            new Markup([MarkupTag.P, 12, 12])
        ]);
    });
});
