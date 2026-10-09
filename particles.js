/* ==========================================================================
   INTERACTIVE CANVAS PARTICLES SYSTEM
   Renders floating hearts, twinkling stars, soft glowing particles & flowers
   ========================================================================== */

export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.sparkles = [];
    this.maxParticles = 45;
    
    this.mouse = {
      x: -1000,
      y: -1000,
      radius: 120
    };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Track mouse & touch position for interactive particle sparkle effect
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (Math.random() < 0.4) {
        this.addSparkle(e.clientX, e.clientY);
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        if (Math.random() < 0.5) {
          this.addSparkle(e.touches[0].clientX, e.touches[0].clientY);
        }
      }
    }, { passive: true });

    // Populate initial background particles
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(true));
    }

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticle(randomY = false) {
    const types = ['heart', 'star', 'glow', 'flower'];
    const type = types[Math.floor(Math.random() * types.length)];

    const colors = [
      'rgba(255, 182, 193, ', // Pink
      'rgba(216, 180, 254, ', // Lavender
      'rgba(186, 230, 253, ', // Baby blue
      'rgba(254, 215, 170, ', // Peach
      'rgba(254, 240, 138, '  // Soft yellow
    ];

    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 20,
      size: Math.random() * 16 + 10,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: Math.random() * 0.4 - 0.2,
      type: type,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      angle: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
      swayRange: Math.random() * 1.5 + 0.5
    };
  }

  addSparkle(x, y) {
    if (this.sparkles.length > 30) this.sparkles.shift();
    this.sparkles.push({
      x: x + (Math.random() * 20 - 10),
      y: y + (Math.random() * 20 - 10),
      size: Math.random() * 6 + 3,
      alpha: 1,
      decay: Math.random() * 0.04 + 0.02,
      color: ['#FFD6E0', '#C8B6FF', '#BEE9E8', '#FFE5EC'][Math.floor(Math.random() * 4)]
    });
  }

  drawHeart(x, y, size, color, alpha) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.fillStyle = `${color}${alpha})`;
    this.ctx.beginPath();
    const topCurveHeight = size * 0.3;
    this.ctx.moveTo(0, topCurveHeight);
    // top left curve
    this.ctx.bezierCurveTo(
      0, 0, 
      -size / 2, 0, 
      -size / 2, topCurveHeight
    );
    // bottom left curve
    this.ctx.bezierCurveTo(
      -size / 2, (size + topCurveHeight) / 2, 
      0, size * 0.8, 
      0, size
    );
    // bottom right curve
    this.ctx.bezierCurveTo(
      0, size * 0.8, 
      size / 2, (size + topCurveHeight) / 2, 
      size / 2, topCurveHeight
    );
    // top right curve
    this.ctx.bezierCurveTo(
      size / 2, 0, 
      0, 0, 
      0, topCurveHeight
    );
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  drawStar(x, y, size, color, alpha) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.fillStyle = `${color}${alpha})`;
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      this.ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * size, -Math.sin((18 + i * 72) * Math.PI / 180) * size);
      this.ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (size / 2), -Math.sin((54 + i * 72) * Math.PI / 180) * (size / 2));
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  drawFlower(x, y, size, color, alpha) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.fillStyle = `${color}${alpha})`;
    for (let i = 0; i < 5; i++) {
      this.ctx.rotate((Math.PI * 2) / 5);
      this.ctx.beginPath();
      this.ctx.arc(0, size * 0.3, size * 0.25, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawGlow(x, y, size, color, alpha) {
    this.ctx.save();
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `${color}${alpha})`);
    gradient.addColorStop(1, `${color}0)`);
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & Render background particles
    this.particles.forEach((p, index) => {
      p.y -= p.speedY;
      p.angle += p.wobbleSpeed;
      p.x += Math.sin(p.angle) * p.swayRange;
      
      // Twinkle / Pulse Alpha
      p.alpha += Math.sin(p.angle * 2) * p.pulseSpeed;
      if (p.alpha < 0.1) p.alpha = 0.1;
      if (p.alpha > 0.7) p.alpha = 0.7;

      // Mouse repulsion / interaction
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        p.x -= (dx / dist) * force * 3;
        p.y -= (dy / dist) * force * 3;
      }

      // Draw particle based on type
      if (p.type === 'heart') {
        this.drawHeart(p.x, p.y, p.size, p.color, p.alpha);
      } else if (p.type === 'star') {
        this.drawStar(p.x, p.y, p.size * 0.7, p.color, p.alpha);
      } else if (p.type === 'flower') {
        this.drawFlower(p.x, p.y, p.size * 0.8, p.color, p.alpha);
      } else {
        this.drawGlow(p.x, p.y, p.size * 1.5, p.color, p.alpha);
      }

      // Reset when floating out of screen top
      if (p.y < -30) {
        this.particles[index] = this.createParticle(false);
      }
    });

    // Update & Render cursor sparkles
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.y -= 0.5;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        this.sparkles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = s.alpha;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}
