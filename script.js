(function () {
  "use strict";

  function initLP() {
    const CONFIG = window.LP_CONFIG || {};

    function getValue(keyPath) {
      if (!keyPath) return null;
      return keyPath.split(".").reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : null), CONFIG);
    }

    function escapeHTML(str) {
      if (typeof str !== "string") return str;
      const div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    document.querySelectorAll("[data-bind]").forEach(el => {
      const key = el.getAttribute("data-bind");
      const val = getValue(key);
      if (val !== null) el.textContent = val;
    });

    document.querySelectorAll("[data-bind-html]").forEach(el => {
      const key = el.getAttribute("data-bind-html");
      const val = getValue(key);
      if (val !== null) el.innerHTML = val;
    });

    document.querySelectorAll("[data-bind-src]").forEach(el => {
      const key = el.getAttribute("data-bind-src");
      const val = getValue(key);
      if (val !== null) el.setAttribute("src", val);
    });

    document.querySelectorAll("[data-bind-alt]").forEach(el => {
      const key = el.getAttribute("data-bind-alt");
      const val = getValue(key);
      if (val !== null) el.setAttribute("alt", val);
    });

    document.querySelectorAll("[data-bind-href]").forEach(el => {
      const key = el.getAttribute("data-bind-href");
      const val = getValue(key);
      if (val !== null) el.setAttribute("href", val);
    });

    document.querySelectorAll("[data-bind-href-tel]").forEach(el => {
      const key = el.getAttribute("data-bind-href-tel");
      const val = getValue(key);
      if (val !== null) {
        el.setAttribute("href", `tel:${val.replace(/-/g, "")}`);
      }
    });

    const problemContainer = document.querySelector(".problem-list");
    if (problemContainer && CONFIG.problem && Array.isArray(CONFIG.problem.items)) {
      problemContainer.innerHTML = CONFIG.problem.items.map(item => `
        <li class="problem-item" role="listitem">
          <span class="problem-check" aria-hidden="true">✔</span>
          <span>${escapeHTML(item)}</span>
        </li>
      `).join("");
    }

    const mangaContainer = document.querySelector(".manga-container");
    if (mangaContainer && CONFIG.manga && Array.isArray(CONFIG.manga.scenes)) {
      mangaContainer.innerHTML = CONFIG.manga.scenes.map(scene => `
        <div class="manga-panel" role="listitem">
          <img src="${escapeHTML(scene.image)}" alt="${escapeHTML(scene.alt)}" loading="lazy" width="800" height="1100">
        </div>
      `).join("");
    }

    const causeContainer = document.querySelector(".cause-points");
    if (causeContainer && CONFIG.cause && Array.isArray(CONFIG.cause.points)) {
      causeContainer.innerHTML = CONFIG.cause.points.map(point => `
        <article class="cause-card" role="listitem">
          <h3>${escapeHTML(point.title)}</h3>
          <p>${escapeHTML(point.description)}</p>
        </article>
      `).join("");
    }

    const treatmentContainer = document.querySelector(".treatment-features");
    if (treatmentContainer && CONFIG.treatment && Array.isArray(CONFIG.treatment.features)) {
      treatmentContainer.innerHTML = CONFIG.treatment.features.map(feat => `
        <article class="feature-card" role="listitem">
          <span class="feature-icon" aria-hidden="true">${escapeHTML(feat.icon)}</span>
          <h3>${escapeHTML(feat.title)}</h3>
          <p>${escapeHTML(feat.description)}</p>
        </article>
      `).join("");
    }

    const voiceContainer = document.querySelector(".voice-container");
    if (voiceContainer && CONFIG.voice && Array.isArray(CONFIG.voice.items)) {
      voiceContainer.innerHTML = CONFIG.voice.items.map(v => {
        const rating = v.rating ? parseInt(v.rating, 10) : 5;
        const stars = "★★★★★".slice(0, rating);
        let profile = escapeHTML(v.name || "");
        if (v.age && v.gender) profile += `（${escapeHTML(v.age)}・${escapeHTML(v.gender)}）`;
        else if (v.age) profile += `（${escapeHTML(v.age)}）`;
        else if (v.gender) profile += `（${escapeHTML(v.gender)}）`;
        return `
          <article class="voice-card" role="listitem">
            <div class="voice-meta">
              <span class="voice-rating" aria-label="評価: ${rating}/5">${stars}</span>
              <span class="voice-profile">${profile}</span>
            </div>
            ${v.symptom ? `<p class="voice-symptom">${escapeHTML(v.symptom)}</p>` : ""}
            <blockquote>${escapeHTML(v.text || "")}</blockquote>
          </article>
        `;
      }).join("");
    }

    const doctorContainer = document.querySelector(".doctor-credentials");
    if (doctorContainer && CONFIG.doctor && Array.isArray(CONFIG.doctor.credentials)) {
      doctorContainer.innerHTML = CONFIG.doctor.credentials.map(c => `<li>${escapeHTML(c)}</li>`).join("");
    }

    const footerYearEl = document.getElementById("footer-year");
    if (footerYearEl) footerYearEl.textContent = new Date().getFullYear();

    if (CONFIG.meta) {
      if (CONFIG.meta.title) document.title = CONFIG.meta.title;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl && CONFIG.meta.description) descEl.setAttribute("content", CONFIG.meta.description);
    }

    document.body.classList.add("lp-loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLP);
  } else {
    initLP();
  }
})();
