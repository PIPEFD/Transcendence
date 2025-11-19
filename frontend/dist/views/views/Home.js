"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeView = HomeView;
var main_js_1 = require("../main.js");
var index_js_1 = require("../translations/index.js");
function HomeView(app, state) {
    var _a, _b, _c;
    app.innerHTML = "\n    <div class=\"text-center mb-4\">\n        <h1 class=\"text-poke-yellow text-2xl\">POK\u00E9MON</h1>\n        <p class=\"text-poke-light text-xs\">PONG</p>\n    </div>\n\n    <div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg\">\n        <h1 class=\"text-sm leading-relaxed mb-4\">".concat((0, index_js_1.t)("subtitle"), "</h1>\n        <p class=\"text-sm leading-relaxed mb-4\">").concat((0, index_js_1.t)("welcome"), ", ").concat(state.player.user || "Player", "!</p>\n\n        <button id=\"gameBtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 hover:border-b-red-800 active:animate-press active:border-b-red-800\">\n            ").concat((0, index_js_1.t)("game"), "\n        </button>\n\n        <button id=\"tournamentBtn\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 hover:border-b-blue-800 active:animate-press active:border-b-blue-800\">\n            ").concat((0, index_js_1.t)("tournament"), "\n        </button>\n\n        <button id=\"chatBtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 hover:border-b-red-800 active:animate-press active:border-b-red-800\">\n            ").concat((0, index_js_1.t)("chat"), "\n        </button>\n    </div>\n  ");
    (_a = document.getElementById("gameBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return (0, main_js_1.navigate)("/game"); });
    (_b = document.getElementById("tournamentBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () { return (0, main_js_1.navigate)("/tournament"); });
    (_c = document.getElementById("chatBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () { return (0, main_js_1.navigate)("/chat"); });
    var userId = localStorage.getItem('userId'); // EJEMPLO: Reemplaza con el ID de usuario real (e.g., state.currentUser.id)
    console.log("id entrar home: ", userId);
    var userIdPlaceholder = userId ? parseInt(userId, 10) : null;
}
