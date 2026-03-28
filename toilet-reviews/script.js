const REVIEWS = [
  {
    "title": "Golden Diner",
    "slug": "golden-diner",
    "location": "105 Carlton Street",
    "area": "Downtown",
    "neighborhood": "Downtown Yonge",
    "suitableFor": "No. 1 & No. 2",
    "accessibility": "Limited",
    "passwordRequired": false,
    "password": "",
    "featured": false,
    "cleanliness": 3.5,
    "aesthetics": 3.0,
    "facilities": 2.5,
    "date": "2026-03-27",
    "summary": "Clean enough for No. 1; barely acceptable for No. 2. Dim lighting, noticeable odor. Suitable for emergencies, but shouldn't be a first choice for anyone.",
    "otherNotes": "The diner is located in the basement, so you'll have to go down a flight of stairs."
  },
  {
    "title": "Gerstein Library Public Toilet",
    "slug": "gerstein-library-public-toilet",
    "location": "9 King's College Circle",
    "area": "Downtown",
    "neighborhood": "University of Toronto",
    "suitableFor": "No. 1",
    "accessibility": "Limited",
    "passwordRequired": false,
    "password": "",
    "featured": false,
    "cleanliness": 3.5,
    "aesthetics": 3.0,
    "facilities": 3.5,
    "date": "2026-03-25",
    "summary": "Decently clean, although could use more lighting. Spacious urinals. Requires a walk down a flight of stairs.",
    "otherNotes": ""
  },
  {
    "title": "Wilson Hall",
    "slug": "wilson-hall",
    "location": "40 Willcocks Street",
    "area": "Downtown",
    "neighborhood": "University of Toronto",
    "suitableFor": "No. 1 & No. 2",
    "accessibility": "Easily Accessible",
    "passwordRequired": false,
    "password": "",
    "featured": true,
    "cleanliness": 4.5,
    "aesthetics": 4.0,
    "facilities": 4.5,
    "date": "2026-03-25",
    "summary": "Clean, aesthetically pleasing, and an abundance of facilities. Spacious, too. Overall, one of the better toilets in UofT",
    "otherNotes": "Bonus: accessible via wheelchair"
  },
  {
    "title": "Cafe Landwer on Bloor",
    "slug": "cafe-landwer-on-bloor",
    "location": "33 Bloor Street East",
    "area": "Downtown",
    "neighborhood": "Church-Wellesley Village",
    "suitableFor": "No. 1 & No. 2",
    "accessibility": "Limited",
    "passwordRequired": true,
    "password": "531",
    "featured": true,
    "cleanliness": 5.0,
    "aesthetics": 4.5,
    "facilities": 4.0,
    "date": "2026-03-24",
    "summary": "Very clean, very accessible (with password). A thick door and music playing from speakers on the ceiling prevent noise leakage while you're doing your business. Could be more spacious.",
    "otherNotes": ""
  }
];

const GENERIC_REVIEW_PAGE_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Review | Where to Poop: Toronto</title>
  <meta name="description" content="Where to Poop: Toronto — a luxurious mobile-first guide to toilets around Toronto." />
  <link rel="preconnect" href="https://images.unsplash.com" />
  <link rel="stylesheet" href="../../style.css" />
</head>
<body data-base-path="../../">
  <button class="menu-button" id="menuButton" aria-controls="sideMenu" aria-expanded="false" aria-label="Open menu">
    <span></span><span></span><span></span>
  </button>

  <aside class="side-menu" id="sideMenu" aria-label="Site menu">
    <div class="side-menu-inner">
      <div class="side-menu-header">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true"><svg viewBox="0 0 64 64" role="img" aria-label="Toilet roll icon"><rect x="12" y="18" width="34" height="24" rx="7"></rect><circle cx="26" cy="30" r="6"></circle><path d="M46 20c5 0 9 4 9 9s-4 9-9 9"></path><path d="M20 44c2 7 6 11 11 13"></path><path d="M42 18c4 1 7 3 10 6"></path></svg></div>
          <div class="brand-title" style="color: var(--ink);">Where to Poop: Toronto</div>
        </div>
        <button class="menu-close" id="menuClose" aria-label="Close menu">×</button>
      </div>
      <nav class="side-nav" id="sideNav"></nav>
    </div>
  </aside>
  <div class="menu-scrim" id="menuScrim" hidden></div>

  <header class="topbar">
    <div class="container topbar-inner">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true"><svg viewBox="0 0 64 64" role="img" aria-label="Toilet roll icon"><rect x="12" y="18" width="34" height="24" rx="7"></rect><circle cx="26" cy="30" r="6"></circle><path d="M46 20c5 0 9 4 9 9s-4 9-9 9"></path><path d="M20 44c2 7 6 11 11 13"></path><path d="M42 18c4 1 7 3 10 6"></path></svg></div>
        <div class="brand-title">Where to Poop: Toronto</div>
      </div>
    </div>
  </header>

  <main class="page-shell">
    <div class="container">
      <div id="reviewDetail"></div>
    </div>
  </main>

  <script src="../../script.js"></script>
