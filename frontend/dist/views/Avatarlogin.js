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
export function AvatarView1(app, state) {
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
		  <button id="uploadAvatarBtn1" class="bg-poke-red bg-opacity-80 text-poke-light py-2 px-4 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press mb-4">
			${t("upload_avatar")}
		  </button>
		  <img id="previewAvatar1" class="w-32 h-32 rounded-full border-2 border-poke-dark hidden mb-2" />
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
    const uploadBtn = document.getElementById("uploadAvatarBtn1");
    const uploadInput = document.getElementById("uploadAvatarInput");
    const preview = document.getElementById("previewAvatar1");
    const saveBtn = document.getElementById("saveUploadBtn");
    uploadBtn === null || uploadBtn === void 0 ? void 0 : uploadBtn.addEventListener("click", () => {
        uploadInput.click(); // trigger file picker
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
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("user_id", String(state.player.id)); // asegúrate de tener el user ID
        try {
            const res = yield fetch("/api/upload.php", {
                method: "POST",
                body: formData,
            });
            const data = yield res.json();
            if (!res.ok) {
                alert("Error al subir el avatar: " + data.error);
                return;
            }
            // Guardar la ruta recibida desde el backend en el estado
            state.player.avatar = data.path;
            updateHeader(state);
            alert("Avatar subido correctamente!");
            navigate("/register");
        }
        catch (err) {
            console.error("Error al subir avatar:", err);
            alert("Error de conexión con el servidor");
        }
    }));
}
