// Importa las funciones de cada vista
import { RegisterView } from "./views/Register.js";
import { ProfileView } from "./views/Profile.js";
import { Profile1View } from "./views/Profile1.js";
import { AuthView } from "./views/Authentication.js";
import { ChooseView } from "./views/Choose.js";
import { AvatarView } from "./views/Avatar.js";
import { AvatarView1 } from "./views/Avatarlogin.js";
import { GameView } from "./views/Game.js";
import { TournamentView } from "./views/Tournament.js";
import { Tournament4View } from "./views/tournament4.js";
import { ChatView } from "./views/Chat.js";
import { HomeView } from "./views/Home.js";
import { SettingsView } from "./views/Settings.js";
import { updateHeader } from "./views/Header.js";
import { StatsView } from "./views/Statistics.js";
import { LanguageView } from "./views/Language.js";
import { MatchHistoryView } from "./views/MatchHistory.js";
import { LoginView } from "./views/Login.js";
import { MenuView } from "./views/Menu.js";
import { FriendsView } from "./views/Friend.js";
import { GameOne } from "./views/1v1.js";
<<<<<<< HEAD
import { GameOneo } from "./views/1v1o.js";
import { GameVsAI } from "./views/vsIA.js";
import { GameThree } from "./views/3players.js";
import { GameFour } from "./views/4players.js";
import { WebSocketTestView } from "./views/WebSocketTest.js";
import { wsService } from "./services/WebSocketService.js";
import { ChooseView1 } from "./views/Choose1.js";
import { Tournament4StartView } from "./views/tournament4start.js";
import { GameTournament } from "./views/Tournament4Run.js";
=======
import { GameVsAI } from "./views/vsIA.js";
import { GameThree } from "./views/3players.js";
import { WebSocketTestView } from "./views/WebSocketTest.js";
import { wsService } from "./services/WebSocketService.js";
import { ChooseView1 } from "./views/Choose1.js";
>>>>>>> frontEnd
const state = {
    player: { alias: "", user: "", avatar: 0, matches: 10, victories: 7, defeats: 8 }
};
export let currentLang = localStorage.getItem("playerLang") || "en";
/* export function setLanguage(lang: Lang): void {
  currentLang = lang;
  localStorage.setItem("playerLang", lang);
  // re-render current view so any language-aware UI can update
  router();
} */
// La función navigate ahora debe ser exportada para que las vistas puedan importarla
export function navigate(path) {
    if (window.location.pathname !== path) {
        window.history.pushState({}, "", path);
    }
    router();
}
function router() {
    const app = document.getElementById("app");
    if (!app)
        return;
    const route = window.location.pathname;
    switch (route) {
        case "/register":
            RegisterView(app, state);
            break;
        case "/profile":
            ProfileView(app, state);
            break;
        case "/profile1":
            Profile1View(app, state);
            break;
        case "/authentication":
            AuthView(app, state);
            break;
        case "/login":
            LoginView(app, state);
            break;
        case "/menu":
            MenuView(app, state);
            break;
        case "/choose":
            ChooseView(app, state);
            break;
        case "/choose1":
            ChooseView1(app, state);
            break;
        case "/avatar":
            AvatarView(app, state);
            break;
        case "/avatar1":
            AvatarView1(app, state);
            break;
        case "/game":
            GameView(app, state);
            break;
        case "/tournament":
            TournamentView(app, state);
            break;
        case "/tournament4":
            Tournament4View(app, state);
            break;
        case "/tournament4start":
            Tournament4StartView(app, state);
            break;
        case "/game-tournament":
            GameTournament(app, state);
            break;
        case "/chat":
            ChatView(app, state);
            break;
        case "/settings":
            SettingsView(app, state);
            break;
        case "/statistics":
            StatsView(app, state);
            break;
        case "/language":
            LanguageView(app, state);
            break;
        case "/match-history":
            MatchHistoryView(app, state);
            break;
        case "/friends":
            FriendsView(app, state);
            break;
        case "/1v1":
            GameOne(app, state);
            break;
<<<<<<< HEAD
        case "/1v1o":
            GameOneo(app, state);
            break;
=======
>>>>>>> frontEnd
        case "/vsAI":
            GameVsAI(app, state);
            break;
        case "/3player":
            GameThree(app, state);
            break;
<<<<<<< HEAD
        case "/4player":
            GameFour(app, state);
            break;
=======
>>>>>>> frontEnd
        case "/ws-test":
            WebSocketTestView(app, state);
            break;
        default: // Home
            HomeView(app, state);
            break;
    }
    updateHeaderFooterVisibility(route);
}
// Funciones de utilidad y de inicialización
function updateHeaderFooterVisibility(route) {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    if (!header || !footer)
        return;
<<<<<<< HEAD
    const hiddenRoutes = ["/register", "/tournament4", "/tournament4start", "/game-tournament", "/profile", "/choose", "/avatar", "/login", "/profile1", "/authentication", "/choose1", "/avatar1", "/3player", "/1v1", "/1v1o", "/vsAI", "/4player"];
=======
    const hiddenRoutes = ["/register", "/profile", "/choose", "/avatar", "/login", "/profile1", "/authentication", "/choose1", "/avatar1"];
>>>>>>> frontEnd
    if (hiddenRoutes.includes(route)) {
        header.classList.add("hidden");
        footer.classList.add("hidden");
    }
    else {
        header.classList.remove("hidden");
        footer.classList.remove("hidden");
    }
}
window.addEventListener("load", () => {
    const stored = localStorage.getItem("player");
    if (stored) {
        state.player = JSON.parse(stored);
    }
    updateHeader(state);
    if (!state.player.alias) {
        navigate("/register");
    }
    else {
        router();
    }
    // Conectar al WebSocket si el usuario está autenticado
    const token = localStorage.getItem('tokenUser');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
        console.log('🔌 Usuario autenticado detectado. Conectando WebSocket...');
        wsService.connect()
            .then(() => {
            console.log('✅ WebSocket conectado y autenticado');
            // Configurar ping cada 30 segundos para mantener conexión
            setInterval(() => {
                if (wsService.isConnected()) {
                    wsService.ping();
                }
            }, 30000);
        })
            .catch((error) => {
            console.error('❌ Error conectando WebSocket:', error);
        });
    }
});
window.addEventListener("popstate", router);
// Actualizar UI cuando cambia el idioma
window.addEventListener('languageChanged', () => {
    router();
    updateHeader(state);
});
// npx tsc --watch
