import { navigate } from "../main.js";

export function GameView(app: HTMLElement, state: any): void {
  app.innerHTML = `
    <div class="flex flex-col items-center w-full">
      <div class="text-center mb-4">
          <h1 class="text-poke-yellow text-2xl">POKéMON</h1>
          <p class="text-poke-light text-xs">PONG</p>
      </div>

      <div id="gameCanvasContainer"
        class="bg-black border-2 border-dashed border-poke-dark rounded-lg w-full max-w-[90vw] h-[28rem] flex flex-col items-center justify-center mb-6">
        <canvas id="pongCanvas" width="720" height="400" class="bg-black"></canvas>
        <div class="mt-3 flex gap-2">
          <button id="startAI" class="bg-poke-red text-white py-1 px-3 rounded hover:bg-red-600">Play vs AI </button>
          <button id="start1v1" class="bg-poke-red text-white py-1 px-3 rounded hover:bg-red-600">1v1 Local </button>
          <button id="restartBtn" class="bg-poke-red text-white py-1 px-3 rounded hover:bg-red-600 hidden">Restart</button>
        </div>
      </div>

      <div class="text-center">
        <button id="goBackBtn" class="bg-poke-red bg-opacity-80 text-poke-light py-2 px-6 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 hover:border-b-red-800 active:animate-press active:border-b-red-800">
            Go Back
        </button>
      </div>
    </div>
  `;

  document.getElementById("goBackBtn")?.addEventListener("click", () => navigate("/"));

  // ===== Canvas setup =====
  const canvasEl = document.getElementById("pongCanvas") as HTMLCanvasElement;
  const ctx = canvasEl.getContext("2d");
  if (!ctx) return;

  // ===== Game variables =====
  const paddleWidth = 10, paddleHeight = 80, ballRadius = 8;
  const playerSpeed = 6, aiSpeed = 4;
  const maxScore = 3, speedIncrement = 1.05;

  let wPressed = false, sPressed = false, upPressed = false, downPressed = false;
  let gameRunning = false, gameOver = false, vsAI = true;

  const player1 = { x: 10, y: canvasEl.height / 2 - paddleHeight / 2, score: 0 };
  const player2 = { x: canvasEl.width - paddleWidth - 10, y: canvasEl.height / 2 - paddleHeight / 2, score: 0 };
  const ball = { x: canvasEl.width/2, y: canvasEl.height/2, dx: 3.5 * (Math.random()>0.5?1:-1), dy: 3.5 * (Math.random()>0.5?1:-1) };

  // ===== Drawing helpers =====
  const drawRect = (x:number,y:number,w:number,h:number,color:string) => { ctx.fillStyle=color; ctx.fillRect(x,y,w,h); };
  const drawCircle = (x:number,y:number,r:number,color:string) => { ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.closePath(); ctx.fill(); };
  const drawText = (text:string,x:number,y:number,color:string,size=20) => { ctx.fillStyle=color; ctx.font=`${size}px monospace`; ctx.fillText(text,x,y); };

  // ===== Game logic =====
  const movePlayers = () => {
    if(wPressed && player1.y>0) player1.y-=playerSpeed;
    if(sPressed && player1.y+paddleHeight<canvasEl.height) player1.y+=playerSpeed;

    if(vsAI) {
      const target = ball.y - paddleHeight/2 + ballRadius;
      player2.y += (player2.y < target ? aiSpeed : player2.y > target ? -aiSpeed : 0);
    } else {
      if(upPressed && player2.y>0) player2.y-=playerSpeed;
      if(downPressed && player2.y+paddleHeight<canvasEl.height) player2.y+=playerSpeed;
    }
  };

  const resetBall = () => { 
    ball.x=canvasEl.width/2; 
    ball.y=canvasEl.height/2; 
    ball.dx=3.5*(Math.random()>0.5?1:-1);
    ball.dy=3.5*(Math.random()>0.5?1:-1);
  };

  const checkWinner = () => {
    if(player1.score>=maxScore) endGame("Player 1 wins! 🏆");
    else if(player2.score>=maxScore) endGame(vsAI?"AI wins 😢":"Player 2 wins! 🏆");
  };

  const endGame = (msg:string) => {
    gameRunning=false; gameOver=true;
    drawText(msg, canvasEl.width/2 - 80, canvasEl.height/2, "yellow",24);
    document.getElementById("restartBtn")?.classList.remove("hidden");
  };

  const update = () => {
    if(!gameRunning || gameOver) return;
    movePlayers();
    ball.x += ball.dx; ball.y += ball.dy;

    if(ball.y+ballRadius>canvasEl.height || ball.y-ballRadius<0) ball.dy=-ball.dy;

    // paddle collisions
    if(ball.x-ballRadius<player1.x+paddleWidth && ball.y>player1.y && ball.y<player1.y+paddleHeight) { 
      ball.dx=-ball.dx*speedIncrement; ball.dy*=speedIncrement; ball.x=player1.x+paddleWidth+ballRadius;
    }
    if(ball.x+ballRadius>player2.x && ball.y>player2.y && ball.y<player2.y+paddleHeight) {
      ball.dx=-ball.dx*speedIncrement; ball.dy*=speedIncrement; ball.x=player2.x-ballRadius;
    }

    // scoring
    if(ball.x-ballRadius<0){ player2.score++; resetBall(); checkWinner(); }
    else if(ball.x+ballRadius>canvasEl.width){ player1.score++; resetBall(); checkWinner(); }
  };

  const draw = () => {
    drawRect(0,0,canvasEl.width,canvasEl.height,"black");
    drawRect(player1.x,player1.y,paddleWidth,paddleHeight,"white");
    drawRect(player2.x,player2.y,paddleWidth,paddleHeight,"white");
    drawCircle(ball.x,ball.y,ballRadius,"white");
    drawText(`${player1.score}`, canvasEl.width/4,25,"white");
    drawText(`${player2.score}`, canvasEl.width*3/4,25,"white");
  };

  const gameLoop = () => { draw(); update(); if(!gameOver) requestAnimationFrame(gameLoop); };

  // ===== Controls =====
  document.addEventListener("keydown",e=>{ if(e.key.toLowerCase()==="w") wPressed=true; if(e.key.toLowerCase()==="s") sPressed=true; if(e.key==="ArrowUp") upPressed=true; if(e.key==="ArrowDown") downPressed=true; });
  document.addEventListener("keyup",e=>{ if(e.key.toLowerCase()==="w") wPressed=false; if(e.key.toLowerCase()==="s") sPressed=false; if(e.key==="ArrowUp") upPressed=false; if(e.key==="ArrowDown") downPressed=false; });

  // ===== Buttons =====
  const startAI = document.getElementById("startAI");
  const start1v1 = document.getElementById("start1v1");
  const restartBtn = document.getElementById("restartBtn");

  startAI?.addEventListener("click",()=>startGame(true));
  start1v1?.addEventListener("click",()=>startGame(false));
  restartBtn?.addEventListener("click",()=>{
    player1.score=0; player2.score=0; gameOver=false; gameRunning=false;
    restartBtn.classList.add("hidden");
    startAI?.classList.remove("hidden");
    start1v1?.classList.remove("hidden");
  });

  function startGame(vsAIChoice:boolean){
    vsAI=vsAIChoice;
    player1.score=0; player2.score=0; gameOver=false; gameRunning=true;
    startAI?.classList.add("hidden"); start1v1?.classList.add("hidden"); restartBtn?.classList.add("hidden");
    resetBall(); gameLoop();
  }
}
