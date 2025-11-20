// src/views/Chat.ts
import { t } from "../translations/index.js";
import { wsService } from "../services/WebSocketService.js";
import { API_ENDPOINTS } from "../config/api.js";

export function ChatView(app: HTMLElement, state: any) {
  const userId = localStorage.getItem("userId");
  const userIdPlaceholder = userId ? parseInt(userId, 10) : null;
  let currentChatFriendId: number | null = null; // Trackear amigo actual

  app.innerHTML = `
    <div class="flex bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-2xl shadow-lg max-w-6xl mx-auto space-x-4" style="height: 600px;">
      
      <!-- Lista de amigos -->
      <div id="friendsListPanel" class="w-1/3 bg-white bg-opacity-60 border-r-2 border-poke-dark rounded-lg p-3 overflow-y-auto">
        <h2 class="text-lg font-bold text-center mb-2">${t("friends_list")}</h2>
        <div id="friendsListContainer" class="space-y-2"></div>
      </div>

      <!-- Chat principal -->
      <div id="chatPanel" class="flex-1 flex flex-col bg-white bg-opacity-40 border-2 border-poke-dark rounded-lg p-4">
        <div class="flex-1 flex flex-col items-center justify-center text-center text-poke-dark opacity-70" id="chatPlaceholder">
          ${t("select_friend_chat") || "Selecciona un amigo para chatear"}
        </div>
      </div>
    </div>
  `;

  const listContainer = document.getElementById("friendsListContainer") as HTMLElement;
  const chatPanel = document.getElementById("chatPanel") as HTMLElement;

  // Cargar lista de amigos desde la API
  const loadFriends = async () => {
    const token = localStorage.getItem("tokenUser");
    const userId = localStorage.getItem("userId");
    const userIdNum = userId ? parseInt(userId, 10) : null;

    console.log("🔍 Chat - Verificando credenciales:");
    console.log("  Token:", token ? `${token.substring(0, 30)}...` : "NULL");
    console.log("  UserId:", userId);
    console.log("  UserIdNum:", userIdNum);

    if (!token || !userIdNum) {
      console.error("❌ Chat - Falta token o userId");
      listContainer.innerHTML = `<p class="text-sm text-red-600">${t("error_no_login")}</p>`;
      return;
    }

    console.log("✅ Chat - Credenciales OK, cargando amigos...");

    try {
      const response = await fetch(`${API_ENDPOINTS.FRIENDS}?id=${userIdNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const friends = Array.isArray(data.success) ? data.success : [];

      if (friends.length === 0) {
        listContainer.innerHTML = `<p class="text-center text-gray-600">${t("no_friends_yet")}</p>`;
        return;
      }

      renderFriendsList(friends);
    } catch (err) {
      console.error(err);
      listContainer.innerHTML = `<p class="text-red-500">${t("error_network")}</p>`;
    }
  };

  // Función para renderizar lista de amigos con estados
  const renderFriendsList = (friends: any[]) => {
    listContainer.innerHTML = friends
      .map((f: any, i: number) => {
        const status = wsService.getUserStatus(String(f.id)) || 'offline';
        const statusColor = status === 'online' ? 'bg-green-500' : 
                           status === 'in-game' ? 'bg-yellow-500' : 
                           status === 'away' ? 'bg-orange-500' : 'bg-gray-400';
        const statusText = status === 'online' ? '🟢' : 
                          status === 'in-game' ? '🎮' : 
                          status === 'away' ? '🟠' : '⚫';
        
        return `
        <div class="friend-item flex items-center gap-3 p-2 bg-white bg-opacity-70 rounded cursor-pointer hover:bg-poke-blue hover:text-white transition"
             data-id="${f.id}" data-username="${f.username}">
          <div class="relative">
            <img src="/assets/avatar${(i % 9) + 1}.png" class="w-8 h-8 rounded-full" />
            <div class="absolute -bottom-1 -right-1 w-3 h-3 ${statusColor} rounded-full border-2 border-white" 
                 title="${status}"></div>
          </div>
          <div class="flex-1">
            <span class="font-medium">${f.username}</span>
            <span class="text-xs ml-2">${statusText}</span>
          </div>
        </div>
      `;
      })
      .join("");
  };

  // Función para abrir el chat con un amigo
  const openChat = (friendId: number, friendName: string) => {
    currentChatFriendId = friendId; // Guardar ID del amigo actual
    console.log(`💬 Abriendo chat con ${friendName} (ID: ${friendId})`);
    
    chatPanel.innerHTML = `
      <div class="flex flex-col w-full h-full">
        <div class="border-b border-poke-dark pb-2 mb-2 font-bold" data-friend-id="${friendId}">${friendName}</div>

        <div id="messagesContainer" class="flex-1 overflow-y-auto space-y-2 text-left pr-2 bg-white bg-opacity-40 border border-poke-dark rounded p-3">
          <div class="text-center text-sm text-poke-dark opacity-70">${t("chat_welcome")} ${state.player.alias || t("player")}!</div>
        </div>

        <div class="mt-3 flex gap-2">
          <input id="chatInput" type="text" placeholder="${t("type_message")}" class="flex-1 border-2 border-poke-dark px-3 py-2 rounded focus:outline-none" />
          <button id="sendMsgBtn" class="bg-poke-blue text-white px-4 py-2 rounded">${t("send")}</button>
        </div>
      </div>
    `;

    const msgContainer = document.getElementById("messagesContainer")!;
    const msgInput = document.getElementById("chatInput") as HTMLInputElement;
    const sendBtn = document.getElementById("sendMsgBtn")!;

    const sendMessage = () => {
      const text = msgInput.value.trim();
      if (!text) return;
      
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('❌ No userId found');
        return;
      }
      
      // Verificar que el WebSocket esté conectado
      if (!wsService.isConnected()) {
        console.error('❌ WebSocket no conectado');
        alert('Error: No hay conexión con el servidor. Reconectando...');
        wsService.connect().then(() => {
          console.log('✅ Reconectado, intenta enviar de nuevo');
        });
        return;
      }
      
      // Enviar mensaje vía WebSocket
      console.log(`📤 Enviando mensaje a ${currentChatFriendId}:`, text);
      const success = wsService.send({
        type: 'chat-friends',
        userId: userId,
        receiverId: String(currentChatFriendId),
        message: text
      });
      
      if (success) {
        // Mostrar mensaje localmente solo si se envió exitosamente
        const msgEl = document.createElement("div");
        msgEl.className = "bg-poke-blue text-white p-2 rounded-xl max-w-[80%] ml-auto shadow text-sm";
        msgEl.textContent = text;
        msgContainer.appendChild(msgEl);
        msgInput.value = "";
        msgContainer.scrollTop = msgContainer.scrollHeight;
      } else {
        console.error('❌ Failed to send message via WebSocket');
        alert('Error: No se pudo enviar el mensaje. Intenta de nuevo.');
      }
    };

    sendBtn.addEventListener("click", sendMessage);
    msgInput.addEventListener("keypress", (e) => e.key === "Enter" && sendMessage());
  };

  // Vincular clics de la lista con el chat
  listContainer.addEventListener("click", (e) => {
    const item = (e.target as HTMLElement).closest(".friend-item") as HTMLElement;
    if (!item) return;
    const id = parseInt(item.dataset.id!, 10);
    const name = item.dataset.username!;
    openChat(id, name);
  });

  // Cargar lista de amigos al iniciar
  loadFriends();
  
  // Conectar WebSocket si no está conectado
  if (!wsService.isConnected()) {
    console.log('🔌 WebSocket no conectado, conectando...');
    wsService.connect().then(() => {
      console.log('✅ WebSocket conectado desde ChatView');
      wsService.getOnlineUsers();
    }).catch(err => {
      console.error('❌ Error conectando WebSocket:', err);
    });
  } else {
    console.log('✅ WebSocket ya conectado');
    // Solicitar lista de usuarios online al cargar
    wsService.getOnlineUsers();
  }
  
  // Escuchar cambios de estado de usuarios
  const handleUserStatusChanged = (data: any) => {
    console.log(`👤 Estado cambiado: ${data.username} (${data.userId}) está ${data.status}`);
    
    // Actualizar solo el círculo de estado del usuario específico
    const friendItem = listContainer.querySelector(`[data-id="${data.userId}"]`);
    if (friendItem) {
      const statusCircle = friendItem.querySelector('.w-3.h-3') as HTMLElement;
      if (statusCircle) {
        // Remover clases anteriores
        statusCircle.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-gray-400');
        
        // Añadir nueva clase según el estado
        const newColor = data.status === 'online' ? 'bg-green-500' :
                        data.status === 'in-game' ? 'bg-yellow-500' :
                        data.status === 'away' ? 'bg-orange-500' : 'bg-gray-400';
        statusCircle.classList.add(newColor);
        statusCircle.setAttribute('title', data.status);
        
        // Actualizar emoji
        const statusEmoji = friendItem.querySelector('.text-xs');
        if (statusEmoji) {
          statusEmoji.textContent = data.status === 'online' ? '🟢' :
                                   data.status === 'in-game' ? '🎮' :
                                   data.status === 'away' ? '🟠' : '⚫';
        }
      }
    }
  };
  
  // Escuchar lista de usuarios online
  const handleOnlineUsers = (data: any) => {
    console.log(`👥 ${data.count} usuarios online`);
    // Actualizar estados de todos los usuarios sin recargar
    data.users?.forEach((user: any) => {
      const friendItem = listContainer.querySelector(`[data-id="${user.userId}"]`);
      if (friendItem) {
        const statusCircle = friendItem.querySelector('.w-3.h-3') as HTMLElement;
        if (statusCircle) {
          statusCircle.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-gray-400');
          const newColor = user.status === 'online' ? 'bg-green-500' :
                          user.status === 'in-game' ? 'bg-yellow-500' :
                          user.status === 'away' ? 'bg-orange-500' : 'bg-gray-400';
          statusCircle.classList.add(newColor);
          statusCircle.setAttribute('title', user.status);
          
          const statusEmoji = friendItem.querySelector('.text-xs');
          if (statusEmoji) {
            statusEmoji.textContent = user.status === 'online' ? '🟢' :
                                     user.status === 'in-game' ? '🎮' :
                                     user.status === 'away' ? '🟠' : '⚫';
          }
        }
      }
    });
  };
  
  wsService.on('user-status-changed', handleUserStatusChanged);
  wsService.on('online-users', handleOnlineUsers);
  
  // Escuchar mensajes de chat del WebSocket global
  const handleChatMessage = (data: any) => {
    console.log('📩 Mensaje de chat recibido:', data);
    
    // Verificar si hay un chat abierto
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer || currentChatFriendId === null) {
      console.log('⚠️ No hay chat abierto, mensaje ignorado');
      return;
    }
    
    const myUserId = localStorage.getItem('userId');
    const senderId = data.senderId || data.userId;
    
    // Verificar si el mensaje es del amigo actual o enviado a él
    const isFromCurrentFriend = String(senderId) === String(currentChatFriendId);
    const isToCurrentFriend = String(data.receiverId) === String(currentChatFriendId);
    
    console.log(`🔍 Verificando mensaje: senderId=${senderId}, currentFriend=${currentChatFriendId}, isFrom=${isFromCurrentFriend}, isTo=${isToCurrentFriend}`);
    
    if (isFromCurrentFriend) {
      // Mensaje recibido del amigo
      const msgDiv = document.createElement('div');
      msgDiv.className = 'text-sm p-2 rounded-xl bg-gray-200 text-gray-800 max-w-[80%] shadow';
      msgDiv.textContent = data.message || '';
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      console.log('✅ Mensaje añadido al chat');
    }
  };
  
  // Registrar handler para mensajes de chat
  wsService.on('chat-friends', handleChatMessage);
  
  // Cleanup: remover handler al salir de la vista
  // Nota: Deberías llamar a cleanupChatView() cuando salgas de la vista
}

// Función de limpieza para desconectar WebSocket al salir
export function cleanupChatView() {
  // Remover handlers del WebSocket
  // Nota: Necesitarías guardar referencias a las funciones handler para removerlas correctamente
  console.log('🧹 Cleanup Chat View');
}
