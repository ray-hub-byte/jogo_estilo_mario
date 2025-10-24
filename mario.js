const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// -------------------- Sprites --------------------
// Personagem humano 2D
const playerImg = new Image();
playerImg.src = 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_hero_icon.png';

// Inimigo humano 2D
const enemyImg = new Image();
enemyImg.src = 'https://upload.wikimedia.org/wikipedia/commons/8/87/Blue_icon.png';

// -------------------- Jogador --------------------
const player = {
  x: 50,
  y: 300,
  width: 40,
  height: 50,
  dx: 0,
  dy: 0,
  speed: 4,
  jumpPower: 12,
  onGround: false,
  score: 0,
  lives: 3
};

// -------------------- Gravidade --------------------
const gravity = 0.6;

// -------------------- Plataformas --------------------
const platforms = [
  { x: 0, y: 350, width: 800, height: 50 },
  { x: 200, y: 280, width: 100, height: 20 },
  { x: 400, y: 200, width: 150, height: 20 },
  { x: 600, y: 280, width: 100, height: 20 }
];

// -------------------- Inimigos --------------------
let enemies = [
  { x: 300, y: 300, width: 40, height: 50, dx: 1.5 },
  { x: 500, y: 300, width: 40, height: 50, dx: -1.5 }
];

// -------------------- Moedas --------------------
let coins = [
  { x: 220, y: 250, width: 15, height: 15 },
  { x: 420, y: 170, width: 15, height: 15 },
  { x: 620, y: 250, width: 15, height: 15 }
];

// -------------------- Teclas --------------------
const keys = {};
document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup', e => { keys[e.key] = false; });

// -------------------- Função Update --------------------
function update() {
  // Movimentação horizontal
  player.dx = 0;
  if (keys['ArrowLeft']) player.dx = -player.speed;
  if (keys['ArrowRight']) player.dx = player.speed;
  player.x += player.dx;

  // Gravidade
  player.dy += gravity;
  player.y += player.dy;
  player.onGround = false;

  // Colisão com plataformas
  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height < p.y + player.dy + player.height &&
      player.y + player.height > p.y
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.onGround = true;
    }
  });

  // Pulo
  if (keys['ArrowUp'] && player.onGround) {
    player.dy = -player.jumpPower;
    player.onGround = false;
  }

  // Limites do canvas
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y > canvas.height) {
    loseLife();
  }

  // Atualiza inimigos
  enemies.forEach(e => {
    e.x += e.dx;
    if (e.x < 0 || e.x + e.width > canvas.width) e.dx *= -1;

    // Colisão com jogador
    if (
      player.x < e.x + e.width &&
      player.x + player.width > e.x &&
      player.y < e.y + e.height &&
      player.y + player.height > e.y
    ) {
      loseLife();
    }
  });

  // Coleção de moedas
  coins.forEach((c, i) => {
    if (
      player.x < c.x + c.width &&
      player.x + player.width > c.x &&
      player.y < c.y + c.height &&
      player.y + player.height > c.y
    ) {
      player.score += 10;
      coins.splice(i, 1);
    }
  });
}

// -------------------- Perder vida --------------------
function loseLife() {
  player.lives--;
  if (player.lives <= 0) {
    alert("Game Over!");
    resetGame();
  } else {
    player.x = 50;
    player.y = 300;
    player.dx = 0;
    player.dy = 0;
  }
}

// -------------------- Reset --------------------
function resetGame() {
  player.lives = 3;
  player.score = 0;
  player.x = 50;
  player.y = 300;
  player.dx = 0;
  player.dy = 0;
  coins = [
    { x: 220, y: 250, width: 15, height: 15 },
    { x: 420, y: 170, width: 15, height: 15 },
    { x: 620, y: 250, width: 15, height: 15 }
  ];
}

// -------------------- Função Draw --------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Plataformas
  ctx.fillStyle = 'green';
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

  // Jogador humano
  if (playerImg.complete && playerImg.naturalHeight !== 0) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  } else {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  // Inimigos humanos
  enemies.forEach(e => {
    if (enemyImg.complete && enemyImg.naturalHeight !== 0) {
      ctx.drawImage(enemyImg, e.x, e.y, e.width, e.height);
    } else {
      ctx.fillStyle = 'purple';
      ctx.fillRect(e.x, e.y, e.width, e.height);
    }
  });

  // Moedas
  ctx.fillStyle = 'yellow';
  coins.forEach(c => ctx.fillRect(c.x, c.y, c.width, c.height));

  // HUD
  document.getElementById('score').innerText = `Score: ${player.score}`;
  document.getElementById('lives').innerText = `Lives: ${player.lives}`;
}

// -------------------- Loop --------------------
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Inicia o jogo
gameLoop();
