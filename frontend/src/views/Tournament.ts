import { navigate } from "../main.js";

export function TournamentView(app: HTMLElement, state?: any): void {
  app.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full space-y-6">

      <h1 class="text-3xl text-poke-yellow font-bold">Tournament</h1>

      <div class="flex flex-col gap-4">
        <button id="btn4" class="bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600">
          4 Players
        </button>

        <button id="btn8" class="bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600">
          8 Players
        </button>

        <button id="btn16" class="bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600">
          16 Players
        </button>

        <button id="btnBack" class="bg-poke-blue text-white py-2 px-6 rounded hover:bg-blue-600">
          Back
        </button>
      </div>

    </div>
  `;

  // botones
  document.getElementById("btn4")?.addEventListener("click", () => navigate("/tournament4"));
  document.getElementById("btn8")?.addEventListener("click", () => navigate("/tournament8"));
  document.getElementById("btn16")?.addEventListener("click", () => navigate("/tournament16"));

  document.getElementById("btnBack")?.addEventListener("click", () => navigate("/"));
}
