/* ============================================================
   TEC TOQUE SEGURANÇA ELETRÔNICA — Interações
   ============================================================ */
(function () {
  "use strict";

  var CONFIG = {
    whatsapp: "5522999847120",
    instagram: "https://instagram.com/tectoque",
    waBase: "https://wa.me/5522999847120"
  };

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ---------- Ano no rodapé ---------- */
  function initYear() {
    var el = $("#year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Header ao rolar ---------- */
  function initHeader() {
    var header = $("#header");
    var toTop = $("#toTop");
    if (!header) return;

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle("is-scrolled", y > 24);
      if (toTop) toTop.classList.toggle("is-visible", y > 640);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
      });
    }
  }

  /* ---------- Menu mobile (drawer) ---------- */
  function initDrawer() {
    var drawer = $("#drawer");
    var toggle = $("#navToggle");
    var closeBtn = $("#drawerClose");
    var overlay = $("#drawerOverlay");
    if (!drawer || !toggle) return;

    function open() {
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
      var first = $("a, button", drawer);
      if (first) first.focus();
    }
    function close() {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
      toggle.focus();
    }

    toggle.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);
    $$("a", drawer).forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
    });
  }

  /* ---------- Reveal on scroll + stagger ---------- */
  function initReveal() {
    var groups = $$("[data-stagger]");
    groups.forEach(function (group) {
      var step = parseInt(group.getAttribute("data-stagger"), 10) || 90;
      $$(".reveal", group).forEach(function (el, i) {
        el.style.setProperty("--reveal-delay", i * step + "ms");
      });
    });

    var reveals = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Scrollspy (link ativo) ---------- */
  function initScrollSpy() {
    var links = $$('.nav a[href^="#"]');
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove("is-active");
            });
            var link = map[e.target.id];
            if (link) link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    Object.keys(map).forEach(function (id) {
      spy.observe(document.getElementById(id));
    });
  }

  /* ---------- Galeria: filtros ---------- */
  function initFilters() {
    var filters = $$(".filter");
    var shots = $$(".shot");
    if (!filters.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");
        filters.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");

        shots.forEach(function (shot) {
          var match = cat === "all" || shot.getAttribute("data-cat") === cat;
          shot.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  /* ---------- Galeria: lightbox ---------- */
  function initLightbox() {
    var lb = $("#lightbox");
    if (!lb) return;
    var lbImg = $("#lightboxImg");
    var lbTitle = $("#lightboxTitle");
    var lbDesc = $("#lightboxDesc");
    var btnPrev = $("#lbPrev");
    var btnNext = $("#lbNext");
    var btnClose = $("#lbClose");
    var lastFocus = null;
    var index = 0;
    var items = [];

    function collect() {
      items = $$(".shot").filter(function (s) {
        return !s.classList.contains("is-hidden");
      });
    }

    function render() {
      var shot = items[index];
      if (!shot) return;
      var img = $("img", shot);
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.getAttribute("alt") || "";
      lbTitle.textContent = shot.getAttribute("data-title") || "";
      lbDesc.textContent = shot.getAttribute("data-desc") || "";
      btnPrev.hidden = items.length <= 1;
      btnNext.hidden = items.length <= 1;
    }

    function open(shot) {
      collect();
      index = items.indexOf(shot);
      if (index < 0) index = 0;
      lastFocus = document.activeElement;
      render();
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      btnClose.focus();
    }

    function close() {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      if (lastFocus) lastFocus.focus();
    }

    function go(dir) {
      if (!items.length) return;
      index = (index + dir + items.length) % items.length;
      render();
    }

    $$(".shot").forEach(function (shot) {
      shot.setAttribute("tabindex", "0");
      shot.setAttribute("role", "button");
      shot.addEventListener("click", function () {
        open(shot);
      });
      shot.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(shot);
        }
      });
    });

    btnPrev.addEventListener("click", function () {
      go(-1);
    });
    btnNext.addEventListener("click", function () {
      go(1);
    });
    btnClose.addEventListener("click", close);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
  }

  /* ---------- Vídeos ---------- */
  function initVideos() {
    var cards = $$(".video-card");
    if (!cards.length) return;

    var demoUrl =
      CONFIG.waBase +
      "?text=" +
      encodeURIComponent(
        "Olá, Tec Toque! Gostaria de ver uma demonstração em vídeo dos equipamentos e sistemas."
      );

    cards.forEach(function (card) {
      var video = $(".video-card__player", card);
      var overlay = $(".video-card__overlay", card);
      var soon = $(".video-card__soon", card);
      if (!video) return;
      var sources = $$("source", video);

      function goLive() {
        if (card.dataset.state === "live") return;
        card.dataset.state = "live";
        card.classList.add("is-live");
        video.hidden = false;
        if (soon) soon.hidden = true;
      }
      function goSoon() {
        if (card.dataset.state === "live" || card.dataset.state === "soon") return;
        card.dataset.state = "soon";
        card.classList.add("is-soon");
        if (soon) soon.hidden = false;
      }

      if (!sources.length) {
        goSoon();
      } else {
        sources.forEach(function (s) {
          s.addEventListener("error", goSoon);
        });
        video.addEventListener("error", goSoon);
        video.addEventListener("loadedmetadata", goLive);
      }

      function activate() {
        if (card.classList.contains("is-live")) {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        } else {
          window.open(demoUrl, "_blank", "noopener,noreferrer");
        }
      }
      if (overlay) overlay.addEventListener("click", activate);

      video.addEventListener("play", function () {
        card.classList.add("is-playing");
      });
      video.addEventListener("pause", function () {
        card.classList.remove("is-playing");
      });

      window.setTimeout(function () {
        if (card.dataset.state) return;
        if (video.networkState === 3 || video.readyState === 0) goSoon();
      }, 3000);
    });
  }

  /* ---------- Formulário → WhatsApp ---------- */
  function initForm() {
    var form = $("#quoteForm");
    if (!form) return;
    var ok = $("#formOk");

    var tel = $("#phone");
    if (tel) {
      tel.addEventListener("input", function () {
        var v = tel.value.replace(/\D/g, "").slice(0, 11);
        var out = v;
        if (v.length > 2) out = "(" + v.slice(0, 2) + ") " + v.slice(2);
        if (v.length > 7) out = "(" + v.slice(0, 2) + ") " + v.slice(2, 7) + "-" + v.slice(7);
        tel.value = out;
      });
    }

    function setError(name, has) {
      var field = form.querySelector('[data-field="' + name + '"]');
      if (field) field.classList.toggle("has-error", has);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = $("#name").value.trim();
      var telefone = $("#phone").value.trim();
      var servico = $("#service").value;
      var mensagem = $("#message").value.trim();

      var telDigits = telefone.replace(/\D/g, "");
      var valid = true;

      if (nome.length < 2) {
        setError("name", true);
        valid = false;
      } else {
        setError("name", false);
      }

      if (telDigits.length < 10) {
        setError("phone", true);
        valid = false;
      } else {
        setError("phone", false);
      }

      if (!servico) {
        setError("service", true);
        valid = false;
      } else {
        setError("service", false);
      }

      if (!valid) {
        var firstError = form.querySelector(".field.has-error input, .field.has-error select");
        if (firstError) firstError.focus();
        return;
      }

      var text =
        "Olá, Tec Toque! Vim pelo site e gostaria de solicitar um orçamento.\n\n" +
        "Nome: " +
        nome +
        "\n" +
        "Telefone: " +
        telefone +
        "\n" +
        "Serviço de interesse: " +
        servico +
        (mensagem ? "\nMensagem: " + mensagem : "");

      var url = CONFIG.waBase + "?text=" + encodeURIComponent(text);

      if (ok) ok.classList.add("is-visible");
      window.open(url, "_blank", "noopener,noreferrer");
      form.reset();
    });

    form.addEventListener("input", function (e) {
      var field = e.target.closest(".field");
      if (field) field.classList.remove("has-error");
    });
  }

  /* ---------- Links de WhatsApp dinâmicos ---------- */
  function initWaLinks() {
    var msg =
      "Olá, Tec Toque! Vim pelo site e gostaria de falar sobre segurança eletrônica.";
    var url = CONFIG.waBase + "?text=" + encodeURIComponent(msg);
    $$("[data-wa]").forEach(function (el) {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ---------- Barra de progresso de rolagem ---------- */
  function initProgress() {
    var bar = $("#progressBar");
    if (!bar) return;
    function update() {
      var el = document.documentElement;
      var max = el.scrollHeight - el.clientHeight;
      var top = el.scrollTop || document.body.scrollTop || 0;
      bar.style.width = (max > 0 ? (top / max) * 100 : 0) + "%";
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------- Cards de serviço → WhatsApp ---------- */
  function initServiceLinks() {
    var base = "Olá, Tec Toque! Vim pelo site e gostaria de saber mais sobre: ";
    $$("[data-service-link]").forEach(function (link) {
      var card = link.closest(".service");
      var title = card ? card.querySelector("h3") : null;
      var name = title ? title.textContent.trim() : "";
      if (!name) return;
      var text = base + name + ".";
      link.setAttribute("href", CONFIG.waBase + "?text=" + encodeURIComponent(text));
      link.setAttribute("aria-label", "Falar no WhatsApp sobre " + name);
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initYear();
    initHeader();
    initProgress();
    initDrawer();
    initReveal();
    initScrollSpy();
    initFilters();
    initLightbox();
    initVideos();
    initForm();
    initWaLinks();
    initServiceLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
