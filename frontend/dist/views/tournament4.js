import { navigate } from "../main.js";
import { t } from "../translations/index.js";
export function Tournament4View(app, state) {
    app.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full space-y-6">

      <h1 class="text-2xl text-poke-yellow font-bold"> ${t("Player4Tournament")}</h1>

      <div class="bg-poke-light bg-opacity-20 p-6 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-sm">

        <input id="p1" placeholder="${t("Player1")}" 
          class="py-2 px-3 rounded border border-poke-dark bg-white text-black"/>

        <input id="p2" placeholder="${t("Player2")}" 
          class="py-2 px-3 rounded border border-poke-dark bg-white text-black"/>
 
        <input id="p3" placeholder="${t("Player3")}" 
          class="py-2 px-3 rounded border border-poke-dark bg-white text-black"/>

        <input id="p4" placeholder="${t("Player4")}" 
          class="py-2 px-3 rounded border border-poke-dark bg-white text-black"/>

        <p id="errorMsg" class="text-red-500 text-center text-sm hidden"></p>

        <button id="startBtn"
          class="bg-poke-red text-white py-2 rounded hover:bg-red-600">
          ${t("StartTournament")}
        </button>

        <button id="backBtn"
          class="bg-poke-blue text-white py-2 rounded hover:bg-blue-600">
          ${t("goBack")}
        </button>

      </div>

    </div>
  `;
    // inputs
    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");
    const p3 = document.getElementById("p3");
    const p4 = document.getElementById("p4");
    const errorMsg = document.getElementById("errorMsg");
    const startBtn = document.getElementById("startBtn");
    const backBtn = document.getElementById("backBtn");
    startBtn.addEventListener("click", () => {
        const names = [p1.value.trim(), p2.value.trim(), p3.value.trim(), p4.value.trim()];
        // Check empty fields
        if (names.some(n => n === "")) {
            showError("All player names are required.");
            return;
        }
        // Check uniqueness
        const unique = new Set(names);
        if (unique.size !== names.length) {
            showError("Player names must be unique. No duplicates allowed.");
            return;
        }
        // Clear error
        errorMsg.classList.add("hidden");
        // Save players in state for next screen
        state.tournamentPlayers = names;
        // navigate to bracket or game start
        navigate("/tournament4start");
    });
    backBtn.addEventListener("click", () => navigate("/tournament"));
    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove("hidden");
    }
}
