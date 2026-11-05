/* Puente de la rueda: la presentación le habla por postMessage (funciona también abriendo por file://, donde el
   navegador no deja tocar el documento del iframe). Incrustada: aplica su tema, se ve transparente y obedece órdenes.
   Órdenes: "ir:n" · "final:n" · "paso:n:k" · "set:param:valor" · "completa". Responde {tipo:"rueda-lista"}. */
(function () {
  "use strict";
  if (window.parent === window) return;
  const d = document;
  const link = (href) => { const l = d.createElement("link"); l.rel = "stylesheet"; l.href = href; d.head.appendChild(l); };
  link("../fonts/fonts.css");
  link("tema.css");
  const st = d.createElement("style");
  st.textContent = `
    .cab,.pie,#nav{display:none!important}
    #escena{padding:0!important}
    html,body{background:transparent!important}
    body.foco .fin{opacity:.42!important}
    body.foco .wash.fin{fill-opacity:.05!important}
    body.foco .wash-dm.fin{opacity:.32!important}`;
  d.head.appendChild(st);

  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function orden(cmd) {
    const e = window.escena; if (!e || !cmd) return;
    const [op, a, b] = String(cmd).split(":");
    try {
      if (op === "ir") e.ir(+a);
      else if (op === "final") e.final(+a);
      else if (op === "paso") e.paso(+a, +b);
      else if (op === "set") e.set(a, b);
      else if (op === "completa") {
        e.final(7);
        d.body.classList.remove("foco");
        d.querySelectorAll(".pbanda").forEach((x) => x.setAttribute("opacity", 0));
        d.querySelector("#g-pir")?.classList.remove("cumbre-invertida");
        d.querySelector("#nivel-etq")?.classList.remove("on");
        setTimeout(() => d.querySelector("#lamina")?.setAttribute("viewBox", "592 221 1000 1000"), REDUCED ? 0 : 1400);
      }
    } catch (err) { console.warn("rueda:", cmd, err); }
  }
  const lista = () => !!(window.escena && d.querySelector("#escena[data-listo]"));
  let confirmada = false;
  addEventListener("message", (ev) => {
    const m = ev.data; if (!m) return;
    if (m.tipo === "rueda" && m.cmd) { confirmada = true; orden(m.cmd); }
    else if (m.tipo === "rueda-hola") { if (m.ok) confirmada = true; if (lista()) parent.postMessage({ tipo: "rueda-lista" }, "*"); }
  });
  /* avisa hasta que la presentación confirme (si el motor aún no escuchaba, el aviso no se pierde) */
  (function avisar(n) {
    if (confirmada || n > 300) return;
    if (lista()) parent.postMessage({ tipo: "rueda-lista" }, "*");
    setTimeout(() => avisar(n + 1), lista() ? 400 : 100);
  })(0);
})();
