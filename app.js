let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');
let cols = 16;
let rows = 12;
let cat = [{
    x: 1,
    y: 1
}];
let snack;
let cellWidth = canvas.width / cols;
let cellHeight = canvas.height / rows;
let difficulty;
let direction = 'right';
let snackEaten = false;
let score = 0;
let catImg = document.getElementById('catImg');

spawnSnack();
difficulty = setInterval(gameLoop, 250)
document.addEventListener('keydown', keyDown)
draw();


function draw() {
    //Background
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Cat
    ctx.drawImage(catImg, cat[0].x * cellWidth, cat[0].y * cellHeight, cellWidth, cellHeight);
    ctx.fillStyle = "#5b453b";
    for (let i = 1; i < cat.length; i++) {
        addPixel(cat[i].x, cat[i].y);
    }

    //Snack
    ctx.fillStyle = '#ccac0c';
    addPixel(snack.x, snack.y);

    requestAnimationFrame(draw);
}

function checkGameOver() {
    let head = cat[0];
    let body = cat.slice(1);
    let bodyCrash = body.find(part => part.x == head.x && part.y == head.y)
    if (cat[0].x < 0 ||
        cat[0].x > cols - 1 ||
        cat[0].y < 0 ||
        cat[0].y > rows - 1 ||
        bodyCrash
    ) {
        resetGame();
    }

}

function spawnSnack() {
    let ranX = Math.floor(Math.random() * cols);
    let ranY = Math.floor(Math.random() * rows);
    if (!cat.find(part => part.x == ranX && part.y == ranY))
        snack = { x: ranX, y: ranY };
    else
        spawnSnack();
}


function addPixel(x, y) {
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
}

function moveAndExpandCat() {
    for (let i = cat.length - 1; i > 0; i--) {
        const part = cat[i];
        const lastpart = cat[i - 1];
        part.x = lastpart.x;
        part.y = lastpart.y;
    }
}

function gameLoop() {
    checkGameOver();
    if (snackEaten) {
        cat = [{
            x: cat[0].x,
            y: cat[0].y
        }, ...cat];
        snackEaten = false;
    }

    moveAndExpandCat();

    if (direction == 'left')
        cat[0].x--;
    if (direction == 'right')
        cat[0].x++;
    if (direction == 'up')
        cat[0].y--;
    if (direction == 'down')
        cat[0].y++;


    //Eat Snack
    if (cat[0].x == snack.x && cat[0].y == snack.y) {
        snackEaten = true;
        score++;
        spawnSnack();
    }

    if (score >= 10 && score < 20) {
        clearInterval(difficulty);
        difficulty = setInterval(gameLoop, 200);
    }
    else if (score >= 20 && score < 30) {
        clearInterval(difficulty);
        difficulty = setInterval(gameLoop, 150);
    }
}

function keyDown(k) {
    if (k.keyCode == 37) {
        if (cat.length > 1 && direction == 'right')
            resetGame();
        else
            direction = 'left';
    }
    if (k.keyCode == 38) {
        if (cat.length > 1 && direction == 'down')
            resetGame();
        else
            direction = 'up';
    }
    if (k.keyCode == 39) {
        if (cat.length > 1 && direction == 'left')
            resetGame();
        else
            direction = 'right';
    }
    if (k.keyCode == 40) {
        if (cat.length > 1 && direction == 'up')
            resetGame();
        else
            direction = 'down';
    }
}

function resetGame() {
    if (score > 0)
        alert('You scored ' + score + ' point(s)');
    cat = [{ x: 1, y: 1 }];
    direction = 'right';
    score = 0;
    spawnSnack();
    clearInterval(difficulty);
    difficulty = setInterval(gameLoop, 250);
}
