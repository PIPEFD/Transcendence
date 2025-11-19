"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameView = GameView;
var main_js_1 = require("../main.js");
function GameView(app, state) {
    var _a, _b, _c, _d;
    app.innerHTML = "\n    <div class=\"flex flex-col items-center justify-center h-full space-y-6\">\n      <h1 class=\"text-3xl text-poke-yellow font-bold\">POK\u00E9MON PONG</h1>\n      <div class=\"flex flex-col gap-4\">\n        <button id=\"btn1v1\" class=\"bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600\">\n          1v1 Local\n        </button>\n        <button id=\"btnVsAI\" class=\"bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600\">\n          Play vs AI\n        </button>\n        <button id=\"btn3Player\" class=\"bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600\">\n          3 Player\n        </button>\n        <button id=\"btnBack\" class=\"bg-poke-blue text-white py-2 px-6 rounded hover:bg-blue-600\">\n          Back\n        </button>\n      </div>\n    </div>\n  ";
    // Button event listeners
    (_a = document.getElementById("btn1v1")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return (0, main_js_1.navigate)("/1v1"); });
    (_b = document.getElementById("btnVsAI")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () { return (0, main_js_1.navigate)("/vsAI"); });
    (_c = document.getElementById("btn3Player")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () { return (0, main_js_1.navigate)("/3player"); });
    (_d = document.getElementById("btnBack")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () { return (0, main_js_1.navigate)("/"); });
}
