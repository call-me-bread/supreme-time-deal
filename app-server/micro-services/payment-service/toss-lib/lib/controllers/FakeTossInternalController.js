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
exports.FakeTossInternalController = void 0;
var core_1 = __importDefault(require("@nestia/core"));
var common_1 = require("@nestjs/common");
var FakeTossUserAuth_1 = require("../decorators/FakeTossUserAuth");
var FakeTossStorage_1 = require("../providers/FakeTossStorage");
var FakeTossWebhookProvider_1 = require("../providers/FakeTossWebhookProvider");
var FakeTossInternalController = /** @class */ (function () {
    function FakeTossInternalController() {
    }
    /**
     * 웹훅 이벤트 더미 리스너.
     *
     * `internal.webhook` 은 실제 토스 페이먼츠의 결제 서버에는 존재하지 않는 API 로써,
     * `fake-toss-payments-server` 의 {@link Configuration.WEBHOOK_URL} 에 아무런 URL 을
     * 설정하지 않으면, `fake-toss-payments-server` 로부터 발생하는 모든 종류의 웹훅
     * 이벤트는 이 곳으로 전달되어 무의미하게 사라진다.
     *
     * 따라서 `fake-toss-payments-server` 를 사용하여 토스 페이먼츠 서버와의 연동을 미리
     * 검증코자 할 때는, 반드시 {@link Configuration.WEBHOOK_URL} 를 설정하여 웹훅
     * 이벤트가 귀하의 백엔드 서버로 제대로 전달되도록 하자.
     *
     * @param input 웹훅 이벤트 정보
     * @author Samchon
     */
    FakeTossInternalController.prototype.webhook = function (input) {
        var payment = FakeTossStorage_1.FakeTossStorage.payments.get(input.data.paymentKey);
        payment.status = input.data.status;
        FakeTossStorage_1.FakeTossStorage.webhooks.set(input.data.paymentKey, input);
    };
    /**
     * 가상 계좌에 입금하기.
     *
     * `internal.virtual_accounts.deposit` 은 실제 토스 페이먼츠의 결제 서버에는 존재하지
     * 않는 API 로써, 가상 계좌 결제를 신청한 고객이, 이후 가상 계좌에 목표 금액을 입금하는
     * 상황을 시뮬레이션할 수 있는 함수이다.
     *
     * 즉 `internal.virtual_accounts.deposit` 는 고객이 스스로에게 가상으로 발급된 계좌에
     * 입금을 하고, 그에 따라 토스 페이먼츠 서버에서 webhook 이벤트가 발생하여 이를 귀하의
     * 백엔드 서버로 전송하는 일련의 상황을 테스트하기 위한 함수인 셈이다.
     *
     * @param paymentKey 대상 가상 계좌 결제 정보의 {@link ITossPayment.paymentKey}
     * @returns 입금 완료된 가상 꼐좌 결제 정보
     *
     * @security basic
     * @author Samchon
     */
    FakeTossInternalController.prototype.deposit = function (_0, paymentKey) {
        var payment = FakeTossStorage_1.FakeTossStorage.payments.get(paymentKey);
        if (payment.method !== "가상계좌")
            throw new common_1.UnprocessableEntityException("Invalid target.");
        payment.virtualAccount.settlementStatus = "COMPLETED";
        payment.approvedAt = new Date().toString();
        payment.status = "DONE";
        FakeTossWebhookProvider_1.FakeTossWebhookProvider.webhook({
            eventType: "PAYMENT_STATUS_CHANGED",
            data: {
                paymentKey: payment.paymentKey,
                orderId: payment.orderId,
                status: "DONE",
            },
        }).catch(function () { });
        return payment;
    };
    __decorate([
        core_1.default.TypedRoute.Post("webhook", { type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
                var __is = function (input) {
                    return null !== input && undefined === input;
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedRoute.Post.guard;
                        return (null !== input || $guard(true, {
                            path: _path + "",
                            expected: "undefined",
                            value: input
                        }, errorFactory)) && (undefined === input || $guard(true, {
                            path: _path + "",
                            expected: "undefined",
                            value: input
                        }, errorFactory));
                    })(input, "$input", true);
                return input;
            }; var stringify = function (input) {
                return undefined;
            }; return stringify(assert(input, errorFactory)); } }),
        __param(0, core_1.default.TypedBody({ type: "assert", assert: function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "PAYMENT_STATUS_CHANGED" === input.eventType && ("object" === typeof input.data && null !== input.data && $io1(input.data)); };
                    var $io1 = function (input) { return "string" === typeof input.paymentKey && "string" === typeof input.orderId && ("CANCELED" === input.status || "DONE" === input.status || "PARTIAL_CANCELED" === input.status || "WAITING_FOR_DEPOSIT" === input.status); };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedBody.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("PAYMENT_STATUS_CHANGED" === input.eventType || $guard(_exceptionable, {
                                path: _path + ".eventType",
                                expected: "\"PAYMENT_STATUS_CHANGED\"",
                                value: input.eventType
                            }, errorFactory)) && (("object" === typeof input.data && null !== input.data || $guard(_exceptionable, {
                                path: _path + ".data",
                                expected: "ITossPaymentWebhook.IData",
                                value: input.data
                            }, errorFactory)) && $ao1(input.data, _path + ".data", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".data",
                                expected: "ITossPaymentWebhook.IData",
                                value: input.data
                            }, errorFactory));
                        };
                        var $ao1 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.paymentKey || $guard(_exceptionable, {
                                path: _path + ".paymentKey",
                                expected: "string",
                                value: input.paymentKey
                            }, errorFactory)) && ("string" === typeof input.orderId || $guard(_exceptionable, {
                                path: _path + ".orderId",
                                expected: "string",
                                value: input.orderId
                            }, errorFactory)) && ("CANCELED" === input.status || "DONE" === input.status || "PARTIAL_CANCELED" === input.status || "WAITING_FOR_DEPOSIT" === input.status || $guard(_exceptionable, {
                                path: _path + ".status",
                                expected: "(\"CANCELED\" | \"DONE\" | \"PARTIAL_CANCELED\" | \"WAITING_FOR_DEPOSIT\")",
                                value: input.status
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossPaymentWebhook",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossPaymentWebhook",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            } })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FakeTossInternalController.prototype, "webhook", null);
    __decorate([
        core_1.default.TypedRoute.Put(":paymentKey/deposit", { type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "object" === typeof input.giftCertificate && null !== input.giftCertificate && $io1(input.giftCertificate) && "\uC0C1\uD488\uAD8C" === input.method && "NORMAL" === input.type && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && ("number" === typeof input.totalAmount && !Number.isNaN(input.totalAmount)) && ("number" === typeof input.balanceAmount && !Number.isNaN(input.balanceAmount)) && ("number" === typeof input.suppliedAmount && !Number.isNaN(input.suppliedAmount)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && ("number" === typeof input.vat && !Number.isNaN(input.vat)) && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                    var $io1 = function (input) { return "string" === typeof input.approveNo && ("COMPLETE" === input.settlementStatus || "INCOMPLETE" === input.settlementStatus); };
                    var $io2 = function (input) { return "number" === typeof input.cancelAmount && !Number.isNaN(input.cancelAmount) && "string" === typeof input.cancelReason && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && ("number" === typeof input.taxAmount && !Number.isNaN(input.taxAmount)) && ("number" === typeof input.refundableAmount && !Number.isNaN(input.refundableAmount)) && ("string" === typeof input.canceledAt && !isNaN(new Date(input.canceledAt).getTime())); };
                    var $io3 = function (input) { return ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type) && ("number" === typeof input.amount && !Number.isNaN(input.amount)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && "string" === typeof input.issueNumber && "string" === typeof input.receiptUrl; };
                    var $io4 = function (input) { return "object" === typeof input.mobilePhone && null !== input.mobilePhone && $io5(input.mobilePhone) && "\uD734\uB300\uD3F0" === input.method && "NORMAL" === input.type && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && ("number" === typeof input.totalAmount && !Number.isNaN(input.totalAmount)) && ("number" === typeof input.balanceAmount && !Number.isNaN(input.balanceAmount)) && ("number" === typeof input.suppliedAmount && !Number.isNaN(input.suppliedAmount)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && ("number" === typeof input.vat && !Number.isNaN(input.vat)) && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                    var $io5 = function (input) { return "string" === typeof input.carrier && "string" === typeof input.customerMobilePhone && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus); };
                    var $io6 = function (input) { return "object" === typeof input.transfer && null !== input.transfer && $io7(input.transfer) && "\uACC4\uC88C\uC774\uCCB4" === input.method && "NORMAL" === input.type && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && ("number" === typeof input.totalAmount && !Number.isNaN(input.totalAmount)) && ("number" === typeof input.balanceAmount && !Number.isNaN(input.balanceAmount)) && ("number" === typeof input.suppliedAmount && !Number.isNaN(input.suppliedAmount)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && ("number" === typeof input.vat && !Number.isNaN(input.vat)) && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                    var $io7 = function (input) { return "string" === typeof input.bank && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus); };
                    var $io8 = function (input) { return "string" === typeof input.secret && ("object" === typeof input.virtualAccount && null !== input.virtualAccount && $io9(input.virtualAccount)) && "\uAC00\uC0C1\uACC4\uC88C" === input.method && "NORMAL" === input.type && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && ("number" === typeof input.totalAmount && !Number.isNaN(input.totalAmount)) && ("number" === typeof input.balanceAmount && !Number.isNaN(input.balanceAmount)) && ("number" === typeof input.suppliedAmount && !Number.isNaN(input.suppliedAmount)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && ("number" === typeof input.vat && !Number.isNaN(input.vat)) && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                    var $io9 = function (input) { return "string" === typeof input.accountNumber && ("\uACE0\uC815" === input.accountType || "\uC77C\uBC18" === input.accountType) && "string" === typeof input.bank && "string" === typeof input.customerName && ("string" === typeof input.dueDate && /^(\d{4})-(\d{2})-(\d{2})$/.test(input.dueDate)) && "boolean" === typeof input.expired && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus) && ("COMPLETED" === input.refundStatus || "FAILED" === input.refundStatus || "NONE" === input.refundStatus || "PARTIAL_FAILED" === input.refundStatus || "PENDING" === input.refundStatus); };
                    var $io10 = function (input) { return "object" === typeof input.card && null !== input.card && $io11(input.card) && (null === input.discount || "object" === typeof input.discount && null !== input.discount && $io12(input.discount)) && (null === input.easyPay || "\uC0BC\uC131\uD398\uC774" === input.easyPay || "\uD1A0\uC2A4\uACB0\uC81C" === input.easyPay || "\uD398\uC774\uCF54" === input.easyPay) && "\uCE74\uB4DC" === input.method && ("BILLING" === input.type || "NORMAL" === input.type) && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && ("number" === typeof input.totalAmount && !Number.isNaN(input.totalAmount)) && ("number" === typeof input.balanceAmount && !Number.isNaN(input.balanceAmount)) && ("number" === typeof input.suppliedAmount && !Number.isNaN(input.suppliedAmount)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && ("number" === typeof input.vat && !Number.isNaN(input.vat)) && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                    var $io11 = function (input) { return "string" === typeof input.company && ("string" === typeof input.number && /[0-9]{16}/.test(input.number)) && ("number" === typeof input.installmentPlanMonths && !Number.isNaN(input.installmentPlanMonths)) && "boolean" === typeof input.isInterestFree && "string" === typeof input.approveNo && false === input.useCardPoint && ("\uAE30\uD504\uD2B8" === input.cardType || "\uC2E0\uC6A9" === input.cardType || "\uCCB4\uD06C" === input.cardType) && ("\uAC1C\uC778" === input.ownerType || "\uBC95\uC778" === input.ownerType) && ("CANCELED" === input.acquireStatus || "CANCEL_REQUESTED" === input.acquireStatus || "COMPLETED" === input.acquireStatus || "READY" === input.acquireStatus || "REQUESTED" === input.acquireStatus) && ("string" === typeof input.receiptUrl && (/\/|:/.test(input.receiptUrl) && /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i.test(input.receiptUrl))); };
                    var $io12 = function (input) { return "number" === typeof input.amount && !Number.isNaN(input.amount); };
                    var $iu0 = function (input) { return (function () {
                        if ("\uC0C1\uD488\uAD8C" === input.method)
                            return $io0(input);
                        else if ("\uD734\uB300\uD3F0" === input.method)
                            return $io4(input);
                        else if ("\uACC4\uC88C\uC774\uCCB4" === input.method)
                            return $io6(input);
                        else if ("\uAC00\uC0C1\uACC4\uC88C" === input.method)
                            return $io8(input);
                        else if (undefined !== input.easyPay)
                            return $io10(input);
                        else
                            return false;
                    })(); };
                    return "object" === typeof input && null !== input && $iu0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedRoute.Put.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return (("object" === typeof input.giftCertificate && null !== input.giftCertificate || $guard(_exceptionable, {
                                path: _path + ".giftCertificate",
                                expected: "ITossGiftCertificatePayment.IGiftCertificate",
                                value: input.giftCertificate
                            }, errorFactory)) && $ao1(input.giftCertificate, _path + ".giftCertificate", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".giftCertificate",
                                expected: "ITossGiftCertificatePayment.IGiftCertificate",
                                value: input.giftCertificate
                            }, errorFactory)) && ("\uC0C1\uD488\uAD8C" === input.method || $guard(_exceptionable, {
                                path: _path + ".method",
                                expected: "\"\uC0C1\uD488\uAD8C\"",
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
                            return ("string" === typeof input.approveNo || $guard(_exceptionable, {
                                path: _path + ".approveNo",
                                expected: "string",
                                value: input.approveNo
                            }, errorFactory)) && ("COMPLETE" === input.settlementStatus || "INCOMPLETE" === input.settlementStatus || $guard(_exceptionable, {
                                path: _path + ".settlementStatus",
                                expected: "(\"COMPLETE\" | \"INCOMPLETE\")",
                                value: input.settlementStatus
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
                        var $ao4 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return (("object" === typeof input.mobilePhone && null !== input.mobilePhone || $guard(_exceptionable, {
                                path: _path + ".mobilePhone",
                                expected: "ITossMobilePhonePayment.IMobilePhone",
                                value: input.mobilePhone
                            }, errorFactory)) && $ao5(input.mobilePhone, _path + ".mobilePhone", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".mobilePhone",
                                expected: "ITossMobilePhonePayment.IMobilePhone",
                                value: input.mobilePhone
                            }, errorFactory)) && ("\uD734\uB300\uD3F0" === input.method || $guard(_exceptionable, {
                                path: _path + ".method",
                                expected: "\"\uD734\uB300\uD3F0\"",
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
                            }, errorFactory)) && input.cancels.every(function (elem, _index2) { return ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index2 + "]",
                                expected: "ITossPaymentCancel",
                                value: elem
                            }, errorFactory)) && $ao2(elem, _path + ".cancels[" + _index2 + "]", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index2 + "]",
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
                        var $ao5 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.carrier || $guard(_exceptionable, {
                                path: _path + ".carrier",
                                expected: "string",
                                value: input.carrier
                            }, errorFactory)) && ("string" === typeof input.customerMobilePhone || $guard(_exceptionable, {
                                path: _path + ".customerMobilePhone",
                                expected: "string",
                                value: input.customerMobilePhone
                            }, errorFactory)) && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus || $guard(_exceptionable, {
                                path: _path + ".settlementStatus",
                                expected: "(\"COMPLETED\" | \"INCOMPLETED\")",
                                value: input.settlementStatus
                            }, errorFactory));
                        };
                        var $ao6 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return (("object" === typeof input.transfer && null !== input.transfer || $guard(_exceptionable, {
                                path: _path + ".transfer",
                                expected: "ITossTransferPayment.ITransfer",
                                value: input.transfer
                            }, errorFactory)) && $ao7(input.transfer, _path + ".transfer", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".transfer",
                                expected: "ITossTransferPayment.ITransfer",
                                value: input.transfer
                            }, errorFactory)) && ("\uACC4\uC88C\uC774\uCCB4" === input.method || $guard(_exceptionable, {
                                path: _path + ".method",
                                expected: "\"\uACC4\uC88C\uC774\uCCB4\"",
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
                            }, errorFactory)) && input.cancels.every(function (elem, _index3) { return ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index3 + "]",
                                expected: "ITossPaymentCancel",
                                value: elem
                            }, errorFactory)) && $ao2(elem, _path + ".cancels[" + _index3 + "]", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index3 + "]",
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
                        var $ao7 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.bank || $guard(_exceptionable, {
                                path: _path + ".bank",
                                expected: "string",
                                value: input.bank
                            }, errorFactory)) && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus || $guard(_exceptionable, {
                                path: _path + ".settlementStatus",
                                expected: "(\"COMPLETED\" | \"INCOMPLETED\")",
                                value: input.settlementStatus
                            }, errorFactory));
                        };
                        var $ao8 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.secret || $guard(_exceptionable, {
                                path: _path + ".secret",
                                expected: "string",
                                value: input.secret
                            }, errorFactory)) && (("object" === typeof input.virtualAccount && null !== input.virtualAccount || $guard(_exceptionable, {
                                path: _path + ".virtualAccount",
                                expected: "ITossVirtualAccountPayment.IVirtualAccount",
                                value: input.virtualAccount
                            }, errorFactory)) && $ao9(input.virtualAccount, _path + ".virtualAccount", true && _exceptionable) || $guard(_exceptionable, {
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
                            }, errorFactory)) && input.cancels.every(function (elem, _index4) { return ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index4 + "]",
                                expected: "ITossPaymentCancel",
                                value: elem
                            }, errorFactory)) && $ao2(elem, _path + ".cancels[" + _index4 + "]", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index4 + "]",
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
                        var $ao9 = function (input, _path, _exceptionable) {
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
                        var $ao10 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return (("object" === typeof input.card && null !== input.card || $guard(_exceptionable, {
                                path: _path + ".card",
                                expected: "ITossCardPayment.ICard",
                                value: input.card
                            }, errorFactory)) && $ao11(input.card, _path + ".card", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".card",
                                expected: "ITossCardPayment.ICard",
                                value: input.card
                            }, errorFactory)) && (null === input.discount || ("object" === typeof input.discount && null !== input.discount || $guard(_exceptionable, {
                                path: _path + ".discount",
                                expected: "(ITossCardPayment.IDiscount | null)",
                                value: input.discount
                            }, errorFactory)) && $ao12(input.discount, _path + ".discount", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".discount",
                                expected: "(ITossCardPayment.IDiscount | null)",
                                value: input.discount
                            }, errorFactory)) && (null === input.easyPay || "\uC0BC\uC131\uD398\uC774" === input.easyPay || "\uD1A0\uC2A4\uACB0\uC81C" === input.easyPay || "\uD398\uC774\uCF54" === input.easyPay || $guard(_exceptionable, {
                                path: _path + ".easyPay",
                                expected: "(\"\uC0BC\uC131\uD398\uC774\" | \"\uD1A0\uC2A4\uACB0\uC81C\" | \"\uD398\uC774\uCF54\" | null)",
                                value: input.easyPay
                            }, errorFactory)) && ("\uCE74\uB4DC" === input.method || $guard(_exceptionable, {
                                path: _path + ".method",
                                expected: "\"\uCE74\uB4DC\"",
                                value: input.method
                            }, errorFactory)) && ("BILLING" === input.type || "NORMAL" === input.type || $guard(_exceptionable, {
                                path: _path + ".type",
                                expected: "(\"BILLING\" | \"NORMAL\")",
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
                            }, errorFactory)) && input.cancels.every(function (elem, _index5) { return ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index5 + "]",
                                expected: "ITossPaymentCancel",
                                value: elem
                            }, errorFactory)) && $ao2(elem, _path + ".cancels[" + _index5 + "]", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index5 + "]",
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
                        var $ao11 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.company || $guard(_exceptionable, {
                                path: _path + ".company",
                                expected: "string",
                                value: input.company
                            }, errorFactory)) && ("string" === typeof input.number && (/[0-9]{16}/.test(input.number) || $guard(_exceptionable, {
                                path: _path + ".number",
                                expected: "string & Pattern<\"[0-9]{16}\">",
                                value: input.number
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".number",
                                expected: "(string & Pattern<\"[0-9]{16}\">)",
                                value: input.number
                            }, errorFactory)) && ("number" === typeof input.installmentPlanMonths && !Number.isNaN(input.installmentPlanMonths) || $guard(_exceptionable, {
                                path: _path + ".installmentPlanMonths",
                                expected: "number",
                                value: input.installmentPlanMonths
                            }, errorFactory)) && ("boolean" === typeof input.isInterestFree || $guard(_exceptionable, {
                                path: _path + ".isInterestFree",
                                expected: "boolean",
                                value: input.isInterestFree
                            }, errorFactory)) && ("string" === typeof input.approveNo || $guard(_exceptionable, {
                                path: _path + ".approveNo",
                                expected: "string",
                                value: input.approveNo
                            }, errorFactory)) && (false === input.useCardPoint || $guard(_exceptionable, {
                                path: _path + ".useCardPoint",
                                expected: "false",
                                value: input.useCardPoint
                            }, errorFactory)) && ("\uAE30\uD504\uD2B8" === input.cardType || "\uC2E0\uC6A9" === input.cardType || "\uCCB4\uD06C" === input.cardType || $guard(_exceptionable, {
                                path: _path + ".cardType",
                                expected: "(\"\uAE30\uD504\uD2B8\" | \"\uC2E0\uC6A9\" | \"\uCCB4\uD06C\")",
                                value: input.cardType
                            }, errorFactory)) && ("\uAC1C\uC778" === input.ownerType || "\uBC95\uC778" === input.ownerType || $guard(_exceptionable, {
                                path: _path + ".ownerType",
                                expected: "(\"\uAC1C\uC778\" | \"\uBC95\uC778\")",
                                value: input.ownerType
                            }, errorFactory)) && ("CANCELED" === input.acquireStatus || "CANCEL_REQUESTED" === input.acquireStatus || "COMPLETED" === input.acquireStatus || "READY" === input.acquireStatus || "REQUESTED" === input.acquireStatus || $guard(_exceptionable, {
                                path: _path + ".acquireStatus",
                                expected: "(\"CANCELED\" | \"CANCEL_REQUESTED\" | \"COMPLETED\" | \"READY\" | \"REQUESTED\")",
                                value: input.acquireStatus
                            }, errorFactory)) && ("string" === typeof input.receiptUrl && (/\/|:/.test(input.receiptUrl) && /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i.test(input.receiptUrl) || $guard(_exceptionable, {
                                path: _path + ".receiptUrl",
                                expected: "string & Format<\"uri\">",
                                value: input.receiptUrl
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".receiptUrl",
                                expected: "(string & Format<\"uri\">)",
                                value: input.receiptUrl
                            }, errorFactory));
                        };
                        var $ao12 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return "number" === typeof input.amount && !Number.isNaN(input.amount) || $guard(_exceptionable, {
                                path: _path + ".amount",
                                expected: "number",
                                value: input.amount
                            }, errorFactory);
                        };
                        var $au0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return (function () {
                                if ("\uC0C1\uD488\uAD8C" === input.method)
                                    return $ao0(input, _path, true && _exceptionable);
                                else if ("\uD734\uB300\uD3F0" === input.method)
                                    return $ao4(input, _path, true && _exceptionable);
                                else if ("\uACC4\uC88C\uC774\uCCB4" === input.method)
                                    return $ao6(input, _path, true && _exceptionable);
                                else if ("\uAC00\uC0C1\uACC4\uC88C" === input.method)
                                    return $ao8(input, _path, true && _exceptionable);
                                else if (undefined !== input.easyPay)
                                    return $ao10(input, _path, true && _exceptionable);
                                else
                                    return $guard(_exceptionable, {
                                        path: _path,
                                        expected: "(ITossGiftCertificatePayment | ITossMobilePhonePayment | ITossTransferPayment | ITossVirtualAccountPayment | ITossCardPayment)",
                                        value: input
                                    }, errorFactory);
                            })();
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "(ITossCardPayment | ITossGiftCertificatePayment | ITossMobilePhonePayment | ITossTransferPayment | ITossVirtualAccountPayment)",
                            value: input
                        }, errorFactory)) && $au0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "(ITossCardPayment | ITossGiftCertificatePayment | ITossMobilePhonePayment | ITossTransferPayment | ITossVirtualAccountPayment)",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            }; var stringify = function (input) {
                var $io0 = function (input) { return "object" === typeof input.giftCertificate && null !== input.giftCertificate && $io1(input.giftCertificate) && "\uC0C1\uD488\uAD8C" === input.method && "NORMAL" === input.type && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && "number" === typeof input.totalAmount && "number" === typeof input.balanceAmount && "number" === typeof input.suppliedAmount && "number" === typeof input.taxFreeAmount && "number" === typeof input.vat && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                var $io1 = function (input) { return "string" === typeof input.approveNo && ("COMPLETE" === input.settlementStatus || "INCOMPLETE" === input.settlementStatus); };
                var $io2 = function (input) { return "number" === typeof input.cancelAmount && "string" === typeof input.cancelReason && "number" === typeof input.taxFreeAmount && "number" === typeof input.taxAmount && "number" === typeof input.refundableAmount && ("string" === typeof input.canceledAt && !isNaN(new Date(input.canceledAt).getTime())); };
                var $io3 = function (input) { return ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type) && "number" === typeof input.amount && "number" === typeof input.taxFreeAmount && "string" === typeof input.issueNumber && "string" === typeof input.receiptUrl; };
                var $io4 = function (input) { return "object" === typeof input.mobilePhone && null !== input.mobilePhone && $io5(input.mobilePhone) && "\uD734\uB300\uD3F0" === input.method && "NORMAL" === input.type && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && "number" === typeof input.totalAmount && "number" === typeof input.balanceAmount && "number" === typeof input.suppliedAmount && "number" === typeof input.taxFreeAmount && "number" === typeof input.vat && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                var $io5 = function (input) { return "string" === typeof input.carrier && "string" === typeof input.customerMobilePhone && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus); };
                var $io6 = function (input) { return "object" === typeof input.transfer && null !== input.transfer && $io7(input.transfer) && "\uACC4\uC88C\uC774\uCCB4" === input.method && "NORMAL" === input.type && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && "number" === typeof input.totalAmount && "number" === typeof input.balanceAmount && "number" === typeof input.suppliedAmount && "number" === typeof input.taxFreeAmount && "number" === typeof input.vat && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                var $io7 = function (input) { return "string" === typeof input.bank && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus); };
                var $io8 = function (input) { return "string" === typeof input.secret && ("object" === typeof input.virtualAccount && null !== input.virtualAccount && $io9(input.virtualAccount)) && "\uAC00\uC0C1\uACC4\uC88C" === input.method && "NORMAL" === input.type && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && "number" === typeof input.totalAmount && "number" === typeof input.balanceAmount && "number" === typeof input.suppliedAmount && "number" === typeof input.taxFreeAmount && "number" === typeof input.vat && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                var $io9 = function (input) { return "string" === typeof input.accountNumber && ("\uACE0\uC815" === input.accountType || "\uC77C\uBC18" === input.accountType) && "string" === typeof input.bank && "string" === typeof input.customerName && ("string" === typeof input.dueDate && /^(\d{4})-(\d{2})-(\d{2})$/.test(input.dueDate)) && "boolean" === typeof input.expired && ("COMPLETED" === input.settlementStatus || "INCOMPLETED" === input.settlementStatus) && ("COMPLETED" === input.refundStatus || "FAILED" === input.refundStatus || "NONE" === input.refundStatus || "PARTIAL_FAILED" === input.refundStatus || "PENDING" === input.refundStatus); };
                var $io10 = function (input) { return "object" === typeof input.card && null !== input.card && $io11(input.card) && (null === input.discount || "object" === typeof input.discount && null !== input.discount && $io12(input.discount)) && (null === input.easyPay || "\uC0BC\uC131\uD398\uC774" === input.easyPay || "\uD1A0\uC2A4\uACB0\uC81C" === input.easyPay || "\uD398\uC774\uCF54" === input.easyPay) && "\uCE74\uB4DC" === input.method && ("BILLING" === input.type || "NORMAL" === input.type) && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && "number" === typeof input.totalAmount && "number" === typeof input.balanceAmount && "number" === typeof input.suppliedAmount && "number" === typeof input.taxFreeAmount && "number" === typeof input.vat && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io2(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io3(input.cashReceipt)); };
                var $io11 = function (input) { return "string" === typeof input.company && ("string" === typeof input.number && /[0-9]{16}/.test(input.number)) && "number" === typeof input.installmentPlanMonths && "boolean" === typeof input.isInterestFree && "string" === typeof input.approveNo && false === input.useCardPoint && ("\uAE30\uD504\uD2B8" === input.cardType || "\uC2E0\uC6A9" === input.cardType || "\uCCB4\uD06C" === input.cardType) && ("\uAC1C\uC778" === input.ownerType || "\uBC95\uC778" === input.ownerType) && ("CANCELED" === input.acquireStatus || "CANCEL_REQUESTED" === input.acquireStatus || "COMPLETED" === input.acquireStatus || "READY" === input.acquireStatus || "REQUESTED" === input.acquireStatus) && ("string" === typeof input.receiptUrl && (/\/|:/.test(input.receiptUrl) && /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i.test(input.receiptUrl))); };
                var $io12 = function (input) { return "number" === typeof input.amount; };
                var $string = core_1.default.TypedRoute.Put.string;
                var $throws = core_1.default.TypedRoute.Put.throws;
                var $so0 = function (input) { return "{\"giftCertificate\":".concat($so1(input.giftCertificate), ",\"method\":").concat((function () {
                    if ("string" === typeof input.method)
                        return $string(input.method);
                    if ("string" === typeof input.method)
                        return "\"" + input.method + "\"";
                    $throws({
                        expected: "\"\uC0C1\uD488\uAD8C\"",
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
                var $so1 = function (input) { return "{\"approveNo\":".concat($string(input.approveNo), ",\"settlementStatus\":").concat((function () {
                    if ("string" === typeof input.settlementStatus)
                        return $string(input.settlementStatus);
                    if ("string" === typeof input.settlementStatus)
                        return "\"" + input.settlementStatus + "\"";
                    $throws({
                        expected: "(\"COMPLETE\" | \"INCOMPLETE\")",
                        value: input.settlementStatus
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
                var $so4 = function (input) { return "{\"mobilePhone\":".concat($so5(input.mobilePhone), ",\"method\":").concat((function () {
                    if ("string" === typeof input.method)
                        return $string(input.method);
                    if ("string" === typeof input.method)
                        return "\"" + input.method + "\"";
                    $throws({
                        expected: "\"\uD734\uB300\uD3F0\"",
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
                var $so5 = function (input) { return "{\"carrier\":".concat($string(input.carrier), ",\"customerMobilePhone\":").concat($string(input.customerMobilePhone), ",\"settlementStatus\":").concat((function () {
                    if ("string" === typeof input.settlementStatus)
                        return $string(input.settlementStatus);
                    if ("string" === typeof input.settlementStatus)
                        return "\"" + input.settlementStatus + "\"";
                    $throws({
                        expected: "(\"COMPLETED\" | \"INCOMPLETED\")",
                        value: input.settlementStatus
                    });
                })(), "}"); };
                var $so6 = function (input) { return "{\"transfer\":".concat($so7(input.transfer), ",\"method\":").concat((function () {
                    if ("string" === typeof input.method)
                        return $string(input.method);
                    if ("string" === typeof input.method)
                        return "\"" + input.method + "\"";
                    $throws({
                        expected: "\"\uACC4\uC88C\uC774\uCCB4\"",
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
                var $so7 = function (input) { return "{\"bank\":".concat($string(input.bank), ",\"settlementStatus\":").concat((function () {
                    if ("string" === typeof input.settlementStatus)
                        return $string(input.settlementStatus);
                    if ("string" === typeof input.settlementStatus)
                        return "\"" + input.settlementStatus + "\"";
                    $throws({
                        expected: "(\"COMPLETED\" | \"INCOMPLETED\")",
                        value: input.settlementStatus
                    });
                })(), "}"); };
                var $so8 = function (input) { return "{\"secret\":".concat($string(input.secret), ",\"virtualAccount\":").concat($so9(input.virtualAccount), ",\"method\":").concat((function () {
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
                var $so9 = function (input) { return "{\"accountNumber\":".concat($string(input.accountNumber), ",\"accountType\":").concat((function () {
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
                var $so10 = function (input) { return "{\"card\":".concat($so11(input.card), ",\"discount\":").concat(null !== input.discount ? "{\"amount\":".concat(input.discount.amount, "}") : "null", ",\"easyPay\":").concat(null !== input.easyPay ? (function () {
                    if ("string" === typeof input.easyPay)
                        return $string(input.easyPay);
                    if ("string" === typeof input.easyPay)
                        return "\"" + input.easyPay + "\"";
                    $throws({
                        expected: "(\"\uC0BC\uC131\uD398\uC774\" | \"\uD1A0\uC2A4\uACB0\uC81C\" | \"\uD398\uC774\uCF54\" | null)",
                        value: input.easyPay
                    });
                })() : "null", ",\"method\":").concat((function () {
                    if ("string" === typeof input.method)
                        return $string(input.method);
                    if ("string" === typeof input.method)
                        return "\"" + input.method + "\"";
                    $throws({
                        expected: "\"\uCE74\uB4DC\"",
                        value: input.method
                    });
                })(), ",\"type\":").concat((function () {
                    if ("string" === typeof input.type)
                        return $string(input.type);
                    if ("string" === typeof input.type)
                        return "\"" + input.type + "\"";
                    $throws({
                        expected: "(\"BILLING\" | \"NORMAL\")",
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
                var $so11 = function (input) { return "{\"company\":".concat($string(input.company), ",\"number\":").concat($string(input.number), ",\"installmentPlanMonths\":").concat(input.installmentPlanMonths, ",\"isInterestFree\":").concat(input.isInterestFree, ",\"approveNo\":").concat($string(input.approveNo), ",\"useCardPoint\":").concat(input.useCardPoint, ",\"cardType\":").concat((function () {
                    if ("string" === typeof input.cardType)
                        return $string(input.cardType);
                    if ("string" === typeof input.cardType)
                        return "\"" + input.cardType + "\"";
                    $throws({
                        expected: "(\"\uAE30\uD504\uD2B8\" | \"\uC2E0\uC6A9\" | \"\uCCB4\uD06C\")",
                        value: input.cardType
                    });
                })(), ",\"ownerType\":").concat((function () {
                    if ("string" === typeof input.ownerType)
                        return $string(input.ownerType);
                    if ("string" === typeof input.ownerType)
                        return "\"" + input.ownerType + "\"";
                    $throws({
                        expected: "(\"\uAC1C\uC778\" | \"\uBC95\uC778\")",
                        value: input.ownerType
                    });
                })(), ",\"acquireStatus\":").concat((function () {
                    if ("string" === typeof input.acquireStatus)
                        return $string(input.acquireStatus);
                    if ("string" === typeof input.acquireStatus)
                        return "\"" + input.acquireStatus + "\"";
                    $throws({
                        expected: "(\"CANCELED\" | \"CANCEL_REQUESTED\" | \"COMPLETED\" | \"READY\" | \"REQUESTED\")",
                        value: input.acquireStatus
                    });
                })(), ",\"receiptUrl\":").concat($string(input.receiptUrl), "}"); };
                var $su0 = function (input) { return (function () {
                    if ("\uC0C1\uD488\uAD8C" === input.method)
                        return $so0(input);
                    else if ("\uD734\uB300\uD3F0" === input.method)
                        return $so4(input);
                    else if ("\uACC4\uC88C\uC774\uCCB4" === input.method)
                        return $so6(input);
                    else if ("\uAC00\uC0C1\uACC4\uC88C" === input.method)
                        return $so8(input);
                    else if (undefined !== input.easyPay)
                        return $so10(input);
                    else
                        $throws({
                            expected: "(ITossGiftCertificatePayment | ITossMobilePhonePayment | ITossTransferPayment | ITossVirtualAccountPayment | ITossCardPayment)",
                            value: input
                        });
                })(); };
                return $su0(input);
            }; return stringify(assert(input, errorFactory)); } }),
        __param(0, (0, FakeTossUserAuth_1.FakeTossUserAuth)()),
        __param(1, core_1.default.TypedParam("paymentKey", function (input) {
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
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [void 0, String]),
        __metadata("design:returntype", Object)
    ], FakeTossInternalController.prototype, "deposit", null);
    FakeTossInternalController = __decorate([
        (0, common_1.Controller)("internal")
    ], FakeTossInternalController);
    return FakeTossInternalController;
}());
exports.FakeTossInternalController = FakeTossInternalController;
//# sourceMappingURL=FakeTossInternalController.js.map