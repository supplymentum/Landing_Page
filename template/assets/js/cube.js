/* ═══════════════════════════════════════════════════════════════
   SUPPLYMENTUM UNI · EL CUBO EN 3D
   ───────────────────────────────────────────────────────────────
   El isotipo reconstruido como geometría real: dos marcos cúbicos
   anidados —blanco por fuera, rojo por dentro— con luz propia.
   Gira de verdad en tres ejes, en vez de ser un PNG en plano.

   OJO: este archivo es un script CLÁSICO, no un módulo, y carga
   Three.js con import() dinámico. Es a propósito: un
   <script type="module" src="archivo-local.js"> queda bloqueado
   por CORS cuando la página se abre con doble clic (file://), y
   entonces el cubo nunca se monta. Así funciona en los dos casos:
   abriendo el archivo directamente y publicado en un servidor.

   Si Three.js no carga, queda el PNG del logo como respaldo.
   ═══════════════════════════════════════════════════════════════ */

(async () => {
  'use strict';

  const heroCanvas  = document.getElementById('cube-canvas');
  const wheelCanvas = document.getElementById('wheel-canvas');
  if (!heroCanvas && !wheelCanvas) return;          // nada que montar

  let THREE;
  try {
    THREE = await import('https://unpkg.com/three@0.166.0/build/three.module.js');
  } catch (err) {
    console.warn('[cubo] Three.js no se pudo cargar; se muestra el PNG.', err);
    return;
  }

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Pose isométrica: con estos dos ángulos la silueta de un cubo es
     un hexágono regular y el objeto se lee igual que el isotipo. */
  const ISO_X = Math.atan(1 / Math.SQRT2);   // ≈ 35.264°
  const ISO_Y = Math.PI / 4;                 // 45°

  /* Un marco cúbico hecho de 12 vigas */
  function cubeFrame(size, thick, material) {
    const g = new THREE.Group();
    const h = size / 2;
    const len = size + thick;                // se solapan en las esquinas
    const add = (w, ht, d, x, y, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, ht, d), material);
      m.position.set(x, y, z);
      g.add(m);
    };
    for (const y of [-h, h]) for (const z of [-h, h]) add(len, thick, thick, 0, y, z);
    for (const x of [-h, h]) for (const z of [-h, h]) add(thick, len, thick, x, 0, z);
    for (const x of [-h, h]) for (const y of [-h, h]) add(thick, thick, len, x, y, 0);
    return g;
  }

  function mountCube(canvas, opts) {
    const {
      size = 2.05,
      turnsPerMin = 4.5,          // vueltas por minuto sobre el eje vertical
      interactive = true,
      camZ = 6.2,
    } = opts;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (err) {
      return false;                          // sin WebGL: se queda el PNG
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(0, 0, camZ);

    // Plástico mate y claro, como el render de marca
    const white = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: .05, roughness: .42 });
    const red   = new THREE.MeshStandardMaterial({
      color: 0xED1C24, metalness: .08, roughness: .36,
      emissive: 0x5E0206, emissiveIntensity: .5,
    });

    // El marco interior conserva la orientación del exterior: así se
    // leen como dos hexágonos anidados, igual que en el logotipo.
    const group = new THREE.Group();
    const core  = cubeFrame(size * 0.60, size * 0.058, red);
    core.position.set(-size * 0.055, -size * 0.055, 0);
    group.add(cubeFrame(size, size * 0.068, white), core);
    group.rotation.set(ISO_X, ISO_Y, 0);
    scene.add(group);

    // El grupo se centra en un contenedor propio, de modo que el
    // cabeceo no lo descoloque respecto al centro del lienzo.
    const pivot = new THREE.Group();
    pivot.add(group);
    scene.add(pivot);

    scene.add(new THREE.AmbientLight(0xB8BAC8, 2.1));
    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(4, 6.5, 5.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xD8DCEA, 1.25);
    fill.position.set(-3, 1.5, 4);
    scene.add(fill);
    const rim = new THREE.PointLight(0xED1C24, 34, 24);
    rim.position.set(-4.5, -1.5, -3.5);
    scene.add(rim);
    const warm = new THREE.PointLight(0xFFBD59, 12, 20);
    warm.position.set(3.5, -3, 2.5);
    scene.add(warm);

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    new ResizeObserver(resize).observe(canvas);

    const aim = { x: 0, y: 0 };
    if (interactive && !REDUCED) {
      addEventListener('pointermove', (e) => {
        aim.x = (e.clientY / innerHeight - .5) * .5;
        aim.y = (e.clientX / innerWidth  - .5) * .8;
      }, { passive: true });
    }

    if (REDUCED) { renderer.render(scene, camera); return true; }

    /* Gira sobre el eje vertical partiendo de la pose isométrica: cada
       cuarto de vuelta el cubo vuelve a leerse como el logo. La
       velocidad va por tiempo, no por fotograma, para que sea igual
       en pantallas de 60 Hz y de 120 Hz.                          */
    const RAD_PER_SEC = (turnsPerMin / 60) * Math.PI * 2;
    let raf, last = performance.now(), spun = 0, mx = 0, my = 0;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, .05);   // segundos, con tope
      last = now;
      spun += RAD_PER_SEC * dt;

      mx += (aim.x - mx) * .05;
      my += (aim.y - my) * .05;

      group.rotation.y = ISO_Y + spun + my * .45;
      group.rotation.x = ISO_X + Math.sin(spun * .5) * .09 + mx * .4;
      group.rotation.z = Math.sin(spun * .32) * .04;
      // El vaivén se aplica al pivote, así el cubo nunca se sale del centro
      pivot.position.y = Math.sin(spun * .7) * .07;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // No gastar batería con la pestaña oculta
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); }
    });
    return true;
  }

  if (heroCanvas && mountCube(heroCanvas, { size: 2.05, turnsPerMin: 4.5 })) {
    heroCanvas.parentElement.classList.add('is-3d');
  }
  if (wheelCanvas && mountCube(wheelCanvas, {
    size: 2.2, turnsPerMin: 3.2, interactive: false, camZ: 6.6,
  })) {
    wheelCanvas.parentElement.classList.add('is-3d');
  }
})();
