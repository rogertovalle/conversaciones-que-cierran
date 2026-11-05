
(function () {
  "use strict";
  const DATA = window.RUEDA_DATOS;
  const ESC = DATA.escenas, NIVELES = DATA.niveles;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const svg = $("#lamina");
  const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SOLA = window.parent === window;
  if (!SOLA) document.documentElement.classList.add("en-atril");

  
  if (SOLA) {
    const addLink = (id, href) => {
      if (document.getElementById(id)) return;
      const l = document.createElement("link"); l.id = id; l.rel = "stylesheet"; l.href = href;
      document.head.insertBefore(l, document.head.firstChild);
    };
        addLink("atril-tema-producto", "tema.css");
  }

  const S = { cur: 0, token: 0, timers: [], reg: "tu", ctx: null };
  const TRANSITORIAS = ["dib", "vis", "gira", "fin", "plena", "viva", "asienta", "corre", "retira", "resalta", "estira", "sube",
    "presiona9", "presiona9b", "comprime", "empuja5", "empuja5b", "foco-off"];
  /* deformaciones de la onda: se aplican sobre piezas YA talladas; «fin» las bloquearía (animation:none), «plena» no */
  const DEFORMA = new Set(["estira", "sube", "presiona9", "presiona9b", "comprime", "empuja5", "empuja5b"]);
  /* lo que un salto (paso/final) no re-anima: gestos que solo tienen sentido en vivo */
  const SOLO_EN_VIVO = new Set(["gira", "corre", "asienta", "crece", ...DEFORMA]);

  /* ---------------- bandas de la pirámide ---------------- */
  (function () {
    const ys = [361, 343.4, 325.9, 308.3, 290.7, 273.1, 255.6, 238];
    const NS = "http://www.w3.org/2000/svg", g = $("#pir-bandas");
    for (let i = 0; i < 7; i++) {
      const y0 = ys[i], y1 = ys[i + 1], hw0 = 41 * (y0 - 238) / 123, hw1 = 41 * (y1 - 238) / 123;
      const p = document.createElementNS(NS, "path");
      p.setAttribute("class", "pbanda"); p.setAttribute("data-n", i + 1);
      p.setAttribute("d", `M ${320 - hw0},${y0} L ${320 + hw0},${y0} L ${320 + hw1},${y1} L ${320 - hw1},${y1} Z`);
      p.setAttribute("fill", "var(--x-flujo)"); p.setAttribute("opacity", "0");
      g.appendChild(p);
    }
  })();

  /* ---------------- cámara: encuadra una CAJA en el espacio libre (no recorta lo que pide) ---------------- */
  let cam = [1092, 721, 1000, 1000], camTok = 0;
  const DUR = REDUCED ? 0 : 1250;
  /* «angosta»: teléfono (dentro de atril el lienzo queda casi cuadrado, así que el ancho manda) o lienzo vertical */
  const vertical = () => { const r = svg.getBoundingClientRect(); return window.innerWidth <= 700 || (r.height > 0 && r.width / r.height < 0.9); };
  function aplicarCam() {
    const r = svg.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return;
    const a = r.width / r.height, [cx, cy, w, h] = cam;
    let vw, vh;
    if (w / h > a) { vw = w; vh = w / a; } else { vh = h; vw = h * a; }
    svg.setAttribute("viewBox", `${(cx - vw / 2).toFixed(1)} ${(cy - vh / 2).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
  }
  function irCam(caja, inmediato) {
    const to = caja.slice(), from = cam.slice(), tok = ++camTok, t0 = performance.now();
    if (inmediato || DUR === 0) { cam = to; aplicarCam(); return; }
    const paso = (t) => {
      if (tok !== camTok) return;
      let k = Math.max(0, Math.min(1, (t - t0) / DUR));
      k = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      cam = from.map((v, i) => v + (to[i] - v) * k);
      aplicarCam();
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }
  const cajaDe = (sc) => (vertical() && sc.camN ? sc.camN : sc.cam);
  if (window.ResizeObserver) new ResizeObserver(() => aplicarCam()).observe(svg);
  else window.addEventListener("resize", aplicarCam);

  /* ---------------- estado por pasos: saltar/retroceder siempre consistente ---------------- */
  function estadoPasos(i) {
    $$("#lamina [data-paso]").forEach((el) => {
      const p = +el.dataset.paso;
      el.classList.remove(...TRANSITORIAS);
      if (p < i && !el.classList.contains("transitorio")) el.classList.add("fin");
    });
    $$(".compas").forEach((el) => el.classList.remove("gira"));
    svg.classList.remove("crece");
    $("#nivel-etq").classList.remove("on");
  }
  function aplicarFx(fx) {
    fx = fx || {};
    $("#sello-grande").classList.toggle("on", !!fx.sello);
    document.body.classList.toggle("cadencia-on", !!fx.cadencia && !REDUCED);
    document.body.classList.toggle("latiendo", !!fx.latir && !REDUCED);
    document.body.classList.remove("runaway", "frenado");
    document.body.classList.toggle("foco", !!fx.foco);
    const eco = $("#g-eco");
    eco.classList.remove("eco-federando", "eco-extrayendo");
    if (fx.ecoF && !REDUCED) eco.classList.add("eco-federando");
  }
  function limpiarPiezas() {
    $("#g-pir").classList.remove("cumbre-invertida");
    $$(".pbanda").forEach((b) => b.setAttribute("opacity", 0));
    quitarFoco();
  }

  /* ---------------- piezas vivas (también expuestas por set) ---------------- */
  function quitarFoco() {
    $$(".p-orient, .dm-e, .o-etq").forEach((el) => el.classList.remove("foco-off", "encendida"));
    $$('[data-ensayo^="conv-"]').forEach((el) => { if (!el.classList.contains("sube")) el.classList.remove("resalta"); });
  }
  function encender(o) {           // las etiquetas de conversación de la lista o, en ámbar (una sola vez por composición)
    $$(".o-etq").forEach((el) => {
      const es = o.includes(el.dataset.o);
      el.classList.toggle("foco-off", !es);
      el.classList.toggle("encendida", es);
      const g = el.closest("[data-paso]"); if (g) g.classList.toggle("resalta", es);
    });
  }
  function focoConv(key) {
    quitarFoco();
    if (!key || key === "todas") return true;
    if (!["vision", "articulacion", "oportunidad", "monetizacion"].includes(key)) return false;
    $$(".p-orient").forEach((el) => {
      const es = el.dataset.o.split(" ").includes(key);
      el.classList.toggle("foco-off", !es);
      if (es) el.classList.add("resalta");
    });
    encender([key]);
    return true;
  }
  function focoEsquina(key) {
    quitarFoco();
    $$(".p-orient").forEach((el) => el.classList.remove("resalta"));
    if (!key || key === "ninguna") return true;
    const grupo = $(`.dm-e[data-ensayo="${key}"]`);
    if (!grupo) return false;
    const o = grupo.dataset.o;
    $$(".dm-e").forEach((el) => el.classList.toggle("foco-off", el.dataset.o !== o));
    encender(o.split(" "));
    return true;
  }
  const NIV_Y = [352.5, 335, 317.5, 300, 282.5, 265, 247.5];
  function setNivel(n) {
    n = Math.max(1, Math.min(7, Math.round(+n) || 1));
    const nv = NIVELES[n - 1];
    $$(".pbanda").forEach((b) => {
      const bn = +b.dataset.n;
      b.setAttribute("opacity", bn < n ? NIVELES[bn - 1].ia * 0.5 : (bn === n ? 0.42 : 0));
    });
    $("#g-pir").classList.toggle("cumbre-invertida", n === 7);
    const y = NIV_Y[n - 1], hw = 41 * (y - 238) / 123, ln = $("#ne-linea"), tx = $("#ne-texto");
    ln.setAttribute("x1", 320 + hw + 4); ln.setAttribute("y1", y); ln.setAttribute("x2", 392); ln.setAttribute("y2", y);
    tx.setAttribute("y", y + 3);
    tx.textContent = `${nv.n} · ${nv.q}`;
    $("#nivel-etq").classList.add("on");
    return true;
  }
  function setCad(modo) {
    const b = document.body;
    if (modo === "runaway") {
      b.classList.add("cadencia-on", "runaway"); b.classList.remove("frenado");
      if (REDUCED) return true;
      const tok = S.token;
      later(() => { if (tok !== S.token || !b.classList.contains("runaway")) return; b.classList.remove("runaway"); b.classList.add("frenado"); }, 4200);
      later(() => { if (tok !== S.token) return; b.classList.remove("frenado"); }, 9400);
      return true;
    }
    if (modo === "sana") { b.classList.add("cadencia-on"); b.classList.remove("runaway", "frenado"); return true; }
    return false;
  }
  function setEco(modo) {
    if (modo !== "federar" && modo !== "extraer") return false;
    const eco = $("#g-eco");
    eco.classList.remove("eco-federando", "eco-extrayendo");
    if (!REDUCED) eco.classList.add(modo === "federar" ? "eco-federando" : "eco-extrayendo");
    else if (modo === "extraer") eco.classList.add("eco-extrayendo");
    return true;
  }

  /* ---------------- coreografía con token (cancelable) ---------------- */
  function later(fn, ms) { S.timers.push(setTimeout(fn, ms)); }
  function cancelar() { S.token++; S.timers.forEach(clearTimeout); S.timers = []; camTok++; }
  /** aplica una entrada de coreografía; `salto` = estado final instantáneo (paso/final) en vez de animar */
  function aplicar(e, salto) {
    const [, sel, arg] = e;
    if (typeof sel === "string" && sel[0] === "@") {
      switch (sel) {
        case "@cam": irCam(Array.isArray(arg[0]) ? (vertical() ? arg[1] : arg[0]) : arg, salto); break;
        case "@conv": focoConv(arg); break;
        case "@esquina": focoEsquina(arg); break;
        case "@nivel": setNivel(arg); break;
        case "@cad": if (!salto) setCad(arg); break;
        case "@eco": setEco(arg); break;
        case "@etapa": estadoPasos(arg.paso); limpiarPiezas(); aplicarFx(arg.fx); if (arg.cam) irCam(arg.cam, salto); break;
      }
      return;
    }
    const cls = arg;
    if (salto) {
      if (SOLO_EN_VIVO.has(cls)) return;
      const c = cls === "dib" || cls === "vis" ? "viva" : cls;
      $$(sel).forEach((el) => el.classList.add(c));
      return;
    }
    if (sel === "#lamina") { svg.classList.remove(cls); void svg.getBoundingClientRect(); svg.classList.add(cls); return; }
    $$(sel).forEach((el) => {
      if (DEFORMA.has(cls) && el.classList.contains("fin")) { el.classList.remove("fin"); el.classList.add("plena"); }
      el.classList.add(cls);
    });
  }

  /* ---------------- cabecera, marca y registro ---------------- */
  function cabecera(sc, n) {
    const t = $("#tit");
    t.textContent = sc.titulo;
    if (!REDUCED) { t.classList.remove("estampa"); void t.offsetWidth; t.classList.add("estampa"); }
    const m = $("#marca"); m.className = "marca " + sc.marca[0]; m.textContent = sc.marca[1];
    $("#fuente").textContent = sc.fuente; $("#fuente").title = sc.fuente;
    [...$("#nav").children].forEach((b, i) => b.classList.toggle("on", i === n - 1));
  }
  function registro() {
    $$(".x-reg").forEach((el) => { const v = el.dataset[S.reg]; if (v) el.textContent = v; });
  }
  /* el subrayado ámbar de «criterio humano» se mide sobre el texto real (la fuente la pone el tema) */
  function subrayar() {
    try {
      const t = $("#lec-tesis text:nth-of-type(2)"), ln = $("#lec-tesis line"), s = t.textContent, i = s.indexOf("criterio");
      if (i < 0) return;
      const a = t.getStartPositionOfChar(i), b = t.getEndPositionOfChar(s.length - 1);
      ln.setAttribute("x1", a.x.toFixed(1)); ln.setAttribute("x2", b.x.toFixed(1));
      ln.setAttribute("y1", (a.y + 10).toFixed(1)); ln.setAttribute("y2", (a.y + 10).toFixed(1));
    } catch (e) { /* sin layout todavía */ }
  }

  /* ---------------- contrato ---------------- */
  function montar(n, k) {
    n = Math.max(1, Math.min(ESC.length, Math.round(Number(n)) || 1));
    const sc = ESC[n - 1];
    cancelar();
    S.cur = n;
    estadoPasos(sc.paso);
    limpiarPiezas();
    aplicarFx(sc.fx);
    cabecera(sc, n);
    registro(); subrayar();
    const corte = k == null ? -1 : (k === Infinity ? Infinity : (sc.beats || [0])[Math.max(0, Math.min((sc.beats || [0]).length - 1, k | 0))]);
    irCam(cajaDe(sc), corte !== -1 && corte > 0 ? true : false);
    const tok = S.token;
    (sc.coreo || []).forEach((e) => {
      const t = e[0];
      if (REDUCED || (corte !== -1 && t <= corte && corte > 0)) { aplicar(e, !REDUCED); return; }
      if (corte === Infinity) { aplicar(e, true); return; }
      later(() => { if (tok === S.token) aplicar(e, false); }, t - (corte > 0 ? corte : 0));
    });
    return n;
  }
  const ir = (n) => montar(n);
  const paso = (n, k) => montar(n, k);
  const final = (n) => montar(n, Infinity);
  function set(param, v) {
    switch (param) {
      case "conversacion": return focoConv(v);
      case "esquina": return focoEsquina(v);
      case "nivel": return setNivel(v);
      case "cadencia": return setCad(v);
      case "ecosistema": return setEco(v);
      default: return false;
    }
  }
  function configurar(ctx) {
    S.ctx = ctx || {};
    S.reg = S.ctx.registro === "usted" ? "usted" : "tu";
    const arriba = S.ctx.reserva ? S.ctx.reserva.arriba : 0;
    document.documentElement.dataset.xCab = arriba > 0 && window.innerWidth <= 700 ? "oculta" : "visible";
    registro();
    requestAnimationFrame(() => { aplicarCam(); subrayar(); });
  }

  window.escena = { ir, paso, final, set, configurar, total: ESC.length, actual: () => S.cur };

  /* ---------------- abierta sola: navegación propia ---------------- */
  ESC.forEach((sc, i) => {
    const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", `Escena ${i + 1}: ${sc.titulo}`);
    b.addEventListener("click", () => ir(i + 1)); $("#nav").appendChild(b);
  });
  document.addEventListener("keydown", (e) => {
    if (!SOLA) return;
    if (e.key === "ArrowRight" || e.key === " ") ir(Math.min(ESC.length, S.cur + 1));
    else if (e.key === "ArrowLeft") ir(Math.max(1, S.cur - 1));
    else if (e.key === "f") final(S.cur);
  });
  /* el tema llega después de cargar (atril inyecta <link>): al cargar cada hoja, re-medir lo que depende de la fuente */
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((nd) => {
    if (nd.tagName === "LINK") nd.addEventListener("load", () => { aplicarCam(); subrayar(); });
  }))).observe(document.head, { childList: true });

  /* arranque: sola abre la escena 1 animada; dentro de atril espera ir(1) del primer paso (deja la lámina en blanco) */
  const start = () => {
    if (SOLA) {
      const h = parseInt((location.hash.match(/^#(\d+)$/) || [])[1], 10);
      ir(h >= 1 && h <= ESC.length ? h : 1);
    } else { estadoPasos(1); aplicarFx({}); irCam(ESC[0].cam, true); }
    $("#escena").setAttribute("data-listo", "1");
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start, start); else start();
})();
