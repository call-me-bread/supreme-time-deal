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
exports.FakeTossPaymentsController = void 0;
var core_1 = __importDefault(require("@nestia/core"));
var common_1 = require("@nestjs/common");
var FakeTossUserAuth_1 = require("../decorators/FakeTossUserAuth");
var FakeTossPaymentProvider_1 = require("../providers/FakeTossPaymentProvider");
var FakeTossStorage_1 = require("../providers/FakeTossStorage");
var FakeTossWebhookProvider_1 = require("../providers/FakeTossWebhookProvider");
var FakeTossPaymentsController = /** @class */ (function () {
    function FakeTossPaymentsController() {
    }
    /**
     * 결제 정보 조회하기.
     *
     * `payments.at` 은 결제 정보를 조회하는 함수이다.
     *
     * 주로 클라이언트 어플리케이션이 토스 페이먼츠가 자체적으로 제공하는 결제 창을 사용하는
     * 경우, 그래서 프론트 어플리케이션이 귀하의 백엔드 서버에 `paymentKey` 등 극히 일부의
     * 식별자 정보만을 전달해주어, 상세 결제 정보가 필요할 때 사용한다.
     *
     * 참고로 토스 페이먼츠는 다른 결제 PG 사들과 다르게, 클라이언트 어플리케이션에서 토스
     * 페이먼츠의 결제 창을 이용하여 진행한 결제가 바로 확정되는 것은 아니다. 귀사의 백엔드
     * 서버가 현재의 `payments.at` 을 통하여 해당 결제 정보를 확인하고, {@link approve} 를
     * 호출하여 직접 승인하기 전까지, 해당 결제는 확정되지 않으니, 이 점에 유의하기 바란다.
     *
     * @param paymentKey 결제 정보의 {@link ITossPayment.paymentKey}
     * @returns 결제 정보
     *
     * @author Samchon
     */
    FakeTossPaymentsController.prototype.at = function (_0, paymentKey) {
        return FakeTossStorage_1.FakeTossStorage.payments.get(paymentKey);
    };
    /**
     * 카드로 결제하기.
     *
     * `payments.key_in` 은 카드를 이용한 결제를 할 때 호출되는 API 함수이다.
     *
     * 참고로 `payments.key_in` 는 클라이언트 어플리케이션이 토스 페이먼츠가 자체적으로
     * 제공하는 결제 창을 사용하는 경우, 귀하의 백엔드 서버가 이를 실 서비스에서 호출하는
     * 일은 없을 것이다. 다만, 고객이 카드를 통하여 결제하는 상황을 시뮬레이션하기 위하여,
     * 테스트 자동화 프로그램 수준에서 사용될 수는 있다.
     *
     * 그리고 귀하의 백엔드 서버가 `payments.key-in` 을 직접 호출하는 경우, 토스 페이먼츠
     * 서버는 이를 완전히 승인된 결제로 보고 바로 확정한다. 때문에 `payments.key-in` 을
     * 직접 호출하는 경우, 토스 페이먼츠의 결제 창을 이용하여 별도의 {@link approve} 가
     * 필요한 때 대비, 훨씬 더 세심한 주의가 요구된다.
     *
     * 더하여 만약 귀하의 백엔드 서버가 `fake-toss-payments-server` 를 이용하여 고객의
     * 카드 결제를 시뮬레이션하는 경우, {@link ITossCardPayment.ICreate.__approved} 값을
     * `false` 로 하여 카드 결제의 확정을 고의로 회피할 수 있다. 이를 통하여 토스
     * 페이먼츠의 결제 창을 이용한 카드 결제의 경우, 별도의 {@link approve} 가 필요한
     * 상황을 시뮬레이션 할 수 있다.
     *
     * @param input 카드 결제 입력 정보
     * @returns 카드 결제 정보
     *
     * @security basic
     * @author Samchon
     */
    FakeTossPaymentsController.prototype.key_in = function (_0, input) {
        var payment = __assign(__assign({}, FakeTossPaymentProvider_1.FakeTossPaymentProvider.get_common_props(input)), { method: "카드", type: "NORMAL", status: input.__approved !== false ? "DONE" : "IN_PROGRESS", approvedAt: input.__approved !== false ? new Date().toISOString() : null, discount: null, card: {
                company: "신한카드",
                number: input.cardNumber,
                installmentPlanMonths: input.cardInstallmentPlan || 0,
                isInterestFree: true,
                approveNo: "temporary-card-approval-number",
                useCardPoint: false,
                cardType: "신용",
                ownerType: "개인",
                acquireStatus: "READY",
                receiptUrl: "https://github.com/samchon/fake-toss-payments-server",
            }, easyPay: null });
        FakeTossStorage_1.FakeTossStorage.payments.set(payment.paymentKey, payment);
        return payment;
    };
    /**
     * 결제 승인하기.
     *
     * 토스 페이먼츠는 귀사의 백엔드에서 일어난 결제가 아닌 프론트 어플리케이션의 결제 창에서
     * 이루어진 결제의 경우, 해당 서비스으 백엔드 서버로부터 결제를 승인받기 전까지, 이를
     * 확정하지 않는다. `payments.approve` 는 바로 이러한 상황에서, 해당 결제를 승인해주는
     * 함수이다.
     *
     * 만일 귀하가 `fake-toss-payments-server` 를 이용하여 결제를 시뮬레이션하는 경우라면,
     * 결제 관련 API 를 호출함에 있어 {@link ITossCardPayment.ICreate.__approved} 내지
     * {@link ITossVirtualAccountPayment.ICreate.__approved} 를 `false` 로 함으로써, 별도
     * 승인이 필요한 이러한 상황을 시뮬레이션 할 수 있다.
     *
     * @param paymentKey 대상 결제의 {@link ITossPayment.paymentKey}
     * @param input 주문 정보 확인
     * @returns 승인된 결제 정보
     *
     * @security basic
     * @author Samchon
     */
    FakeTossPaymentsController.prototype.approve = function (_0, paymentKey, input) {
        var payment = FakeTossStorage_1.FakeTossStorage.payments.get(paymentKey);
        if (payment.orderId !== input.orderId)
            throw new common_1.UnprocessableEntityException("Wrong orderId");
        else if (payment.totalAmount !== input.amount)
            throw new common_1.UnprocessableEntityException("Wrong price.");
        payment.approvedAt = new Date().toISOString();
        if (payment.method !== "가상계좌" && payment.method !== "계좌이체")
            payment.status = "DONE";
        return payment;
    };
    /**
     * 결제 취소하기.
     *
     * `payments.cancel` 은 결제를 취소하는 API 이다.
     *
     * 결제 취소 입력 정보 {@link ITossPaymentCancel.ICreate} 에는 취소 사유를 비롯하여,
     * 고객에게 환불해 줄 금액과 부가세 및 필요시 환불 계좌 정보 등을 입력하게 되어있다.
     *
     * @param paymentKey 결제 정보의 {@link ITossPayment.paymentKey}
     * @param input 취소 입력 정보
     * @returns 취소된 결제 정보
     *
     * @security basic
     * @author Samchon
     */
    FakeTossPaymentsController.prototype.cancel = function (_0, paymentKey, input) {
        var _a, _b, _c, _d, _e;
        var payment = FakeTossStorage_1.FakeTossStorage.payments.get(paymentKey);
        var amount = (_a = input.cancelAmount) !== null && _a !== void 0 ? _a : payment.totalAmount;
        if (payment.balanceAmount < amount)
            throw new common_1.UnprocessableEntityException("Balance amount is not enough.");
        payment.status = "CANCELED";
        (_b = payment.cancels) !== null && _b !== void 0 ? _b : (payment.cancels = []);
        payment.cancels.push({
            cancelAmount: amount,
            cancelReason: input.cancelReason,
            taxFreeAmount: (_c = input.taxFreeAmount) !== null && _c !== void 0 ? _c : 0,
            taxAmount: (_d = input.taxAmount) !== null && _d !== void 0 ? _d : 0,
            refundableAmount: (_e = input.refundableAmount) !== null && _e !== void 0 ? _e : payment.totalAmount,
            canceledAt: new Date().toISOString(),
        });
        payment.balanceAmount -= amount;
        FakeTossWebhookProvider_1.FakeTossWebhookProvider.webhook({
            eventType: "PAYMENT_STATUS_CHANGED",
            data: {
                paymentKey: payment.paymentKey,
                orderId: payment.orderId,
                status: payment.balanceAmount === 0 ? "CANCELED" : "PARTIAL_CANCELED",
            },
        }).catch(function () { });
        return payment;
    };
    __decorate([
        core_1.default.TypedRoute.Get(":paymentKey", { type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
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
                        var $guard = core_1.default.TypedRoute.Get.guard;
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
                var $string = core_1.default.TypedRoute.Get.string;
                var $throws = core_1.default.TypedRoute.Get.throws;
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
    ], FakeTossPaymentsController.prototype, "at", null);
    __decorate([
        core_1.default.TypedRoute.Post("key-in", { type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "object" === typeof input.card && null !== input.card && $io1(input.card) && (null === input.discount || "object" === typeof input.discount && null !== input.discount && $io2(input.discount)) && (null === input.easyPay || "\uC0BC\uC131\uD398\uC774" === input.easyPay || "\uD1A0\uC2A4\uACB0\uC81C" === input.easyPay || "\uD398\uC774\uCF54" === input.easyPay) && "\uCE74\uB4DC" === input.method && ("BILLING" === input.type || "NORMAL" === input.type) && ("ABORTED" === input.status || "CANCELED" === input.status || "DONE" === input.status || "EXPIRED" === input.status || "IN_PROGRESS" === input.status || "PARTIAL_CANCELED" === input.status || "READY" === input.status || "WAITING_FOR_DEPOSIT" === input.status) && "string" === typeof input.mId && "string" === typeof input.version && "string" === typeof input.paymentKey && "string" === typeof input.orderId && "string" === typeof input.transactionKey && "string" === typeof input.orderName && "string" === typeof input.currency && ("number" === typeof input.totalAmount && !Number.isNaN(input.totalAmount)) && ("number" === typeof input.balanceAmount && !Number.isNaN(input.balanceAmount)) && ("number" === typeof input.suppliedAmount && !Number.isNaN(input.suppliedAmount)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && ("number" === typeof input.vat && !Number.isNaN(input.vat)) && "boolean" === typeof input.useEscrow && "boolean" === typeof input.cultureExpense && ("string" === typeof input.requestedAt && !isNaN(new Date(input.requestedAt).getTime())) && (null === input.approvedAt || "string" === typeof input.approvedAt && !isNaN(new Date(input.approvedAt).getTime())) && (null === input.cancels || Array.isArray(input.cancels) && input.cancels.every(function (elem) { return "object" === typeof elem && null !== elem && $io3(elem); })) && (null === input.cashReceipt || "object" === typeof input.cashReceipt && null !== input.cashReceipt && $io4(input.cashReceipt)); };
                    var $io1 = function (input) { return "string" === typeof input.company && ("string" === typeof input.number && /[0-9]{16}/.test(input.number)) && ("number" === typeof input.installmentPlanMonths && !Number.isNaN(input.installmentPlanMonths)) && "boolean" === typeof input.isInterestFree && "string" === typeof input.approveNo && false === input.useCardPoint && ("\uAE30\uD504\uD2B8" === input.cardType || "\uC2E0\uC6A9" === input.cardType || "\uCCB4\uD06C" === input.cardType) && ("\uAC1C\uC778" === input.ownerType || "\uBC95\uC778" === input.ownerType) && ("CANCELED" === input.acquireStatus || "CANCEL_REQUESTED" === input.acquireStatus || "COMPLETED" === input.acquireStatus || "READY" === input.acquireStatus || "REQUESTED" === input.acquireStatus) && ("string" === typeof input.receiptUrl && (/\/|:/.test(input.receiptUrl) && /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i.test(input.receiptUrl))); };
                    var $io2 = function (input) { return "number" === typeof input.amount && !Number.isNaN(input.amount); };
                    var $io3 = function (input) { return "number" === typeof input.cancelAmount && !Number.isNaN(input.cancelAmount) && "string" === typeof input.cancelReason && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && ("number" === typeof input.taxAmount && !Number.isNaN(input.taxAmount)) && ("number" === typeof input.refundableAmount && !Number.isNaN(input.refundableAmount)) && ("string" === typeof input.canceledAt && !isNaN(new Date(input.canceledAt).getTime())); };
                    var $io4 = function (input) { return ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type) && ("number" === typeof input.amount && !Number.isNaN(input.amount)) && ("number" === typeof input.taxFreeAmount && !Number.isNaN(input.taxFreeAmount)) && "string" === typeof input.issueNumber && "string" === typeof input.receiptUrl; };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedRoute.Post.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return (("object" === typeof input.card && null !== input.card || $guard(_exceptionable, {
                                path: _path + ".card",
                                expected: "ITossCardPayment.ICard",
                                value: input.card
                            }, errorFactory)) && $ao1(input.card, _path + ".card", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".card",
                                expected: "ITossCardPayment.ICard",
                                value: input.card
                            }, errorFactory)) && (null === input.discount || ("object" === typeof input.discount && null !== input.discount || $guard(_exceptionable, {
                                path: _path + ".discount",
                                expected: "(ITossCardPayment.IDiscount | null)",
                                value: input.discount
                            }, errorFactory)) && $ao2(input.discount, _path + ".discount", true && _exceptionable) || $guard(_exceptionable, {
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
                            }, errorFactory)) && input.cancels.every(function (elem, _index1) { return ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                                path: _path + ".cancels[" + _index1 + "]",
                                expected: "ITossPaymentCancel",
                                value: elem
                            }, errorFactory)) && $ao3(elem, _path + ".cancels[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
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
                            }, errorFactory)) && $ao4(input.cashReceipt, _path + ".cashReceipt", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".cashReceipt",
                                expected: "(ITossCashReceipt.ISummary | null)",
                                value: input.cashReceipt
                            }, errorFactory));
                        };
                        var $ao1 = function (input, _path, _exceptionable) {
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
                        var $ao2 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return "number" === typeof input.amount && !Number.isNaN(input.amount) || $guard(_exceptionable, {
                                path: _path + ".amount",
                                expected: "number",
                                value: input.amount
                            }, errorFactory);
                        };
                        var $ao3 = function (input, _path, _exceptionable) {
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
                        var $ao4 = function (input, _path, _exceptionable) {
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
                            expected: "ITossCardPayment",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossCardPayment",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            }; var stringify = function (input) {
                var $io1 = function (input) { return "string" === typeof input.company && ("string" === typeof input.number && /[0-9]{16}/.test(input.number)) && "number" === typeof input.installmentPlanMonths && "boolean" === typeof input.isInterestFree && "string" === typeof input.approveNo && false === input.useCardPoint && ("\uAE30\uD504\uD2B8" === input.cardType || "\uC2E0\uC6A9" === input.cardType || "\uCCB4\uD06C" === input.cardType) && ("\uAC1C\uC778" === input.ownerType || "\uBC95\uC778" === input.ownerType) && ("CANCELED" === input.acquireStatus || "CANCEL_REQUESTED" === input.acquireStatus || "COMPLETED" === input.acquireStatus || "READY" === input.acquireStatus || "REQUESTED" === input.acquireStatus) && ("string" === typeof input.receiptUrl && (/\/|:/.test(input.receiptUrl) && /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i.test(input.receiptUrl))); };
                var $io2 = function (input) { return "number" === typeof input.amount; };
                var $io3 = function (input) { return "number" === typeof input.cancelAmount && "string" === typeof input.cancelReason && "number" === typeof input.taxFreeAmount && "number" === typeof input.taxAmount && "number" === typeof input.refundableAmount && ("string" === typeof input.canceledAt && !isNaN(new Date(input.canceledAt).getTime())); };
                var $io4 = function (input) { return ("\uC18C\uB4DD\uACF5\uC81C" === input.type || "\uC9C0\uCD9C\uC99D\uBE59" === input.type) && "number" === typeof input.amount && "number" === typeof input.taxFreeAmount && "string" === typeof input.issueNumber && "string" === typeof input.receiptUrl; };
                var $string = core_1.default.TypedRoute.Post.string;
                var $throws = core_1.default.TypedRoute.Post.throws;
                var $so0 = function (input) { return "{\"card\":".concat($so1(input.card), ",\"discount\":").concat(null !== input.discount ? "{\"amount\":".concat(input.discount.amount, "}") : "null", ",\"easyPay\":").concat(null !== input.easyPay ? (function () {
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
                })(), ",\"mId\":").concat($string(input.mId), ",\"version\":").concat($string(input.version), ",\"paymentKey\":").concat($string(input.paymentKey), ",\"orderId\":").concat($string(input.orderId), ",\"transactionKey\":").concat($string(input.transactionKey), ",\"orderName\":").concat($string(input.orderName), ",\"currency\":").concat($string(input.currency), ",\"totalAmount\":").concat(input.totalAmount, ",\"balanceAmount\":").concat(input.balanceAmount, ",\"suppliedAmount\":").concat(input.suppliedAmount, ",\"taxFreeAmount\":").concat(input.taxFreeAmount, ",\"vat\":").concat(input.vat, ",\"useEscrow\":").concat(input.useEscrow, ",\"cultureExpense\":").concat(input.cultureExpense, ",\"requestedAt\":").concat($string(input.requestedAt), ",\"approvedAt\":").concat(null !== input.approvedAt ? $string(input.approvedAt) : "null", ",\"cancels\":").concat(null !== input.cancels ? "[".concat(input.cancels.map(function (elem) { return "{\"cancelAmount\":".concat(elem.cancelAmount, ",\"cancelReason\":").concat($string(elem.cancelReason), ",\"taxFreeAmount\":").concat(elem.taxFreeAmount, ",\"taxAmount\":").concat(elem.taxAmount, ",\"refundableAmount\":").concat(elem.refundableAmount, ",\"canceledAt\":").concat($string(elem.canceledAt), "}"); }).join(","), "]") : "null", ",\"cashReceipt\":").concat(null !== input.cashReceipt ? $so4(input.cashReceipt) : "null", "}"); };
                var $so1 = function (input) { return "{\"company\":".concat($string(input.company), ",\"number\":").concat($string(input.number), ",\"installmentPlanMonths\":").concat(input.installmentPlanMonths, ",\"isInterestFree\":").concat(input.isInterestFree, ",\"approveNo\":").concat($string(input.approveNo), ",\"useCardPoint\":").concat(input.useCardPoint, ",\"cardType\":").concat((function () {
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
                var $so4 = function (input) { return "{\"type\":".concat((function () {
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
                    var $io0 = function (input) { return "card" === input.method && ("string" === typeof input.cardNumber && /[0-9]{16}/.test(input.cardNumber)) && ("string" === typeof input.cardExpirationYear && /\d{2}/.test(input.cardExpirationYear)) && ("string" === typeof input.cardExpirationMonth && /^(0[1-9]|1[012])$/.test(input.cardExpirationMonth)) && (undefined === input.cardPassword || "string" === typeof input.cardPassword) && (undefined === input.cardInstallmentPlan || "number" === typeof input.cardInstallmentPlan) && "number" === typeof input.amount && (undefined === input.taxFreeAmount || "number" === typeof input.taxFreeAmount) && "string" === typeof input.orderId && (undefined === input.orderName || "string" === typeof input.orderName) && (undefined === input.customerBirthday || "string" === typeof input.customerBirthday && /^([0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/.test(input.customerBirthday)) && (undefined === input.customerEmail || "string" === typeof input.customerEmail && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.customerEmail)) && (undefined === input.vbv || "object" === typeof input.vbv && null !== input.vbv && $io1(input.vbv)) && (undefined === input.__approved || "boolean" === typeof input.__approved); };
                    var $io1 = function (input) { return "string" === typeof input.cavv && "string" === typeof input.xid && "string" === typeof input.eci; };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedBody.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("card" === input.method || $guard(_exceptionable, {
                                path: _path + ".method",
                                expected: "\"card\"",
                                value: input.method
                            }, errorFactory)) && ("string" === typeof input.cardNumber && (/[0-9]{16}/.test(input.cardNumber) || $guard(_exceptionable, {
                                path: _path + ".cardNumber",
                                expected: "string & Pattern<\"[0-9]{16}\">",
                                value: input.cardNumber
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".cardNumber",
                                expected: "(string & Pattern<\"[0-9]{16}\">)",
                                value: input.cardNumber
                            }, errorFactory)) && ("string" === typeof input.cardExpirationYear && (/\d{2}/.test(input.cardExpirationYear) || $guard(_exceptionable, {
                                path: _path + ".cardExpirationYear",
                                expected: "string & Pattern<\"\\\\d{2}\">",
                                value: input.cardExpirationYear
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".cardExpirationYear",
                                expected: "(string & Pattern<\"\\\\d{2}\">)",
                                value: input.cardExpirationYear
                            }, errorFactory)) && ("string" === typeof input.cardExpirationMonth && (/^(0[1-9]|1[012])$/.test(input.cardExpirationMonth) || $guard(_exceptionable, {
                                path: _path + ".cardExpirationMonth",
                                expected: "string & Pattern<\"^(0[1-9]|1[012])$\">",
                                value: input.cardExpirationMonth
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".cardExpirationMonth",
                                expected: "(string & Pattern<\"^(0[1-9]|1[012])$\">)",
                                value: input.cardExpirationMonth
                            }, errorFactory)) && (undefined === input.cardPassword || "string" === typeof input.cardPassword || $guard(_exceptionable, {
                                path: _path + ".cardPassword",
                                expected: "(string | undefined)",
                                value: input.cardPassword
                            }, errorFactory)) && (undefined === input.cardInstallmentPlan || "number" === typeof input.cardInstallmentPlan || $guard(_exceptionable, {
                                path: _path + ".cardInstallmentPlan",
                                expected: "(number | undefined)",
                                value: input.cardInstallmentPlan
                            }, errorFactory)) && ("number" === typeof input.amount || $guard(_exceptionable, {
                                path: _path + ".amount",
                                expected: "number",
                                value: input.amount
                            }, errorFactory)) && (undefined === input.taxFreeAmount || "number" === typeof input.taxFreeAmount || $guard(_exceptionable, {
                                path: _path + ".taxFreeAmount",
                                expected: "(number | undefined)",
                                value: input.taxFreeAmount
                            }, errorFactory)) && ("string" === typeof input.orderId || $guard(_exceptionable, {
                                path: _path + ".orderId",
                                expected: "string",
                                value: input.orderId
                            }, errorFactory)) && (undefined === input.orderName || "string" === typeof input.orderName || $guard(_exceptionable, {
                                path: _path + ".orderName",
                                expected: "(string | undefined)",
                                value: input.orderName
                            }, errorFactory)) && (undefined === input.customerBirthday || "string" === typeof input.customerBirthday && (/^([0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/.test(input.customerBirthday) || $guard(_exceptionable, {
                                path: _path + ".customerBirthday",
                                expected: "string & Pattern<\"^([0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$\">",
                                value: input.customerBirthday
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".customerBirthday",
                                expected: "((string & Pattern<\"^([0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$\">) | undefined)",
                                value: input.customerBirthday
                            }, errorFactory)) && (undefined === input.customerEmail || "string" === typeof input.customerEmail && (/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.customerEmail) || $guard(_exceptionable, {
                                path: _path + ".customerEmail",
                                expected: "string & Format<\"email\">",
                                value: input.customerEmail
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".customerEmail",
                                expected: "((string & Format<\"email\">) | undefined)",
                                value: input.customerEmail
                            }, errorFactory)) && (undefined === input.vbv || ("object" === typeof input.vbv && null !== input.vbv || $guard(_exceptionable, {
                                path: _path + ".vbv",
                                expected: "(__type | undefined)",
                                value: input.vbv
                            }, errorFactory)) && $ao1(input.vbv, _path + ".vbv", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".vbv",
                                expected: "(__type | undefined)",
                                value: input.vbv
                            }, errorFactory)) && (undefined === input.__approved || "boolean" === typeof input.__approved || $guard(_exceptionable, {
                                path: _path + ".__approved",
                                expected: "(boolean | undefined)",
                                value: input.__approved
                            }, errorFactory));
                        };
                        var $ao1 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.cavv || $guard(_exceptionable, {
                                path: _path + ".cavv",
                                expected: "string",
                                value: input.cavv
                            }, errorFactory)) && ("string" === typeof input.xid || $guard(_exceptionable, {
                                path: _path + ".xid",
                                expected: "string",
                                value: input.xid
                            }, errorFactory)) && ("string" === typeof input.eci || $guard(_exceptionable, {
                                path: _path + ".eci",
                                expected: "string",
                                value: input.eci
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossCardPayment.ICreate",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossCardPayment.ICreate",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            } })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [void 0, Object]),
        __metadata("design:returntype", Object)
    ], FakeTossPaymentsController.prototype, "key_in", null);
    __decorate([
        core_1.default.TypedRoute.Post(":paymentKey", { type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
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
                        var $guard = core_1.default.TypedRoute.Post.guard;
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
                var $string = core_1.default.TypedRoute.Post.string;
                var $throws = core_1.default.TypedRoute.Post.throws;
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
        __param(2, core_1.default.TypedBody({ type: "assert", assert: function (input, errorFactory) {
                var __is = function (input) {
                    return "object" === typeof input && null !== input && ("string" === typeof input.orderId && "number" === typeof input.amount);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedBody.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.orderId || $guard(_exceptionable, {
                                path: _path + ".orderId",
                                expected: "string",
                                value: input.orderId
                            }, errorFactory)) && ("number" === typeof input.amount || $guard(_exceptionable, {
                                path: _path + ".amount",
                                expected: "number",
                                value: input.amount
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossPayment.IApproval",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossPayment.IApproval",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            } })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [void 0, String, Object]),
        __metadata("design:returntype", Object)
    ], FakeTossPaymentsController.prototype, "approve", null);
    __decorate([
        core_1.default.TypedRoute.Post(":paymentKey/cancel", { type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
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
                        var $guard = core_1.default.TypedRoute.Post.guard;
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
                var $string = core_1.default.TypedRoute.Post.string;
                var $throws = core_1.default.TypedRoute.Post.throws;
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
        __param(2, core_1.default.TypedBody({ type: "assert", assert: function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "string" === typeof input.paymentKey && "string" === typeof input.cancelReason && (undefined === input.cancelAmount || "number" === typeof input.cancelAmount) && (undefined === input.refundReceiveAccount || "object" === typeof input.refundReceiveAccount && null !== input.refundReceiveAccount && $io1(input.refundReceiveAccount)) && (undefined === input.taxAmount || "number" === typeof input.taxAmount) && (undefined === input.taxFreeAmount || "number" === typeof input.taxFreeAmount) && (undefined === input.refundableAmount || "number" === typeof input.refundableAmount); };
                    var $io1 = function (input) { return "string" === typeof input.bank && ("string" === typeof input.accountNumber && /^[0-9]{0,20}$/.test(input.accountNumber)) && "string" === typeof input.holderName; };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedBody.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.paymentKey || $guard(_exceptionable, {
                                path: _path + ".paymentKey",
                                expected: "string",
                                value: input.paymentKey
                            }, errorFactory)) && ("string" === typeof input.cancelReason || $guard(_exceptionable, {
                                path: _path + ".cancelReason",
                                expected: "string",
                                value: input.cancelReason
                            }, errorFactory)) && (undefined === input.cancelAmount || "number" === typeof input.cancelAmount || $guard(_exceptionable, {
                                path: _path + ".cancelAmount",
                                expected: "(number | undefined)",
                                value: input.cancelAmount
                            }, errorFactory)) && (undefined === input.refundReceiveAccount || ("object" === typeof input.refundReceiveAccount && null !== input.refundReceiveAccount || $guard(_exceptionable, {
                                path: _path + ".refundReceiveAccount",
                                expected: "(__type | undefined)",
                                value: input.refundReceiveAccount
                            }, errorFactory)) && $ao1(input.refundReceiveAccount, _path + ".refundReceiveAccount", true && _exceptionable) || $guard(_exceptionable, {
                                path: _path + ".refundReceiveAccount",
                                expected: "(__type | undefined)",
                                value: input.refundReceiveAccount
                            }, errorFactory)) && (undefined === input.taxAmount || "number" === typeof input.taxAmount || $guard(_exceptionable, {
                                path: _path + ".taxAmount",
                                expected: "(number | undefined)",
                                value: input.taxAmount
                            }, errorFactory)) && (undefined === input.taxFreeAmount || "number" === typeof input.taxFreeAmount || $guard(_exceptionable, {
                                path: _path + ".taxFreeAmount",
                                expected: "(number | undefined)",
                                value: input.taxFreeAmount
                            }, errorFactory)) && (undefined === input.refundableAmount || "number" === typeof input.refundableAmount || $guard(_exceptionable, {
                                path: _path + ".refundableAmount",
                                expected: "(number | undefined)",
                                value: input.refundableAmount
                            }, errorFactory));
                        };
                        var $ao1 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.bank || $guard(_exceptionable, {
                                path: _path + ".bank",
                                expected: "string",
                                value: input.bank
                            }, errorFactory)) && ("string" === typeof input.accountNumber && (/^[0-9]{0,20}$/.test(input.accountNumber) || $guard(_exceptionable, {
                                path: _path + ".accountNumber",
                                expected: "string & Pattern<\"^[0-9]{0,20}$\">",
                                value: input.accountNumber
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".accountNumber",
                                expected: "(string & Pattern<\"^[0-9]{0,20}$\">)",
                                value: input.accountNumber
                            }, errorFactory)) && ("string" === typeof input.holderName || $guard(_exceptionable, {
                                path: _path + ".holderName",
                                expected: "string",
                                value: input.holderName
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossPaymentCancel.ICreate",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossPaymentCancel.ICreate",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            } })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [void 0, String, Object]),
        __metadata("design:returntype", Object)
    ], FakeTossPaymentsController.prototype, "cancel", null);
    FakeTossPaymentsController = __decorate([
        (0, common_1.Controller)("v1/payments")
    ], FakeTossPaymentsController);
    return FakeTossPaymentsController;
}());
exports.FakeTossPaymentsController = FakeTossPaymentsController;
//# sourceMappingURL=FakeTossPaymentsController.js.map