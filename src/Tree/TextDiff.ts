import TextPatchCommand from './TextPatchCommand';

class TextDiff {
    public static diff(prevText: string, nextText: string): TextPatchCommand {
        const command = new TextPatchCommand();

        const [
            indexDivergesFromLeft,
            indexDivergesFromRight
        ] = TextDiff.getDivergentIndices(prevText, nextText);

        command.text = nextText.slice(indexDivergesFromLeft, nextText.length - indexDivergesFromRight);
        command.replaceStart = indexDivergesFromLeft;
        command.replaceCount = (prevText.length - indexDivergesFromRight) - indexDivergesFromLeft;

        return command;
    }

    private static getDivergentIndices(prevText, nextText): [number, number] {
        const prevLength = prevText.length;

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
                const nextIndex = (nextText.length - 1) - rightPointer;

                if (prevText[prevIndex] !== nextText[nextIndex]) {
                    indexDivergesFromRight = rightPointer;
                } else {
                    rightPointer++;
                }
            }
        }

        if (prevLength - indexDivergesFromRight <= indexDivergesFromLeft) {
            const minLength = Math.min(prevLength, nextText.length);

            indexDivergesFromRight = minLength - indexDivergesFromLeft;
        }

        const indices: [number, number] = [indexDivergesFromLeft, indexDivergesFromRight];

        return indices;
    }
}

export default TextDiff;