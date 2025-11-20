import { navigate } from "../main.js";
import { t } from "../translations/index.js";
import { API_ENDPOINTS, apiFetch } from "../config/api.js";
import { wsService } from "../services/WebSocketService.js";

export function LoginView(app: HTMLElement, state: any): void {
  app.innerHTML = `
    <div class="text-center mb-4">
      <h1 class="text-poke-yellow text-2xl">POKéMON</h1>
      <p class="text-poke-light text-xs">PONG</p>
    </div>
    <div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg">
      <h2 class="text-sm leading-relaxed mb-4">${t("log_in")}</h2>
      <input type="text" id="username" placeholder="${t("_username")}"
        class="border-2 border-pixel-black px-4 py-2 mb-4 w-full" />
      <input type="password" id="password" placeholder="${t("password")}"
        class="border-2 border-pixel-black px-4 py-2 mb-4 w-full" />
      <div class="flex justify-center gap-4">
        <button id="loginBtn"
          class="bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press">
          ${t("log_in")}
        </button>
        <button id="back"
          class="bg-gradient-to-b from-poke-red to-red-700 text-poke-light py-2 border-3 border-poke-red border-b-red-900 rounded 
                 hover:from-red-500 hover:to-red-600 active:animate-press">
          ${t("back")}
        </button>
      </div>
      <div id="loginError" class="text-red-600 text-center mt-3 text-sm"></div>
    </div>
  `;

  const loginBtn = document.getElementById("loginBtn");
  const backBtn = document.getElementById("back");

  backBtn?.addEventListener("click", () => navigate("/register"));

  loginBtn?.addEventListener("click", async () => {
    const usernameInput = document.getElementById("username") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const errorDiv = document.getElementById("loginError")!;

    const username = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!username || !pass) {
      errorDiv.textContent = "Please fill in all fields";
      return;
    }

    try {
      const response = await apiFetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pass }),
      });

      const text = await response.text();
      console.log("Backend returned:", text);

      console.log("Backend returned:", JSON.stringify({ username, pass }));

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response from backend");
      }

      console.log("📦 Response data:", data);

      // Aquí comprobamos si hay error y lo mostramos
      if (data.error) {
        errorDiv.textContent = data.error;
        return; // ¡detenemos la navegación!
      }

      // Guardar userId siempre
      if (data.user_id) {
        localStorage.setItem("userId", String(data.user_id));
        console.log("✅ userId guardado:", data.user_id);
      }

      // ⚠️ MODO TEST: Si el backend devuelve el token directamente (sin 2FA)
      if (data.details && data.test_mode) {
        localStorage.setItem("tokenUser", data.details);
        console.log("✅ Login en modo test (sin 2FA)");
        console.log("✅ Token guardado:", data.details.substring(0, 50) + "...");
        
        // Verificar que se guardó
        const savedToken = localStorage.getItem("tokenUser");
        const savedUserId = localStorage.getItem("userId");
        console.log("🔍 Verificación - Token guardado:", !!savedToken);
        console.log("🔍 Verificación - UserId guardado:", savedUserId);
        
        // 🔌 CONECTAR WEBSOCKET después del login
        console.log("🔌 Conectando WebSocket después del login...");
        wsService.connect()
          .then(() => {
            console.log("✅ WebSocket conectado exitosamente");
            navigate("/choose");
          })
          .catch((error) => {
            console.error("❌ Error conectando WebSocket:", error);
            // Navegar de todas formas, el chat intentará reconectar
            navigate("/choose");
          });
        
        return;
      }

      // Guardar token JWT si viene en la respuesta (flujo normal)
      if (data.token) {
        localStorage.setItem("tokenUser", data.token);
        
        // 🔌 CONECTAR WEBSOCKET después del login normal
        console.log("🔌 Conectando WebSocket después del login...");
        wsService.connect()
          .then(() => {
            console.log("✅ WebSocket conectado exitosamente");
          })
          .catch((error) => {
            console.error("❌ Error conectando WebSocket:", error);
          });
      }

      // Si requiere 2FA
      if (data.pending_2fa) {
        navigate("/authentication");
      } else {
        navigate("/choose"); // login exitoso directo
      }

    } catch (err) {
      console.error("Network or server error:", err);
      errorDiv.textContent = "Network error. Backend unreachable.";
    }
  });
}
