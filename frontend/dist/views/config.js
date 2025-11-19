"use strict";
// Configuration for API and WebSocket endpoints
// Uses relative paths to work behind Nginx reverse proxy
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_DEV = exports.WS_BASE_URL = exports.API_BASE_URL = void 0;
// Get protocol from window location (https:// or http://)
var protocol = window.location.protocol;
var wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
// API base URL - uses Nginx proxy path /api/
exports.API_BASE_URL = "".concat(window.location.origin, "/api");
// WebSocket base URL - uses Nginx proxy path /ws/
exports.WS_BASE_URL = "".concat(wsProtocol, "//").concat(window.location.host, "/ws/");
// Development flag
exports.IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// Console log URLs in development
if (exports.IS_DEV) {
    console.log('🔧 Configuration:');
    console.log('  API_BASE_URL:', exports.API_BASE_URL);
    console.log('  WS_BASE_URL:', exports.WS_BASE_URL);
    console.log('WebSocketTest.ts loaded', exports.WS_BASE_URL);
}
