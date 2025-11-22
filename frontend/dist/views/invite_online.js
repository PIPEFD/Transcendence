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
import { t } from "../translations/index.js";
import { API_ENDPOINTS, apiFetch } from "../config/api.js";
import { fetchAvatarUrl } from "./Header.js";
// ... (Resto de las importaciones) ...
export function InviteView(app) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        app.innerHTML = `
        <div class="flex justify-center gap-6 max-w-6xl mx-auto">
        <div id="friendsSection" class="flex-1 bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-8 rounded-2xl shadow-lg flex flex-col items-center text-center space-y-4 max-w-3xl">
            <h1 class="text-xl font-bold mb-4">${t("Choose a friend")}</h1>
    
            <div id="friendsContentOuter" class="w-full bg-white bg-opacity-40 border-2 border-poke-dark rounded-lg p-4 overflow-hidden" style="height: 400px;">
                <div id="friendsContent" class="w-full h-full overflow-y-auto pr-2 space-y-2">
                    <p class="text-center mt-8">${t("loading_friends") || "Cargando amigos..."}</p>
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-poke-blue mx-auto mt-4"></div>
                </div>
            </div>
    
            <button id="backBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 mt-6 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press">
                ${t("goBack")}
            </button>
        </div>
    
        <div id="chatSection" class="flex-1 hidden">
        </div>
        </div>
    `;
        const userId = localStorage.getItem('userId');
        const userIdPlaceholder = userId ? parseInt(userId, 10) : null;
        const content = document.getElementById("friendsContent");
        // --- LÓGICA ASÍNCRONA PARA CARGAR LA LISTA DE AMIGOS ---
        const fetchFriendList = () => __awaiter(this, void 0, void 0, function* () {
            const token = localStorage.getItem('tokenUser');
            if (!token) {
                return `<p class="text-red-500">${t("error_no_login") || "Error: No se ha iniciado sesión."}</p>`;
            }
            const currentUserId = localStorage.getItem('userId');
            const currentUserIdPlaceholder = currentUserId ? parseInt(currentUserId, 10) : null;
            try {
                const response = yield apiFetch(`${API_ENDPOINTS.FRIENDS}?id=${currentUserIdPlaceholder}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = yield response.json();
                const friends = Array.isArray(data.success) ? data.success : [];
                if (friends.length === 0) {
                    return `
                    <h2 class="text-lg mb-3">${t("friends_list")}</h2>
                    <p class="mt-4 text-center text-poke-dark">${t("no_friends_yet") || "Aún no tienes amigos. ¡Añade algunos!"}</p>
                `;
                }
                const friendsWithAvatars = yield Promise.all(friends.map((friend) => __awaiter(this, void 0, void 0, function* () {
                    const friendId = friend.id || friend.user_id;
                    const avatarUrl = yield fetchAvatarUrl(friendId, token);
                    const avatarSrc = avatarUrl || "/assets/avatar_39.png";
                    return Object.assign(Object.assign({}, friend), { avatar_src: avatarSrc });
                })));
                // Genera el HTML con los datos de amigos reales
                return `
                <h2 class="text-lg mb-3">${t("friends_list")}</h2>
                <ul class="space-y-2">
                    ${friendsWithAvatars.map((friend) => {
                    const idAmigo = friend.id || friend.user_id;
                    return `
                        <li class="flex items-center justify-between bg-white bg-opacity-70 p-3 rounded border border-poke-dark gap-6">
                            
                            <div class="flex items-center gap-3 flex-grow mr-6"> 
                                <img src="${friend.avatar_src}" class="w-10 h-10 rounded-full" />
                                <div class="text-left">
                                    <div class="text-sm font-medium">${friend.username}</div>
                                    <div class="text-xs text-poke-dark">Online</div>
                                </div>
                            </div>
                            
                            <div class="flex gap-2 flex-shrink-0">
                                <button 
                                    data-friend-id="${idAmigo}" 
                                    class="invite-friend-btn px-3 py-1 bg-poke-blue bg-opacity-80 text-poke-light rounded border-2 border-poke-blue active:animate-press">
                                    ${t("invite")}
                                </button>
                            </div>
                        </li>
                    `;
                }).join('')}
                </ul>
            `;
            }
            catch (error) {
                console.error("Error fetching friend list:", error);
                return `<p class="text-red-500">${t("error_network") || "Error de red."}</p>`;
            }
        });
        const setupListListeners = (container) => {
            // Configura el evento para invitar amigo
            container.querySelectorAll('.invite-friend-btn').forEach(btn => {
                btn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                    const targetButton = e.currentTarget;
                    const friendId = targetButton.dataset.friendId;
                    console.log("friendId LEÍDO del botón:", friendId);
                    if (!friendId || friendId.trim() === "") {
                        console.error("ERROR: friendId es nulo o vacío. Deteniendo acción.");
                        alert("No se pudo obtener el ID del amigo a invitar.");
                        return;
                    }
                    // LOGICA DESPUES DE INVITAR
                    navigate("/1v1o");
                }));
            });
        };
        (_a = document.getElementById("backBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => navigate("/"));
        const friendListHtml = yield fetchFriendList();
        content.innerHTML = friendListHtml;
        setupListListeners(content);
    });
}
