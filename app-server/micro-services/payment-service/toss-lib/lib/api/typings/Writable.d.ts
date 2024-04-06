/**
 * @packageDocumentation
 * @module api.typings
 */
export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
};
export declare function Writable<T>(elem: Readonly<T>): Writable<T>;
