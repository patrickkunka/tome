import IAnchorData from '../Dom/Interfaces/IAnchorData';
import ActionType  from '../State/Constants/ActionType' ;
import MarkupTag   from '../State/Constants/MarkupTag' ;
import MarkupType  from '../State/Constants/MarkupType';
import IMarkup     from '../State/Interfaces/IMarkup';
import Markup      from '../State/Markup';
import INodeLike   from '../Tome/Interfaces/INodeLike';
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
     * Returns a child node of a provided `INodeLike` based on a provided path.
     */

    public static getNodeByPath<T extends INodeLike>(path: number[], root: T): T {
        let node: T = root;
        let index = -1;
        let i = 0;

        while (typeof (index = path[i]) === 'number') {
            node = node.childNodes[index];

            i++;
        }

        return node || null;
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

    public static getMarkupType(tag: MarkupTag): MarkupType {
        switch (tag) {
            case MarkupTag.H1:
            case MarkupTag.H2:
            case MarkupTag.H3:
            case MarkupTag.H4:
            case MarkupTag.H5:
            case MarkupTag.H6:
            case MarkupTag.OL:
            case MarkupTag.UL:
            case MarkupTag.P:
                return MarkupType.BLOCK;
            case MarkupTag.LI:
                return MarkupType.LIST_ITEM;
            case MarkupTag.TEXT:
                return MarkupType.TEXT;
            case MarkupTag.A:
            case MarkupTag.BR:
            case MarkupTag.CODE:
            case MarkupTag.DEL:
            case MarkupTag.EM:
            case MarkupTag.STRONG:
            case MarkupTag.SUB:
            case MarkupTag.SUP:
                return MarkupType.INLINE;
            default:
                return MarkupType.CUSTOM_BLOCK;
        }
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

            tome.stateManager.applyAction(action);
        };

        callback(handlerAccept);
    }
}

export default Util;