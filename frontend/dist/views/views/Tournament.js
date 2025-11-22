"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentView = TournamentView;
var main_js_1 = require("../main.js");
function TournamentView(app, state) {
    var _a;
    app.innerHTML = "\n    <div class=\"text-center mb-4\">\n        <h1 class=\"text-poke-yellow text-2xl\">POK\u00E9MON</h1>\n        <p class=\"text-poke-light text-xs\">PONG</p>\n    </div>\n    <div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg\">\n        <h2 class=\"text-sm leading-relaxed mb-4\">TOURNAMENT</h2>\n        <p class=\"text-sm leading-relaxed mb-4\">Welcome, ".concat(state.player.alias || "Player", "! Classification.</p>\n        <button id=\"goBackBtn2\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 hover:border-b-blue-800 active:animate-press active:border-b-blue-800\">\n            Go Back\n        </button>\n    </div>\n  ");
    (_a = document.getElementById("goBackBtn2")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return (0, main_js_1.navigate)("/"); });
}
