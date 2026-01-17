(function () {
  const cfg = window.SITE_CONFIG || {};
  const $ = (s) => document.querySelector(s);

  // ===== Fill hero =====
  $("#heroTitle").textContent = cfg.coupleName || "ELENA E ALESSIO";
  $("#heroSub").textContent = cfg.heroSubtitle || "si sposano!";
  $("#heroDate").textContent = cfg.weddingDateDisplay || "30 MAGGIO 2026 • ORE 11:00";
  $("#topbarTitle").textContent = "Elena & Alessio";

  // ===== Fill logistics =====
  $("#churchLabel").textContent = cfg.church?.label || "Chiesa della Madonna del Soccorso, Corchiano (VT)";
  $("#churchLink").href = cfg.church?.mapsUrl || "#";

  $("#receptionHuman").textContent = cfg.reception?.coordsHuman || `42°20'13.9"N 12°24'11.6"E`;
  $("#receptionDec").textContent = cfg.reception?.coordsDecimal || "42.337194,12.403222";
  $("#receptionLink").href = cfg.reception?.mapsUrl || "#";

  // ===== Map embeds =====
  // Church: embed via query (since we have a label link, not coordinates)
  const churchQuery = encodeURIComponent(cfg.church?.label || "Chiesa della Madonna del Soccorso, Corchiano (VT)");
  $("#churchMapIframe").src = `https://www.google.com/maps?q=${churchQuery}&z=14&output=embed`;

  // Reception: embed via decimal coords
  const recDec = (cfg.reception?.coordsDecimal || "42.337194,12.403222").replace(/\s+/g, "");
  $("#receptionMapIframe").src = `https://www.google.com/maps?q=${encodeURIComponent(recDec)}&z=14&output=embed`;

  // ===== Year =====
  $("#year").textContent = String(new Date().getFullYear());

  // ===== Smooth scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });

  // ===== Mobile drawer =====
  const hamburger = $("#hamburger");
  const drawer = $("#mobileDrawer");
  const drawerClose = $("#drawerClose");
  const drawerBackdrop = $("#drawerBackdrop");

  function openDrawer() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger?.addEventListener("click", () => {
    drawer.classList.contains("open") ? closeDrawer() : openDrawer();
  });
  drawerClose?.addEventListener("click", closeDrawer);
  drawerBackdrop?.addEventListener("click", closeDrawer);
  document.querySelectorAll(".drawer-link").forEach(a => a.addEventListener("click", closeDrawer));

  // ===== Countdown =====
  const target = new Date(cfg.weddingDateISO || "2026-05-30T11:00:00+02:00").getTime();
  const cdDays = $("#cdDays"), cdHours = $("#cdHours"), cdMins = $("#cdMins"), cdSecs = $("#cdSecs");
  const pad2 = (n) => String(n).padStart(2, "0");

  function tick() {
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    const secs = Math.floor(diff / 1000);

    cdDays.textContent = String(days);
    cdHours.textContent = pad2(hours);
    cdMins.textContent = pad2(mins);
    cdSecs.textContent = pad2(secs);
  }
  tick();
  setInterval(tick, 1000);

  // ===== Hero media =====
  // Mobile: slideshow. Desktop: collage built dynamically from the same images.
  const slidesWrap = $("#heroSlides");
  const collageWrap = $("#heroCollage");
  const imgs = (cfg.slideshowImages || []).filter(Boolean);

  const mqMobile = window.matchMedia("(max-width: 980px)");
  let slideTimer = null;

  const placeholderBg =
    "linear-gradient(135deg, rgba(255,255,255,.12), rgba(0,0,0,.35)), radial-gradient(circle at 30% 20%, rgba(255,255,255,.14), transparent 60%)";

  function clearEl(el) {
    if (!el) return;
    el.innerHTML = "";
  }

  function addSlide(src, active) {
    const d = document.createElement("div");
    d.className = "hero-slide" + (active ? " active" : "");
    d.style.backgroundImage = src ? `url("${src}")` : placeholderBg;
    slidesWrap.appendChild(d);
  }

  function buildSlideshow() {
    if (!slidesWrap) return null;
    clearEl(slidesWrap);

    if (imgs.length === 0) {
      addSlide("", true);
      return null;
    }

    imgs.forEach((src, i) => addSlide(src, i === 0));
    const slides = Array.from(slidesWrap.querySelectorAll(".hero-slide"));

    if (slides.length <= 1) return null;

    let idx = 0;
    return window.setInterval(() => {
      slides[idx].classList.remove("active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("active");
    }, 6500);
  }

  function setRect(el, colStart, colSpan, rowStart, rowSpan) {
    el.style.gridColumn = `${colStart} / span ${colSpan}`;
    el.style.gridRow = `${rowStart} / span ${rowSpan}`;
  }

  function buildCollage() {
    if (!collageWrap) return;
    clearEl(collageWrap);

    if (imgs.length === 0) {
      const d = document.createElement("div");
      d.className = "hero-collage-item";
      d.style.backgroundImage = placeholderBg;
      setRect(d, 1, 12, 1, 12);
      collageWrap.appendChild(d);
      return;
    }

    const n = Math.min(imgs.length, 9);

    for (let i = 0; i < n; i++) {
      const src = imgs[i];
      const d = document.createElement("div");
      d.className = "hero-collage-item";
      d.style.backgroundImage = `url("${src}")`;

      // Layout presets (12x12 grid). Good for vertical photos.
      if (n === 1) {
        setRect(d, 1, 12, 1, 12);
      } else if (n === 2) {
        setRect(d, i === 0 ? 1 : 7, 6, 1, 12);
      } else if (n === 3) {
        if (i === 0) setRect(d, 1, 6, 1, 12);
        if (i === 1) setRect(d, 7, 6, 1, 6);
        if (i === 2) setRect(d, 7, 6, 7, 6);
      } else if (n === 4) {
        // 2x2
        const col = (i % 2 === 0) ? 1 : 7;
        const row = (i < 2) ? 1 : 7;
        setRect(d, col, 6, row, 6);
      } else if (n === 5) {
        // Big center + 4 corners
        if (i === 0) setRect(d, 4, 6, 1, 12);
        if (i === 1) setRect(d, 1, 3, 1, 6);
        if (i === 2) setRect(d, 1, 3, 7, 6);
        if (i === 3) setRect(d, 10, 3, 1, 6);
        if (i === 4) setRect(d, 10, 3, 7, 6);
      } else if (n === 6) {
        // 3 columns, 2 rows
        const colStarts = [1, 5, 9];
        const col = colStarts[i % 3];
        const row = (i < 3) ? 1 : 7;
        setRect(d, col, 4, row, 6);
      } else {
        // 7-9 images: 3x3 tiles
        const colStarts = [1, 5, 9];
        const rowStarts = [1, 5, 9];
        const col = colStarts[i % 3];
        const row = rowStarts[Math.floor(i / 3)];
        setRect(d, col, 4, row, 4);
      }

      collageWrap.appendChild(d);
    }
  }

  function renderHeroMedia() {
    // Stop any previous slideshow timer
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }

    if (mqMobile.matches) {
      // Mobile -> slideshow
      if (collageWrap) clearEl(collageWrap);
      slideTimer = buildSlideshow();
    } else {
      // Desktop -> collage
      if (slidesWrap) clearEl(slidesWrap);
      buildCollage();
    }
  }

  renderHeroMedia();
  if (mqMobile.addEventListener) mqMobile.addEventListener("change", renderHeroMedia);
  else mqMobile.addListener(renderHeroMedia);

// ===== Copy toasts =====
  const showToast = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 1400);
  };

  // Copy coords
  $("#copyCoords")?.addEventListener("click", async () => {
    const val = cfg.reception?.coordsDecimal || "42.337194,12.403222";
    try {
      await navigator.clipboard.writeText(val);
      showToast("coordsToast");
    } catch {
      const t = document.createElement("textarea");
      t.value = val;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
      showToast("coordsToast");
    }
  });

  // Copy IBAN
  $("#copyIban")?.addEventListener("click", async () => {
    const val = ($("#ibanText")?.textContent || "").trim();
    try {
      await navigator.clipboard.writeText(val);
      showToast("ibanToast");
    } catch {
      const t = document.createElement("textarea");
      t.value = val;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
      showToast("ibanToast");
    }
  });

  // ===== Cloudinary upload (uses your config values) =====
  const uploadBtn = $("#uploadBtn");
  const uploadStatus = $("#uploadStatus");
  const gallery = $("#gallery");

  function cfgOk() {
    return !!(cfg.cloudinary?.cloudName && cfg.cloudinary?.uploadPreset);
  }
  function setStatus(msg) {
    if (uploadStatus) uploadStatus.textContent = msg || "";
  }
  function addThumb(url) {
    if (!gallery) return;
    const wrap = document.createElement("div");
    wrap.className = "thumb";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = "Foto caricata";
    img.src = url;
    wrap.appendChild(img);
    gallery.prepend(wrap);
  }

  uploadBtn?.addEventListener("click", () => {
    if (!cfgOk()) {
      setStatus("Configura Cloudinary in config.js (cloudName + uploadPreset).");
      return;
    }
    setStatus("");

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cfg.cloudinary.cloudName,
        uploadPreset: cfg.cloudinary.uploadPreset,
        folder: cfg.cloudinary.folder,
        tags: cfg.cloudinary.tags,
        multiple: true,
        maxFileSize: cfg.cloudinary.maxFileSizeBytes,
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "heic", "heif"],
        sources: ["local", "camera", "google_drive", "dropbox"],
        cropping: false,
        showAdvancedOptions: false,
      },
      (error, result) => {
        if (error) {
          setStatus("Errore upload. Riprova.");
          return;
        }
        if (result && result.event === "success") {
          setStatus("Caricamento completato ✅");
          if (result.info?.secure_url) addThumb(result.info.secure_url);
        }
        if (result && result.event === "close") {
          setTimeout(() => setStatus(""), 1200);
        }
      }
    );
    widget.open();
  });

  // ===== RSVP (GitHub Pages is static — needs an external endpoint) =====
  // Default: Formspree (custom-looking form). If you want Google Form instead, see notes below.
  const rsvpForm = $("#rsvpForm");
  const rsvpStatus = $("#rsvpStatus");

  // Add this to config.js if you want:
  // cfg.rsvp = { provider:"formspree", endpoint:"https://formspree.io/f/XXXXXXX" }
  const rsvpCfg = cfg.rsvp || {};
  const provider = (rsvpCfg.provider || "formspree").toLowerCase();

  const googleWrap = $("#googleFormWrap");
  const googleIframe = $("#googleFormIframe");

  if (provider === "google" && rsvpCfg.googleEmbedUrl) {
    // Show Google Form embed, hide custom form
    if (googleWrap) googleWrap.style.display = "block";
    if (googleIframe) googleIframe.src = rsvpCfg.googleEmbedUrl;
    if (rsvpForm) rsvpForm.style.display = "none";
  } else {
    // Custom form submission:
    // - provider: "formspree" (default) -> endpoint: https://formspree.io/f/XXXXXXX
    // - provider: "google-sheets" -> endpoint: Apps Script Web App URL (writes to a Google Sheet)
    const endpoint = rsvpCfg.endpoint || "";
    const isSheets = ["google-sheets", "googlesheets", "sheets"].includes(provider);

    rsvpForm?.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!endpoint) {
        if (rsvpStatus) rsvpStatus.textContent = "RSVP non configurato: inserisci l’endpoint in config.js.";
        return;
      }

      if (rsvpStatus) rsvpStatus.textContent = "Invio…";

      try {
        const fd = new FormData(rsvpForm);

        if (isSheets) {
          // Send as application/x-www-form-urlencoded (simple for Apps Script to parse).
          fd.append("ua", navigator.userAgent);

          const body = new URLSearchParams();
          for (const [k, v] of fd.entries()) body.append(k, String(v));

          // "no-cors" avoids CORS issues on static hosting. If the request doesn't throw, assume success.
          await fetch(endpoint, { method: "POST", mode: "no-cors", body });

          if (rsvpStatus) rsvpStatus.textContent = "Grazie! Risposta inviata ✅";
          rsvpForm.reset();
          setTimeout(() => { if (rsvpStatus) rsvpStatus.textContent = ""; }, 2500);
          return;
        }

        // Default: Formspree (keeps the custom looking form)
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: fd
        });

        if (res.ok) {
          if (rsvpStatus) rsvpStatus.textContent = "Grazie! Risposta inviata ✅";
          rsvpForm.reset();
          setTimeout(() => { if (rsvpStatus) rsvpStatus.textContent = ""; }, 2500);
        } else {
          if (rsvpStatus) rsvpStatus.textContent = "Errore nell’invio. Riprova tra poco.";
        }
      } catch {
        if (rsvpStatus) rsvpStatus.textContent = "Errore di rete. Riprova.";
      }
    });
  }
})();
