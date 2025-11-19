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
exports.SettingsView = SettingsView;
var main_js_1 = require("../main.js");
var index_js_1 = require("../translations/index.js");
var api_js_1 = require("../config/api.js");
function SettingsView(app, state) {
    var _this = this;
    var _a, _b, _c, _d, _e, _f;
    app.innerHTML = "\n    <div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg\">\n        <h1 class=\"text-sm leading-relaxed mb-4\">".concat((0, index_js_1.t)("settings"), "</h1>\n\n        <button id=\"cuseBtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800\">\n            ").concat((0, index_js_1.t)("changeUser"), "\n        </button>\n\n        <button id=\"cavtBtn\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press active:border-b-blue-800\">\n            ").concat((0, index_js_1.t)("changeAvatar"), "\n        </button>\n\n        <button id=\"cfrBtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800\">\n            ").concat((0, index_js_1.t)("friends"), "\n        </button>\n\n        <button id=\"clangBtn\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press active:border-b-blue-800\">\n            ").concat((0, index_js_1.t)("changeLanguage"), "\n        </button>\n\n        <button id=\"logoutBtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800\">\n            ").concat((0, index_js_1.t)("Log out"), "\n        </button>\n\n        <button id=\"gbcBtn\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press active:border-b-blue-800\">\n            ").concat((0, index_js_1.t)("goBack"), "\n        </button>\n    </div>\n  ");
    (_a = document.getElementById("cuseBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return (0, main_js_1.navigate)("/profile"); });
    (_b = document.getElementById("cavtBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () { return (0, main_js_1.navigate)("/avatar"); });
    (_c = document.getElementById("cfrBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () { return (0, main_js_1.navigate)("/friends"); });
    (_d = document.getElementById("clangBtn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () { return (0, main_js_1.navigate)("/language"); });
    (_e = document.getElementById("gbcBtn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", function () { return (0, main_js_1.navigate)("/"); });
    (_f = document.getElementById("logoutBtn")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var user_id, response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    user_id = localStorage.getItem("userId");
                    return [4 /*yield*/, (0, api_js_1.apiFetch)("".concat(api_js_1.API_ENDPOINTS.LOGOUT), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ user_id: user_id }),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log("Logout response:", data);
                    // Borrar JWT del localStorage y volver al inicio
                    localStorage.removeItem('tokenUser');
                    (0, main_js_1.navigate)("/register");
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error("Error during logout:", err_1);
                    alert("❌ " + err_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
