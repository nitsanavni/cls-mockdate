(function (name, definition) {
    if (typeof module !== 'undefined') module.exports = definition();
    else if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
    else this[name] = definition();
}('MockDate', function () {
    var _ = require("lodash");
    "use strict";

    var _Date = Date
        , _getTimezoneOffset = Date.prototype.getTimezoneOffset
        , now = null
    ;

    var _cls;

    function MockDate(y, m, d, h, M, s, ms) {
        var date;

        switch (arguments.length) {
            case 0:
                if (!_.isNil(_cls) && !_.isNil(_cls.get("mockdate"))) {
                    date = new _Date(_cls.get("mockdate"));
                }
                else if (now !== null) {
                    date = new _Date(now);
                } else {
                    date = new _Date();
                }
                break;

            case 1:
                date = new _Date(y);
                break;

            default:
                d = d || 1;
                h = h || 0;
                M = M || 0;
                s = s || 0;
                ms = ms || 0;
                date = new _Date(y, m, d, h, M, s, ms);
                break;
        }

        return date;
    }

    MockDate.UTC = _Date.UTC;

    MockDate.now = function () {
        return new MockDate().valueOf();
    };

    MockDate.parse = function (dateString) {
        return _Date.parse(dateString);
    };

    MockDate.toString = function () {
        return _Date.toString();
    };

    MockDate.prototype = _Date.prototype;

    function set(date, timezoneOffset) {
        var dateObj = new Date(date)
        if (isNaN(dateObj.getTime())) {
            throw new TypeError('mockdate: The time set is an invalid date: ' + date)
        }

        if (typeof timezoneOffset === 'number') {
            MockDate.prototype.getTimezoneOffset = function () {
                return timezoneOffset;
            }
        }

        Date = MockDate;
        if (date.valueOf) {
            date = date.valueOf();
        }

        now = dateObj.valueOf();
    }

    function reset() {
        Date = _Date;
        Date.prototype.getTimezoneOffset = _getTimezoneOffset
        _cls = null;
        now = null;
    }

    function cls(cls) {
        _cls = cls;
        Date = MockDate;
    }

    return {
        cls: cls,
        set: set,
        reset: reset
    };

}));
