
(function(){
  const body = document.body;
  const toggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('menuOverlay');
  function closeMenu(){ body.classList.remove('menu-open'); if (toggle) toggle.setAttribute('aria-expanded','false'); }
  if (toggle && !toggle.hasAttribute('data-inline-menu')){ toggle.addEventListener('click', () => { const open = body.classList.toggle('menu-open'); toggle.setAttribute('aria-expanded', open ? 'true':'false'); }); }
  if (overlay && !overlay.hasAttribute('data-inline-menu')) overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  function esc(text){ return String(text ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function prettyDate(iso){ if (!iso) return ''; const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }); }
  function stars(rating){ const full=Math.floor(rating); const half=(rating-full)>=0.5?1:0; const empty=5-full-half; let out=''; for(let i=0;i<full;i++) out += '<span class="star full">★</span>'; if(half) out += '<span class="star half">★</span>'; for(let i=0;i<empty;i++) out += '<span class="star empty">★</span>'; return out; }
  function renderMarkdownInline(text){ let out=esc(text ?? ''); out=out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>'); out=out.replace(/\*\*\*([^*]+)\*\*\*/g,'<strong><em>$1</em></strong>'); out=out.replace(/__([^_]+)__/g,'<strong>$1</strong>'); out=out.replace(/\*\*([^*]+)\*\*/g,'<em>$1</em>'); out=out.replace(/\*([^*]+)\*/g,'<em>$1</em>'); return out; }
  function renderMarkdownBlock(text){ const source=String(text ?? '').trim(); if(!source) return ''; const chunks=source.split(/\n\s*\n/).filter(Boolean); return chunks.map((chunk)=>{ const lines=chunk.split(/\n/).map((line)=>line.trimEnd()); if(lines.every((line)=>/^[-*]\s+/.test(line))){ return `<ul>${lines.map((line)=>`<li>${renderMarkdownInline(line.replace(/^[-*]\s+/,''))}</li>`).join('')}</ul>`; } if(lines.every((line)=>/^\d+\.\s+/.test(line))){ return `<ol>${lines.map((line)=>`<li>${renderMarkdownInline(line.replace(/^\d+\.\s+/,''))}</li>`).join('')}</ol>`; } return `<p>${renderMarkdownInline(lines.join('<br>'))}</p>`; }).join(''); }
  function youtubeId(url){ const m=String(url||'').match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/); return m?m[1]:''; }
  function youtubeThumb(url){ const id=youtubeId(url); return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''; }
  window.NTTCB = Object.assign(window.NTTCB || {}, { esc, prettyDate, stars, renderMarkdownInline, renderMarkdownBlock, youtubeId, youtubeThumb });

  function normalizePostDetailLayout(){
    if (document.body.classList.contains('theme-toronto') || document.body.classList.contains('theme-hiking')) return;
    const main = document.querySelector('.main-shell');
    if (!main) return;
    const direct = Array.from(main.children);
    const mediaCards = direct.filter((node) => node.matches && node.matches('.content-card') && (node.querySelector('.media-grid') || node.querySelector('.video-embed')));
    const textCards = direct.filter((node) => node.matches && node.matches('.content-card') && node.querySelector('.text-panel'));
    if (!mediaCards.length || !textCards.length) return;
    const firstText = textCards[0];
    const parent = firstText.parentNode;
    mediaCards.forEach((card) => {
      if (card.compareDocumentPosition(firstText) & Node.DOCUMENT_POSITION_FOLLOWING) {
        parent.insertBefore(card, firstText);
      }
    });
  }

  function resolveMediaPath(section, slug, media){
    if (!media) return '';
    if (media.path) return media.path;
    if (media.filename) return `posts/${slug}/media/${media.filename}`;
    return '';
  }

  async function loadPosts(){
    const holder = document.querySelector('[data-posts-section]');
    if (!holder) return;
    const section = holder.dataset.postsSection;
    const mode = holder.dataset.mode || 'writing';
    const path = holder.dataset.postsPath || '../content/posts.json';
    const emptyMessage = holder.dataset.emptyMessage || 'New entries will appear here once the first post is published.';
    try {
      const res = await fetch(path, {cache:'no-store'});
      const data = await res.json();
      const posts = (data[section] || []).slice().sort((a,b) => (b.date || '').localeCompare(a.date || ''));
      if (!posts.length){
        holder.className='';
        holder.innerHTML = `<article class="empty-card stack"><span class="coming-soon">Coming soon</span><p class="lead">${renderMarkdownInline(emptyMessage)}</p></article>`;
        return;
      }
      holder.classList.add(mode === 'album' ? 'album-grid' : 'post-grid');
      if (posts.length > 2 && mode !== 'album') holder.classList.add('three');
      holder.innerHTML = posts.map((post) => {
        const thumbMedia = (post.media || []).find((m) => m.type && m.type.startsWith('image')) || (post.media || [])[0];
        let media = '';
        if (mode === 'piano' && post.youtubeUrl && youtubeId(post.youtubeUrl)) {
          media = `<div class="post-card-media"><img src="${esc(youtubeThumb(post.youtubeUrl))}" alt="${esc(post.title)}" /></div>`;
        } else if (thumbMedia) {
          const path = resolveMediaPath(section, post.slug, thumbMedia);
          media = thumbMedia.type && thumbMedia.type.startsWith('video') ? `<div class="post-card-media"><video muted playsinline preload="metadata" src="${esc(path)}"></video></div>` : `<div class="${mode === 'album' ? 'album-card-media' : 'post-card-media'}"><img src="${esc(path)}" alt="${esc(post.title)}" /></div>`;
        }
        const tag = `<span class="tiny-tag">${prettyDate(post.date)}</span>`;
        const excerpt = post.excerpt || post.subtitle || '';
        const cta = mode === 'piano' ? 'Open performance' : (mode === 'album' ? 'Open entry' : 'Read entry');
        const rating = Number(post.rating || 0);
        const ratingHtml = mode === 'media-review' && rating ? `<div class="rating-line compact"><div class="overall-wrap"><span class="eyebrow-label">Rating</span><span class="stars-wrap overall-stars"><span class="stars">${stars(rating)}</span><span class="rating-mini-number">${rating.toFixed(1)}</span></span></div></div>` : '';
        return `<article class="content-card ${mode === 'album' ? 'album-card' : 'post-card'}">${media}<div class="stack"><h3>${esc(post.title)}</h3>${post.subtitle ? `<p class="lead markdown-inline">${renderMarkdownInline(post.subtitle)}</p>` : ''}<div class="tag-row">${tag}${mode==='piano' && post.youtubeUrl ? '<span class="tiny-tag">YouTube</span>' : ''}</div>${ratingHtml}${mode === 'album' ? '' : `<div class="post-excerpt markdown-body">${renderMarkdownBlock(excerpt)}</div>`}<div class="cta-inline"><a class="mini-link" href="posts/${esc(post.slug)}/index.html">${cta}</a></div></div></article>`;
      }).join('');
    } catch (err){
      holder.className='';
      holder.innerHTML = `<article class="empty-card stack"><span class="coming-soon">Coming soon</span><p class="lead">The posts database could not be loaded.</p></article>`;
    }
  }
  loadPosts();
  normalizePostDetailLayout();
})();
