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

// Contact form: sent by FormSubmit (GitHub Pages has no backend)
const CONTACT_EMAIL = 'ibrahim-ly@itnetwork-solutions.com';
const form = document.getElementById('contact-form');
const note = form.querySelector('.form-note');
const submitBtn = form.querySelector('button[type="submit"]');
const setNote = (text, isError) => {
  note.textContent = text;
  note.classList.toggle('error', !!isError);
};
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.checkValidity()) {
    setNote('Merci de renseigner votre nom, un e-mail valide et votre message.', true);
    return;
  }
  const d = new FormData(form);
  if (d.get('_honey')) return;
  const payload = {
    _subject: `Demande de devis : ${d.get('domaine')} (${d.get('entreprise') || d.get('nom')})`,
    _template: 'table',
    _replyto: d.get('email'),
    Nom: d.get('nom'),
    Entreprise: d.get('entreprise'),
    'E-mail': d.get('email'),
    'Téléphone': d.get('telephone'),
    Domaine: d.get('domaine'),
    Message: d.get('message'),
  };
  submitBtn.disabled = true;
  setNote('Envoi en cours…');
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) === 'false') {
      const msg = String(data.message || '');
      if (/activat/i.test(msg)) {
        setNote('Formulaire en cours d\'activation : un e-mail de confirmation a été envoyé à l\'adresse de réception. Cliquez sur son lien, puis réessayez.', true);
        return;
      }
      throw new Error(msg || res.status);
    }
    form.reset();
    setNote('Merci, votre demande a bien été envoyée. Nous vous répondons rapidement.');
  } catch (err) {
    console.error('Envoi du formulaire :', err);
    setNote(`L'envoi a échoué. Écrivez-nous directement à ${CONTACT_EMAIL} ou appelez le +227 89 08 60 60.`, true);
  } finally {
    submitBtn.disabled = false;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
