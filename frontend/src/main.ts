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
import { GameOne } from "./views/1v1.js";
import { GameVsAI } from "./views/vsIA.js";
import { GameThree } from "./views/3players.js";






// Define las interfaces y el estado global
interface Player {
  alias: string;
  user: string;
  avatar: number;
  matches: number;
  victories: number;
  defeats: number;
  id?: number; // add this line
}
interface State {
  player: Player;
}
const state: State = {
  player: { alias: "", user: "", avatar: 0, matches: 10, victories: 7, defeats: 8 }
};
export type Lang = "en" | "fr" | "es";
export let currentLang: Lang = (localStorage.getItem("playerLang") as Lang) || "en";

/* export function setLanguage(lang: Lang): void {
  currentLang = lang;
  localStorage.setItem("playerLang", lang);
  // re-render current view so any language-aware UI can update
  router();
} */


// La función navigate ahora debe ser exportada para que las vistas puedan importarla
export function navigate(path: string): void {
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
  }
  router();
}

function router(): void {
  const app = document.getElementById("app");
  if (!app) return;

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
      case "/1v1":
        GameOne(app, state);
        break;  
    case "/vsAI":
      GameVsAI(app, state);
      break;
          case "/3player":
      GameThree(app, state);
      break;   
    default: // Home
      HomeView(app, state);
      break;
  }
  updateHeaderFooterVisibility(route);
}

// Funciones de utilidad y de inicialización
function updateHeaderFooterVisibility(route: string) {
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  if (!header || !footer) return;

  const hiddenRoutes = ["/register", "/profile", "/choose", "/avatar", "/login", "/profile1", "/authentication"];
  if (hiddenRoutes.includes(route)) {
    header.classList.add("hidden");
    footer.classList.add("hidden");
  } else {
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
  } else {
    router();
  }
});

window.addEventListener("popstate", router);

// Actualizar UI cuando cambia el idioma
window.addEventListener('languageChanged', () => {
  router();
  updateHeader(state);
});

export {}; // para evitar conflictos TS