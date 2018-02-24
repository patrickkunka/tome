import * as chai      from 'chai';
import * as deepEqual from 'chai-shallow-deep-equal';

import TextDiff from './TextDiff';

chai.use(deepEqual);

const assert = chai.assert;

interface IExpectedCommand {
    replaceWith: string;
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
            replaceWith: 'a',
            replaceStart: 3,
            replaceCount: 0
        }
    },
    {
        prev: 'foo',
        next: 'afoo',
        patch: {
            replaceWith: 'a',
            replaceStart: 0,
            replaceCount: 0
        }
    },
    {
        prev: 'foo',
        next: 'foao',
        patch: {
            replaceWith: 'a',
            replaceStart: 2,
            replaceCount: 0
        }
    },
    {
        prev: 'fooa',
        next: 'foo',
        patch: {
            replaceWith: '',
            replaceStart: 3,
            replaceCount: 1
        }
    },
    {
        prev: 'afoo',
        next: 'foo',
        patch: {
            replaceWith: '',
            replaceStart: 0,
            replaceCount: 1
        }
    },
    {
        prev: 'foo',
        next: 'bar',
        patch: {
            replaceWith: 'bar',
            replaceStart: 0,
            replaceCount: 3
        }
    },
    {
        prev: 'foo',
        next: 'fao',
        patch: {
            replaceWith: 'a',
            replaceStart: 1,
            replaceCount: 1
        }
    },
    {
        prev: 'foo',
        next: '',
        patch: {
            replaceWith: '',
            replaceStart: 0,
            replaceCount: 3
        }
    },
    {
        prev: '',
        next: 'foo',
        patch: {
            replaceWith: 'foo',
            replaceStart: 0,
            replaceCount: 0
        }
    },
    {
        prev: 'ooo',
        next: 'oooo',
        patch: {
            replaceWith: 'o',
            replaceStart: 3,
            replaceCount: 0
        }
    },
    {
        prev: 'fffoobbb',
        next: 'fffoooobbb',
        patch: {
            replaceWith: 'oo',
            replaceStart: 5,
            replaceCount: 0
        }
    },
    {
        prev: 'oooo',
        next: 'ooo',
        patch: {
            replaceWith: '',
            replaceStart: 3,
            replaceCount: 1
        }
    },
    {
        prev: 'fffoooobbb',
        next: 'fffoobbb',
        patch: {
            replaceWith: '',
            replaceStart: 5,
            replaceCount: 2
        }
    },
    {
        prev: 'fffawdawdawdawdbbb',
        next: 'fffabbb',
        patch: {
            replaceWith: '',
            replaceStart: 4,
            replaceCount: 11
        }
    },
    {
        prev: 'foo    bar.',
        next: 'foo bar.',
        patch: {
            replaceWith: '',
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
                    assert.deepEqual(command, {...patch, fullText: next});
                } catch (err) {
                    console.error(testCases[i]);

                    throw err;
                }
            });
        });
    });
});