"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameVsAI = GameVsAI;
var main_js_1 = require("../main.js");
function GameVsAI(app, state) {
    app.innerHTML = "\n    <div class=\"flex flex-col items-center w-full\">\n      <div class=\"text-center mb-4\">\n          <h1 class=\"text-poke-yellow text-2xl\">POK\u00E9MON</h1>\n          <p class=\"text-poke-light text-xs\">Play vs AI</p>\n      </div>\n\n      <div id=\"gameCanvasContainer\"\n        class=\"bg-black border-2 border-dashed border-poke-dark rounded-lg w-full max-w-[90vw] h-[28rem] flex flex-col items-center justify-center mb-6\">\n        <canvas id=\"pongCanvas\" width=\"720\" height=\"400\" class=\"bg-black\"></canvas>\n        <div class=\"mt-3 flex gap-2\">\n          <button id=\"restartBtn\" class=\"bg-poke-red text-white py-1 px-3 rounded hover:bg-red-600 hidden\">Restart</button>\n        </div>\n      </div>\n\n      <div class=\"text-center\">\n        <button id=\"goBackBtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 px-6 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 hover:border-b-red-800 active:animate-press active:border-b-red-800\">\n            Go Back\n        </button>\n      </div>\n    </div>\n  ";
    var canvasEl = document.getElementById("pongCanvas");
    var ctx = canvasEl.getContext("2d");
    if (!ctx)
        return;
    // ===== Game variables =====
    var paddleWidth = 10, paddleHeight = 80, ballRadius = 8;
    var playerSpeed = 6, aiSpeed = 4, maxScore = 3, speedIncrement = 1.05;
    var wPressed = false, sPressed = false;
    var gameRunning = false, gameOver = false;
    var player1 = { x: 10, y: canvasEl.height / 2 - paddleHeight / 2, score: 0 };
    var player2 = { x: canvasEl.width - paddleWidth - 10, y: canvasEl.height / 2 - paddleHeight / 2, score: 0 };
    var ball = { x: canvasEl.width / 2, y: canvasEl.height / 2, dx: 3.5 * (Math.random() > 0.5 ? 1 : -1), dy: 3.5 * (Math.random() > 0.5 ? 1 : -1) };
    // ===== Drawing helpers =====
    var drawRect = function (x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
    var drawCircle = function (x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.closePath(); ctx.fill(); };
    var drawText = function (text, x, y, color, size) {
        if (size === void 0) { size = 20; }
        ctx.fillStyle = color;
        ctx.font = "".concat(size, "px monospace");
        ctx.fillText(text, x, y);
    };
    // ===== Move Players =====
    function movePlayers() {
        // Player 1 controls
        if (wPressed && player1.y > 0)
            player1.y -= playerSpeed;
        if (sPressed && player1.y + paddleHeight < canvasEl.height)
            player1.y += playerSpeed;
        // AI movement for player 2
        var target = ball.y - paddleHeight / 2 + ballRadius;
        if (player2.y + paddleHeight / 2 < target)
            player2.y += aiSpeed;
        else if (player2.y + paddleHeight / 2 > target)
            player2.y -= aiSpeed;
        // Prevent AI from going out of bounds
        if (player2.y < 0)
            player2.y = 0;
        if (player2.y + paddleHeight > canvasEl.height)
            player2.y = canvasEl.height - paddleHeight;
    }
    // ===== Ball reset =====
    function resetBall() {
        ball.x = canvasEl.width / 2;
        ball.y = canvasEl.height / 2;
        ball.dx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = 3.5 * (Math.random() > 0.5 ? 1 : -1);
    }
    // ===== Check Winner =====
    function checkWinner() {
        if (player1.score >= maxScore)
            endGame("Player wins! 🏆");
        else if (player2.score >= maxScore)
            endGame("AI wins 😢");
    }
    function endGame(msg) {
        gameRunning = false;
        gameOver = true;
        drawText(msg, canvasEl.width / 2 - 80, canvasEl.height / 2, "yellow", 24);
        restartBtn.classList.remove("hidden");
    }
    // ===== Update =====
    function update() {
        if (!gameRunning || gameOver)
            return;
        movePlayers();
        ball.x += ball.dx;
        ball.y += ball.dy;
        // Bounce top/bottom walls
        if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvasEl.height)
            ball.dy = -ball.dy;
        // Paddle collisions
        if (ball.x - ballRadius < player1.x + paddleWidth && ball.y > player1.y && ball.y < player1.y + paddleHeight) {
            ball.dx = -ball.dx * speedIncrement;
            ball.dy *= speedIncrement;
            ball.x = player1.x + paddleWidth + ballRadius;
        }
        if (ball.x + ballRadius > player2.x && ball.y > player2.y && ball.y < player2.y + paddleHeight) {
            ball.dx = -ball.dx * speedIncrement;
            ball.dy *= speedIncrement;
            ball.x = player2.x - ballRadius;
        }
        // Scoring
        if (ball.x - ballRadius < 0) {
            player2.score++;
            resetBall();
            checkWinner();
        }
        if (ball.x + ballRadius > canvasEl.width) {
            player1.score++;
            resetBall();
            checkWinner();
        }
    }
    // ===== Draw =====
    function draw() {
        drawRect(0, 0, canvasEl.width, canvasEl.height, "black");
        drawRect(player1.x, player1.y, paddleWidth, paddleHeight, "white");
        drawRect(player2.x, player2.y, paddleWidth, paddleHeight, "white");
        drawCircle(ball.x, ball.y, ballRadius, "white");
        drawText("".concat(player1.score), canvasEl.width / 4, 25, "white");
        drawText("".concat(player2.score), canvasEl.width * 3 / 4, 25, "white");
    }
    // ===== Game Loop =====
    function gameLoop() {
        draw();
        update();
        if (gameRunning)
            requestAnimationFrame(gameLoop);
    }
    // ===== Controls =====
    document.addEventListener("keydown", function (e) {
        if (e.key.toLowerCase() === "w")
            wPressed = true;
        if (e.key.toLowerCase() === "s")
            sPressed = true;
    });
    document.addEventListener("keyup", function (e) {
        if (e.key.toLowerCase() === "w")
            wPressed = false;
        if (e.key.toLowerCase() === "s")
            sPressed = false;
    });
    // ===== Buttons =====
    var restartBtn = document.getElementById("restartBtn");
    var goBackBtn = document.getElementById("goBackBtn");
    restartBtn.addEventListener("click", function () {
        player1.score = 0;
        player2.score = 0;
        gameOver = false;
        gameRunning = true;
        restartBtn.classList.add("hidden");
        resetBall();
        gameLoop();
    });
    goBackBtn.addEventListener("click", function () {
        player1.score = 0;
        player2.score = 0;
        gameOver = false;
        gameRunning = false;
        restartBtn.classList.add("hidden");
        resetBall();
        draw();
        (0, main_js_1.navigate)("/game");
    });
    // Start the game
    gameRunning = true;
    gameLoop();
}
