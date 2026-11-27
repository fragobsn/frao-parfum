(() => {
'use strict';
const P = [
  { id:'p1', name:'Figuier Blanc', family:'Frais', color:'#D4A5A5', notes:'Figue · cèdre · musc', top:'Figue verte', heart:'Feuille de figuier', base:'Cèdre, musc', desc:'Un figuier à midi : vert, lacté, légèrement boisé.', base5:9 },
  { id:'p2', name:'Nuit Ambrée', family:'Ambré', color:'#E8D5C4', notes:'Ambre · vanille · benjoin', top:'Cardamome', heart:'Ambre, benjoin', base:'Vanille, tonka', desc:'Chaud et enveloppant, fait pour les soirs d’hiver.', base5:11 },
  { id:'p3', name:'Vétiver Sec', family:'Boisé', color:'#C9A89A', notes:'Vétiver · poivre · cuir', top:'Poivre rose', heart:'Vétiver', base:'Cuir, bois sec', desc:'Sobre, minéral, sec. Un classique réinventé.', base5:10 },
  { id:'p4', name:'Pivoine Poudrée', family:'Floral', color:'#EBC9C4', notes:'Pivoine · iris · musc', top:'Litchi', heart:'Pivoine, iris', base:'Musc blanc', desc:'Floral poudré, tendre et lumineux.', base5:9 },
  { id:'p5', name:'Agrume Salé', family:'Frais', color:'#E3B9A3', notes:'Bergamote · sel · algue', top:'Bergamote', heart:'Sel marin', base:'Algue, bois flotté', desc:'L’air du large sur la peau, vif et net.', base5:8 },
  { id:'p6', name:'Encens Noir', family:'Ambré', color:'#7A4A5E', notes:'Encens · myrrhe · patchouli', top:'Encens', heart:'Myrrhe', base:'Patchouli, ambre', desc:'Fumé et profond, sans lourdeur.', base5:12 },
  { id:'p7', name:'Jasmin de Nuit', family:'Floral', color:'#F1DECF', notes:'Jasmin · fleur d’oranger', top:'Mandarine', heart:'Jasmin sambac', base:'Fleur d’oranger, musc', desc:'Un jasmin solaire qui s’adoucit à la nuit.', base5:10 },
  { id:'p8', name:'Cèdre & Thé', family:'Boisé', color:'#B87D6D', notes:'Thé vert · cèdre · mousse', top:'Thé vert', heart:'Cèdre', base:'Mousse de chêne', desc:'Boisé et calme, une tasse de thé en forêt.', base5:9 }
];
const SETS = [
  { id:'s1', name:'Découverte frais', n:3, color:'#D4A5A5', price:22, items:'Figuier Blanc · Agrume Salé · Cèdre & Thé', desc:'Trois parfums légers pour le quotidien.' },
  { id:'s2', name:'Soirées ambrées', n:3, color:'#E8D5C4', price:26, items:'Nuit Ambrée · Encens Noir · Vétiver Sec', desc:'Chaleur, fumée et bois pour les soirs frais.' },
  { id:'s3', name:'Collection complète', n:8, color:'#E8D5C4', price:48, items:'Les 8 parfums en 5 ml', desc:'Tout le catalogue pour trouver le vôtre.' }
];
const FAMILIES = ['Tous','Floral','Boisé','Frais','Ambré'];
const MULT = { 5:1, 10:1.7, 15:2.3 };
const FREE_FROM = 40, SHIPPING = 3.9;
const IMG = 'assets/img/flacons.jpg';

const price = (p, s) => Math.round(p.base5 * MULT[s]);
const eur = n => n.toLocaleString('fr-FR', { minimumFractionDigits:0, maximumFractionDigits:2 }) + ' €';
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bg = c => `background-color:${c};background-image:url('${IMG}')`;

// ---------- état ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
let cart = store.get('frao-cart', []);
const ui = { fam:'Tous', sort:'pop', size:10, qty:1, added:'' };
const saveCart = () => { store.set('frao-cart', cart); renderCount(); };
const cartCount = () => cart.reduce((a, l) => a + l.qty, 0);
const cartSub = () => cart.reduce((a, l) => a + l.unit * l.qty, 0);
const shipFor = sub => (sub >= FREE_FROM || !sub) ? 0 : SHIPPING;

function addItem(item, qty) {
  const l = cart.find(x => x.key === item.key);
  if (l) l.qty += qty; else cart.push({ ...item, qty });
  saveCart();
}
function renderCount() { document.getElementById('count').textContent = cartCount(); }

// ---------- vues ----------
const card = p => `<a class="card" href="#/parfum/${p.id}"><div class="card-img" style="${bg(p.color)}"><span class="tag">${p.family}</span></div><div class="card-body"><div class="card-name">${p.name}</div><div class="card-notes">${p.notes}</div><div class="card-price">dès ${eur(price(p,5))}</div></div></a>`;

const views = {
  home() {
    return `<section class="hero"><div class="hero-txt"><span class="eyebrow">Parfums en format découverte</span><h1>Testez avant d’acheter grand.</h1><p class="lead">Des flacons de 5, 10 et 15 ml. Vivez avec un parfum une semaine, pas une minute en boutique.</p><div class="row"><a class="btn btn-dark" href="#/catalogue">Voir les parfums</a><a class="btn btn-line" href="#/coffrets">Coffrets découverte</a></div></div><div class="hero-img" role="img" aria-label="Flacons de parfum"></div></section>
<div class="stats"><div class="stats-in">
<div><div class="stat-n">5–15<span>ml</span></div><div class="stat-t">Trois contenances pour tester</div></div>
<div><div class="stat-n">${P.length}<span>parfums</span></div><div class="stat-t">Quatre familles olfactives</div></div>
<div><div class="stat-n">${FREE_FROM}<span>€</span></div><div class="stat-t">Livraison offerte dès ce montant</div></div></div></div>
<section class="section"><div class="section-head"><h2>Les plus essayés</h2><a class="link" href="#/catalogue">Tout voir</a></div><div class="grid">${P.slice(0,4).map(card).join('')}</div></section>
<section><div class="banner"><div><h2>Pas décidé ? Prenez un coffret.</h2><p>Trois à cinq parfums choisis par famille. Le prix du coffret est déduit de votre premier grand flacon.</p></div><a class="btn btn-accent" href="#/coffrets">Découvrir les coffrets</a></div></section>`;
  },
  catalogue() {
    let list = P.filter(p => ui.fam === 'Tous' || p.family === ui.fam);
    if (ui.sort === 'asc') list = list.slice().sort((a,b) => a.base5 - b.base5);
    if (ui.sort === 'desc') list = list.slice().sort((a,b) => b.base5 - a.base5);
    return `<section class="page"><span class="eyebrow">Catalogue</span><h1>Tous les parfums</h1>
<div class="toolbar"><div class="row" role="group" aria-label="Famille olfactive">${FAMILIES.map(f => `<button class="pill" data-fam="${f}" aria-pressed="${ui.fam===f}">${f}</button>`).join('')}</div>
<label class="select-l">Trier<select id="sort"><option value="pop"${ui.sort==='pop'?' selected':''}>Popularité</option><option value="asc"${ui.sort==='asc'?' selected':''}>Prix croissant</option><option value="desc"${ui.sort==='desc'?' selected':''}>Prix décroissant</option></select></label></div>
<div class="count" aria-live="polite">${list.length} parfum${list.length>1?'s':''}</div><div class="grid">${list.map(card).join('')}</div></section>`;
  },
  parfum(id) {
    const p = P.find(x => x.id === id);
    if (!p) return views.notfound();
    const cp = price(p, ui.size);
    return `<section class="product-wrap"><div style="padding-top:48px"><a class="back" href="#/catalogue">← Catalogue</a></div>
<div class="product" style="padding-top:0"><div class="product-img" style="${bg(p.color)}" role="img" aria-label="${esc(p.name)}"></div>
<div class="col"><span class="eyebrow">${p.family}</span><h1>${p.name}</h1><p class="lead" style="max-width:none">${p.desc}</p>
<div class="pyr"><div><div class="k">Tête</div><div class="v">${p.top}</div></div><div><div class="k">Cœur</div><div class="v">${p.heart}</div></div><div><div class="k">Fond</div><div class="v">${p.base}</div></div></div>
<div><div class="mono" style="margin-bottom:12px">Contenance</div><div class="row">${[5,10,15].map(z => `<button class="pill size" data-size="${z}" aria-pressed="${ui.size===z}">${z} ml · ${eur(price(p,z))}</button>`).join('')}</div></div>
<div class="row" style="gap:16px;align-items:center"><div class="qty"><button data-q="-1" aria-label="Moins">−</button><span aria-live="polite">${ui.qty}</span><button data-q="1" aria-label="Plus">+</button></div>
<button class="btn btn-accent" id="add" style="flex:1;min-width:200px" data-id="${p.id}">Ajouter au panier · ${eur(cp*ui.qty)}</button></div>
<div class="note" role="status">${esc(ui.added)}</div>
<div class="fine">Eau de parfum · vaporisateur rechargeable · env. ${ui.size*15} vaporisations. Expédition sous 48 h.</div></div></div></section>`;
  },
  coffrets() {
    return `<section class="page"><span class="eyebrow">Coffrets découverte</span><h1>Trouvez votre parfum</h1><p class="lead" style="max-width:560px;margin-bottom:48px">Chaque coffret réunit des flacons de 5 ml. Le montant est déduit de votre premier flacon 15 ml.</p>
<div class="sets">${SETS.map(c => `<div class="set"><div class="set-img" style="${bg(c.color)}"></div><div class="set-body"><div class="set-name">${c.name}</div><div style="color:var(--ink-500);line-height:1.55">${c.desc}</div><div style="font:500 13px 'IBM Plex Mono';color:var(--ink-700)">${c.items}</div><div class="set-foot"><span style="font:800 24px Archivo">${eur(c.price)}</span><button class="btn btn-dark btn-sm" data-set="${c.id}">Ajouter</button></div></div></div>`).join('')}</div></section>`;
  },
  panier() {
    if (!cart.length) return `<section class="page"><h1 style="margin-bottom:40px">Votre panier</h1><div class="empty">Rien ici pour l’instant.<a class="btn btn-dark" href="#/catalogue">Voir les parfums</a></div></section>`;
    const sub = cartSub(), ship = shipFor(sub);
    return `<section class="page"><h1 style="margin-bottom:40px">Votre panier</h1><div class="cart"><div class="lines">${cart.map(l => `<div class="line"><div class="thumb" style="${bg(l.color)}"></div><div class="line-main"><div class="line-name">${esc(l.name)}</div><div class="line-sub">${esc(l.sub)}</div></div><div class="qty sm"><button data-chg="${l.key}" data-d="-1" aria-label="Moins">−</button><span>${l.qty}</span><button data-chg="${l.key}" data-d="1" aria-label="Plus">+</button></div><div class="line-total">${eur(l.unit*l.qty)}</div><button class="x" data-rm="${l.key}" aria-label="Retirer ${esc(l.name)}">×</button></div>`).join('')}</div>
<aside class="summary"><div class="sum-row"><span>Sous-total</span><b>${eur(sub)}</b></div><div class="sum-row"><span>Livraison</span><b>${ship?eur(ship):'Offerte'}</b></div>
<div class="free">${sub>=FREE_FROM?'Livraison offerte':'Encore '+eur(FREE_FROM-sub)+' pour la livraison offerte'}</div><div class="bar"><i style="width:${Math.min(100,sub/FREE_FROM*100)}%"></i></div>
<div class="total"><span>Total</span><b>${eur(sub+ship)}</b></div><a class="btn btn-accent" href="#/commande">Passer la commande</a></aside></div></section>`;
  },
  commande() {
    if (!cart.length) { location.hash = '#/panier'; return ''; }
    const sub = cartSub(), ship = shipFor(sub);
    const f = (n, label, type='text', ac='', full=false) => `<label${full?' class="full"':''}>${label}<input name="${n}" type="${type}" autocomplete="${ac}" required aria-describedby="e-${n}"><span class="err" id="e-${n}"></span></label>`;
    return `<section class="page"><a class="back" href="#/panier">← Panier</a><h1 style="margin-bottom:40px">Commande</h1><div class="cart"><form class="form" id="checkout" novalidate>
${f('nom','Nom complet','text','name',true)}${f('email','E-mail','email','email',true)}${f('adresse','Adresse','text','street-address',true)}${f('cp','Code postal','text','postal-code')}${f('ville','Ville','text','address-level2')}
</form><aside class="summary"><div class="sum-row"><span>Articles (${cartCount()})</span><b>${eur(sub)}</b></div><div class="sum-row"><span>Livraison</span><b>${ship?eur(ship):'Offerte'}</b></div><div class="total"><span>Total</span><b>${eur(sub+ship)}</b></div>
<button class="btn btn-accent" type="submit" form="checkout">Confirmer la commande</button><div style="font-size:13px;color:var(--ink-500)">Démo : aucun paiement n’est effectué et aucune donnée n’est envoyée.</div></aside></div></section>`;
  },
  merci(ref) {
    const o = store.get('frao-last-order', null);
    if (!o || o.ref !== ref) return views.notfound();
    return `<section class="page ok"><span class="eyebrow">Commande enregistrée</span><h1>Merci ${esc(o.nom.split(' ')[0])} !</h1><p>Votre commande <b>${esc(o.ref)}</b> de ${eur(o.total)} sera expédiée sous 48 h à ${esc(o.adresse)}, ${esc(o.cp)} ${esc(o.ville)}. Une confirmation sera envoyée à ${esc(o.email)}.</p><a class="btn btn-dark" href="#/catalogue">Continuer mes achats</a></section>`;
  },
  notfound() { return `<section class="page"><h1>Page introuvable</h1><p class="lead" style="margin:24px 0">Cette page n’existe pas.</p><a class="btn btn-dark" href="#/">Retour à l’accueil</a></section>`; }
};

// ---------- routeur ----------
const app = document.getElementById('app');
function route() {
  const [, r = '', arg] = (location.hash.slice(1) || '/').split('/');
  const name = r === '' ? 'home' : r;
  if (name === 'parfum') { ui.size = ui.size || 10; }
  app.innerHTML = (views[name] || views.notfound)(arg);
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.r === name || (name === 'parfum' && a.dataset.r === 'catalogue')));
  const titles = { home:'', catalogue:'Parfums', parfum:(P.find(p=>p.id===arg)||{}).name, coffrets:'Coffrets', panier:'Panier', commande:'Commande', merci:'Merci' };
  document.title = (titles[name] ? titles[name] + ' — ' : '') + 'frao parfum';
}
window.addEventListener('hashchange', () => { ui.qty = 1; ui.added = ''; route(); window.scrollTo(0, 0); app.focus({ preventScroll:true }); });

