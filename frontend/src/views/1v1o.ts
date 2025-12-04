import { navigate } from "../main.js";
import { wsService } from "../services/WebSocketService.js";

export function GameOneo(app: HTMLElement) {
  const selfId = localStorage.getItem("userId");
  if (!selfId) { alert("User not logged in"); navigate("/"); return; }

  app.innerHTML = `
    <div class="flex flex-col items-center w-full">
      <div class="text-center mb-4">
        <h1 class="text-poke-yellow text-2xl">POKéMON PONG</h1>
        <p class="text-poke-light text-xs">1v1 Online</p>
      </div>
      <div class="bg-black border-2 border-dashed border-poke-dark rounded-lg w-full max-w-[90vw] h-[28rem] flex flex-col items-center justify-center mb-6">
        <canvas id="pongCanvas" width="720" height="400"></canvas>
      </div>
      <div class="text-center">
        <button id="goBackBtn" class="bg-poke-red text-white py-2 px-6 rounded hover:bg-red-600">Go Back</button>
      </div>
    </div>
  `;

  const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  
  const paddleWidth = 10, paddleHeight = 80, ballRadius = 8;
  const playerSpeed = 6;
  const maxScore = 5;

  const player = { x: 0, y: canvas.height/2 - paddleHeight/2, score: 0 };
  const opponent = { x: 0, y: canvas.height/2 - paddleHeight/2, score: 0 };
  const ball = { x: canvas.width/2, y: canvas.height/2, vx: 0, vy: 0 };

  let up = false, down = false;
  let isHost = false;
  let gameRunning = false;
  let gameId: string;

  // ===== Dibujo =====
  const drawRect = (x:number,y:number,w:number,h:number,color:string)=>{ ctx.fillStyle=color; ctx.fillRect(x,y,w,h); };
  const drawCircle = (x:number,y:number,r:number,color:string)=>{ ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); };
  const drawText = (text:string,x:number,y:number,color:string,size=20)=>{ ctx.fillStyle=color; ctx.font=`${size}px monospace`; ctx.fillText(text,x,y); };

  // ===== Inicialización desde game-start =====
  const initFromGameStart = (msg:any) => {
    if(msg.type !== "game-start") return;

    gameId = msg.gameId;
    isHost = msg.player1 == selfId;

    player.x = isHost ? 10 : canvas.width - paddleWidth - 10;
    opponent.x = isHost ? canvas.width - paddleWidth - 10 : 10;
    player.y = opponent.y = canvas.height/2 - paddleHeight/2;

    player.score = 0;
    opponent.score = 0;

    ball.x = msg.ball.x;
    ball.y = msg.ball.y;
    ball.vx = msg.ball.vx;
    ball.vy = msg.ball.vy;

    gameRunning = true;
    requestAnimationFrame(gameLoop);
  };

  // ===== Recibir updates =====
  wsService.on("game-update", (msg:any) => {
    if(msg.gameId !== gameId) return;
    const data = msg.data;
    if(!data) return;

    // Posición del jugador remoto
    if(isHost && data.player2Y !== undefined) opponent.y = data.player2Y;
    else if(!isHost && data.player1Y !== undefined) opponent.y = data.player1Y;

    // Pelota y puntuación en cliente
    if(!isHost){
      if(data.ball){
        ball.x = data.ball.x;
        ball.y = data.ball.y;
        ball.vx = data.ball.vx;
        ball.vy = data.ball.vy;
      }
      if(data.score){
        player.score = isHost ? data.score.player1 : data.score.player2;
        opponent.score = isHost ? data.score.player2 : data.score.player1;
      }
    }
  });

  // ===== Controles =====
  document.addEventListener("keydown", e => {
    if(e.key === "ArrowUp" || e.key === "w") up = true;
    if(e.key === "ArrowDown" || e.key === "s") down = true;
  });
  document.addEventListener("keyup", e => {
    if(e.key === "ArrowUp" || e.key === "w") up = false;
    if(e.key === "ArrowDown" || e.key === "s") down = false;
  });

  // ===== Movimiento jugador y envío WS =====
  const updatePlayer = () => {
    if(up && player.y>0) player.y-=playerSpeed;
    if(down && player.y+paddleHeight<canvas.height) player.y+=playerSpeed;

    if(gameId && wsService.isConnected()){
      wsService.send({
        type: "game-action",
        gameId: gameId,
        action: "move",
        data: isHost ? { player1Y: player.y, ball, score: {player1: player.score, player2: opponent.score} } 
                     : { player2Y: player.y }
      });
    }
  };

  // ===== Loop del juego =====
  const gameLoop = () => {
    if(!gameRunning) return;

    updatePlayer();

    if(isHost){
      // Host mueve la pelota
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Rebote techo/suelo
      if(ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) ball.vy = -ball.vy;

      // Rebote palas
      if(ball.x - ballRadius < player.x + paddleWidth && ball.y>player.y && ball.y<player.y+paddleHeight){
        ball.vx = -ball.vx;
      }
      if(ball.x + ballRadius > opponent.x && ball.y>opponent.y && ball.y<opponent.y+paddleHeight){
        ball.vx = -ball.vx;
      }

      // Puntuación
      if(ball.x - ballRadius < 0){ opponent.score++; resetBall(); }
      if(ball.x + ballRadius > canvas.width){ player.score++; resetBall(); }

      // Fin de juego
      if(player.score >= maxScore || opponent.score >= maxScore){
        gameRunning = false;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawText(player.score >= maxScore ? "You Win! 🏆" : "You Lose! 💀", canvas.width/2-60, canvas.height/2, "yellow", 24);
        return;
      }
    }

    // ===== Dibujar =====
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawRect(player.x,player.y,paddleWidth,paddleHeight,"white");
    drawRect(opponent.x,opponent.y,paddleWidth,paddleHeight,"white");
    drawCircle(ball.x,ball.y,ballRadius,"white");
    drawText(`${player.score}`, canvas.width/4,25,"white");
    drawText(`${opponent.score}`, canvas.width*3/4,25,"white");

    requestAnimationFrame(gameLoop);
  };

  const resetBall = () => {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.vx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 3.5 * (Math.random() > 0.5 ? 1 : -1);
  };

  // ===== Go back =====
  document.getElementById("goBackBtn")?.addEventListener("click",()=>{
    gameRunning = false;
    navigate("/game");
  });

  // ===== Inicializa inmediatamente =====
  if(wsService.lastGameStart) initFromGameStart(wsService.lastGameStart);
  else wsService.on("game-start", initFromGameStart);
}
