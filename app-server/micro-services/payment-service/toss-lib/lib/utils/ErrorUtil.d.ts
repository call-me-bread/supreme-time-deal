export declare namespace ErrorUtil {
    function toJSON(err: any): object;
    function log(prefix: string, data: string | object | Error): Promise<void>;
}
