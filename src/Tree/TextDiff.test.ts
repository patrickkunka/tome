import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import TextDiff from './TextDiff';

chai.use(deepEqual);

const assert = chai.assert;

interface IExpectedCommand {
    text: string;
    replaceStart: number;
    replaceEnd: number;
}

interface ITestCase {
    prev: string;
    next: string;
    patch: IExpectedCommand;
}

const testCases: ITestCase[] = [
    {
        prev: 'foo',
        next: 'fooa',
        patch: {
            text: 'a',
            replaceStart: 3,
            replaceEnd: 3
        }
    },
    {
        prev: 'foo',
        next: 'afoo',
        patch: {
            text: 'a',
            replaceStart: 0,
            replaceEnd: 0
        }
    },
    {
        prev: 'foo',
        next: 'foao',
        patch: {
            text: 'a',
            replaceStart: 2,
            replaceEnd: 2
        }
    },
    {
        prev: 'fooa',
        next: 'foo',
        patch: {
            text: '',
            replaceStart: 3,
            replaceEnd: 4
        }
    },
    {
        prev: 'afoo',
        next: 'foo',
        patch: {
            text: '',
            replaceStart: 0,
            replaceEnd: 1
        }
    },
    {
        prev: 'foo',
        next: 'bar',
        patch: {
            text: 'bar',
            replaceStart: 0,
            replaceEnd: 3
        }
    },
    {
        prev: 'foo',
        next: 'fao',
        patch: {
            text: 'a',
            replaceStart: 1,
            replaceEnd: 2
        }
    },
    {
        prev: 'foo',
        next: '',
        patch: {
            text: '',
            replaceStart: 0,
            replaceEnd: 3
        }
    },
    {
        prev: '',
        next: 'foo',
        patch: {
            text: 'foo',
            replaceStart: 0,
            replaceEnd: 0
        }
    },
    {
        prev: 'ooo',
        next: 'oooo',
        patch: {
            text: 'o',
            replaceStart: 3,
            replaceEnd: 3
        }
    },
    {
        prev: 'fffoobbb',
        next: 'fffoooobbb',
        patch: {
            text: 'oo',
            replaceStart: 5,
            replaceEnd: 5
        }
    },
    {
        prev: 'oooo',
        next: 'ooo',
        patch: {
            text: '',
            replaceStart: 3,
            replaceEnd: 3
        }
    },
    {
        prev: 'fffoooobbb',
        next: 'fffoobbb',
        patch: {
            text: '',
            replaceStart: 5,
            replaceEnd: 5
        }
    }
];

describe('TextDiff', () => {
    describe('#diff()', () => {
        testCases.forEach(({prev, next, patch}, i) => {
            it('should return an accurate patch command', () => {
                const command = TextDiff.diff(prev, next);

                try {
                    assert.deepEqual(command, patch);
                } catch (err) {
                    console.error(testCases[i]);

                    throw err;
                }
            });
        });
    });
});