const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 70; // Puoi aumentare o diminuire i punti

// Posizione del mouse
const mouse = {
    x: null,
    y: null,
    radius: 130 // Raggio di repulsione ed interazione col mouse
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
}
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.color = 'rgba(96, 165, 250, 0.8)';
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#60a5fa';
        ctx.fill();
    }

    update() {
        this.baseX += this.vx;
        this.baseY += this.vy;

        if (this.baseX < 0 || this.baseX > canvas.width) this.vx *= -1;
        if (this.baseY < 0 || this.baseY > canvas.height) this.vy *= -1;

        // Repulsione dal mouse
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = forceDirectionX * force * 7;
                let directionY = forceDirectionY * force * 7;

                this.x -= directionX;
                this.y -= directionY;
            } else {
                this.x += (this.baseX - this.x) * 0.04;
                this.y += (this.baseY - this.y) * 0.04;
            }
        } else {
            this.x += (this.baseX - this.x) * 0.04;
            this.y += (this.baseY - this.y) * 0.04;
        }
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Funzione per disegnare le linee tra i punti vicini
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            // Se la distanza tra due punti è inferiore a una certa soglia, disegna la linea
            if (distance < 15000) { // Regola questo valore per aumentare/diminuire la quantità di linee
                opacityValue = 1 - (distance / 15000);
                ctx.strokeStyle = `rgba(96, 165, 250, ${opacityValue * 0.25})`; // Linea azzurra semitrasparente
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
    }
    
    connect(); // Richiama la funzione che unisce i punti con le linee
    requestAnimationFrame(animate);
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
init();
animate();