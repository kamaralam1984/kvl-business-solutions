// ============ SHARED HEADER + FOOTER + WIDGETS ============
// Auto-injects header/footer/floating widgets on every page.

const navItems = [
  { href: 'index.html', label: 'Home' },
  { href: 'software.html', label: 'Software' },
  { href: 'website-demos.html', label: 'Website Demo' },
  { href: 'services.html', label: 'Services' },
  { href: 'industries.html', label: 'Industries' },
  { href: 'about.html', label: 'About Us' },
  { href: 'projects.html', label: 'Projects' },
  { href: 'clients.html', label: 'Clients' },
  { href: 'contact.html', label: 'Contact' },
  { href: 'support.html', label: 'Support' },
];

const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

function renderHeader() {
  const slot = document.getElementById('site-header-slot');
  if (!slot) return;
  slot.innerHTML = `
  <header class="site-header" id="header">
    <div class="container nav">
      <a href="index.html" class="logo">
        <span class="logo-mark">K<span class="dot"></span>V<span class="dot"></span>L</span>
        <span class="logo-sub">BUSINESS SOLUTIONS</span>
      </a>
      <nav class="primary-nav" id="primaryNav">
        ${navItems.map(n => `<a href="${n.href}" class="${n.href === currentPage ? 'active' : ''}">${n.label}</a>`).join('')}
      </nav>
      <div class="nav-actions">
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
          <i class="fa-solid fa-moon moon"></i>
          <i class="fa-solid fa-sun sun"></i>
        </button>
        <a href="contact.html" class="btn btn-primary">Get A Quote</a>
        <button class="hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>`;
}

