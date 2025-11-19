// src/services/WebSocketService.ts
import { WS_BASE_URL } from '../config.js';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isAuthenticated = false;
  private shouldReconnect = true;
  private userStatus: Map<string, string> = new Map(); // userId -> status

  /**
   * Conecta al WebSocket y autentica automáticamente si hay token
   */
  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('tokenUser');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        console.warn('No hay token o userId. No se puede conectar al WebSocket.');
        reject(new Error('No authenticated'));
        return;
      }

      const wsUrl = WS_BASE_URL; // WS_BASE_URL ya incluye /ws/
      console.log('🔌 Conectando a WebSocket:', wsUrl);

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket conectado. Enviando autenticación...');
          // Enviar autenticación automáticamente
          this.send({
            type: 'auth',
            token: token,
            id: userId
          });

          // Esperar respuesta de autenticación
          const authTimeout = setTimeout(() => {
            console.error('❌ Timeout esperando autenticación');
            reject(new Error('Auth timeout'));
          }, 5000);

          // Handler temporal para auth
          const tempHandler = (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data);
              clearTimeout(authTimeout);
              
              if (data.type === 'auth-ok') {
                console.log('✅ Autenticación exitosa');
                this.isAuthenticated = true;
                this.reconnectAttempts = 0;
                this.ws?.removeEventListener('message', tempHandler);
                resolve(true);
              } else if (data.type === 'auth-failed') {
                console.error('❌ Autenticación fallida:', data.reason);
                this.ws?.removeEventListener('message', tempHandler);
                reject(new Error(data.reason || 'Auth failed'));
              }
            } catch (e) {
              // No es JSON o no es mensaje de auth
            }
          };

          this.ws?.addEventListener('message', tempHandler);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📩 Mensaje recibido:', data);
            
            // Manejar cambios de estado de usuario
            if (data.type === 'user-status-changed') {
              this.userStatus.set(data.userId, data.status);
              console.log(`👤 ${data.username} ahora está ${data.status}`);
            }
            
            // Manejar lista de usuarios online
            if (data.type === 'online-users') {
              data.users.forEach((user: any) => {
                this.userStatus.set(user.userId, user.status);
              });
              console.log(`👥 ${data.count} usuarios online`);
            }
            
            // Distribuir a los handlers registrados
            const type = data.type || 'unknown';
            const handlers = this.messageHandlers.get(type) || [];
            handlers.forEach(handler => handler(data));
            
            // También llamar a los handlers genéricos
            const genericHandlers = this.messageHandlers.get('*') || [];
            genericHandlers.forEach(handler => handler(data));
          } catch (e) {
            console.error('Error parseando mensaje:', e);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ Error en WebSocket:', error);
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket cerrado:', event.code, event.reason);
          this.isAuthenticated = false;
          
          if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), this.reconnectDelay);
          }
        };
      } catch (error) {
        console.error('❌ Error creando WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Registra un handler para un tipo de mensaje específico
   */
  on(messageType: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  /**
   * Elimina un handler
   */
  off(messageType: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Envía un mensaje al servidor
   */
  send(data: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket no está conectado');
      return false;
    }

    try {
      this.ws.send(JSON.stringify(data));
      console.log('📤 Mensaje enviado:', data);
      return true;
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      return false;
    }
  }

  /**
   * Desconecta el WebSocket
   */
  disconnect(): void {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isAuthenticated = false;
    this.messageHandlers.clear();
  }

  /**
   * Verifica si está conectado y autenticado
   */
  isConnected(): boolean {
    return this.ws !== null && 
           this.ws.readyState === WebSocket.OPEN && 
           this.isAuthenticated;
  }

  /**
   * Envía un ping para mantener la conexión viva
   */
  ping(): void {
    this.send({ type: 'ping' });
  }

  /**
   * Obtiene el estado de un usuario
   */
  getUserStatus(userId: string): string | undefined {
    return this.userStatus.get(userId);
  }

  /**
   * Cambia el estado del usuario actual
   */
  setStatus(status: 'online' | 'in-game' | 'away'): void {
    this.send({ type: 'set-status', status });
  }

  /**
   * Solicita la lista de usuarios online
   */
  getOnlineUsers(): void {
    this.send({ type: 'get-online-users' });
  }
}

// Exportar instancia singleton
export const wsService = new WebSocketService();
