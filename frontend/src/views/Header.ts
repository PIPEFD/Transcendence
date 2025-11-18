import { navigate } from "../main.js";
import { API_BASE_URL } from "../config.js";

// Función async para obtener la URL del avatar
async function fetchAvatarUrl(userId: number | null, token: string | null): Promise<string | null | undefined> {
  if (!userId || !token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/avatar_photo.php`, {
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
    const text = await response.text();
      let data: any;
      console.log(text);
      console.log(data);
      try { data = JSON.parse(text); } 
      catch { alert("Error inesperado del servidor"); return; }

      if (!response.ok) {
        alert("Error: " + (data.error || "Bad Request"));
        return;
      }

      alert("Codigo correcto");

  } catch (error) {
    console.error("Error fetching avatar:", error);
    return null;
  }
}


// Función normal que actualiza el header
export function updateHeader(state: any): void {
  const header = document.querySelector("header");
  if (!header) return;

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
    } else if (state.player.avatar !== null && state.player.avatar !== undefined) {
      if (typeof state.player.avatar === "number") {
        avatarSrc = `/assets/avatar_39.png`; // built-in avatar
        // `../../../backend/public/api/uploads/avatar_39.png`
      } else if (typeof state.player.avatar === "string") {
        avatarSrc = state.player.avatar; // base64 o URL guardado
      }
    }

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
