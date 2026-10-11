/* ═══════════════════════════════════════════════════════════════
   SUPPLYMENTUM UNI · COMPORTAMIENTO COMÚN
   Se carga en todas las páginas.
   ═══════════════════════════════════════════════════════════════ */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover:hover) and (pointer:fine)').matches;


/* ── 1 · Cursor rojo personalizado ───────────────────────────
   Un punto en la posición exacta y un aro que lo persigue con
   retardo. Sólo se monta si hay ratón de verdad: en táctil o con
   movimiento reducido se deja el cursor del sistema.          */
function initCursor() {
  if (!FINE_POINTER || REDUCED) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);
  document.documentElement.classList.add('has-cursor');

  let mx = innerWidth / 2, my = innerHeight / 2;   // ratón
  let rx = mx, ry = my;                            // aro (con retardo)

  addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  }, { passive: true });

  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  // Estado según lo que hay debajo del puntero
  const HOT = 'a, button, [role="button"], .card, .node, .chip, input, select, textarea, summary, .wheel';
  const TEXT = 'p, h1, h2, h3, h4, li, span.body-sm';

  addEventListener('pointerover', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const hot = t.closest(HOT);
    document.documentElement.classList.toggle('cursor-hot', !!hot);
    document.documentElement.classList.toggle(
      'cursor-text', !hot && !!t.closest(TEXT)
    );
  }, { passive: true });

  addEventListener('pointerdown', () => document.documentElement.classList.add('cursor-down'));
  addEventListener('pointerup',   () => document.documentElement.classList.remove('cursor-down'));

  // Al salir de la ventana se esconde
  addEventListener('pointerleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
  addEventListener('pointerenter', () => { dot.style.opacity = ring.style.opacity = ''; });
}


