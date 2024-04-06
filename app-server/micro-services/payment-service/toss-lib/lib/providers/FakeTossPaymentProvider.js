"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeTossPaymentProvider = void 0;
var uuid_1 = require("uuid");
var FakeTossPaymentProvider;
(function (FakeTossPaymentProvider) {
    function get_common_props(input) {
        return {
            mId: "tosspayments",
            version: "1.3",
            paymentKey: (0, uuid_1.v4)(),
            transactionKey: (0, uuid_1.v4)(),
            orderId: input.orderId,
            orderName: "test",
            currency: "KRW",
            totalAmount: input.amount,
            balanceAmount: input.amount,
            suppliedAmount: input.amount,
            taxFreeAmount: 0,
            vat: 0,
            useEscrow: false,
            cultureExpense: false,
            requestedAt: new Date().toISOString(),
            cancels: null,
            cashReceipt: null,
        };
    }
    FakeTossPaymentProvider.get_common_props = get_common_props;
})(FakeTossPaymentProvider || (exports.FakeTossPaymentProvider = FakeTossPaymentProvider = {}));
//# sourceMappingURL=FakeTossPaymentProvider.js.map