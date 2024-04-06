import { Pair } from "tstl/utility/Pair";
export declare namespace Terminal {
    function execute(...commands: string[]): Promise<Pair<string, string>>;
}
