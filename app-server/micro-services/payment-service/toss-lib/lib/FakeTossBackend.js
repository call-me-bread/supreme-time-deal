"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeTossBackend = void 0;
var core_1 = require("@nestjs/core");
var platform_fastify_1 = require("@nestjs/platform-fastify");
var FakeTossConfiguration_1 = require("./FakeTossConfiguration");
var FakeTossModule_1 = require("./FakeTossModule");
/**
 * Fake 토스 페이먼츠 서버의 백엔드 프로그램.
 *
 * @author Samchon
 */
var FakeTossBackend = /** @class */ (function () {
    function FakeTossBackend() {
    }
    /**
     * 서버 개설.
     */
    FakeTossBackend.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        //----
                        // OPEN THE BACKEND SERVER
                        //----
                        // MOUNT CONTROLLERS
                        _a = this;
                        return [4 /*yield*/, core_1.NestFactory.create(FakeTossModule_1.FakeTossModule, new platform_fastify_1.FastifyAdapter(), { logger: false })];
                    case 1:
                        //----
                        // OPEN THE BACKEND SERVER
                        //----
                        // MOUNT CONTROLLERS
                        _a.application_ = _b.sent();
                        // DO OPEN
                        this.application_.enableCors();
                        return [4 /*yield*/, this.application_.listen(FakeTossConfiguration_1.FakeTossConfiguration.API_PORT, "0.0.0.0")];
                    case 2:
                        _b.sent();
                        //----
                        // POST-PROCESSES
                        //----
                        // INFORM TO THE PM2
                        if (process.send)
                            process.send("ready");
                        // WHEN KILL COMMAND COMES
                        process.on("SIGINT", function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.close()];
                                    case 1:
                                        _a.sent();
                                        process.exit(0);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 서버 폐쇄.
     */
    FakeTossBackend.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.application_ === undefined)
                            return [2 /*return*/];
                        // DO CLOSE
                        return [4 /*yield*/, this.application_.close()];
                    case 1:
                        // DO CLOSE
                        _a.sent();
                        delete this.application_;
                        return [2 /*return*/];
                }
            });
        });
    };
    return FakeTossBackend;
}());
exports.FakeTossBackend = FakeTossBackend;
//# sourceMappingURL=FakeTossBackend.js.map