import { navigate } from "../main.js";
export function GameView(app, state) {
    var _a, _b, _c, _d;
    app.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full space-y-6">
      <h1 class="text-3xl text-poke-yellow font-bold">POKéMON PONG</h1>
      <div class="flex flex-col gap-4">
        <button id="btn1v1" class="bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600">
          1v1 Local
        </button>
        <button id="btnVsAI" class="bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600">
          Play vs AI
        </button>
        <button id="btn3Player" class="bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600">
          3 Player
        </button>
        <button id="btnBack" class="bg-poke-blue text-white py-2 px-6 rounded hover:bg-blue-600">
          Back
        </button>
      </div>
    </div>
  `;
    // Button event listeners
    (_a = document.getElementById("btn1v1")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => navigate("/1v1"));
    (_b = document.getElementById("btnVsAI")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => navigate("/vsAI"));
    (_c = document.getElementById("btn3Player")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => navigate("/3player"));
    (_d = document.getElementById("btnBack")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => navigate("/"));
}
