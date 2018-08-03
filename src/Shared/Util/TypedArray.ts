abstract class ATypedArray<T> {
    public length: number;

    public map?<U>(_: (value: any, index: number, array: any[]) => U): U[];
    public push?(..._: T[]): number;
}

// @ts-ignore
class TypedArray<T> extends ATypedArray<T> {};

TypedArray.prototype = new Array();

export default TypedArray;