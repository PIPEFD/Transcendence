"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentLang = void 0;
exports.navigate = navigate;
// Importa las funciones de cada vista
var Register_js_1 = require("./views/Register.js");
var Profile_js_1 = require("./views/Profile.js");
var Profile1_js_1 = require("./views/Profile1.js");
var Authentication_js_1 = require("./views/Authentication.js");
var Choose_js_1 = require("./views/Choose.js");
var Avatar_js_1 = require("./views/Avatar.js");
var Avatarlogin_js_1 = require("./views/Avatarlogin.js");
var Game_js_1 = require("./views/Game.js");
var Tournament_js_1 = require("./views/Tournament.js");
var Chat_js_1 = require("./views/Chat.js");
var Home_js_1 = require("./views/Home.js");
var Settings_js_1 = require("./views/Settings.js");
var Header_js_1 = require("./views/Header.js");
var Statistics_js_1 = require("./views/Statistics.js");
var Language_js_1 = require("./views/Language.js");
var MatchHistory_js_1 = require("./views/MatchHistory.js");
var Login_js_1 = require("./views/Login.js");
var Menu_js_1 = require("./views/Menu.js");
var Friend_js_1 = require("./views/Friend.js");
var _1v1_js_1 = require("./views/1v1.js");
var vsIA_js_1 = require("./views/vsIA.js");
var _3players_js_1 = require("./views/3players.js");
var WebSocketTest_js_1 = require("./views/WebSocketTest.js");
var WebSocketService_js_1 = require("./services/WebSocketService.js");
var state = {
    player: { alias: "", user: "", avatar: 0, matches: 10, victories: 7, defeats: 8 }
};
exports.currentLang = localStorage.getItem("playerLang") || "en";
/* export function setLanguage(lang: Lang): void {
  currentLang = lang;
  localStorage.setItem("playerLang", lang);
  // re-render current view so any language-aware UI can update
  router();
} */
// La función navigate ahora debe ser exportada para que las vistas puedan importarla
function navigate(path) {
    if (window.location.pathname !== path) {
        window.history.pushState({}, "", path);
    }
    router();
}
function router() {
    var app = document.getElementById("app");
    if (!app)
        return;
    var route = window.location.pathname;
    switch (route) {
        case "/register":
            (0, Register_js_1.RegisterView)(app, state);
            break;
        case "/profile":
            (0, Profile_js_1.ProfileView)(app, state);
            break;
        case "/profile1":
            (0, Profile1_js_1.Profile1View)(app, state);
            break;
        case "/authentication":
            (0, Authentication_js_1.AuthView)(app, state);
            break;
        case "/login":
            (0, Login_js_1.LoginView)(app, state);
            break;
        case "/menu":
            (0, Menu_js_1.MenuView)(app, state);
            break;
        case "/choose":
            (0, Choose_js_1.ChooseView)(app, state);
            break;
        case "/avatar":
            (0, Avatar_js_1.AvatarView)(app, state);
            break;
        case "/avatar1":
            (0, Avatarlogin_js_1.AvatarView1)(app, state);
            break;
        case "/game":
            (0, Game_js_1.GameView)(app, state);
            break;
        case "/tournament":
            (0, Tournament_js_1.TournamentView)(app, state);
            break;
        case "/chat":
            (0, Chat_js_1.ChatView)(app, state);
            break;
        case "/settings":
            (0, Settings_js_1.SettingsView)(app, state);
            break;
        case "/statistics":
            (0, Statistics_js_1.StatsView)(app, state);
            break;
        case "/language":
            (0, Language_js_1.LanguageView)(app, state);
            break;
        case "/match-history":
            (0, MatchHistory_js_1.MatchHistoryView)(app, state);
            break;
        case "/friends":
            (0, Friend_js_1.FriendsView)(app, state);
            break;
        case "/1v1":
            (0, _1v1_js_1.GameOne)(app, state);
            break;
        case "/vsAI":
            (0, vsIA_js_1.GameVsAI)(app, state);
            break;
        case "/3player":
            (0, _3players_js_1.GameThree)(app, state);
            break;
        case "/ws-test":
            (0, WebSocketTest_js_1.WebSocketTestView)(app, state);
            break;
        default: // Home
            (0, Home_js_1.HomeView)(app, state);
            break;
    }
    updateHeaderFooterVisibility(route);
}
// Funciones de utilidad y de inicialización
function updateHeaderFooterVisibility(route) {
    var header = document.querySelector("header");
    var footer = document.querySelector("footer");
    if (!header || !footer)
        return;
    var hiddenRoutes = ["/register", "/profile", "/choose", "/avatar", "/login", "/profile1", "/authentication"];
    if (hiddenRoutes.includes(route)) {
        header.classList.add("hidden");
        footer.classList.add("hidden");
    }
    else {
        header.classList.remove("hidden");
        footer.classList.remove("hidden");
    }
}
window.addEventListener("load", function () {
    var stored = localStorage.getItem("player");
    if (stored) {
        state.player = JSON.parse(stored);
    }
    (0, Header_js_1.updateHeader)(state);
    if (!state.player.alias) {
        navigate("/register");
    }
    else {
        router();
    }
    // Conectar al WebSocket si el usuario está autenticado
    var token = localStorage.getItem('tokenUser');
    var userId = localStorage.getItem('userId');
    if (token && userId) {
        console.log('🔌 Usuario autenticado detectado. Conectando WebSocket...');
        WebSocketService_js_1.wsService.connect()
            .then(function () {
            console.log('✅ WebSocket conectado y autenticado');
            // Configurar ping cada 30 segundos para mantener conexión
            setInterval(function () {
                if (WebSocketService_js_1.wsService.isConnected()) {
                    WebSocketService_js_1.wsService.ping();
                }
            }, 30000);
        })
            .catch(function (error) {
            console.error('❌ Error conectando WebSocket:', error);
        });
    }
});
window.addEventListener("popstate", router);
// Actualizar UI cuando cambia el idioma
window.addEventListener('languageChanged', function () {
    router();
    (0, Header_js_1.updateHeader)(state);
});
