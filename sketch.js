const SPACE_BAR = 32;
let DEBUG_RENDER = false;

let arena;
let ship;
let asteroids = [];
let bullets = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    arena = new Arena(10000, 10000);
    ship = new Ship(createVector(arena.width / 2, arena.height / 2));
    arena.setShip(ship);

    for (let i = 0; i < 500; i++) {
        const position = createVector(random(arena.width), random(arena.height));
        const radius = random(20, 50);

        let validPlace = true;

        for (let a = 0; a < asteroids.length; a++) {
            let asteroid = asteroids[a];

            const d = dist(asteroid.position.x, asteroid.position.y, position.x, position.y);
            if (d <= radius + asteroid.radius) {
                validPlace = false;
                i--;
                break;
            }
        }

        if (validPlace) {
            asteroids.push(new Asteroid(arena, position, radius));
        }
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

        asteroid.calculateCollision(ship);

        for (var j = i + 1; j < asteroids.length; j++) {
            asteroid.calculateCollision(asteroids[j]);
        }
    }

    for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];
        bullet.update();

        for (var j = asteroids.length - 1; j >= 0; j--) {
            var asteroid = asteroids[j];

            if (!bulletCollides(bullet, asteroid)) {
                continue;
            }

            if (asteroid.radius > 15) {
                for (var a = 0; a < 2; a++) {
                    var newAsteroid = new Asteroid(arena, asteroid.position, asteroid.radius / 2);
                    newAsteroid.position.add(newAsteroid.velocity.copy().setMag(newAsteroid.radius * 2.1));
                    asteroids.push(newAsteroid);
                }
            }

            bullets.splice(i, 1);
            asteroids.splice(j, 1);

            break;
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

    bullets.forEach(function (bullet) {
        bullet.render();
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

        text(frameRate().toFixed(), width - 50, height - 50);
    }
}

function bulletCollides(bullet, object) {
    return dist(bullet.position.x, bullet.position.y, object.position.x, object.position.y) <= object.radius;
}

function keyPressed() {
    if (keyCode === SPACE_BAR) {
        var b = new Bullet(ship.getShotPosition(), ship.velocity, ship.heading);
        bullets.push(b);

        setTimeout(function () {
            var idx = bullets.indexOf(b);
            if (idx != -1) {
                bullets.splice(idx, 1);
            }
        }, 5000);
    } else if (keyCode === KEY_Z) {
        DEBUG_RENDER = !DEBUG_RENDER;
    }
}
