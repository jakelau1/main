
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
  async function loadPosts(){
    const holder = document.querySelector('[data-posts-section]');
    if (!holder) return;
    const section = holder.dataset.postsSection;
    const mode = holder.dataset.mode || 'writing';
    const path = holder.dataset.postsPath || '../content/posts.json';
    const emptyMessage = holder.dataset.emptyMessage || 'No posts published yet.';
    try {
      const res = await fetch(path, {cache:'no-store'});
      const data = await res.json();
      const posts = (data[section] || []).slice().sort((a,b) => (b.date || '').localeCompare(a.date || ''));
      if (!posts.length){
        holder.innerHTML = `<article class="empty-card stack"><h3>No published entries yet</h3><p class="lead">${esc(emptyMessage)}</p></article>`;
        return;
      }
      holder.classList.add(mode === 'album' ? 'album-grid' : 'post-grid');
      if (posts.length > 2 && mode !== 'album') holder.classList.add('three');
      holder.innerHTML = posts.map((post) => {
        const thumb = (post.media || []).find((m) => m.type && m.type.startsWith('image')) || (post.media || [])[0];
        const media = thumb ? (thumb.type && thumb.type.startsWith('video') ? `<div class="post-card-media"><video muted playsinline preload="metadata" src="${esc(thumb.path)}"></video></div>` : `<div class="${mode === 'album' ? 'album-card-media' : 'post-card-media'}"><img src="${esc(thumb.path)}" alt="${esc(post.title)}" /></div>`) : '';
        const tag = `<span class="tiny-tag">${prettyDate(post.date)}</span>`;
        return `<article class="content-card ${mode === 'album' ? 'album-card' : 'post-card'}">${media}<div class="stack"><h3>${esc(post.title)}</h3>${post.subtitle ? `<p class="lead">${esc(post.subtitle)}</p>` : ''}<div class="tag-row">${tag}</div>${mode === 'album' ? '' : `<div class="post-excerpt"><p>${esc(post.excerpt || '')}</p></div>`}<div class="cta-inline"><a class="mini-link" href="posts/${esc(post.slug)}/index.html">Read entry</a></div></div></article>`;
      }).join('');
    } catch (err){
      holder.innerHTML = `<article class="empty-card stack"><h3>Content unavailable</h3><p class="lead">The posts database could not be loaded.</p></article>`;
    }
  }
  loadPosts();
})();
