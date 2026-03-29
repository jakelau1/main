(function(){
  const body = document.body;
  const toggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('menuOverlay');
  function closeMenu(){ body.classList.remove('menu-open'); if (toggle) toggle.setAttribute('aria-expanded','false'); }
  if (toggle){ toggle.addEventListener('click', () => { const open = body.classList.toggle('menu-open'); toggle.setAttribute('aria-expanded', open ? 'true':'false'); }); }
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  function esc(text){
    return String(text ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function prettyDate(iso){
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
  }
  function stars(rating){
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let out = '';
    for(let i=0;i<full;i++) out += '<span class="star full">★</span>';
    if (half) out += '<span class="star half">★</span>';
    for(let i=0;i<empty;i++) out += '<span class="star empty">★</span>';
    return out;
  }
  function renderMarkdownInline(text){
    let out = esc(text ?? '');
    out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    out = out.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    out = out.replace(/\*\*([^*]+)\*\*/g, '<em>$1</em>');
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return out;
  }
  function renderMarkdownBlock(text){
    const source = String(text ?? '').trim();
    if (!source) return '';
    const chunks = source.split(/
\s*
/).filter(Boolean);
    return chunks.map((chunk) => {
      const lines = chunk.split(/
/).map((line) => line.trimEnd());
      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        return `<ul>${lines.map((line) => `<li>${renderMarkdownInline(line.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
      }
      if (lines.every((line) => /^\d+\.\s+/.test(line))) {
        return `<ol>${lines.map((line) => `<li>${renderMarkdownInline(line.replace(/^\d+\.\s+/, ''))}</li>`).join('')}</ol>`;
      }
      return `<p>${renderMarkdownInline(lines.join('<br>'))}</p>`;
    }).join('');
  }
  window.NTTCB = Object.assign(window.NTTCB || {}, { esc, prettyDate, stars, renderMarkdownInline, renderMarkdownBlock });

  async function loadPosts(){
    const holder = document.querySelector('[data-posts-section]');
    if (!holder) return;
    const section = holder.dataset.postsSection;
    const mode = holder.dataset.mode || 'writing';
    const path = holder.dataset.postsPath || '../content/posts.json';
    const emptyMessage = holder.dataset.emptyMessage || 'Coming soon';
    try {
      const res = await fetch(path, {cache:'no-store'});
      const data = await res.json();
      const posts = (data[section] || []).slice().sort((a,b) => (b.date || '').localeCompare(a.date || ''));
      if (!posts.length){
        holder.innerHTML = `<article class="empty-card stack"><h3>Coming soon</h3><p class="lead">${renderMarkdownInline(emptyMessage)}</p></article>`;
        return;
      }
      holder.classList.add(mode === 'album' ? 'album-grid' : 'post-grid');
      if (posts.length > 2 && mode !== 'album') holder.classList.add('three');
      holder.innerHTML = posts.map((post) => {
        const thumb = (post.media || []).find((m) => m.type === 'youtube') || (post.media || []).find((m) => m.type && m.type.startsWith('image')) || (post.media || [])[0];
        const media = thumb ? (thumb.type === 'youtube' ? `<div class="post-card-media video-embed"><iframe src="${esc(thumb.path)}" title="${esc(post.title)}" loading="lazy" allowfullscreen></iframe></div>` : thumb.type && thumb.type.startsWith('video') ? `<div class="post-card-media"><video muted playsinline preload="metadata" src="${esc(thumb.path)}"></video></div>` : `<div class="${mode === 'album' ? 'album-card-media' : 'post-card-media'}"><img src="${esc(thumb.path)}" alt="${esc(post.title)}" /></div>`) : '';
        const tag = `<span class="tiny-tag">${prettyDate(post.date)}</span>`;
        return `<article class="content-card ${mode === 'album' ? 'album-card' : 'post-card'}">${media}<div class="stack"><h3>${esc(post.title)}</h3>${post.subtitle ? `<p class="lead markdown-inline">${renderMarkdownInline(post.subtitle)}</p>` : ''}<div class="tag-row">${tag}</div>${mode === 'album' ? '' : `<div class="post-excerpt markdown-body">${renderMarkdownBlock(post.excerpt || '')}</div>`}<div class="cta-inline"><a class="mini-link" href="posts/${esc(post.slug)}/index.html">Read entry</a></div></div></article>`;
      }).join('');
    } catch (err){
      holder.innerHTML = `<article class="empty-card stack"><h3>Content unavailable</h3><p class="lead">The posts database could not be loaded.</p></article>`;
    }
  }
  loadPosts();
})();
