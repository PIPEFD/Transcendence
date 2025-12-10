import { navigate } from "../main.js";
import { t } from "../translations/index.js";
import { API_ENDPOINTS, apiFetch } from "../config/api.js";

export async function ProfileView(app: HTMLElement, state: any): Promise<void> {
  app.innerHTML = `
    <div class="text-center mb-4">
      <h1 class="text-poke-yellow text-2xl">POKéMON</h1>
      <p class="text-poke-light text-xs">PONG</p>
    </div>
    <div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg">
      <h2 class="text-sm leading-relaxed mb-4">${t("profile")}</h2>
      <p class="text-sm leading-relaxed mb-4">${t("welcome")}, <span id="userNameDisplay">Cargando...</span>! ${t("username_info")}</p>
      <input type="text" id="userEnter" placeholder="${t("new_username")}"
        class="border-2 border-pixel-black px-4 py-2 mb-4 w-full" />
        
      <p id="profileErrorMsg" class="text-poke-red text-center text-sm mb-2 hidden"></p>
      
      <div class="flex justify-center">
        <button id="userButton"
          class="bg-poke-blue bg-opacity-80 text-poke-light py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 hover:border-b-blue-800 active:animate-press active:border-b-blue-800">
          ${t("enter_username")}
        </button>   
      </div>
    </div>
  `;

  const input = document.getElementById("userEnter") as HTMLInputElement | null;
  const userButton = document.getElementById("userButton");
  const errorMsg = document.getElementById("profileErrorMsg") as HTMLElement;

  const userId = localStorage.getItem('userId');
    const userIdPlaceholder = userId ? parseInt(userId, 10) : null;
  
  if (userIdPlaceholder) {
        const token = localStorage.getItem('tokenUser');
        const userNameDisplay = document.getElementById("userNameDisplay");
        
        if (!token || !userNameDisplay) {
            userNameDisplay!.textContent = "Error de sesión";
            return;
        }

        try {
            const response = await apiFetch(`${API_ENDPOINTS.USER_INFO}?id=${userIdPlaceholder}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if (response.ok && data.success && data.success.username) {
                userNameDisplay.textContent = data.success.username;
            } else {
                console.error("No se pudo obtener el nombre de usuario:", data);
                userNameDisplay.textContent = "Usuario (Error API)";
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
            userNameDisplay.textContent = "Usuario (Error Red)";
        }
    } else {
        // Usuario no logueado
        document.getElementById("userNameDisplay")!.textContent = "Invitado";
    }
  
  userButton?.addEventListener("click", async () => {
    // Si el input no existe, salimos
    if (!input) return;

    // 1. Obtener y validar el nuevo nombre de usuario
    const newUsername = input.value.trim();
    console.log("username: ", newUsername);
    errorMsg.classList.add("hidden"); // Ocultar errores anteriores

    if (!newUsername) {
      errorMsg.textContent = t("error_empty_user");
      errorMsg.classList.remove("hidden");
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("No user logged in");
      return;
    }

    // 2. Llamada a la API con el nuevo nombre de usuario (newUsername)
    const response = await apiFetch(API_ENDPOINTS.USERS, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: parseInt(userId, 10),
        username: newUsername // **CORREGIDO: Usamos newUsername**
      })
    });
    
    // 3. Manejo de la respuesta
    if (!response.ok) {
      // Usamos el elemento de error para el feedback de la API
      errorMsg.textContent = "Error al actualizar el nombre de usuario o nombre ya tomado."; 
      errorMsg.classList.remove("hidden");
    } else {
      console.log("username changed, relog to apply changes");
      // Opcional: Si la API devuelve el usuario actualizado, puedes actualizar el estado aquí:
      // state.player.user = newUsername; 

      // 4. Navegación final
      if (state.player.avatar === 0) {
        navigate("/choose");
      } else {
        navigate("/");
      }
    }
  });
}