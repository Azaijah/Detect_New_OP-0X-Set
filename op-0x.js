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
var puppeteer_1 = require("puppeteer");
var nodemailer = require("nodemailer");
var fs = require("fs");
var toml = require("@iarna/toml");
function loadConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var configFileContents, config;
        return __generator(this, function (_a) {
            configFileContents = fs.readFileSync('./config.toml', 'utf-8');
            config = toml.parse(configFileContents);
            return [2 /*return*/, config];
        });
    });
}
function scrapeAndCheck(url, searchString) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, content, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    return [4 /*yield*/, puppeteer_1.default.launch()];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle2' })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.content()];
                case 5:
                    content = _a.sent();
                    if (!content.includes(searchString)) return [3 /*break*/, 7];
                    return [4 /*yield*/, browser.close()];
                case 6:
                    _a.sent();
                    return [2 /*return*/, true];
                case 7:
                    console.log("\"".concat(searchString, "\" not found on the page."));
                    return [4 /*yield*/, browser.close()];
                case 8:
                    _a.sent();
                    return [2 /*return*/, false];
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_1 = _a.sent();
                    console.error("Error scraping ".concat(url, ": "), error_1 instanceof Error ? error_1.message : String(error_1));
                    throw new Error("Error scraping ".concat(url, ": ").concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                case 11: return [2 /*return*/];
            }
        });
    });
}
function sendAlertEmail(config) {
    return __awaiter(this, void 0, void 0, function () {
        var found, transporter, mailOptions, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, scrapeAndCheck(config.url, config.searchString)];
                case 1:
                    found = _a.sent();
                    if (!found) {
                        return [2 /*return*/];
                    }
                    transporter = nodemailer.createTransport({
                        service: config.service,
                        auth: {
                            user: config.user,
                            pass: config.pass
                        }
                    });
                    mailOptions = {
                        from: config.from,
                        to: config.recipientEmail,
                        subject: config.subject,
                        text: config.message,
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Failed to send email:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadConfig()];
                case 1:
                    config = _a.sent();
                    console.log("test");
                    setInterval(function () {
                        sendAlertEmail(config);
                    }, 120000); // 
                    return [2 /*return*/];
            }
        });
    });
}
main();
