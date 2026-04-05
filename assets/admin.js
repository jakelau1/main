
const SECTIONS = {
  "where-to-poop-toronto": {
    "title": "Where to Poop: Toronto",
    "kind": "toilet"
  },
  "hiking-trails-hong-kong": {
    "title": "Hiking Trails: Hong Kong",
    "kind": "hiking"
  },
  "reflections-from-a-mountaintop": {
    "title": "Reflections from a Mountaintop",
    "theme": "theme-mountain",
    "hero_image": "11.jpg",
    "kind": "post"
  },
  "philosophical-yap-sessions": {
    "title": "Philosophical Yap Sessions",
    "theme": "theme-plum",
    "hero_image": "3.jpg",
    "kind": "post"
  },
  "reflections-of-a-casual-bouldering-enthusiast": {
    "title": "Reflections of a Casual Bouldering Enthusiast",
    "theme": "theme-forest",
    "hero_image": "4-new.jpg",
    "kind": "post"
  },
  "games-and-the-meaning-of-life": {
    "title": "Games and the Meaning of Life",
    "theme": "theme-games",
    "hero_image": "14.jpg",
    "kind": "post"
  },
  "piano": {
    "title": "Piano",
    "theme": "theme-piano",
    "hero_image": "9.jpg",
    "kind": "post",
    "piano": true
  },
  "book-and-media-reviews": {
    "title": "Book and Media Reviews",
    "theme": "theme-orange",
    "hero_image": "5.jpg",
    "kind": "post"
  },
  "kyle-the-dog": {
    "title": "Kyle the Dog",
    "theme": "theme-kyle",
    "hero_image": "6.jpg",
    "kind": "post"
  },
  "photos": {
    "title": "Photography",
    "theme": "theme-photos",
    "hero_image": "7.jpg",
    "kind": "post"
  },
  "doodling": {
    "title": "Doodling",
    "theme": "theme-doodling",
    "hero_image": "13.jpg",
    "kind": "post"
  },
  "cooking": {
    "title": "Cooking",
    "theme": "theme-cooking",
    "hero_image": "10.jpg",
    "kind": "post"
  }
};
let basePosts = {};
let baseReviews = [];
let baseHiking = [];
let queued = [];
const $ = (id) => document.getElementById(id);
const sectionSelect = $('sectionSelect');
const postFields = $('postFields');
const toiletFields = $('toiletFields');
const hikingFields = $('hikingFields');
const youtubeWrap = $('youtubeWrap');
const queueList = $('queueList');
const postTitle = $('postTitle');
const postSlug = $('postSlug');
const postSubtitle = $('postSubtitle');
const postDate = $('postDate');
const postExcerpt = $('postExcerpt');
const postBody = $('postBody');
const postMedia = $('postMedia');
const postYoutube = $('postYoutube');
const reviewTitle = $('reviewTitle');
const reviewSlug = $('reviewSlug');
const reviewDate = $('reviewDate');
const reviewLocation = $('reviewLocation');
const reviewArea = $('reviewArea');
const reviewNeighborhood = $('reviewNeighborhood');
const reviewSuitable = $('reviewSuitable');
const reviewAccessibility = $('reviewAccessibility');
const reviewPasswordRequired = $('reviewPasswordRequired');
const reviewPassword = $('reviewPassword');
const reviewFeatured = $('reviewFeatured');
const reviewCleanliness = $('reviewCleanliness');
const reviewAesthetics = $('reviewAesthetics');
const reviewFacilities = $('reviewFacilities');
const reviewSummary = $('reviewSummary');
const reviewOtherNotes = $('reviewOtherNotes');
const hikingTitle = $('hikingTitle');
const hikingSlug = $('hikingSlug');
const hikingDate = $('hikingDate');
const hikingLocation = $('hikingLocation');
const hikingArea = $('hikingArea');
const hikingNeighborhood = $('hikingNeighborhood');
const hikingAccessibility = $('hikingAccessibility');
const hikingFeatured = $('hikingFeatured');
const hikingDifficulty = $('hikingDifficulty');
const hikingBeauty = $('hikingBeauty');
const hikingSummary = $('hikingSummary');
const hikingOtherNotes = $('hikingOtherNotes');
const shared = window.NTTCB || {};
const esc = shared.esc;
const prettyDate = shared.prettyDate;
const renderMarkdownInline = shared.renderMarkdownInline;
const renderMarkdownBlock = shared.renderMarkdownBlock;
const youtubeId = shared.youtubeId;
function slugify(text){ return String(text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function roundHalf(v){ return Math.round(v * 2) / 2; }
function ratingOptions(){ let out=''; for(let i=1;i<=10;i++){ const value=(i/2).toFixed(1); out += `<option value="${value}">${value}</option>`; } return out; }
[reviewCleanliness, reviewAesthetics, reviewFacilities, hikingDifficulty, hikingBeauty].forEach((el) => el.innerHTML = ratingOptions());
reviewCleanliness.value='3.0'; reviewAesthetics.value='3.0'; reviewFacilities.value='3.0'; hikingDifficulty.value='3.5'; hikingBeauty.value='4.0';
postDate.valueAsDate = new Date(); reviewDate.valueAsDate = new Date(); hikingDate.valueAsDate = new Date();
function showFields(){ const value=sectionSelect.value; const toilet=value==='where-to-poop-toronto'; const hiking=value==='hiking-trails-hong-kong'; const piano=value==='piano'; postFields.classList.toggle('hidden-block', toilet || hiking); toiletFields.classList.toggle('hidden-block', !toilet); hikingFields.classList.toggle('hidden-block', !hiking); youtubeWrap.classList.toggle('hidden-block', !piano); }
showFields(); sectionSelect.addEventListener('change', showFields);
postTitle.addEventListener('blur', ()=>{ if(!postSlug.value.trim()) postSlug.value = slugify(postTitle.value); });
reviewTitle.addEventListener('blur', ()=>{ if(!reviewSlug.value.trim()) reviewSlug.value = slugify(reviewTitle.value); });
hikingTitle.addEventListener('blur', ()=>{ if(!hikingSlug.value.trim()) hikingSlug.value = slugify(hikingTitle.value); });
async function loadBase(){ try{ basePosts = await (await fetch('../content/posts.json', {cache:'no-store'})).json(); } catch { basePosts = {}; } try{ baseReviews = await (await fetch('../content/toronto-reviews.json', {cache:'no-store'})).json(); } catch { baseReviews = []; } try{ baseHiking = await (await fetch('../content/hiking-trails-hong-kong.json', {cache:'no-store'})).json(); } catch { baseHiking = []; } Object.keys(SECTIONS).forEach((key) => { if(SECTIONS[key].kind === 'post' && !Array.isArray(basePosts[key])) basePosts[key] = []; }); }
function clearForm(){ [postTitle, postSlug, postSubtitle, postExcerpt, postBody, postYoutube, reviewTitle, reviewSlug, reviewLocation, reviewArea, reviewNeighborhood, reviewPassword, reviewSummary, reviewOtherNotes, hikingTitle, hikingSlug, hikingLocation, hikingArea, hikingNeighborhood, hikingSummary, hikingOtherNotes].forEach((el) => el.value=''); postMedia.value=''; postDate.valueAsDate = new Date(); reviewDate.valueAsDate = new Date(); hikingDate.valueAsDate = new Date(); reviewSuitable.value='No. 1'; reviewAccessibility.value='Easily Accessible'; reviewPasswordRequired.value='false'; reviewFeatured.value='false'; reviewCleanliness.value='3.0'; reviewAesthetics.value='3.0'; reviewFacilities.value='3.0'; hikingAccessibility.value='Easily Accessible'; hikingFeatured.value='false'; hikingDifficulty.value='3.5'; hikingBeauty.value='4.0'; }
function renderQueue(){ if(!queued.length){ queueList.innerHTML = '<article class="empty-card stack"><h3>No entries queued</h3><p class="lead">Add one or more posts or reviews, then download the bundle.</p></article>'; return; } queueList.innerHTML = queued.map((item, idx) => { if(item.kind === 'toilet') return `<article class="queue-item"><div class="stack"><h3>${esc(item.title)}</h3><p class="admin-note">Where to Poop: Toronto</p><div class="queue-meta"><span class="tiny-tag">${prettyDate(item.date)}</span><span class="tiny-tag">${esc(item.location)}</span><span class="tiny-tag">Overall ${item.overall.toFixed(1)}</span><span class="tiny-tag">${esc(item.slug)}</span></div></div><div class="admin-actions"><button class="btn small-btn" type="button" onclick="removeQueued(${idx})">Remove</button></div></article>`; if(item.kind === 'hiking') return `<article class="queue-item"><div class="stack"><h3>${esc(item.title)}</h3><p class="admin-note">Hiking Trails: Hong Kong</p><div class="queue-meta"><span class="tiny-tag">${prettyDate(item.date)}</span><span class="tiny-tag">${esc(item.location)}</span><span class="tiny-tag">Overall ${item.overall.toFixed(1)}</span><span class="tiny-tag">${esc(item.slug)}</span></div></div><div class="admin-actions"><button class="btn small-btn" type="button" onclick="removeQueued(${idx})">Remove</button></div></article>`; return `<article class="queue-item"><div class="stack"><h3>${esc(item.title)}</h3><p class="admin-note">${SECTIONS[item.section].title}</p><div class="queue-meta"><span class="tiny-tag">${prettyDate(item.date)}</span><span class="tiny-tag">${item.media.length} media</span>${item.youtubeUrl ? '<span class="tiny-tag">YouTube</span>' : ''}<span class="tiny-tag">${esc(item.slug)}</span></div></div><div class="admin-actions"><button class="btn small-btn" type="button" onclick="removeQueued(${idx})">Remove</button></div></article>`; }).join(''); }
window.removeQueued = (idx) => { queued.splice(idx, 1); renderQueue(); };
function mergedPosts(){ const merged = JSON.parse(JSON.stringify(basePosts || {})); Object.keys(SECTIONS).forEach((key) => { if(SECTIONS[key].kind === 'post' && !Array.isArray(merged[key])) merged[key] = []; }); queued.filter((item) => item.kind === 'post').forEach((item) => { const media = item.media.map((file) => ({ filename:file.name, type:file.type, caption:'' })); merged[item.section] = (merged[item.section] || []).filter((post) => post.slug !== item.slug); merged[item.section].push({ title:item.title, slug:item.slug, subtitle:item.subtitle, excerpt:item.excerpt, body:item.body, date:item.date, youtubeUrl:item.youtubeUrl || '', media }); }); Object.keys(merged).forEach((key) => Array.isArray(merged[key]) && merged[key].sort((a,b)=>(b.date||'').localeCompare(a.date||''))); return merged; }
function mergedReviews(){ const merged = JSON.parse(JSON.stringify(baseReviews || [])); queued.filter((item) => item.kind === 'toilet').forEach((item) => { const cleaned = {...item}; delete cleaned.kind; const idx = merged.findIndex((review) => review.slug === cleaned.slug); if(idx >= 0) merged.splice(idx, 1, cleaned); else merged.push(cleaned); }); merged.sort((a,b)=>(b.date||'').localeCompare(a.date||'')); return merged; }
function mergedHiking(){ const merged = JSON.parse(JSON.stringify(baseHiking || [])); queued.filter((item) => item.kind === 'hiking').forEach((item) => { const cleaned = {...item}; delete cleaned.kind; const idx = merged.findIndex((review) => review.slug === cleaned.slug); if(idx >= 0) merged.splice(idx, 1, cleaned); else merged.push(cleaned); }); merged.sort((a,b)=>(b.date||'').localeCompare(a.date||'')); return merged; }
function menuHtml(prefix, active){ const link = (href, label, key, cls='side-link') => `<a class="${cls}${active === key ? ' active' : ''}" href="${prefix}${href}">${label}</a>`; const sub = (href, label, key) => link(href, label, key, 'side-sub-link'); const openWriting = ['reflections-from-a-mountaintop','philosophical-yap-sessions','reflections-of-a-casual-bouldering-enthusiast','piano','book-and-media-reviews','doodling','cooking'].includes(active) ? ' open' : ''; const openTrails = active === 'hiking-trails-hong-kong' ? ' open' : ''; const openWhere = ['where-to-poop-toronto','where-to-poop-hong-kong'].includes(active) ? ' open' : ''; const openAlbums = ['kyle-the-dog','photos'].includes(active) ? ' open' : ''; return `<button class="menu-toggle" id="menuToggle" aria-controls="siteSidebar" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button>
<div class="menu-overlay" id="menuOverlay"></div>
<aside class="sidebar" id="siteSidebar"><div class="sidebar-inner"><a class="site-brand" href="${prefix}index.html"><span class="brand-mark">☕</span><span class="brand-stack"><strong>Nihilists Take Their Coffee Black</strong></span></a><nav class="side-nav" aria-label="Site sections">${link('index.html','Home','home')}<details class="side-group"${openWriting}><summary><span class="group-title">Writing</span><span class="group-note">essays & posts</span></summary><div class="side-sub-links">${sub('reflections-from-a-mountaintop/index.html','Reflections from a Mountaintop','reflections-from-a-mountaintop')}${sub('philosophical-yap-sessions/index.html','Philosophical Yap Sessions','philosophical-yap-sessions')}${sub('reflections-of-a-casual-bouldering-enthusiast/index.html','Reflections of a Casual Bouldering Enthusiast','reflections-of-a-casual-bouldering-enthusiast')}${sub('piano/index.html','Piano','piano')}${sub('book-and-media-reviews/index.html','Book and Media Reviews','book-and-media-reviews')}${sub('doodling/index.html','Doodling','doodling')}${sub('cooking/index.html','Cooking','cooking')}${sub('games-and-the-meaning-of-life/index.html','Games and the Meaning of Life','games-and-the-meaning-of-life')}</div></details><details class="side-group"${openTrails}><summary><span class="group-title">Trails</span><span class="group-note">route reviews</span></summary><div class="side-sub-links">${sub('hiking-trails-hong-kong/index.html','Hiking Trails: Hong Kong','hiking-trails-hong-kong')}</div></details><details class="side-group"${openWhere}><summary><span class="group-title">Where to Poop</span><span class="group-note">city guides</span></summary><div class="side-sub-links">${sub('where-to-poop-toronto/index.html','Where to Poop: Toronto','where-to-poop-toronto')}${sub('where-to-poop-hong-kong/index.html','Where to Poop: Hong Kong','where-to-poop-hong-kong')}</div></details><details class="side-group"${openAlbums}><summary><span class="group-title">Albums</span><span class="group-note">visual sections</span></summary><div class="side-sub-links">${sub('kyle-the-dog/index.html','Kyle the Dog','kyle-the-dog')}${sub('photos/index.html','Photography','photos')}</div></details>${link('hd-hen/index.html','HD Hen','hd-hen')}</nav></div></aside>`; }
function wrapHtml({ title, bodyClass, prefix, active, mainContent, extraScripts='' }){ return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${title}</title><meta name="description" content="A collection of philosophical rambles and otherwise random takes on life, dogs, toilets, everything." /><link rel="stylesheet" href="${prefix}assets/site.css" /></head><body class="${bodyClass}">${menuHtml(prefix, active)}<div class="page-wrap"><main class="main-shell">${mainContent}</main><footer class="site-footer">Created by Jake Lau</footer></div><script src="${prefix}assets/site.js"></script>${extraScripts}</body></html>`; }
function buildPostHtml(sectionKey, post){ const section = SECTIONS[sectionKey]; const mediaBlock = (post.media || []).length ? `<section class="content-card stack"><div class="media-grid">${(post.media || []).map((m) => m.type.startsWith('video') ? `<figure><video controls playsinline src="media/${esc(m.filename)}"></video></figure>` : `<figure><img src="media/${esc(m.filename)}" alt="${esc(post.title)}" /></figure>`).join('')}</div></section>` : ''; const youtubeBlock = (sectionKey === 'piano' && post.youtubeUrl && youtubeId(post.youtubeUrl)) ? `<section class="content-card stack"><div class="video-embed"><iframe src="https://www.youtube.com/embed/${youtubeId(post.youtubeUrl)}" title="${esc(post.title)}" loading="lazy" allowfullscreen></iframe></div></section>` : ''; const main = `<section class="hero-panel hero-title-card stack" style="--hero-image:url('../../../assets/${section.hero_image}')"><h1>${esc(post.title)}</h1>${post.subtitle ? `<p class="lead">${renderMarkdownInline(post.subtitle)}</p>` : ''}<div class="tag-row"><span class="tiny-tag">${prettyDate(post.date)}</span></div></section>${youtubeBlock}<section class="content-card stack"><div class="text-panel markdown-body">${renderMarkdownBlock(post.body)}</div></section>${mediaBlock}<div class="button-row"><a class="btn" href="../../index.html">Back to section</a></div>`; return wrapHtml({ title:`${post.title} | Nihilists Take Their Coffee Black`, bodyClass:section.theme, prefix:'../../../', active:sectionKey, mainContent:main }); }
function buildTorontoDetailHtml(){ return wrapHtml({ title:'Toronto Review | Nihilists Take Their Coffee Black', bodyClass:'theme-toronto', prefix:'../../../', active:'where-to-poop-toronto', mainContent:`<section class="hero-panel hero-title-card stack" style="--hero-image:url('../../../assets/1.jpg');--hero-position:center 16%" id="torontoDetailHero"></section><section class="detail-card stack" id="torontoDetailBody"></section>`, extraScripts:'<script src="../../../assets/toronto.js"></script>' }); }
function buildHikingDetailHtml(){ return wrapHtml({ title:'Hiking Review | Nihilists Take Their Coffee Black', bodyClass:'theme-hiking', prefix:'../../../', active:'hiking-trails-hong-kong', mainContent:`<section class="hero-panel hero-title-card stack" style="--hero-image:url('../../../assets/12.jpg');--hero-position:center 22%" id="hikingDetailHero"></section><section class="detail-card stack" id="hikingDetailBody"></section>`, extraScripts:'<script src="../../../assets/hiking.js"></script>' }); }
$('clearForm').addEventListener('click', clearForm);
$('addToBatch').addEventListener('click', (event) => { event.preventDefault(); if(sectionSelect.value === 'where-to-poop-toronto'){ const title = reviewTitle.value.trim(); if(!title) return alert('Review title is required.'); const slug = reviewSlug.value.trim() || slugify(title); const item = { kind:'toilet', title, slug, location:reviewLocation.value.trim(), area:reviewArea.value.trim(), neighborhood:reviewNeighborhood.value.trim(), suitableFor:reviewSuitable.value, accessibility:reviewAccessibility.value, passwordRequired:reviewPasswordRequired.value === 'true', password:reviewPassword.value.trim(), featured:reviewFeatured.value === 'true', cleanliness:Number(reviewCleanliness.value), aesthetics:Number(reviewAesthetics.value), facilities:Number(reviewFacilities.value), date:reviewDate.value || new Date().toISOString().slice(0,10), summary:reviewSummary.value.trim(), otherNotes:reviewOtherNotes.value.trim() }; item.overall = roundHalf((item.cleanliness + item.aesthetics + item.facilities) / 3); queued.push(item); } else if(sectionSelect.value === 'hiking-trails-hong-kong'){ const title = hikingTitle.value.trim(); if(!title) return alert('Trail title is required.'); const slug = hikingSlug.value.trim() || slugify(title); const item = { kind:'hiking', title, slug, location:hikingLocation.value.trim(), area:hikingArea.value.trim(), neighborhood:hikingNeighborhood.value.trim(), accessibility:hikingAccessibility.value, featured:hikingFeatured.value === 'true', difficulty:Number(hikingDifficulty.value), beauty:Number(hikingBeauty.value), date:hikingDate.value || new Date().toISOString().slice(0,10), summary:hikingSummary.value.trim(), otherNotes:hikingOtherNotes.value.trim() }; item.overall = roundHalf((item.difficulty + item.beauty) / 2); queued.push(item); } else { const title = postTitle.value.trim(); if(!title) return alert('Title is required.'); const slug = postSlug.value.trim() || slugify(title); queued.push({ kind:'post', section:sectionSelect.value, title, slug, subtitle:postSubtitle.value.trim(), excerpt:postExcerpt.value.trim(), body:postBody.value.trim(), date:postDate.value || new Date().toISOString().slice(0,10), youtubeUrl:postYoutube.value.trim(), media:Array.from(postMedia.files) }); } renderQueue(); clearForm(); });
$('downloadPostsJson').addEventListener('click', () => { const blob = new Blob([JSON.stringify(mergedPosts(), null, 2)], {type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'posts.json'; a.click(); URL.revokeObjectURL(a.href); });
$('downloadReviewsJson').addEventListener('click', () => { const blob = new Blob([JSON.stringify(mergedReviews(), null, 2)], {type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'toronto-reviews.json'; a.click(); URL.revokeObjectURL(a.href); });
$('downloadHikingJson').addEventListener('click', () => { const blob = new Blob([JSON.stringify(mergedHiking(), null, 2)], {type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'hiking-trails-hong-kong.json'; a.click(); URL.revokeObjectURL(a.href); });
$('downloadBundle').addEventListener('click', async () => { if(!queued.length) return alert('Queue at least one entry first.'); if(!window.JSZip) return alert('Zip library failed to load.'); const zip = new JSZip(); const posts = mergedPosts(); const reviews = mergedReviews(); const hiking = mergedHiking(); if(queued.some((item) => item.kind === 'post')){ zip.file('content/posts.json', JSON.stringify(posts, null, 2)); queued.filter((item) => item.kind === 'post').forEach((item) => { const post = { title:item.title, slug:item.slug, subtitle:item.subtitle, excerpt:item.excerpt, body:item.body, date:item.date, youtubeUrl:item.youtubeUrl || '', media:item.media.map((file) => ({ filename:file.name, type:file.type })) }; zip.file(`${item.section}/posts/${item.slug}/index.html`, buildPostHtml(item.section, post)); item.media.forEach((file) => zip.file(`${item.section}/posts/${item.slug}/media/${file.name}`, file)); }); } if(queued.some((item) => item.kind === 'toilet')){ zip.file('content/toronto-reviews.json', JSON.stringify(reviews, null, 2)); queued.filter((item) => item.kind === 'toilet').forEach((item) => zip.file(`where-to-poop-toronto/reviews/${item.slug}/index.html`, buildTorontoDetailHtml())); } if(queued.some((item) => item.kind === 'hiking')){ zip.file('content/hiking-trails-hong-kong.json', JSON.stringify(hiking, null, 2)); queued.filter((item) => item.kind === 'hiking').forEach((item) => zip.file(`hiking-trails-hong-kong/reviews/${item.slug}/index.html`, buildHikingDetailHtml())); } zip.file('batch-manifest.txt', queued.map((item) => item.kind === 'toilet' ? `where-to-poop-toronto/reviews/${item.slug}/index.html` : item.kind === 'hiking' ? `hiking-trails-hong-kong/reviews/${item.slug}/index.html` : `${item.section}/posts/${item.slug}/index.html`).join('\n')); const blob = await zip.generateAsync({type:'blob'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'content-studio-bundle.zip'; a.click(); URL.revokeObjectURL(a.href); });
loadBase();
