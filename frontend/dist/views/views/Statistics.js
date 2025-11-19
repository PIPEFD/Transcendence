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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.StatsView = StatsView;
var main_js_1 = require("../main.js");
var index_js_1 = require("../translations/index.js");
var api_js_1 = require("../config/api.js");
function StatsView(app, state) {
    return __awaiter(this, void 0, void 0, function () {
        var token, user_id, avatarSrc, response, stats, data;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    token = localStorage.getItem('tokenUser');
                    user_id = localStorage.getItem('userId');
                    console.log("id entrar stats: ", user_id);
                    console.log("token al entrar stats", token);
                    avatarSrc = "";
                    if (state.player.avatar !== null && state.player.avatar !== undefined) {
                        if (typeof state.player.avatar === "number") {
                            avatarSrc = "/assets/avatar".concat(state.player.avatar, ".png"); // built-in
                        }
                        else if (typeof state.player.avatar === "string") {
                            avatarSrc = state.player.avatar; // uploaded
                        }
                    }
                    return [4 /*yield*/, (0, api_js_1.apiFetch)(api_js_1.API_ENDPOINTS.MATCHES, {
                            method: "PATCH",
                            headers: { 'Authorization': "Bearer ".concat(token) },
                            body: JSON.stringify({ user_id: user_id })
                        })];
                case 1:
                    response = _c.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    stats = _c.sent();
                    data = JSON.parse(stats.details);
                    state.player.matches = data.matches;
                    state.player.victories = data.victories;
                    state.player.defeats = data.defeats;
                    app.innerHTML = "\n    <div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-6 rounded-lg shadow-lg max-w-sm mx-auto flex flex-col items-center text-center\">\n      <h1 class=\"text-sm leading-relaxed mb-4\">".concat((0, index_js_1.t)("statistics"), "</h1>\n\n      ").concat(avatarSrc ? "<img src=\"".concat(avatarSrc, "\"\n        id=\"avBtn\"\n        class=\"w-40 h-40 rounded-full cursor-pointer hover:opacity-80 mb-6\"/>") : "", "\n\n      <div class=\"w-full space-y-3 mb-6\">\n        <div class=\"flex justify-between items-center\">\n          <h2 class=\"text-sm leading-relaxed\">").concat((0, index_js_1.t)("matchesPlayed"), ":</h2>\n          <span class=\"text-sm leading-relaxed text-blue-600\">").concat(state.player.matches, "</span>\n        </div>\n\n        <div class=\"flex justify-between items-center\">\n          <h2 class=\"text-sm leading-relaxed\">").concat((0, index_js_1.t)("victories"), ":</h2>\n          <span class=\"text-sm leading-relaxed\">\n            <span class=\"text-sm leading-relaxed text-blue-600\">").concat(state.player.victories, "</span>\n            <span class=\"text-sm leading-relaxed text-poke-dark\">/</span>\n            <span class=\"text-sm leading-relaxed text-red-600\">").concat(state.player.matches, "</span>\n          </span>\n        </div>\n\n        <div class=\"flex justify-between items-center\">\n          <h2 class=\"text-sm leading-relaxed\">").concat((0, index_js_1.t)("defeats"), ":</h2>\n          <span class=\"text-sm leading-relaxed\">\n            <span class=\"text-sm leading-relaxed text-blue-600\">").concat(state.player.defeats, "</span>\n            <span class=\"text-sm leading-relaxed text-poke-dark\">/</span>\n            <span class=\"text-sm leading-relaxed text-red-600\">").concat(state.player.matches, "</span>\n          </span>\n        </div>\n      </div>\n\n      <div class=\"flex flex-col w-full space-y-2\">\n        <button id=\"matchHistoryBtn\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press active:border-b-blue-800\">\n          ").concat((0, index_js_1.t)("matchHistory"), "\n        </button>\n\n        <button id=\"goBackBtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800\">\n          ").concat((0, index_js_1.t)("goBack"), "\n        </button>\n      </div>\n    </div>\n  ");
                    (_a = document.getElementById("goBackBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return (0, main_js_1.navigate)("/menu"); });
                    (_b = document.getElementById("matchHistoryBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () { return (0, main_js_1.navigate)("/match-history"); });
                    return [2 /*return*/];
            }
        });
    });
}
