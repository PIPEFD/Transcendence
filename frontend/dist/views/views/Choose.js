"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseView = ChooseView;
var main_js_1 = require("../main.js");
var Header_js_1 = require("./Header.js");
var index_js_1 = require("../translations/index.js");
function ChooseView(app, state) {
    var _a, _b;
    app.innerHTML = "\n    <div class=\"text-center mb-4\">\n      <h1 class=\"text-poke-yellow text-2xl\">POK\u00E9MON</h1>\n      <p class=\"text-poke-light text-xs\">PONG</p>\n    </div>\n    <div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg\">\n      <h1 class=\"text-sm leading-relaxed mb-4\">".concat((0, index_js_1.t)("new_avatar"), "</h1>\n      <button id=\"withABtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded mb-2 w-full\n        hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800\">\n        ").concat((0, index_js_1.t)("choose_new_avatar"), "\n      </button>\n      <button id=\"withoutABtn\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded mb-2 w-full\n        hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press active:border-b-blue-800\">\n        ").concat((0, index_js_1.t)("continue_without_avatar"), "\n      </button>\n    </div>\n  ");
    (_a = document.getElementById("withABtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return (0, main_js_1.navigate)("/avatar"); });
    (_b = document.getElementById("withoutABtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        state.player.avatar = 10;
        (0, Header_js_1.updateHeader)(state);
        (0, main_js_1.navigate)("/");
    });
}
;
