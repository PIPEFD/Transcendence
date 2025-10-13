import { navigate } from "../main.js";
import { t } from "../translations/index.js";
export function ChatView(app, state) {
    var _a;
    app.innerHTML = `
    <div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-8 rounded-2xl shadow-lg max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">

      <!-- Header -->
      <div class="text-center">
        <h1 class="text-poke-yellow text-3xl font-bold tracking-wide">POKéMON</h1>
        <p class="text-poke-light text-sm -mt-1">PONG</p>
      </div>

      <!-- Title -->
      <h2 class="text-xl font-bold mb-2">${t("chat_center")}</h2>

      <!-- Chat box -->
      <div id="chatBox" class="w-full bg-white bg-opacity-40 border-2 border-poke-dark rounded-lg p-4 flex flex-col justify-between overflow-hidden" style="height: 400px;">
        
        <!-- Messages Area -->
        <div id="messagesContainer" class="flex-1 overflow-y-auto space-y-2 text-left pr-2">
          <div class="text-center text-sm text-poke-dark opacity-70">${t("chat_welcome")} ${state.player.alias || t("player")}!</div>
        </div>

        <!-- Input Area -->
        <div class="mt-4 flex gap-2">
          <input id="chatInput" type="text" placeholder="${t("type_message")}" class="flex-1 border-2 border-poke-dark px-3 py-2 rounded text-poke-dark focus:outline-none focus:ring-2 focus:ring-poke-blue" />
          <button id="sendMsgBtn" class="bg-poke-blue text-poke-light px-4 py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press">
            ${t("send")}
          </button>
        </div>
      </div>

      <!-- Back Button -->
      <button id="goBackBtn3" class="bg-poke-red bg-opacity-80 text-poke-light py-2 mt-6 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press">
        ${t("go_back")}
      </button>
    </div>
  `;
    const msgContainer = document.getElementById("messagesContainer");
    const msgInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendMsgBtn");
    // Basic send message handler
    const sendMessage = () => {
        const text = msgInput.value.trim();
        if (!text)
            return;
        // Create message bubble
        const msgEl = document.createElement("div");
        msgEl.className = "bg-poke-blue text-white p-2 rounded-xl max-w-[80%] ml-auto shadow";
        msgEl.textContent = text;
        msgContainer.appendChild(msgEl);
        msgInput.value = "";
        msgContainer.scrollTop = msgContainer.scrollHeight;
    };
    sendBtn === null || sendBtn === void 0 ? void 0 : sendBtn.addEventListener("click", sendMessage);
    msgInput === null || msgInput === void 0 ? void 0 : msgInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter")
            sendMessage();
    });
    (_a = document.getElementById("goBackBtn3")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => navigate("/"));
}
