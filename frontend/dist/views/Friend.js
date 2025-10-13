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
// !!! IMPORTANTE: REEMPLAZA ESTE VALOR !!!
// Debe ser el ID del usuario actualmente logueado. Podría venir de 'state', de un token JWT decodificado, etc.
const userId = localStorage.getItem('userId'); // EJEMPLO: Reemplaza con el ID de usuario real (e.g., state.currentUser.id)
const userIdPlaceholder = userId ? parseInt(userId, 10) : null; // ESO ES EL NUMERO ID AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
export function FriendsView(app, state) {
    var _a, _b, _c, _d;
    app.innerHTML = `
    <div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-8 rounded-2xl shadow-lg max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
        <h1 class="text-xl font-bold mb-4">${t("friends_center")}</h1>

        <div class="flex flex-wrap justify-around w-full mb-6 gap-3">
            <button id="friendsListBtn" class="tab-btn bg-poke-blue text-poke-light border-3 border-poke-blue border-b-blue-800 rounded px-4 py-2 hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press">
                ${t("friends_list")}
            </button>
            <button id="addFriendBtn" class="tab-btn bg-poke-red text-poke-light border-3 border-poke-red border-b-red-800 rounded px-4 py-2 hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press">
                ${t("add_friend")}
            </button>
            <button id="requestsBtn" class="tab-btn bg-poke-blue text-poke-light border-3 border-poke-blue border-b-blue-800 rounded px-4 py-2 hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press">
                ${t("requests")}
            </button>
        </div>

        <div id="friendsContentOuter" class="w-full bg-white bg-opacity-40 border-2 border-poke-dark rounded-lg p-4 overflow-hidden" style="height: 400px;">
            <div id="friendsContent" class="w-full h-full overflow-y-auto pr-2 space-y-2">
            </div>
        </div>

        <button id="backBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 mt-6 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press">
            ${t("goBack")}
        </button>
    </div>
    `;
    const content = document.getElementById("friendsContent");
    // --- LÓGICA ASÍNCRONA PARA CARGAR LA LISTA DE AMIGOS ---
    const fetchFriendList = () => __awaiter(this, void 0, void 0, function* () {
        // Asumiendo que el token JWT es necesario para 'checkJWT' en tu backend
        const token = localStorage.getItem('tokenUser');
        console.log(token);
        if (!token) {
            return `<p class="text-red-500">${t("error_no_login") || "Error: No se ha iniciado sesión."}</p>`;
        }
        try {
            // Llama al endpoint GET de tu PHP con el ID del usuario actual
            const response = yield fetch(`http://localhost:8085/api/friends.php?id=25`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("HOla1");
            console.log(userIdPlaceholder);
            const data = yield response.json();
            console.log("HOla2");
            // Verifica si la solicitud fue exitosa y si hay un array de contenido (tu getFriendList devuelve un array)
            if (response.ok && Array.isArray(data.content)) {
                const friends = data.content;
                console.log(friends);
                if (friends.length === 0) {
                    return `
                        <h2 class="text-lg mb-3">${t("friends_list")}</h2>
                        <p class="mt-4 text-center text-poke-dark">${t("no_friends_yet") || "Aún no tienes amigos. ¡Añade algunos!"}</p>
                    `;
                }
                // Genera el HTML con los datos de amigos reales
                return `
                    <h2 class="text-lg mb-3">${t("friends_list")}</h2>
                    <ul class="space-y-2">
                        ${friends.map((friend, i) => `
                            <li class="flex items-center justify-between bg-white bg-opacity-70 p-3 rounded border border-poke-dark">
                                <div class="flex items-center gap-3">
                                    <img src="/assets/avatar${(i % 9) + 1}.png" class="w-10 h-10 rounded-full" />
                                    <div class="text-left">
                                        <div class="text-sm font-medium">${friend.username}</div>
                                        <div class="text-xs text-poke-dark">Online</div>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button id="msg-${friend.user_id}" class="msg-btn px-3 py-1 bg-poke-blue bg-opacity-80 text-poke-light rounded border-2 border-poke-blue active:animate-press">${t("message")}</button>
                                    <button data-friend-id="${friend.user_id}" class="remove-friend-btn px-3 py-1 bg-poke-red bg-opacity-80 text-poke-light rounded border-2 border-poke-red active:animate-press">${t("remove")}</button>
                                </div>
                            </li>
                        `).join('')}
                    </ul> 
                `;
            }
            else {
                return `<p class="text-red-500">${data.message || t("no tienes amigos") || "Error al cargar la lista de amigos."}</p>`;
            }
        }
        catch (error) {
            console.error("Error fetching friend list:", error);
            return `<p class="text-red-500">${t("error_network") || "Error de red."}</p>`;
        }
    });
    // --- FUNCIÓN PARA ASIGNAR LISTENERS DESPUÉS DE LA CARGA ---
    const setupListListeners = (container) => {
        // Configura el evento para ir al chat
        container.querySelectorAll('.msg-btn').forEach(btn => {
            btn.addEventListener("click", () => navigate("/chat"));
        });
        // Configura el evento para eliminar amigo
        container.querySelectorAll('.remove-friend-btn').forEach(btn => {
            btn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                const friendId = e.currentTarget.dataset.friendId;
                if (!friendId)
                    return;
                if (confirm(t("confirm_remove_friend") || `¿Estás seguro de que quieres eliminar al amigo con ID ${friendId}?`)) {
                    // Lógica para el DELETE (tu PHP usa POST, lo simulamos aquí)
                    const token = localStorage.getItem('tokenUser');
                    try {
                        const response = yield fetch(`/api/friends.php`, {
                            method: 'POST', // Tu backend usa POST para DELETE
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ user_id: userIdPlaceholder, friend_id: parseInt(friendId) })
                        });
                        const result = yield response.json();
                        if (response.ok && result.success) {
                            alert(t("friend_removed_success") || "Amigo eliminado con éxito.");
                            switchTab("list"); // Recargar la lista después de eliminar
                        }
                        else {
                            alert(result.message || t("friend_removed_error") || "Error al intentar eliminar amigo.");
                        }
                    }
                    catch (error) {
                        alert(t("error_network_remove") || "Error de red al intentar eliminar.");
                    }
                }
            }));
        });
    };
    const sections = {
        // CONTENIDO DE LISTA: Se reemplaza por un estado de carga
        list: `
            <div class="text-center p-8">
                <p>${t("loading_friends") || "Cargando amigos..."}</p>
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-poke-blue mx-auto mt-4"></div>
            </div>
        `,
        add: `
            <h2 class="text-lg mb-3">${t("add_friend")}</h2>
            <div class="flex items-center gap-3">
                <input id="friendName" type="text" placeholder="${t("enter_friend_name")}" class="border-2 border-poke-dark px-4 py-2 rounded flex-1"/>
                <button id="sendReqBtn" class="ml-2 bg-poke-blue text-poke-light px-4 py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600">
                    ${t("send_request")}
                </button>
            </div>
            <p class="mt-4 text-sm text-poke-dark">${t("add_friend_hint")}</p>
        `,
        requests: `
            <h2 class="text-lg mb-3">${t("requests")}</h2>
            <div class="space-y-3">
                <div class="p-3 rounded border border-poke-dark bg-white bg-opacity-80 flex justify-between items-center">
                    <div>
                        <div class="font-medium">IncomingUser1</div>
                        <div class="text-xs text-poke-dark">Wants to be your friend</div>
                    </div>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 bg-poke-blue text-poke-light rounded">${t("accept")}</button>
                        <button class="px-3 py-1 bg-poke-red text-poke-light rounded">${t("decline")}</button>
                    </div>
                </div>
                <p class="text-sm text-poke-dark">${t("no_more_requests")}</p>
            </div>
        `
    };
    // La función principal 'switchTab' ahora es ASÍNCRONA
    const switchTab = (tab) => __awaiter(this, void 0, void 0, function* () {
        const inner = content;
        inner.style.opacity = '0';
        // Lógica especial para la pestaña "list" que requiere FETCH
        if (tab === "list") {
            inner.innerHTML = sections.list; // Muestra el estado de carga
            // Espera la respuesta del servidor
            const listHtml = yield fetchFriendList();
            setTimeout(() => {
                inner.innerHTML = listHtml; // Inserta el contenido final
                inner.style.opacity = '1';
                setupListListeners(inner); // Asigna los eventos de Message/Remove
            }, 120);
            return;
        }
        // Lógica para las otras pestañas ('add', 'requests')
        setTimeout(() => {
            inner.innerHTML = sections[tab];
            inner.style.opacity = '1';
            if (tab === "add") {
                const sendReqBtn = document.getElementById("sendReqBtn");
                if (sendReqBtn) {
                    sendReqBtn.addEventListener("click", () => {
                        const nameInput = document.getElementById("friendName");
                        if (!nameInput || !nameInput.value.trim())
                            return;
                        alert("Request sent to " + nameInput.value.trim());
                        nameInput.value = "";
                    });
                }
            }
        }, 120);
    });
    // --- LISTENERS DE NAVEGACIÓN ---
    // Carga la lista de amigos por defecto al inicio
    // Nota: Llama a 'switchTab' directamente, no necesita ser asíncrono
    window.addEventListener('load', () => switchTab("list"));
    (_a = document.getElementById("friendsListBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => switchTab("list"));
    (_b = document.getElementById("addFriendBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => switchTab("add"));
    (_c = document.getElementById("requestsBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => switchTab("requests"));
    (_d = document.getElementById("backBtn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => navigate("/"));
    // Iniciar con la pestaña de lista de amigos
    switchTab("list");
}
