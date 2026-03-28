
function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.valueOf())) return dateString;
  return new Intl.DateTimeFormat("en", { year:"numeric", month:"short", day:"numeric" }).format(date);
}

function rootPrefix() {
  return document.body.dataset.rootPrefix || "";
}

function appPath(path) {
  return `${rootPrefix()}${path}`;
}

function currentPath() {
  return window.location.pathname.replace(/\/+$/, "");
}

function getAllContentItems() {
  return Object.entries(SITE_CONTENT).flatMap(([sectionKey, items]) =>
    items.map((item) => ({ ...item, sectionKey }))
  );
}

function itemUrl(item) {
  const meta = SECTION_META[item.sectionKey];
  return appPath(`${meta.postsPath}/${item.slug}/`);
}

function renderGlobalMenu() {
  const nav = document.getElementById("globalSideNav");
  if (!nav) return;
  const path = currentPath();
  const is = (p) => path.endsWith(`/${p}`.replace(/\/+/g,'/').replace(/\/$/,'')) || path === `/${p}`.replace(/\/+/g,'/');
  const html = `
    <a class="side-link ${is('index.html') || path === '' || path === '/' ? 'is-current' : ''}" href="${appPath('index.html')}">Home</a>
    <a class="side-link ${path.includes('/philosophical-yap-sessions') ? 'is-current' : ''}" href="${appPath('philosophical-yap-sessions/')}">Philosophical yap sessions</a>
    <a class="side-link ${path.includes('/reflections-of-a-casual-bouldering-enthusiast') ? 'is-current' : ''}" href="${appPath('reflections-of-a-casual-bouldering-enthusiast/')}">Reflections of a Casual Bouldering Enthusiast</a>
    <a class="side-link ${path.includes('/book-and-media-reviews') ? 'is-current' : ''}" href="${appPath('book-and-media-reviews/')}">Book and Media Reviews</a>
    <a class="side-link ${path.includes('/photos') ? 'is-current' : ''}" href="${appPath('photos/')}">Photos</a>
    <a class="side-link ${path.includes('/kyle-the-dog') ? 'is-current' : ''}" href="${appPath('kyle-the-dog/')}">Kyle the Dog</a>
    <a class="side-link ${path.includes('/toilet-reviews') ? 'is-current' : ''}" href="${appPath('toilet-reviews/')}">Where to Poop: Toronto</a>
    <a class="side-link ${path.includes('/where-to-poop-hong-kong') ? 'is-current' : ''}" href="${appPath('where-to-poop-hong-kong/')}">Where to Poop: Hong Kong</a>
    <a class="side-link ${path.includes('/hd-hen') ? 'is-current' : ''}" href="${appPath('hd-hen/')}">HD Hen</a>
  `;
  nav.innerHTML = html;
}

function setupGlobalMenu() {
  const button = document.getElementById('globalMenuButton');
  const close = document.getElementById('globalMenuClose');
  const menu = document.getElementById('globalSideMenu');
  const scrim = document.getElementById('globalMenuScrim');
  if (!button || !close || !menu || !scrim) return;
  const openMenu = () => {
    menu.classList.add('is-open');
    scrim.hidden = false;
    document.body.classList.add('menu-open');
  };
  const closeMenu = () => {
    menu.classList.remove('is-open');
    scrim.hidden = true;
    document.body.classList.remove('menu-open');
  };
  button.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);
  scrim.addEventListener('click', closeMenu);
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
}