</body>
</html>`;

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
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function roundToHalf(value) {
  return Math.round(value * 2) / 2;
}

function overallRating(review) {
  return roundToHalf((Number(review.cleanliness) + Number(review.aesthetics) + Number(review.facilities)) / 3);
}

function formatPassword(review) {
  if (!review.passwordRequired) return "No";
  return review.password && review.password.trim() ? `Yes — ${review.password}` : "Yes";
}

function buildStars(value) {
  const rounded = roundToHalf(Number(value));
  let html = '<div class="stars" aria-label="' + rounded.toFixed(1) + ' out of 5 stars">';
  for (let i = 1; i <= 5; i += 1) {
    let cls = 'empty';
    if (rounded >= i) cls = 'full';
    else if (rounded >= i - 0.5) cls = 'half';
    html += `<span class="star ${cls}">★</span>`;
  }
  html += '</div>';
  return html;
}

function renderSubRating(label, value) {
  return `
    <div class="sub-rating-row">
      <span class="sub-rating-label">${escapeHtml(label)}</span>
      ${buildStars(value)}
      <span class="sub-rating-score">${Number(value).toFixed(1)}</span>
    </div>
  `;
}

function renderTopRating(review) {
  const overall = overallRating(review);
  return `
    <div class="overall-line">
      <div>
        <div class="rating-kicker">Overall</div>
        ${buildStars(overall)}
      </div>
      <div class="rating-score">${overall.toFixed(1)}</div>
    </div>
    <div class="sub-ratings">
      ${renderSubRating('Cleanliness', review.cleanliness)}
      ${renderSubRating('Aesthetics', review.aesthetics)}
      ${renderSubRating('Facilities', review.facilities)}
    </div>
  `;
}

function renderPreviewOverall(review) {
  const overall = overallRating(review);
  return `
    <div class="preview-overall">
      <span class="preview-overall-label">Overall</span>
      ${buildStars(overall)}
      <span class="preview-overall-score">${overall.toFixed(1)}</span>
    </div>
  `;
}


function reviewTags(review) {
  const tags = [];
  if (review.featured) {
    tags.push(`<span class="tag featured-tag">Featured Toilet</span>`);
  }
  tags.push(
    ...[
      ['Location', review.location],
      ['Area', review.area],
      ['Neighborhood', review.neighborhood],
      ['Suitable for', review.suitableFor],
      ['Accessibility', review.accessibility],
      ['Password?', formatPassword(review)],
      ['Review Date', formatDate(review.date)]
    ].map(([label, value]) => `<span class="tag"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</span>`)
  );
  return tags.join('');
}

function matchesSuitable(review, suitable) {
  if (suitable === 'all') return true;
  if (suitable === 'No. 1') return review.suitableFor === 'No. 1';
  if (suitable === 'No. 1 & No. 2') return review.suitableFor === 'No. 1 & No. 2' || review.suitableFor === 'No. 1';
  return review.suitableFor === suitable;
}

function normalizeBasePath(base) {
  if (!base || base === '.' || base === './') return '';
  return base;
}

function getBasePath() {
  return normalizeBasePath(document.body.dataset.basePath || '');
}

function reviewUrl(slug) {
  return `${getBasePath()}reviews/${slug}/`;
}

function renderSideMenu() {
  const nav = document.getElementById('sideNav');
  if (!nav) return;
  const basePath = getBasePath();
  const includeAdmin = document.body.dataset.includeAdminLink === 'true';
  const isReviewsPath = window.location.pathname.includes('/reviews/');
  const links = [...REVIEWS]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((review) => `<a class="side-sub-link" href="${reviewUrl(review.slug)}">${escapeHtml(review.title)}</a>`)
    .join('');

  nav.innerHTML = `
    <a class="side-link" href="${basePath}index.html">Home</a>
    <div class="side-nav-group ${isReviewsPath ? 'is-open' : ''}">
      <button class="side-group-toggle" type="button" aria-expanded="${isReviewsPath ? 'true' : 'false'}" aria-controls="menuReviewsSubnav">
        <span>Reviews</span>
        <span class="chevron" aria-hidden="true">▾</span>
      </button>
      <div class="side-sub-links" id="menuReviewsSubnav" ${isReviewsPath ? '' : 'hidden'}>
        <a class="side-sub-link" href="${basePath}reviews/">All reviews</a>
        ${links}
      </div>
    </div>
    ${includeAdmin ? `<a class="side-link" href="${basePath}admin/">Admin</a>` : ''}
  `;

  const toggle = nav.querySelector('.side-group-toggle');
  const group = nav.querySelector('.side-nav-group');
  const subnav = nav.querySelector('#menuReviewsSubnav');
  if (toggle && group && subnav) {
    toggle.addEventListener('click', () => {
      const willOpen = subnav.hasAttribute('hidden');
      subnav.toggleAttribute('hidden');
      group.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  }
}

function getFilteredReviews() {
  const searchInput = document.getElementById('searchInput');
  const areaFilter = document.getElementById('areaFilter');
  const neighborhoodFilter = document.getElementById('neighborhoodFilter');
  const suitableFilter = document.getElementById('suitableFilter');
  const sortSelect = document.getElementById('sortSelect');
  const query = (searchInput?.value || '').trim().toLowerCase();
  const area = areaFilter?.value || 'all';
  const neighborhood = neighborhoodFilter?.value || 'all';
  const suitable = suitableFilter?.value || 'all';
  const sort = sortSelect?.value || 'featured';

  const filtered = REVIEWS.filter((review) => {
    const searchable = [
      review.title,
      review.location,
      review.area,
      review.neighborhood,
      review.suitableFor,
      review.accessibility,
      review.passwordRequired ? 'yes' : 'no',
      review.password,
      review.summary,
      review.otherNotes
    ].join(' ').toLowerCase();

    return (!query || searchable.includes(query)) &&
      (area === 'all' || review.area === area) &&
      (neighborhood === 'all' || review.neighborhood === neighborhood) &&
      matchesSuitable(review, suitable);
  });

  filtered.sort((a, b) => {
    if (sort === 'featured') {
      if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
      return new Date(b.date) - new Date(a.date);
    }
    if (sort === 'newest') return new Date(b.date) - new Date(a.date);
    if (sort === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sort === 'highest') return overallRating(b) - overallRating(a) || new Date(b.date) - new Date(a.date);
    if (sort === 'lowest') return overallRating(a) - overallRating(b) || new Date(b.date) - new Date(a.date);
    if (sort === 'area') return a.area.localeCompare(b.area) || new Date(b.date) - new Date(a.date);
    if (sort === 'neighborhood') return a.neighborhood.localeCompare(b.neighborhood) || new Date(b.date) - new Date(a.date);
    return 0;
  });

  return filtered;
}

function populateSelect(selectEl, values, allLabel) {
  if (!selectEl) return;
  const current = selectEl.value;
  selectEl.innerHTML = `<option value="all">${allLabel}</option>` +
    values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
  selectEl.value = values.includes(current) ? current : 'all';
}

function renderFilters() {
  populateSelect(document.getElementById('areaFilter'), [...new Set(REVIEWS.map(r => r.area))].sort((a,b)=>a.localeCompare(b)), 'All areas');
  populateSelect(document.getElementById('neighborhoodFilter'), [...new Set(REVIEWS.map(r => r.neighborhood))].sort((a,b)=>a.localeCompare(b)), 'All neighborhoods');
}

function updateStats(items) {
  const total = items.length;
  const average = total ? (items.reduce((sum, item) => sum + overallRating(item), 0) / total).toFixed(1) : '0.0';
  const neighborhoods = new Set(items.map(item => item.neighborhood)).size;
  const passwordFree = items.filter(item => !item.passwordRequired).length;

  const sc = document.getElementById('stat-count');
  const sa = document.getElementById('stat-average');
  const sn = document.getElementById('stat-neighborhoods');
  const sp = document.getElementById('stat-password-free');
  if (sc) sc.textContent = total;
  if (sa) sa.textContent = average;
  if (sn) sn.textContent = neighborhoods;
  if (sp) sp.textContent = passwordFree;
}

function renderHomePreview() {
  const root = document.getElementById('latestReviews');
  if (!root) return;
  const latest = [...REVIEWS].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  root.innerHTML = latest.map(review => `
    <a class="preview-card" href="${reviewUrl(review.slug)}">
      <div class="preview-top">
        <h3>${escapeHtml(review.title)}</h3>
        <span class="open-pill"><span class="desktop-copy">Read review</span><span class="mobile-copy">Tap to expand</span></span>
      </div>
      ${renderPreviewOverall(review)}
      <p class="preview-copy">${escapeHtml(review.summary)}</p>
      <div class="preview-tags">${reviewTags(review)}</div>
    </a>
  `).join('');
}

function renderReviewsIndex() {
  const grid = document.getElementById('reviewGrid');
  if (!grid) return;
  const resultsCount = document.getElementById('results-count');
  const visible = getFilteredReviews();
  if (resultsCount) resultsCount.textContent = `${visible.length} result${visible.length === 1 ? '' : 's'}`;
  updateStats(visible);

  if (!visible.length) {
    grid.innerHTML = '<div class="empty-state">No reviews match the current search and filter settings.</div>';
    return;
  }

  grid.innerHTML = visible.map(review => `
    <a class="review-card" href="${reviewUrl(review.slug)}">
      <div class="review-card-head">
        <h3>${escapeHtml(review.title)}</h3>
        <span class="open-pill"><span class="desktop-copy">Read review</span><span class="mobile-copy">Tap to expand</span></span>
      </div>
      ${renderTopRating(review)}
      <div class="review-text-panel">${escapeHtml(review.summary)}</div>
      ${review.otherNotes && review.otherNotes.trim() ? `
        <div class="other-notes">
          <span class="other-notes-title">Other Notes</span>
          <div class="other-notes-text">${escapeHtml(review.otherNotes)}</div>
        </div>
      ` : ''}
      <div class="review-tags">${reviewTags(review)}</div>
    </a>
  `).join('');
}

function inferSlugFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const reviewsIndex = parts.lastIndexOf('reviews');
  if (reviewsIndex >= 0 && parts[reviewsIndex + 1]) return parts[reviewsIndex + 1];
  return '';
}

function renderReviewDetail() {
  const root = document.getElementById('reviewDetail');
  if (!root) return;
  const slug = document.body.dataset.reviewSlug || inferSlugFromPath();
  const review = REVIEWS.find(item => item.slug === slug);
  if (!review) {
    root.innerHTML = '<div class="empty-state">Review not found.</div>';
    return;
  }
  document.title = `${review.title} | Where to Poop: Toronto`;
  root.innerHTML = `
    <article class="detail-card">
      <div class="detail-header">
        <div>
          <div class="eyebrow">Toronto toilet review</div>
          <h1>${escapeHtml(review.title)}</h1>
          ${review.featured ? '<div class="detail-featured-wrap"><span class="tag featured-tag detail-featured-tag">Featured Toilet</span></div>' : ''}
        </div>
        <a class="inline-button" href="${getBasePath()}reviews/">Back to reviews</a>
      </div>
      ${renderTopRating(review)}
      <div class="review-text-panel detail-copy">${escapeHtml(review.summary)}</div>
      ${review.otherNotes && review.otherNotes.trim() ? `
        <div class="other-notes detail-notes">
          <span class="other-notes-title">Other Notes</span>
          <div class="other-notes-text">${escapeHtml(review.otherNotes)}</div>
        </div>
      ` : ''}
      <div class="review-tags detail-tags">${reviewTags(review)}</div>
    </article>
  `;
}

function setupMenu() {
  const button = document.getElementById('menuButton');
  const close = document.getElementById('menuClose');
  const menu = document.getElementById('sideMenu');
  const scrim = document.getElementById('menuScrim');
  if (!button || !close || !menu || !scrim) return;

  const openMenu = () => {
    menu.classList.add('is-open');
    scrim.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };
  const closeMenu = () => {
    menu.classList.remove('is-open');
    scrim.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  button.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);
  scrim.addEventListener('click', closeMenu);
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
}

function bindReviewControls() {
  ['searchInput', 'areaFilter', 'neighborhoodFilter', 'suitableFilter', 'sortSelect'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', renderReviewsIndex);
    el.addEventListener('change', renderReviewsIndex);
  });
}

function createReviewObject(formData) {
  return {
    title: formData.title.trim(),
    slug: formData.slug.trim(),
    location: formData.location.trim(),
    area: formData.area.trim(),
    neighborhood: formData.neighborhood.trim(),
    suitableFor: formData.suitableFor,
    accessibility: formData.accessibility,
    passwordRequired: Boolean(formData.passwordRequired),
    password: formData.passwordRequired ? formData.password.trim() : '',
    featured: Boolean(formData.featured),
    cleanliness: Number(formData.cleanliness),
    aesthetics: Number(formData.aesthetics),
    facilities: Number(formData.facilities),
    date: formData.date,
    summary: formData.summary.trim(),
    otherNotes: formData.otherNotes.trim()
  };
}

function buildReviewObjectSnippet(review) {
  return JSON.stringify(review, null, 2) + ',';
}

function buildUpdatedScriptText(reviews, currentScriptText) {
  const incoming = Array.isArray(reviews) ? reviews : [reviews];
  const reviewMap = new Map(REVIEWS.map((item) => [item.slug, item]));
  incoming.forEach((review) => reviewMap.set(review.slug, review));
  const merged = [...reviewMap.values()].sort((a, b) => new Date(b.date) - new Date(a.date));
  const newBlock = `const REVIEWS = ${JSON.stringify(merged, null, 2)};`;
  return currentScriptText.replace(/const REVIEWS = \[.*?\];/s, newBlock);
}

function buildReviewPageHtml(review) {
  return GENERIC_REVIEW_PAGE_TEMPLATE.replace('<title>Review | Where to Poop: Toronto</title>', `<title>${escapeHtml(review.title)} | Where to Poop: Toronto</title>`);
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function ratingOptions() {
  return [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
}

function populateRatingSelect(select) {
  if (!select) return;
  select.innerHTML = ratingOptions().map((value) => `<option value="${value}">${value.toFixed(1)}</option>`).join('');
}

function renderAdminPage() {
  const form = document.getElementById('adminForm');
  if (!form) return;

  const titleInput = document.getElementById('reviewTitle');
  const slugInput = document.getElementById('reviewSlug');
  const passwordRequired = document.getElementById('reviewPasswordRequired');
  const passwordWrap = document.getElementById('passwordFieldWrap');
  const passwordInput = document.getElementById('reviewPassword');
  const status = document.getElementById('adminStatus');
  const overallPreview = document.getElementById('overallPreview');
  const folderPathOutput = document.getElementById('folderPathOutput');
  const objectOutput = document.getElementById('reviewObjectOutput');
  const pageOutput = document.getElementById('reviewPageOutput');
  const copyObjectButton = document.getElementById('copyObjectButton');
  const downloadScriptButton = document.getElementById('downloadScriptButton');
  const downloadPageButton = document.getElementById('downloadPageButton');
  const downloadBundleButton = document.getElementById('downloadBundleButton');
  const clearFormButton = document.getElementById('clearFormButton');
  const queuedList = document.getElementById('queuedList');
  const batchSummary = document.getElementById('batchSummary');
  const bundleContentsList = document.getElementById('bundleContentsList');
  const ratings = ['reviewCleanliness', 'reviewAesthetics', 'reviewFacilities'];
  ratings.forEach((id) => populateRatingSelect(document.getElementById(id)));

  let currentScriptText = '';
  let lastObjectSnippet = '';
  let lastPageHtml = '';
  let lastScriptText = '';
  let queuedReviews = [];

  function resetFormState() {
    form.reset();
    document.getElementById('reviewDate').valueAsDate = new Date();
    document.getElementById('reviewCleanliness').value = '4.0';
    document.getElementById('reviewAesthetics').value = '4.0';
    document.getElementById('reviewFacilities').value = '4.0';
    document.getElementById('reviewSuitable').value = 'No. 1';
    document.getElementById('reviewAccessibility').value = 'Limited';
    updatePreviewState();
  }

  fetch(`${getBasePath()}script.js`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((text) => {
      currentScriptText = text;
      status.innerHTML = 'Current <code>script.js</code> loaded. Add one or more reviews to the batch, then download a combined update.';
      rebuildOutputs();
    })
    .catch((error) => {
      status.innerHTML = 'Could not load <code>script.js</code> automatically. You can still queue reviews and export their page files, but the combined <code>script.js</code> download will be unavailable until this page can read the current script. Error: ' + escapeHtml(error.message);
      rebuildOutputs();
    });

  function readForm() {
    return {
      title: titleInput.value,
      slug: slugInput.value,
      location: document.getElementById('reviewLocation').value,
      area: document.getElementById('reviewArea').value,
      neighborhood: document.getElementById('reviewNeighborhood').value,
      suitableFor: document.getElementById('reviewSuitable').value,
      accessibility: document.getElementById('reviewAccessibility').value,
      passwordRequired: passwordRequired.checked,
      password: passwordInput.value,
      featured: document.getElementById('reviewFeatured').checked,
      cleanliness: document.getElementById('reviewCleanliness').value,
      aesthetics: document.getElementById('reviewAesthetics').value,
      facilities: document.getElementById('reviewFacilities').value,
      date: document.getElementById('reviewDate').value,
      summary: document.getElementById('reviewSummary').value,
      otherNotes: document.getElementById('reviewOtherNotes').value
    };
  }

  function updatePreviewState() {
    const overall = roundToHalf((Number(document.getElementById('reviewCleanliness').value) + Number(document.getElementById('reviewAesthetics').value) + Number(document.getElementById('reviewFacilities').value)) / 3);
    overallPreview.textContent = overall.toFixed(1);
    passwordWrap.classList.toggle('hidden', !passwordRequired.checked);
    if (!passwordRequired.checked) passwordInput.value = '';
    const slug = slugInput.value.trim() || 'your-slug';
    folderPathOutput.textContent = `reviews/${slug}/`;
  }

  function queueSummaryHtml(review) {
    const overall = overallRating(review).toFixed(1);
    return `
      <div class="queued-item" data-queued-slug="${escapeHtml(review.slug)}">
        <div class="queued-item-main">
          <div class="queued-item-head">
            <div>
              <div class="queued-item-title">${escapeHtml(review.title)}</div>
              <div class="form-help">reviews/${escapeHtml(review.slug)}/</div>
            </div>
          </div>
          <div class="queued-item-meta">
            <span class="queued-pill">${escapeHtml(review.area)}</span>
            <span class="queued-pill">${escapeHtml(review.neighborhood)}</span>
            <span class="queued-pill">${escapeHtml(review.suitableFor)}</span>
            <span class="queued-pill">Overall ${overall}</span>
          </div>
        </div>
        <div class="queued-actions">
          <button class="small-button" type="button" data-queued-download="${escapeHtml(review.slug)}">Page</button>
          <button class="small-button danger" type="button" data-queued-remove="${escapeHtml(review.slug)}">Remove</button>
        </div>
      </div>
    `;
  }

  function rebuildOutputs() {
    if (currentScriptText && queuedReviews.length) {
      lastScriptText = buildUpdatedScriptText(queuedReviews, currentScriptText);
    } else {
      lastScriptText = '';
    }

    batchSummary.innerHTML = queuedReviews.length
      ? `${queuedReviews.length} review${queuedReviews.length === 1 ? '' : 's'} queued for export.`
      : 'No queued reviews yet.';

    queuedList.innerHTML = queuedReviews.length
      ? queuedReviews.map(queueSummaryHtml).join('')
      : '<div class="form-help">Add a review to the batch and it will appear here.</div>';

    bundleContentsList.innerHTML = queuedReviews.length
      ? `<li>An updated root <code>script.js</code>.</li>` + queuedReviews.map((review) => `<li><code>reviews/${escapeHtml(review.slug)}/index.html</code></li>`).join('')
      : '<li>An updated root <code>script.js</code>.</li><li>One new <code>reviews/&lt;slug&gt;/index.html</code> page for each queued review.</li><li>A short manifest text file listing the generated paths.</li>';

    queuedList.querySelectorAll('[data-queued-remove]').forEach((button) => {
      button.addEventListener('click', () => {
        const slug = button.getAttribute('data-queued-remove');
        queuedReviews = queuedReviews.filter((review) => review.slug !== slug);
        rebuildOutputs();
        status.innerHTML = queuedReviews.length
          ? 'Batch updated. You can keep adding reviews or download the consolidated export.'
          : 'Batch cleared. Add a review to generate new files.';
      });
    });

    queuedList.querySelectorAll('[data-queued-download]').forEach((button) => {
      button.addEventListener('click', () => {
        const slug = button.getAttribute('data-queued-download');
        const review = queuedReviews.find((item) => item.slug === slug);
        if (!review) return;
        downloadText(`${review.slug}-index.html`, buildReviewPageHtml(review));
      });
    });
  }

  async function downloadBundle() {
    if (!queuedReviews.length) return;
    if (typeof JSZip === 'undefined') {
      status.innerHTML = 'The zip library did not load, so the bundle download is unavailable right now. Refresh the page and try again.';
      return;
    }
    if (!lastScriptText) {
      status.innerHTML = 'The current <code>script.js</code> is not loaded, so the bundle cannot be built yet.';
      return;
    }

    const zip = new JSZip();
    zip.file('script.js', lastScriptText);
    const manifest = [
      'Where to Poop: Toronto batch export',
      '',
      'Files included:',
      'script.js',
      ...queuedReviews.map((review) => `reviews/${review.slug}/index.html`)
    ].join('\n');
    zip.file('batch-manifest.txt', manifest);
    queuedReviews.forEach((review) => {
      zip.file(`reviews/${review.slug}/index.html`, buildReviewPageHtml(review));
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `where-to-poop-batch-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  titleInput.addEventListener('input', () => {
    const auto = slugify(titleInput.value);
    slugInput.value = auto;
    updatePreviewState();
  });
  slugInput.addEventListener('input', updatePreviewState);
  passwordRequired.addEventListener('change', updatePreviewState);
  ratings.forEach((id) => document.getElementById(id).addEventListener('change', updatePreviewState));
  clearFormButton.addEventListener('click', resetFormState);
  resetFormState();
  rebuildOutputs();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const review = createReviewObject(readForm());

    if (!review.slug) {
      status.innerHTML = 'The slug cannot be empty.';
      return;
    }
    if (REVIEWS.some((item) => item.slug === review.slug) || queuedReviews.some((item) => item.slug === review.slug)) {
      status.innerHTML = 'That slug already exists in the current data or in the batch queue. Change it before adding this review.';
      return;
    }

    lastObjectSnippet = buildReviewObjectSnippet(review);
    lastPageHtml = buildReviewPageHtml(review);
    objectOutput.value = lastObjectSnippet;
    pageOutput.value = lastPageHtml;
    queuedReviews = [...queuedReviews, review].sort((a, b) => new Date(b.date) - new Date(a.date));
    rebuildOutputs();
    status.innerHTML = `Added <code>${escapeHtml(review.title)}</code> to the batch. Download the combined export whenever you are ready.`;
    resetFormState();
  });

  copyObjectButton.addEventListener('click', async () => {
    if (!lastObjectSnippet) return;
    await navigator.clipboard.writeText(lastObjectSnippet);
    copyObjectButton.textContent = 'Copied';
    setTimeout(() => { copyObjectButton.textContent = 'Copy latest review object'; }, 1200);
  });

  downloadScriptButton.addEventListener('click', () => {
    if (!lastScriptText) return;
    downloadText('script.js', lastScriptText);
  });

  downloadPageButton.addEventListener('click', () => {
    if (!lastPageHtml) return;
    const slug = lastObjectSnippet ? JSON.parse(lastObjectSnippet.slice(0, -1)).slug : 'review';
    downloadText(`${slug}-index.html`, lastPageHtml);
  });

  downloadBundleButton.addEventListener('click', () => {
    downloadBundle();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderSideMenu();
  setupMenu();
  renderFilters();
  updateStats(REVIEWS);
  renderHomePreview();
  bindReviewControls();
  renderReviewsIndex();
  renderReviewDetail();
  renderAdminPage();
});
