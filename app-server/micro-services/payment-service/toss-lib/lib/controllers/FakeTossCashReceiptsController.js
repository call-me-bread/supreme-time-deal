"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeTossCashReceiptsController = void 0;
var core_1 = __importDefault(require("@nestia/core"));
var common_1 = require("@nestjs/common");
var uuid_1 = require("uuid");
var FakeTossUserAuth_1 = require("../decorators/FakeTossUserAuth");
var FakeTossStorage_1 = require("../providers/FakeTossStorage");
var FakeTossCashReceiptsController = /** @class */ (function () {
    function FakeTossCashReceiptsController() {
    }
    /**
     * 현금 영수증 발행하기.
     *
     * @param input 입력 정보
     * @returns 현금 영수증 정보
     *
     * @security basic
     * @author Samchon
     */
    FakeTossCashReceiptsController.prototype.create = function (_0, input) {
        // CHECK PAYMENT
        var payment = FakeTossStorage_1.FakeTossStorage.payments.get(input.paymentKey);
        if (payment.orderId !== input.orderId)
            throw new common_1.NotFoundException("Wrong orderId");
        else if (payment.cashReceipt !== null)
            throw new common_1.UnprocessableEntityException("Duplicated cash receipt exists.");
        else if (payment.totalAmount < input.amount)
            throw new common_1.UnprocessableEntityException("Input amount is greater than its payment.");
        // CONSTRUCT
        var receipt = {
            orderId: input.orderId,
            orderName: input.orderName,
            type: input.type,
            receiptKey: (0, uuid_1.v4)(),
            approvalNumber: (0, uuid_1.v4)(),
            approvedAt: new Date().toISOString(),
            canceledAt: null,
            receiptUrl: "https://github.com/samchon/fake-toss-payments-server",
            __paymentKey: payment.paymentKey,
        };
        FakeTossStorage_1.FakeTossStorage.cash_receipts.set(receipt.receiptKey, receipt);
        payment.cashReceipt = {
            type: receipt.type,
            amount: input.amount,
            taxFreeAmount: input.taxFreeAmount || 0,
            issueNumber: receipt.approvalNumber,
            receiptUrl: receipt.receiptUrl,
        };
        // RETURNS
        return receipt;
    };
    /**
     * 현금 영수증 취소하기.
     *
     * @param receiptKey 현금 영수증의 {@link ITossCashReceipt.receiptKey}
     * @param input 취소 입력 정보
     * @returns 취소된 현금 영수증 정보
     *
     * @security basic
     * @author Samchon
     */
    FakeTossCashReceiptsController.prototype.cancel = function (_0, receiptKey, input) {
        input;
        // GET RECORDS
        var receipt = FakeTossStorage_1.FakeTossStorage.cash_receipts.get(receiptKey);
        var payment = FakeTossStorage_1.FakeTossStorage.payments.get(receipt.__paymentKey);
        // CHANGE
        receipt.canceledAt = new Date().toISOString();
        payment.cashReceipt = null;
        return receipt;
    };
    __decorate([
        core_1.default.TypedRoute.Post({ type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "string" === typeof input.receiptKey && ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type) && "string" === typeof input.orderId && "string" === typeof input.orderName && "string" === typeof input.approvalNumber && ("string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.canceledAt || "string" === typeof input.canceledAt && !isNaN(new Date(input.canceledAt).getTime())) && "string" === typeof input.receiptUrl; };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedRoute.Post.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.receiptKey || $guard(_exceptionable, {
                                path: _path + ".receiptKey",
                                expected: "string",
                                value: input.receiptKey
                            }, errorFactory)) && ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type || $guard(_exceptionable, {
                                path: _path + ".type",
                                expected: "(\"\uC18C\uB4DD\uACF5\uC81C\" | \"\uC9C0\uCD9C\uC99D\uBE59\")",
                                value: input.type
                            }, errorFactory)) && ("string" === typeof input.orderId || $guard(_exceptionable, {
                                path: _path + ".orderId",
                                expected: "string",
                                value: input.orderId
                            }, errorFactory)) && ("string" === typeof input.orderName || $guard(_exceptionable, {
                                path: _path + ".orderName",
                                expected: "string",
                                value: input.orderName
                            }, errorFactory)) && ("string" === typeof input.approvalNumber || $guard(_exceptionable, {
                                path: _path + ".approvalNumber",
                                expected: "string",
                                value: input.approvalNumber
                            }, errorFactory)) && ("string" === typeof input.approvedAt && (!isNaN(new Date(input.approvedAt).getTime()) || $guard(_exceptionable, {
                                path: _path + ".approvedAt",
                                expected: "string & Format<\"date-time\">",
                                value: input.approvedAt
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".approvedAt",
                                expected: "(string & Format<\"date-time\">)",
                                value: input.approvedAt
                            }, errorFactory)) && (null === input.canceledAt || "string" === typeof input.canceledAt && (!isNaN(new Date(input.canceledAt).getTime()) || $guard(_exceptionable, {
                                path: _path + ".canceledAt",
                                expected: "string & Format<\"date-time\">",
                                value: input.canceledAt
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".canceledAt",
                                expected: "((string & Format<\"date-time\">) | null)",
                                value: input.canceledAt
                            }, errorFactory)) && ("string" === typeof input.receiptUrl || $guard(_exceptionable, {
                                path: _path + ".receiptUrl",
                                expected: "string",
                                value: input.receiptUrl
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossCashReceipt",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossCashReceipt",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            }; var stringify = function (input) {
                var $string = core_1.default.TypedRoute.Post.string;
                var $throws = core_1.default.TypedRoute.Post.throws;
                var $so0 = function (input) { return "{\"receiptKey\":".concat($string(input.receiptKey), ",\"type\":").concat((function () {
                    if ("string" === typeof input.type)
                        return $string(input.type);
                    if ("string" === typeof input.type)
                        return "\"" + input.type + "\"";
                    $throws({
                        expected: "(\"\uC18C\uB4DD\uACF5\uC81C\" | \"\uC9C0\uCD9C\uC99D\uBE59\")",
                        value: input.type
                    });
                })(), ",\"orderId\":").concat($string(input.orderId), ",\"orderName\":").concat($string(input.orderName), ",\"approvalNumber\":").concat($string(input.approvalNumber), ",\"approvedAt\":").concat($string(input.approvedAt), ",\"canceledAt\":").concat(null !== input.canceledAt ? $string(input.canceledAt) : "null", ",\"receiptUrl\":").concat($string(input.receiptUrl), "}"); };
                return $so0(input);
            }; return stringify(assert(input, errorFactory)); } }),
        __param(0, (0, FakeTossUserAuth_1.FakeTossUserAuth)()),
        __param(1, core_1.default.TypedBody({ type: "assert", assert: function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type) && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.orderName && "string" === typeof input.registrationNumber && "number" === typeof input.amount && (undefined === input.taxFreeAmount || "number" === typeof input.taxFreeAmount) && (undefined === input.businessNumber || "string" === typeof input.businessNumber); };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedBody.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type || $guard(_exceptionable, {
                                path: _path + ".type",
                                expected: "(\"\uC18C\uB4DD\uACF5\uC81C\" | \"\uC9C0\uCD9C\uC99D\uBE59\")",
                                value: input.type
                            }, errorFactory)) && ("string" === typeof input.paymentKey || $guard(_exceptionable, {
                                path: _path + ".paymentKey",
                                expected: "string",
                                value: input.paymentKey
                            }, errorFactory)) && ("string" === typeof input.orderId || $guard(_exceptionable, {
                                path: _path + ".orderId",
                                expected: "string",
                                value: input.orderId
                            }, errorFactory)) && ("string" === typeof input.orderName || $guard(_exceptionable, {
                                path: _path + ".orderName",
                                expected: "string",
                                value: input.orderName
                            }, errorFactory)) && ("string" === typeof input.registrationNumber || $guard(_exceptionable, {
                                path: _path + ".registrationNumber",
                                expected: "string",
                                value: input.registrationNumber
                            }, errorFactory)) && ("number" === typeof input.amount || $guard(_exceptionable, {
                                path: _path + ".amount",
                                expected: "number",
                                value: input.amount
                            }, errorFactory)) && (undefined === input.taxFreeAmount || "number" === typeof input.taxFreeAmount || $guard(_exceptionable, {
                                path: _path + ".taxFreeAmount",
                                expected: "(number | undefined)",
                                value: input.taxFreeAmount
                            }, errorFactory)) && (undefined === input.businessNumber || "string" === typeof input.businessNumber || $guard(_exceptionable, {
                                path: _path + ".businessNumber",
                                expected: "(string | undefined)",
                                value: input.businessNumber
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossCashReceipt.ICreate",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossCashReceipt.ICreate",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            } })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [void 0, Object]),
        __metadata("design:returntype", Object)
    ], FakeTossCashReceiptsController.prototype, "create", null);
    __decorate([
        core_1.default.TypedRoute.Post(":receiptKey/cancel", { type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "string" === typeof input.receiptKey && ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type) && "string" === typeof input.orderId && "string" === typeof input.orderName && "string" === typeof input.approvalNumber && ("string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.canceledAt || "string" === typeof input.canceledAt && !isNaN(new Date(input.canceledAt).getTime())) && "string" === typeof input.receiptUrl; };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedRoute.Post.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.receiptKey || $guard(_exceptionable, {
                                path: _path + ".receiptKey",
                                expected: "string",
                                value: input.receiptKey
                            }, errorFactory)) && ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type || $guard(_exceptionable, {
                                path: _path + ".type",
                                expected: "(\"\uC18C\uB4DD\uACF5\uC81C\" | \"\uC9C0\uCD9C\uC99D\uBE59\")",
                                value: input.type
                            }, errorFactory)) && ("string" === typeof input.orderId || $guard(_exceptionable, {
                                path: _path + ".orderId",
                                expected: "string",
                                value: input.orderId
                            }, errorFactory)) && ("string" === typeof input.orderName || $guard(_exceptionable, {
                                path: _path + ".orderName",
                                expected: "string",
                                value: input.orderName
                            }, errorFactory)) && ("string" === typeof input.approvalNumber || $guard(_exceptionable, {
                                path: _path + ".approvalNumber",
                                expected: "string",
                                value: input.approvalNumber
                            }, errorFactory)) && ("string" === typeof input.approvedAt && (!isNaN(new Date(input.approvedAt).getTime()) || $guard(_exceptionable, {
                                path: _path + ".approvedAt",
                                expected: "string & Format<\"date-time\">",
                                value: input.approvedAt
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".approvedAt",
                                expected: "(string & Format<\"date-time\">)",
                                value: input.approvedAt
                            }, errorFactory)) && (null === input.canceledAt || "string" === typeof input.canceledAt && (!isNaN(new Date(input.canceledAt).getTime()) || $guard(_exceptionable, {
                                path: _path + ".canceledAt",
                                expected: "string & Format<\"date-time\">",
                                value: input.canceledAt
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".canceledAt",
                                expected: "((string & Format<\"date-time\">) | null)",
                                value: input.canceledAt
                            }, errorFactory)) && ("string" === typeof input.receiptUrl || $guard(_exceptionable, {
                                path: _path + ".receiptUrl",
                                expected: "string",
                                value: input.receiptUrl
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossCashReceipt",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossCashReceipt",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            }; var stringify = function (input) {
                var $string = core_1.default.TypedRoute.Post.string;
                var $throws = core_1.default.TypedRoute.Post.throws;
                var $so0 = function (input) { return "{\"receiptKey\":".concat($string(input.receiptKey), ",\"type\":").concat((function () {
                    if ("string" === typeof input.type)
                        return $string(input.type);
                    if ("string" === typeof input.type)
                        return "\"" + input.type + "\"";
                    $throws({
                        expected: "(\"\uC18C\uB4DD\uACF5\uC81C\" | \"\uC9C0\uCD9C\uC99D\uBE59\")",
                        value: input.type
                    });
                })(), ",\"orderId\":").concat($string(input.orderId), ",\"orderName\":").concat($string(input.orderName), ",\"approvalNumber\":").concat($string(input.approvalNumber), ",\"approvedAt\":").concat($string(input.approvedAt), ",\"canceledAt\":").concat(null !== input.canceledAt ? $string(input.canceledAt) : "null", ",\"receiptUrl\":").concat($string(input.receiptUrl), "}"); };
                return $so0(input);
            }; return stringify(assert(input, errorFactory)); } }),
        __param(0, (0, FakeTossUserAuth_1.FakeTossUserAuth)()),
        __param(1, core_1.default.TypedParam("receiptKey", function (input) {
            var $string = core_1.default.TypedParam.string;
            var assert = function (input, errorFactory) {
                var __is = function (input) {
                    return "string" === typeof input;
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedParam.guard;
                        return "string" === typeof input || $guard(true, {
                            path: _path + "",
                            expected: "string",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            };
            var value = $string(input);
            return assert(value);
        })),
        __param(2, core_1.default.TypedBody({ type: "assert", assert: function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return undefined === input.amount || "number" === typeof input.amount; };
                    return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedBody.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return undefined === input.amount || "number" === typeof input.amount || $guard(_exceptionable, {
                                path: _path + ".amount",
                                expected: "(number | undefined)",
                                value: input.amount
                            }, errorFactory);
                        };
                        return ("object" === typeof input && null !== input && false === Array.isArray(input) || $guard(true, {
                            path: _path + "",
                            expected: "ITossCashReceipt.ICancel",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossCashReceipt.ICancel",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            } })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [void 0, String, Object]),
        __metadata("design:returntype", Object)
    ], FakeTossCashReceiptsController.prototype, "cancel", null);
    FakeTossCashReceiptsController = __decorate([
        (0, common_1.Controller)("v1/cash-receipts")
    ], FakeTossCashReceiptsController);
    return FakeTossCashReceiptsController;
}());
exports.FakeTossCashReceiptsController = FakeTossCashReceiptsController;
//# sourceMappingURL=FakeTossCashReceiptsController.js.map