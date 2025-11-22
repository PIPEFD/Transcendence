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
import { API_ENDPOINTS } from "../config/api.js";
<<<<<<< HEAD
// Función async para obtener la URL del avatar
function fetchAvatarUrl(userId, token) {
=======
// --- fetchAvatarUrl (Corrección: Solo devuelve la URL temporal del Blob) ---
export function fetchAvatarUrl(userId, token) {
>>>>>>> frontEnd
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId || !token)
            return null;
        try {
<<<<<<< HEAD
            const response = yield fetch(API_ENDPOINTS.AVATAR_PHOTO, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId }),
            });
            if (!response.ok) {
                console.error("Error fetching avatar:", response.status);
                return null;
            }
            const data = yield response.json();
            console.log("Avatar response:", data);
            // El backend puede devolver diferentes formatos:
            // { success: { avatar_url: "..." } } o { success: "..." }
            let avatarUrl = null;
            if (data.success) {
                if (typeof data.success === 'object' && data.success.avatar_url) {
                    avatarUrl = data.success.avatar_url;
                }
                else if (typeof data.success === 'string') {
                    avatarUrl = data.success;
                }
            }
            return avatarUrl;
=======
            const response = yield fetch(`${API_ENDPOINTS.USERS}?id=${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // No necesitamos Content-Type: application/json si esperamos una imagen
                },
            });
            if (!response.ok) {
                console.error("Error fetching avatar:", response.status);
                // El servidor envió un error (probablemente JSON)
                return null;
            }
            // 1. Lee el cuerpo como datos binarios (lo que el PHP debería enviar)
            const imageBlob = yield response.blob();
            // 2. Si el Blob es un JSON, significa que el servidor falló.
            if (imageBlob.type.includes('application/json')) {
                // Si el Blob es JSON, léelo como texto para ver el error real
                const jsonText = yield imageBlob.text();
                console.error("El servidor envió un error JSON en lugar de la imagen:", jsonText);
                return null;
            }
            // 3. Crea la URL temporal para usarla en el src del <img>
            const imageObjectURL = URL.createObjectURL(imageBlob);
            return imageObjectURL; // Devolvemos la URL temporal
>>>>>>> frontEnd
        }
        catch (error) {
            console.error("Error fetching avatar:", error);
            return null;
        }
    });
}
<<<<<<< HEAD
// Función normal que actualiza el header
=======
// --- updateHeader (Corrección: Usa la Blob URL en el HTML recién creado) ---
>>>>>>> frontEnd
export function updateHeader(state) {
    const header = document.querySelector("header");
    if (!header)
        return;
    const token = localStorage.getItem("tokenUser");
    const userId = localStorage.getItem('userId');
    const userIdPlaceholder = userId ? parseInt(userId, 10) : null;
<<<<<<< HEAD
    console.log("id entrar hh: ", userId);
    console.log("token: ", token);
    // Llamamos a la función async sin usar await
    fetchAvatarUrl(userIdPlaceholder, token).then((avatarUrl) => {
        console.log("Avatar URL obtenida:", avatarUrl);
        // Usar el avatar del endpoint si existe
        let avatarSrc = avatarUrl || "/assets/avatar_39.png"; // Avatar por defecto si no hay
        header.innerHTML = `
      <div class="relative flex items-center justify-center">
        <img src="/assets/logo.png" alt="PONG" class="h-12">
        <div class="absolute right-4 flex items-center space-x-2">
          <img src="${avatarSrc}"
               id="avBtn"
               alt="avatar"
               class="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 object-cover"/>
          <img src="/assets/settings.png"
               id="settingsBtn"
               alt="settings"
               class="w-10 h-10 rounded-full cursor-pointer hover:opacity-80"/>
        </div>
=======
    // Llamamos a la función async
    fetchAvatarUrl(userIdPlaceholder, token).then((avatarUrl) => {
        // 1. Usa la URL del Blob o un avatar por defecto
        // Si avatarUrl es null (error o JSON), usa el avatar por defecto
        let avatarSrc = avatarUrl || "/assets/avatar_39.png";
        // 2. Reemplaza el header y asigna la URL temporal a avBtn
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
>>>>>>> frontEnd
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
