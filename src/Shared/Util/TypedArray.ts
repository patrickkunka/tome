class TypedArray<T> extends Array<T> {
    public length: number;

    public map<U>(_: (value: any, index: number, array: any[]) => U): U[] { return []; }
    public push(..._): number { return 0; }
}

TypedArray.prototype = new Array();

export default TypedArray;