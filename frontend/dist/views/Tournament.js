import { navigate } from "../main.js";
export function TournamentView(app, state) {
    var _a, _b, _c, _d;
    app.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full space-y-6">

      <h1 class="text-3xl text-poke-yellow font-bold">Tournament</h1>

      <div class="flex flex-col gap-4">
        <button id="btn4" class="bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600">
          4 Players
        </button>

        <button id="btn8" class="bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600">
          8 Players
        </button>

        <button id="btn16" class="bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600">
          16 Players
        </button>

        <button id="btnBack" class="bg-poke-blue text-white py-2 px-6 rounded hover:bg-blue-600">
          Back
        </button>
      </div>

    </div>
  `;
    // botones
    (_a = document.getElementById("btn4")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => navigate("/tournament4"));
    (_b = document.getElementById("btn8")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => navigate("/tournament8"));
    (_c = document.getElementById("btn16")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => navigate("/tournament16"));
    (_d = document.getElementById("btnBack")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => navigate("/"));
}
