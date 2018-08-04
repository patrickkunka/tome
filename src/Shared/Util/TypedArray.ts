class TypedArray<T> {
    public length: number;

    public map?<U>(_: (value: any, index: number, array: any[]) => U): U[];
    public push?(..._: T[]): number;
}

TypedArray.prototype = new Array();

export default TypedArray;