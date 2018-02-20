import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import TextDiff from './TextDiff';

chai.use(deepEqual);

const assert = chai.assert;

interface IExpectedCommand {
    text: string;
    replaceStart: number;
    replaceCount: number;
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
            replaceCount: 0
        }
    },
    {
        prev: 'foo',
        next: 'afoo',
        patch: {
            text: 'a',
            replaceStart: 0,
            replaceCount: 0
        }
    },
    {
        prev: 'foo',
        next: 'foao',
        patch: {
            text: 'a',
            replaceStart: 2,
            replaceCount: 0
        }
    },
    {
        prev: 'fooa',
        next: 'foo',
        patch: {
            text: '',
            replaceStart: 3,
            replaceCount: 1
        }
    },
    {
        prev: 'afoo',
        next: 'foo',
        patch: {
            text: '',
            replaceStart: 0,
            replaceCount: 1
        }
    },
    {
        prev: 'foo',
        next: 'bar',
        patch: {
            text: 'bar',
            replaceStart: 0,
            replaceCount: 3
        }
    },
    {
        prev: 'foo',
        next: 'fao',
        patch: {
            text: 'a',
            replaceStart: 1,
            replaceCount: 1
        }
    },
    {
        prev: 'foo',
        next: '',
        patch: {
            text: '',
            replaceStart: 0,
            replaceCount: 3
        }
    },
    {
        prev: '',
        next: 'foo',
        patch: {
            text: 'foo',
            replaceStart: 0,
            replaceCount: 0
        }
    },
    {
        prev: 'ooo',
        next: 'oooo',
        patch: {
            text: 'o',
            replaceStart: 3,
            replaceCount: 0
        }
    },
    {
        prev: 'fffoobbb',
        next: 'fffoooobbb',
        patch: {
            text: 'oo',
            replaceStart: 5,
            replaceCount: 0
        }
    },
    {
        prev: 'oooo',
        next: 'ooo',
        patch: {
            text: '',
            replaceStart: 3,
            replaceCount: 1
        }
    },
    {
        prev: 'fffoooobbb',
        next: 'fffoobbb',
        patch: {
            text: '',
            replaceStart: 5,
            replaceCount: 2
        }
    },
    {
        prev: 'fffawdawdawdawdbbb',
        next: 'fffabbb',
        patch: {
            text: '',
            replaceStart: 4,
            replaceCount: 11
        }
    },
    {
        prev: 'foo    bar.',
        next: 'foo bar.',
        patch: {
            text: '',
            replaceStart: 4,
            replaceCount: 3
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