import TextPatchCommand from './TextPatchCommand';

class TextDiff {
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