function mountShell() {
  const shell = document.getElementById('globalShell');
  if (!shell) return;
  shell.innerHTML = `
    <button class="menu-button" id="globalMenuButton" aria-controls="globalSideMenu" aria-expanded="false" aria-label="Open menu">
      <span class="menu-lines"><span></span><span></span><span></span></span>
    </button>
    <aside class="side-menu" id="globalSideMenu" aria-label="Main site menu">
      <div class="side-menu-inner">
        <div class="side-menu-header">
          <div class="brand-block">
            <div class="brand-title">Nihilists Take Their Coffee Black</div>
            <div class="brand-subtitle">A collection of philosophical rambles and otherwise random takes on life, dogs, toilets, everything.</div>
          </div>
          <button class="menu-close" id="globalMenuClose" aria-label="Close menu">×</button>
        </div>
        <nav class="side-nav" id="globalSideNav"></nav>
      </div>
    </aside>
    <div class="menu-scrim" id="globalMenuScrim" hidden></div>
  `;
  renderGlobalMenu();
  setupGlobalMenu();
}

function renderLandingCards() {
  const mount = document.getElementById('landingSectionCards');
  if (!mount) return;
  mount.innerHTML = `
    <article class="link-card">
      <div class="kicker">Utilities</div>
      <h3>Where to Poop: Toronto</h3>
      <p>Urgent field research, structured as a full subsection with its own reviews, filters, and local admin generator.</p>
      <div class="tag-row"><span class="tag">Integrated navigation</span><span class="tag">Brown review theme intact</span></div>
      <div class="cta-row"><a class="btn btn-primary" href="${appPath('toilet-reviews/')}">Enter Where to Poop: Toronto</a></div>
    </article>
    <article class="link-card">
      <div class="kicker">Parallel project</div>
      <h3>Where to Poop: Hong Kong</h3>
      <p>The second branch of the washroom project, styled to mirror Toronto but currently waiting for its first dispatches.</p>
      <div class="tag-row"><span class="tag coming-soon">Coming Soon!</span></div>
      <div class="cta-row"><a class="btn btn-primary" href="${appPath('where-to-poop-hong-kong/')}">Open Hong Kong section</a></div>
    </article>
    <article class="link-card">
      <div class="kicker">Animal affairs</div>
      <h3>Kyle the Dog</h3>
      <p>A navigable photo-album subsection with room for captions, stories, and recurring canine propaganda.</p>
      <div class="tag-row"><span class="tag">Album format</span><span class="tag">Admin ready</span></div>
      <div class="cta-row"><a class="btn btn-primary" href="${appPath('kyle-the-dog/')}">See Kyle the Dog</a></div>
    </article>
    <article class="link-card">
      <div class="kicker">Writing</div>
      <h3>Philosophical yap sessions</h3>
      <p>Separate-link posts for essays, shower thoughts, and whatever survived long enough to be typed out.</p>
      <div class="cta-row"><a class="btn btn-primary" href="${appPath('philosophical-yap-sessions/')}">Enter the blog</a></div>
    </article>
    <article class="link-card">
      <div class="kicker">Movement</div>
      <h3>Reflections of a Casual Bouldering Enthusiast</h3>
      <p>Its own writing wing for holds, falls, fear, and the occasional undeserved send.</p>
      <div class="cta-row"><a class="btn btn-primary" href="${appPath('reflections-of-a-casual-bouldering-enthusiast/')}">Open section</a></div>
    </article>
    <article class="link-card">
      <div class="kicker">Artifacts</div>
      <h3>Book and Media Reviews</h3>
      <p>Another posting section for judgments rendered on pages, films, music, and miscellaneous cultural debris.</p>
      <div class="cta-row"><a class="btn btn-primary" href="${appPath('book-and-media-reviews/')}">Open section</a></div>
    </article>
    <article class="link-card">
      <div class="kicker">Visual notes</div>
      <h3>Photos</h3>
      <p>An image-first section for shots worth keeping, each with its own link and optional short text.</p>
      <div class="cta-row"><a class="btn btn-primary" href="${appPath('photos/')}">Open photos</a></div>
    </article>
    <article class="link-card">
      <div class="kicker">Sacred poultry</div>
      <h3>HD Hen</h3>
      <p>A page containing exactly what it claims to contain, now folded into the larger site instead of floating alone.</p>
      <div class="cta-row"><a class="btn btn-primary" href="${appPath('hd-hen/')}">See HD Hen</a></div>
    </article>
  `;
}

