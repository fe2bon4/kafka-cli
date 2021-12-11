"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCli = exports.prefixInput = exports.prefixLog = void 0;
var prefixLog = function (prefix) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var date = new Date();
        console.log.apply(console, __spreadArray(["".concat(date.toLocaleString(), " [").concat(prefix, "]:")], args, false));
    };
};
exports.prefixLog = prefixLog;
var prefixInput = function (prefix) {
    return function (nl) {
        if (nl === void 0) { nl = ''; }
        var date = new Date();
        process.stdout.write("".concat(nl).concat(date.toLocaleString(), " [").concat(prefix, "]# "));
    };
};
exports.prefixInput = prefixInput;
var createCli = function (commander, service_name, tty) {
    if (tty === void 0) { tty = process.stdin; }
    var prompter = (0, exports.prefixInput)(service_name);
    var prompterTimeout;
    commander
        .command('clear')
        .description('Clear Console')
        .action(function () {
        console.clear();
    });
    commander
        .command('exit')
        .description('Exit command line interface')
        .action(function () {
        process.exit(0);
    });
    commander.exitOverride();
    commander.outputHelp();
    var queuePrompter = function (args, ttl) {
        if (ttl === void 0) { ttl = 300; }
        if (prompterTimeout)
            clearTimeout(prompterTimeout);
        setTimeout(function () { return prompter(args); }, ttl);
    };
    var onInput = function (buffer) {
        var input = buffer.toString().replace(/\n/g, '');
        if (!input) {
            setImmediate(function () { return prompter(); });
            return;
        }
        var argv = __spreadArray(['', ''], input.split(' '), true);
        try {
            commander.parse(argv);
            queuePrompter('\n');
        }
        catch (e) {
            setImmediate(function () { return prompter(''); });
            if (e.exitCode === 0)
                return;
        }
    };
    var pause = function () {
        tty.off('data', onInput);
    };
    var resume = function () {
        tty.on('data', onInput);
        prompter();
    };
    tty.on('data', onInput);
    setTimeout(function () { return prompter(); }, 100);
    return {
        pause: pause,
        prompt: prompter,
        resume: resume,
        cleanup: function () { return tty.off('data', onInput); },
    };
};
exports.createCli = createCli;
