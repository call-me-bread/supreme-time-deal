"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolatileMap = void 0;
var HashMap_1 = require("tstl/container/HashMap");
var TreeMap_1 = require("tstl/container/TreeMap");
var comparators_1 = require("tstl/functional/comparators");
var hash_1 = require("tstl/functional/hash");
var VolatileMap = /** @class */ (function () {
    function VolatileMap(expiration, hasher, pred) {
        if (hasher === void 0) { hasher = hash_1.hash; }
        if (pred === void 0) { pred = comparators_1.equal_to; }
        this.expiration = expiration;
        this.dict_ = new HashMap_1.HashMap(hasher, pred);
        this.timepoints_ = new TreeMap_1.TreeMap();
    }
    VolatileMap.prototype.size = function () {
        return this.dict_.size();
    };
    VolatileMap.prototype.get = function (key) {
        return this.dict_.get(key);
    };
    VolatileMap.prototype.clear = function () {
        this.dict_.clear();
        this.timepoints_.clear();
    };
    VolatileMap.prototype.set = function (key, value) {
        this._Clean_up();
        this.dict_.set(key, value);
        this.timepoints_.set(Date.now(), key);
    };
    VolatileMap.prototype._Clean_up = function () {
        var bound = Date.now() - this.expiration.time;
        var last = this.timepoints_.upper_bound(bound);
        for (var it = this.timepoints_.begin(); it.equals(last) === false;) {
            this.dict_.erase(it.second);
            it = this.timepoints_.erase(it);
        }
        if (this.timepoints_.size() < this.expiration.capacity)
            return;
        var left = this.timepoints_.size() - this.expiration.capacity;
        while (left-- === 0) {
            var it = this.timepoints_.begin();
            this.dict_.erase(it.second);
            this.timepoints_.erase(it);
        }
    };
    return VolatileMap;
}());
exports.VolatileMap = VolatileMap;
//# sourceMappingURL=VolatileMap.js.map