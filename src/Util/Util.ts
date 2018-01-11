import IAnchorData from '../Dom/Interfaces/IAnchorData';
import ActionType  from '../State/Constants/ActionType' ;
import MarkupTag   from '../State/Constants/MarkupTag' ;
import MarkupType  from '../State/Constants/MarkupType';
import IMarkup     from '../State/Interfaces/IMarkup';
import Markup      from '../State/Markup';
import ITome       from '../Tome/Interfaces/ITome';

class Util {
    /**
     * Converts a dash or snake-case string to camel case.
     */

    public static camelCase(str: string): string {
        return str.toLowerCase()
            .replace(/([_-][a-z0-9])/g, $1 => $1.toUpperCase().replace(/[_-]/, ''));
    }

    /**
     * Converts a camel, dash or snake-case string to pascal case.
     */

    public static pascalCase(str: string): string {
        return (str = (str.match(/[_-]/) ? Util.camelCase(str) : str))
            .charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Compares two arrays of indices, returning `true` if `pathOne` points
     * to a node at a greater position in the tree.
     */

    public static isGreaterPath(pathOne: number[], pathTwo: number[]): boolean {
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

    public static index(node: Node, includeNonElements: boolean = false): number {
        const previousSiblingType = includeNonElements ? 'previousSibling' : 'previousElementSibling';

        let index = 0;

        while ((node = node[previousSiblingType]) !== null) {
            index++;
        }

        return index;
    }

    public static getMarkupType(tag: MarkupTag) {
        return [
            MarkupTag.H1,
            MarkupTag.H2,
            MarkupTag.H3,
            MarkupTag.H4,
            MarkupTag.H5,
            MarkupTag.H6,
            MarkupTag.P
        ].indexOf(tag) > -1 ? MarkupType.BLOCK : MarkupType.INLINE;
    }

    public static mapMarkupToArray(markup: Markup): IMarkup {
        return markup.toArray();
    }

    public static addInlineLink(tome: ITome): void {
        const callback = tome.config.callbacks.onAddAnchor;

        if (typeof callback !== 'function') {
            throw new TypeError('[Tome] No `onAddAnchor` callback function provided');
        }

        const handlerAccept = (data: IAnchorData) => {
            const action = {type: ActionType.TOGGLE_INLINE, tag: MarkupTag.A, data};

            tome.applyAction(action);
        };

        callback(handlerAccept);
    }
}

export default Util;