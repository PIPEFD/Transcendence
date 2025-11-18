var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { navigate } from "../main.js";
import { t } from "../translations/index.js";
import { API_ENDPOINTS, apiFetch } from "../config/api.js";
export function MatchHistoryView(app, state) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('tokenUser');
        let matches = [];
        try {
            const res = yield apiFetch(`${API_ENDPOINTS.MATCHES}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${state.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_id: userId })
            });
            const json = yield res.json();
            matches = (_a = json.data) !== null && _a !== void 0 ? _a : [];
        }
        catch (error) {
            console.error("Error fetching match history:", error);
            matches = [];
        }
        app.innerHTML = `
    <div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-6 rounded-lg shadow-lg max-w-sm mx-auto flex flex-col items-center text-center">
      <h1 class="text-sm leading-relaxed mb-4 font-bold">${t("matchHistory")}</h1>

      <div class="w-full mb-4">
        <div class="flex justify-between font-semibold border-b-2 border-poke-dark pb-2 mb-2">
          <span>${t("opponent")}</span>
          <span>${t("result")}</span>
          <span>${t("elo")}</span>
        </div>

        ${matches.map(m => `
          <div class="flex justify-between items-center p-2 border-2 border-poke-dark rounded mb-2 ${m.status === "win" ? "bg-green-100" : "bg-red-100"}">
            <span class="truncate">ID: ${m.against}</span>
            <span>${m.result}</span>
            <span>${m.elo}</span>
          </div>
        `).join("")}
      </div>

      <button id="goBackBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 px-6 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 hover:border-b-red-800 active:animate-press active:border-b-red-800">
        ${t("goBack")}
      </button>
    </div>
  `;
        (_b = document.getElementById("goBackBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => navigate("/menu"));
    });
}
