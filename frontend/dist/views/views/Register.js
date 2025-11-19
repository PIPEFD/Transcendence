"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterView = RegisterView;
var main_js_1 = require("../main.js");
var index_js_1 = require("../translations/index.js");
function RegisterView(app, state) {
    var _a, _b;
    app.innerHTML = "\n    <div class=\"text-center mb-4\">\n        <h1 class=\"text-poke-yellow text-2xl\">POK\u00E9MON</h1>\n        <p class=\"text-poke-light text-xs\">PONG</p>\n    </div>\n    <div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg\">\n        <h2 class=\"text-sm leading-relaxed mb-4\">".concat((0, index_js_1.t)("registration"), "</h2>\n        <p class=\"text-sm leading-relaxed mb-4\">").concat((0, index_js_1.t)("connect_with_42"), "</p>\n        <div class=\"flex justify-center\">\n        <button id=\"reg1Button\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded\n                hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 hover:border-b-red-800 active:animate-press active:border-b-red-800\">\n                ").concat((0, index_js_1.t)("sign_up"), "\n            </button>\n            <button id=\"regButton\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded\n                hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 hover:border-b-red-800 active:animate-press active:border-b-red-800\">\n                ").concat((0, index_js_1.t)("log_in"), "\n            </button>\n        </div>\n    </div>\n  ");
    (_a = document.getElementById("reg1Button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        state.player.alias = "42User";
        state.player.user = "42Userrr";
        (0, main_js_1.navigate)("/profile1");
    });
    (_b = document.getElementById("regButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        state.player.alias = "42User";
        state.player.user = "42Userrr";
        (0, main_js_1.navigate)("/login");
    });
}
;
