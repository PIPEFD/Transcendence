"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsService = void 0;
// src/services/WebSocketService.ts
var config_js_1 = require("../config.js");
var WebSocketService = /** @class */ (function () {
    function WebSocketService() {
        this.ws = null;
        this.messageHandlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.isAuthenticated = false;
        this.shouldReconnect = true;
        this.userStatus = new Map(); // userId -> status
    }
    /**
     * Conecta al WebSocket y autentica automáticamente si hay token
     */
    WebSocketService.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var token = localStorage.getItem('tokenUser');
            var userId = localStorage.getItem('userId');
            if (!token || !userId) {
                console.warn('No hay token o userId. No se puede conectar al WebSocket.');
                reject(new Error('No authenticated'));
                return;
            }
            var wsUrl = config_js_1.WS_BASE_URL; // WS_BASE_URL ya incluye /ws/
            console.log('🔌 Conectando a WebSocket:', wsUrl);
            try {
                _this.ws = new WebSocket(wsUrl);
                _this.ws.onopen = function () {
                    var _a;
                    console.log('✅ WebSocket conectado. Enviando autenticación...');
                    // Enviar autenticación automáticamente
                    _this.send({
                        type: 'auth',
                        token: token,
                        id: userId
                    });
                    // Esperar respuesta de autenticación
                    var authTimeout = setTimeout(function () {
                        console.error('❌ Timeout esperando autenticación');
                        reject(new Error('Auth timeout'));
                    }, 5000);
                    // Handler temporal para auth
                    var tempHandler = function (event) {
                        var _a, _b;
                        try {
                            var data = JSON.parse(event.data);
                            clearTimeout(authTimeout);
                            if (data.type === 'auth-ok') {
                                console.log('✅ Autenticación exitosa');
                                _this.isAuthenticated = true;
                                _this.reconnectAttempts = 0;
                                (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.removeEventListener('message', tempHandler);
                                resolve(true);
                            }
                            else if (data.type === 'auth-failed') {
                                console.error('❌ Autenticación fallida:', data.reason);
                                (_b = _this.ws) === null || _b === void 0 ? void 0 : _b.removeEventListener('message', tempHandler);
                                reject(new Error(data.reason || 'Auth failed'));
                            }
                        }
                        catch (e) {
                            // No es JSON o no es mensaje de auth
                        }
                    };
                    (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.addEventListener('message', tempHandler);
                };
                _this.ws.onmessage = function (event) {
                    try {
                        var data_1 = JSON.parse(event.data);
                        console.log('📩 Mensaje recibido:', data_1);
                        // Manejar cambios de estado de usuario
                        if (data_1.type === 'user-status-changed') {
                            _this.userStatus.set(data_1.userId, data_1.status);
                            console.log("\uD83D\uDC64 ".concat(data_1.username, " ahora est\u00E1 ").concat(data_1.status));
                        }
                        // Manejar lista de usuarios online
                        if (data_1.type === 'online-users') {
                            data_1.users.forEach(function (user) {
                                _this.userStatus.set(user.userId, user.status);
                            });
                            console.log("\uD83D\uDC65 ".concat(data_1.count, " usuarios online"));
                        }
                        // Distribuir a los handlers registrados
                        var type = data_1.type || 'unknown';
                        var handlers = _this.messageHandlers.get(type) || [];
                        handlers.forEach(function (handler) { return handler(data_1); });
                        // También llamar a los handlers genéricos
                        var genericHandlers = _this.messageHandlers.get('*') || [];
                        genericHandlers.forEach(function (handler) { return handler(data_1); });
                    }
                    catch (e) {
                        console.error('Error parseando mensaje:', e);
                    }
                };
                _this.ws.onerror = function (error) {
                    console.error('❌ Error en WebSocket:', error);
                    reject(error);
                };
                _this.ws.onclose = function (event) {
                    console.log('🔌 WebSocket cerrado:', event.code, event.reason);
                    _this.isAuthenticated = false;
                    if (_this.shouldReconnect && _this.reconnectAttempts < _this.maxReconnectAttempts) {
                        _this.reconnectAttempts++;
                        console.log("\uD83D\uDD04 Reintentando conexi\u00F3n (".concat(_this.reconnectAttempts, "/").concat(_this.maxReconnectAttempts, ")..."));
                        setTimeout(function () { return _this.connect(); }, _this.reconnectDelay);
                    }
                };
            }
            catch (error) {
                console.error('❌ Error creando WebSocket:', error);
                reject(error);
            }
        });
    };
    /**
     * Registra un handler para un tipo de mensaje específico
     */
    WebSocketService.prototype.on = function (messageType, handler) {
        if (!this.messageHandlers.has(messageType)) {
            this.messageHandlers.set(messageType, []);
        }
        this.messageHandlers.get(messageType).push(handler);
    };
    /**
     * Elimina un handler
     */
    WebSocketService.prototype.off = function (messageType, handler) {
        var handlers = this.messageHandlers.get(messageType);
        if (handlers) {
            var index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    };
    /**
     * Envía un mensaje al servidor
     */
    WebSocketService.prototype.send = function (data) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('❌ WebSocket no está conectado');
            return false;
        }
        try {
            this.ws.send(JSON.stringify(data));
            console.log('📤 Mensaje enviado:', data);
            return true;
        }
        catch (error) {
            console.error('❌ Error enviando mensaje:', error);
            return false;
        }
    };
    /**
     * Desconecta el WebSocket
     */
    WebSocketService.prototype.disconnect = function () {
        this.shouldReconnect = false;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isAuthenticated = false;
        this.messageHandlers.clear();
    };
    /**
     * Verifica si está conectado y autenticado
     */
    WebSocketService.prototype.isConnected = function () {
        return this.ws !== null &&
            this.ws.readyState === WebSocket.OPEN &&
            this.isAuthenticated;
    };
    /**
     * Envía un ping para mantener la conexión viva
     */
    WebSocketService.prototype.ping = function () {
        this.send({ type: 'ping' });
    };
    /**
     * Obtiene el estado de un usuario
     */
    WebSocketService.prototype.getUserStatus = function (userId) {
        return this.userStatus.get(userId);
    };
    /**
     * Cambia el estado del usuario actual
     */
    WebSocketService.prototype.setStatus = function (status) {
        this.send({ type: 'set-status', status: status });
    };
    /**
     * Solicita la lista de usuarios online
     */
    WebSocketService.prototype.getOnlineUsers = function () {
        this.send({ type: 'get-online-users' });
    };
    return WebSocketService;
}());
// Exportar instancia singleton
exports.wsService = new WebSocketService();
