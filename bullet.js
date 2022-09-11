function Bullet(position, shipVelocity, shipHeading) {
    this.position = position;
    this.heading = shipHeading;
    this.velocity = p5.Vector.fromAngle(this.heading).mult(8).add(shipVelocity);

    this.update = function () {
        this.position.add(this.velocity);
    }

    this.render = function () {
        push();

        translate(this.position.x, this.position.y);
        rotate(this.heading);

        noFill();
        stroke(255);
        strokeWeight(4);

        point(0, 0);

        pop();
    }
}
