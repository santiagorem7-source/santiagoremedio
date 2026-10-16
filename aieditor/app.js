(function () {
  var C = window.AIE || {};
  var vacio = function (v) { return !v || /PEGA|^\s*$/.test(v); };

  // Precio
  document.querySelectorAll(".js-price").forEach(function (el) { el.textContent = C.precio || "20"; });
  var antes = document.querySelector(".js-before");
  if (antes && !vacio(C.precioAntes)) { antes.textContent = "$" + C.precioAntes; antes.hidden = false; }
  document.querySelectorAll(".js-year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Botón de compra principal → Stripe
  document.querySelectorAll(".js-buy-main").forEach(function (a) {
    if (!vacio(C.stripe)) { a.href = C.stripe; a.rel = "noopener"; }
    a.addEventListener("click", function () {
      if (window.fbq) fbq("track", "InitiateCheckout", { value: Number(C.precio || 20), currency: "USD" });
      if (window.gtag) gtag("event", "begin_checkout");
    });
  });

  // Página de gracias: descarga y puente a Cardinal
  document.querySelectorAll(".js-download").forEach(function (a) {
    if (!vacio(C.descarga)) { a.href = C.descarga; a.target = "_blank"; a.rel = "noopener"; }
  });
  document.querySelectorAll(".js-community").forEach(function (box) {
    var link = box.querySelector("a");
    if (vacio(C.comunidad)) { box.remove(); } else if (link) { link.href = C.comunidad; }
  });

  // Guías: se pintan desde config en todos los lugares donde se listan
  function pintarGuias(cont) {
    if (!cont || !C.guias || !C.guias.length) return;
    cont.innerHTML = "";
    C.guias.forEach(function (g) {
      var a = document.createElement("a");
      a.className = "guide-link";
      a.href = g.u; a.target = "_blank"; a.rel = "noopener";
      a.appendChild(document.createTextNode(g.t));
      var s = document.createElement("span"); s.textContent = "Abrir guía ↗";
      a.appendChild(s);
      cont.appendChild(a);
    });
  }
  document.querySelectorAll(".js-guide-links-static").forEach(pintarGuias);

  // Aviso solo para Santi cuando falta pegar links (no aparece si están completos)
  var local = location.protocol === "file:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var faltan = [];
  if (vacio(C.stripe) && document.querySelector(".js-buy-main")) faltan.push("link de Stripe");
  if (vacio(C.descarga) && document.querySelector(".js-download")) faltan.push("link de descarga");
  if (local && faltan.length) {
    var n = document.createElement("div");
    n.textContent = "Falta pegar en config.js: " + faltan.join(" y ");
    n.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:200;padding:10px 14px;border-radius:12px;background:#9b92d4;color:#000;font:500 13px/1.3 Inter,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.5)";
    document.body.appendChild(n);
  }

  // Aparecer al hacer scroll
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = Math.min((i % 4) * 70, 210) + "ms";
      io.observe(el);
    });
  }

  // Videos: se reproducen solo cuando se ven
  var vids = Array.prototype.slice.call(document.querySelectorAll(".js-vid"));
  if ("IntersectionObserver" in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { vo.observe(v); });
  }

  // Sonido: solo uno a la vez
  function setSound(btn, on) {
    var v = btn.parentElement.querySelector("video");
    v.muted = !on;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.textContent = on ? "Sonido on" : "Sonido off";
  }
  document.querySelectorAll(".js-sound").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var on = btn.getAttribute("aria-pressed") !== "true";
      document.querySelectorAll(".js-sound").forEach(function (b) { if (b !== btn) setSound(b, false); });
      setSound(btn, on);
      var v = btn.parentElement.querySelector("video");
      if (on) { if (v.currentTime > 1 && v.dataset.restarted !== "1") { v.currentTime = 0; v.dataset.restarted = "1"; } var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    });
  });

  // Pestañas de estilos
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  var scVideo = document.querySelector(".js-sc-video");
  function q(sel) { return document.querySelector(sel); }
  function selectTab(i) {
    var t = tabs[i];
    tabs.forEach(function (b, k) { b.setAttribute("aria-selected", k === i ? "true" : "false"); b.tabIndex = k === i ? 0 : -1; });
    q(".js-sc-n").textContent = String(i + 1).padStart(2, "0") + " / " + String(tabs.length).padStart(2, "0");
    q(".js-sc-title").textContent = t.dataset.title;
    q(".js-sc-desc").textContent = t.dataset.desc;
    q(".js-sc-ritmo").textContent = t.dataset.ritmo;
    q(".js-sc-texto").textContent = t.dataset.texto;
    if (!scVideo) return;
    var sb = scVideo.parentElement.querySelector(".js-sound");
    var conSonido = sb && sb.getAttribute("aria-pressed") === "true";
    scVideo.classList.add("swap");
    setTimeout(function () {
      scVideo.poster = t.dataset.poster;
      scVideo.src = t.dataset.src;
      scVideo.dataset.restarted = "1";
      scVideo.muted = !conSonido;
      var p = scVideo.play(); if (p && p.catch) p.catch(function () {});
      scVideo.classList.remove("swap");
    }, 180);
  }
  tabs.forEach(function (b, i) {
    b.addEventListener("click", function () { selectTab(i); });
    b.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = (i + d + tabs.length) % tabs.length;
      tabs[n].focus(); selectTab(n);
    });
  });

  // Tocar el video también activa el sonido
  vids.forEach(function (v) {
    v.style.cursor = "pointer";
    v.addEventListener("click", function () {
      var b = v.parentElement.querySelector(".js-sound");
      if (b) b.click();
    });
  });

  // ------------------------------------------------------------
  // Guías gratis a cambio del mail: el mismo formulario vive en el
  // bloque del final y en el popup. Cae en la planilla con su origen.
  // ------------------------------------------------------------
  var KEY = "aie_lead";
  function leer() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var mailsOk = !vacio(C.mails);

  function armarForm(form) {
    var caja = form.parentElement;
    var input = form.querySelector('input[type="email"]');
    var btn = form.querySelector("button");
    var err = caja.querySelector(".js-guide-err");
    var ok = caja.querySelector(".js-guide-ok");
    var fine = caja.querySelector(".js-guide-fine");
    var btnHTML = btn.innerHTML;
    pintarGuias(caja.querySelector(".js-guide-links"));

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (err) err.hidden = true;
      if (form.querySelector('[name="_gotcha"]').value) return;
      var email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { if (err) { err.textContent = "Revisá el email, parece que falta algo."; err.hidden = false; } input.focus(); return; }
      btn.disabled = true;
      btn.textContent = "Enviando...";
      // text/plain evita el preflight CORS (compatible con Google Apps Script)
      fetch(C.mails, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ email: email, phone: "", source: form.dataset.source || "aieditor", url: location.href })
      }).then(function () {
        guardar("ok");
        form.hidden = true;
        if (fine) fine.hidden = true;
        if (ok) ok.hidden = false;
        if (window.fbq) fbq("track", "Lead");
        if (window.gtag) gtag("event", "generate_lead");
      }).catch(function () {
        btn.disabled = false;
        btn.innerHTML = btnHTML;
        if (err) { err.textContent = "No se pudo enviar. Probá de nuevo."; err.hidden = false; }
      });
    });
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll(".js-guide-form"));
  if (mailsOk) forms.forEach(armarForm);
  else document.querySelectorAll(".js-capture, #lead").forEach(function (el) { el.remove(); });

  // Popup: solo cuando la persona se está yendo. En compu, al llevar el
  // cursor fuera de la página. En celular, al volver hacia arriba después
  // de haber leído más de la mitad. Nunca mientras mira el precio, nunca
  // antes de los 8 segundos, y una sola vez cada 7 días.
  var lead = document.getElementById("lead");
  if (lead && mailsOk) (function () {
    var DIAS = 7, MIN_MS = 8000;
    var prev = leer();
    if (prev === "ok") { lead.remove(); return; }
    if (prev && Date.now() - Number(prev) < DIAS * 864e5) { lead.remove(); return; }

    var lastFocus = null;
    var t0 = Date.now(), shown = false, precioVisible = false;
    var precio = document.getElementById("precio");
    if (precio && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { precioVisible = es[0].isIntersecting; }, { threshold: 0.25 }).observe(precio);
    }
    var fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var input = lead.querySelector('input[type="email"]');

    function show() {
      if (shown) return;
      if (Date.now() - t0 < MIN_MS) return;
      if (precioVisible) return;
      var capture = document.querySelector(".js-capture");
      if (capture) {
        var r = capture.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) return; // ya está viendo el bloque de guías
      }
      shown = true;
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onExit);
      lastFocus = document.activeElement;
      lead.hidden = false;
      document.documentElement.style.overflow = "hidden";
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        lead.classList.add("on");
        if (fino) input.focus({ preventScroll: true });
        else lead.querySelector(".lead-x").focus({ preventScroll: true });
      }); });
    }
    function hide() {
      lead.classList.remove("on");
      document.documentElement.style.overflow = "";
      setTimeout(function () { lead.hidden = true; }, 420);
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      document.removeEventListener("keydown", onKey);
    }

    // Celular: intención de salida = subir más de 350px seguidos después de pasar la mitad
    var maxDepth = 0, lastY = window.scrollY, subida = 0;
    function onScroll() {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      maxDepth = Math.max(maxDepth, y / max);
      if (y < lastY) subida += lastY - y; else subida = 0;
      lastY = y;
      if (!fino && maxDepth >= 0.5 && subida >= 350) show();
    }
    function onExit(e) { if (!e.relatedTarget && e.clientY <= 0) show(); }
    function onKey(e) { if (e.key === "Escape" && shown) cerrar(); }
    function cerrar() { guardar(String(Date.now())); hide(); }

    window.addEventListener("scroll", onScroll, { passive: true });
    if (fino) document.addEventListener("mouseout", onExit);
    document.addEventListener("keydown", onKey);
    lead.querySelector(".lead-x").addEventListener("click", cerrar);
    lead.querySelector(".lead-bg").addEventListener("click", cerrar);
    // el foco con Tab queda dentro del box mientras está abierto
    lead.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = Array.prototype.filter.call(lead.querySelectorAll("button, input:not(.lead-hp), a"), function (el) { return el.offsetParent !== null && !el.disabled; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  })();
})();
