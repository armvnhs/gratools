if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js').catch(function () {});
  });
}

(function initTheme() {
  var saved = null;
  try { saved = localStorage.getItem('gratools-theme'); } catch (e) {}
  var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.setAttribute('data-theme', saved || (dark ? 'dark' : 'light'));
})();

document.getElementById('themeToggle').addEventListener('click', function () {
  var next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  try { localStorage.setItem('gratools-theme', next); } catch (e) {}
});

var aboutModal = document.getElementById('aboutModal');
function setAbout(open) {
  aboutModal.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
document.getElementById('aboutBtn').addEventListener('click', function () { setAbout(true); });
document.getElementById('aboutClose').addEventListener('click', function () { setAbout(false); });
aboutModal.addEventListener('click', function (e) { if (e.target === aboutModal) setAbout(false); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setAbout(false); });

var CATEGORIES = [
  { id: 'all', label: 'همه ابزارها', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { id: 'popular', label: 'پراستفاده‌ترین', icon: 'M13 2 3 14h7l-1 8 10-12h-7z' },
  { id: 'graphic', label: 'طراحی و گرافیک', icon: 'M19 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7.5M3 16l4-4 3 3 5-5 4 4M13.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z' },
  { id: 'dev', label: 'توسعه و کد', icon: 'm8 6-6 6 6 6M16 6l6 6-6 6' },
  { id: 'converter', label: 'تبدیل فایل', icon: 'M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7' },
  { id: 'productivity', label: 'بهره‌وری', icon: 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 2v4M16 2v4M3 10h18' }
];

var SVG_NS = 'http://www.w3.org/2000/svg';
var grid = document.getElementById('toolsGrid');
var searchInput = document.getElementById('searchInput');
var sideNav = document.getElementById('sideNav');
var mobileCats = document.getElementById('mobileCats');
var activeCategory = 'all';
var allSites = [];

function toFa(n) {
  return String(n).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
}

function safeUrl(value) {
  try {
    var u = new URL(value);
    return (u.protocol === 'https:' || u.protocol === 'http:') ? u.href : null;
  } catch (e) {
    return null;
  }
}

function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function svgIcon(path) {
  var svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  var p = document.createElementNS(SVG_NS, 'path');
  p.setAttribute('d', path);
  svg.appendChild(p);
  return svg;
}

function countFor(id) {
  if (id === 'all') return allSites.length;
  if (id === 'popular') return allSites.filter(function (s) { return s.popular; }).length;
  return allSites.filter(function (s) { return s.category === id; }).length;
}

function selectCategory(id) {
  activeCategory = id;
  renderNav();
  applyFilters();
}

function renderNav() {
  sideNav.replaceChildren();
  mobileCats.replaceChildren();
  CATEGORIES.forEach(function (cat) {
    var active = cat.id === activeCategory;

    var item = el('button', 'nav-item' + (active ? ' active' : ''));
    item.type = 'button';
    var icon = el('span', 'nav-icon');
    icon.appendChild(svgIcon(cat.icon));
    item.append(icon, el('span', 'nav-label', cat.label), el('span', 'nav-count', toFa(countFor(cat.id))));
    item.addEventListener('click', function () { selectCategory(cat.id); });
    sideNav.appendChild(item);

    var chip = el('button', 'chip' + (active ? ' active' : ''), cat.label);
    chip.type = 'button';
    chip.addEventListener('click', function () { selectCategory(cat.id); });
    mobileCats.appendChild(chip);
  });
}

function buildCard(site, index) {
  var href = safeUrl(site.url);
  if (!href) return null;
  var card = el('div', 'card');
  card.style.animationDelay = Math.min(index * 0.04, 0.4) + 's';

  function makeLink(className) {
    var a = el('a', className);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }

  var tile = makeLink('tile');
  if (site.popular) tile.appendChild(el('span', 'pin', 'پراستفاده'));
  var fav = el('div', 'fav', (site.name || '?').trim().charAt(0).toUpperCase());
  var img = document.createElement('img');
  img.alt = '';
  img.loading = 'lazy';
  img.src = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(new URL(href).hostname) + '&sz=128';
  img.addEventListener('load', function () { fav.firstChild.textContent = ''; });
  img.addEventListener('error', function () { img.remove(); });
  fav.appendChild(img);
  tile.appendChild(fav);

  var title = makeLink('card-title');
  title.append(document.createTextNode(site.name), svgIcon('M7 17 17 7M7 7h10v10'));

  card.append(tile, title, el('p', 'card-desc', site.description));
  return card;
}

function renderCards(sites) {
  grid.replaceChildren();
  if (!sites.length) {
    grid.appendChild(el('div', 'empty', 'نتیجه‌ای یافت نشد'));
    return;
  }
  sites.forEach(function (site, index) {
    var card = buildCard(site, index);
    if (card) grid.appendChild(card);
  });
}

function applyFilters() {
  var query = searchInput.value.trim().toLowerCase();
  var filtered = allSites.filter(function (site) {
    var inCategory;
    if (activeCategory === 'all') inCategory = true;
    else if (activeCategory === 'popular') inCategory = site.popular;
    else inCategory = site.category === activeCategory;
    var inQuery = !query ||
      String(site.name).toLowerCase().includes(query) ||
      String(site.description).toLowerCase().includes(query);
    return inCategory && inQuery;
  });
  renderCards(filtered);
}

async function loadSites() {
  try {
    var res = await fetch('data/sites.json');
    if (!res.ok) throw new Error('fetch failed');
    var data = await res.json();
    allSites = Array.isArray(data) ? data : (data.tools || []);
    renderNav();
    applyFilters();
  } catch (err) {
    grid.replaceChildren(el('div', 'empty', 'خطا در بارگذاری ابزارها. لطفاً دوباره تلاش کنید.'));
  }
}

searchInput.addEventListener('input', applyFilters);
loadSites();