function renderCollection(sectionKey, mountId, options = {}) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const items = [...(SITE_CONTENT[sectionKey] || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (!items.length) {
    mount.innerHTML = `<div class="empty-card">No posts yet. This section is set up for separate links and future entries, but currently sits in dignified anticipation.</div>`;
    return;
  }
  mount.innerHTML = items.map((item) => `
    <article class="entry-card">
      <div class="meta">
        ${item.date ? `<span class="tag">${escapeHtml(formatDate(item.date))}</span>` : ''}
        ${item.subtitle ? `<span class="tag">${escapeHtml(item.subtitle)}</span>` : ''}
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary || item.body || '')}</p>
      <div class="cta-row"><a class="btn btn-primary" href="${itemUrl(item)}">Read entry</a></div>
    </article>
  `).join('');
}

function renderAlbum(sectionKey, mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const items = [...(SITE_CONTENT[sectionKey] || [])].sort((a,b) => (b.date || '').localeCompare(a.date || ''));
  if (!items.length) {
    mount.innerHTML = `<div class="empty-card">No album entries yet. The gallery is live, linked, and waiting for its first upload.</div>`;
    return;
  }
  mount.innerHTML = items.map((item) => `
    <article class="album-card">
      <a href="${itemUrl(item)}">
        <div class="album-photo">${item.image ? `<img src="${appPath(item.image)}" alt="${escapeHtml(item.title)}">` : 'Image placeholder'}</div>
        <div class="album-body">
          <div class="meta">${item.date ? `<span class="tag">${escapeHtml(formatDate(item.date))}</span>` : ''}</div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.subtitle || item.summary || '')}</p>
        </div>
      </a>
    </article>
  `).join('');
}

function renderGenericPost() {
  const mount = document.getElementById('genericPost');
  if (!mount) return;
  const sectionKey = document.body.dataset.sectionKey;
  const slug = document.body.dataset.slug || inferSlugFromPath();
  const sectionItems = (SITE_CONTENT[sectionKey] || []).map((item) => ({...item, sectionKey}));
  const item = sectionItems.find((entry) => entry.slug === slug);
  const meta = SECTION_META[sectionKey];
  if (!item || !meta) {
    mount.innerHTML = `<div class="empty-card">Entry not found.</div>`;
    return;
  }
  document.title = `${item.title} | ${meta.title}`;
  mount.innerHTML = `
    <article class="page-hero">
      <div class="eyebrow">${escapeHtml(meta.title)}</div>
      <h1>${escapeHtml(item.title)}</h1>
      ${item.subtitle ? `<p>${escapeHtml(item.subtitle)}</p>` : ''}
      <div class="tag-row">
        ${item.date ? `<span class="tag">${escapeHtml(formatDate(item.date))}</span>` : ''}
        <span class="tag">${escapeHtml(meta.shortTitle)}</span>
      </div>
      <div class="cta-row"><a class="btn btn-primary" href="${appPath(meta.basePath + '/')}">Back to section</a></div>
    </article>
    <section class="page-section">
      ${item.image ? `<div class="hen-card" style="margin-bottom:1rem;"><img src="${appPath(item.image)}" alt="${escapeHtml(item.title)}"></div>` : ''}
      <div class="link-card">
        <p style="white-space:pre-wrap; line-height:1.9;">${escapeHtml(item.body || item.summary || '')}</p>
      </div>
    </section>
  `;
}

function inferSlugFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const postsIndex = parts.lastIndexOf('posts');
  if (postsIndex >= 0 && parts[postsIndex + 1]) return parts[postsIndex + 1];
  return '';
}

function populateSectionOptions(selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = Object.values(SECTION_META)
    .filter((meta) => meta.key !== 'philosophical' ? true : true)
    .map((meta) => `<option value="${meta.key}">${escapeHtml(meta.title)}</option>`)
    .join('');
}

