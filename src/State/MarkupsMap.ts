import MarkupTag from './Constants/MarkupTag';
import Markup from './Markup';

class MarkupsMap {
    private map: {
        [tag: string]: Markup[];
    } = {};

    public add(...markups: Markup[]) {
        for (const markup of markups) {
            if (typeof this.map[markup.tag] === 'undefined') this.map[markup.tag] = [];

            this.map[markup.tag].push(markup);
        }
    }

    public lastOfTag(tag: MarkupTag): Markup {
        let list: Markup[];

        if ((list = this.map[tag]) && list.length > 0) return list[list.length - 1];

        return null;
    }

    public allOfTag(tag: MarkupTag): Markup[] {
        let list: Markup[];

        if ((list = this.map[tag]) && list.length > 0) return list;

        return [];
    }

    public clearTag(tag: MarkupTag): void {
        let list: Markup[];

        if ((list = this.map[tag]) && list.length > 0) list.length = 0;
    }

    public clearAll(): void {
        this.map = {};
    }
}

export default MarkupsMap;