import { navigate } from "../main.js";
import { t } from "../translations/index.js";
import { ChatView } from "./Chat.js";

// !!! IMPORTANTE: REEMPLAZA ESTE VALOR !!!
// Debe ser el ID del usuario actualmente logueado. Podría venir de 'state', de un token JWT decodificado, etc.


export function FriendsView(app: HTMLElement, state: any): void {
    app.innerHTML = `
        <div class="flex justify-center gap-6 max-w-6xl mx-auto">
        <!-- Columna izquierda: amigos -->
        <div id="friendsSection" class="flex-1 bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-8 rounded-2xl shadow-lg flex flex-col items-center text-center space-y-4 max-w-3xl">
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
                <div id="friendsContent" class="w-full h-full overflow-y-auto pr-2 space-y-2"></div>
            </div>
    
            <button id="backBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 mt-6 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press">
                ${t("goBack")}
            </button>
        </div>
    
        <!-- Columna derecha: chat -->
        <div id="chatSection" class="flex-1 hidden">
        </div>
        </div>
    `;
  
    const userId = localStorage.getItem('userId'); // EJEMPLO: Reemplaza con el ID de usuario real (e.g., state.currentUser.id)
    console.log("id entrar friends: ", userId);
    const userIdPlaceholder = userId ? parseInt(userId, 10) : null; // ESO ES EL NUMERO ID AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

    const content = document.getElementById("friendsContent") as HTMLElement;

    // --- LÓGICA ASÍNCRONA PARA CARGAR LA LISTA DE AMIGOS ---
    const fetchFriendList = async (): Promise<string> => {
        const token = localStorage.getItem('tokenUser');
        if (!token) {
            return `<p class="text-red-500">${t("error_no_login") || "Error: No se ha iniciado sesión."}</p>`;
        }
        console.log("tt:", token);
        const userId = localStorage.getItem('userId'); // EJEMPLO: Reemplaza con el ID de usuario real (e.g., state.currentUser.id)
        console.log("id entrar friends: ", userId);
        const userIdPlaceholder = userId ? parseInt(userId, 10) : null;
    
        try {
            console.log("User ID:", userIdPlaceholder);
            const response = await fetch(`http://localhost:8085/api/friends.php?id=${userIdPlaceholder}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            const data = await response.json();
            console.log("Friends data:", data);
    
            // Ajuste importante: tu backend devuelve { success: [...] }
            const friends = Array.isArray(data.success) ? data.success : [];
    
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
                    ${friends.map((friend: any, i: number) => `
                        <li class="flex items-center justify-between bg-white bg-opacity-70 p-3 rounded border border-poke-dark">
                            <div class="flex items-center gap-3">
                                <img src="/assets/avatar${(i % 9) + 1}.png" class="w-10 h-10 rounded-full" />
                                <div class="text-left">
                                    <div class="text-sm font-medium">${friend.username}</div>
                                    <div class="text-xs text-poke-dark">Online</div>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button id="msg-${friend.id}" class="msg-btn px-3 py-1 bg-poke-blue bg-opacity-80 text-poke-light rounded border-2 border-poke-blue active:animate-press">${t("message")}</button>
                                <button data-friend-id="${friend.id}" class="remove-friend-btn px-3 py-1 bg-poke-red bg-opacity-80 text-poke-light rounded border-2 border-poke-red active:animate-press">${t("remove")}</button>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            `;
    
        } catch (error) {
            console.error("Error fetching friend list:", error);
            return `<p class="text-red-500">${t("error_network") || "Error de red."}</p>`;
        }
    };
    
    

    // --- FUNCIÓN PARA ASIGNAR LISTENERS DESPUÉS DE LA CARGA ---
    const setupListListeners = (container: HTMLElement) => {
        // Configura el evento para ir al chat
        container.querySelectorAll('.msg-btn').forEach(btn => {
            btn.addEventListener("click", (e) => {
                const chatContainer = document.getElementById("chatSection") as HTMLElement;
                if (!chatContainer) return;
        
                chatContainer.classList.remove("hidden"); // Muestra el chat
                chatContainer.innerHTML = ""; // Limpia por si acaso
                ChatView(chatContainer, state); // Renderiza el chat en ese contenedor
            });
        });

        // Configura el evento para eliminar amigo
        container.querySelectorAll('.remove-friend-btn').forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const friendId = (e.currentTarget as HTMLElement).dataset.friendId;
                if (!friendId) return;

                if (confirm(t("confirm_remove_friend") || `¿Estás seguro de que quieres eliminar al amigo con ID ${friendId}?`)) {
                    // Lógica para el DELETE (tu PHP usa POST, lo simulamos aquí)
                    const token = localStorage.getItem('tokenUser');
                    console.log(userIdPlaceholder);
                    console.log(friendId); 
                    try {
                        const response = await fetch('http://localhost:8085/api/friends.php', {
                            method: 'POST', // Tu backend usa POST para DELETE
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                user_id: userIdPlaceholder,
                                friend_id: friendId,
                            })
                        });
                        const data = await response.json();
                        console.log("Friends data:", data);
                
                        // Ajuste importante: tu backend devuelve { success: [...] }
                        const friends = Array.isArray(data.success) ? data.success : [];
                        console.log("Friends:", friends);
                        if (response.ok) {
                            alert(data.message || `Remove`);
            
                            // Refrescar lista de solicitudes
                            const reqHtml = await requestsList();
                            container.innerHTML = reqHtml;
                            setupRequestListeners(container);
            
                            // Refrescar lista de amigos si la pestaña está activa
                            if (document.getElementById("friendsContent")?.dataset.tab === "list") {
                                const listHtml = await fetchFriendList();
                                container.innerHTML = listHtml;
                                setupListListeners(container);
                            }
                        } else {
                            alert(data.message || `Error al hacer remove`);
                        }

                    } catch (error) {
                        alert(t("error_network_remove") || "Error de red al intentar eliminar.");
                    }
                }
            });
        });
    };

    

     /* const requestsList = async (): Promise<string> => {
        const token = localStorage.getItem('tokenUser');
        if (!token) return `<p class="text-red-500">${t("error_no_login")}</p>`;
    
        try {
            const response = await fetch(`http://localhost:8085/api/friend_request.php?id=${userIdPlaceholder}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            const data: { success: { sender_id: number; created_at: string }[] } = await response.json();
    
            if (!response.ok || !Array.isArray(data.success)) {
                return `<p class="text-red-500">Error al cargar solicitudes.</p>`;
            }
    
            const requests = data.success;
            if (requests.length === 0) {
                return `<p class="mt-4 text-center text-poke-dark">${t("no_request_yet")}</p>`;
            }
    
            return `
                <h2 class="text-lg mb-3">${t("request_list")}</h2>
                <ul class="space-y-2">
                    ${requests.map(r => `
                        <li class="flex items-center justify-between bg-white bg-opacity-70 p-3 rounded border border-poke-dark">
                            <div class="flex items-center gap-3">
                                <img src="/assets/avatar${(r.sender_id % 9) + 1}.png" class="w-10 h-10 rounded-full" />
                                <div class="text-left">
                                    <div class="text-sm font-medium">Usuario #${r.sender_id}</div>
                                    <div class="text-sm text-poke-dark">${r.created_at}</div>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button class="accept-btn px-3 py-1 bg-poke-blue bg-opacity-80 text-poke-light rounded" data-sender-id="${r.sender_id}">
                                    ${t("accept")}
                                </button>
                                <button class="decline-btn px-3 py-1 bg-poke-red bg-opacity-80 text-poke-light rounded" data-sender-id="${r.sender_id}">
                                    ${t("decline")}
                                </button>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            `;
        } catch (err) {
            console.error(err);
            return `<p class="text-red-500">${t("error_network")}</p>`;
        }
    }; */

    const requestsList = async (): Promise<string> => {
    const token = localStorage.getItem('tokenUser');
    console.log("tt:", token);
    if (!token) return `<p class="text-red-500">${t("error_no_login")}</p>`;

    try {
        // Traer solicitudes de amistad
        const response = await fetch(`http://localhost:8085/api/friend_request.php?id=${userIdPlaceholder}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data: { success: { sender_id: number; created_at: string }[] } = await response.json();

        if (!response.ok || !Array.isArray(data.success)) {
            return `<p class="text-red-500">Error al cargar solicitudes.</p>`;
        }

        const requests = data.success;

        if (requests.length === 0) {
            return `<p class="mt-4 text-center text-poke-dark">${t("no_request_yet")}</p>`;
        }

        console.log("ee ");
        // Traer usernames de cada sender_id
        const usernames = await Promise.all(
            requests.map(async r => {
                try {
                    const res = await fetch(`http://localhost:8085/api/users.php?id=${r.sender_id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    /* if (!res.ok) throw new Error("Error al obtener username");
                    const userData = await res.json();
                    console.log("ee ", userData);
                    return userData.username || `Usuario #${r.sender_id}`; */
                    const text1 = await res.text();
                    console.log("Raw response:", text1);

                    let dd;
                    try {
                        dd = JSON.parse(text1);
                    } catch {
                        console.error("No se pudo parsear JSON:", text1);
                        dd = { error: "invalid_json", raw: text1 };
                    }
                    const receiverId = dd.success?.username;
                    return receiverId;
                } catch {
                    console.log("sta mal ");
                    return `Usuario #${r.sender_id}`;
                }
            })
        );

        console.log("ee ", usernames[0]);
        return `
            <h2 class="text-lg mb-3">${t("request_list")}</h2>
            <ul class="space-y-2">
                ${requests.map((r, i) => `
                    <li class="flex items-center justify-between bg-white bg-opacity-70 p-3 rounded border border-poke-dark">
                        <div class="flex items-center gap-3">
                            <img src="/assets/avatar${(r.sender_id % 9) + 1}.png" class="w-10 h-10 rounded-full" />
                            <div class="text-left">
                                <div class="text-sm font-medium">${usernames[i]}</div>
                                <div class="text-sm text-poke-dark">${r.created_at}</div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button class="accept-btn px-3 py-1 bg-poke-blue bg-opacity-80 text-poke-light rounded" data-sender-id="${r.sender_id}">
                                ${t("accept")}
                            </button>
                            <button class="decline-btn px-3 py-1 bg-poke-red bg-opacity-80 text-poke-light rounded" data-sender-id="${r.sender_id}">
                                ${t("decline")}
                            </button>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;

    } catch (err) {
        console.error(err);
        return `<p class="text-red-500">${t("error_network")}</p>`;
    }
};
 

    /* const requestsList = async (): Promise<string> => {
        const token = localStorage.getItem('tokenUser');
        if (!token) return `<p class="text-red-500">${t("error_no_login")}</p>`;

        try {
            const response = await fetch(`http://localhost:8085/api/friend_request.php?id=${userIdPlaceholder}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data: { success: { sender_id: number; created_at: string }[] } = await response.json();

            if (!response.ok || !Array.isArray(data.success)) {
                return `<p class="text-red-500">Error al cargar solicitudes.</p>`;
            }

            const requests = data.success;
            if (requests.length === 0) {
                return `<p class="mt-4 text-center text-poke-dark">${t("no_request_yet")}</p>`;
            }

            const usernames = await Promise.all(
                requests.map(async (r) => {
                    try {
                        const res = await fetch(`http://localhost:8085/api/users.php?id=${r.sender_id}`);
                        if (!res.ok) throw new Error("Error al obtener username");
                        const userData = await res.json();
                        return userData.username || `Usuario #${r.sender_id}`;
                    } catch {
                        return `Usuario #${r.sender_id}`;
                    }
                })
            );

            return `
                <h2 class="text-lg mb-3">${t("request_list")}</h2>
                <ul class="space-y-2">
                    ${requests.map((r, i) => `
                        <li class="flex items-center justify-between bg-white bg-opacity-70 p-3 rounded border border-poke-dark">
                            <div class="flex items-center gap-3">
                                <img src="/assets/avatar${(r.sender_id % 9) + 1}.png" class="w-10 h-10 rounded-full" />
                                <div class="text-left">
                                    <div class="text-sm font-medium">${usernames[i]}</div>
                                    <div class="text-sm text-poke-dark">${r.created_at}</div>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button class="accept-btn px-3 py-1 bg-poke-blue bg-opacity-80 text-poke-light rounded" data-sender-id="${r.sender_id}">
                                    ${t("accept")}
                                </button>
                                <button class="decline-btn px-3 py-1 bg-poke-red bg-opacity-80 text-poke-light rounded" data-sender-id="${r.sender_id}">
                                    ${t("decline")}
                                </button>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            `;
        } catch (err) {
            console.error(err);
            return `<p class="text-red-500">${t("error_network")}</p>`;
        }
    }; */


    const setupRequestListeners = (container: HTMLElement) => {
        const token = localStorage.getItem('tokenUser');
        if (!token) return;
    
        const handleAction = async (senderId: number, action: 'accept' | 'decline') => {
            try {
                const response = await fetch('http://localhost:8085/api/friend_request.php', {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender_id: senderId,
                        receiver_id: userIdPlaceholder,
                        action
                    })
                });
    
                const text = await response.text(); // Leer body solo una vez
                let data;
                try { data = JSON.parse(text); } catch {
                    console.error(`Respuesta inesperada del servidor al ${action}:`, text);
                    alert("Error al procesar la solicitud: " + text);
                    return;
                }
    
                if (response.ok) {
                    alert(data.message || `Solicitud ${action}ada`);
    
                    // Refrescar lista de solicitudes
                    const reqHtml = await requestsList();
                    container.innerHTML = reqHtml;
                    setupRequestListeners(container);
    
                    // Refrescar lista de amigos si la pestaña está activa
                    if (document.getElementById("friendsContent")?.dataset.tab === "list") {
                        const listHtml = await fetchFriendList();
                        container.innerHTML = listHtml;
                        setupListListeners(container);
                    }
                } else {
                    alert(data.message || `Error al ${action} la solicitud`);
                }
    
            } catch (err) {
                console.error(`Error de red al ${action} solicitud:`, err);
                alert(`Error de red al ${action} la solicitud`);
            }
        };
    
        // --- Botones Accept ---
        container.querySelectorAll<HTMLButtonElement>('.accept-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const senderId = parseInt(btn.dataset.senderId!);
                if (!senderId) return;
                handleAction(senderId, 'accept');
            });
        });
    
        // --- Botones Decline ---
        container.querySelectorAll<HTMLButtonElement>('.decline-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const senderId = parseInt(btn.dataset.senderId!);
                if (!senderId) return;
                handleAction(senderId, 'decline');
            });
        });
    };
        
    
    
    

    /* const fetchFriendRequests = async () => {
        const token = localStorage.getItem('tokenUser');
        if (!token) {
          return `<p class="text-red-500">${t("error_no_login") || "Error: No se ha iniciado sesión."}</p>`;
        }
      
        try {
          const response = await fetch(`http://localhost:8085/api/friend_request.php?id=${userIdPlaceholder}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
      
          const data = await response.json();
          console.log("Friend Requests:", data);
      
          if (response.ok && Array.isArray(data.content)) {
            const requests = data.content;
      
            if (requests.length === 0) {
              return `
                <h2 class="text-lg mb-3">${t("requests")}</h2>
                <p class="mt-4 text-center text-poke-dark">
                  ${t("no_friend_requests") || "No tienes solicitudes pendientes."}
                </p>
              `;
            }
      
            // Renderiza las solicitudes
            return `
              <h2 class="text-lg mb-3">${t("requests")}</h2>
              <ul class="space-y-3">
                ${requests.map((req: any, i: number) => `
                  <li class="p-3 rounded border border-poke-dark bg-white bg-opacity-80 flex justify-between items-center">
                    <div>
                      <div class="font-medium">${req.sender_name || "Usuario #" + req.sender_id}</div>
                      <div class="text-xs text-poke-dark">${t("wants_to_be_your_friend") || "Quiere ser tu amigo"}</div>
                    </div>
                    <div class="flex gap-2">
                      <button 
                        class="accept-btn px-3 py-1 bg-poke-blue text-poke-light rounded" 
                        data-sender-id="${req.sender_id}">
                        ${t("accept")}
                      </button>
                      <button 
                        class="decline-btn px-3 py-1 bg-poke-red text-poke-light rounded" 
                        data-sender-id="${req.sender_id}">
                        ${t("decline")}
                      </button>
                    </div>
                  </li>
                `).join('')}
              </ul>
            `;
          } else {
            return `<p class="text-red-500">${data.message || "Error al cargar las solicitudes."}</p>`;
          }
        } catch (error) {
          console.error("Error fetching friend requests:", error);
          return `<p class="text-red-500">${t("error_network") || "Error de red."}</p>`;
        }
      }; */

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
    const switchTab = async (tab: keyof typeof sections) => {
      const inner = content;
      inner.style.opacity = '0';
      
      // Lógica especial para la pestaña "list" que requiere FETCH
      if (tab === "list") {
          inner.innerHTML = sections.list; // Muestra el estado de carga
          
          // Espera la respuesta del servidor
          const listHtml = await fetchFriendList(); 
          
          setTimeout(() => {
              inner.innerHTML = listHtml; // Inserta el contenido final
              inner.style.opacity = '1';
              setupListListeners(inner); // Asigna los eventos de Message/Remove
          }, 120);
          return;
      }

      if (tab === "requests") {
        // Mostrar estado de carga mientras se hace fetch
        inner.innerHTML = `
          <div class="text-center p-8">
            <p>${t("loading_requests") || "Cargando solicitudes..."}</p>
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-poke-blue mx-auto mt-4"></div>
          </div>
        `;
    
        // Obtener solicitudes del servidor
        console.log("antes de");
        const reqHtml = await requestsList();
        console.log("dess de");
    
        setTimeout(() => {
            inner.innerHTML = reqHtml;
            inner.style.opacity = '1';
    
            // Asignar listeners a los botones Accept / Decline
            setupRequestListeners(inner);
        }, 120);
    
        return;
    }    

      // Lógica para las otras pestañas ('add', 'requests')
      /* setTimeout(() => {
          inner.innerHTML = sections[tab];
          inner.style.opacity = '1';
  
          if (tab === "add") {
              const sendReqBtn = document.getElementById("sendReqBtn");
              const r_id_Input = document.getElementById("friendName") as HTMLInputElement;
              if (sendReqBtn) {
                  sendReqBtn.addEventListener("click", async () => {
                      const nameInput = document.getElementById("friendName") as HTMLInputElement | null;
                      if (!nameInput || !nameInput.value.trim()) return;
                      //alert("Request sent to " + nameInput.value.trim());
                      //aqui meto el fetch
                      const token = localStorage.getItem('tokenUser');
                      const receiver_str = r_id_Input.value.trim();
                      const receiver_id = receiver_str ? parseInt(receiver_str, 10) : null;
                      console.log({
                        token,
                        userIdPlaceholder,
                        receiver_id
                      });
                      try {
                        const response = await fetch("http://localhost:8085/api/friend_request.php", {
                            method: 'POST', // Tu backend usa POST para DELETE
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ sender_id: userIdPlaceholder, receiver_id : receiver_id })
                        });
                        if (!response.ok) {
                            alert("Error en el fetch de request");
                            return;
                          }

                        alert("Request realizada");
                      }
                      catch (err) {
                        console.error(err);
                        alert("Error de conexión con el servidor");
                      }
                      //nameInput.value = "";
                  });
              }
          }
      }, 120); */
      setTimeout(() => {
          inner.innerHTML = sections[tab];
          inner.style.opacity = '1';
  
          if (tab === "add") {
              const sendReqBtn = document.getElementById("sendReqBtn");
              const r_id_Input = document.getElementById("friendName") as HTMLInputElement;
              if (sendReqBtn) {
                  sendReqBtn.addEventListener("click", async () => {
                      const nameInput = document.getElementById("friendName") as HTMLInputElement | null;
                      if (!nameInput || !nameInput.value.trim()) return;
                      //alert("Request sent to " + nameInput.value.trim());
                      //aqui meto el fetch
                      const token = localStorage.getItem('tokenUser');
                      const username = r_id_Input.value.trim();
                      // aqui busco el id del username
                      console.log("antes");
                     try {
                        console.log("User ID ff:", userIdPlaceholder);
                         console.log("User ID ff:", username);
                        const response = await fetch(`http://localhost:8085/api/users.php?user=${username}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                
                        const text = await response.text();
                        console.log("Raw response:", text);

                        let data;
                        try {
                            data = JSON.parse(text);
                        } catch {
                            console.error("No se pudo parsear JSON:", text);
                            data = { error: "invalid_json", raw: text };
                        }
                        const receiverId = data.success?.user_id;
                        console.log("ID del usuario:", receiverId);
                        localStorage.setItem('lastFriendId', receiverId);
                     }catch (err) {
                        console.error(err);
                        alert("Error de conexión con el servidor");
                      }
                      const uu = localStorage.getItem('lastFriendId');
                      const receiver_id = uu ? parseInt(uu, 10) : null;
                      console.log("uu ", uu);
                      console.log({
                        token,
                        userIdPlaceholder,
                        receiver_id
                      });
                      try {
                        const response = await fetch("http://localhost:8085/api/friend_request.php", {
                            method: 'POST', // Tu backend usa POST para DELETE
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ sender_id: userIdPlaceholder, receiver_id : receiver_id })
                        });
                        if (!response.ok) {
                            alert("Error en el fetch de request");
                            return;
                          }

                        alert("Request realizada");
                      }
                      catch (err) {
                        console.error(err);
                        alert("Error de conexión con el servidor");
                      }
                      //nameInput.value = "";
                  });
              }
          }
      }, 120);
  };
  
    // --- LISTENERS DE NAVEGACIÓN ---
    // Carga la lista de amigos por defecto al inicio
    // Nota: Llama a 'switchTab' directamente, no necesita ser asíncrono
    window.addEventListener('load', () => switchTab("list")); 

    document.getElementById("friendsListBtn")?.addEventListener("click", () => switchTab("list"));
    document.getElementById("addFriendBtn")?.addEventListener("click", () => switchTab("add"));
    document.getElementById("requestsBtn")?.addEventListener("click", () => switchTab("requests"));
    document.getElementById("backBtn")?.addEventListener("click", () => navigate("/"));
    
    // Iniciar con la pestaña de lista de amigos
    switchTab("list");
}