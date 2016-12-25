var DEBUG_RENDER = true;

var arena;
var ship;
var asteroids = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    arena = new Arena(10000, 10000);
    ship = new Ship(createVector(arena.width / 2, arena.height / 2));
    arena.setShip(ship);

    for (var i = 0; i < 500; i++) {
        asteroids.push(new Asteroid(arena, createVector(random(arena.width), random(arena.height))));
    }

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
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(KEY_D)) {
        ship.rotate(CLOCKWISE);
    } else if (keyIsDown(LEFT_ARROW) || keyIsDown(KEY_A)) {
        ship.rotate(COUNTER_CLOCKWISE);
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(KEY_W)) {
        ship.thrust();
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(KEY_S)) {
        ship.thrust(true);
    }

    ship.update();

    arena.ensureBounds(ship, 0.4);

    asteroids.forEach(function (asteroid) {
        asteroid.update();
        arena.ensureBounds(asteroid);
    });

    for (var i = 0; i < asteroids.length; i++) {
        var asteroid = asteroids[i];

        for (var j = i + 1; j < asteroids.length; j++) {
            asteroid.calculateCollision(asteroids[j]);
        }
    }
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

    if (DEBUG_RENDER) {
        rotate(-ship.heading);

        var headingVector = p5.Vector.fromAngle(ship.heading).setMag(60);
        var moveVector = ship.velocity.copy().mult(10);

        strokeWeight(2);
        stroke(0, 0, 255);
        line(0, 0, headingVector.x, headingVector.y);
        stroke(0, 255, 0);
        line(0, 0, moveVector.x, moveVector.y);
    }

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
    if (keyCode === KEY_Z) {
        DEBUG_RENDER = !DEBUG_RENDER;
    }
}
