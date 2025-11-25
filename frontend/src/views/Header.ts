import { navigate } from "../main.js";
import { API_ENDPOINTS } from "../config/api.js";
import { t } from "../translations/index.js";

// --- fetchAvatarUrl (Corrección: Solo devuelve la URL temporal del Blob) ---

export async function fetchAvatarUrl(userId: number | null, token: string | null): Promise<string | null> {
    if (!userId || !token) return null;

    try {
        // Primero intentar obtener la URL del avatar desde avatar_photo.php
        const avatarInfoResponse = await fetch(`${API_ENDPOINTS.AVATAR_PHOTO}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId })
        });

        if (avatarInfoResponse.ok) {
            const avatarData = await avatarInfoResponse.json();
            const avatarUrl = avatarData.success?.avatar_url;
            
            if (avatarUrl) {
                // Si es una URL de uploads, construir la URL completa
                if (avatarUrl.startsWith('/uploads/')) {
                    return `${API_ENDPOINTS.USERS.replace('/api/users.php', '')}${avatarUrl}`;
                }
                // Si es una URL completa o un path de assets
                return avatarUrl;
            }
        }

        // Si no hay avatar personalizado, intentar obtener la imagen del endpoint PATCH
        const response = await fetch(`${API_ENDPOINTS.USERS}?id=${userId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Error fetching avatar:", response.status);
            return null; 
        }

        // Lee el cuerpo como datos binarios
        const imageBlob = await response.blob();
        
        // Si el Blob es un JSON, significa que el servidor falló
        if (imageBlob.type.includes('application/json')) {
             const jsonText = await imageBlob.text();
             console.error("El servidor envió un error JSON en lugar de la imagen:", jsonText);
             return null;
        }

        // Crea la URL temporal para usarla en el src del <img>
        const imageObjectURL = URL.createObjectURL(imageBlob);
        
        return imageObjectURL;
        
    } catch (error) {
        console.error("Error fetching avatar:", error);
        return null;
    }
}


// --- updateHeader (Corrección: Usa la Blob URL en el HTML recién creado) ---

export function updateHeader(state: any): void {
    const header = document.querySelector("header");
    if (!header) return;

    const token = localStorage.getItem("tokenUser");
    const userId = localStorage.getItem('userId');
    const userIdPlaceholder = userId ? parseInt(userId, 10) : null;

    // Llamamos a la función async
    fetchAvatarUrl(userIdPlaceholder, token).then((avatarUrl) => {
        
        // 1. Usa la URL del Blob o un avatar por defecto
        // Si avatarUrl es null (error o JSON), usa el avatar por defecto
        let avatarSrc = avatarUrl || "/assets/avatar_39.png"; 

        // 2. Reemplaza el header y asigna la URL temporal a avBtn
        header.innerHTML = `
      <div class="relative flex items-center justify-center">
        <p class="text-lg font-bold">PONG</p>
        ${
          avatarSrc
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
            : ""
        }
      </div>
    `;

    const settingsBtn = document.getElementById("settingsBtn");
    const avBtn = document.getElementById("avBtn");

    if (settingsBtn) settingsBtn.addEventListener("click", () => navigate("/settings"));
    if (avBtn) avBtn.addEventListener("click", () => navigate("/menu"));
  });
}
