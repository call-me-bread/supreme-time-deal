"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeTossModule = void 0;
var common_1 = require("@nestjs/common");
var FakeTossBillingController_1 = require("./controllers/FakeTossBillingController");
var FakeTossCashReceiptsController_1 = require("./controllers/FakeTossCashReceiptsController");
var FakeTossInternalController_1 = require("./controllers/FakeTossInternalController");
var FakeTossPaymentsController_1 = require("./controllers/FakeTossPaymentsController");
var FakeTossVirtualAccountsController_1 = require("./controllers/FakeTossVirtualAccountsController");
var FakeTossModule = /** @class */ (function () {
    function FakeTossModule() {
    }
    FakeTossModule = __decorate([
        (0, common_1.Module)({
            controllers: [
                FakeTossBillingController_1.FakeTossBillingController,
                FakeTossCashReceiptsController_1.FakeTossCashReceiptsController,
                FakeTossInternalController_1.FakeTossInternalController,
                FakeTossPaymentsController_1.FakeTossPaymentsController,
                FakeTossVirtualAccountsController_1.FakeTossVirtualAccountsController,
            ],
        })
    ], FakeTossModule);
    return FakeTossModule;
}());
exports.FakeTossModule = FakeTossModule;
//# sourceMappingURL=FakeTossModule.js.map