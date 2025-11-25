#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}Enviando solicitudes de amistad entre test users${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

login_user() {
    local username=$1
    local password=$2
    
    local response=$(curl -k -s -X POST "https://localhost:9443/api/login.php" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$username\",\"pass\":\"$password\"}")
    
    echo "$response"
}

send_friend_request() {
    local token=$1
    local sender_id=$2
    local receiver_id=$3
    local receiver_name=$4
    
    echo -ne "  ${YELLOW}→${NC} $receiver_name:   Enviando solicitud...\r"
    
    local response=$(curl -k -s -X POST "https://localhost:9443/api/friend_request.php" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{\"sender_id\": $sender_id, \"receiver_id\": $receiver_id}")
    
    if echo "$response" | grep -q "friend request sent"; then
        echo -e "  ${GREEN}✅${NC} $receiver_name: ${GREEN}Solicitud enviada${NC}              "
    else
        echo -e "  ${RED}❌${NC} $receiver_name: ${RED}$response${NC}"
    fi
}

# Login todos los usuarios
echo -e "${BLUE}[1/4] Login como testuser1...${NC}"
LOGIN1=$(login_user "testuser1" "Test123!")
TOKEN1=$(echo $LOGIN1 | python3 -c "import sys, json; print(json.load(sys.stdin)['details'])" 2>/dev/null)
USER1_ID=$(echo $LOGIN1 | python3 -c "import sys, json; print(json.load(sys.stdin)['user_id'])" 2>/dev/null)
[ -z "$TOKEN1" ] && echo -e "${RED}❌ Error testuser1${NC}" && exit 1
echo -e "${GREEN}✅ testuser1 logueado (ID: $USER1_ID)${NC}"

echo -e "${BLUE}[2/4] Login como testuser2...${NC}"
LOGIN2=$(login_user "testuser2" "Test123!")
TOKEN2=$(echo $LOGIN2 | python3 -c "import sys, json; print(json.load(sys.stdin)['details'])" 2>/dev/null)
USER2_ID=$(echo $LOGIN2 | python3 -c "import sys, json; print(json.load(sys.stdin)['user_id'])" 2>/dev/null)
[ -z "$TOKEN2" ] && echo -e "${RED}❌ Error testuser2${NC}" && exit 1
echo -e "${GREEN}✅ testuser2 logueado (ID: $USER2_ID)${NC}"

echo -e "${BLUE}[3/4] Login como testuser3...${NC}"
LOGIN3=$(login_user "testuser3" "Test123!")
TOKEN3=$(echo $LOGIN3 | python3 -c "import sys, json; print(json.load(sys.stdin)['details'])" 2>/dev/null)
USER3_ID=$(echo $LOGIN3 | python3 -c "import sys, json; print(json.load(sys.stdin)['user_id'])" 2>/dev/null)
[ -z "$TOKEN3" ] && echo -e "${RED}❌ Error testuser3${NC}" && exit 1
echo -e "${GREEN}✅ testuser3 logueado (ID: $USER3_ID)${NC}"

echo -e "${BLUE}[4/4] Login como testuser4...${NC}"
LOGIN4=$(login_user "testuser4" "Test123!")
TOKEN4=$(echo $LOGIN4 | python3 -c "import sys, json; print(json.load(sys.stdin)['details'])" 2>/dev/null)
USER4_ID=$(echo $LOGIN4 | python3 -c "import sys, json; print(json.load(sys.stdin)['user_id'])" 2>/dev/null)
[ -z "$TOKEN4" ] && echo -e "${RED}❌ Error testuser4${NC}" && exit 1
echo -e "${GREEN}✅ testuser4 logueado (ID: $USER4_ID)${NC}"

echo ""
echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}Enviando solicitudes de amistad...${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

echo -e "${YELLOW}testuser1 → enviando solicitudes:${NC}"
send_friend_request "$TOKEN1" "$USER1_ID" "$USER2_ID" "testuser2"
send_friend_request "$TOKEN1" "$USER1_ID" "$USER3_ID" "testuser3"
send_friend_request "$TOKEN1" "$USER1_ID" "$USER4_ID" "testuser4"
echo ""

echo -e "${YELLOW}testuser2 → enviando solicitudes:${NC}"
send_friend_request "$TOKEN2" "$USER2_ID" "$USER1_ID" "testuser1"
send_friend_request "$TOKEN2" "$USER2_ID" "$USER3_ID" "testuser3"
send_friend_request "$TOKEN2" "$USER2_ID" "$USER4_ID" "testuser4"
echo ""

echo -e "${YELLOW}testuser3 → enviando solicitudes:${NC}"
send_friend_request "$TOKEN3" "$USER3_ID" "$USER1_ID" "testuser1"
send_friend_request "$TOKEN3" "$USER3_ID" "$USER2_ID" "testuser2"
send_friend_request "$TOKEN3" "$USER3_ID" "$USER4_ID" "testuser4"
echo ""

echo -e "${YELLOW}testuser4 → enviando solicitudes:${NC}"
send_friend_request "$TOKEN4" "$USER4_ID" "$USER1_ID" "testuser1"
send_friend_request "$TOKEN4" "$USER4_ID" "$USER2_ID" "testuser2"
send_friend_request "$TOKEN4" "$USER4_ID" "$USER3_ID" "testuser3"
echo ""

echo -e "${BLUE}==================================================${NC}"
echo -e "${GREEN}✅ Solicitudes enviadas${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""
echo "Nota: Aceptar solicitudes en Friends → Requests"
