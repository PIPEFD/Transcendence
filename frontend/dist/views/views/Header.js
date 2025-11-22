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
exports.updateHeader = updateHeader;
var main_js_1 = require("../main.js");
var api_js_1 = require("../config/api.js");
// Función async para obtener la URL del avatar
function fetchAvatarUrl(userId, token) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, avatarUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!userId || !token)
                        return [2 /*return*/, null];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(api_js_1.API_ENDPOINTS.AVATAR_PHOTO, {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ id: userId }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("Error fetching avatar:", response.status);
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log("Avatar response:", data);
                    avatarUrl = null;
                    if (data.success) {
                        if (typeof data.success === 'object' && data.success.avatar_url) {
                            avatarUrl = data.success.avatar_url;
                        }
                        else if (typeof data.success === 'string') {
                            avatarUrl = data.success;
                        }
                    }
                    return [2 /*return*/, avatarUrl];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error fetching avatar:", error_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Función normal que actualiza el header
function updateHeader(state) {
    var header = document.querySelector("header");
    if (!header)
        return;
    var token = localStorage.getItem("tokenUser");
    var userId = localStorage.getItem('userId');
    var userIdPlaceholder = userId ? parseInt(userId, 10) : null;
    console.log("id entrar hh: ", userId);
    console.log("token: ", token);
    // Llamamos a la función async sin usar await
    fetchAvatarUrl(userIdPlaceholder, token).then(function (avatarUrl) {
        console.log("Avatar URL obtenida:", avatarUrl);
        // Usar el avatar del endpoint si existe
        var avatarSrc = avatarUrl || "/assets/avatar_39.png"; // Avatar por defecto si no hay
        header.innerHTML = "\n      <div class=\"relative flex items-center justify-center\">\n        <img src=\"/assets/logo.png\" alt=\"PONG\" class=\"h-12\">\n        <div class=\"absolute right-4 flex items-center space-x-2\">\n          <img src=\"".concat(avatarSrc, "\"\n               id=\"avBtn\"\n               alt=\"avatar\"\n               class=\"w-10 h-10 rounded-full cursor-pointer hover:opacity-80 object-cover\"/>\n          <img src=\"/assets/settings.png\"\n               id=\"settingsBtn\"\n               alt=\"settings\"\n               class=\"w-10 h-10 rounded-full cursor-pointer hover:opacity-80\"/>\n        </div>\n      </div>\n    ");
        var settingsBtn = document.getElementById("settingsBtn");
        var avBtn = document.getElementById("avBtn");
        if (settingsBtn)
            settingsBtn.addEventListener("click", function () { return (0, main_js_1.navigate)("/settings"); });
        if (avBtn)
            avBtn.addEventListener("click", function () { return (0, main_js_1.navigate)("/menu"); });
    });
}