function buildPostObject(sectionKey, formData) {
  const meta = SECTION_META[sectionKey];
  return {
    title: formData.title.trim(),
    slug: formData.slug.trim(),
    subtitle: formData.subtitle.trim(),
    date: formData.date,
    summary: formData.summary.trim(),
    body: formData.body.trim(),
    image: formData.image.trim()
  };
}

function buildUpdatedContentText(queue, currentText) {
  const regex = /const SITE_CONTENT = (\{[\s\S]*?\n\});/;
  const match = currentText.match(regex);
  if (!match) return currentText;
  const baseData = Function(`"use strict"; return (${match[1]});`)();
  for (const item of queue) {
    const arr = baseData[item.sectionKey] || [];
    const filtered = arr.filter((existing) => existing.slug !== item.slug);
    filtered.push({
      title: item.title,
      slug: item.slug,
      subtitle: item.subtitle,
      date: item.date,
      summary: item.summary,
      body: item.body,
      image: item.image
    });
    baseData[item.sectionKey] = filtered;
  }
  const replacement = `const SITE_CONTENT = ${JSON.stringify(baseData, null, 2)};`;
  return currentText.replace(regex, replacement);
}

function postPageTemplate(rootPrefix, sectionKey, slug) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Entry | Nihilists Take Their Coffee Black</title>
  <link rel="stylesheet" href="${rootPrefix}assets/site.css" />
</head>
<body data-root-prefix="${rootPrefix}" data-section-key="${sectionKey}" data-slug="${slug}">
  <div id="globalShell"></div>
  <div class="app-shell">
    <main class="main-content">
      <div class="container"><div id="genericPost"></div></div>
    </main>
    <footer class="site-footer"><div class="container">Created by Jake Lau</div></footer>
  </div>
  <script src="${rootPrefix}assets/content.js"></script>
  <script src="${rootPrefix}assets/site.js"></script>
