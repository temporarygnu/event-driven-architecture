export function init(vector : Array<T>): Array<T> {
    return vector[0];
}

export function last(vector: Array<T>): Array<T> {
    return vector[vector.length];
}


export function join(vector1: Array<T>, vector2: Array<T>): Array<T> {
    return [...vector1, ...vector2];
}