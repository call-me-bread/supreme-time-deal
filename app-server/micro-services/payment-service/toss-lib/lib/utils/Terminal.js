"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terminal = void 0;
var child_process_1 = __importDefault(require("child_process"));
var Pair_1 = require("tstl/utility/Pair");
var Terminal;
(function (Terminal) {
    function execute() {
        var commands = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            commands[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            child_process_1.default.exec(commands.join(" && "), function (error, stdout, stderr) {
                if (error)
                    reject(error);
                else
                    resolve(new Pair_1.Pair(stdout, stderr));
            });
        });
    }
    Terminal.execute = execute;
})(Terminal || (exports.Terminal = Terminal = {}));
//# sourceMappingURL=Terminal.js.map