/* Nav, cambio lingua e rendering dei contenuti per pagina.
   Ogni file HTML imposta window.PAGE_KEY prima di caricare questo script. */
(function () {
  const PAGES = [
    { key: "home", href: "index.html" },
    { key: "about", href: "about.html" },
    { key: "experience", href: "experience.html" },
    { key: "education", href: "education.html" },
    { key: "skills", href: "skills.html" },
    { key: "languages", href: "languages.html" },
    { key: "projects", href: "projects.html" },
    { key: "contact", href: "contact.html" },
  ];

  const LANG_KEY = "cv_lang";

  function getLang() {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "it" || stored === "en") return stored;
    const browser = (navigator.language || "it").toLowerCase();
    return browser.startsWith("it") ? "it" : "en";
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.setAttribute("lang", lang);
    render();
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function renderNav(lang) {
    const t = window.SITE_CONTENT[lang];
    const navEl = document.getElementById("site-nav");
    if (!navEl) return;
    const current = window.PAGE_KEY || "home";

    const links = PAGES.map((p) => {
      const active = p.key === current ? " active" : "";
      return `<a href="${p.href}" class="${active.trim()}">${esc(t.nav[p.key])}</a>`;
    }).join("");

    navEl.innerHTML = `
      <div class="nav-inner">
        <a class="brand" href="index.html">${esc(t.meta.name)}<span class="dot">·</span></a>
        <ul class="nav-links" id="nav-links">${links}</ul>
        <div class="nav-right">
          <div class="lang-toggle" role="group" aria-label="Lingua / Language">
            <button type="button" data-lang="it" class="${lang === "it" ? "active" : ""}">IT</button>
            <button type="button" data-lang="en" class="${lang === "en" ? "active" : ""}">EN</button>
          </div>
          <button type="button" class="nav-burger" id="nav-burger" aria-label="Menu">☰</button>
        </div>
      </div>`;

    navEl.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
    });
    const burger = document.getElementById("nav-burger");
    if (burger) {
      burger.addEventListener("click", () => navEl.classList.toggle("open"));
    }
  }

  function renderFooter(lang) {
    const t = window.SITE_CONTENT[lang];
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML = `<p>${esc(t.meta.name)} — ${esc(t.footer)}</p>`;
  }

  /* ---------- Renderer per singola pagina ---------- */

  function renderHome(t) {
    const h = t.home;
    return `
      <section class="hero">
        <div class="hero-avatar">
          <img src="assets/mariano-avatar.jpg" alt="${esc(t.meta.name)}" width="132" height="132">
        </div>
        <span class="eyebrow">${esc(h.eyebrow)}</span>
        <h1>${esc(h.title)}</h1>
        <p class="role">${esc(h.role)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="contact.html">${esc(h.ctaPrimary)}</a>
          <a class="btn btn-ghost" href="${esc(h.cvHref)}" target="_blank" rel="noopener" download>${esc(h.ctaSecondary)}</a>
        </div>
      </section>
      <section class="wrap">
        <p class="section-label">${esc(h.sectionLabel)}</p>
        <div class="orbit-grid">
          ${h.cards.map((c) => {
            const page = PAGES.find((p) => p.key === c.key);
            return `<a class="orbit-card" href="${page.href}">
              <span class="orbit-index">${esc(c.n)}</span>
              <span class="orbit-arrow">↗</span>
              <h3>${esc(c.title)}</h3>
              <p>${esc(c.desc)}</p>
            </a>`;
          }).join("")}
        </div>
      </section>`;
  }

  function pageHead(section) {
    return `
      <a class="back-link" href="index.html">← Home</a>
      <div class="page-head">
        <span class="eyebrow">${esc(section.eyebrow)}</span>
        <h1>${esc(section.title)}</h1>
        <p class="subtitle">${esc(section.subtitle)}</p>
      </div>`;
  }

  function renderAbout(t) {
    const a = t.about;
    return `<section class="wrap">
      ${pageHead(a)}
      <div class="prose">
        ${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
      </div>
      <div class="card" style="margin-top:8px; max-width:280px;">
        <h3>${esc(a.extra.label)}</h3>
        <p style="margin:0; color:var(--text-muted);">${esc(a.extra.value)}</p>
      </div>
    </section>`;
  }

  function entryBlock(e) {
    return `<div class="entry">
      <div class="period">${esc(e.period)}</div>
      <h3>${esc(e.role)}</h3>
      <div class="org">${esc(e.org)}</div>
      <p>${esc(e.desc)}</p>
      ${e.link ? `<a class="ext" href="${esc(e.link.url)}" target="_blank" rel="noopener">${esc(e.link.label)} ↗</a>` : ""}
      ${e.exams ? `<details class="exam-toggle"><summary>${window.__examsLabel}</summary><div class="exam-list">${esc(e.exams)}</div></details>` : ""}
    </div>`;
  }

  function renderExperience(t) {
    const x = t.experience;
    return `<section class="wrap">
      ${pageHead(x)}
      <div class="timeline">
        ${x.entries.map(entryBlock).join("")}
      </div>
      <div class="card" style="margin-top:28px;">
        <h3>${esc(x.otherLabel)}</h3>
        <p style="margin:0; color:var(--text-muted);">${esc(x.other)}</p>
      </div>
    </section>`;
  }

  function renderEducation(t) {
    const ed = t.education;
    window.__examsLabel = ed.examsToggle;
    return `<section class="wrap">
      ${pageHead(ed)}
      <div class="timeline">
        ${ed.entries.map(entryBlock).join("")}
      </div>
      <p class="section-label" style="margin-top:36px;">${esc(ed.coursesLabel)}</p>
      <div class="card-grid">
        ${ed.courses.map((c) => `<div class="card"><h3>${esc(c.title)}</h3><p style="margin:0;color:var(--text-muted);">${esc(c.desc)}</p></div>`).join("")}
      </div>
    </section>`;
  }

  function renderSkills(t) {
    const s = t.skills;
    return `<section class="wrap">
      ${pageHead(s)}
      <div class="card-grid">
        ${s.groups.map((g) => `<div class="card">
          <h3>${esc(g.title)}</h3>
          <div class="tag-row">${g.items.map((i) => `<span class="tag">${esc(i)}</span>`).join("")}</div>
        </div>`).join("")}
      </div>
      <p class="section-label" style="margin-top:36px;">${esc(s.softTitle)}</p>
      <div class="tag-row">${s.soft.map((i) => `<span class="tag">${esc(i)}</span>`).join("")}</div>
    </section>`;
  }

  function renderLanguages(t) {
    const l = t.languages;
    return `<section class="wrap">
      ${pageHead(l)}
      <div class="card" style="max-width:420px;">
        ${l.items.map((i) => `<div class="lang-row"><span class="lname">${esc(i.name)}</span><span class="llevel">${esc(i.level)}</span></div>`).join("")}
      </div>
    </section>`;
  }

  function renderProjects(t) {
    const p = t.projects;
    return `<section class="wrap">
      ${pageHead(p)}
      <div class="card-grid">
        ${p.items.map((i) => `<a class="orbit-card" href="${esc(i.url)}" target="_blank" rel="noopener">
          <span class="orbit-arrow">↗</span>
          <h3>${esc(i.title)}</h3>
          <p>${esc(i.desc)}</p>
        </a>`).join("")}
      </div>
    </section>`;
  }

  function renderContact(t) {
    const c = t.contact;
    return `<section class="wrap">
      ${pageHead(c)}
      <ul class="contact-list">
        ${c.items.map((i) => `<li><span class="k">${esc(i.k)}</span><a href="${esc(i.href)}" target="_blank" rel="noopener">${esc(i.v)}</a></li>`).join("")}
      </ul>
    </section>`;
  }

  const RENDERERS = {
    home: renderHome,
    about: renderAbout,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    languages: renderLanguages,
    projects: renderProjects,
    contact: renderContact,
  };

  function render() {
    const lang = getLang();
    document.documentElement.setAttribute("lang", lang);
    const t = window.SITE_CONTENT[lang];
    document.title = t.meta.siteTitle;

    renderNav(lang);
    renderFooter(lang);

    const key = window.PAGE_KEY || "home";
    const container = document.getElementById("page-content");
    if (container && RENDERERS[key]) {
      container.innerHTML = RENDERERS[key](t);
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();
