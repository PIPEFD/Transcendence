var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Importa las funciones de cada vista
import { RegisterView } from "./views/Register.js";
import { ProfileView } from "./views/Profile.js";
import { Profile1View } from "./views/Profile1.js";
import { AuthView } from "./views/Authenticaction.js";
import { ChooseView } from "./views/Choose.js";
import { AvatarView } from "./views/Avatar.js";
import { AvatarView1 } from "./views/Avatarlogin.js";
import { GameView } from "./views/Game.js";
import { TournamentView } from "./views/Tournament.js";
import { ChatView } from "./views/Chat.js";
import { HomeView } from "./views/Home.js";
import { SettingsView } from "./views/Settings.js";
import { updateHeader } from "./views/Header.js";
import { StatsView } from "./views/Statistics.js";
import { LanguageView } from "./views/Language.js";
import { MatchHistoryView } from "./views/MatchHistory.js";
import { LoginView } from "./views/Login.js";
import { setLanguage } from "./translations/index.js";
import { MenuView } from "./views/Menu.js";
import { FriendsView } from "./views/Friend.js";
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
    const hiddenRoutes = ["/register", "/profile", "/choose", "/avatar", "/login", "/profile1", "/authentication"];
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
});
window.addEventListener("popstate", router);
const clearDbBtn = document.createElement('button');
clearDbBtn.textContent = "🧹 Borrar toda la base de datos (Test)";
clearDbBtn.className = `
  bg-gradient-to-b from-red-500 to-red-700 
  text-poke-light py-2 px-4 border-3 border-red-900 border-b-red-900 
  rounded hover:from-red-600 hover:to-red-800 active:animate-press
  mt-4 mx-auto block
  shadow-lg
  text-sm
`;
clearDbBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!confirm("Esto borrará toda la base de datos. ¿Seguro?"))
        return;
    try {
        const response = yield fetch("http://localhost:8085/api/delete_all.php", {
            method: 'POST'
        });
        const data = yield response.json();
        alert(data.success || data.error);
    }
    catch (err) {
        console.error(err);
        alert("Error borrando la base de datos");
    }
}));
const esDbBtn = document.createElement('button');
esDbBtn.textContent = "Spanish";
esDbBtn.className = `
  bg-gradient-to-b from-blue-500 to-blue-700 
  text-poke-light py-2 px-4 border-3 border-blue-900 border-b-blue-900 
  rounded hover:from-blue-600 hover:to-blue-800 active:animate-press
  mt-4 mx-auto block
  shadow-lg
  text-sm
`;
esDbBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    setLanguage("es");
}));
const frDbBtn = document.createElement('button');
frDbBtn.textContent = "French";
frDbBtn.className = `
  bg-gradient-to-b from-blue-500 to-blue-700 
  text-poke-light py-2 px-4 border-3 border-blue-900 border-b-blue-900 
  rounded hover:from-blue-600 hover:to-blue-800 active:animate-press
  mt-4 mx-auto block
  shadow-lg
  text-sm
`;
frDbBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    setLanguage("fr");
}));
const enDbBtn = document.createElement('button');
enDbBtn.textContent = "English";
enDbBtn.className = `
  bg-gradient-to-b from-blue-500 to-blue-700 
  text-poke-light py-2 px-4 border-3 border-blue-900 border-b-blue-900 
  rounded hover:from-blue-600 hover:to-blue-800 active:animate-press
  mt-4 mx-auto block
  shadow-lg
  text-sm
`;
enDbBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    setLanguage("en");
}));
const langContainer = document.createElement("div");
langContainer.className = "flex gap-2 justify-center mt-4"; // flex horizontal + espacio entre botones
// Añadir los botones al contenedor
langContainer.appendChild(clearDbBtn);
langContainer.appendChild(esDbBtn);
langContainer.appendChild(frDbBtn);
langContainer.appendChild(enDbBtn);
// Añadir el botón al final del body o a un contenedor específico
document.body.appendChild(langContainer);
//npx tsc --watch
