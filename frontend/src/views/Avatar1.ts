import { navigate } from "../main.js";
import { updateHeader } from "./Header.js";
import { t } from "../translations/index.js";
import { API_ENDPOINTS, apiFetch } from "../config/api.js";

export function AvatarView(app: HTMLElement, state: any): void {
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
	  if (!value) return;
	  state.player.avatar = Number(value);
	  updateHeader(state);
	  navigate("/register");
	});
  });

  // Upload custom avatar
  const uploadBtn = document.getElementById("uploadAvatarBtn");
  const uploadInput = document.getElementById("uploadAvatarInput") as HTMLInputElement;
  const preview = document.getElementById("previewAvatar") as HTMLImageElement;
  const saveBtn = document.getElementById("saveUploadBtn");

  uploadBtn?.addEventListener("click", () => {
	uploadInput.click(); // trigger file picker
  });

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

  saveBtn?.addEventListener("click", async () => {
	if (!uploadInput.files || uploadInput.files.length === 0) return;
	const file = uploadInput.files[0];
  
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
		const response = await apiFetch(API_ENDPOINTS.UPLOAD, {
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

  const text = await response.text();
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
  saveBtn?.classList.add("hidden");
	alert("Avatar subido correctamente!");
	navigate("/register"); 
	
	} catch (error) {
			console.error("Error fetching friend list:", error);
			return `<p class="text-red-500">${t("error_network") || "Error de red."}</p>`;
		}
  });
  
}
