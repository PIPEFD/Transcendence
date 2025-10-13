import { navigate } from "../main.js";
import { t } from "../translations/index.js";

export function FriendsView(app: HTMLElement, state: any): void {
    app.innerHTML = `
    <div class="bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-8 rounded-2xl shadow-lg max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
        <h1 class="text-xl font-bold mb-4">${t("friends_center")}</h1>

        <!-- Top Navigation Tabs -->
        <div class="flex flex-wrap justify-around w-full mb-6 gap-3">
            <button id="friendsListBtn" class="tab-btn bg-poke-blue text-poke-light border-3 border-poke-blue border-b-blue-800 rounded px-4 py-2 hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press">
                ${t("friends_list")}
            </button>
            <button id="addFriendBtn" class="tab-btn bg-poke-red text-poke-light border-3 border-poke-red border-b-red-800 rounded px-4 py-2 hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press">
                ${t("add_friend")}
            </button>
            <button id="requestsBtn" class="tab-btn bg-poke-blue text-poke-light border-3 border-poke-blue border-b-blue-800 rounded px-4 py-2 hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press">
                ${t("requests")}
            </button>
        </div>

        <!-- Dynamic Content Area -->
        <div id="friendsContentOuter" class="w-full bg-white bg-opacity-40 border-2 border-poke-dark rounded-lg p-4 overflow-hidden" style="height: 400px;">
            <div id="friendsContent" class="w-full h-full overflow-y-auto pr-2 space-y-2">
                <!-- your friends list items go here -->
            </div>
        </div>

        <button id="backBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 mt-6 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press">
            ${t("goBack")}
        </button>
    </div>
    `;

    const content = document.getElementById("friendsContent") as HTMLElement;

    const sections = {
        list: `
            <h2 class="text-lg mb-3">${t("friends_list")}</h2>
            <ul class="space-y-2">
                ${Array(30).fill(0).map((_, i) => `
                    <li class="flex items-center justify-between bg-white bg-opacity-70 p-3 rounded border border-poke-dark">
                        <div class="flex items-center gap-3">
                            <img src="/assets/avatar${(i % 9) + 1}.png" class="w-10 h-10 rounded-full" />
                            <div class="text-left">
                                <div class="text-sm font-medium">Friend ${i + 1}</div>
                                <div class="text-xs text-poke-dark">Online</div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button class="px-3 py-1 bg-poke-blue bg-opacity-80 text-poke-light rounded border-2 border-poke-blue active:animate-press">${t("message")}</button>
                            <button class="px-3 py-1 bg-poke-red bg-opacity-80 text-poke-light rounded border-2 border-poke-red active:animate-press">${t("remove")}</button>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `,
        add: `
            <h2 class="text-lg mb-3">${t("add_friend")}</h2>
            <div class="flex items-center gap-3">
                <input id="friendName" type="text" placeholder="${t("enter_friend_name")}" class="border-2 border-poke-dark px-4 py-2 rounded flex-1"/>
                <button id="sendReqBtn" class="ml-2 bg-poke-blue text-poke-light px-4 py-2 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600">
                    ${t("send_request")}
                </button>
            </div>
            <p class="mt-4 text-sm text-poke-dark">${t("add_friend_hint")}</p>
        `,
        requests: `
            <h2 class="text-lg mb-3">${t("requests")}</h2>
            <div class="space-y-3">
                <div class="p-3 rounded border border-poke-dark bg-white bg-opacity-80 flex justify-between items-center">
                    <div>
                        <div class="font-medium">IncomingUser1</div>
                        <div class="text-xs text-poke-dark">Wants to be your friend</div>
                    </div>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 bg-poke-blue text-poke-light rounded">${t("accept")}</button>
                        <button class="px-3 py-1 bg-poke-red text-poke-light rounded">${t("decline")}</button>
                    </div>
                </div>
                <p class="text-sm text-poke-dark">${t("no_more_requests")}</p>
            </div>
        `,
        blocked: `
            <h2 class="text-lg mb-3">${t("blocked_users")}</h2>
            <p class="text-sm text-poke-dark">${t("no_blocked_users")}</p>
        `
    };

    const switchTab = (tab: keyof typeof sections) => {
        const inner = content;
        inner.style.opacity = '0';
        setTimeout(() => {
            inner.innerHTML = sections[tab];
            inner.style.opacity = '1';

            const sendReqBtn = document.getElementById("sendReqBtn");
            if (sendReqBtn) {
                sendReqBtn.addEventListener("click", () => {
                    const nameInput = document.getElementById("friendName") as HTMLInputElement | null;
                    if (!nameInput || !nameInput.value.trim()) return;
                    alert("Request sent to " + nameInput.value.trim());
                    nameInput.value = "";
                });
            }
        }, 120);
    };

    document.getElementById("friendsListBtn")?.addEventListener("click", () => switchTab("list"));
    document.getElementById("addFriendBtn")?.addEventListener("click", () => switchTab("add"));
    document.getElementById("requestsBtn")?.addEventListener("click", () => switchTab("requests"));
    document.getElementById("blockedBtn")?.addEventListener("click", () => switchTab("blocked"));
    document.getElementById("backBtn")?.addEventListener("click", () => navigate("/"));
}
