const $ = (s) => document.querySelector(s);
$('#year').textContent = new Date().getFullYear();

// ---- Menu ----
let menu = [];
let active = '';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderMenu() {
  const items = menu.filter((i) => i.category === active);
  $('#menu-list').innerHTML = items.map((i) => `
    <div class="item">
      <div><h3>${esc(i.name)}</h3><p>${esc(i.desc)}</p></div>
      <span class="price">Rs ${i.price.toLocaleString()}</span>
    </div>`).join('');
  document.querySelectorAll('#tabs button').forEach((b) =>
    b.setAttribute('aria-selected', b.dataset.cat === active));
}

fetch('/api/menu')
  .then((r) => r.json())
  .then((data) => {
    menu = data;
    const cats = [...new Set(menu.map((i) => i.category))];
    active = cats[0];
    $('#tabs').innerHTML = cats.map((c) =>
      `<button role="tab" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
    $('#tabs').addEventListener('click', (e) => {
      if (e.target.dataset.cat) { active = e.target.dataset.cat; renderMenu(); }
    });
    renderMenu();
  })
  .catch(() => { $('#menu-list').textContent = 'The menu could not load. Refresh the page to try again.'; });

// ---- Forms ----
function handleForm(formSel, url) {
  const form = $(formSel);
  const status = form.querySelector('.status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'status';
    status.textContent = 'Sending…';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data.errors || ['Something went wrong.']).join(' '));
      status.className = 'status ok';
      status.textContent = data.message;
      form.reset();
    } catch (err) {
      status.className = 'status err';
      status.textContent = err.message;
    }
  });
}
handleForm('#book-form', '/api/reservations');
handleForm('#contact-form', '/api/contact');

$('#book-form [name=date]').min = new Date().toISOString().slice(0, 10);
