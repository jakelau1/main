
(function(){
  const body = document.body;
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('siteSidebar');
  const overlay = document.getElementById('menuOverlay');
  function closeMenu(){ body.classList.remove('menu-open'); if (toggle) toggle.setAttribute('aria-expanded','false'); }
  function openMenu(){ body.classList.add('menu-open'); if (toggle) toggle.setAttribute('aria-expanded','true'); }
  if (toggle){
    toggle.addEventListener('click', () => body.classList.contains('menu-open') ? closeMenu() : openMenu());
  }
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
})();
