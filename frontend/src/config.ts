// Configuration for API and WebSocket endpoints
// Uses relative paths to work behind Nginx reverse proxy

// Get protocol from window location (https:// or http://)
const protocol = window.location.protocol;
const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';

// API base URL - uses Nginx proxy path /api/
export const API_BASE_URL = `${window.location.origin}/api`;

// WebSocket base URL - uses Nginx proxy path /ws/
export const WS_BASE_URL = `${wsProtocol}//${window.location.host}/ws/`;

// Development flag
export const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Console log URLs in development
if (IS_DEV) {
  console.log('🔧 Configuration:');
  console.log('  API_BASE_URL:', API_BASE_URL);
  console.log('  WS_BASE_URL:', WS_BASE_URL);
}
