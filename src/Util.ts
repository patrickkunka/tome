class Util {
    public static extend(target: any, source: any, deep: boolean = false): any {
        let sourceKeys: Array<string|number> = [];

        if (!target || typeof target !== 'object') {
            throw new TypeError('[Util#extend] Target must be a valid object');
        }

        if (Array.isArray(source)) {
            for (let i = 0; i < source.length; i++) {
                sourceKeys.push(i);
            }
        } else if (source) {
            sourceKeys = Object.keys(source);
        }

        for (const key of sourceKeys) {
            const descriptor = Object.getOwnPropertyDescriptor(source, key);

            // Skip computed properties

            if (typeof descriptor.get === 'function') continue;

            if (!deep || typeof source[key] !== 'object') {
                // All non-object primitives, or all properties if
                // shallow extend

                target[key] = source[key];
            } else if (Array.isArray(source[key])) {
                // Arrays

                if (!target[key]) {
                    target[key] = [];
                }

                this.extend(target[key], source[key], deep);
            } else {
                // Objects

                if (!target[key]) {
                    target[key] = {};
                }

                this.extend(target[key], source[key], deep);
            }
        }

        return target;
    }

    public static camelCase(str: string): string {
        return str.toLowerCase()
            .replace(/([_-][a-z0-9])/g, $1 => $1.toUpperCase().replace(/[_-]/, ''));
    }

    public static pascalCase(str: string): string {
        return (str = Util.camelCase(str))
            .charAt(0)
            .toUpperCase() + str.slice(1);
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
}

export default Util;