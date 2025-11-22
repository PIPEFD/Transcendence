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
export function SettingsView(app, state) {
    var _a, _b, _c, _d, _e, _f;
    app.innerHTML = `
    <div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg">
        <h1 class="text-sm leading-relaxed mb-4">${t("settings")}</h1>

        <button id="cuseBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800">
            ${t("changeUser")}
        </button>

        <button id="cavtBtn" class="bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press active:border-b-blue-800">
            ${t("changeAvatar")}
        </button>

        <button id="cfrBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800">
            ${t("friends")}
        </button>

        <button id="clangBtn" class="bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press active:border-b-blue-800">
            ${t("changeLanguage")}
        </button>

        <button id="logoutBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800">
            ${t("disconect")}
        </button>

        <button id="gbcBtn" class="bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded mb-2 w-full hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press active:border-b-blue-800">
            ${t("goBack")}
        </button>
    </div>
  `;
    (_a = document.getElementById("cuseBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => navigate("/profile"));
    (_b = document.getElementById("cavtBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => navigate("/avatar"));
    (_c = document.getElementById("cfrBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => navigate("/friends"));
    (_d = document.getElementById("clangBtn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => navigate("/language"));
    (_e = document.getElementById("gbcBtn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => navigate("/"));
    (_f = document.getElementById("logoutBtn")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const user_id = localStorage.getItem("userId");
            const response = yield apiFetch(`${API_ENDPOINTS.LOGOUT}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id }),
            });
            const data = yield response.json();
            console.log("Logout response:", data);
            // Borrar JWT del localStorage y volver al inicio
            localStorage.removeItem('tokenUser');
            navigate("/register");
        }
        catch (err) {
            console.error("Error during logout:", err);
            alert("❌ " + err.message);
        }
    }));
}
