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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var random_1 = require("tstl/algorithm/random");
var Singleton_1 = require("tstl/thread/Singleton");
var FakeTossBackend_1 = require("../FakeTossBackend");
var ErrorUtil_1 = require("../utils/ErrorUtil");
var EXTENSION = __filename.substr(-2);
if (EXTENSION === "js")
    require("source-map-support/register");
var directory = new Singleton_1.Singleton(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mkdir("".concat(__dirname, "/../../assets"))];
            case 1:
                _a.sent();
                return [4 /*yield*/, mkdir("".concat(__dirname, "/../../assets/logs"))];
            case 2:
                _a.sent();
                return [4 /*yield*/, mkdir("".concat(__dirname, "/../../assets/logs/errors"))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function cipher(val) {
    if (val < 10)
        return "0" + val;
    else
        return String(val);
}
function mkdir(path) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.default.promises.mkdir(path)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function handle_error(exp) {
    return __awaiter(this, void 0, void 0, function () {
        var date, fileName, content, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    date = new Date();
                    fileName = "".concat(date.getFullYear()).concat(cipher(date.getMonth() + 1)).concat(cipher(date.getDate())).concat(cipher(date.getHours())).concat(cipher(date.getMinutes())).concat(cipher(date.getSeconds()), ".").concat((0, random_1.randint)(0, Number.MAX_SAFE_INTEGER));
                    content = JSON.stringify(ErrorUtil_1.ErrorUtil.toJSON(exp), null, 4);
                    return [4 /*yield*/, directory.get()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, fs_1.default.promises.writeFile("".concat(__dirname, "/../../assets/logs/errors/").concat(fileName, ".log"), content, "utf8")];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var backend;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    backend = new FakeTossBackend_1.FakeTossBackend();
                    return [4 /*yield*/, backend.open()];
                case 1:
                    _a.sent();
                    // UNEXPECTED ERRORS
                    global.process.on("uncaughtException", handle_error);
                    global.process.on("unhandledRejection", handle_error);
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (exp) {
    console.log(exp);
    process.exit(-1);
});
//# sourceMappingURL=server.js.map