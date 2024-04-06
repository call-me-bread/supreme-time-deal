export declare class VolatileMap<Key, T> {
    readonly expiration: VolatileMap.IExpiration;
    private readonly dict_;
    private readonly timepoints_;
    constructor(expiration: VolatileMap.IExpiration, hasher?: (key: Key) => number, pred?: (x: Key, y: Key) => boolean);
    size(): number;
    get(key: Key): T;
    clear(): void;
    set(key: Key, value: T): void;
    private _Clean_up;
}
export declare namespace VolatileMap {
    interface IExpiration {
        time: number;
        capacity: number;
    }
}
