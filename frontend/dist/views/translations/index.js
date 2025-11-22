"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLanguage = setLanguage;
exports.getLanguage = getLanguage;
exports.t = t;
var en_js_1 = require("./en.js");
var fr_js_1 = require("./fr.js");
var es_js_1 = require("./es.js");
var currentLang = localStorage.getItem("lang") || "en";
var translations = { en: en_js_1.default, fr: fr_js_1.default, es: es_js_1.default };
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    // Disparar evento personalizado para notificar el cambio
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
}
function getLanguage() {
    return currentLang;
}
function t(key) {
    var _a;
    return ((_a = translations[currentLang]) === null || _a === void 0 ? void 0 : _a[key]) || key;
}
