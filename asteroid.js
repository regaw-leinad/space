var counter = 0;

function Asteroid(arena, position, radius) {
    this.arena = arena;
    this.id = counter++;
    this.shouldRender = false;

    if (position) {
        this.position = position.copy();
    } else {
        this.position = createVector(random(width), random(height));
    }

    if (radius) {
        this.radius = radius;
    } else {
        this.radius = random(20, 50);
    }

    this.velocity = p5.Vector.random2D().mult(random(0.1, 2));
    this.heading = 0;
    this.spinSpeed = radians(random(-2, 2));

    this.vertices = floor(random(7, 15));
    this.offsets = [];

    for (var i = 0; i < this.vertices; i++) {
        this.offsets[i] = random(-this.radius * 0.2, this.radius * 0.8);
    }

    this.update = function () {
        this.position.add(this.velocity);
        this.heading += this.spinSpeed;

        if (this.heading >= TWO_PI) {
            this.heading -= TWO_PI;
        } else if (this.heading <= -TWO_PI) {
            this.heading += TWO_PI;
        }

        var view = this.arena.getView();

        // If the asteroid is out of the view, don't render it!
        this.shouldRender = overlaps(view, {
            x: this.position.x - this.radius,
            y: this.position.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        });
    }

    this.render = function () {
        if (!this.shouldRender) {
            return;
        }

        push();
        translate(this.position.x, this.position.y);
        rotate(this.heading);

        fill(0);
        stroke(255);

        beginShape();
        for (var i = 0; i < this.vertices; i++) {
            var angle = map(i, 0, this.vertices, 0, TWO_PI);

            var r = this.radius + this.offsets[i];
            var x = r * cos(angle);
            var y = r * sin(angle);

            vertex(x, y);
        }
        endShape(CLOSE);

        if (DEBUG_RENDER) {
            noFill();
            stroke(255, 0, 0);
            ellipse(0, 0, this.radius * 2);
            textAlign(CENTER);
            text(this.id, 0, 0);
        }

        pop();
    }
}

function overlaps(r1, r2) {
    return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
}
