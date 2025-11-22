/**
 * API Configuration
 * Centraliza todas las URLs de la API para facilitar cambios de entorno
 */

// Determinar la URL base según el entorno
const getApiBaseUrl = (): string => {
  // Si estamos en desarrollo local (puerto 3000), usar nginx
  // Si estamos en producción (a través de nginx), usar rutas relativas
  
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  const currentProtocol = window.location.protocol;
  
  // Si accedemos a través de nginx (puerto 9443 o sin puerto específico)
  if (currentPort === '9443' || currentPort === '' || currentPort === '443') {
    // Usar rutas relativas que nginx proxeará al backend
    return `${currentProtocol}//${currentHost}${currentPort ? ':' + currentPort : ''}`;
  }
  
  // Si estamos en desarrollo directo (puerto 3000), apuntar a nginx
  if (currentPort === '3000' || currentPort === '9280') {
    return 'https://localhost:9443';
  }
  
  // Por defecto, usar rutas relativas
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: `${API_BASE_URL}/api/login.php`,
  LOGOUT: `${API_BASE_URL}/api/logout.php`,
  VERIFY_2FA: `${API_BASE_URL}/api/verify_2fa.php`,
  
  // Usuarios
  USERS: `${API_BASE_URL}/api/users.php`,
  USER_INFO: `${API_BASE_URL}/api/users.php`,
  
  // Avatares y uploads
  UPLOAD: `${API_BASE_URL}/api/upload.php`,
  AVATAR_PHOTO: `${API_BASE_URL}/api/avatar_photo.php`,
  
  // Amigos
  FRIENDS: `${API_BASE_URL}/api/friends.php`,
  FRIEND_REQUEST: `${API_BASE_URL}/api/friend_request.php`,
  GET_USER_ID: `${API_BASE_URL}/api/get_user_id.php`,
  
  // Partidas y estadísticas
  MATCHES: `${API_BASE_URL}/api/matches.php`,
  LADDER: `${API_BASE_URL}/api/ladder.php`,
  
  // Otros
  DELETE_ALL: `${API_BASE_URL}/api/delete_all.php`,
  HEALTH: `${API_BASE_URL}/api/health.php`,
};

// Helper para hacer fetch con configuración predeterminada
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Incluir cookies para sesiones
    ...options,
  };
  
  return fetch(url, defaultOptions);
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  apiFetch,
};
