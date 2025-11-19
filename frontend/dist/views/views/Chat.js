"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatView = ChatView;
exports.cleanupChatView = cleanupChatView;
// src/views/Chat.ts
var index_js_1 = require("../translations/index.js");
var WebSocketService_js_1 = require("../services/WebSocketService.js");
var api_js_1 = require("../config/api.js");
function ChatView(app, state) {
    var _this = this;
    var userId = localStorage.getItem("userId");
    var userIdPlaceholder = userId ? parseInt(userId, 10) : null;
    app.innerHTML = "\n    <div class=\"flex bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-2xl shadow-lg max-w-6xl mx-auto space-x-4\" style=\"height: 600px;\">\n      \n      <!-- Lista de amigos -->\n      <div id=\"friendsListPanel\" class=\"w-1/3 bg-white bg-opacity-60 border-r-2 border-poke-dark rounded-lg p-3 overflow-y-auto\">\n        <h2 class=\"text-lg font-bold text-center mb-2\">".concat((0, index_js_1.t)("friends_list"), "</h2>\n        <div id=\"friendsListContainer\" class=\"space-y-2\"></div>\n      </div>\n\n      <!-- Chat principal -->\n      <div id=\"chatPanel\" class=\"flex-1 flex flex-col bg-white bg-opacity-40 border-2 border-poke-dark rounded-lg p-4\">\n        <div class=\"flex-1 flex flex-col items-center justify-center text-center text-poke-dark opacity-70\" id=\"chatPlaceholder\">\n          ").concat((0, index_js_1.t)("select_friend_chat") || "Selecciona un amigo para chatear", "\n        </div>\n      </div>\n    </div>\n  ");
    var listContainer = document.getElementById("friendsListContainer");
    var chatPanel = document.getElementById("chatPanel");
    // Cargar lista de amigos desde la API
    var loadFriends = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, userId, userIdNum, response, data, friends, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem("tokenUser");
                    userId = localStorage.getItem("userId");
                    userIdNum = userId ? parseInt(userId, 10) : null;
                    console.log("🔍 Chat - Verificando credenciales:");
                    console.log("  Token:", token ? "".concat(token.substring(0, 30), "...") : "NULL");
                    console.log("  UserId:", userId);
                    console.log("  UserIdNum:", userIdNum);
                    if (!token || !userIdNum) {
                        console.error("❌ Chat - Falta token o userId");
                        listContainer.innerHTML = "<p class=\"text-sm text-red-600\">".concat((0, index_js_1.t)("error_no_login"), "</p>");
                        return [2 /*return*/];
                    }
                    console.log("✅ Chat - Credenciales OK, cargando amigos...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(api_js_1.API_ENDPOINTS.FRIENDS, "?id=").concat(userIdNum), {
                            headers: { Authorization: "Bearer ".concat(token) },
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    friends = Array.isArray(data.success) ? data.success : [];
                    if (friends.length === 0) {
                        listContainer.innerHTML = "<p class=\"text-center text-gray-600\">".concat((0, index_js_1.t)("no_friends_yet"), "</p>");
                        return [2 /*return*/];
                    }
                    renderFriendsList(friends);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error(err_1);
                    listContainer.innerHTML = "<p class=\"text-red-500\">".concat((0, index_js_1.t)("error_network"), "</p>");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Función para renderizar lista de amigos con estados
    var renderFriendsList = function (friends) {
        listContainer.innerHTML = friends
            .map(function (f, i) {
            var status = WebSocketService_js_1.wsService.getUserStatus(String(f.id)) || 'offline';
            var statusColor = status === 'online' ? 'bg-green-500' :
                status === 'in-game' ? 'bg-yellow-500' : 'bg-gray-400';
            var statusText = status === 'online' ? '🟢' :
                status === 'in-game' ? '🎮' : '⚫';
            return "\n        <div class=\"friend-item flex items-center gap-3 p-2 bg-white bg-opacity-70 rounded cursor-pointer hover:bg-poke-blue hover:text-white transition\"\n             data-id=\"".concat(f.id, "\" data-username=\"").concat(f.username, "\">\n          <div class=\"relative\">\n            <img src=\"/assets/avatar").concat((i % 9) + 1, ".png\" class=\"w-8 h-8 rounded-full\" />\n            <div class=\"absolute -bottom-1 -right-1 w-3 h-3 ").concat(statusColor, " rounded-full border-2 border-white\" \n                 title=\"").concat(status, "\"></div>\n          </div>\n          <div class=\"flex-1\">\n            <span class=\"font-medium\">").concat(f.username, "</span>\n            <span class=\"text-xs ml-2\">").concat(statusText, "</span>\n          </div>\n        </div>\n      ");
        })
            .join("");
    };
    // Función para abrir el chat con un amigo
    var openChat = function (friendId, friendName) {
        chatPanel.innerHTML = "\n      <div class=\"flex flex-col w-full h-full\">\n        <div class=\"border-b border-poke-dark pb-2 mb-2 font-bold\">".concat(friendName, "</div>\n\n        <div id=\"messagesContainer\" class=\"flex-1 overflow-y-auto space-y-2 text-left pr-2 bg-white bg-opacity-40 border border-poke-dark rounded p-3\">\n          <div class=\"text-center text-sm text-poke-dark opacity-70\">").concat((0, index_js_1.t)("chat_welcome"), " ").concat(state.player.alias || (0, index_js_1.t)("player"), "!</div>\n        </div>\n\n        <div class=\"mt-3 flex gap-2\">\n          <input id=\"chatInput\" type=\"text\" placeholder=\"").concat((0, index_js_1.t)("type_message"), "\" class=\"flex-1 border-2 border-poke-dark px-3 py-2 rounded focus:outline-none\" />\n          <button id=\"sendMsgBtn\" class=\"bg-poke-blue text-white px-4 py-2 rounded\">").concat((0, index_js_1.t)("send"), "</button>\n        </div>\n      </div>\n    ");
        var msgContainer = document.getElementById("messagesContainer");
        var msgInput = document.getElementById("chatInput");
        var sendBtn = document.getElementById("sendMsgBtn");
        var sendMessage = function () {
            var text = msgInput.value.trim();
            if (!text)
                return;
            // Mostrar mensaje localmente
            var msgEl = document.createElement("div");
            msgEl.className = "bg-poke-blue text-white p-2 rounded-xl max-w-[80%] ml-auto shadow";
            msgEl.textContent = text;
            msgContainer.appendChild(msgEl);
            msgInput.value = "";
            msgContainer.scrollTop = msgContainer.scrollHeight;
            // Enviar mensaje vía WebSocket
            var userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('No userId found');
                return;
            }
            var success = WebSocketService_js_1.wsService.send({
                type: 'chat-friends',
                userId: userId,
                receiverId: String(friendId),
                message: text
            });
            if (!success) {
                console.error('Failed to send message via WebSocket');
                // TODO: Mostrar error al usuario
            }
        };
        sendBtn.addEventListener("click", sendMessage);
        msgInput.addEventListener("keypress", function (e) { return e.key === "Enter" && sendMessage(); });
    };
    // Vincular clics de la lista con el chat
    listContainer.addEventListener("click", function (e) {
        var item = e.target.closest(".friend-item");
        if (!item)
            return;
        var id = parseInt(item.dataset.id, 10);
        var name = item.dataset.username;
        openChat(id, name);
    });
    // Cargar lista de amigos al iniciar
    loadFriends();
    // Solicitar lista de usuarios online al cargar
    WebSocketService_js_1.wsService.getOnlineUsers();
    // Escuchar cambios de estado de usuarios
    var handleUserStatusChanged = function (data) {
        console.log("\uD83D\uDC64 Estado cambiado: ".concat(data.username, " est\u00E1 ").concat(data.status));
        // Recargar lista de amigos para actualizar estados
        loadFriends();
    };
    // Escuchar lista de usuarios online
    var handleOnlineUsers = function (data) {
        console.log("\uD83D\uDC65 ".concat(data.count, " usuarios online"));
        // Recargar lista de amigos para mostrar estados actualizados
        loadFriends();
    };
    WebSocketService_js_1.wsService.on('user-status-changed', handleUserStatusChanged);
    WebSocketService_js_1.wsService.on('online-users', handleOnlineUsers);
    // Escuchar mensajes de chat del WebSocket global
    var handleChatMessage = function (data) {
        console.log('📩 Mensaje de chat recibido:', data);
        // Verificar si el mensaje es para el chat actual abierto
        var messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer)
            return;
        // Obtener el friendId actual del DOM si está disponible
        var currentChatHeader = chatPanel.querySelector('.font-bold');
        if (!currentChatHeader)
            return;
        var currentFriendName = currentChatHeader.textContent;
        // Añadir mensaje al contenedor si coincide
        if (data.userId || data.senderId) {
            var msgDiv = document.createElement('div');
            msgDiv.className = 'text-sm p-2 rounded bg-poke-blue text-white max-w-xs';
            msgDiv.textContent = "".concat(data.message || '');
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };
    // Registrar handler para mensajes de chat
    WebSocketService_js_1.wsService.on('chat-friends', handleChatMessage);
    // Cleanup: remover handler al salir de la vista
    // Nota: Deberías llamar a cleanupChatView() cuando salgas de la vista
}
// Función de limpieza para desconectar WebSocket al salir
function cleanupChatView() {
    // Remover handlers del WebSocket
    // Nota: Necesitarías guardar referencias a las funciones handler para removerlas correctamente
    console.log('🧹 Cleanup Chat View');
}
