[33mcommit 954aae91966d8a2a0739d2f7e71f7e88b80fc805[m[33m ([m[1;36mHEAD -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Merge: 40a21fd6 9011beee
Author: Vera Garcia Diez <veragarc@c3r8s6.42urduliz.com>
Date:   Thu Dec 11 00:07:12 2025 +0100

    aa

[33mcommit 40a21fd680006f9902b65833cad1128c35223d94[m
Author: Vera Garcia Diez <veragarc@c3r8s6.42urduliz.com>
Date:   Thu Dec 11 00:03:43 2025 +0100

    Descripción de mis cambios locales en el torneo

[33mcommit 9011beeefa4c5cd30eceb53e3196190624a5d99d[m
Author: Otmane Boumehdi <otboumeh@c3r8s4.42urduliz.com>
Date:   Wed Dec 10 23:59:51 2025 +0100

    T8

[33mcommit 14aa0605ac29ac5b0cdde3ab2fe2e4b2721eddf6[m
Author: David Felipe Bonilla Ladino <dbonilla@c3r8s2.42urduliz.com>
Date:   Wed Dec 10 23:34:21 2025 +0100

    feat: Frontend hot reload workflow with sync command
    
    - Add 'make frontend-sync' command for one-step compilation and reload
    - Add source code volume mount to docker-compose for live sync
    - Create sync-frontend.sh script for TypeScript and CSS compilation
    - Add minimal documentation for frontend development workflow
    
    This enables developers to edit frontend code and see changes with just:
      make frontend-sync
      Ctrl+Shift+R (in browser)

[33mcommit 3b409f7836fa04aba2d8ec7e419935759b51e852[m
Author: root <root@PC.localdomain>
Date:   Wed Dec 10 00:12:27 2025 +0100

    juego++ 1am estupefacientes

[33mcommit da2212941566c41fb520eaa3e01eecbc1fad08df[m
Author: root <root@PC.localdomain>
Date:   Tue Dec 9 17:38:25 2025 +0100

    + backend limpito

[33mcommit 44ce005d1be750102e7f040e9158be1194bcaea1[m
Author: root <root@PC.localdomain>
Date:   Tue Dec 9 14:31:46 2025 +0100

    lesto

[33mcommit 509778f2ff88465b905599926d291882bcfefc68[m
Author: root <root@PC.localdomain>
Date:   Tue Dec 9 14:18:30 2025 +0100

    juego no peta, actualiza mh y stats, pero creo que doble

[33mcommit f6d5dc19656a7aa7fff50ac53fd85834bb03c8ee[m
Author: root <root@PC.localdomain>
Date:   Tue Dec 9 13:10:20 2025 +0100

    juego sin que se cuelgue

[33mcommit 4b9ac14bee54c37dc24d5660684b2b9b7eb074cd[m
Merge: 61f89040 697289d1
Author: PIPEFD <gamedav68@gmail.com>
Date:   Sun Dec 7 22:18:06 2025 +0100

    Merge branch 'test_web_socket' into main
    
    Integrates WebSocket functionality with full authentication and testing:
    
    Features:
    - WebSocket authentication with JWT tokens
    - User online status tracking and persistence
    - Session management with Redis
    - Automated WebSocket verification scripts
    - Complete integration test suite
    
    Tests: 8 passed, 3 skipped (optional monitoring)
    Verification: All core functionality validated

[33mcommit 697289d1ac6987de5c6313ae000444f03e99155e[m
Author: PIPEFD <gamedav68@gmail.com>
Date:   Sun Dec 7 22:17:43 2025 +0100

    test: Fix integration tests for SSL and localhost
    
    - Add SSL verification bypass for self-signed certificates
    - Update test endpoints to use localhost ports
    - Configure proper WebSocket SSL options
    - Update monitoring tests to skip optional exporters gracefully
    - Fix Grafana port (3001) and cadvisor port (8081)
    
    Test results: 8 passed, 3 skipped (optional monitoring)

[33mcommit 3fb8a9ce72ad1d90283c31a63a82298ba441cef2[m
Author: PIPEFD <gamedav68@gmail.com>
Date:   Sat Dec 6 12:39:19 2025 +0100

    feat(scripts): Add WebSocket verification and testing scripts
    
    - monitor-ws.sh: Real-time WebSocket log monitoring
    - test-ws-complete.sh: Complete WebSocket test with authentication
    - test-wscat.sh: WebSocket testing with wscat (WS/WSS)
    - verify-websocket.sh: WebSocket endpoint verification
    - verify-ws-complete.sh: Comprehensive WebSocket diagnostics
    - ws-status.sh: WebSocket endpoints status summary
    - wscat-interactive.sh: Interactive WebSocket connection tool
    
    These scripts facilitate testing and debugging of WebSocket connections
    for both internal (ws://game-ws:8080) and external (wss://localhost:9443/ws/)
    endpoints, including authentication, ping/pong, and real-time monitoring.

[33mcommit 068fb4092f2ce5e563fb51b97d3d048efcd7ffd7[m[33m ([m[1;31morigin/test_web_socket[m[33m)[m
Author: root <root@PC.localdomain>
Date:   Thu Dec 4 15:44:24 2025 +0100

    juegazo

[33mcommit 8ca9b56db8ad4e2273be3e0bfc35dd8f7a324bec[m
Author: root <root@PC.localdomain>
Date:   Thu Dec 4 13:55:32 2025 +0100

    pseudo juego en beta

[33mcommit 1b7667131b5f5813f56d8c6970dbadef522eff92[m
Author: root <root@PC.localdomain>
Date:   Wed Dec 3 13:46:43 2025 +0100

    chat worrrking

[33mcommit 0313766f0330ed8980941f55971d2d733ac15feb[m
Author: PIPEFD <gamedav68@gmail.com>
Date:   Tue Dec 2 21:06:12 2025 +0100

    feat: Complete WebSocket integration with user status, chat, and session persistence
    
    Backend API Changes:
    - avatar_photo.php: Changed from POST to GET method, accepts user_id query parameter
    - chat.php: Created new endpoint for chat history (returns empty array, messages in WebSocket memory)
    - friends.php: Added support for action=list parameter, extracts user_id from JWT
    - header.php: Read JWT secret from config/secrets/jwt.key file instead of hardcoded
    - login.php: Read JWT secret from config/secrets/jwt.key file for token validation
    - health.php: Changed status response to 'healthy' for consistency
    
    Game WebSocket Server:
    - auth.php: Decode JWT token to extract user_id, validate against secret from file
    - auth.php: Set user status to 'online' on connection, broadcast status change
    - chat.php: Accept both userId/receiverId (frontend) and sender_id/receiver_id formats
    - chat.php: Send message confirmation and route to connected receiver
    - webSocket.php: Broadcast 'offline' status when user disconnects
    
    Frontend TypeScript:
    - WebSocketService.ts: Add userStatus Map to track online/offline/in-game states
    - WebSocketService.ts: Implement getUserStatus(), setStatus(), getOnlineUsers() methods
    - WebSocketService.ts: Handle 'user-status-changed' and 'online-users' events
    - WebSocketService.ts: Convert userId to string for Map consistency
    - WebSocketService.ts: Add comprehensive logging and reconnection logic
    - main.ts: Check tokenUser/userId instead of state.player.alias for session persistence
    - main.ts: Auto-connect WebSocket after login and on page load if authenticated
    - main.ts: Redirect to /login instead of /register when no session
    - Header.ts: Changed avatar fetch to GET method with user_id query parameter
    - Login.ts: Connect WebSocket automatically after successful login
    - index.html: Update cache-busting version to 20251202-001
    
    Docker & Infrastructure:
    - docker-compose.yml: Change game-ws healthcheck from wget to PHP fsockopen
    - docker-compose.yml: Add JWTsecretKey environment variable to game-ws from JWT_SECRET
    - docker-compose.yml: Share jwt_secret file as Docker secret
    
    Scripts:
    - create-test-users.sh: Use absolute paths for avatar files (SCRIPT_DIR/PROJECT_ROOT)
    - test-ws.html: Update WebSocket test page with new message format
    
    Database:
    - Removed database.sqlite (will be recreated on container restart)
    
    This commit enables:
    ✅ Real-time user status updates (online/offline/in-game)
    ✅ WebSocket authentication with JWT validation
    ✅ Chat message routing between connected users
    ✅ Session persistence on page reload
    ✅ Automatic WebSocket connection after login
    ✅ Consistent avatar loading with GET requests
    ✅ Test users with working avatars and friend requests

[33mcommit e88cb878e19414cdede7535e2e3fd0d54d351c31[m
Author: PIPEFD <gamedav68@gmail.com>
Date:   Tue Dec 2 17:29:14 2025 +0100

    rama de prueba parsa el ws

[33mcommit 61f8904099cda4887960fc82ff92ddf5b02cbd0d[m
Author: PIPEFD <gamedav68@gmail.com>
Date:   Fri Nov 28 01:18:24 2025 +0100

    fix: Correct avatar endpoint and URL construction for multi-user access
    
    Backend fixes:
    - Fix avatar_photo.php to use 'avatar_url' column instead of 'av