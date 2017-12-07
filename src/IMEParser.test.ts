import * as chai          from 'chai';
import * as deepEqual     from 'chai-shallow-deep-equal';
import ActionType         from './constants/ActionType';
import IMEParser          from './IMEParser';

chai.use(deepEqual);

const assert = chai.assert;

describe('IMEParser', () => {
    describe('#diffStringValues()', () => {
        it('should recognise two equal strings', () => {
            const action = IMEParser.diffStringValues('Lorem.', 'Lorem.');

            assert.equal(action.type, ActionType.NONE);
        });

        it('should recognise a replacement of equal value', () => {
            const action = IMEParser.diffStringValues('One one three.', 'One two three.');

            assert.equal(action.type, ActionType.MUTATE);
            assert.equal(action.content, 'two');
            assert.deepEqual(action.range, {from: 4, to: 7});
        });

        it('should recognise a replacement of greater value', () => {
            const action = IMEParser.diffStringValues('One two three.', 'One four three.');

            assert.equal(action.type, ActionType.MUTATE);
            assert.equal(action.content, 'four');
            assert.deepEqual(action.range, {from: 4, to: 7});
        });

        it('should recognise a partial replacement of greater value', () => {
            const action = IMEParser.diffStringValues('One the three.', 'One three three.');

            assert.equal(action.type, ActionType.MUTATE);
            assert.equal(action.content, 're');
            assert.deepEqual(action.range, {from: 6, to: 6});
        });

        it('should recognise a replacement of lesser value', () => {
            const action = IMEParser.diffStringValues('One four three.', 'One two three.');

            assert.equal(action.type, ActionType.MUTATE);
            assert.equal(action.content, 'two');
            assert.deepEqual(action.range, {from: 4, to: 8});
        });

        it('should recognise a partial deletion', () => {
            const action = IMEParser.diffStringValues('One two three.', 'One to three.');

            assert.equal(action.type, ActionType.MUTATE);
            assert.equal(action.content, '');
            assert.deepEqual(action.range, {from: 5, to: 6});
        });

        it('should recognise a partial deletion', () => {
            const action = IMEParser.diffStringValues('Line three.', 'Line thre.');

            assert.equal(action.type, ActionType.MUTATE);
            assert.equal(action.content, '');
            assert.deepEqual(action.range, {from: 8, to: 9});
        });
    });
});