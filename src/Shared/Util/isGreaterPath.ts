/**
 * Compares two arrays of indices, returning `true` if `pathOne` points
 * to a node at a greater position in the tree.
 */

function isGreaterPath(pathOne: number[], pathTwo: number[]): boolean {
    let index    = 0;
    let valueOne = pathOne[index];
    let valueTwo = pathTwo[index];

    while (typeof valueOne === 'number' && typeof valueTwo === 'number') {
        if (valueOne > valueTwo) {
            return true;
        } else if (valueOne < valueTwo) {
            return false;
        }

        index++;

        valueOne = pathOne[index];
        valueTwo = pathTwo[index];
    }

    return false;
}

export default isGreaterPath;