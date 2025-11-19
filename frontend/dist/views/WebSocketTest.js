// src/views/WebSocketTest.ts
export function WebSocketTestView(app, state) {
    var _a, _b, _c, _d;
    app.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>WebSocket Test</title>
        <style>
            body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #0f0; }
            .log { padding: 5px; margin: 2px 0; border-left: 3px solid #0f0; }
            .error { border-color: #f00; color: #f00; }
            .success { border-color: #0f0; }
            .info { border-color: #ff0; color: #ff0; }
            button { padding: 10px 20px; margin: 5px; cursor: pointer; background: #333; color: #0f0; border: 1px solid #0f0; }
            button:hover { background: #0f0; color: #000; }
            input { padding: 10px; width: 300px; background: #333; color: #0f0; border: 1px solid #0f0; }
        </style>
    </head>
    <body>
        <h1>🔌 WebSocket Test Client</h1>
        <div>
            <input type="text" id="wsUrl" value="" placeholder="WebSocket URL">
            <button id="connectBtn">Connect</button>
            <button id="disconnectBtn">Disconnect</button>
        </div>
        <div style="margin-top: 20px;">
            <input type="text" id="message" placeholder='{"type": "ping"}'>
            <button id="sendBtn">Send Message</button>
        </div>
        <div style="margin-top: 20px;">
            <button id="clearBtn">Clear Logs</button>
        </div>
        <div id="logs" style="margin-top: 20px;"></div>
    </body>
    </html>
  `;
    let ws = null;
    function log(message, type = 'info') {
        const logs = document.getElementById('logs');
        if (!logs)
            return;
        const div = document.createElement('div');
        div.className = `log ${type}`;
        div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logs.insertBefore(div, logs.firstChild);
    }
    function connect() {
        const urlInput = document.getElementById('wsUrl');
        const url = urlInput.value;
        log(`Conectando a ${url}...`, 'info');
        try {
            ws = new WebSocket(url);
            ws.onopen = () => {
                log('✅ WebSocket conectado exitosamente', 'success');
            };
            ws.onclose = (event) => {
                log(`🔌 WebSocket cerrado. Code: ${event.code}, Reason: ${event.reason}`, 'info');
            };
            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                log(`❌ Error en WebSocket: ${error.type || 'Connection failed'}`, 'error');
                if (error instanceof ErrorEvent) {
                    log(`   Error message: ${error.message}`, 'error');
                }
            };
            ws.onmessage = (event) => {
                log(`📩 Mensaje recibido: ${event.data}`, 'success');
                try {
                    const data = JSON.parse(event.data);
                    log(`   Parsed: ${JSON.stringify(data, null, 2)}`, 'success');
                }
                catch (e) {
                    // No es JSON
                }
            };
        }
        catch (error) {
            log(`❌ Error al crear WebSocket: ${error}`, 'error');
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
        const messageInput = document.getElementById('message');
        const message = messageInput.value;
        try {
            ws.send(message);
            log(`📤 Mensaje enviado: ${message}`, 'success');
        }
        catch (error) {
            log(`❌ Error enviando mensaje: ${error}`, 'error');
        }
    }
    function clearLogs() {
        const logs = document.getElementById('logs');
        if (logs)
            logs.innerHTML = '';
    }
    // Auto-detectar URL basado en la ubicación actual
    setTimeout(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const defaultUrl = `${protocol}//${window.location.host}/ws/`;
        const urlInput = document.getElementById('wsUrl');
        if (urlInput) {
            urlInput.value = defaultUrl;
            log(`URL detectada automáticamente: ${defaultUrl}`, 'info');
        }
    }, 100);
    // Event listeners
    (_a = document.getElementById('connectBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', connect);
    (_b = document.getElementById('disconnectBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', disconnect);
    (_c = document.getElementById('sendBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', sendMessage);
    (_d = document.getElementById('clearBtn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', clearLogs);
    const messageInput = document.getElementById('message');
    messageInput === null || messageInput === void 0 ? void 0 : messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter')
            sendMessage();
    });
}
