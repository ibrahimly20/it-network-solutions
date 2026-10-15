// Header style on scroll
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Reveal on scroll
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }), { threshold: 0.12 })
  : null;
document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('visible'));

// Contact form: opens the visitor's mail client (GitHub Pages has no backend)
const CONTACT_EMAIL = 'contact@itnetworksolutions.ne';
const form = document.getElementById('contact-form');
const note = form.querySelector('.form-note');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.checkValidity()) {
    note.textContent = 'Merci de renseigner votre nom, un e-mail valide et votre message.';
    note.classList.add('error');
    return;
  }
  const d = new FormData(form);
  const subject = `Demande de devis : ${d.get('domaine')} (${d.get('entreprise') || d.get('nom')})`;
  const body = [
    `Nom : ${d.get('nom')}`,
    `Entreprise : ${d.get('entreprise')}`,
    `E-mail : ${d.get('email')}`,
    `Téléphone : ${d.get('telephone')}`,
    `Domaine : ${d.get('domaine')}`,
    '',
    d.get('message'),
  ].join('\n');
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.classList.remove('error');
  note.textContent = 'Votre messagerie va s\'ouvrir avec la demande pré-remplie.';
});

document.getElementById('year').textContent = new Date().getFullYear();
