"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileView = ProfileView;
var main_js_1 = require("../main.js");
var index_js_1 = require("../translations/index.js");
function ProfileView(app, state) {
    var _a;
    app.innerHTML = "\n    <div class=\"text-center mb-4\">\n      <h1 class=\"text-poke-yellow text-2xl\">POK\u00E9MON</h1>\n      <p class=\"text-poke-light text-xs\">PONG</p>\n    </div>\n    <div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg\">\n      <h2 class=\"text-sm leading-relaxed mb-4\">".concat((0, index_js_1.t)("profile"), "</h2>\n      <p class=\"text-sm mb-4\">\n        ").concat((0, index_js_1.t)("welcome"), ", ").concat(state.player.user || (0, index_js_1.t)("player"), "!\n        ").concat((0, index_js_1.t)("username_info"), "\n      </p>\n      <input type=\"text\" id=\"userEnter\" placeholder=\"").concat((0, index_js_1.t)("new_username"), "\"\n        class=\"border-2 border-pixel-black px-4 py-2 mb-4 w-full\" />\n      <div class=\"flex justify-center\">\n        <button id=\"userButton\"\n          class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 hover:border-b-blue-800 active:animate-press active:border-b-blue-800\">\n          ").concat((0, index_js_1.t)("enter_username"), "\n        </button>   \n      </div>\n    </div>\n  ");
    (_a = document.getElementById("userButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        var _a;
        var input = document.getElementById("userEnter");
        if (!input)
            return;
        var user = input.value.trim();
        if (!user) {
            app.innerHTML = "\n        <div class=\"text-center mb-4\">\n          <h1 class=\"text-poke-yellow text-2xl\">POK\u00E9MON</h1>\n          <p class=\"text-poke-light text-xs\">PONG</p>\n        </div>\n        <div class=\"bg-poke-light text-poke-red border-3 border-poke-red p-4 rounded-lg shadow-lg\">\n          <h2 class=\"text-sm leading-relaxed mb-4\">".concat((0, index_js_1.t)("registration"), "</h2>\n          <p class=\"text-sm leading-relaxed mb-4\">").concat((0, index_js_1.t)("error_empty_user"), "</p>\n          <div class=\"flex justify-center\">\n            <button id=\"returnBtn\"\n              class=\"bg-gradient-to-b from-poke-red to-red-700 text-poke-light py-2 border-3 border-poke-dark border-b-red-900 rounded \n                     hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-poke-dark\">\n              ").concat((0, index_js_1.t)("return"), "\n            </button>\n          </div>\n        </div>\n      ");
            (_a = document.getElementById("returnBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                (0, main_js_1.navigate)("/profile");
            });
            return;
        }
        state.player.user = user;
        localStorage.setItem("player", JSON.stringify(state.player));
        if (state.player.avatar === 0)
            (0, main_js_1.navigate)("/choose");
        else
            (0, main_js_1.navigate)("/");
    });
}
