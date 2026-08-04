/* Sfondo animato "Black Hole" — disco di accrescimento + campo stellare.
   Puramente generativo (canvas 2D), nessuna immagine esterna. */
(function () {
  const canvas = document.getElementById("blackhole-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w, h, cx, cy, dpr;
  let stars = [];
  let particles = [];
  let t = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w * 0.5;
    cy = h * 0.4;
    buildStars();
    buildParticles();
  }

  function buildStars() {
    const count = Math.floor((w * h) / 9000);
    stars = new Array(count).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.1 + 0.2,
      a: Math.random() * 0.6 + 0.15,
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function buildParticles() {
    const count = 260;
    particles = new Array(count).fill(0).map(() => {
      const radius = 70 + Math.random() * 230;
      return {
        radius,
        angle: Math.random() * Math.PI * 2,
        speed: (0.0006 + Math.random() * 0.0012) * (radius < 140 ? 1.6 : 1),
        size: Math.random() * 1.6 + 0.4,
        squash: 0.34 + Math.random() * 0.06,
      };
    });
  }

  function drawStars() {
    for (const s of stars) {
      const flick = 0.5 + 0.5 * Math.sin(t * 0.001 + s.tw);
      ctx.globalAlpha = s.a * (reduceMotion ? 1 : flick);
      ctx.fillStyle = "#e9e4ff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawGlow() {
    const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 260);
    g1.addColorStop(0, "rgba(139,107,255,0.35)");
    g1.addColorStop(0.35, "rgba(139,107,255,0.12)");
    g1.addColorStop(1, "rgba(139,107,255,0)");
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.arc(cx, cy, 260, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawDisk() {
    ctx.save();
    ctx.translate(cx, cy);

    for (const p of particles) {
      if (!reduceMotion) p.angle += p.speed;
      const x = Math.cos(p.angle) * p.radius;
      const y = Math.sin(p.angle) * p.radius * p.squash;

      const behind = Math.sin(p.angle) < 0;
      const depthAlpha = behind ? 0.28 : 0.85;
      const hueMix = (p.radius - 70) / 230;
      const r = Math.round(255 - hueMix * 30);
      const g = Math.round(154 - hueMix * 40);
      const b = Math.round(77 + hueMix * 120);

      ctx.beginPath();
      ctx.fillStyle = `rgba(${r},${g},${b},${depthAlpha})`;
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawEventHorizon() {
    // Ombra centrale (orizzonte degli eventi)
    const rShadow = 46;
    const shadowGrad = ctx.createRadialGradient(cx, cy, rShadow * 0.6, cx, cy, rShadow * 1.5);
    shadowGrad.addColorStop(0, "rgba(2,1,4,1)");
    shadowGrad.addColorStop(0.7, "rgba(2,1,4,1)");
    shadowGrad.addColorStop(1, "rgba(2,1,4,0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, rShadow * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Anello fotonico
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,210,170,0.55)";
    ctx.lineWidth = 1.4;
    ctx.arc(cx, cy, rShadow, 0, Math.PI * 2);
    ctx.stroke();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    drawStars();
    drawGlow();
    drawDisk();
    drawEventHorizon();
    t += 16;
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  frame();
  if (reduceMotion) frame(); // singolo render statico
})();
