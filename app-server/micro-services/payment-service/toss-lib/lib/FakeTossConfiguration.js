"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeTossConfiguration = void 0;
var core_1 = __importDefault(require("@nestia/core"));
var common_1 = require("@nestjs/common");
var DomainError_1 = require("tstl/exception/DomainError");
var InvalidArgument_1 = require("tstl/exception/InvalidArgument");
var OutOfRange_1 = require("tstl/exception/OutOfRange");
/* eslint-disable */
var EXTENSION = __filename.substring(__filename.length - 2);
if (EXTENSION === "js")
    require("source-map-support").install();
/**
 * Fake 토스 페이먼츠 서버의 설정 정보.
 *
 * @author Samchon
 */
var FakeTossConfiguration;
(function (FakeTossConfiguration) {
    /**
     * @internal
     */
    FakeTossConfiguration.ASSETS = __dirname + "/../assets";
    /**
     * 임시 저장소의 레코드 만료 기한.
     */
    FakeTossConfiguration.EXPIRATION = {
        time: 3 * 60 * 1000,
        capacity: 1000,
    };
    /**
     * 서버가 사용할 포트 번호.
     */
    FakeTossConfiguration.API_PORT = 30771;
    /**
     * Webhook 이벤트를 수신할 URL 주소.
     */
    FakeTossConfiguration.WEBHOOK_URL = "http://127.0.0.1:".concat(FakeTossConfiguration.API_PORT, "/internal/webhook");
    /**
     * 토큰 인증 함수.
     *
     * 클라이언트가 전송한 Basic 토큰값이 제대로 된 것인지 판별한다.
     *
     * @param token 토큰값
     */
    FakeTossConfiguration.authorize = function (token) {
        return token === "test_ak_ZORzdMaqN3wQd5k6ygr5AkYXQGwy";
    };
})(FakeTossConfiguration || (exports.FakeTossConfiguration = FakeTossConfiguration = {}));
// CUSTOM EXCEPTIION CONVERSION
core_1.default.ExceptionManager.insert(OutOfRange_1.OutOfRange, function (exp) { return new common_1.NotFoundException(exp.message); });
core_1.default.ExceptionManager.insert(InvalidArgument_1.InvalidArgument, function (exp) { return new common_1.ConflictException(exp.message); });
core_1.default.ExceptionManager.insert(DomainError_1.DomainError, function (exp) { return new common_1.UnprocessableEntityException(exp.message); });
// TRACE EXACT SERVER INTERNAL ERROR
core_1.default.ExceptionManager.insert(Error, function (exp) {
    return new common_1.InternalServerErrorException({
        message: exp.message,
        name: exp.name,
        stack: exp.stack,
    });
});
//# sourceMappingURL=FakeTossConfiguration.js.map