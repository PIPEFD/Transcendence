// src/views/Chat.ts
import { t } from "../translations/index.js";

export function ChatView(app: HTMLElement, state: any) {
  const userId = localStorage.getItem("userId");
  const userIdPlaceholder = userId ? parseInt(userId, 10) : null;

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

    if (!token || !userIdNum) {
      listContainer.innerHTML = `<p class="text-sm text-red-600">${t("error_no_login")}</p>`;
      return;
    }

    try {
      const response = await fetch(`http://localhost:8085/api/friends.php?id=${userIdNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const friends = Array.isArray(data.success) ? data.success : [];

      if (friends.length === 0) {
        listContainer.innerHTML = `<p class="text-center text-gray-600">${t("no_friends_yet")}</p>`;
        return;
      }

      listContainer.innerHTML = friends
        .map(
          (f: any, i: number) => `
        <div class="friend-item flex items-center gap-3 p-2 bg-white bg-opacity-70 rounded cursor-pointer hover:bg-poke-blue hover:text-white transition"
             data-id="${f.id}" data-username="${f.username}">
          <img src="/assets/avatar${(i % 9) + 1}.png" class="w-8 h-8 rounded-full" />
          <span class="font-medium">${f.username}</span>
        </div>
      `
        )
        .join("");
    } catch (err) {
      console.error(err);
      listContainer.innerHTML = `<p class="text-red-500">${t("error_network")}</p>`;
    }
  };

  // Función para abrir el chat con un amigo
  const openChat = (friendId: number, friendName: string) => {
    chatPanel.innerHTML = `
      <div class="flex flex-col w-full h-full">
        <div class="border-b border-poke-dark pb-2 mb-2 font-bold">${friendName}</div>

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
      const msgEl = document.createElement("div");
      msgEl.className = "bg-poke-blue text-white p-2 rounded-xl max-w-[80%] ml-auto shadow";
      msgEl.textContent = text;
      msgContainer.appendChild(msgEl);
      msgInput.value = "";
      msgContainer.scrollTop = msgContainer.scrollHeight;
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
}
