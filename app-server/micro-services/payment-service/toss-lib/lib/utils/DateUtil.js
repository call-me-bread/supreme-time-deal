"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtil = void 0;
var DateUtil;
(function (DateUtil) {
    DateUtil.SECOND = 1000;
    DateUtil.MINUTE = 60 * DateUtil.SECOND;
    DateUtil.HOUR = 60 * DateUtil.MINUTE;
    DateUtil.DAY = 24 * DateUtil.HOUR;
    DateUtil.WEEK = 7 * DateUtil.DAY;
    DateUtil.MONTH = 30 * DateUtil.DAY;
    function to_string(date, hms) {
        if (hms === void 0) { hms = false; }
        var ymd = [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
        ]
            .map(function (value) { return _To_cipher_string(value); })
            .join("-");
        if (hms === false)
            return ymd;
        return ("".concat(ymd, " ") +
            [date.getHours(), date.getMinutes(), date.getSeconds()]
                .map(function (value) { return _To_cipher_string(value); })
                .join(":"));
    }
    DateUtil.to_string = to_string;
    function to_uuid(date) {
        if (date === void 0) { date = new Date(); }
        var elements = [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
        ];
        return (elements.map(function (value) { return _To_cipher_string(value); }).join("") +
            "-" +
            Math.random().toString().substring(4));
    }
    DateUtil.to_uuid = to_uuid;
    function diff(x, y) {
        x = _To_date(x);
        y = _To_date(y);
        // FIRST DIFFERENCES
        var ret = {
            year: x.getFullYear() - y.getFullYear(),
            month: x.getMonth() - y.getMonth(),
            date: x.getDate() - y.getDate(),
        };
        //----
        // HANDLE NEGATIVE ELEMENTS
        //----
        // DATE
        if (ret.date < 0) {
            var last = last_date(y.getFullYear(), y.getMonth());
            --ret.month;
            ret.date = x.getDate() + (last - y.getDate());
        }
        // MONTH
        if (ret.month < 0) {
            --ret.year;
            ret.month = 12 + ret.month;
        }
        return ret;
    }
    DateUtil.diff = diff;
    function last_date(year, month) {
        // LEAP MONTH
        if (month == 1 && year % 4 == 0 && !(year % 100 == 0 && year % 400 != 0))
            return 29;
        else
            return LAST_DATES[month];
    }
    DateUtil.last_date = last_date;
    function add_years(date, value) {
        date = new Date(date);
        date.setFullYear(date.getFullYear() + value);
        return date;
    }
    DateUtil.add_years = add_years;
    function add_months(date, value) {
        date = new Date(date);
        var newYear = date.getFullYear() + Math.floor((date.getMonth() + value) / 12);
        var newMonth = (date.getMonth() + value) % 12;
        var lastDate = last_date(newYear, newMonth - 1);
        if (lastDate < date.getDate())
            date.setDate(lastDate);
        date.setMonth(value - 1);
        return date;
    }
    DateUtil.add_months = add_months;
    function add_days(date, value) {
        date = new Date();
        date.setDate(date.getDate() + value);
        return date;
    }
    DateUtil.add_days = add_days;
    function _To_date(date) {
        if (date instanceof Date)
            return date;
        else
            return new Date(date);
    }
    function _To_cipher_string(val) {
        if (val < 10)
            return "0" + val;
        else
            return String(val);
    }
    var LAST_DATES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
})(DateUtil || (exports.DateUtil = DateUtil = {}));
//# sourceMappingURL=DateUtil.js.map