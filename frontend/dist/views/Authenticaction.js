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
export function AuthView(app, state) {
    var _a;
    app.innerHTML = `
    <div class="text-center mb-4">
      <h1 class="text-poke-yellow text-2xl">POKéMON</h1>
      <p class="text-poke-light text-xs">PONG</p>
    </div>
    <div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg">
      <h2 class="text-sm leading-relaxed mb-4">Authentication</h2>
      <p class="text-sm mb-4">
        ${t("enter_code_mail")}
      </p>
      <input type="text" id="mailEnter" placeholder="${t("code")}"
        class="border-2 border-pixel-black px-4 py-2 mb-4 w-full" />
      <div class="flex justify-center">
        <button id="mailButton"
          class="bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded 
                 hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 hover:border-b-blue-800 active:animate-press active:border-b-blue-800">
          ${t("enter_code")}
        </button>
      </div>
    </div>
  `;
    (_a = document.getElementById("mailButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        const emailInput = document.getElementById("mailEnter");
        const code = emailInput.value.trim();
        const userIdStr = localStorage.getItem("userId"); // cojo el id del user, pero esta en tipo string
        const id = userIdStr ? parseInt(userIdStr, 10) : null; // paso a int
        console.log(id);
        console.log(code);
        if (!code) {
            alert("Introduce el codigo");
            return;
        }
        try {
            const response = yield fetch("http://localhost:8085/api/verify_2fa.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, code })
            });
            const text = yield response.text();
            let data;
            try {
                data = JSON.parse(text);
            }
            catch (_a) {
                alert("Error inesperado del servidor");
                return;
            }
            if (!response.ok) {
                alert("Error: " + (data.error || "Bad Request"));
                return;
            }
            alert("Codigo correcto");
            localStorage.setItem("tokenUser", data.details); // Guardo token
            navigate("/");
        }
        catch (err) {
            console.error(err);
            alert("Error de conexión con el servidor");
        }
    }));
}
