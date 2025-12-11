import { navigate } from "../main.js";
import { updateHeader } from "./Header.js";
import { t } from "../translations/index.js";
import { API_ENDPOINTS, apiFetch } from "../config/api.js";

/**
 * Función reutilizable para manejar la lógica de subida de archivos de avatar al backend.
 * @param file El objeto File (o Blob convertido a File) a subir.
 * @param state El estado actual de la aplicación.
 * @param previewElement Elemento opcional de vista previa a ocultar en caso de éxito.
 * @param saveBtnElement Botón opcional de guardar a ocultar en caso de éxito.
 */
async function uploadAvatarFile(
  file: File, 
  state: any, 
  previewElement?: HTMLElement, 
  saveBtnElement?: HTMLElement
) {
  const formData = new FormData();
  // El nombre 'avatar' debe coincidir con lo que espera tu backend para el archivo
  formData.append("avatar", file, file.name); 

  const userId = localStorage.getItem('userId');
  const userIdPlaceholder = userId ? parseInt(userId, 10) : null;
  formData.append("user_id", String(userIdPlaceholder)); 
  
  const token = localStorage.getItem('tokenUser');
  console.log("Iniciando subida: userId:", String(userIdPlaceholder), "token:", token);
  
  try {
    const response = await apiFetch(API_ENDPOINTS.UPLOAD, {
      method: 'POST',
      // No incluimos 'Content-Type', el navegador lo añade automáticamente con FormData
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const text = await response.text();
    console.log("Server response:", text);

    if (!response.ok) {
      alert("Error al subir avatar. Revisa la consola para la respuesta del servidor.");
      return;
    }

    // Éxito
    updateHeader(state);
    alert("Avatar subido correctamente!");
    
    // Ocultar elementos si están presentes (principalmente para la subida de usuario)
    previewElement?.classList.add("hidden"); 
    saveBtnElement?.classList.add("hidden");

    navigate("/settings"); 
    
  } catch (error) {
    console.error("Error al subir avatar:", error);
    alert(`${t("error_network") || "Error de red."}`);
  }
}

// --- Inicio de la Vista ---
export function AvatarView(app: HTMLElement, state: any): void {
  // --- PLANTILLA HTML MODIFICADA (Solo queda la sección de subida) ---
  app.innerHTML = `
    <div class="text-center mb-4">
        <h1 class="text-poke-yellow text-2xl">POKéMON</h1>
        <p class="text-poke-light text-xs">PONG</p>
    </div>

    <div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg">
        <h1 class="text-sm leading-relaxed mb-4">${t("upload_custom_avatar")}</h1>

        <div class="flex flex-col items-center">
          <input type="file" id="uploadAvatarInput" accept="image/*" class="hidden" />
          
          <button id="uploadAvatarBtn" class="bg-poke-blue bg-opacity-80 text-poke-light py-2 px-4 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press mb-4">
            ${t("upload_avatar")}
          </button>

          <button id="goBackBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press active:border-b-red-800">
            ${t("goBack")}
          </button>
          
          <img id="previewAvatar" class="w-32 h-32 rounded-full border-2 border-poke-dark hidden mb-2" alt="Avatar Preview" />
          
          <button id="saveUploadBtn" class="bg-poke-blue bg-opacity-80 text-poke-light py-2 px-4 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press hidden">
            ${t("select")}
          </button>
        </div>
    </div>
  `;

  // --- Lógica de Avatares Predefinidos ELIMINADA ---

  document.getElementById("goBackBtn")?.addEventListener("click", () => navigate("/settings"));
  
  // --- 2. Lógica de Subida de Avatar Local (Manejadores de eventos) ---
  const uploadBtn = document.getElementById("uploadAvatarBtn");
  const uploadInput = document.getElementById("uploadAvatarInput") as HTMLInputElement;
  const preview = document.getElementById("previewAvatar") as HTMLImageElement;
  const saveBtn = document.getElementById("saveUploadBtn");

  // Al hacer click en el botón, activa el input file oculto
  uploadBtn?.addEventListener("click", () => {
    uploadInput.click();
  });

  // Al seleccionar un archivo, muestra la vista previa y el botón de guardar
  uploadInput?.addEventListener("change", () => {
    if (!uploadInput.files || uploadInput.files.length === 0) return;
    const file = uploadInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target?.result as string;
      preview.classList.remove("hidden");
      saveBtn?.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  // Al hacer click en guardar, ejecuta la subida al backend
  saveBtn?.addEventListener("click", async () => {
    if (!uploadInput.files || uploadInput.files.length === 0) return;
    const file = uploadInput.files[0];
    
    // Usar la función de subida común, pasando los elementos a ocultar
    await uploadAvatarFile(file, state, preview, saveBtn);
  });
}