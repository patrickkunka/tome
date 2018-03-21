class TypedArray<T> {
    public length: number;

    public map<U>(_: (value: any, index: number, array: any[]) => U): U[] { return []; }
    public push(..._: T[]): number { return 0; }
}

TypedArray.prototype = new Array();

export default TypedArray;