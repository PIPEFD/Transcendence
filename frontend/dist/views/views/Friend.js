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
exports.FriendsView = FriendsView;
var main_js_1 = require("../main.js");
var index_js_1 = require("../translations/index.js");
var Chat_js_1 = require("./Chat.js");
var api_js_1 = require("../config/api.js");
// !!! IMPORTANTE: REEMPLAZA ESTE VALOR !!!
// Debe ser el ID del usuario actualmente logueado. Podría venir de 'state', de un token JWT decodificado, etc.
function FriendsView(app, state) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, userIdPlaceholder, content, fetchFriendList, setupListListeners, requestsList, setupRequestListeners, sections, switchTab;
        var _this = this;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            app.innerHTML = "\n        <div class=\"flex justify-center gap-6 max-w-6xl mx-auto\">\n        <!-- Columna izquierda: amigos -->\n        <div id=\"friendsSection\" class=\"flex-1 bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-8 rounded-2xl shadow-lg flex flex-col items-center text-center space-y-4 max-w-3xl\">\n            <h1 class=\"text-xl font-bold mb-4\">".concat((0, index_js_1.t)("friends_center"), "</h1>\n    \n            <div class=\"flex flex-wrap justify-around w-full mb-6 gap-3\">\n                <button id=\"friendsListBtn\" class=\"tab-btn bg-poke-blue text-poke-light border-3 border-poke-blue border-b-blue-800 rounded px-4 py-2 hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press\">\n                    ").concat((0, index_js_1.t)("friends_list"), "\n                </button>\n                <button id=\"addFriendBtn\" class=\"tab-btn bg-poke-red text-poke-light border-3 border-poke-red border-b-red-800 rounded px-4 py-2 hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press\">\n                    ").concat((0, index_js_1.t)("add_friend"), "\n                </button>\n                <button id=\"requestsBtn\" class=\"tab-btn bg-poke-blue text-poke-light border-3 border-poke-blue border-b-blue-800 rounded px-4 py-2 hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press\">\n                    ").concat((0, index_js_1.t)("requests"), "\n                </button>\n            </div>\n    \n            <div id=\"friendsContentOuter\" class=\"w-full bg-white bg-opacity-40 border-2 border-poke-dark rounded-lg p-4 overflow-hidden\" style=\"height: 400px;\">\n                <div id=\"friendsContent\" class=\"w-full h-full overflow-y-auto pr-2 space-y-2\"></div>\n            </div>\n    \n            <button id=\"backBtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 mt-6 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press\">\n                ").concat((0, index_js_1.t)("goBack"), "\n            </button>\n        </div>\n    \n        <!-- Columna derecha: chat -->\n        <div id=\"chatSection\" class=\"flex-1 hidden\">\n        </div>\n        </div>\n    ");
            userId = localStorage.getItem('userId');
            console.log("id entrar friends: ", userId);
            userIdPlaceholder = userId ? parseInt(userId, 10) : null;
            content = document.getElementById("friendsContent");
            fetchFriendList = function () { return __awaiter(_this, void 0, void 0, function () {
                var token, userId, userIdPlaceholder, response, data, friends, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = localStorage.getItem('tokenUser');
                            if (!token) {
                                return [2 /*return*/, "<p class=\"text-red-500\">".concat((0, index_js_1.t)("error_no_login") || "Error: No se ha iniciado sesión.", "</p>")];
                            }
                            console.log("tt:", token);
                            userId = localStorage.getItem('userId');
                            console.log("id entrar friends: ", userId);
                            userIdPlaceholder = userId ? parseInt(userId, 10) : null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            console.log("User ID:", userIdPlaceholder);
                            return [4 /*yield*/, (0, api_js_1.apiFetch)("".concat(api_js_1.API_ENDPOINTS.FRIENDS, "?id=").concat(userIdPlaceholder), {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': "Bearer ".concat(token),
                                    }
                                })];
                        case 2:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 3:
                            data = _a.sent();
                            console.log("Friends data:", data);
                            friends = Array.isArray(data.success) ? data.success : [];
                            if (friends.length === 0) {
                                return [2 /*return*/, "\n                    <h2 class=\"text-lg mb-3\">".concat((0, index_js_1.t)("friends_list"), "</h2>\n                    <p class=\"mt-4 text-center text-poke-dark\">").concat((0, index_js_1.t)("no_friends_yet") || "Aún no tienes amigos. ¡Añade algunos!", "</p>\n                ")];
                            }
                            // Genera el HTML con los datos de amigos reales
                            return [2 /*return*/, "\n                <h2 class=\"text-lg mb-3\">".concat((0, index_js_1.t)("friends_list"), "</h2>\n                <ul class=\"space-y-2\">\n                    ").concat(friends.map(function (friend, i) { return "\n                        <li class=\"flex items-center justify-between bg-white bg-opacity-70 p-3 rounded border border-poke-dark\">\n                            <div class=\"flex items-center gap-3\">\n                                <img src=\"/assets/avatar".concat((i % 9) + 1, ".png\" class=\"w-10 h-10 rounded-full\" />\n                                <div class=\"text-left\">\n                                    <div class=\"text-sm font-medium\">").concat(friend.username, "</div>\n                                    <div class=\"text-xs text-poke-dark\">Online</div>\n                                </div>\n                            </div>\n                            <div class=\"flex gap-2\">\n                                <button id=\"msg-").concat(friend.id, "\" class=\"msg-btn px-3 py-1 bg-poke-blue bg-opacity-80 text-poke-light rounded border-2 border-poke-blue active:animate-press\">").concat((0, index_js_1.t)("message"), "</button>\n                                <button data-friend-id=\"").concat(friend.id, "\" class=\"remove-friend-btn px-3 py-1 bg-poke-red bg-opacity-80 text-poke-light rounded border-2 border-poke-red active:animate-press\">").concat((0, index_js_1.t)("remove"), "</button>\n                            </div>\n                        </li>\n                    "); }).join(''), "\n                </ul>\n            ")];
                        case 4:
                            error_1 = _a.sent();
                            console.error("Error fetching friend list:", error_1);
                            return [2 /*return*/, "<p class=\"text-red-500\">".concat((0, index_js_1.t)("error_network") || "Error de red.", "</p>")];
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            setupListListeners = function (container) {
                // Configura el evento para ir al chat
                container.querySelectorAll('.msg-btn').forEach(function (btn) {
                    btn.addEventListener("click", function (e) {
                        var chatContainer = document.getElementById("chatSection");
                        if (!chatContainer)
                            return;
                        chatContainer.classList.remove("hidden"); // Muestra el chat
                        chatContainer.innerHTML = ""; // Limpia por si acaso
                        (0, Chat_js_1.ChatView)(chatContainer, state); // Renderiza el chat en ese contenedor
                    });
                });
                // Configura el evento para eliminar amigo
                container.querySelectorAll('.remove-friend-btn').forEach(function (btn) {
                    btn.addEventListener("click", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var friendId, token, response, data, friends, reqHtml, listHtml, error_2;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    friendId = e.currentTarget.dataset.friendId;
                                    if (!friendId)
                                        return [2 /*return*/];
                                    if (!confirm((0, index_js_1.t)("confirm_remove_friend") || "\u00BFEst\u00E1s seguro de que quieres eliminar al amigo con ID ".concat(friendId, "?"))) return [3 /*break*/, 10];
                                    token = localStorage.getItem('tokenUser');
                                    console.log(userIdPlaceholder);
                                    console.log(friendId);
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 9, , 10]);
                                    return [4 /*yield*/, (0, api_js_1.apiFetch)("".concat(api_js_1.API_ENDPOINTS.FRIENDS), {
                                            method: 'POST', // Tu backend usa POST para DELETE
                                            headers: {
                                                'Authorization': "Bearer ".concat(token),
                                            },
                                            body: JSON.stringify({
                                                user_id: userIdPlaceholder,
                                                friend_id: friendId,
                                            })
                                        })];
                                case 2:
                                    response = _b.sent();
                                    return [4 /*yield*/, response.json()];
                                case 3:
                                    data = _b.sent();
                                    console.log("Friends data:", data);
                                    friends = Array.isArray(data.success) ? data.success : [];
                                    console.log("Friends:", friends);
                                    if (!response.ok) return [3 /*break*/, 7];
                                    alert(data.message || "Remove");
                                    return [4 /*yield*/, requestsList()];
                                case 4:
                                    reqHtml = _b.sent();
                                    container.innerHTML = reqHtml;
                                    setupRequestListeners(container);
                                    if (!(((_a = document.getElementById("friendsContent")) === null || _a === void 0 ? void 0 : _a.dataset.tab) === "list")) return [3 /*break*/, 6];
                                    return [4 /*yield*/, fetchFriendList()];
                                case 5:
                                    listHtml = _b.sent();
                                    container.innerHTML = listHtml;
                                    setupListListeners(container);
                                    _b.label = 6;
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    alert(data.message || "Error al hacer remove");
                                    _b.label = 8;
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    error_2 = _b.sent();
                                    alert((0, index_js_1.t)("error_network_remove") || "Error de red al intentar eliminar.");
                                    return [3 /*break*/, 10];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); });
                });
            };
            requestsList = function () { return __awaiter(_this, void 0, void 0, function () {
                var token, response, data, requests, usernames_1, err_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = localStorage.getItem('tokenUser');
                            console.log("tt:", token);
                            if (!token)
                                return [2 /*return*/, "<p class=\"text-red-500\">".concat((0, index_js_1.t)("error_no_login"), "</p>")];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, (0, api_js_1.apiFetch)("".concat(api_js_1.API_ENDPOINTS.FRIENDS, "?id=").concat(userIdPlaceholder), {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': "Bearer ".concat(token),
                                        'Content-Type': 'application/json'
                                    }
                                })];
                        case 2:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 3:
                            data = _a.sent();
                            if (!response.ok || !Array.isArray(data.success)) {
                                return [2 /*return*/, "<p class=\"text-red-500\">Error al cargar solicitudes.</p>"];
                            }
                            requests = data.success;
                            if (requests.length === 0) {
                                return [2 /*return*/, "<p class=\"mt-4 text-center text-poke-dark\">".concat((0, index_js_1.t)("no_request_yet"), "</p>")];
                            }
                            console.log("ee ");
                            return [4 /*yield*/, Promise.all(requests.map(function (r) { return __awaiter(_this, void 0, void 0, function () {
                                    var res, text1, dd, receiverId, _a;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                _c.trys.push([0, 3, , 4]);
                                                return [4 /*yield*/, (0, api_js_1.apiFetch)("".concat(api_js_1.API_ENDPOINTS.FRIENDS, "?id=").concat(r.sender_id), {
                                                        method: 'GET',
                                                        headers: {
                                                            'Authorization': "Bearer ".concat(token),
                                                            'Content-Type': 'application/json'
                                                        }
                                                    })];
                                            case 1:
                                                res = _c.sent();
                                                return [4 /*yield*/, res.text()];
                                            case 2:
                                                text1 = _c.sent();
                                                console.log("Raw response:", text1);
                                                dd = void 0;
                                                try {
                                                    dd = JSON.parse(text1);
                                                }
                                                catch (_d) {
                                                    console.error("No se pudo parsear JSON:", text1);
                                                    dd = { error: "invalid_json", raw: text1 };
                                                }
                                                receiverId = (_b = dd.success) === null || _b === void 0 ? void 0 : _b.username;
                                                return [2 /*return*/, receiverId];
                                            case 3:
                                                _a = _c.sent();
                                                console.log("sta mal ");
                                                return [2 /*return*/, "Usuario #".concat(r.sender_id)];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        case 4:
                            usernames_1 = _a.sent();
                            console.log("ee ", usernames_1[0]);
                            return [2 /*return*/, "\n            <h2 class=\"text-lg mb-3\">".concat((0, index_js_1.t)("request_list"), "</h2>\n            <ul class=\"space-y-2\">\n                ").concat(requests.map(function (r, i) { return "\n                    <li class=\"flex items-center justify-between bg-white bg-opacity-70 p-3 rounded border border-poke-dark\">\n                        <div class=\"flex items-center gap-3\">\n                            <img src=\"/assets/avatar".concat((r.sender_id % 9) + 1, ".png\" class=\"w-10 h-10 rounded-full\" />\n                            <div class=\"text-left\">\n                                <div class=\"text-sm font-medium\">").concat(usernames_1[i], "</div>\n                                <div class=\"text-sm text-poke-dark\">").concat(r.created_at, "</div>\n                            </div>\n                        </div>\n                        <div class=\"flex gap-2\">\n                            <button class=\"accept-btn px-3 py-1 bg-poke-blue bg-opacity-80 text-poke-light rounded\" data-sender-id=\"").concat(r.sender_id, "\">\n                                ").concat((0, index_js_1.t)("accept"), "\n                            </button>\n                            <button class=\"decline-btn px-3 py-1 bg-poke-red bg-opacity-80 text-poke-light rounded\" data-sender-id=\"").concat(r.sender_id, "\">\n                                ").concat((0, index_js_1.t)("decline"), "\n                            </button>\n                        </div>\n                    </li>\n                "); }).join(''), "\n            </ul>\n        ")];
                        case 5:
                            err_1 = _a.sent();
                            console.error(err_1);
                            return [2 /*return*/, "<p class=\"text-red-500\">".concat((0, index_js_1.t)("error_network"), "</p>")];
                        case 6: return [2 /*return*/];
                    }
                });
            }); };
            setupRequestListeners = function (container) {
                var token = localStorage.getItem('tokenUser');
                if (!token)
                    return;
                var handleAction = function (senderId, action) { return __awaiter(_this, void 0, void 0, function () {
                    var response, text, data, reqHtml, listHtml, err_2;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 8, , 9]);
                                return [4 /*yield*/, (0, api_js_1.apiFetch)("".concat(api_js_1.API_ENDPOINTS.FRIEND_REQUEST), {
                                        method: 'PATCH',
                                        headers: {
                                            'Authorization': "Bearer ".concat(token),
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            sender_id: senderId,
                                            receiver_id: userIdPlaceholder,
                                            action: action
                                        })
                                    })];
                            case 1:
                                response = _b.sent();
                                return [4 /*yield*/, response.text()];
                            case 2:
                                text = _b.sent();
                                data = void 0;
                                try {
                                    data = JSON.parse(text);
                                }
                                catch (_c) {
                                    console.error("Respuesta inesperada del servidor al ".concat(action, ":"), text);
                                    alert("Error al procesar la solicitud: " + text);
                                    return [2 /*return*/];
                                }
                                if (!response.ok) return [3 /*break*/, 6];
                                alert(data.message || "Solicitud ".concat(action, "ada"));
                                return [4 /*yield*/, requestsList()];
                            case 3:
                                reqHtml = _b.sent();
                                container.innerHTML = reqHtml;
                                setupRequestListeners(container);
                                if (!(((_a = document.getElementById("friendsContent")) === null || _a === void 0 ? void 0 : _a.dataset.tab) === "list")) return [3 /*break*/, 5];
                                return [4 /*yield*/, fetchFriendList()];
                            case 4:
                                listHtml = _b.sent();
                                container.innerHTML = listHtml;
                                setupListListeners(container);
                                _b.label = 5;
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                alert(data.message || "Error al ".concat(action, " la solicitud"));
                                _b.label = 7;
                            case 7: return [3 /*break*/, 9];
                            case 8:
                                err_2 = _b.sent();
                                console.error("Error de red al ".concat(action, " solicitud:"), err_2);
                                alert("Error de red al ".concat(action, " la solicitud"));
                                return [3 /*break*/, 9];
                            case 9: return [2 /*return*/];
                        }
                    });
                }); };
                // --- Botones Accept ---
                container.querySelectorAll('.accept-btn').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var senderId = parseInt(btn.dataset.senderId);
                        if (!senderId)
                            return;
                        handleAction(senderId, 'accept');
                    });
                });
                // --- Botones Decline ---
                container.querySelectorAll('.decline-btn').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var senderId = parseInt(btn.dataset.senderId);
                        if (!senderId)
                            return;
                        handleAction(senderId, 'decline');
                    });
                });
            };
            sections = {
                // CONTENIDO DE LISTA: Se reemplaza por un estado de carga
                list: "\n            <div class=\"text-center p-8\">\n                <p>".concat((0, index_js_1.t)("loading_friends") || "Cargando amigos...", "</p>\n                <div class=\"animate-spin rounded-full h-8 w-8 border-b-2 border-poke-blue mx-auto mt-4\"></div>\n            </div>\n        "),
                add: "\n            <h2 class=\"text-lg mb-3\">".concat((0, index_js_1.t)("add_friend"), "</h2>\n            <div class=\"flex items-center gap-3\">\n                <input id=\"friendName\" type=\"text\" placeholder=\"").concat((0, index_js_1.t)("enter_friend_name"), "\" class=\"border-2 border-poke-dark px-4 py-2 rounded flex-1\"/>\n                <button id=\"sendReqBtn\" class=\"ml-2 bg-poke-blue text-poke-light px-4 py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600\">\n                    ").concat((0, index_js_1.t)("send_request"), "\n                </button>\n            </div>\n            <p class=\"mt-4 text-sm text-poke-dark\">").concat((0, index_js_1.t)("add_friend_hint"), "</p>\n        "),
                requests: "\n            <h2 class=\"text-lg mb-3\">".concat((0, index_js_1.t)("requests"), "</h2>\n            <div class=\"space-y-3\">\n                <div class=\"p-3 rounded border border-poke-dark bg-white bg-opacity-80 flex justify-between items-center\">\n                    <div>\n                        <div class=\"font-medium\">IncomingUser1</div>\n                        <div class=\"text-xs text-poke-dark\">Wants to be your friend</div>\n                    </div>\n                    <div class=\"flex gap-2\">\n                        <button class=\"px-3 py-1 bg-poke-blue text-poke-light rounded\">").concat((0, index_js_1.t)("accept"), "</button>\n                        <button class=\"px-3 py-1 bg-poke-red text-poke-light rounded\">").concat((0, index_js_1.t)("decline"), "</button>\n                    </div>\n                </div>\n                <p class=\"text-sm text-poke-dark\">").concat((0, index_js_1.t)("no_more_requests"), "</p>\n            </div>\n        ")
            };
            switchTab = function (tab) { return __awaiter(_this, void 0, void 0, function () {
                var inner, listHtml_1, reqHtml_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inner = content;
                            inner.style.opacity = '0';
                            if (!(tab === "list")) return [3 /*break*/, 2];
                            inner.innerHTML = sections.list; // Muestra el estado de carga
                            return [4 /*yield*/, fetchFriendList()];
                        case 1:
                            listHtml_1 = _a.sent();
                            setTimeout(function () {
                                inner.innerHTML = listHtml_1; // Inserta el contenido final
                                inner.style.opacity = '1';
                                setupListListeners(inner); // Asigna los eventos de Message/Remove
                            }, 120);
                            return [2 /*return*/];
                        case 2:
                            if (!(tab === "requests")) return [3 /*break*/, 4];
                            // Mostrar estado de carga mientras se hace fetch
                            inner.innerHTML = "\n          <div class=\"text-center p-8\">\n            <p>".concat((0, index_js_1.t)("loading_requests") || "Cargando solicitudes...", "</p>\n            <div class=\"animate-spin rounded-full h-8 w-8 border-b-2 border-poke-blue mx-auto mt-4\"></div>\n          </div>\n        ");
                            // Obtener solicitudes del servidor
                            console.log("antes de");
                            return [4 /*yield*/, requestsList()];
                        case 3:
                            reqHtml_1 = _a.sent();
                            console.log("dess de");
                            setTimeout(function () {
                                inner.innerHTML = reqHtml_1;
                                inner.style.opacity = '1';
                                // Asignar listeners a los botones Accept / Decline
                                setupRequestListeners(inner);
                            }, 120);
                            return [2 /*return*/];
                        case 4:
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
                            setTimeout(function () {
                                inner.innerHTML = sections[tab];
                                inner.style.opacity = '1';
                                if (tab === "add") {
                                    var sendReqBtn = document.getElementById("sendReqBtn");
                                    var r_id_Input_1 = document.getElementById("friendName");
                                    if (sendReqBtn) {
                                        sendReqBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                                            var nameInput, token, username, response, text, data, receiverId, err_3, uu, receiver_id, response, err_4;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        nameInput = document.getElementById("friendName");
                                                        if (!nameInput || !nameInput.value.trim())
                                                            return [2 /*return*/];
                                                        token = localStorage.getItem('tokenUser');
                                                        username = r_id_Input_1.value.trim();
                                                        // aqui busco el id del username
                                                        console.log("antes");
                                                        _b.label = 1;
                                                    case 1:
                                                        _b.trys.push([1, 4, , 5]);
                                                        console.log("User ID ff:", userIdPlaceholder);
                                                        console.log("User ID ff:", username);
                                                        return [4 /*yield*/, (0, api_js_1.apiFetch)("".concat(api_js_1.API_ENDPOINTS.FRIEND_REQUEST, "?user=").concat(username), {
                                                                method: 'GET',
                                                                headers: {
                                                                    'Authorization': "Bearer ".concat(token),
                                                                    'Content-Type': 'application/json'
                                                                }
                                                            })];
                                                    case 2:
                                                        response = _b.sent();
                                                        return [4 /*yield*/, response.text()];
                                                    case 3:
                                                        text = _b.sent();
                                                        console.log("Raw response:", text);
                                                        data = void 0;
                                                        try {
                                                            data = JSON.parse(text);
                                                        }
                                                        catch (_c) {
                                                            console.error("No se pudo parsear JSON:", text);
                                                            data = { error: "invalid_json", raw: text };
                                                        }
                                                        receiverId = (_a = data.success) === null || _a === void 0 ? void 0 : _a.user_id;
                                                        console.log("ID del usuario:", receiverId);
                                                        localStorage.setItem('lastFriendId', receiverId);
                                                        return [3 /*break*/, 5];
                                                    case 4:
                                                        err_3 = _b.sent();
                                                        console.error(err_3);
                                                        alert("Error de conexión con el servidor");
                                                        return [3 /*break*/, 5];
                                                    case 5:
                                                        uu = localStorage.getItem('lastFriendId');
                                                        receiver_id = uu ? parseInt(uu, 10) : null;
                                                        console.log("uu ", uu);
                                                        console.log({
                                                            token: token,
                                                            userIdPlaceholder: userIdPlaceholder,
                                                            receiver_id: receiver_id
                                                        });
                                                        _b.label = 6;
                                                    case 6:
                                                        _b.trys.push([6, 8, , 9]);
                                                        return [4 /*yield*/, (0, api_js_1.apiFetch)("".concat(api_js_1.API_ENDPOINTS.FRIEND_REQUEST, ")"), {
                                                                method: 'POST', // Tu backend usa POST para DELETE
                                                                headers: {
                                                                    'Authorization': "Bearer ".concat(token),
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                body: JSON.stringify({ sender_id: userIdPlaceholder, receiver_id: receiver_id })
                                                            })];
                                                    case 7:
                                                        response = _b.sent();
                                                        if (!response.ok) {
                                                            alert("Error en el fetch de request");
                                                            return [2 /*return*/];
                                                        }
                                                        alert("Request realizada");
                                                        return [3 /*break*/, 9];
                                                    case 8:
                                                        err_4 = _b.sent();
                                                        console.error(err_4);
                                                        alert("Error de conexión con el servidor");
                                                        return [3 /*break*/, 9];
                                                    case 9: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                }
                            }, 120);
                            return [2 /*return*/];
                    }
                });
            }); };
            // --- LISTENERS DE NAVEGACIÓN ---
            // Carga la lista de amigos por defecto al inicio
            // Nota: Llama a 'switchTab' directamente, no necesita ser asíncrono
            window.addEventListener('load', function () { return switchTab("list"); });
            (_a = document.getElementById("friendsListBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return switchTab("list"); });
            (_b = document.getElementById("addFriendBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () { return switchTab("add"); });
            (_c = document.getElementById("requestsBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () { return switchTab("requests"); });
            (_d = document.getElementById("backBtn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () { return (0, main_js_1.navigate)("/"); });
            // Iniciar con la pestaña de lista de amigos
            switchTab("list");
            return [2 /*return*/];
        });
    });
}
