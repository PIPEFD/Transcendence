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
import { updateHeader } from "./Header.js";
import { t } from "../translations/index.js";
import { API_ENDPOINTS, apiFetch } from "../config/api.js";
<<<<<<< HEAD
export function AvatarView(app, state) {
    app.innerHTML = `
	<div class="text-center mb-4">
		<h1 class="text-poke-yellow text-2xl">POKéMON</h1>
		<p class="text-poke-light text-xs">PONG</p>
	</div>

	<div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg">
		<h1 class="text-sm leading-relaxed mb-4">${t("choose_avatar")}</h1>
		<div class="grid grid-cols-3 gap-4 mb-4">
			${Array.from({ length: 9 }, (_, i) => `
			  <div class="flex flex-col items-center">
				<img src="/assets/avatar${i + 1}.png" alt="Avatar ${i + 1}" class="w-20 h-20 mb-2 border-2 border-poke-dark rounded-lg shadow-md" />
				<button class="bg-poke-blue bg-opacity-80 text-poke-light py-1 px-2 text-sm border-2 border-poke-dark rounded hover:bg-gradient-to-b hover:from-poke-blue hover:to-blue-600 hover:bg-opacity-100 active:animate-press" data-avatar="${i + 1}">
				  ${t("select")}
				</button>
			  </div>
			`).join("")}
		</div>

		<!-- Upload Avatar Section -->
		<div class="flex flex-col items-center">
		  <input type="file" id="uploadAvatarInput" accept="image/*" class="hidden" />
		  <button id="uploadAvatarBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 px-4 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press mb-4">
			${t("upload_avatar")}
		  </button>
		  <img id="previewAvatar" class="w-32 h-32 rounded-full border-2 border-poke-dark hidden mb-2" />
		  <button id="saveUploadBtn" class="bg-poke-blue bg-opacity-80 text-poke-light py-2 px-4 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press hidden">
			${t("select")}
		  </button>
		</div>
	</div>
  `;
    // Select pre-defined avatars
    document.querySelectorAll("[data-avatar]").forEach(btn => {
        btn.addEventListener("click", () => {
            const value = btn.getAttribute("data-avatar");
            if (!value)
                return;
            state.player.avatar = Number(value);
            updateHeader(state);
            navigate("/register");
        });
    });
    // Upload custom avatar
=======
/**
 * Función reutilizable para manejar la lógica de subida de archivos de avatar al backend.
 * @param file El objeto File (o Blob convertido a File) a subir.
 * @param state El estado actual de la aplicación.
 * @param previewElement Elemento opcional de vista previa a ocultar en caso de éxito.
 * @param saveBtnElement Botón opcional de guardar a ocultar en caso de éxito.
 */
function uploadAvatarFile(file, state, previewElement, saveBtnElement) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        // El nombre 'avatar' debe coincidir con lo que espera tu backend para el archivo
        formData.append("avatar", file, file.name);
        const userId = localStorage.getItem('userId');
        const userIdPlaceholder = userId ? parseInt(userId, 10) : null;
        formData.append("user_id", String(userIdPlaceholder));
        const token = localStorage.getItem('tokenUser');
        console.log("Iniciando subida: userId:", String(userIdPlaceholder), "token:", token);
        try {
            const response = yield apiFetch(API_ENDPOINTS.UPLOAD, {
                method: 'POST',
                // No incluimos 'Content-Type', el navegador lo añade automáticamente con FormData
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const text = yield response.text();
            console.log("Server response:", text);
            if (!response.ok) {
                alert("Error al subir avatar. Revisa la consola para la respuesta del servidor.");
                return;
            }
            // Éxito
            updateHeader(state);
            alert("Avatar subido correctamente!");
            // Ocultar elementos si están presentes (principalmente para la subida de usuario)
            previewElement === null || previewElement === void 0 ? void 0 : previewElement.classList.add("hidden");
            saveBtnElement === null || saveBtnElement === void 0 ? void 0 : saveBtnElement.classList.add("hidden");
            navigate("/register");
        }
        catch (error) {
            console.error("Error al subir avatar:", error);
            alert(`${t("error_network") || "Error de red."}`);
        }
    });
}
// --- Inicio de la Vista ---
export function AvatarView(app, state) {
    // ... (Tu plantilla HTML sigue siendo la misma) ...
    app.innerHTML = `
    <div class="text-center mb-4">
        <h1 class="text-poke-yellow text-2xl">POKéMON</h1>
        <p class="text-poke-light text-xs">PONG</p>
    </div>

    <div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg">
        <h1 class="text-sm leading-relaxed mb-4">${t("choose_avatar")}</h1>
        <div class="grid grid-cols-3 gap-4 mb-4">
            ${Array.from({ length: 9 }, (_, i) => `
              <div class="flex flex-col items-center">
                <img src="/assets/avatar${i + 1}.png" alt="Avatar ${i + 1}" class="w-20 h-20 mb-2 border-2 border-poke-dark rounded-lg shadow-md" />
                <button class="bg-poke-blue bg-opacity-80 text-poke-light py-1 px-2 text-sm border-2 border-poke-dark rounded hover:bg-gradient-to-b hover:from-poke-blue hover:to-blue-600 hover:bg-opacity-100 active:animate-press" data-avatar="${i + 1}">
                  ${t("select")}
                </button>
              </div>
            `).join("")}
        </div>

        <div class="flex flex-col items-center">
          <input type="file" id="uploadAvatarInput" accept="image/*" class="hidden" />
          <button id="uploadAvatarBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 px-4 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press mb-4">
            ${t("upload_avatar")}
          </button>
          <img id="previewAvatar" class="w-32 h-32 rounded-full border-2 border-poke-dark hidden mb-2" />
          <button id="saveUploadBtn" class="bg-poke-blue bg-opacity-80 text-poke-light py-2 px-4 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press hidden">
            ${t("select")}
          </button>
        </div>
    </div>
  `;
    // --- 1. Lógica para avatares predefinidos (MODIFICADA) ---
    document.querySelectorAll("[data-avatar]").forEach(btn => {
        btn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            const avatarId = btn.getAttribute("data-avatar");
            if (!avatarId)
                return;
            const avatarPath = `/assets/avatar${avatarId}.png`;
            try {
                // 1. Obtener la imagen como un Blob/ArrayBuffer
                const response = yield fetch(avatarPath);
                if (!response.ok) {
                    throw new Error(`Error al cargar el asset: ${response.statusText}`);
                }
                const blob = yield response.blob();
                // 2. Crear un objeto File a partir del Blob
                // Usamos un nombre de archivo único o descriptivo
                const file = new File([blob], `avatar_predefinido_${avatarId}.png`, { type: blob.type });
                // 3. Usar la función de subida común
                yield uploadAvatarFile(file, state);
            }
            catch (error) {
                console.error("Error al seleccionar y subir avatar predefinido:", error);
                alert(`No se pudo cargar o subir la imagen predefinida`);
            }
        }));
    });
    // --- 2. Lógica de Subida de Avatar Local (AJUSTADA) ---