// ---------- événements (délégation) ----------
const refresh = () => { const y = window.scrollY; route(); window.scrollTo(0, y); };
app.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  const d = t.dataset;
  if (d.fam) { ui.fam = d.fam; refresh(); }
  else if (d.size) { ui.size = +d.size; ui.added = ''; refresh(); }
  else if (d.q) { ui.qty = Math.max(1, ui.qty + +d.q); refresh(); }
  else if (t.id === 'add') {
    const p = P.find(x => x.id === d.id);
    addItem({ key:p.id+'-'+ui.size, name:p.name, sub:ui.size+' ml', color:p.color, unit:price(p, ui.size) }, ui.qty);
    ui.added = `Ajouté au panier — ${ui.qty} × ${p.name} ${ui.size} ml`; refresh();
  }
  else if (d.set) {
    const c = SETS.find(x => x.id === d.set);
    addItem({ key:c.id, name:c.name, sub:`Coffret · ${c.n} × 5 ml`, color:c.color, unit:c.price }, 1);
    t.textContent = 'Ajouté ✓'; setTimeout(() => { t.textContent = 'Ajouter'; }, 1200);
  }
  else if (d.chg) { const l = cart.find(x => x.key === d.chg); if (l) { l.qty = Math.max(1, l.qty + +d.d); saveCart(); refresh(); } }
  else if (d.rm) { cart = cart.filter(x => x.key !== d.rm); saveCart(); refresh(); }
});
app.addEventListener('change', e => { if (e.target.id === 'sort') { ui.sort = e.target.value; refresh(); } });
app.addEventListener('submit', e => {
  if (e.target.id !== 'checkout') return;
  e.preventDefault();
  const form = e.target, v = Object.fromEntries(new FormData(form));
  const rules = {
    nom: s => s.trim().length >= 2 || 'Indiquez votre nom.',
    email: s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) || 'E-mail invalide.',
    adresse: s => s.trim().length >= 5 || 'Indiquez votre adresse.',
    cp: s => /^\d{5}$/.test(s.trim()) || 'Code postal à 5 chiffres.',
    ville: s => s.trim().length >= 2 || 'Indiquez votre ville.'
  };
  let first = null;
  for (const k in rules) {
    const r = rules[k](v[k] || ''), inp = form.elements[k];
    form.querySelector('#e-' + k).textContent = r === true ? '' : r;
    inp.setAttribute('aria-invalid', r === true ? 'false' : 'true');
    if (r !== true && !first) first = inp;
  }
  if (first) return first.focus();
  const sub = cartSub(), ref = 'FP-' + Date.now().toString(36).toUpperCase();
  store.set('frao-last-order', { ref, ...v, total: sub + shipFor(sub), items: cart });
  cart = []; saveCart();
  location.hash = '#/merci/' + ref;
});

renderCount();
route();
})();
