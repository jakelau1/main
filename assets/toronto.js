(function(){
  const isToronto = document.body.classList.contains('theme-toronto');
  const isHongKong = document.body.classList.contains('theme-hk');
  if (!isToronto && !isHongKong) return;
  const cfg = isHongKong ? {
    title: 'Where to Poop: Hong Kong',
    detailTitle: 'Hong Kong Review | Nihilists Take Their Coffee Black',
    active: 'where-to-poop-hong-kong',
    content: 'hong-kong-reviews.json',
    root: 'where-to-poop-hong-kong',
    hero: '2.jpg',
    heroPosition: 'center 24%',
    empty: 'The Hong Kong guide will appear here once the first review enters the archive.'
  } : {
    title: 'Where to Poop: Toronto',
    detailTitle: 'Toronto Review | Nihilists Take Their Coffee Black',
    active: 'where-to-poop-toronto',
    content: 'toronto-reviews.json',
    root: 'where-to-poop-toronto',
    hero: '1.jpg',
    heroPosition: 'center 12%',
    empty: 'The Toronto guide will appear here once the first review enters the archive.'
  };
  const shared = window.NTTCB || {};
  const esc = shared.esc || ((t)=>String(t ?? ''));
  const renderMarkdownBlock = shared.renderMarkdownBlock || ((t)=>`<p>${esc(t)}</p>`);
  const prettyDate = shared.prettyDate || ((iso)=>iso||'');
  const stars = shared.stars || (()=>'');
  let indexReviewsCache = [];

  function roundHalf(v){ return Math.round(v*2)/2; }
  function overall(r){ return r.overall ?? roundHalf((Number(r.cleanliness||0)+Number(r.aesthetics||0)+Number(r.facilities||0))/3); }
  function sortLatest(a,b){ return (b.date||'').localeCompare(a.date||''); }
  function sortFeatured(a,b){ if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1; return (b.date||'').localeCompare(a.date||''); }
  function emptyCard(message){ return `<article class="empty-card stack"><span class="coming-soon">Coming soon</span><p class="lead">${esc(message || cfg.empty)}</p></article>`; }
  function uniqueValues(items, key){ return [...new Set(items.map((item)=>String(item[key] || '').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b)); }
  function option(value, label){ return `<option value="${esc(value)}">${esc(label ?? value)}</option>`; }

  function card(review, hrefPrefix){
    const ovr=overall(review).toFixed(1);
    const passwordText = review.passwordRequired ? review.password : 'No';
    return `<article class="review-card stack"><div class="rating-line"><div class="overall-wrap"><span class="eyebrow-label">Overall</span><span class="stars-wrap overall-stars"><span class="stars">${stars(Number(ovr))}</span><span class="rating-mini-number">${ovr}</span></span></div></div><h3>${esc(review.title)}</h3><p class="review-date">Review Date: ${prettyDate(review.date)}</p><div class="sub-ratings"><div><span>Cleanliness</span><span class="stars-wrap"><span class="stars">${stars(Number(review.cleanliness))}</span><span class="rating-mini-number">${Number(review.cleanliness).toFixed(1)}</span></span></div><div><span>Aesthetics</span><span class="stars-wrap"><span class="stars">${stars(Number(review.aesthetics))}</span><span class="rating-mini-number">${Number(review.aesthetics).toFixed(1)}</span></span></div><div><span>Facilities</span><span class="stars-wrap"><span class="stars">${stars(Number(review.facilities))}</span><span class="rating-mini-number">${Number(review.facilities).toFixed(1)}</span></span></div></div><div class="text-panel markdown-body">${renderMarkdownBlock(review.summary)}</div><div class="tag-row bottom-tags">${review.featured ? '<span class="tiny-tag featured">Featured Toilet</span>' : ''}<span class="tiny-tag">Location: ${esc(review.location)}</span><span class="tiny-tag">Area: ${esc(review.area)}</span><span class="tiny-tag">Neighborhood: ${esc(review.neighborhood)}</span><span class="tiny-tag">Accessibility: ${esc(review.accessibility)}</span><span class="tiny-tag">Suitable for: ${esc(review.suitableFor)}</span><span class="tiny-tag">Password: ${esc(passwordText)}</span></div><div class="cta-inline"><a class="mini-link" href="${hrefPrefix}reviews/${esc(review.slug)}/index.html">Read review</a></div></article>`;
  }

  function renderStats(reviews){ const stats=document.getElementById('torontoStats'); if(!stats) return; if(!reviews.length){ stats.innerHTML=emptyCard(cfg.empty); return; } const avg=reviews.length ? (reviews.reduce((s,r)=>s+overall(r),0)/reviews.length).toFixed(1) : '0.0'; const neighborhoods=new Set(reviews.map((r)=>r.neighborhood)).size; const passwordFree=reviews.filter((r)=>!r.passwordRequired).length; stats.innerHTML=`<div class="stats-grid"><div class="stat-card"><div class="stat-label">Total reviews</div><div class="stat-value">${reviews.length}</div></div><div class="stat-card"><div class="stat-label">Average overall</div><div class="stat-value">${avg}</div></div><div class="stat-card"><div class="stat-label">Neighborhoods covered</div><div class="stat-value">${neighborhoods}</div></div><div class="stat-card"><div class="stat-label">Password-free spots</div><div class="stat-value">${passwordFree}</div></div></div>`; }
  function renderHome(reviews){ renderStats(reviews); const holder=document.getElementById('latestTorontoReviews'); if(holder) holder.innerHTML = reviews.length ? reviews.slice().sort(sortLatest).slice(0,3).map((r)=>card(r,'')).join('') : emptyCard(cfg.empty); }

  function ensureIndexControls(reviews){
    const holder=document.getElementById('torontoReviewIndex');
    if(!holder || !reviews.length) return null;
    let controls=document.getElementById('wtpReviewControls');
    if(!controls){
      holder.insertAdjacentHTML('beforebegin', `<section class="control-card wtp-filter-panel stack" id="wtpReviewControls" aria-label="Review filters"><div class="filter-panel-head"><div><h2>Find a toilet</h2><p class="lead">Filter by area, neighborhood, use case, accessibility, and featured status.</p></div><p class="filter-results" id="wtpFilterResults"></p></div><div class="wtp-filter-grid"><label>Area<select id="wtpAreaFilter"></select></label><label>Neighborhood<select id="wtpNeighborhoodFilter"></select></label><label>Suitable for<select id="wtpSuitableFilter"><option value="No. 1 & No. 2">No. 1 & No. 2</option><option value="No. 1">No. 1</option></select></label><label>Accessibility<select id="wtpAccessibilityFilter"></select></label><label>Featured Toilet first<select id="wtpFeaturedSort"><option value="yes">Yes</option><option value="no">No</option></select></label></div></section>`);
      controls=document.getElementById('wtpReviewControls');
      const areaEl=document.getElementById('wtpAreaFilter');
      const neighborhoodEl=document.getElementById('wtpNeighborhoodFilter');
      const suitableEl=document.getElementById('wtpSuitableFilter');
      const accessibilityEl=document.getElementById('wtpAccessibilityFilter');
      const featuredEl=document.getElementById('wtpFeaturedSort');

      if(areaEl) areaEl.addEventListener('change', () => {
        syncAreaToNeighborhoodOptions(indexReviewsCache);
        renderIndex(indexReviewsCache);
      });

      if(neighborhoodEl) neighborhoodEl.addEventListener('change', () => {
        syncNeighborhoodToArea(indexReviewsCache);
        renderIndex(indexReviewsCache);
      });

      [suitableEl, accessibilityEl, featuredEl].forEach((el)=>{
        if(el) el.addEventListener('change', () => renderIndex(indexReviewsCache));
      });
    }
    populateFilterOptions(reviews);
    return controls;
  }

  function areaForNeighborhood(reviews, neighborhood){
    if(!neighborhood || neighborhood === 'all') return 'all';
    const match=reviews.find((review)=>review.neighborhood === neighborhood);
    return match?.area || 'all';
  }

  function syncAreaToNeighborhoodOptions(reviews){
    const areaSelect=document.getElementById('wtpAreaFilter');
    const neighborhoodSelect=document.getElementById('wtpNeighborhoodFilter');
    if(!areaSelect || !neighborhoodSelect) return;
    const selectedArea=areaSelect.value || 'all';
    const currentNeighborhood=neighborhoodSelect.value || 'all';
    const neighborhoodSource = selectedArea === 'all' ? reviews : reviews.filter((review)=>review.area === selectedArea);
    const neighborhoods=uniqueValues(neighborhoodSource,'neighborhood');
    neighborhoodSelect.innerHTML = option('all','All neighborhoods') + neighborhoods.map((n)=>option(n)).join('');
    neighborhoodSelect.value = neighborhoods.includes(currentNeighborhood) ? currentNeighborhood : 'all';
  }

  function syncNeighborhoodToArea(reviews){
    const areaSelect=document.getElementById('wtpAreaFilter');
    const neighborhoodSelect=document.getElementById('wtpNeighborhoodFilter');
    if(!areaSelect || !neighborhoodSelect) return;
    const selectedNeighborhood=neighborhoodSelect.value || 'all';
    const inferredArea=areaForNeighborhood(reviews, selectedNeighborhood);
    if(inferredArea !== 'all') areaSelect.value = inferredArea;
    syncAreaToNeighborhoodOptions(reviews);
    if(selectedNeighborhood !== 'all') neighborhoodSelect.value = selectedNeighborhood;
  }

  function populateFilterOptions(reviews){
    const areaSelect=document.getElementById('wtpAreaFilter');
    const neighborhoodSelect=document.getElementById('wtpNeighborhoodFilter');
    const accessibilitySelect=document.getElementById('wtpAccessibilityFilter');
    if(!areaSelect || !neighborhoodSelect || !accessibilitySelect) return;

    const currentNeighborhood=neighborhoodSelect.value || 'all';
    const inferredArea=areaForNeighborhood(reviews, currentNeighborhood);
    const currentArea=areaSelect.value || inferredArea || 'all';
    const currentAccessibility=accessibilitySelect.value || 'all';

    const areas=uniqueValues(reviews,'area');
    areaSelect.innerHTML = option('all','All areas') + areas.map((area)=>option(area)).join('');
    areaSelect.value = areas.includes(currentArea) ? currentArea : (areas.includes(inferredArea) ? inferredArea : 'all');

    const neighborhoodSource = areaSelect.value === 'all' ? reviews : reviews.filter((r)=>r.area === areaSelect.value);
    const neighborhoods=uniqueValues(neighborhoodSource,'neighborhood');
    neighborhoodSelect.innerHTML = option('all','All neighborhoods') + neighborhoods.map((n)=>option(n)).join('');
    neighborhoodSelect.value = neighborhoods.includes(currentNeighborhood) ? currentNeighborhood : 'all';

    const accessibility=uniqueValues(reviews,'accessibility');
    accessibilitySelect.innerHTML = option('all','All access levels') + accessibility.map((a)=>option(a)).join('');
    accessibilitySelect.value = accessibility.includes(currentAccessibility) ? currentAccessibility : 'all';
  }

  function getFilterValues(){
    return {
      area: document.getElementById('wtpAreaFilter')?.value || 'all',
      neighborhood: document.getElementById('wtpNeighborhoodFilter')?.value || 'all',
      suitable: document.getElementById('wtpSuitableFilter')?.value || 'all',
      accessibility: document.getElementById('wtpAccessibilityFilter')?.value || 'all',
      featuredFirst: document.getElementById('wtpFeaturedSort')?.value || 'yes'
    };
  }

  function matchesSuitableFor(review, requested){
    if(requested === 'all') return true;
    if(requested === 'No. 1') return review.suitableFor === 'No. 1';
    if(requested === 'No. 1 & No. 2') return review.suitableFor === 'No. 1' || review.suitableFor === 'No. 1 & No. 2';
    return review.suitableFor === requested;
  }

  function filterAndSortReviews(reviews){
    const filters=getFilterValues();
    let visible=reviews.filter((review)=>{
      if(filters.area !== 'all' && review.area !== filters.area) return false;
      if(filters.neighborhood !== 'all' && review.neighborhood !== filters.neighborhood) return false;
      if(filters.accessibility !== 'all' && review.accessibility !== filters.accessibility) return false;
      if(!matchesSuitableFor(review, filters.suitable)) return false;
      return true;
    });
    visible.sort(filters.featuredFirst === 'yes' ? sortFeatured : sortLatest);
    return visible;
  }

  function renderIndex(reviews){
    indexReviewsCache = reviews.slice();
    const holder=document.getElementById('torontoReviewIndex');
    if(!holder) return;
    if(!reviews.length){ holder.innerHTML = emptyCard(cfg.empty); return; }
    ensureIndexControls(reviews);
    const visible=filterAndSortReviews(reviews);
    const count=document.getElementById('wtpFilterResults');
    if(count) count.textContent = `${visible.length} result${visible.length === 1 ? '' : 's'}`;
    holder.innerHTML = visible.length ? visible.map((r)=>card(r,'../')).join('') : `<article class="empty-card stack"><span class="coming-soon">No matches</span><p class="lead">No toilets match the current filters.</p></article>`;
  }

  function detailSlug(){ const parts=window.location.pathname.split('/').filter(Boolean); return parts[parts.length-2]||''; }
  function renderDetail(reviews){
    const hero=document.getElementById('torontoDetailHero');
    const detail=document.getElementById('torontoDetailBody');
    if(!hero||!detail) return;
    const review=reviews.find((e)=>e.slug===detailSlug());
    if(!review){
      hero.innerHTML='<h1>Review not found</h1><p class="lead">This review does not exist yet.</p>';
      detail.innerHTML='<div class="text-panel"><p>Return to the index and try another listing.</p></div><div class="cta-inline"><a class="btn" href="../index.html">Back to all reviews</a></div>';
      return;
    }
    const ovr=overall(review).toFixed(1);
    document.title=`${review.title} | Nihilists Take Their Coffee Black`;
    hero.innerHTML=`<h1>${esc(review.title)}</h1><p class="lead">Review Date: ${prettyDate(review.date)}</p>`;
    detail.innerHTML=`<div class="rating-line large"><div class="overall-wrap"><span class="eyebrow-label">Overall</span><span class="stars-wrap overall-stars"><span class="stars">${stars(Number(ovr))}</span><span class="rating-mini-number">${ovr}</span></span></div></div><div class="detail-grid"><div><span>Cleanliness</span><span class="stars-wrap"><span class="stars">${stars(Number(review.cleanliness))}</span><span class="rating-mini-number">${Number(review.cleanliness).toFixed(1)}</span></span></div><div><span>Aesthetics</span><span class="stars-wrap"><span class="stars">${stars(Number(review.aesthetics))}</span><span class="rating-mini-number">${Number(review.aesthetics).toFixed(1)}</span></span></div><div><span>Facilities</span><span class="stars-wrap"><span class="stars">${stars(Number(review.facilities))}</span><span class="rating-mini-number">${Number(review.facilities).toFixed(1)}</span></span></div></div><div class="text-panel markdown-body">${renderMarkdownBlock(review.summary)}</div>${review.otherNotes ? `<div class="note-panel markdown-body"><strong>Other Notes</strong>${renderMarkdownBlock(review.otherNotes)}</div>` : ''}<div class="tag-row bottom-tags">${review.featured ? '<span class="tiny-tag featured">Featured Toilet</span>' : ''}<span class="tiny-tag">Location: ${esc(review.location)}</span><span class="tiny-tag">Area: ${esc(review.area)}</span><span class="tiny-tag">Neighborhood: ${esc(review.neighborhood)}</span><span class="tiny-tag">Accessibility: ${esc(review.accessibility)}</span><span class="tiny-tag">Suitable for: ${esc(review.suitableFor)}</span><span class="tiny-tag">Password: ${esc(review.passwordRequired ? review.password : 'No')}</span></div><div class="cta-inline"><a class="btn" href="../index.html">Back to all reviews</a></div>`;
  }

  async function load(){
    let path=`../content/${cfg.content}`;
    const p=window.location.pathname;
    if(new RegExp(`/${cfg.root}/reviews/[^/]+/`).test(p)) path=`../../../content/${cfg.content}`;
    else if(p.includes(`/${cfg.root}/reviews/`)) path=`../../content/${cfg.content}`;
    const res=await fetch(path,{cache:'no-store'});
    const reviews=await res.json();
    if(document.getElementById('latestTorontoReviews')) renderHome(reviews);
    if(document.getElementById('torontoReviewIndex')) renderIndex(reviews);
    if(document.getElementById('torontoDetailBody')) renderDetail(reviews);
  }
  load().catch((err)=>{ console.error(err); renderHome([]); renderIndex([]); });
})();
