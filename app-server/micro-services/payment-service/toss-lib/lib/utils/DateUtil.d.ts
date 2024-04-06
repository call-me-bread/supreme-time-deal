export declare namespace DateUtil {
    const SECOND = 1000;
    const MINUTE: number;
    const HOUR: number;
    const DAY: number;
    const WEEK: number;
    const MONTH: number;
    function to_string(date: Date, hms?: boolean): string;
    function to_uuid(date?: Date): string;
    interface IDifference {
        year: number;
        month: number;
        date: number;
    }
    function diff(x: Date | string, y: Date | string): IDifference;
    function last_date(year: number, month: number): number;
    function add_years(date: Date, value: number): Date;
    function add_months(date: Date, value: number): Date;
    function add_days(date: Date, value: number): Date;
}
