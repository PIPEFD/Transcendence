"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketTestView = WebSocketTestView;
// src/views/WebSocketTest.ts
function WebSocketTestView(app, state) {
    var _a, _b, _c, _d;
    app.innerHTML = "\n    <!DOCTYPE html>\n    <html>\n    <head>\n        <title>WebSocket Test</title>\n        <style>\n            body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #0f0; }\n            .log { padding: 5px; margin: 2px 0; border-left: 3px solid #0f0; }\n            .error { border-color: #f00; color: #f00; }\n            .success { border-color: #0f0; }\n            .info { border-color: #ff0; color: #ff0; }\n            button { padding: 10px 20px; margin: 5px; cursor: pointer; background: #333; color: #0f0; border: 1px solid #0f0; }\n            button:hover { background: #0f0; color: #000; }\n            input { padding: 10px; width: 300px; background: #333; color: #0f0; border: 1px solid #0f0; }\n        </style>\n    </head>\n    <body>\n        <h1>\uD83D\uDD0C WebSocket Test Client</h1>\n        <div>\n            <input type=\"text\" id=\"wsUrl\" value=\"\" placeholder=\"WebSocket URL\">\n            <button id=\"connectBtn\">Connect</button>\n            <button id=\"disconnectBtn\">Disconnect</button>\n        </div>\n        <div style=\"margin-top: 20px;\">\n            <input type=\"text\" id=\"message\" placeholder='{\"type\": \"ping\"}'>\n            <button id=\"sendBtn\">Send Message</button>\n        </div>\n        <div style=\"margin-top: 20px;\">\n            <button id=\"clearBtn\">Clear Logs</button>\n        </div>\n        <div id=\"logs\" style=\"margin-top: 20px;\"></div>\n    </body>\n    </html>\n  ";
    var ws = null;
    function log(message, type) {
        if (type === void 0) { type = 'info'; }
        var logs = document.getElementById('logs');
        if (!logs)
            return;
        var div = document.createElement('div');
        div.className = "log ".concat(type);
        div.textContent = "[".concat(new Date().toLocaleTimeString(), "] ").concat(message);
        logs.insertBefore(div, logs.firstChild);
    }
    function connect() {
        var urlInput = document.getElementById('wsUrl');
        var url = urlInput.value;
        log("Conectando a ".concat(url, "..."), 'info');
        try {
            ws = new WebSocket(url);
            ws.onopen = function () {
                log('✅ WebSocket conectado exitosamente', 'success');
            };
            ws.onclose = function (event) {
                log("\uD83D\uDD0C WebSocket cerrado. Code: ".concat(event.code, ", Reason: ").concat(event.reason), 'info');
            };
            ws.onerror = function (error) {
                console.error('WebSocket error:', error);
                log("\u274C Error en WebSocket: ".concat(error.type || 'Connection failed'), 'error');
                if (error instanceof ErrorEvent) {
                    log("   Error message: ".concat(error.message), 'error');
                }
            };
            ws.onmessage = function (event) {
                log("\uD83D\uDCE9 Mensaje recibido: ".concat(event.data), 'success');
                try {
                    var data = JSON.parse(event.data);
                    log("   Parsed: ".concat(JSON.stringify(data, null, 2)), 'success');
                }
                catch (e) {
                    // No es JSON
                }
            };
        }
        catch (error) {
            log("\u274C Error al crear WebSocket: ".concat(error), 'error');
        }
    }
    function disconnect() {
        if (ws) {
            ws.close();
            ws = null;
            log('Desconectado manualmente', 'info');
        }
        else {
            log('No hay conexión activa', 'error');
        }
    }
    function sendMessage() {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            log('❌ WebSocket no está conectado', 'error');
            return;
        }
        var messageInput = document.getElementById('message');
        var message = messageInput.value;
        try {
            ws.send(message);
            log("\uD83D\uDCE4 Mensaje enviado: ".concat(message), 'success');
        }
        catch (error) {
            log("\u274C Error enviando mensaje: ".concat(error), 'error');
        }
    }
    function clearLogs() {
        var logs = document.getElementById('logs');
        if (logs)
            logs.innerHTML = '';
    }
    // Auto-detectar URL basado en la ubicación actual
    setTimeout(function () {
        var protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        var defaultUrl = "".concat(protocol, "//").concat(window.location.host, "/ws/");
        var urlInput = document.getElementById('wsUrl');
        if (urlInput) {
            urlInput.value = defaultUrl;
            log("URL detectada autom\u00E1ticamente: ".concat(defaultUrl), 'info');
        }
    }, 100);
    // Event listeners
    (_a = document.getElementById('connectBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', connect);
    (_b = document.getElementById('disconnectBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', disconnect);
    (_c = document.getElementById('sendBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', sendMessage);
    (_d = document.getElementById('clearBtn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', clearLogs);
    var messageInput = document.getElementById('message');
    messageInput === null || messageInput === void 0 ? void 0 : messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter')
            sendMessage();
    });
}
