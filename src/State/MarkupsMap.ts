import MarkupTag from './Constants/MarkupTag';
import Markup from './Markup';

/**
 * A hash-table-like object for describing the active inline-markups for
 * a particular selection.
 */

class MarkupsMap {
    /**
     * A list of tags representing any active overrides.
     */

    public overrides: MarkupTag[] = [];

    private map: {
        [tag: string]: Markup[];
    } = {};

    /**
     * Retrieves the active tags, removing any active tags which are overriden,
     * and adding any inactive tags which are overriden.
     */

    public get tags() {
        const keys = Object.keys(this.map);

        for (const toggle of this.overrides) {
            let removeAt: number;

            if ((removeAt = keys.indexOf(toggle)) > -1) {
                keys.splice(removeAt, 1);
            } else {
                keys.push(toggle);
            }
        }

        return keys;
    }

    /**
     * Adds one or more markups to the internal map, using the markup's tag as its key.
     *
     * If the tag does not exist, an empty array is initialsed and the markup is
     * pushed in. If the tag does exist, the markup is pushed into the existing
     * array.
     */

    public add(...markups: Markup[]) {
        for (const markup of markups) {
            if (typeof this.map[markup.tag] === 'undefined') this.map[markup.tag] = [];

            this.map[markup.tag].push(markup);
        }
    }

    /**
     * Retrieves the last active markup for a provided tag, or `null` if the tag
     * is not active.
     */

    public lastOfTag(tag: MarkupTag): Markup {
        let list: Markup[];

        if ((list = this.map[tag]) && list.length > 0) return list[list.length - 1];

        return null;
    }

    /**
     * Retrieves all active markups for a provided tag.
     */

    public allOfTag(tag: MarkupTag): Markup[] {
        let list: Markup[];

        if ((list = this.map[tag]) && list.length > 0) return list;

        return [];
    }

    /**
     * Empties the markup array for the provided tag, if one exists.
     */

    public clearTag(tag: MarkupTag): void {
        let list: Markup[];

        if ((list = this.map[tag]) && list.length > 0) list.length = 0;
    }

    /**
     * Empties the internal map by overriding it with a new map.
     */

    public clearAll(): void {
        this.map = {};
    }
}

export default MarkupsMap;