/* ── 2 · Reveal al scroll ────────────────────────────────── */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (REDUCED || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }

  // Escalona las tarjetas dentro de una misma grilla
  document.querySelectorAll('.grid, .chain').forEach(grid => {
    [...grid.children].forEach((child, i) => {
      if (child.classList.contains('reveal')) {
        child.style.transitionDelay = (i % 3) * 90 + 'ms';
      }
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { threshold: .1, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => io.observe(el));
}


/* ── 3 · Contadores ──────────────────────────────────────── */
function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  const run = (el) => {
    const target = +el.dataset.count;
    const prefix = el.dataset.prefix || '';
    if (REDUCED) { el.textContent = prefix + target; return; }

    const dur = 1400, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: .5 });
  nums.forEach(n => io.observe(n));
}


/* ── 4 · Fondo: red de suministro ────────────────────────────
   Nodos que derivan, unidos por rutas. Cada tanto un envío
   recorre una ruta. Es la metáfora de la cadena, a un volumen
   que no compite con el contenido.                           */
function initNetwork() {
  const cv = document.getElementById('net');
  if (!cv || REDUCED) return;
  const ctx = cv.getContext('2d');
  if (!ctx) return;

  let W, H, nodes = [], shipments = [], raf;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const LINK = 168;

  const resize = () => {
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const count = Math.round(Math.min(64, (W * H) / 26000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .17, vy: (Math.random() - .5) * .17,
      r: Math.random() * 1.5 + .7,
      warm: Math.random() < .18,
    }));
    shipments = [];
  };

  const spawn = () => {
    if (nodes.length < 2 || shipments.length > 5) return;
    const a = (Math.random() * nodes.length) | 0;
    let b = (Math.random() * nodes.length) | 0;
    if (a === b) b = (b + 1) % nodes.length;
    shipments.push({ a, b, t: 0, speed: .004 + Math.random() * .004 });
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d > LINK) continue;
        ctx.strokeStyle = `rgba(237,28,36,${(1 - d / LINK) * .16})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    for (const n of nodes) {
      ctx.fillStyle = n.warm ? 'rgba(237,28,36,.55)' : 'rgba(245,244,242,.26)';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }

    shipments = shipments.filter(s => s.t <= 1);
    for (const s of shipments) {
      s.t += s.speed;
      const A = nodes[s.a], B = nodes[s.b];
      if (!A || !B) continue;
      const fade = Math.sin(s.t * Math.PI);
      ctx.fillStyle = `rgba(255,189,89,${fade * .85})`;
      ctx.beginPath();
      ctx.arc(A.x + (B.x - A.x) * s.t, A.y + (B.y - A.y) * s.t, 2.1, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  };

  resize();
  addEventListener('resize', resize, { passive: true });
  setInterval(spawn, 1100);
  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(draw);
  });
}


/* ── 4b · Carruseles con desplazamiento automático ───────────
   Los rieles marcados con data-autoscroll se desplazan solos en
   cuanto entran en pantalla. Se duplica el contenido una vez para
   que el bucle sea continuo y, al llegar al final del primer
   juego, se resta esa distancia exacta: el salto es invisible.

   Se detienen al pasar el mouse, al tabular dentro, mientras el
   usuario arrastra y cuando el riel sale de la vista. Siguen
   siendo rieles de scroll normales: se pueden arrastrar a mano.  */
const OBSERVADORES = [];   // mantiene vivos los IntersectionObserver

function initAutoRails() {
  const rails = document.querySelectorAll('.rail[data-autoscroll]');
  if (!rails.length) return;

  rails.forEach(rail => {
    const originales = [...rail.children];
    if (!originales.length) return;

    // Las tarjetas de un riel se muestran de una vez: el observador de
    // .reveal ya pasó cuando se clonan, y un clon sin observar se
    // quedaría invisible para siempre.
    originales.forEach(el => {
      el.classList.remove('reveal');
      el.classList.add('is-in');
    });

    if (REDUCED) return;                    // sin movimiento automático

    // Copia del contenido para encadenar el bucle
    originales.forEach(el => {
      const copia = el.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      copia.setAttribute('tabindex', '-1');
      copia.querySelectorAll('a, button, input').forEach(f => f.setAttribute('tabindex', '-1'));
      rail.appendChild(copia);
    });

    // Distancia exacta de un juego completo (incluye su separación)
    const puntoDeBucle = () =>
      rail.children[originales.length].offsetLeft - rail.children[0].offsetLeft;

    const VELOCIDAD = 34;                   // píxeles por segundo
    let pausado = false, arrastrando = false;
    let ultimo = performance.now(), raf = null;

    // Estado inicial calculado a mano: así el riel arranca aunque el
    // observador aún no haya entregado su primera notificación.
    const enPantalla = () => {
      const r = rail.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight;
    };
    let visible = enPantalla();

    /* La posición se lleva en un acumulador decimal propio y se asigna
       entera. Sumar directamente sobre scrollLeft no funciona: el avance
       por fotograma es de medio píxel, el navegador lo redondea y el
       riel se queda clavado en cero. */
    let pos = rail.scrollLeft;

    const paso = (ahora) => {
      const dt = Math.min((ahora - ultimo) / 1000, .05);
      ultimo = ahora;

      if (visible && !pausado && !arrastrando && !document.hidden) {
        pos += VELOCIDAD * dt;
        const limite = puntoDeBucle();
        if (limite > 0 && pos >= limite) pos -= limite;
        rail.scrollLeft = pos;
      } else {
        // Mientras manda el usuario, seguimos su posición
        pos = rail.scrollLeft;
      }
      raf = requestAnimationFrame(paso);
    };

    /* Sólo corre mientras el riel está a la vista. La referencia al
       observador se guarda a propósito: si se deja anónima puede
       recolectarse y dejar de notificar, y el riel no arranca nunca. */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        ([e]) => { visible = e.isIntersecting; },
        { threshold: .05 }
      );
      io.observe(rail);
      OBSERVADORES.push(io);
    }
    addEventListener('scroll', () => { visible = enPantalla(); }, { passive: true });

    rail.addEventListener('pointerenter', () => { pausado = true; });
    rail.addEventListener('pointerleave', () => { pausado = false; });
    rail.addEventListener('focusin',  () => { pausado = true; });
    rail.addEventListener('focusout', () => { pausado = false; });

    // Mientras el usuario arrastra o desliza, manda él
    rail.addEventListener('pointerdown', () => { arrastrando = true; });
    addEventListener('pointerup', () => { arrastrando = false; });
    let reanudar;
    rail.addEventListener('wheel', () => {
      arrastrando = true;
      clearTimeout(reanudar);
      reanudar = setTimeout(() => { arrastrando = false; }, 1200);
    }, { passive: true });

    ultimo = performance.now();
    raf = requestAnimationFrame(paso);
  });
}


/* ── 5 · Cuenta regresiva ────────────────────────────────── */
function initCountdown() {
  const box = document.getElementById('countdown');
  if (!box || typeof SM === 'undefined') return;

  const end = new Date(SM.convocatoria.cierre).getTime();
  const cell = u => box.querySelector(`[data-unit="${u}"]`);
  const cells = { d: cell('d'), h: cell('h'), m: cell('m'), s: cell('s') };
  const pad = n => String(Math.max(0, n)).padStart(2, '0');

  const tick = () => {
    const left = end - Date.now();
    if (left <= 0) { Object.values(cells).forEach(c => c && (c.textContent = '00')); return; }
    const s = Math.floor(left / 1000);
    cells.d && (cells.d.textContent = pad(Math.floor(s / 86400)));
    cells.h && (cells.h.textContent = pad(Math.floor(s / 3600) % 24));
    cells.m && (cells.m.textContent = pad(Math.floor(s / 60) % 60));
    cells.s && (cells.s.textContent = pad(s % 60));
  };
  tick();
  setInterval(tick, 1000);
}


/* ── 6 · Marca el enlace de la página actual ─────────────── */
function initNav() {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const target = a.getAttribute('href');
    // El detalle de un área marca "Áreas", el de un proyecto marca "Proyectos", etc.
    const family = {
      'area.html': 'areas.html',
      'proyecto.html': 'proyectos.html',
      'evento.html': 'eventos.html',
    }[here] || here;
    if (target === family) a.setAttribute('aria-current', 'page');
  });
}


/* ── Arranque ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initReveal();
  initCounters();
  initNetwork();
  initCountdown();
  initAutoRails();
});
