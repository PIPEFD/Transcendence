"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuView = MenuView;
var main_js_1 = require("../main.js");
var index_js_1 = require("../translations/index.js");
function MenuView(app, state) {
    var _a, _b, _c, _d;
    var avatarSrc = "";
    if (state.player.avatar !== null && state.player.avatar !== undefined) {
        if (typeof state.player.avatar === "number") {
            avatarSrc = "/assets/avatar".concat(state.player.avatar, ".png");
        }
        else if (typeof state.player.avatar === "string") {
            avatarSrc = state.player.avatar;
        }
    }
    app.innerHTML = "\n    <div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-6 rounded-lg shadow-lg max-w-sm mx-auto flex flex-col items-center text-center\">\n      <h1 class=\"text-sm leading-relaxed mb-4\">".concat((0, index_js_1.t)("Me"), "</h1>\n\n      ").concat(avatarSrc ? "<img src=\"".concat(avatarSrc, "\"\n        id=\"avBtn\"\n        class=\"w-40 h-40 rounded-full cursor-pointer hover:opacity-80 mb-6\"/>") : "", "\n\n      <div class=\"flex flex-col w-full space-y-2\">\n        <button id=\"matchHistoryBtn\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press active:border-b-blue-800\">\n          ").concat((0, index_js_1.t)("matchHistory"), "\n        </button>\n         <button id=\"friends\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800\">\n          ").concat((0, index_js_1.t)("Friends"), "\n        </button>\n         <button id=\"gostats\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press active:border-b-blue-800\">\n          ").concat((0, index_js_1.t)("Stats"), "\n        </button>\n        <button id=\"goBackBtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800\">\n          ").concat((0, index_js_1.t)("goBack"), "\n        </button>\n      </div>\n    </div>\n  ");
    (_a = document.getElementById("goBackBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return (0, main_js_1.navigate)("/"); });
    (_b = document.getElementById("friends")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () { return (0, main_js_1.navigate)("/friends"); });
    (_c = document.getElementById("gostats")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () { return (0, main_js_1.navigate)("/statistics"); });
    (_d = document.getElementById("matchHistoryBtn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () { return (0, main_js_1.navigate)("/match-history"); });
}
