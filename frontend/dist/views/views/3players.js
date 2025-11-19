"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameThree = GameThree;
var main_js_1 = require("../main.js");
function GameThree(app, state) {
    app.innerHTML = "\n    <div class=\"flex flex-col items-center w-full\">\n      <div class=\"text-center mb-4\">\n          <h1 class=\"text-poke-yellow text-2xl\">POK\u00E9MON</h1>\n          <p class=\"text-poke-light text-xs\">3 Player Mode</p>\n      </div>\n\n      <div id=\"gameCanvasContainer\"\n        class=\"bg-black border-2 border-dashed border-poke-dark rounded-lg w-full max-w-[90vw] h-[28rem] flex flex-col items-center justify-center mb-6\">\n        <canvas id=\"pongCanvas\" width=\"720\" height=\"400\" class=\"bg-black\"></canvas>\n        <div class=\"mt-3 flex gap-2\">\n          <button id=\"restartBtn\" class=\"bg-poke-red text-white py-1 px-3 rounded hover:bg-red-600 hidden\">Restart</button>\n        </div>\n      </div>\n\n      <div class=\"text-center\">\n        <button id=\"goBackBtn\" class=\"bg-poke-red bg-opacity-80 text-poke-light py-2 px-6 border-3 border-poke-red border-b-red-800 rounded hover:bg-gradient-to-b hover:from-red-500 hover:to-red-600 hover:border-b-red-800 active:animate-press active:border-b-red-800\">\n            Go Back\n        </button>\n      </div>\n    </div>\n  ";
    var canvasEl = document.getElementById("pongCanvas");
    var ctx = canvasEl.getContext("2d");
    if (!ctx)
        return;
    // ===== Game variables =====
    var paddleWidth = 10, paddleHeight = 80, ballRadius = 8;
    var playerSpeed = 6, maxScore = 3, speedIncrement = 1.05;
    var wPressed = false, sPressed = false, upPressed = false, downPressed = false, tPressed = false, yPressed = false;
    var gameRunning = false, gameOver = false;
    var player1 = { x: 10, y: canvasEl.height / 2 - paddleHeight / 2, score: 0, active: true }; // left
    var player2 = { x: canvasEl.width - paddleWidth - 10, y: canvasEl.height / 2 - paddleHeight / 2, score: 0, active: true }; // right
    var player3 = { x: canvasEl.width / 2 - paddleHeight / 2, y: 10, score: 0, active: true }; // top
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
        if (player1.active) {
            if (wPressed && player1.y > 0)
                player1.y -= playerSpeed;
            if (sPressed && player1.y + paddleHeight < canvasEl.height)
                player1.y += playerSpeed;
        }
        if (player2.active) {
            if (upPressed && player2.y > 0)
                player2.y -= playerSpeed;
            if (downPressed && player2.y + paddleHeight < canvasEl.height)
                player2.y += playerSpeed;
        }
        if (player3.active) {
            if (tPressed && player3.x > 0)
                player3.x -= playerSpeed;
            if (yPressed && player3.x + paddleHeight < canvasEl.width)
                player3.x += playerSpeed;
        }
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
        var activePlayers = [player1, player2, player3].filter(function (p) { return p.active; });
        if (activePlayers.length <= 1) {
            var winner = activePlayers[0];
            endGame(winner ? "Winner! 🏆" : "Draw!");
        }
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
        // Bounce walls for eliminated players
        if (ball.x - ballRadius < 0 && !player1.active)
            ball.dx = Math.abs(ball.dx);
        if (ball.x + ballRadius > canvasEl.width && !player2.active)
            ball.dx = -Math.abs(ball.dx);
        if (ball.y - ballRadius < 0 && !player3.active)
            ball.dy = Math.abs(ball.dy);
        if (ball.y + ballRadius > canvasEl.height)
            ball.dy = -Math.abs(ball.dy);
        // Paddle collisions
        if (player1.active && ball.x - ballRadius < player1.x + paddleWidth && ball.y > player1.y && ball.y < player1.y + paddleHeight) {
            ball.dx = -ball.dx * speedIncrement;
            ball.dy *= speedIncrement;
            ball.x = player1.x + paddleWidth + ballRadius;
        }
        if (player2.active && ball.x + ballRadius > player2.x && ball.y > player2.y && ball.y < player2.y + paddleHeight) {
            ball.dx = -ball.dx * speedIncrement;
            ball.dy *= speedIncrement;
            ball.x = player2.x - ballRadius;
        }
        if (player3.active && ball.y - ballRadius < player3.y + paddleHeight && ball.x > player3.x && ball.x < player3.x + paddleHeight) {
            ball.dy = -ball.dy * speedIncrement;
            ball.dx *= speedIncrement;
            ball.y = player3.y + ballRadius + paddleHeight;
        }
        // Scoring and elimination at 3 goals
        if (ball.x - ballRadius < 0 && player1.active) {
            player1.score++;
            if (player1.score >= 3)
                player1.active = false;
            resetBall();
            checkWinner();
        }
        if (ball.x + ballRadius > canvasEl.width && player2.active) {
            player2.score++;
            if (player2.score >= 3)
                player2.active = false;
            resetBall();
            checkWinner();
        }
        if (ball.y - ballRadius < 0 && player3.active) {
            player3.score++;
            if (player3.score >= 3)
                player3.active = false;
            resetBall();
            checkWinner();
        }
    }
    // ===== Draw =====
    function draw() {
        drawRect(0, 0, canvasEl.width, canvasEl.height, "black");
        if (player1.active)
            drawRect(player1.x, player1.y, paddleWidth, paddleHeight, "white");
        if (player2.active)
            drawRect(player2.x, player2.y, paddleWidth, paddleHeight, "white");
        if (player3.active)
            drawRect(player3.x, player3.y, paddleHeight, paddleWidth, "white");
        drawCircle(ball.x, ball.y, ballRadius, "white");
        // Draw scores
        drawText("".concat(player1.score), 20, canvasEl.height - 20, "white");
        drawText("".concat(player2.score), canvasEl.width - 40, canvasEl.height - 20, "white");
        drawText("".concat(player3.score), canvasEl.width / 2 - 10, 40, "white");
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
        if (e.key.toLowerCase() === "arrowup")
            upPressed = true;
        if (e.key.toLowerCase() === "arrowdown")
            downPressed = true;
        if (e.key.toLowerCase() === "t")
            tPressed = true;
        if (e.key.toLowerCase() === "y")
            yPressed = true;
    });
    document.addEventListener("keyup", function (e) {
        if (e.key.toLowerCase() === "w")
            wPressed = false;
        if (e.key.toLowerCase() === "s")
            sPressed = false;
        if (e.key.toLowerCase() === "arrowup")
            upPressed = false;
        if (e.key.toLowerCase() === "arrowdown")
            downPressed = false;
        if (e.key.toLowerCase() === "t")
            tPressed = false;
        if (e.key.toLowerCase() === "y")
            yPressed = false;
    });
    // ===== Buttons =====
    var restartBtn = document.getElementById("restartBtn");
    var goBackBtn = document.getElementById("goBackBtn");
    restartBtn.addEventListener("click", function () {
        player1.active = true;
        player2.active = true;
        player3.active = true;
        player1.score = 0;
        player2.score = 0;
        player3.score = 0;
        gameOver = false;
        gameRunning = true;
        restartBtn.classList.add("hidden");
        resetBall();
        gameLoop();
    });
    goBackBtn.addEventListener("click", function () {
        player1.active = true;
        player2.active = true;
        player3.active = true;
        player1.score = 0;
        player2.score = 0;
        player3.score = 0;
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
