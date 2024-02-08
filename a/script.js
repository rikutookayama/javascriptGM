const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ゲームオブジェクトの初期化
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 0.2,
    dy: -0.2,
    radius: 10
};

const paddle = {
    width: 75,
    height: 10,
    x: (canvas.width - 75) / 2
};

// ブロックの設定
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// ボールの描画
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// パドルの描画
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// ブロックの描画
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// 衝突判定
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                if (
                    ball.x > brickX &&
                    ball.x < brickX + brickWidth &&
                    ball.y > brickY &&
                    ball.y < brickY + brickHeight
                ) {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                }
            }
        }
    }
}

// ゲームリセット関数
function resetGame() {
    // ボールの初期位置と速度を設定
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 0.2;
    ball.dy = -0.2;
    
    // ブロックの状態をリセット
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
}

// ゲームオーバー時の処理
function gameOver() {
  if (confirm('GAME OVER. Play again?')) {
      resetGame(); // ゲームをリセット
  } else {
      document.location.reload();
      clearInterval(interval);
  }
}

// ゲームクリア時の処理
function gameClear() {
  if (confirm('Congratulations! You cleared the game! Play again?')) {
      resetGame(); // ゲームをリセット
  } else {
      document.location.reload();
      clearInterval(interval);
  }
}


// ゲームの更新と描画
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        } else {
            gameOver(); // ゲームオーバー時の処理を呼び出す
            return;
        }
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    movePaddle();

    // 全てのブロックが壊れたかどうかを確認
    let isAllBricksBroken = true;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                isAllBricksBroken = false;
                break;
            }
        }
    }

    // 全てのブロックが壊れた場合、ゲームクリア処理を呼び出す
    if (isAllBricksBroken) {
        gameClear();
        return;
    }

    requestAnimationFrame(update);
}

// マウスの移動に応じてパドルを移動
function movePaddle() {
    canvas.addEventListener('mousemove', (e) => {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddle.x = relativeX - paddle.width / 2;
        }
    });
}

// ゲームループの開始
let interval = setInterval(update, 10);

