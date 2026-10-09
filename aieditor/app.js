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
  });

  // Página de gracias: descarga y comunidad
  document.querySelectorAll(".js-download").forEach(function (a) {
    if (!vacio(C.descarga)) { a.href = C.descarga; a.target = "_blank"; a.rel = "noopener"; }
  });
  document.querySelectorAll(".js-community").forEach(function (box) {
    var link = box.querySelector("a");
    if (vacio(C.comunidad)) { box.remove(); } else if (link) { link.href = C.comunidad; }
  });

  // Aviso solo para Santi cuando falta pegar links (no aparece si están completos)
  var local = location.protocol === "file:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var faltan = [];
  if (vacio(C.stripe) && document.querySelector(".js-buy-main")) faltan.push("link de Stripe");
  if (vacio(C.descarga) && document.querySelector(".js-download")) faltan.push("link de descarga");
  if (local && faltan.length) {
    var n = document.createElement("div");
    n.textContent = "Falta pegar en config.js: " + faltan.join(" y ");
    n.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:200;padding:10px 14px;border-radius:12px;background:#9b92d4;color:#12110d;font:500 13px/1.3 Inter,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.5)";
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
})();
