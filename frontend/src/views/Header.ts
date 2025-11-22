import { navigate } from "../main.js";
import { API_ENDPOINTS } from "../config/api.js";

// --- fetchAvatarUrl (Corrección: Solo devuelve la URL temporal del Blob) ---

export async function fetchAvatarUrl(userId: number | null, token: string | null): Promise<string | null> {
    if (!userId || !token) return null;

    try {
        const response = await fetch(`${API_ENDPOINTS.USERS}?id=${userId}`, {
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
        const imageBlob = await response.blob();
        
        // 2. Si el Blob es un JSON, significa que el servidor falló.
        if (imageBlob.type.includes('application/json')) {
             // Si el Blob es JSON, léelo como texto para ver el error real
             const jsonText = await imageBlob.text();
             console.error("El servidor envió un error JSON en lugar de la imagen:", jsonText);
             return null;
        }

        // 3. Crea la URL temporal para usarla en el src del <img>
        const imageObjectURL = URL.createObjectURL(imageBlob);
        
        return imageObjectURL; // Devolvemos la URL temporal
        
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
