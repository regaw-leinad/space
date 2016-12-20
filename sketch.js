var CLOCKWISE = 1;
var COUNTER_CLOCKWISE = -1;
var DEBUG_RENDER = false;

var arena;
var ship;
var asteroids = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    arena = new Arena(10000, 10000);
    // ship = new Ship(createVector(floor(random(arena.width)), floor(random(arena.height))));
    ship = new Ship(createVector(arena.width / 2, arena.height / 2));
    arena.setShip(ship);

    for (var i = 0; i < 500; i++) {
        asteroids.push(new Asteroid(arena, createVector(random(arena.width), random(arena.height))));
    }

    // floor(random(arena.width)), floor(random(arena.height))

    textFont('Helvetica');
    textSize(12);
}

function draw() {
    preUpdate();
    update();
    render();
}

function preUpdate() {
    ship.preUpdate();
}

function update() {
    if (keyIsDown(RIGHT_ARROW)) {
        ship.rotate(CLOCKWISE);
    } else if (keyIsDown(LEFT_ARROW)) {
        ship.rotate(COUNTER_CLOCKWISE);
    }

    if (keyIsDown(UP_ARROW)) {
        ship.thrust();
    }

    if (keyIsDown(DOWN_ARROW)) {
        ship.thrust(true);
    }

    ship.update();

    arena.ensureBounds(ship, 0.4);

    asteroids.forEach(function (asteroid) {
        asteroid.update();
        arena.ensureBounds(asteroid);
    });
}

function render() {
    background(0);

    push();

    // Camera translate
    // Adjust for ship position offset
    translate(-ship.position.x, -ship.position.y);
    // Go back 1/2 our view to put camera in middle
    translate(width / 2, height / 2);

    arena.render();
    asteroids.forEach(function (asteroid) {
        asteroid.render();
    });

    translate(ship.position.x, ship.position.y);
    rotate(ship.heading);

    ship.render();

    pop();

    if (DEBUG_RENDER) {
        fill(255);
        text('Position (' + ship.position.x.toFixed(1) + ', ' + ship.position.y.toFixed(1) + ')', 5, 15);

        text('Velocity (' + ship.velocity.x.toFixed(1) + ', ' + ship.velocity.y.toFixed(1) +
            ') :: Direction (' + degrees(ship.velocity.heading()).toFixed(1) +
            '):: Mag (' + ship.velocity.mag().toFixed(1) + ')', 5, 30);

        text('Heading: ' + degrees(ship.heading).toFixed(1), 5, 45);

        text('Is Thrusting: ' + !!ship.isThrusting, 5, 60);
        text('Is Retrograde: ' + !!ship.isRetrograde, 5, 75);

        text(frameRate().toFixed(), width - 20, height - 10);
    }
}

function keyPressed() {
    if (key === 'D') {
        DEBUG_RENDER = !DEBUG_RENDER;
    }
}