>>>>>>> frontEnd
    const uploadBtn = document.getElementById("uploadAvatarBtn");
    const uploadInput = document.getElementById("uploadAvatarInput");
    const preview = document.getElementById("previewAvatar");
    const saveBtn = document.getElementById("saveUploadBtn");
    uploadBtn === null || uploadBtn === void 0 ? void 0 : uploadBtn.addEventListener("click", () => {
<<<<<<< HEAD
        uploadInput.click(); // trigger file picker
=======
        uploadInput.click();
>>>>>>> frontEnd
    });
    uploadInput === null || uploadInput === void 0 ? void 0 : uploadInput.addEventListener("change", () => {
        if (!uploadInput.files || uploadInput.files.length === 0)
            return;
        const file = uploadInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            preview.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            preview.classList.remove("hidden");
            saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    });
    saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        if (!uploadInput.files || uploadInput.files.length === 0)
            return;
        const file = uploadInput.files[0];
<<<<<<< HEAD
        const formData = new FormData();
        formData.append("avatar", file);
        const userId = localStorage.getItem('userId'); // EJEMPLO: Reemplaza con el ID de usuario real (e.g., state.currentUser.id)
        console.log("id entrar upload: ", userId);
        const userIdPlaceholder = userId ? parseInt(userId, 10) : null;
        formData.append("user_id", String(userIdPlaceholder)); // asegúrate de tener el user ID
        const token = localStorage.getItem('tokenUser');
        console.log("userId:", String(userIdPlaceholder), "token:", token);
        // try {
        //   const res = await fetch("http://localhost:8085/api/upload.php", {
        //     method: "POST",
        //     body: formData,
        //   });
        //   const data = await res.json();
        //   if (!res.ok) {
        //     alert("Error al subir el avatar: " + data.error);
        //     return;
        //   }
        //   // Guardar la ruta recibida desde el backend en el estado
        //   state.player.avatar = data.path; 
        //   updateHeader(state);
        //   alert("Avatar subido correctamente!");
        //   navigate("/settings"); 
        // } catch (err) {
        //   console.error("Error al subir avatar:", err);
        //   alert("Error de conexión con el servidor");
        // }
        try {
            const response = yield apiFetch(API_ENDPOINTS.UPLOAD, {
                method: 'POST', // Tu backend usa POST para DELETE
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            // const responseText = await response.text();
            // console.log("Server response:", responseText);
            // const data = await response.json();
            // console.log("Friends data:", data);
            const text = yield response.text();
            console.log("Server response:", text);
            // Mostrar mensaje genérico si no quieres parsear JSON
            if (!response.ok) {
                alert("Error uploading avatar. Check console for server output.");
                return;
            }
            // Aquí no podemos parsear JSON porque PHP falla
            // Podrías usar un mensaje genérico
            alert("Avatar upload request sent (check server logs for details).");
            preview.classList.add("hidden"); // ocultar preview si quieres
            saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.classList.add("hidden");
            alert("Avatar subido correctamente!");
            navigate("/register");
        }
        catch (error) {
            console.error("Error fetching friend list:", error);
            return `<p class="text-red-500">${t("error_network") || "Error de red."}</p>`;
        }
=======
        // Usar la función de subida común, pasando los elementos a ocultar
        yield uploadAvatarFile(file, state, preview, saveBtn);
>>>>>>> frontEnd
    }));
}
