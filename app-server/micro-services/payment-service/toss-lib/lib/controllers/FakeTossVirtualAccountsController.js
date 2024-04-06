"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.FakeTossVirtualAccountsController = void 0;
var core_1 = __importDefault(require("@nestia/core"));
var common_1 = require("@nestjs/common");
var uuid_1 = require("uuid");
var FakeTossUserAuth_1 = require("../decorators/FakeTossUserAuth");
var FakeTossPaymentProvider_1 = require("../providers/FakeTossPaymentProvider");
var FakeTossStorage_1 = require("../providers/FakeTossStorage");
var FakeTossWebhookProvider_1 = require("../providers/FakeTossWebhookProvider");
var DateUtil_1 = require("../utils/DateUtil");
var FakeTossVirtualAccountsController = /** @class */ (function () {
    function FakeTossVirtualAccountsController() {
    }
    /**
     * 가상 계좌로 결제 신청하기.
     *
     * `virtual_accounts.create` 는 고객이 결제 수단을 가상 계좌로 선택하는 경우에 호출되는
     * API 함수이다. 물론 고객이 이처럼 가상 계좌를 선택한 경우, 고객이 지정된 계좌에 돈을
     * 입금하기 전까지는 결제가 마무리된 것이 아니기에, {@link ITossPayment.status} 값은
     * `WAITING_FOR_DEPOSIT` 이 된다.
     *
     * 참고로 `virtual_accounts.create` 는 클라이언트 어플리케이션이 토스 페이먼츠가
     * 자체적으로 제공하는 결제 창을 사용하는 경우, 귀하의 백엔드 서버가 이를 실 서비스에서
     * 호출하는 일은 없을 것이다. 다만, 고객이 가상 계좌로 결제를 진행하는 상황을
     * 시뮬레이션하기 위하여, 테스트 자동화 프로그램 수준에서 사용될 수는 있다.
     *
     * 그리고 `virtual_accounts.create` 이후에 고객이 지정된 계좌에 금액을 입금하거든, 토스
     * 페이먼츠 서버로부터 웹훅 이벤트가 발생되어 귀하의 백엔드 서버로 전송된다. 만약 연동
     * 대상 토스 페이먼츠 서버가 실제가 아닌 `fake-toss-payments-server` 라면,
     * {@link internal.virtual_accounts.deposit} 를 호출하여, 고객이 가상 계좌에 입금하는
     * 상황을 시뮬레이션 할 수 있다.
     *
     * @param input 가상 결제 신청 정보.
     * @returns 가상 계좌 결제 정보
     *
     * @security basic
     * @author Samchon
     */
    FakeTossVirtualAccountsController.prototype.create = function (_0, input) {
        var payment = __assign(__assign({}, FakeTossPaymentProvider_1.FakeTossPaymentProvider.get_common_props(input)), { method: "가상계좌", type: "NORMAL", status: "WAITING_FOR_DEPOSIT", approvedAt: null, secret: (0, uuid_1.v4)(), virtualAccount: {
                accountNumber: "110417532896",
                accountType: "일반",
                bank: input.bank,
                customerName: input.customerName,
                dueDate: DateUtil_1.DateUtil.to_string(DateUtil_1.DateUtil.add_days(new Date(), 3), false),
                expired: false,
                settlementStatus: "INCOMPLETED",
                refundStatus: "NONE",
            } });
        FakeTossStorage_1.FakeTossStorage.payments.set(payment.paymentKey, payment);
        FakeTossWebhookProvider_1.FakeTossWebhookProvider.webhook({
            eventType: "PAYMENT_STATUS_CHANGED",
            data: {
                paymentKey: payment.paymentKey,
                orderId: payment.orderId,
                status: "WAITING_FOR_DEPOSIT",
            },
        }).catch(function () { });
        return payment;
    };
    __decorate([
        core_1.default.TypedRoute.Post({ type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "string" === typeof input.secret && ("object" === typeof input.virtualAccount && null !== input.virtualAccount && $io1(input.virtualAccount)) && "\uAC00\uC0C1\uACC4\uC88C" === input.method && "NORMAL" === input.type && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && ("number" === typeof input.totalAmount && !Number.isNaN(input.totalAmount)) && ("number" === typeof input.balanceAmount && !Number.isNaN(input.balanceAmount)) && ("number" === typeof input.suppliedAmount && !Number.isNaN(input.suppliedAmount)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && ("number" === typeof input.vat && !Number.isNaN(input.vat)) && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                    var $io1 = function (input) { return "string" === typeof input.accountNumber && ("\uACE0\uC815" === input.accountType || "\uC77C\uBC18" === input.accountType) && "string" === typeof input.bank && "string" === typeof input.customerName && ("string" === typeof input.dueDate && /^(\d{4})-(\d{2})-(\d{2})$/.test(input.dueDate)) && "boolean" === typeof input.expired && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus) && ("COMPLETED" === input.refundStatus || "FAILED" === input.refundStatus || "NONE" === input.refundStatus || "PARTIAL_FAILED" === input.refundStatus || "PENDING" === input.refundStatus); };
                    var $io2 = function (input) { return "number" === typeof input.cancelAmount && !Number.isNaN(input.cancelAmount) && "string" === typeof input.cancelReason && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && ("number" === typeof input.taxAmount && !Number.isNaN(input.taxAmount)) && ("number" === typeof input.refundableAmount && !Number.isNaN(input.refundableAmount)) && ("string" === typeof input.canceledAt && !isNaN(new Date(input.canceledAt).getTime())); };
                    var $io3 = function (input) { return ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type) && ("number" === typeof input.amount && !Number.isNaN(input.amount)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && "string" === typeof input.issueNumber && "string" === typeof input.receiptUrl; };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedRoute.Post.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.secret || $guard(_exceptionable, {
                                path: _path + ".secret",
                                expected: "string",
                                value: input.secret
                            }, errorFactory)) && (("object" === typeof input.virtualAccount && null !== input.virtualAccount || $guard(_exceptionable, {
                                path: _path + ".virtualAccount",
                                expected: "ITossVirtualAccountPayment.IVirtualAccount",
                                value: input.virtualAccount
                            }, errorFactory)) && $ao1(input.virtualAccount, _path + ".virtualAccount", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".virtualAccount",
                                expected: "ITossVirtualAccountPayment.IVirtualAccount",
                                value: input.virtualAccount
                            }, errorFactory)) && ("\uAC00\uC0C1\uACC4\uC88C" === input.method || $guard(_exceptionable, {
                                path: _path + ".method",
                                expected: "\"\uAC00\uC0C1\uACC4\uC88C\"",
                                value: input.method
                            }, errorFactory)) && ("NORMAL" === input.type || $guard(_exceptionable, {
                                path: _path + ".type",
                                expected: "\"NORMAL\"",
                                value: input.type
                            }, errorFactory)) && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status || $guard(_exceptionable, {
                                path: _path + ".status",
                                expected: "(\"ABORTED\" | \"CANCELED\" | \"DONE\" | \"EXPIRED\" | \"IN_PROGRESS\" | \"PARTIAL_CANCELED\" | \"READY\" | \"WAITING_FOR_DEPOSIT\")",
                                value: input.status
                            }, errorFactory)) && ("string" === typeof input.mId || $guard(_exceptionable, {
                                path: _path + ".mId",
                                expected: "string",
                                value: input.mId
                            }, errorFactory)) && ("string" === typeof input.version || $guard(_exceptionable, {
                                path: _path + ".version",
                                expected: "string",
                                value: input.version
                            }, errorFactory)) && ("string" === typeof input.paymentKey || $guard(_exceptionable, {
                                path: _path + ".paymentKey",
                                expected: "string",
                                value: input.paymentKey
                            }, errorFactory)) && ("string" === typeof input.orderId || $guard(_exceptionable, {
                                path: _path + ".orderId",
                                expected: "string",
                                value: input.orderId
                            }, errorFactory)) && ("string" === typeof input.transactionKey || $guard(_exceptionable, {
                                path: _path + ".transactionKey",
                                expected: "string",
                                value: input.transactionKey
                            }, errorFactory)) && ("string" === typeof input.orderName || $guard(_exceptionable, {
                                path: _path + ".orderName",
                                expected: "string",
                                value: input.orderName
                            }, errorFactory)) && ("string" === typeof input.currency || $guard(_exceptionable, {
                                path: _path + ".currency",
                                expected: "string",
                                value: input.currency
                            }, errorFactory)) && ("number" === typeof input.totalAmount && !Number.isNaN(input.totalAmount) || $guard(_exceptionable, {
                                path: _path + ".totalAmount",
                                expected: "number",
                                value: input.totalAmount
                            }, errorFactory)) && ("number" === typeof input.balanceAmount && !Number.isNaN(input.balanceAmount) || $guard(_exceptionable, {
                                path: _path + ".balanceAmount",
                                expected: "number",
                                value: input.balanceAmount
                            }, errorFactory)) && ("number" === typeof input.suppliedAmount && !Number.isNaN(input.suppliedAmount) || $guard(_exceptionable, {
                                path: _path + ".suppliedAmount",
                                expected: "number",
                                value: input.suppliedAmount
                            }, errorFactory)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount) || $guard(_exceptionable, {
                                path: _path + ".taxFreeAmount",
                                expected: "number",
                                value: input.taxFreeAmount
                            }, errorFactory)) && ("number" === typeof input.vat && !Number.isNaN(input.vat) || $guard(_exceptionable, {
                                path: _path + ".vat",
                                expected: "number",
                                value: input.vat
                            }, errorFactory)) && ("boolean" === typeof input.useEscrow || $guard(_exceptionable, {
                                path: _path + ".useEscrow",
                                expected: "boolean",
                                value: input.useEscrow
                            }, errorFactory)) && ("boolean" === typeof input.cultureExpense || $guard(_exceptionable, {
                                path: _path + ".cultureExpense",
                                expected: "boolean",
                                value: input.cultureExpense
                            }, errorFactory)) && ("string" === typeof input.requestedAt && (!isNaN(new Date(input.requestedAt).getTime()) || $guard(_exceptionable, {
                                path: _path + ".requestedAt",
                                expected: "string & Format<\"date-time\">",
                                value: input.requestedAt
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".requestedAt",
                                expected: "(string & Format<\"date-time\">)",
                                value: input.requestedAt
                            }, errorFactory)) && (null === input.approvedAt || "string" === typeof input.approvedAt && (!isNaN(new Date(input.approvedAt).getTime()) || $guard(_exceptionable, {
                                path: _path + ".approvedAt",
                                expected: "string & Format<\"date-time\">",
                                value: input.approvedAt
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".approvedAt",
                                expected: "((string & Format<\"date-time\">) | null)",
                                value: input.approvedAt
                            }, errorFactory)) && (null === input.cancels || (Array.isArray(input.cancels) || $guard(_exceptionable, {
                                path: _path + ".cancels",
                                expected: "(Array<ITossPaymentCancel> | null)",
                                value: input.cancels
                            }, errorFactory)) && input.cancels.every(function (elem, _index1) { return ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index1 + "]",
                                expected: "ITossPaymentCancel",
                                value: elem
                            }, errorFactory)) && $ao2(elem, _path + ".cancels[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index1 + "]",
                                expected: "ITossPaymentCancel",
                                value: elem
                            }, errorFactory); }) || $guard(_exceptionable, {
                                path: _path + ".cancels",
                                expected: "(Array<ITossPaymentCancel> | null)",
                                value: input.cancels
                            }, errorFactory)) && (null === input.cashReceipt || ("object" === typeof input.cashReceipt && null !== input.cashReceipt || $guard(_exceptionable, {
                                path: _path + ".cashReceipt",
                                expected: "(ITossCashReceipt.ISummary | null)",
                                value: input.cashReceipt
                            }, errorFactory)) && $ao3(input.cashReceipt, _path + ".cashReceipt", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".cashReceipt",
                                expected: "(ITossCashReceipt.ISummary | null)",
                                value: input.cashReceipt
                            }, errorFactory));
                        };
                        var $ao1 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.accountNumber || $guard(_exceptionable, {
                                path: _path + ".accountNumber",
                                expected: "string",
                                value: input.accountNumber
                            }, errorFactory)) && ("\uACE0\uC815" === input.accountType || "\uC77C\uBC18" === input.accountType || $guard(_exceptionable, {
                                path: _path + ".accountType",
                                expected: "(\"\uACE0\uC815\" | \"\uC77C\uBC18\")",
                                value: input.accountType
                            }, errorFactory)) && ("string" === typeof input.bank || $guard(_exceptionable, {
                                path: _path + ".bank",
                                expected: "string",
                                value: input.bank
                            }, errorFactory)) && ("string" === typeof input.customerName || $guard(_exceptionable, {
                                path: _path + ".customerName",
                                expected: "string",
                                value: input.customerName
                            }, errorFactory)) && ("string" === typeof input.dueDate && (/^(\d{4})-(\d{2})-(\d{2})$/.test(input.dueDate) || $guard(_exceptionable, {
                                path: _path + ".dueDate",
                                expected: "string & Format<\"date\">",
                                value: input.dueDate
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".dueDate",
                                expected: "(string & Format<\"date\">)",
                                value: input.dueDate
                            }, errorFactory)) && ("boolean" === typeof input.expired || $guard(_exceptionable, {
                                path: _path + ".expired",
                                expected: "boolean",
                                value: input.expired
                            }, errorFactory)) && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus || $guard(_exceptionable, {
                                path: _path + ".settlementStatus",
                                expected: "(\"COMPLETED\" | \"INCOMPLETED\")",
                                value: input.settlementStatus
                            }, errorFactory)) && ("COMPLETED" === input.refundStatus || "FAILED" === input.refundStatus || "NONE" === input.refundStatus || "PARTIAL_FAILED" === input.refundStatus || "PENDING" === input.refundStatus || $guard(_exceptionable, {
                                path: _path + ".refundStatus",
                                expected: "(\"COMPLETED\" | \"FAILED\" | \"NONE\" | \"PARTIAL_FAILED\" | \"PENDING\")",
                                value: input.refundStatus
                            }, errorFactory));
                        };
                        var $ao2 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("number" === typeof input.cancelAmount && !Number.isNaN(input.cancelAmount) || $guard(_exceptionable, {
                                path: _path + ".cancelAmount",
                                expected: "number",
                                value: input.cancelAmount
                            }, errorFactory)) && ("string" === typeof input.cancelReason || $guard(_exceptionable, {
                                path: _path + ".cancelReason",
                                expected: "string",
                                value: input.cancelReason
                            }, errorFactory)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount) || $guard(_exceptionable, {
                                path: _path + ".taxFreeAmount",
                                expected: "number",
                                value: input.taxFreeAmount
                            }, errorFactory)) && ("number" === typeof input.taxAmount && !Number.isNaN(input.taxAmount) || $guard(_exceptionable, {
                                path: _path + ".taxAmount",
                                expected: "number",
                                value: input.taxAmount
                            }, errorFactory)) && ("number" === typeof input.refundableAmount && !Number.isNaN(input.refundableAmount) || $guard(_exceptionable, {
                                path: _path + ".refundableAmount",
                                expected: "number",
                                value: input.refundableAmount
                            }, errorFactory)) && ("string" === typeof input.canceledAt && (!isNaN(new Date(input.canceledAt).getTime()) || $guard(_exceptionable, {
                                path: _path + ".canceledAt",
                                expected: "string & Format<\"date-time\">",
                                value: input.canceledAt
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".canceledAt",
                                expected: "(string & Format<\"date-time\">)",
                                value: input.canceledAt
                            }, errorFactory));
                        };
                        var $ao3 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type || $guard(_exceptionable, {
                                path: _path + ".type",
                                expected: "(\"\uC18C\uB4DD\uACF5\uC81C\" | \"\uC9C0\uCD9C\uC99D\uBE59\")",
                                value: input.type
                            }, errorFactory)) && ("number" === typeof input.amount && !Number.isNaN(input.amount) || $guard(_exceptionable, {
                                path: _path + ".amount",
                                expected: "number",
                                value: input.amount
                            }, errorFactory)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount) || $guard(_exceptionable, {
                                path: _path + ".taxFreeAmount",
                                expected: "number",
                                value: input.taxFreeAmount
                            }, errorFactory)) && ("string" === typeof input.issueNumber || $guard(_exceptionable, {
                                path: _path + ".issueNumber",
                                expected: "string",
                                value: input.issueNumber
                            }, errorFactory)) && ("string" === typeof input.receiptUrl || $guard(_exceptionable, {
                                path: _path + ".receiptUrl",
                                expected: "string",
                                value: input.receiptUrl
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossVirtualAccountPayment",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossVirtualAccountPayment",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            }; var stringify = function (input) {
                var $io1 = function (input) { return "string" === typeof input.accountNumber && ("\uACE0\uC815" === input.accountType || "\uC77C\uBC18" === input.accountType) && "string" === typeof input.bank && "string" === typeof input.customerName && ("string" === typeof input.dueDate && /^(\d{4})-(\d{2})-(\d{2})$/.test(input.dueDate)) && "boolean" === typeof input.expired && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus) && ("COMPLETED" === input.refundStatus || "FAILED" === input.refundStatus || "NONE" === input.refundStatus || "PARTIAL_FAILED" === input.refundStatus || "PENDING" === input.refundStatus); };
                var $io2 = function (input) { return "number" === typeof input.cancelAmount && "string" === typeof input.cancelReason && "number" === typeof input.taxFreeAmount && "number" === typeof input.taxAmount && "number" === typeof input.refundableAmount && ("string" === typeof input.canceledAt && !isNaN(new Date(input.canceledAt).getTime())); };
                var $io3 = function (input) { return ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type) && "number" === typeof input.amount && "number" === typeof input.taxFreeAmount && "string" === typeof input.issueNumber && "string" === typeof input.receiptUrl; };
                var $string = core_1.default.TypedRoute.Post.string;
                var $throws = core_1.default.TypedRoute.Post.throws;
                var $so0 = function (input) { return "{\"secret\":".concat($string(input.secret), ",\"virtualAccount\":").concat($so1(input.virtualAccount), ",\"method\":").concat((function () {
                    if ("string" === typeof input.method)
                        return $string(input.method);
                    if ("string" === typeof input.method)
                        return "\"" + input.method + "\"";
                    $throws({
                        expected: "\"\uAC00\uC0C1\uACC4\uC88C\"",
                        value: input.method
                    });
                })(), ",\"type\":").concat((function () {
                    if ("string" === typeof input.type)
                        return $string(input.type);
                    if ("string" === typeof input.type)
                        return "\"" + input.type + "\"";
                    $throws({
                        expected: "\"NORMAL\"",
                        value: input.type
                    });
                })(), ",\"status\":").concat((function () {
                    if ("string" === typeof input.status)
                        return $string(input.status);
                    if ("string" === typeof input.status)
                        return "\"" + input.status + "\"";
                    $throws({
                        expected: "(\"ABORTED\" | \"CANCELED\" | \"DONE\" | \"EXPIRED\" | \"IN_PROGRESS\" | \"PARTIAL_CANCELED\" | \"READY\" | \"WAITING_FOR_DEPOSIT\")",
                        value: input.status
                    });
                })(), ",\"mId\":").concat($string(input.mId), ",\"version\":").concat($string(input.version), ",\"paymentKey\":").concat($string(input.paymentKey), ",\"orderId\":").concat($string(input.orderId), ",\"transactionKey\":").concat($string(input.transactionKey), ",\"orderName\":").concat($string(input.orderName), ",\"currency\":").concat($string(input.currency), ",\"totalAmount\":").concat(input.totalAmount, ",\"balanceAmount\":").concat(input.balanceAmount, ",\"suppliedAmount\":").concat(input.suppliedAmount, ",\"taxFreeAmount\":").concat(input.taxFreeAmount, ",\"vat\":").concat(input.vat, ",\"useEscrow\":").concat(input.useEscrow, ",\"cultureExpense\":").concat(input.cultureExpense, ",\"requestedAt\":").concat($string(input.requestedAt), ",\"approvedAt\":").concat(null !== input.approvedAt ? $string(input.approvedAt) : "null", ",\"cancels\":").concat(null !== input.cancels ? "[".concat(input.cancels.map(function (elem) { return "{\"cancelAmount\":".concat(elem.cancelAmount, ",\"cancelReason\":").concat($string(elem.cancelReason), ",\"taxFreeAmount\":").concat(elem.taxFreeAmount, ",\"taxAmount\":").concat(elem.taxAmount, ",\"refundableAmount\":").concat(elem.refundableAmount, ",\"canceledAt\":").concat($string(elem.canceledAt), "}"); }).join(","), "]") : "null", ",\"cashReceipt\":").concat(null !== input.cashReceipt ? $so3(input.cashReceipt) : "null", "}"); };
                var $so1 = function (input) { return "{\"accountNumber\":".concat($string(input.accountNumber), ",\"accountType\":").concat((function () {
                    if ("string" === typeof input.accountType)
                        return $string(input.accountType);
                    if ("string" === typeof input.accountType)
                        return "\"" + input.accountType + "\"";
                    $throws({
                        expected: "(\"\uACE0\uC815\" | \"\uC77C\uBC18\")",
                        value: input.accountType
                    });
                })(), ",\"bank\":").concat($string(input.bank), ",\"customerName\":").concat($string(input.customerName), ",\"dueDate\":").concat($string(input.dueDate), ",\"expired\":").concat(input.expired, ",\"settlementStatus\":").concat((function () {
                    if ("string" === typeof input.settlementStatus)
                        return $string(input.settlementStatus);
                    if ("string" === typeof input.settlementStatus)
                        return "\"" + input.settlementStatus + "\"";
                    $throws({
                        expected: "(\"COMPLETED\" | \"INCOMPLETED\")",
                        value: input.settlementStatus
                    });
                })(), ",\"refundStatus\":").concat((function () {
                    if ("string" === typeof input.refundStatus)
                        return $string(input.refundStatus);
                    if ("string" === typeof input.refundStatus)
                        return "\"" + input.refundStatus + "\"";
                    $throws({
                        expected: "(\"COMPLETED\" | \"FAILED\" | \"NONE\" | \"PARTIAL_FAILED\" | \"PENDING\")",
                        value: input.refundStatus
                    });
                })(), "}"); };
                var $so3 = function (input) { return "{\"type\":".concat((function () {
                    if ("string" === typeof input.type)
                        return $string(input.type);
                    if ("string" === typeof input.type)
                        return "\"" + input.type + "\"";
                    $throws({
                        expected: "(\"\uC18C\uB4DD\uACF5\uC81C\" | \"\uC9C0\uCD9C\uC99D\uBE59\")",
                        value: input.type
                    });
                })(), ",\"amount\":").concat(input.amount, ",\"taxFreeAmount\":").concat(input.taxFreeAmount, ",\"issueNumber\":").concat($string(input.issueNumber), ",\"receiptUrl\":").concat($string(input.receiptUrl), "}"); };
                return $so0(input);
            }; return stringify(assert(input, errorFactory)); } }),
        __param(0, (0, FakeTossUserAuth_1.FakeTossUserAuth)()),
        __param(1, core_1.default.TypedBody({ type: "assert", assert: function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "virtual-account" === input.method && "string" === typeof input.orderId && "string" === typeof input.orderName && "string" === typeof input.bank && "string" === typeof input.customerName && "number" === typeof input.amount && (undefined === input.__approved || "boolean" === typeof input.__approved); };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedBody.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("virtual-account" === input.method || $guard(_exceptionable, {
                                path: _path + ".method",
                                expected: "\"virtual-account\"",
                                value: input.method
                            }, errorFactory)) && ("string" === typeof input.orderId || $guard(_exceptionable, {
                                path: _path + ".orderId",
                                expected: "string",
                                value: input.orderId
                            }, errorFactory)) && ("string" === typeof input.orderName || $guard(_exceptionable, {
                                path: _path + ".orderName",
                                expected: "string",
                                value: input.orderName
                            }, errorFactory)) && ("string" === typeof input.bank || $guard(_exceptionable, {
                                path: _path + ".bank",
                                expected: "string",
                                value: input.bank
                            }, errorFactory)) && ("string" === typeof input.customerName || $guard(_exceptionable, {
                                path: _path + ".customerName",
                                expected: "string",
                                value: input.customerName
                            }, errorFactory)) && ("number" === typeof input.amount || $guard(_exceptionable, {
                                path: _path + ".amount",
                                expected: "number",
                                value: input.amount
                            }, errorFactory)) && (undefined === input.__approved || "boolean" === typeof input.__approved || $guard(_exceptionable, {
                                path: _path + ".__approved",
                                expected: "(boolean | undefined)",
                                value: input.__approved
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossVirtualAccountPayment.ICreate",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossVirtualAccountPayment.ICreate",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            } })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [void 0, Object]),
        __metadata("design:returntype", Object)
    ], FakeTossVirtualAccountsController.prototype, "create", null);
    FakeTossVirtualAccountsController = __decorate([
        (0, common_1.Controller)("v1/virtual-accounts")
    ], FakeTossVirtualAccountsController);
    return FakeTossVirtualAccountsController;
}());
exports.FakeTossVirtualAccountsController = FakeTossVirtualAccountsController;
//# sourceMappingURL=FakeTossVirtualAccountsController.js.map