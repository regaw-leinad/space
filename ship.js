function Ship(position) {
    if (position) {
        this.position = position.copy();
    } else {
        this.position = createVector();
    }

    this.radius = 10;
    this.velocity = createVector();
    this.rotationAmount = 5 * PI / 180;
    this.heading = 0;
    this.isThrusting = false;
    this.isRetrograde = false;

    this.preUpdate = function () {
        // Reset the flags here...
        this.isThrusting = false;
        this.isRetrograde = false;
    }

    this.update = function () {

        // Update position with the velocity
        this.position.add(this.velocity);
    }

    this.rotate = function (direction) {
        this.heading += direction * this.rotationAmount;

        // Keep within bounds of
        if (this.heading >= TWO_PI) {
            this.heading -= TWO_PI;
        } else if (this.heading <= -TWO_PI) {
            this.heading += TWO_PI;
        }
    }

    this.thrust = function (retro) {
        var force = p5.Vector.fromAngle(this.heading).mult(0.1);

        if (retro) {
            this.velocity.sub(force);
            this.isRetrograde = true;
        } else {
            this.velocity.add(force);
            this.isThrusting = true;
        }

        // Limit top speed
        this.velocity.limit(6);
    }

    this.render = function () {
        //push();

        noFill();
        // translate(this.position.x, this.position.y);
        // rotate(this.heading);

        // Draw the fire if we're thrusting
        if (this.isThrusting) {
            strokeWeight(2);

            stroke(255, 153, 0);
            line(-this.radius * 1.05, 0, -this.radius - this.radius * 0.6, -this.radius * 0.3);
            line(-this.radius * 1.05, 0, -this.radius - this.radius * 0.6, this.radius * 0.3);

            stroke(255, 0, 0);
            line(-this.radius * 1.05, 0, -this.radius - this.radius * 0.8, 0);
        }

        if (this.isRetrograde) {
            strokeWeight(2);

            stroke(200);
            line(this.radius * 0.48, this.radius * 0.48, this.radius * 0.48 + this.radius / 5, this.radius * 0.48);
            line(this.radius * 0.48, -this.radius * 0.48, this.radius * 0.48 + this.radius / 5, -this.radius * 0.48);
        }

        // Draw the ship
        strokeWeight(1);
        stroke(255);
        fill(0);
        triangle(this.radius + this.radius / 2, 0, -this.radius, -this.radius, -this.radius, this.radius);

        if (DEBUG_RENDER) {
            noFill();
            stroke(255, 0, 0);
            ellipse(0, 0, this.radius * 2);
        }

        //pop();
    }

    this.move = function (vector) {
        this.position.add(vector.mult(5));
    }
}