</body>
</html>`;
}

function setupContentAdmin() {
  const form = document.getElementById('contentAdminForm');
  if (!form) return;
  const sectionSelect = document.getElementById('entrySection');
  const titleInput = document.getElementById('entryTitle');
  const slugInput = document.getElementById('entrySlug');
  const queueList = document.getElementById('queueList');
  const objectOutput = document.getElementById('contentObjectOutput');
  const pageOutput = document.getElementById('contentPageOutput');
  const filePathOutput = document.getElementById('contentFilePath');
  const summaryOutput = document.getElementById('contentSummary');
  const downloadContentButton = document.getElementById('downloadContentButton');
  const downloadPageButton = document.getElementById('downloadPageButton');
  const downloadBundleButton = document.getElementById('downloadBundleButton');
  const clearFormButton = document.getElementById('clearContentFormButton');
  const copyObjectButton = document.getElementById('copyContentObjectButton');

  populateSectionOptions(sectionSelect);
  const ratingPreview = null;
  const queued = [];
  let currentContentText = '';
  let latestItem = null;

  fetch(appPath('assets/content.js'))
    .then((r) => r.text())
    .then((text) => {
      currentContentText = text;
      summaryOutput.textContent = 'Loaded current assets/content.js. You can queue multiple entries and export one consolidated bundle.';
    })
    .catch(() => {
      summaryOutput.textContent = 'Could not load assets/content.js from this browser session. You can still generate individual entry files.';
    });

  function refreshQueue() {
    if (!queued.length) {
      queueList.innerHTML = '<div class="empty-card">No queued items yet.</div>';
      return;
    }
    queueList.innerHTML = queued.map((item, index) => `
      <div class="queue-item">
        <strong>${escapeHtml(item.title)}</strong>
        <div class="meta">
          <span class="tag">${escapeHtml(SECTION_META[item.sectionKey].shortTitle)}</span>
          <span class="tag">${escapeHtml(item.slug)}</span>
          ${item.date ? `<span class="tag">${escapeHtml(formatDate(item.date))}</span>` : ''}
        </div>
        <div class="cta-row">
          <button class="small-btn" type="button" data-remove-index="${index}">Remove</button>
          <button class="small-btn" type="button" data-download-index="${index}">Download page</button>
        </div>
      </div>
    `).join('');
    queueList.querySelectorAll('[data-remove-index]').forEach((btn) => {
      btn.addEventListener('click', () => {
        queued.splice(Number(btn.dataset.removeIndex), 1);
        refreshQueue();
      });
    });
    queueList.querySelectorAll('[data-download-index]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = queued[Number(btn.dataset.downloadIndex)];
        const meta = SECTION_META[item.sectionKey];
        downloadTextFile('index.html', postPageTemplate('../../../', item.sectionKey, item.slug));
      });
    });
  }

  titleInput.addEventListener('input', () => {
    if (!slugInput.dataset.userEdited) slugInput.value = slugify(titleInput.value);
  });
  slugInput.addEventListener('input', () => { slugInput.dataset.userEdited = 'true'; });
  clearFormButton.addEventListener('click', () => { form.reset(); slugInput.dataset.userEdited=''; });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const sectionKey = sectionSelect.value;
    const fd = {
      title: document.getElementById('entryTitle').value,
      slug: document.getElementById('entrySlug').value,
      subtitle: document.getElementById('entrySubtitle').value,
      date: document.getElementById('entryDate').value,
      summary: document.getElementById('entrySummary').value,
      body: document.getElementById('entryBody').value,
      image: document.getElementById('entryImage').value
    };
    const item = { ...buildPostObject(sectionKey, fd), sectionKey };
    latestItem = item;
    queued.push(item);
    objectOutput.value = JSON.stringify(item, null, 2);
    pageOutput.value = postPageTemplate('../../../', sectionKey, item.slug);
    const meta = SECTION_META[sectionKey];
    filePathOutput.textContent = `${meta.postsPath}/${item.slug}/index.html`;
    summaryOutput.textContent = `${queued.length} queued item${queued.length === 1 ? '' : 's'} ready for export.`;
    refreshQueue();
  });

  copyObjectButton.addEventListener('click', async () => {
    if (!objectOutput.value) return;
    await navigator.clipboard.writeText(objectOutput.value);
  });

  downloadPageButton.addEventListener('click', () => {
    if (!latestItem) return;
    downloadTextFile('index.html', postPageTemplate('../../../', latestItem.sectionKey, latestItem.slug));
  });

  downloadContentButton.addEventListener('click', () => {
    if (!queued.length || !currentContentText) return;
    downloadTextFile('content.js', buildUpdatedContentText(queued, currentContentText));
  });

  downloadBundleButton.addEventListener('click', async () => {
    if (!queued.length || !currentContentText || typeof JSZip === 'undefined') return;
    const zip = new JSZip();
    zip.file('assets/content.js', buildUpdatedContentText(queued, currentContentText));
    const manifest = [];
    for (const item of queued) {
      const meta = SECTION_META[item.sectionKey];
      const path = `${meta.postsPath}/${item.slug}/index.html`;
      zip.file(path, postPageTemplate('../../../', item.sectionKey, item.slug));
      manifest.push(path);
    }
    zip.file('content-manifest.txt', manifest.join('\n'));
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content-batch-update.zip';
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

document.addEventListener('DOMContentLoaded', () => {
  mountShell();
  renderLandingCards();
  renderCollection('philosophical', 'philosophicalList');
  renderCollection('bouldering', 'boulderingList');
  renderCollection('bookMedia', 'bookMediaList');
  renderCollection('photos', 'photoList');
  renderAlbum('kyle', 'kyleAlbum');
  renderGenericPost();
  setupContentAdmin();
});
