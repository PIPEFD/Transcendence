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
exports.Profile1View = Profile1View;
var main_js_1 = require("../main.js");
var index_js_1 = require("../translations/index.js");
var api_js_1 = require("../config/api.js");
function Profile1View(app, state) {
    var _this = this;
    var _a;
    app.innerHTML = "\n    <div class=\"text-center mb-4\">\n      <h1 class=\"text-poke-yellow text-2xl\">POK\u00E9MON</h1>\n      <p class=\"text-poke-light text-xs\">PONG</p>\n    </div>\n    <div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg\">\n      <h2 class=\"text-sm leading-relaxed mb-4\">".concat((0, index_js_1.t)("profile"), "</h2>\n      <p class=\"text-sm mb-4\">\n        ").concat((0, index_js_1.t)("welcome"), ", ").concat(state.player.user || (0, index_js_1.t)("player"), "!\n        ").concat((0, index_js_1.t)("username_info"), "\n      </p>\n      <input type=\"text\" id=\"userEnter\" placeholder=\"").concat((0, index_js_1.t)("enter_username"), "\"\n        class=\"border-2 border-pixel-black px-4 py-2 mb-4 w-full\" />\n      <input type=\"email\" id=\"mailEnter\" placeholder=\"").concat((0, index_js_1.t)("mail"), "\"\n        class=\"border-2 border-pixel-black px-4 py-2 mb-4 w-full\" />\n      <input type=\"password\" id=\"passEnter\" placeholder=\"").concat((0, index_js_1.t)("password"), "\"\n        class=\"border-2 border-pixel-black px-4 py-2 mb-4 w-full\" />\n      <div class=\"flex justify-center gap-4\">\n        <button id=\"userButton\"\n          class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded \n                 hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 hover:border-b-blue-800 active:animate-press active:border-b-blue-800\">\n          ").concat((0, index_js_1.t)("enter_username"), "\n        </button>\n        <button id=\"back\"\n          class=\"bg-gradient-to-b from-poke-red to-red-700 text-poke-light py-2 border-3 border-poke-red border-b-red-900 rounded \n                 hover:from-red-500 hover:to-red-600 active:animate-press\">\n          ").concat((0, index_js_1.t)("back"), "\n        </button>\n      </div>\n    </div>\n  ");
    var backBtn = document.getElementById("back");
    backBtn === null || backBtn === void 0 ? void 0 : backBtn.addEventListener("click", function () { return (0, main_js_1.navigate)("/register"); });
    (_a = document.getElementById("userButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var usernameInput, emailInput, passwordInput, username, email, pass, response, text, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usernameInput = document.getElementById("userEnter");
                    emailInput = document.getElementById("mailEnter");
                    passwordInput = document.getElementById("passEnter");
                    username = usernameInput.value.trim();
                    email = emailInput.value.trim();
                    pass = passwordInput.value.trim();
                    if (!username || !email || !pass) {
                        alert("Todos los campos son obligatorios");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, api_js_1.apiFetch)(api_js_1.API_ENDPOINTS.USERS, {
                            method: "POST",
                            body: JSON.stringify({ username: username, email: email, pass: pass })
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 3:
                    text = _a.sent();
                    data = void 0;
                    try {
                        data = JSON.parse(text);
                    }
                    catch (_b) {
                        alert("Error inesperado del servidor");
                        return [2 /*return*/];
                    }
                    if (!response.ok) {
                        alert("Error: " + (data.error || "Bad Request"));
                        return [2 /*return*/];
                    }
                    alert("Usuario creado correctamente");
                    state.player.user = username;
                    localStorage.setItem("player", JSON.stringify(state.player));
                    (0, main_js_1.navigate)("/login");
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error(err_1);
                    alert("Error de conexión con el servidor");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
}
