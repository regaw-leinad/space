function Arena(w, h) {
    this.width = w;
    this.height = h;
    this.gridSize = 50;

    this.ship = null;

    this.setShip = function (ship) {
        this.ship = ship;
    }

    this.render = function () {
        noFill();
        stroke(80);

        var startX = getClosest(this.ship.position.x - width / 2, this.gridSize);
        var startY = getClosest(this.ship.position.y - height / 2, this.gridSize);

        for (var x = startX; x <= this.ship.position.x + width + this.gridSize && x < this.width; x += this.gridSize) {
            var endY = min(startY + height + this.gridSize, this.height);
            line(x, startY, x, endY);
        }

        for (var y = startY; y <= this.ship.position.y + height + this.gridSize && y < this.height; y += this.gridSize) {
            var endX = min(startX + width + this.gridSize, this.width);
            line(startX, y, endX, y);
        }

        // Non-optimized version
        // for (var x = this.gridSize; x < this.width; x += this.gridSize) {
        //     line(x, 0, x, this.height);
        // }
        //
        // for (var y = this.gridSize; y < this.height; y += this.gridSize) {
        //     line(0, y, this.width, y);
        // }

        stroke(255);

        rect(0, 0, this.width, this.height);
    }

    this.getView = function () {
        var x = this.ship.position.x - width / 2;
        var y = this.ship.position.y - height / 2;

        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    }

    this.ensureBounds = function (object, velocityScale) {
        velocityScale = velocityScale || 1;

        // Make sure the object is within bounds
        if (object.position.x > this.width - object.radius) {
            object.position.x = this.width - object.radius;
            object.velocity.x = -object.velocity.x * velocityScale;
        } else if (object.position.x < object.radius) {
            object.position.x = object.radius;
            object.velocity.x = -object.velocity.x * velocityScale;
        }

        if (object.position.y > this.height - object.radius) {
            object.position.y = this.height - object.radius;
            object.velocity.y = -object.velocity.y * velocityScale;
        } else if (object.position.y < object.radius) {
            object.position.y = object.radius;
            object.velocity.y = -object.velocity.y * velocityScale;
        }
    }
}

function getClosest(val, n) {
    if (val > 0) {
        return floor(val / n) * n;
    }

    return 0;
}
