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
// Función async para obtener la URL del avatar
function fetchAvatarUrl(userId, token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId || !token)
            return null;
        try {
            const response = yield fetch('http://localhost:8085/api/avatar_photo.php', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId }),
            });
            // const text1 = await response.text(); // always read as text first
            // console.log("Raw response:", text1);
            // let dd;
            // try {
            //     dd = JSON.parse(text1);
            // } catch {
            //     console.error("No se pudo parsear JSON:", text1);
            //     dd = { error: "invalid_json", raw: text1 };
            // }
            const text = yield response.text();
            let data;
            console.log(text);
            console.log(data);
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
        }
        catch (error) {
            console.error("Error fetching avatar:", error);
            return null;
        }
    });
}
// Función normal que actualiza el header
export function updateHeader(state) {
    const header = document.querySelector("header");
    if (!header)
        return;
    const token = localStorage.getItem("tokenUser");
    const userId = localStorage.getItem('userId');
    const userIdPlaceholder = userId ? parseInt(userId, 10) : null;
    console.log("id entrar hh: ", userId);
    console.log("token: ", token);
    // Llamamos a la función async sin usar await
    fetchAvatarUrl(userIdPlaceholder, token).then((avatarUrl) => {
        // Determine avatar source
        let avatarSrc = "";
        if (avatarUrl) {
            avatarSrc = avatarUrl; // Avatar subido
        }
        else if (state.player.avatar !== null && state.player.avatar !== undefined) {
            if (typeof state.player.avatar === "number") {
                avatarSrc = `/assets/avatar_39.png`; // built-in avatar
                // `../../../backend/public/api/uploads/avatar_39.png`
            }
            else if (typeof state.player.avatar === "string") {
                avatarSrc = state.player.avatar; // base64 o URL guardado
            }
        }
        header.innerHTML = `
      <div class="relative flex items-center justify-center">
        <p class="text-lg font-bold">PONG</p>
        ${avatarSrc
            ? `<div class="absolute right-4 flex items-center space-x-2">
                  <img src="${avatarSrc}"
                       id="avBtn"
                       alt="avatar"
                       class="w-10 h-10 rounded-full cursor-pointer hover:opacity-80"/>
                  <img src="/assets/settings.png"
                       id="settingsBtn"
                       alt="settings"
                       class="w-10 h-10 rounded-full cursor-pointer hover:opacity-80"/>
               </div>`
            : ""}
      </div>
    `;
        const settingsBtn = document.getElementById("settingsBtn");
        const avBtn = document.getElementById("avBtn");
        if (settingsBtn)
            settingsBtn.addEventListener("click", () => navigate("/settings"));
        if (avBtn)
            avBtn.addEventListener("click", () => navigate("/menu"));
    });
}
