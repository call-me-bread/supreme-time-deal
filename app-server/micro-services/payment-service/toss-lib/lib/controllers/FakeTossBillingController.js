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
exports.FakeTossBillingController = void 0;
var core_1 = __importDefault(require("@nestia/core"));
var common_1 = require("@nestjs/common");
var uuid_1 = require("uuid");
var FakeTossUserAuth_1 = require("../decorators/FakeTossUserAuth");
var FakeTossPaymentProvider_1 = require("../providers/FakeTossPaymentProvider");
var FakeTossStorage_1 = require("../providers/FakeTossStorage");
var FakeTossBillingController = /** @class */ (function () {
    function FakeTossBillingController() {
    }
    /**
     * 간편 결제 카드 등록하기.
     *
     * `billing.authorizations.card.create` 는 고객이 자신의 신록 카드를 서버에 등록해두고,
     * 매번 결제가 필요할 때마다 카드 정보를 반복 입력하는 일 없이 간편하게 결제를
     * 진행하고자 할 때, 호출되는 API 함수이다.
     *
     * 참고로 `billing.authorizations.card.create` 는 클라이언트 어플리케이션이 토스
     * 페이먼츠가 제공하는 간편 결제 카드 등록 창을 사용하는 경우, 귀하의 백엔드 서버가 이를
     * 실 서비스에서 호출하는 일은 없을 것이다. 다만, 고객이 간편 결제 카드를 등록하는
     * 상황을 시뮬레이션하기 위하여, 테스트 자동화 프로그램 수준에서 사용될 수는 있다.
     *
     * @param input 간편 결제 카드 등록 정보
     * @returns 간편 결제 카드 정보
     *
     * @security basic
     * @author Samchon
     */
    FakeTossBillingController.prototype.create = function (_0, input) {
        var billing = {
            mId: "tosspyaments",
            method: "카드",
            billingKey: (0, uuid_1.v4)(),
            customerKey: input.customerKey,
            cardCompany: "신한",
            cardNumber: input.cardNumber,
            authenticatedAt: new Date().toISOString(),
        };
        FakeTossStorage_1.FakeTossStorage.billings.set(billing.billingKey, [billing, input]);
        return billing;
    };
    /**
     * 간편 결제로 등록한 수단 조회하기.
     *
     * `billing.authorizations.at` 은 고객이 간편 결제를 위하여 토스 페이먼츠 서버에
     * 등록한 결제 수단을 조회하는 함수이다.
     *
     * 주로 클라이언트 어플리케이션이 토스 페이먼츠가 자체적으로 제공하는 결제 창을 사용하는
     * 경우, 그래서 프론트 어플리케이션이 귀하의 백엔드 서버에 `billingKey` 와` customerKey`
     * 만을 전달해주어, 상세 간편 결제 수단 정보가 필요할 때 사용한다.
     *
     * @param billingKey 대상 정보의 {@link ITossBilling.billingKey}
     * @param input 고객 식별자 키
     * @returns 간편 결제 수단 정보
     *
     * @security basic
     * @author Samchon
     */
    FakeTossBillingController.prototype.at = function (_0, billingKey, input) {
        var tuple = FakeTossStorage_1.FakeTossStorage.billings.get(billingKey);
        if (tuple[0].customerKey !== input.customerKey)
            throw new common_1.ForbiddenException("Different customer.");
        return tuple[0];
    };
    /**
     * 간편 결제에 등록한 수단으로 결제하기.
     *
     * `billing.pay` 는 간편 결제에 등록한 수단으로 결제를 진행하고자 할 때 호출하는 API
     * 함수이다.
     *
     * 그리고 `billing.pay` 는 결제 수단 중 유일하게, 클라이언트 어플리케이션이 토스
     * 페이먼츠가 제공하는 결제 창을 사용할 수 없어, 귀하의 백엔드 서버가 토스 페이먼츠의
     * API 함수를 직접 호출해야 하는 경우에 해당한다. 따라서 간편 결제에 관련하여 토스
     * 페이먼츠와 연동하는 백엔드 서버 및 프론트 어플리케이션을 개발할 때, 반드시 이 상황에
     * 대한 별도의 설계 및 개발이 필요하니, 이 점을 염두에 두기 바란다.
     *
     * 더하여 `billing.pay` 는 철저히 귀사 백엔드 서버의 판단 아래 호출되는 API 함수인지라,
     * 이를 통하여 이루어지는 결제는 일절 {@link payments.approve} 가 필요 없다. 다만
     * `billing.pay` 는 이처럼 부차적인 승인 과정 필요없이 그 즉시로 결제가 완성되니, 이를
     * 호출하는 상황에 대하여 세심히 주의를 기울일 필요가 있다
     *
     * @param billingKey 간편 결제에 등록한 수단의 {@link ITossBilling.billingKey}
     * @param input 주문 정보
     * @returns 결제 정보
     *
     * @security basic
     * @author Samchon
     */
    FakeTossBillingController.prototype.pay = function (_0, billingKey, input) {
        var tuple = FakeTossStorage_1.FakeTossStorage.billings.get(billingKey);
        var card = tuple[1];
        var payment = __assign(__assign({}, FakeTossPaymentProvider_1.FakeTossPaymentProvider.get_common_props(input)), { method: "카드", type: "NORMAL", status: "DONE", approvedAt: new Date().toISOString(), discount: null, card: {
                company: "신한카드",
                number: card.cardNumber,
                installmentPlanMonths: 0,
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
    __decorate([
        core_1.default.TypedRoute.Post("authorizations/card", { type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "string" === typeof input.mId && "string" === typeof input.billingKey && "\uCE74\uB4DC" === input.method && "string" === typeof input.cardCompany && ("string" === typeof input.cardNumber && /[0-9]{16}/.test(input.cardNumber)) && ("string" === typeof input.authenticatedAt && !isNaN(new Date(input.authenticatedAt).getTime())) && "string" === typeof input.customerKey; };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedRoute.Post.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.mId || $guard(_exceptionable, {
                                path: _path + ".mId",
                                expected: "string",
                                value: input.mId
                            }, errorFactory)) && ("string" === typeof input.billingKey || $guard(_exceptionable, {
                                path: _path + ".billingKey",
                                expected: "string",
                                value: input.billingKey
                            }, errorFactory)) && ("\uCE74\uB4DC" === input.method || $guard(_exceptionable, {
                                path: _path + ".method",
                                expected: "\"\uCE74\uB4DC\"",
                                value: input.method
                            }, errorFactory)) && ("string" === typeof input.cardCompany || $guard(_exceptionable, {
                                path: _path + ".cardCompany",
                                expected: "string",
                                value: input.cardCompany
                            }, errorFactory)) && ("string" === typeof input.cardNumber && (/[0-9]{16}/.test(input.cardNumber) || $guard(_exceptionable, {
                                path: _path + ".cardNumber",
                                expected: "string & Pattern<\"[0-9]{16}\">",
                                value: input.cardNumber
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".cardNumber",
                                expected: "(string & Pattern<\"[0-9]{16}\">)",
                                value: input.cardNumber
                            }, errorFactory)) && ("string" === typeof input.authenticatedAt && (!isNaN(new Date(input.authenticatedAt).getTime()) || $guard(_exceptionable, {
                                path: _path + ".authenticatedAt",
                                expected: "string & Format<\"date-time\">",
                                value: input.authenticatedAt
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".authenticatedAt",
                                expected: "(string & Format<\"date-time\">)",
                                value: input.authenticatedAt
                            }, errorFactory)) && ("string" === typeof input.customerKey || $guard(_exceptionable, {
                                path: _path + ".customerKey",
                                expected: "string",
                                value: input.customerKey
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossBilling",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossBilling",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            }; var stringify = function (input) {
                var $string = core_1.default.TypedRoute.Post.string;
                var $throws = core_1.default.TypedRoute.Post.throws;
                var $so0 = function (input) { return "{\"mId\":".concat($string(input.mId), ",\"billingKey\":").concat($string(input.billingKey), ",\"method\":").concat((function () {
                    if ("string" === typeof input.method)
                        return $string(input.method);
                    if ("string" === typeof input.method)
                        return "\"" + input.method + "\"";
                    $throws({
                        expected: "\"\uCE74\uB4DC\"",
                        value: input.method
                    });
                })(), ",\"cardCompany\":").concat($string(input.cardCompany), ",\"cardNumber\":").concat($string(input.cardNumber), ",\"authenticatedAt\":").concat($string(input.authenticatedAt), ",\"customerKey\":").concat($string(input.customerKey), "}"); };
                return $so0(input);
            }; return stringify(assert(input, errorFactory)); } }),
        __param(0, (0, FakeTossUserAuth_1.FakeTossUserAuth)()),
        __param(1, core_1.default.TypedBody({ type: "assert", assert: function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "string" === typeof input.cardNumber && /[0-9]{16}/.test(input.cardNumber) && ("string" === typeof input.cardExpirationYear && /\d{2}/.test(input.cardExpirationYear)) && ("string" === typeof input.cardExpirationMonth && /^(0[1-9]|1[012])$/.test(input.cardExpirationMonth)) && "string" === typeof input.cardPassword && ("string" === typeof input.customerBirthday && /^([0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/.test(input.customerBirthday)) && (undefined === input.consumerName || "string" === typeof input.consumerName) && (undefined === input.customerEmail || "string" === typeof input.customerEmail && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.customerEmail)) && (undefined === input.vbv || "object" === typeof input.vbv && null !== input.vbv && $io1(input.vbv)) && "string" === typeof input.customerKey; };
                    var $io1 = function (input) { return "string" === typeof input.cavv && "string" === typeof input.xid && "string" === typeof input.eci; };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedBody.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.cardNumber && (/[0-9]{16}/.test(input.cardNumber) || $guard(_exceptionable, {
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
                            }, errorFactory)) && ("string" === typeof input.cardPassword || $guard(_exceptionable, {
                                path: _path + ".cardPassword",
                                expected: "string",
                                value: input.cardPassword
                            }, errorFactory)) && ("string" === typeof input.customerBirthday && (/^([0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/.test(input.customerBirthday) || $guard(_exceptionable, {
                                path: _path + ".customerBirthday",
                                expected: "string & Pattern<\"^([0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$\">",
                                value: input.customerBirthday
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".customerBirthday",
                                expected: "(string & Pattern<\"^([0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$\">)",
                                value: input.customerBirthday
                            }, errorFactory)) && (undefined === input.consumerName || "string" === typeof input.consumerName || $guard(_exceptionable, {
                                path: _path + ".consumerName",
                                expected: "(string | undefined)",
                                value: input.consumerName
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
                            }, errorFactory)) && ("string" === typeof input.customerKey || $guard(_exceptionable, {
                                path: _path + ".customerKey",
                                expected: "string",
                                value: input.customerKey
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
                            expected: "ITossBilling.ICreate",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossBilling.ICreate",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            } })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [void 0, Object]),
        __metadata("design:returntype", Object)
    ], FakeTossBillingController.prototype, "create", null);
    __decorate([
        core_1.default.TypedRoute.Post("authorizations/:billingKey", { type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
                var __is = function (input) {
                    var $io0 = function (input) { return "string" === typeof input.mId && "string" === typeof input.billingKey && "\uCE74\uB4DC" === input.method && "string" === typeof input.cardCompany && ("string" === typeof input.cardNumber && /[0-9]{16}/.test(input.cardNumber)) && ("string" === typeof input.authenticatedAt && !isNaN(new Date(input.authenticatedAt).getTime())) && "string" === typeof input.customerKey; };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedRoute.Post.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("string" === typeof input.mId || $guard(_exceptionable, {
                                path: _path + ".mId",
                                expected: "string",
                                value: input.mId
                            }, errorFactory)) && ("string" === typeof input.billingKey || $guard(_exceptionable, {
                                path: _path + ".billingKey",
                                expected: "string",
                                value: input.billingKey
                            }, errorFactory)) && ("\uCE74\uB4DC" === input.method || $guard(_exceptionable, {
                                path: _path + ".method",
                                expected: "\"\uCE74\uB4DC\"",
                                value: input.method
                            }, errorFactory)) && ("string" === typeof input.cardCompany || $guard(_exceptionable, {
                                path: _path + ".cardCompany",
                                expected: "string",
                                value: input.cardCompany
                            }, errorFactory)) && ("string" === typeof input.cardNumber && (/[0-9]{16}/.test(input.cardNumber) || $guard(_exceptionable, {
                                path: _path + ".cardNumber",
                                expected: "string & Pattern<\"[0-9]{16}\">",
                                value: input.cardNumber
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".cardNumber",
                                expected: "(string & Pattern<\"[0-9]{16}\">)",
                                value: input.cardNumber
                            }, errorFactory)) && ("string" === typeof input.authenticatedAt && (!isNaN(new Date(input.authenticatedAt).getTime()) || $guard(_exceptionable, {
                                path: _path + ".authenticatedAt",
                                expected: "string & Format<\"date-time\">",
                                value: input.authenticatedAt
                            }, errorFactory)) || $guard(_exceptionable, {
                                path: _path + ".authenticatedAt",
                                expected: "(string & Format<\"date-time\">)",
                                value: input.authenticatedAt
                            }, errorFactory)) && ("string" === typeof input.customerKey || $guard(_exceptionable, {
                                path: _path + ".customerKey",
                                expected: "string",
                                value: input.customerKey
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossBilling",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossBilling",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            }; var stringify = function (input) {
                var $string = core_1.default.TypedRoute.Post.string;
                var $throws = core_1.default.TypedRoute.Post.throws;
                var $so0 = function (input) { return "{\"mId\":".concat($string(input.mId), ",\"billingKey\":").concat($string(input.billingKey), ",\"method\":").concat((function () {
                    if ("string" === typeof input.method)
                        return $string(input.method);
                    if ("string" === typeof input.method)
                        return "\"" + input.method + "\"";
                    $throws({
                        expected: "\"\uCE74\uB4DC\"",
                        value: input.method
                    });
                })(), ",\"cardCompany\":").concat($string(input.cardCompany), ",\"cardNumber\":").concat($string(input.cardNumber), ",\"authenticatedAt\":").concat($string(input.authenticatedAt), ",\"customerKey\":").concat($string(input.customerKey), "}"); };
                return $so0(input);
            }; return stringify(assert(input, errorFactory)); } }),
        __param(0, (0, FakeTossUserAuth_1.FakeTossUserAuth)()),
        __param(1, core_1.default.TypedParam("billingKey", function (input) {
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
                    return "object" === typeof input && null !== input && "string" === typeof input.customerKey;
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedBody.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return "string" === typeof input.customerKey || $guard(_exceptionable, {
                                path: _path + ".customerKey",
                                expected: "string",
                                value: input.customerKey
                            }, errorFactory);
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossBilling.ICustomerKey",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossBilling.ICustomerKey",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            } })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [void 0, String, Object]),
        __metadata("design:returntype", Object)
    ], FakeTossBillingController.prototype, "at", null);
    __decorate([
        core_1.default.TypedRoute.Post(":billingKey", { type: "assert", assert: function (input, errorFactory) { var assert = function (input, errorFactory) {
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
        __param(1, core_1.default.TypedParam("billingKey", function (input) {
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
                    var $io0 = function (input) { return "billing" === input.method && "string" === typeof input.billingKey && "string" === typeof input.orderId && "number" === typeof input.amount && "string" === typeof input.customerKey; };
                    return "object" === typeof input && null !== input && $io0(input);
                };
                if (false === __is(input))
                    (function (input, _path, _exceptionable) {
                        if (_exceptionable === void 0) { _exceptionable = true; }
                        var $guard = core_1.default.TypedBody.guard;
                        var $ao0 = function (input, _path, _exceptionable) {
                            if (_exceptionable === void 0) { _exceptionable = true; }
                            return ("billing" === input.method || $guard(_exceptionable, {
                                path: _path + ".method",
                                expected: "\"billing\"",
                                value: input.method
                            }, errorFactory)) && ("string" === typeof input.billingKey || $guard(_exceptionable, {
                                path: _path + ".billingKey",
                                expected: "string",
                                value: input.billingKey
                            }, errorFactory)) && ("string" === typeof input.orderId || $guard(_exceptionable, {
                                path: _path + ".orderId",
                                expected: "string",
                                value: input.orderId
                            }, errorFactory)) && ("number" === typeof input.amount || $guard(_exceptionable, {
                                path: _path + ".amount",
                                expected: "number",
                                value: input.amount
                            }, errorFactory)) && ("string" === typeof input.customerKey || $guard(_exceptionable, {
                                path: _path + ".customerKey",
                                expected: "string",
                                value: input.customerKey
                            }, errorFactory));
                        };
                        return ("object" === typeof input && null !== input || $guard(true, {
                            path: _path + "",
                            expected: "ITossBilling.IPaymentStore",
                            value: input
                        }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                            path: _path + "",
                            expected: "ITossBilling.IPaymentStore",
                            value: input
                        }, errorFactory);
                    })(input, "$input", true);
                return input;
            } })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [void 0, String, Object]),
        __metadata("design:returntype", Object)
    ], FakeTossBillingController.prototype, "pay", null);
    FakeTossBillingController = __decorate([
        (0, common_1.Controller)("v1/billing")
    ], FakeTossBillingController);
    return FakeTossBillingController;
}());
exports.FakeTossBillingController = FakeTossBillingController;
//# sourceMappingURL=FakeTossBillingController.js.map