function renderFooter() {
  const slot = document.getElementById('site-footer-slot');
  if (!slot) return;
  slot.innerHTML = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="logo">
          <span class="logo-mark">K<span class="dot"></span>V<span class="dot"></span>L</span>
          <span class="logo-sub">BUSINESS SOLUTIONS</span>
        </div>
        <p class="muted">India's next-generation business solutions company offering software, GPS, civil, automation and enterprise services under one platform.</p>
        <div class="socials">
          <a href="#"><i class="fa-brands fa-facebook"></i></a>
          <a href="#"><i class="fa-brands fa-instagram"></i></a>
          <a href="#"><i class="fa-brands fa-linkedin"></i></a>
          <a href="#"><i class="fa-brands fa-youtube"></i></a>
          <a href="#"><i class="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>
      <div>
        <h5>Services</h5>
        <ul>
          <li><a href="services.html">Software Development</a></li>
          <li><a href="services.html">Website Development</a></li>
          <li><a href="services.html">GPS Tracking</a></li>
          <li><a href="services.html">Civil Work</a></li>
          <li><a href="services.html">Industrial Automation</a></li>
          <li><a href="services.html">CCTV &amp; Security</a></li>
        </ul>
      </div>
      <div>
        <h5>Company</h5>
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="projects.html">Projects</a></li>
          <li><a href="industries.html">Industries</a></li>
          <li><a href="clients.html">Clients</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="support.html">Support</a></li>
        </ul>
      </div>
      <div>
        <h5>Contact</h5>
        <ul>
          <li><i class="fa-solid fa-phone"></i> +91 90000 00000</li>
          <li><i class="fa-solid fa-envelope"></i> info@kvlsolutions.in</li>
          <li><i class="fa-brands fa-whatsapp"></i> +91 90000 00000</li>
          <li><i class="fa-solid fa-location-dot"></i> India</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom container">
      <p>© <span id="year"></span> KVL Business Solutions. All rights reserved.</p>
      <p>Crafted with <i class="fa-solid fa-heart" style="color:#ef4444"></i> in India</p>
    </div>
  </footer>`;
}

function renderWidgets() {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="float-widgets">
      <button class="float-btn float-chat" id="chatToggle" aria-label="AI Assistant"><i class="fa-solid fa-robot"></i></button>
      <a class="float-btn float-whatsapp" href="https://wa.me/919000000000" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
    </div>
    <div class="chatbot" id="chatbot">
      <div class="chat-header">
        <div class="ai-avatar"><i class="fa-solid fa-robot"></i></div>
        <div>
          <h4>KVL AI Assistant</h4>
          <p>Online — instant replies</p>
        </div>
        <button class="chat-close" id="chatClose">&times;</button>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="msg bot">Hi 👋 I'm KVL AI. How can I help you today?</div>
        <div class="msg bot">I can help with software pricing, demos, services, GPS tracking or quote generation.</div>
      </div>
      <div class="chat-quick">
        <button data-q="Show me software pricing">💰 Pricing</button>
        <button data-q="I want a website demo">🌐 Website Demo</button>
        <button data-q="GPS tracking info">📍 GPS Info</button>
        <button data-q="Get a quote">📝 Get Quote</button>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Type or speak..." id="chatInput" />
        <button class="mic" id="chatMic" title="Voice input"><i class="fa-solid fa-microphone"></i></button>
        <button id="chatSend"><i class="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>

    <!-- QUOTE GENERATOR MODAL -->
    <div class="quote-modal" id="quoteModal">
      <div class="quote-card">
        <button class="qclose">&times;</button>
        <h3>Get Instant Quote</h3>
        <p class="qsub">Answer 3 quick questions for a personalized estimate.</p>
        <div class="q-steps">
          <div class="q-step active"></div>
          <div class="q-step"></div>
          <div class="q-step"></div>
        </div>

        <div class="q-pane active">
          <h4 style="font-size:14px;margin-bottom:10px">1. What are you building?</h4>
          <div class="q-options">
            <div class="q-opt" data-group="type" data-label="Website" data-price="25000"><i class="fa-solid fa-globe"></i><span>Website</span></div>
            <div class="q-opt" data-group="type" data-label="Software / ERP" data-price="80000"><i class="fa-solid fa-laptop-code"></i><span>Software / ERP</span></div>
            <div class="q-opt" data-group="type" data-label="Mobile App" data-price="60000"><i class="fa-solid fa-mobile-screen"></i><span>Mobile App</span></div>
            <div class="q-opt" data-group="type" data-label="GPS / IoT" data-price="50000"><i class="fa-solid fa-satellite-dish"></i><span>GPS / IoT</span></div>
          </div>
        </div>

        <div class="q-pane">
          <h4 style="font-size:14px;margin-bottom:10px">2. Project scope?</h4>
          <div class="q-options">
            <div class="q-opt" data-group="scope" data-label="Basic" data-price="0"><i class="fa-solid fa-seedling"></i><span>Basic</span></div>
            <div class="q-opt" data-group="scope" data-label="Standard" data-price="30000"><i class="fa-solid fa-leaf"></i><span>Standard</span></div>
            <div class="q-opt" data-group="scope" data-label="Pro" data-price="80000"><i class="fa-solid fa-tree"></i><span>Pro</span></div>
            <div class="q-opt" data-group="scope" data-label="Enterprise" data-price="200000"><i class="fa-solid fa-crown"></i><span>Enterprise</span></div>
          </div>
          <h4 style="font-size:14px;margin:14px 0 10px">Timeline?</h4>
          <div class="q-options">
            <div class="q-opt" data-group="timeline" data-label="ASAP (Rush)" data-price="20000"><i class="fa-solid fa-bolt"></i><span>ASAP</span></div>
            <div class="q-opt" data-group="timeline" data-label="1 Month" data-price="0"><i class="fa-solid fa-calendar"></i><span>1 Month</span></div>
            <div class="q-opt" data-group="timeline" data-label="2-3 Months" data-price="-10000"><i class="fa-solid fa-calendar-days"></i><span>2-3 Months</span></div>
            <div class="q-opt" data-group="timeline" data-label="Flexible" data-price="-20000"><i class="fa-solid fa-clock"></i><span>Flexible</span></div>
          </div>
        </div>

        <div class="q-pane">
          <h4 style="font-size:14px;margin-bottom:10px">3. Your estimated quote</h4>
          <div class="q-result">
            <div class="q-range">Estimated investment</div>
            <div class="q-price">— —</div>
            <div class="q-summary"></div>
          </div>
          <p style="font-size:12px;color:var(--text-2);text-align:center;margin-bottom:14px">Final price depends on detailed requirements. Get an accurate quote in 1 hour.</p>
          <a href="contact.html" class="btn btn-primary" style="width:100%;justify-content:center"><i class="fa-solid fa-paper-plane"></i> Submit & Get Final Quote</a>
        </div>

        <div class="q-nav">
          <button class="btn btn-ghost q-prev"><i class="fa-solid fa-arrow-left"></i> Back</button>
          <button class="btn btn-primary q-next">Next <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(div);
}

function attachGlobalHandlers() {
  // Theme
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('kvl-theme') || 'dark';
  root.setAttribute('data-theme', saved);
  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('kvl-theme', next);
  });

  // Mobile nav
  const hamburger = document.getElementById('hamburger');
  const primaryNav = document.getElementById('primaryNav');
  hamburger?.addEventListener('click', () => primaryNav?.classList.toggle('open'));

  // Header shadow on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) header.style.boxShadow = window.scrollY > 20 ? '0 10px 30px -10px rgba(0,0,0,.25)' : 'none';
  });

  // Counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        let cur = 0;
        const step = Math.max(1, Math.floor(target / 50));
        const tick = () => {
          cur += step;
          if (cur >= target) { el.textContent = target + '+'; }
          else { el.textContent = cur + '+'; requestAnimationFrame(tick); }
        };
        tick();
        io.unobserve(el);
      });
    }, { threshold: .5 });
    io.observe(el);
  });

  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Chatbot
  const chatToggle = document.getElementById('chatToggle');
  const chatClose = document.getElementById('chatClose');
  const chatbot = document.getElementById('chatbot');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  const botReplies = {
    pricing: "Our software starts from ₹15,000/year. Each product has Basic, Pro and Enterprise tiers. Want me to recommend one?",
    demo: "We have 10+ demo websites — Schools, Hospitals, Construction, E-commerce, Real Estate and more. Visit our Website Demo gallery!",
    gps: "Our GPS tracking includes real-time location, route history, geofence alerts and live reports. Installation in 24 hrs.",
    quote: "Sure! Please share your name, business and requirement. Or fill the contact form for a detailed quote within 1 hour.",
    default: "Thanks! A KVL expert will respond shortly. For instant help, click the WhatsApp button below 👇"
  };
  const reply = (text) => {
    const t = text.toLowerCase();
    if (t.includes('pric') || t.includes('cost')) return botReplies.pricing;
    if (t.includes('demo') || t.includes('website')) return botReplies.demo;
    if (t.includes('gps') || t.includes('track')) return botReplies.gps;
    if (t.includes('quote') || t.includes('inquir')) return botReplies.quote;
    return botReplies.default;
  };
  const addMsg = (txt, who) => {
    const m = document.createElement('div');
    m.className = `msg ${who}`;
    m.textContent = txt;
    chatBody.appendChild(m);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  chatToggle?.addEventListener('click', () => chatbot.classList.toggle('open'));
  chatClose?.addEventListener('click', () => chatbot.classList.remove('open'));
  const sendMsg = () => {
    const v = chatInput.value.trim();
    if (!v) return;
    addMsg(v, 'user'); chatInput.value = '';
    setTimeout(() => addMsg(reply(v), 'bot'), 600);
  };
  chatSend?.addEventListener('click', sendMsg);
  chatInput?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
  document.querySelectorAll('.chat-quick button').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.q;
      addMsg(q, 'user');
      setTimeout(() => addMsg(reply(q), 'bot'), 500);
    });
  });

  // Demo filter
  document.querySelectorAll('.demo-filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.demo-filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.demo-card').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  // Contact form
  const cf = document.getElementById('contactForm');
  cf?.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you! We will contact you within 1 hour.');
    cf.reset();
  });
}

// ============ PARTICLES BACKGROUND ============
function initParticles() {
  const canvas = document.querySelector('.particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const setSize = () => {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  };
  setSize();
  window.addEventListener('resize', setSize);

  const COUNT = Math.min(80, Math.floor((w * h) / 14000));
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.5 + .5
    });
  }
  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? 'rgba(96,165,250,' : 'rgba(37,99,235,';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = color + '.7)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    // connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.strokeStyle = color + (0.15 * (1 - d / 110)) + ')';
          ctx.lineWidth = .5;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  };
  tick();
}

// ============ 3D TILT ============
function initTilt() {
  // Auto-add tilt to premium cards (idempotent)
  document.querySelectorAll('.svc-card, .case-card, .sw-card, .demo-card, .testi-card, .cert-card, .team-card, .ind-deep').forEach(c => c.classList.add('tilt'));
  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(0)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
    });
  });
}

// ============ BEFORE/AFTER SLIDER ============
function initBASlider() {
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const after = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;
    const move = (clientX) => {
      const r = slider.getBoundingClientRect();
      let pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = pct + '%';
    };
    handle.addEventListener('mousedown', () => dragging = true);
    handle.addEventListener('touchstart', () => dragging = true, { passive: true });
    document.addEventListener('mouseup', () => dragging = false);
    document.addEventListener('touchend', () => dragging = false);
    document.addEventListener('mousemove', e => dragging && move(e.clientX));
    document.addEventListener('touchmove', e => dragging && move(e.touches[0].clientX), { passive: true });
  });
}

// ============ VOICE INPUT ============
function initVoice() {
  const mic = document.getElementById('chatMic');
  const input = document.getElementById('chatInput');
  if (!mic) return;
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Speech) { mic.style.display = 'none'; return; }
  const rec = new Speech();
  rec.lang = 'en-IN'; rec.continuous = false;
  mic.addEventListener('click', () => {
    mic.classList.add('listening');
    try { rec.start(); } catch(e) {}
  });
  rec.onresult = (e) => { input.value = e.results[0][0].transcript; mic.classList.remove('listening'); };
  rec.onend = () => mic.classList.remove('listening');
  rec.onerror = () => mic.classList.remove('listening');
}

// ============ QUOTE GENERATOR ============
function initQuoteGen() {
  const modal = document.getElementById('quoteModal');
  if (!modal) return;
  const openers = document.querySelectorAll('[data-open-quote]');
  const closer = modal.querySelector('.qclose');
  openers.forEach(b => b.addEventListener('click', e => { e.preventDefault(); modal.classList.add('open'); }));
  closer?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

  let step = 0;
  const panes = modal.querySelectorAll('.q-pane');
  const dots = modal.querySelectorAll('.q-step');
  const selections = {};
  const show = () => {
    panes.forEach((p, i) => p.classList.toggle('active', i === step));
    dots.forEach((d, i) => d.classList.toggle('active', i <= step));
  };
  modal.querySelectorAll('.q-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      const group = opt.dataset.group;
      modal.querySelectorAll(`.q-opt[data-group="${group}"]`).forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selections[group] = { label: opt.dataset.label, price: +opt.dataset.price };
    });
  });
  modal.querySelector('.q-next')?.addEventListener('click', () => { if (step < panes.length - 1) { step++; show(); if (step === panes.length - 1) calc(); } });
  modal.querySelector('.q-prev')?.addEventListener('click', () => { if (step > 0) { step--; show(); } });
  const calc = () => {
    const base = (selections.type?.price || 0) + (selections.scope?.price || 0) + (selections.timeline?.price || 0);
    const low = base, high = Math.round(base * 1.6);
    const fmt = n => '₹' + n.toLocaleString('en-IN');
    modal.querySelector('.q-price').textContent = `${fmt(low)} – ${fmt(high)}`;
    modal.querySelector('.q-summary').textContent =
      `${selections.type?.label || ''} · ${selections.scope?.label || ''} · ${selections.timeline?.label || ''}`;
  };
}

// ============ HOSTING TOGGLE (software cards) ============
function initHostToggle() {
  document.querySelectorAll('.sw-host').forEach(host => {
    host.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        host.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
    });
  });
}

// ============ MOBILE/DESKTOP PREVIEW TOGGLE ============
function initPreviewToggle() {
  document.querySelectorAll('.preview-toggle').forEach(t => {
    t.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        t.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const thumb = t.parentElement;
        thumb.classList.toggle('mobile', b.dataset.view === 'mobile');
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderWidgets();
  attachGlobalHandlers();
  initParticles();
  initTilt();
  initBASlider();
  initVoice();
  initQuoteGen();
  initHostToggle();
  initPreviewToggle();
});
