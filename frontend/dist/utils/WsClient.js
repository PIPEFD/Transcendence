var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// WebSocket Client with authentication, reconnection, and lifecycle management
import { WS_BASE_URL } from '../config.js';
export class WsClient {
    constructor(options) {
        this.ws = null;
        this.authenticated = false;
        this.reconnectAttempts = 0;
        this.heartbeatTimer = null;
        this.reconnectTimer = null;
        this.messageHandlers = new Map();
        this.token = null;
        this.userId = null;
        this.options = {
            autoReconnect: true,
            maxReconnectAttempts: 5,
            reconnectDelay: 2000,
            heartbeatInterval: 30000, // 30 seconds
            onConnected: () => { },
            onDisconnected: () => { },
            onError: () => { }
        };
        if (options) {
            this.options = Object.assign(Object.assign({}, this.options), options);
        }
    }
    /**
     * Connect to WebSocket server and authenticate
     */
    connect(token, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.token = token;
            this.userId = userId;
            return new Promise((resolve, reject) => {
                try {
                    // Close existing connection if any
                    if (this.ws) {
                        this.ws.close();
                    }
                    this.ws = new WebSocket(WS_BASE_URL);
                    this.ws.onopen = () => {
                        console.log('🔌 WebSocket connected');
                        this.reconnectAttempts = 0;
                        // Send authentication message
                        this.sendRaw({
                            type: 'auth',
                            token: this.token,
                            id: this.userId
                        });
                    };
                    this.ws.onmessage = (event) => {
                        var _a;
                        try {
                            const data = JSON.parse(event.data);
                            // Handle auth response
                            if (data.type === 'auth') {
                                if (data.success || !data.error) {
                                    this.authenticated = true;
                                    console.log('✅ WebSocket authenticated');
                                    this.startHeartbeat();
                                    this.options.onConnected();
                                    resolve();
                                }
                                else {
                                    console.error('❌ WebSocket authentication failed:', data.error);
                                    this.authenticated = false;
                                    reject(new Error(data.error || 'Authentication failed'));
                                    (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
                                }
                                return;
                            }
                            // Handle pong response
                            if (data.type === 'pong') {
                                return;
                            }
                            // Dispatch to registered handlers
                            this.dispatchMessage(data);
                        }
                        catch (err) {
                            console.error('Error parsing WebSocket message:', err);
                        }
                    };
                    this.ws.onerror = (error) => {
                        console.error('❌ WebSocket error:', error);
                        this.options.onError(error);
                        reject(error);
                    };
                    this.ws.onclose = () => {
                        console.log('🔌 WebSocket disconnected');
                        this.authenticated = false;
                        this.stopHeartbeat();
                        this.options.onDisconnected();
                        // Auto-reconnect if enabled
                        if (this.options.autoReconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
                            this.scheduleReconnect();
                        }
                    };
                }
                catch (err) {
                    console.error('Error creating WebSocket:', err);
                    reject(err);
                }
            });
        });
    }
    /**
     * Send a message to the server
     */
    send(type, data = {}) {
        if (!this.authenticated) {
            console.warn('⚠️ Cannot send message: not authenticated');
            return false;
        }
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.warn('⚠️ Cannot send message: WebSocket not open');
            return false;
        }
        this.sendRaw(Object.assign({ type }, data));
        return true;
    }
    /**
     * Send raw message (used internally)
     */
    sendRaw(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
    /**
     * Register a message handler for a specific message type
     */
    on(type, handler) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }
        this.messageHandlers.get(type).push(handler);
    }
    /**
     * Unregister a message handler
     */
    off(type, handler) {
        const handlers = this.messageHandlers.get(type);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    /**
     * Dispatch message to registered handlers
     */
    dispatchMessage(message) {
        const handlers = this.messageHandlers.get(message.type);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(message);
                }
                catch (err) {
                    console.error(`Error in message handler for ${message.type}:`, err);
                }
            });
        }
    }
    /**
     * Start heartbeat (ping/pong)
     */
    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = window.setInterval(() => {
            var _a;
            if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
                this.sendRaw({ type: 'ping' });
            }
        }, this.options.heartbeatInterval);
    }
    /**
     * Stop heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    /**
     * Schedule a reconnection attempt
     */
    scheduleReconnect() {
        if (this.reconnectTimer) {
            return; // Already scheduled
        }
        this.reconnectAttempts++;
        const delay = this.options.reconnectDelay * this.reconnectAttempts;
        console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`);
        this.reconnectTimer = window.setTimeout(() => {
            this.reconnectTimer = null;
            if (this.token && this.userId) {
                this.connect(this.token, this.userId).catch(err => {
                    console.error('Reconnection failed:', err);
                });
            }
        }, delay);
    }
    /**
     * Close the WebSocket connection
     */
    close() {
        this.options.autoReconnect = false; // Disable auto-reconnect
        this.stopHeartbeat();
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.authenticated = false;
        this.messageHandlers.clear();
        console.log('🔌 WebSocket closed');
    }
    /**
     * Check if connected and authenticated
     */
    isConnected() {
        var _a;
        return this.authenticated && ((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN;
    }
    /**
     * Get current connection state
     */
    getState() {
        if (!this.ws)
            return 'closed';
        switch (this.ws.readyState) {
            case WebSocket.CONNECTING: return 'connecting';
            case WebSocket.OPEN: return 'open';
            case WebSocket.CLOSING: return 'closing';
            case WebSocket.CLOSED: return 'closed';
            default: return 'closed';
        }
    }
}
