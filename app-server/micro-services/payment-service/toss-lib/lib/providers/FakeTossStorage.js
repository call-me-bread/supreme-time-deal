"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeTossStorage = void 0;
var FakeTossConfiguration_1 = require("../FakeTossConfiguration");
var VolatileMap_1 = require("../utils/VolatileMap");
var FakeTossStorage;
(function (FakeTossStorage) {
    FakeTossStorage.payments = new VolatileMap_1.VolatileMap(FakeTossConfiguration_1.FakeTossConfiguration.EXPIRATION);
    FakeTossStorage.billings = new VolatileMap_1.VolatileMap(FakeTossConfiguration_1.FakeTossConfiguration.EXPIRATION);
    FakeTossStorage.cash_receipts = new VolatileMap_1.VolatileMap(FakeTossConfiguration_1.FakeTossConfiguration.EXPIRATION);
    FakeTossStorage.webhooks = new VolatileMap_1.VolatileMap(FakeTossConfiguration_1.FakeTossConfiguration.EXPIRATION);
})(FakeTossStorage || (exports.FakeTossStorage = FakeTossStorage = {}));
//# sourceMappingURL=FakeTossStorage.js.map