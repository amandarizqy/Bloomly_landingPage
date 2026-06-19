/* =========================================================
   BLOOMLY — Landing Page Script
   1) Generative flower icon system (no external images)
   2) Header / mobile nav / back-to-top behaviour
   3) FAQ accordion
   4) Market ticker content
   5) Scroll reveal animations
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1) FLOWER ICON GENERATOR
     Produces a small flat-illustration flower as inline SVG,
     built from rotated petal ellipses around a center dot —
     echoes the Bloomly logo mark, kept consistent across the
     whole page so every flower "feels" hand drawn for the brand.
  --------------------------------------------------------- */
  function petalRing(cx, cy, size, count, len, width, color, offsetDeg, stroke) {
    const rx = (size * width) / 2;
    const ry = (size * len) / 2;
    let out = "";
    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i + offsetDeg;
      const strokeAttr = stroke ? ` stroke="${stroke}" stroke-width="${size * 0.012}"` : "";
      out += `<ellipse cx="${cx}" cy="${cy - ry * 0.6}" rx="${rx}" ry="${ry}" fill="${color}" opacity="0.96" transform="rotate(${angle} ${cx} ${cy})"${strokeAttr}/>`;
    }
    return out;
  }

  function flowerSVG(cfg) {
    const size = 120;
    const cx = size / 2, cy = size / 2;
    let petals = petalRing(cx, cy, size, cfg.petals, cfg.petalH, cfg.petalW, cfg.petalColor, 0, cfg.stroke);
    if (cfg.rings === 2) {
      petals += petalRing(
        cx, cy, size,
        Math.max(3, Math.round(cfg.petals * 0.7)),
        cfg.petalH * 0.68, cfg.petalW * 0.92,
        cfg.petalColor2 || cfg.petalColor,
        (360 / cfg.petals) / 2,
        cfg.stroke
      );
    }
    const centerR = size * 0.115;
    return `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" role="img" aria-label="Ilustrasi bunga"><g>${petals}<circle cx="${cx}" cy="${cy}" r="${centerR}" fill="${cfg.centerColor}"/></g></svg>`;
  }

  function babyBreathSVG() {
    const size = 120;
    const cx = 60, cy = 60;
    const branches = [
      [60, 60], [40, 44], [78, 40], [30, 70], [88, 68],
      [52, 30], [70, 88], [38, 92], [90, 92], [60, 20]
    ];
    let dots = "";
    branches.forEach(([x, y], i) => {
      const r = i === 0 ? 7 : 4 + (i % 3);
      dots += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#BFD9C2" stroke-width="1.4" opacity=".7"/>`;
      dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFDF9" stroke="#E7D9C7" stroke-width="1.2"/>`;
    });
    return `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" role="img" aria-label="Ilustrasi baby breath"><g>${dots}</g></svg>`;
  }

  function logoSVG() {
    // Simple tulip-like glyph in a soft circle — matches the Bloomly app icon.
    return `<svg viewBox="0 0 40 40" width="100%" height="100%" role="img" aria-label="Logo Bloomly">
      <circle cx="20" cy="20" r="20" fill="#7D3C58"/>
      <path d="M20 10c2.4 0 4 2 4 4.4 0 1.3-.5 2.5-1.4 3.5 1.1-.5 2.4-.7 3.6-.4 2.3.5 3.7 2.5 3.4 4.7-.3 2.2-2.4 3.7-4.6 3.3-1.2-.2-2.3-1-3-2 .3 1.3.3 2.6-.1 3.8-.7 2.1-2.9 3.3-5 2.7-2.1-.6-3.2-2.9-2.5-5 .4-1.1 1.3-2 2.3-2.5-1.2.3-2.5.3-3.6-.2-2-1-2.9-3.4-1.8-5.4 1-2 3.4-2.8 5.4-1.8 1.1.5 1.9 1.5 2.3 2.6-.2-1.2-.1-2.5.5-3.6.8-1.4 2.2-2.1 3.5-2.1z" fill="#FDF1EC"/>
    </svg>`;
  }

  const FLOWER_CONFIG = {
    rose:      { petals: 8,  petalColor: "#9B3B53", petalColor2: "#7D3C58", rings: 2, centerColor: "#3A1F2C", petalW: 0.42, petalH: 0.58 },
    tulip:     { petals: 5,  petalColor: "#E8829A", centerColor: "#D9A441", petalW: 0.36, petalH: 0.66 },
    lily:      { petals: 6,  petalColor: "#F7C3CE", centerColor: "#D9A441", petalW: 0.24, petalH: 0.8, stroke: "#E89DB0" },
    anggrek:   { petals: 5,  petalColor: "#C9A3D6", petalColor2: "#C2487A", rings: 2, centerColor: "#7D3C58", petalW: 0.4, petalH: 0.6 },
    gerbera:   { petals: 14, petalColor: "#C24B5E", centerColor: "#2A2126", petalW: 0.14, petalH: 0.72 },
    carnation: { petals: 16, petalColor: "#F2A6B8", petalColor2: "#E8829A", rings: 2, centerColor: "#9B3B53", petalW: 0.18, petalH: 0.5 },
    sunflower: { petals: 16, petalColor: "#E8B23D", centerColor: "#4A2E1A", petalW: 0.16, petalH: 0.66 }
  };

  function renderFlowers() {
    document.querySelectorAll("[data-flower]").forEach((el) => {
      const key = el.getAttribute("data-flower");
      if (key === "logo") { el.innerHTML = logoSVG(); return; }
      if (key === "babybreath") { el.innerHTML = babyBreathSVG(); return; }
      const cfg = FLOWER_CONFIG[key];
      if (cfg) el.innerHTML = flowerSVG(cfg);
    });
  }

  /* ---------------------------------------------------------
     2) MARKET TICKER CONTENT
  --------------------------------------------------------- */
  const TICKER_ITEMS = [
    { name: "Mawar Merah",   price: "Rp150rb / ikat",     status: "ok",  label: "Tersedia" },
    { name: "Pink Lily",     price: "Rp170rb / 5 tangkai", status: "ok",  label: "Tersedia" },
    { name: "Anggrek Putih", price: "Rp85rb / ikat",      status: "low", label: "Stok Menipis" },
    { name: "Gerbera Merah", price: "Rp90rb / 3 tangkai", status: "ok",  label: "Tersedia" },
    { name: "Baby Breath",   price: "Rp85rb / buket",     status: "ok",  label: "Tersedia" },
    { name: "Carnation Pink",price: "Rp300rb / ikat",     status: "ok",  label: "Tersedia" },
    { name: "Tulip Kuning",  price: "Rp210rb / 5 tangkai", status: "pre", label: "Pre-order" },
    { name: "Bunga Matahari",price: "Rp150rb / 3 tangkai", status: "out", label: "Habis" }
  ];

  function buildTicker() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;
    const itemHTML = TICKER_ITEMS.map(
      (it) => `<div class="ticker-item" role="listitem">
        <span class="ticker-name">${it.name}</span>
        <span class="ticker-price">${it.price}</span>
        <span class="ticker-status ticker-status--${it.status}"><span class="dot"></span>${it.label}</span>
      </div>`
    ).join("");
    // duplicate content once for a seamless -50% translate loop
    track.innerHTML = itemHTML + itemHTML;
  }

  /* ---------------------------------------------------------
     3) HEADER / MOBILE NAV / BACK TO TOP
  --------------------------------------------------------- */
  function setupChrome() {
    const header = document.getElementById("siteHeader");
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");
    const backToTop = document.getElementById("backToTop");

    function onScroll() {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 8);
      backToTop.classList.toggle("visible", y > 600);
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    hamburger.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(open));
    });
    navMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      })
    );

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     4) FAQ ACCORDION
  --------------------------------------------------------- */
  function setupFAQ() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const btn = item.querySelector(".faq-q");
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove("open");
            openItem.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          }
        });
        item.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* ---------------------------------------------------------
     5) SCROLL REVEAL
  --------------------------------------------------------- */
  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !items.length) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderFlowers();
    buildTicker();
    setupChrome();
    setupFAQ();
    setupReveal();
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();