/* ── Config ────────────────────────────────────────────── */

// TODO: replace with your N8N webhook URL before launch
const WEBHOOK_URL = 'https://n8n.bizautomations.co.uk/webhook/biz-leads';

/* ── Sticky CTA bar ────────────────────────────────────── */

const stickyCta = document.getElementById('sticky-cta');
const footer = document.querySelector('.footer-strip');

if (stickyCta && footer) {
  const obs = new IntersectionObserver(
    ([entry]) => stickyCta.classList.toggle('is-hidden', entry.isIntersecting),
    { threshold: 0.1 }
  );
  obs.observe(footer);
}

/* ── Reveal on scroll ──────────────────────────────────── */

const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObs.observe(el));
}

/* ── Count-up numerics ─────────────────────────────────── */

const counters = document.querySelectorAll('[data-count]');

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = prefix + target + suffix;
    return;
  }
  requestAnimationFrame(tick);
}

if (counters.length) {
  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => countObs.observe(el));
}

/* ── Consultation form ─────────────────────────────────── */

const form = document.getElementById('consult-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const data = {
      name:     form.name.value.trim(),
      business: form.business.value.trim(),
      contact:  form.contact.value.trim(),
      message:  form.message.value.trim(),
      source:   document.referrer || 'direct',
      page:     window.location.href,
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      form.reset();
      showStatus('success', "Got it — I'll be in touch within one business day.");
    } catch (err) {
      // Fallback: open mailto so the user still gets through
      const subject = encodeURIComponent('Consultation enquiry – BizAutomations');
      const body    = encodeURIComponent(
        `Name: ${data.name}\nBusiness: ${data.business}\nContact: ${data.contact}\n\n${data.message}`
      );
      showStatus(
        'error',
        `Something went wrong. <a href="mailto:hello@bizautomations.co.uk?subject=${subject}&body=${body}" style="color:inherit;text-decoration:underline">Click here to email directly instead.</a>`
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function showStatus(type, html) {
  if (!formStatus) return;
  formStatus.className = `form-status ${type}`;
  formStatus.innerHTML = html;
  formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Smooth scroll for anchor links ───────────────────── */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
