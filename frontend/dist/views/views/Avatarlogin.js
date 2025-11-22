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
exports.AvatarView1 = AvatarView1;
var main_js_1 = require("../main.js");
var Header_js_1 = require("./Header.js");
var index_js_1 = require("../translations/index.js");
var api_js_1 = require("../config/api.js");
function AvatarView1(app, state) {
    var _this = this;
    app.innerHTML = "\n\t<div class=\"text-center mb-4\">\n\t\t<h1 class=\"text-poke-yellow text-2xl\">POK\u00E9MON</h1>\n\t\t<p class=\"text-poke-light text-xs\">PONG</p>\n\t</div>\n\n\t<div class=\"bg-poke-light bg-opacity-60 text-poke-dark border-3 border-poke-dark p-4 rounded-lg shadow-lg\">\n\t\t<h1 class=\"text-sm leading-relaxed mb-4\">".concat((0, index_js_1.t)("choose_avatar"), "</h1>\n\t\t<div class=\"grid grid-cols-3 gap-4 mb-4\">\n\t\t\t").concat(Array.from({ length: 9 }, function (_, i) { return "\n\t\t\t  <div class=\"flex flex-col items-center\">\n\t\t\t\t<img src=\"/assets/avatar".concat(i + 1, ".png\" alt=\"Avatar ").concat(i + 1, "\" class=\"w-20 h-20 mb-2 border-2 border-poke-dark rounded-lg shadow-md\" />\n\t\t\t\t<button class=\"bg-poke-blue bg-opacity-80 text-poke-light py-1 px-2 text-sm border-2 border-poke-dark rounded hover:bg-gradient-to-b hover:from-poke-blue hover:to-blue-600 hover:bg-opacity-100 active:animate-press\" data-avatar=\"").concat(i + 1, "\">\n\t\t\t\t  ").concat((0, index_js_1.t)("select"), "\n\t\t\t\t</button>\n\t\t\t  </div>\n\t\t\t"); }).join(""), "\n\t\t</div>\n\n\t\t<!-- Upload Avatar Section -->\n\t\t<div class=\"flex flex-col items-center\">\n\t\t  <input type=\"file\" id=\"uploadAvatarInput\" accept=\"image/*\" class=\"hidden\" />\n\t\t  <button id=\"uploadAvatarBtn1\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 px-4 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 active:animate-press mb-4\">\n\t\t\t").concat((0, index_js_1.t)("upload_avatar"), "\n\t\t  </button>\n\t\t  <img id=\"previewAvatar1\" class=\"w-32 h-32 rounded-full border-2 border-poke-dark hidden mb-2\" />\n\t\t  <button id=\"saveUploadBtn\" class=\"bg-poke-blue bg-opacity-80 text-poke-light py-2 px-4 border-3 border-poke-blue border-b-blue-800 rounded hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-600 active:animate-press hidden\">\n\t\t\t").concat((0, index_js_1.t)("select"), "\n\t\t  </button>\n\t\t</div>\n\t</div>\n  ");
    // Select pre-defined avatars
    document.querySelectorAll("[data-avatar]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var value = btn.getAttribute("data-avatar");
            if (!value)
                return;
            state.player.avatar = Number(value);
            (0, Header_js_1.updateHeader)(state);
            (0, main_js_1.navigate)("/register");
        });
    });
    // Upload custom avatar
    var uploadBtn = document.getElementById("uploadAvatarBtn1");
    var uploadInput = document.getElementById("uploadAvatarInput");
    var preview = document.getElementById("previewAvatar1");
    var saveBtn = document.getElementById("saveUploadBtn");
    uploadBtn === null || uploadBtn === void 0 ? void 0 : uploadBtn.addEventListener("click", function () {
        uploadInput.click(); // trigger file picker
    });
    uploadInput === null || uploadInput === void 0 ? void 0 : uploadInput.addEventListener("change", function () {
        if (!uploadInput.files || uploadInput.files.length === 0)
            return;
        var file = uploadInput.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            preview.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            preview.classList.remove("hidden");
            saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    });
    saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var file, formData, userId, userIdPlaceholder, token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!uploadInput.files || uploadInput.files.length === 0)
                        return [2 /*return*/];
                    file = uploadInput.files[0];
                    formData = new FormData();
                    formData.append("avatar", file);
                    userId = localStorage.getItem('userId');
                    console.log("id entrar upload: ", userId);
                    userIdPlaceholder = userId ? parseInt(userId, 10) : null;
                    formData.append("user_id", String(userId)); // asegúrate de tener el user ID
                    token = localStorage.getItem('tokenUser');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, (0, api_js_1.apiFetch)(api_js_1.API_ENDPOINTS.UPLOAD, {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                user_id: userIdPlaceholder,
                                avatar: file,
                            })
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log("Friends data:", data);
                    return [4 /*yield*/, (0, Header_js_1.updateHeader)(state)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error fetching friend list:", error_1);
                    return [2 /*return*/, "<p class=\"text-red-500\">".concat((0, index_js_1.t)("error_network") || "Error de red.", "</p>")];
                case 6: return [2 /*return*/];
            }
        });
    }); });
}
