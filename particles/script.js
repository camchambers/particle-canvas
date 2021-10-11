const canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// Get mouse position
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 100) * (canvas.width / 100),
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Particle class
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "rgba(100, 220, 50, 0.5)";
    ctx.fill();
  }

  update() {
    // Ensure the particle stays within the canvas boundaries
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Collision detection
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx ** 2 + dy ** 2);

    // Check the difference of the distance from the mouse to a particle
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > this.y > this.size * 10) {
        this.y -= 10;
      }
    }
    // Move the particle in the appropriate direction and redraw it
    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

// Initalize particles
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 6000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 3 + 1;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 5 - 2.5;
    let directionY = Math.random() * 5 - 2.5;
    let color = "rgba(100,200,30,1);";

    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color)
    );
  }
}

// Check if particles are close enough to connect
function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = 0; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - distance / 12000;
        ctx.strokeStyle = "rgba(100,200,30," + opacityValue + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// Main animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  // Iterate over each particle and have it update
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

// Handle window resizing
window.addEventListener("resize", function () {
  canvas.width = this.innerWidth;
  canvas.height = this.innerHeight;
  mouse.radius = (canvas.height / 80) * (canvas.height / 80);
  init();
});

// Handle mouse collision detection when mouse is out of bounds
window.addEventListener("mouseout", function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

init();
animate();