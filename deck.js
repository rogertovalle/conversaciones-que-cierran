/* closercat-pro-presentacion · motor
   - Lienzo 1920×1080 escalado; láminas <section class="slide">; pasos = elementos con data-b="k" (k ≥ 0).
   - La rueda vive en un iframe (rueda/index.html) que se mueve entre posiciones (data-rueda-pos en la lámina)
     y se talla en vivo con su propio contrato: data-rueda="ir:3" | "final:7" | "completa" | "set:conversacion:vision".
   - Navegación: → / espacio / clic = siguiente paso · ← = anterior · Inicio/Fin · f = pantalla completa · #n o #n.k
   - ?modo=evento oculta las láminas con data-modulo="clase".
   - Contrato atril-escena/v1: window.escena = { ir, paso, final, total, actual, configurar }. Dentro de atril los pasos
     de cada lámina avanzan solos (data-ritmo en ms, por defecto 2400). */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const EVENTO = params.get("modo") === "evento";
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const lienzo = $("#lienzo");
  let slides = $$(".slide");
  if (EVENTO) { slides.filter((s) => s.dataset.modulo === "clase").forEach((s) => s.remove()); slides = $$(".slide"); }
  const total = slides.length;
  const pasosDe = (s) => Math.max(0, ...$$("[data-b]", s).map((e) => +e.dataset.b || 0));

  /* ---------- escala ---------- */
  let reserva = { arriba: 0, abajo: 0 };
  function escalar() {
    const libre = Math.max(200, innerHeight - reserva.arriba - reserva.abajo);
    const k = Math.min(innerWidth / 1920, libre / 1080);
    const m = document.getElementById("marco");
    if (m) { m.style.top = reserva.arriba + "px"; m.style.bottom = reserva.abajo + "px"; }
    document.documentElement.style.setProperty("--k", k);
  }
  addEventListener("resize", escalar); escalar();

  /* ---------- rueda (por postMessage: funciona también por file://) ---------- */
  const rueda = $("#rueda");
  let ruedaLista = false, ruedaCmd = null, pendiente = null;
  addEventListener("message", (ev) => {
    if (ev.source !== rueda.contentWindow || !ev.data || ev.data.tipo !== "rueda-lista") return;
    try { rueda.contentWindow.postMessage({ tipo: "rueda-hola", ok: true }, "*"); } catch (e) {}
    if (ruedaLista) return;
    ruedaLista = true; rueda.classList.add("lista");
    if (pendiente) { const p = pendiente; pendiente = null; ordenRueda(p, true); }
  });
  /* por si la rueda avisó antes de que este motor escuchara: preguntarle hasta que conteste */
  (function hola(n) {
    if (ruedaLista || n > 200) return;
    try { rueda.contentWindow && rueda.contentWindow.postMessage({ tipo: "rueda-hola" }, "*"); } catch (e) {}
    setTimeout(() => hola(n + 1), 150);
  })(0);
  function ordenRueda(cmd, forzar) {
    if (!cmd) return;
    if (!ruedaLista) { pendiente = cmd; return; }
    if (cmd === ruedaCmd && !forzar) return;
    ruedaCmd = cmd;
    rueda.contentWindow.postMessage({ tipo: "rueda", cmd }, "*");
  }

  /* ---------- estado ---------- */
  let i = -1, k = 0, auto = null, enAtril = false;

  function aplicarPasos(s) {
    $$("[data-b]", s).forEach((el) => {
      const on = k >= (+el.dataset.b || 0);
      el.classList.toggle("on", on);
      if (el.dataset.atenua != null) el.classList.toggle("atenua", k >= +el.dataset.atenua);
      if (el.dataset.hasta != null && !el.classList.contains("contador")) el.classList.toggle("on", on && k <= +el.dataset.hasta);
      if (el.dataset.pasada != null) el.classList.toggle("pasada", k > +el.dataset.pasada);
      if (on && el.dataset.rueda && !el._rOk) { el._rOk = true; ordenRueda(el.dataset.rueda); }
      if (!on) el._rOk = false;
      if (on && el.classList.contains("contador") && !el._cOk) { el._cOk = true; contar(el); }
    });
  }
  function estilos(s) {
    $$("[data-estilos]", s).forEach((el) => {
      let m; try { m = JSON.parse(el.dataset.estilos); } catch { return; }
      const clave = Object.keys(m).map(Number).filter((x) => x <= k).sort((x, y) => y - x)[0];
      el.style.transform = clave != null ? m[clave] : "";
    });
  }
  function contar(el) {
    const hasta = +el.dataset.hasta || 0, dur = REDUCED ? 0 : 1600, t0 = performance.now();
    const fmt = (n) => Math.round(n).toLocaleString("es-CO");
    const tic = (t) => { const p = dur ? Math.min(1, (t - t0) / dur) : 1; el.textContent = fmt(hasta * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tic); };
    requestAnimationFrame(tic);
  }

  function mostrar(n, paso) {
    n = Math.max(0, Math.min(total - 1, n));
    const s = slides[n];
    if (n !== i) {
      slides.forEach((x, j) => { x.classList.toggle("activa", j === n); x.setAttribute("aria-hidden", j === n ? "false" : "true"); });
      $$("[data-b]", s).forEach((el) => { el._rOk = false; el._cOk = false; });
      i = n;
      lienzo.dataset.fondo = s.dataset.tema || "v";
      lienzo.classList.toggle("portada", s.dataset.portada != null);
      rueda.dataset.pos = s.dataset.ruedaPos || "";
      if (s.dataset.rueda) ordenRueda(s.dataset.rueda, true);
    }
    k = Math.max(0, Math.min(pasosDe(s), paso ?? 0));
    aplicarPasos(s);
    estilos(s);
    $("#m-num").textContent = `${n + 1} / ${total}`;
    $("#progreso").style.width = `${((n + (k + 1) / (pasosDe(s) + 1)) / total) * 100}%`;
    history.replaceState(null, "", `#${n + 1}${k ? "." + k : ""}`);
    if (enAtril) programarAuto(s);
  }
  function siguiente() { const s = slides[i]; if (k < pasosDe(s)) mostrar(i, k + 1); else if (i < total - 1) mostrar(i + 1, 0); }
  function anterior() { if (k > 0) mostrar(i, k - 1); else if (i > 0) mostrar(i - 1, pasosDe(slides[i - 1])); }

  function programarAuto(s) {
    clearTimeout(auto);
    if (k >= pasosDe(s)) return;
    auto = setTimeout(() => mostrar(i, k + 1), +(s.dataset.ritmo || 2400));
  }

  /* ---------- entradas ---------- */
  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (["ArrowRight", " ", "PageDown", "Enter"].includes(e.key)) { e.preventDefault(); siguiente(); }
    else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); anterior(); }
    else if (e.key === "Home") mostrar(0, 0);
    else if (e.key === "End") mostrar(total - 1, pasosDe(slides[total - 1]));
    else if (e.key === "f") (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.());
  });
  $("#marco").addEventListener("click", (e) => { if (e.target.closest("a,button")) return; (e.clientX < innerWidth * 0.25 ? anterior : siguiente)(); });
  let tx = null;
  addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  addEventListener("touchend", (e) => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) (dx < 0 ? siguiente : anterior)(); tx = null; });

  /* ---------- contrato atril-escena/v1 ---------- */
  window.escena = {
    total,
    actual: () => i + 1,
    ir: (n) => { mostrar((+n || 1) - 1, 0); return i + 1; },
    paso: (n, kk) => { mostrar((+n || 1) - 1, +kk || 0); return i + 1; },
    final: (n) => { const j = (+n || 1) - 1; mostrar(j, pasosDe(slides[Math.max(0, Math.min(total - 1, j))])); return i + 1; },
    configurar: (ctx) => {
      enAtril = true; document.documentElement.classList.add("en-atril");
      const r = (ctx && ctx.reserva) || {}; reserva = { arriba: +r.arriba || 0, abajo: +r.abajo || 0 }; escalar();
      if (i >= 0) programarAuto(slides[i]);
    },
  };
  if (window.parent !== window) { enAtril = true; document.documentElement.classList.add("en-atril"); }

  /* ---------- arranque ---------- */
  const h = (location.hash.match(/^#(\d+)(?:\.(\d+))?$/) || []);
  mostrar(h[1] ? +h[1] - 1 : 0, h[2] ? +h[2] : 0);
  document.documentElement.dataset.listo = "1";
  $("#lienzo").setAttribute("data-listo", "1");
})();
