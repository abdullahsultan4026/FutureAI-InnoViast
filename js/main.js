document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) {
        a.style.color = 'var(--accent)';
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  const revealEls = document.querySelectorAll(
    '.service-card, .portfolio-card, .testi-card, .about-card-main, .about-content, .stat-item, .pillar'
  );

  revealEls.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.children);
        const index    = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 80}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target  = el.textContent;
    const num     = parseFloat(target.replace(/[^0-9.]/g, ''));
    const suffix  = target.replace(/[0-9.]/g, '');
    const duration = 1500;
    const start    = performance.now();

    const update = (timestamp) => {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.round(eased * num * 10) / 10;

      el.textContent = (Number.isInteger(num) ? Math.round(current) : current.toFixed(1)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });

});

function handleSubmit() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();
  const btn     = document.getElementById('submitBtn');

  if (!name || !email || !message) {
    shakeForm(btn);
    showToast('⚠️ Please fill in your name, email, and message.', '#EF4444');
    return;
  }

  if (!isValidEmail(email)) {
    shakeForm(btn);
    showToast('⚠️ Please enter a valid email address.', '#EF4444');
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled    = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.textContent  = '✓ Message Sent!';
    btn.style.background = '#10B981';
    btn.style.opacity    = '1';

    showToast('✅ Message sent! We\'ll reply within 24 hours.', '#10B981');

    // Clear form
    document.getElementById('name').value    = '';
    document.getElementById('email').value   = '';
    document.getElementById('service').value = '';
    document.getElementById('message').value = '';

    setTimeout(() => {
      btn.textContent        = 'Send Message →';
      btn.disabled           = false;
      btn.style.background   = '';
      btn.style.opacity      = '1';
    }, 3000);
  }, 1200);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm(el) {
  el.style.animation = 'none';
  el.style.transform = 'translateX(-8px)';
  setTimeout(() => {
    el.style.transform = 'translateX(8px)';
    setTimeout(() => {
      el.style.transform = 'translateX(-5px)';
      setTimeout(() => {
        el.style.transform = 'translateX(0)';
      }, 80);
    }, 80);
  }, 80);
}

function showToast(msg, bg = '#10B981') {
  const toast    = document.getElementById('toast');
  toast.textContent   = msg;
  toast.style.background = bg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
