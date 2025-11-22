"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageView = LanguageView;
var main_js_1 = require("../main.js");
var index_js_1 = require("../translations/index.js");
function LanguageView(app, state) {
    var _a, _b, _c, _d;
    app.innerHTML = "\n    <div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg max-w-lg mx-auto\">\n      <h1 class=\"text-sm leading-relaxed mb-4 text-center\">".concat((0, index_js_1.t)("chooseLanguage"), "</h1>\n\n      <div class=\"grid grid-cols-1 gap-3\">\n        <button id=\"lang-en\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press\">\n          \uD83C\uDDEC\uD83C\uDDE7 ").concat((0, index_js_1.t)("english"), "\n        </button>\n\n        <button id=\"lang-fr\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press\">\n          \uD83C\uDDEB\uD83C\uDDF7 ").concat((0, index_js_1.t)("french"), "\n        </button>\n\n        <button id=\"lang-es\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press\">\n          \uD83C\uDDEA\uD83C\uDDF8 ").concat((0, index_js_1.t)("spanish"), "\n        </button>\n\n        <button id=\"lang-back\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press\">\n          ").concat((0, index_js_1.t)("back"), "\n        </button>\n      </div>\n    </div>\n  ");
    (_a = document.getElementById("lang-en")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        (0, index_js_1.setLanguage)("en");
    });
    (_b = document.getElementById("lang-fr")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        (0, index_js_1.setLanguage)("fr");
    });
    (_c = document.getElementById("lang-es")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
        (0, index_js_1.setLanguage)("es");
    });
    (_d = document.getElementById("lang-back")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () { return (0, main_js_1.navigate)("/settings"); });
}
