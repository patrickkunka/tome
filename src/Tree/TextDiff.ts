import TextPatchCommand from './TextPatchCommand';

/**
 * A static class for comparing two strings and constructing a
 * command object representing the least expensive mutation
 * to patch the previous version of the string into the next
 * one.
 */

class TextDiff {
    /**
     * Receives two versions of a string, compares them and and returns a
     * mapped `TextPatchCommand` object containing patch instructions.
     */

    public static diff(prevText: string, nextText: string): TextPatchCommand {
        const command = new TextPatchCommand();

        const [
            indexDivergesFromLeft,
            indexDivergesFromRight
        ] = TextDiff.getDivergentIndices(prevText, nextText);

        command.replaceWith = nextText.slice(indexDivergesFromLeft, nextText.length - indexDivergesFromRight);
        command.replaceStart = indexDivergesFromLeft;
        command.replaceCount = (prevText.length - indexDivergesFromRight) - indexDivergesFromLeft;
        command.fullText = nextText;

        return command;
    }

    /**
     * Receives two strings and returns a tuple indicating the left and right indices
     * at which the strings first diverge.
     *
     * NB: The right index is calcuated from the end of the string.
     */

    private static getDivergentIndices(prevText, nextText): [number, number] {
        const prevLength = prevText.length;
        const nextLength = nextText.length;
        const minLength = Math.min(prevLength, nextLength);

        let leftPointer = 0;
        let rightPointer = 0;
        let indexDivergesFromLeft = -1;
        let indexDivergesFromRight = -1;

        while (indexDivergesFromLeft < 0 || indexDivergesFromRight < 0) {
            if (indexDivergesFromLeft < 0) {
                if (prevText[leftPointer] !== nextText[leftPointer]) {
                    indexDivergesFromLeft = leftPointer;
                } else {
                    leftPointer++;
                }
            }

            if (indexDivergesFromRight < 0) {
                const prevIndex = (prevLength - 1) - rightPointer;
                const nextIndex = (nextLength - 1) - rightPointer;

                if (prevText[prevIndex] !== nextText[nextIndex]) {
                    indexDivergesFromRight = rightPointer;
                } else {
                    rightPointer++;
                }
            }
        }

        if (minLength - indexDivergesFromRight <= indexDivergesFromLeft) {
            indexDivergesFromRight = minLength - indexDivergesFromLeft;
        }

        const indices: [number, number] = [indexDivergesFromLeft, indexDivergesFromRight];

        return indices;
    }
}

export default TextDiff;