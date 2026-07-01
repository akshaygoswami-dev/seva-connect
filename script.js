// ==========================================
// SEVA CONNECT — Main JavaScript (v2)
// Clean, purposeful, no bloat
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollAnimations();
  initQuotes();
  initFAQ();
  initBackToTop();
  registerServiceWorker();
});

// ─── THEME TOGGLE ───
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  const html = document.documentElement;

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved === 'dark' || (!saved && prefersDark)) {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      html.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
  }
}

// ─── MOBILE NAVIGATION ───
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  const closeBtn = document.getElementById('mobileNavClose');

  function openNav() {
    mobileNav.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  if (overlay) overlay.addEventListener('click', closeNav);

  // Close on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }
}

// ─── SCROLL ANIMATIONS ───
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ─── DYNAMIC QUOTES ───
// Original, non-copyrighted humanitarian quotes
const QUOTES = [
  "A community grows stronger not by the size of its buildings, but by the depth of its compassion.",
  "The smallest act of kindness carries more weight than the grandest intention.",
  "Service is not about doing extraordinary things; it is about doing ordinary things with extraordinary care.",
  "When one person reaches out, a chain of hope begins.",
  "We do not need to wait for perfect conditions to start helping. We only need to start.",
  "Real change begins when someone decides that another person's struggle matters as much as their own.",
  "The world does not need more heroes. It needs more neighbors who care.",
  "Compassion is not a burden. It is a bridge.",
  "Every volunteer who shows up quietly changes the story of someone's hardest day.",
  "Kindness does not require permission, resources, or recognition. It only requires willingness.",
  "The strength of a society is measured by how it treats its most vulnerable members.",
  "A single conversation can open a door that a thousand programs cannot.",
  "Hope is not something we find. It is something we create by showing up for each other.",
  "Clean water, safe shelter, and a listening ear are not luxuries. They are the foundation of dignity.",
  "No one should have to face a crisis alone. Community is the answer.",
  "Education does not just open minds. It opens futures.",
  "Protecting the environment is not activism. It is responsibility.",
  "Mental health is not a weakness to hide. It is a reality to respect.",
  "Giving blood takes minutes. The life it saves lasts decades.",
  "True empowerment means giving people the tools to lift themselves.",
  "Disaster does not discriminate. Neither should our response.",
  "A tree planted today is shade for someone we may never meet.",
  "Awareness is the quiet beginning of every revolution.",
  "Children who are protected today become the protectors of tomorrow.",
  "The cost of ignoring a problem is always greater than the cost of addressing it.",
  "Every person deserves access to the information that could save their life.",
  "Volunteering is not charity. It is solidarity.",
  "When we educate one girl, we educate a generation.",
  "Plastic-free living is not perfection. It is progress.",
  "Climate change is not a distant threat. It is a present responsibility.",
  "Food safety is not a privilege. It is a right.",
  "A society that values prevention saves more lives than one that only reacts to crises.",
  "Service teaches us that we are all connected, whether we realize it or not.",
  "The best time to help was yesterday. The next best time is now.",
  "Trust is built one honest action at a time.",
  "Listening is the most underrated form of service.",
  "We rise by lifting others — not in theory, but in practice.",
  "Accessibility is not an afterthought. It is a measure of our humanity.",
  "Every act of service, no matter how small, ripples outward in ways we cannot measure.",
  "The difference between apathy and action is often just one person who decides to care.",
  "Safe communities are built by people who refuse to look away.",
  "Transparency is the foundation of every organization worth trusting.",
  "Health awareness saves more lives than medicine alone.",
  "A volunteer does not change the world alone, but the world does not change without them.",
  "Empathy without action is sympathy. Empathy with action is service.",
  "Water conservation is not sacrifice. It is stewardship.",
  "Every community has helpers. Our job is to connect them.",
  "The most powerful thing you can give someone in crisis is your time.",
  "Sustainable living is the greatest gift we can leave for the next generation.",
  "When we protect nature, we protect ourselves."
];

function initQuotes() {
  const quoteEl = document.getElementById('quoteText');
  if (quoteEl) {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    quoteEl.textContent = '"' + randomQuote + '"';
  }
}

// ─── FAQ ACCORDION ───
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const answer = q.nextElementSibling;
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// ─── BACK TO TOP ───
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}



// ─── SERVICE WORKER ───
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}
// ─── AWARENESS FEATURED SHOWCASE CAROUSEL ───
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('awarenessCarousel');
  if (!carousel) return;

  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const cards = carousel.querySelectorAll('.showcase-card');
  
  if (cards.length === 0) return;

  // Configuration
  const REST_DURATION = 5000; // 5 seconds
  const RESUME_DELAY = 2500; // 2.5 seconds after interaction
  let autoScrollTimer = null;
  let resumeTimer = null;
  let isInteracting = false;

  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getScrollAmount = () => {
    // Scroll by the width of one card + gap
    return cards[0].offsetWidth + parseInt(window.getComputedStyle(carousel).gap || 24);
  };

  const scrollNext = () => {
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    // If we are at the end (allow 10px threshold for rounding errors), rewind to start
    if (carousel.scrollLeft >= maxScrollLeft - 10) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    // If at the beginning, go to the end
    if (carousel.scrollLeft <= 10) {
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      carousel.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    }
  };

  // Button Listeners
  if (nextBtn) nextBtn.addEventListener('click', () => {
    scrollNext();
    handleInteraction();
  });
  
  if (prevBtn) prevBtn.addEventListener('click', () => {
    scrollPrev();
    handleInteraction();
  });

  // Auto-Scroll Logic
  const startAutoScroll = () => {
    if (prefersReducedMotion || isInteracting) return;
    stopAutoScroll();
    autoScrollTimer = setInterval(scrollNext, REST_DURATION);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  };

  const handleInteractionStart = () => {
    isInteracting = true;
    stopAutoScroll();
    if (resumeTimer) clearTimeout(resumeTimer);
  };

  const handleInteractionEnd = () => {
    isInteracting = false;
    if (prefersReducedMotion) return;
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoScroll, RESUME_DELAY);
  };

  const handleInteraction = () => {
    handleInteractionStart();
    handleInteractionEnd(); // Instantly trigger the resume timer
  };

  // Pause on hover, touch, and focus
  carousel.addEventListener('mouseenter', handleInteractionStart);
  carousel.addEventListener('mouseleave', handleInteractionEnd);
  
  carousel.addEventListener('touchstart', handleInteractionStart, { passive: true });
  carousel.addEventListener('touchend', handleInteractionEnd, { passive: true });
  
  carousel.addEventListener('focusin', handleInteractionStart);
  carousel.addEventListener('focusout', handleInteractionEnd);

  // Initialize
  if (!prefersReducedMotion) {
    startAutoScroll();
  }
});

// ─── SPLASH SCREEN LOGIC ───
window.addEventListener('load', () => {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    // Keep splash screen visible for exactly 1.5 seconds (1500ms)
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      
      // Remove it completely from the DOM after the 0.5s fade finishes
      setTimeout(() => {
        splashScreen.remove();
      }, 500);
      
    }, 1500);
  }
});

// ─── FIREBASE: VOLUNTEER REGISTRATION ───
(function() {
  // Only run if Firebase is loaded and the volunteer modal exists
  if (typeof firebase === 'undefined') return;
  const overlay = document.getElementById('volunteerModalOverlay');
  if (!overlay) return;

  // Initialize Firebase (only if not already initialized)
  const firebaseConfig = {
    apiKey: "AIzaSyAhl7wmLYoCJKcnibjx3AfIUeyj5nCp6QI",
    authDomain: "seva-connect-65af9.firebaseapp.com",
    projectId: "seva-connect-65af9",
    storageBucket: "seva-connect-65af9.firebasestorage.app",
    messagingSenderId: "243452092362",
    appId: "1:243452092362:web:088dae160b14bd7c1b7933",
    measurementId: "G-RKM71RV63B"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();

  // Elements
  const openBtn = document.getElementById('openVolunteerModal');
  const closeBtn = document.getElementById('closeVolunteerModal');
  const cancelBtn = document.getElementById('cancelVolunteerModal');
  const form = document.getElementById('volunteerForm');
  const submitBtn = document.getElementById('volSubmitBtn');
  const alertBox = document.getElementById('volAlert');

  // Open modal
  function openModal() {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeModal() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    if (alertBox) { alertBox.style.display = 'none'; }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  // Show alert
  function showAlert(message, isSuccess) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    if (isSuccess) {
      alertBox.style.background = '#ECFDF5';
      alertBox.style.color = '#059669';
      alertBox.style.border = '1px solid #A7F3D0';
    } else {
      alertBox.style.background = '#FEF2F2';
      alertBox.style.color = '#DC2626';
      alertBox.style.border = '1px solid #FECACA';
    }
  }

  // Submit volunteer registration to Firestore
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.textContent = 'Registering...';
      submitBtn.disabled = true;

      const volunteerData = {
        name: document.getElementById('volName').value.trim(),
        email: document.getElementById('volEmail').value.trim(),
        phone: document.getElementById('volPhone').value.trim() || '',
        interest: document.getElementById('volInterest').value,
        message: document.getElementById('volMessage').value.trim() || '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };

      try {
        await db.collection('volunteers').add(volunteerData);
        showAlert('✓ Thank you for registering! Our team will contact you soon.', true);
        form.reset();

        // Close modal after a short delay so user can see success
        setTimeout(() => {
          closeModal();
        }, 2500);
      } catch (error) {
        console.error('Volunteer registration error:', error);
        showAlert('✗ Registration failed. Please try again later.', false);
      } finally {
        submitBtn.textContent = 'Register';
        submitBtn.disabled = false;
      }
    });
  }

  // Submit Contact / Help Request to Firestore
  const contactForm = document.getElementById('contactForm');
  const contactBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
  
  if (contactForm && contactBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const originalText = contactBtn.textContent;
      contactBtn.textContent = 'Sending securely...';
      contactBtn.disabled = true;

      try {
        await db.collection('requests').add({
          name: document.getElementById('userName').value.trim(),
          phone: document.getElementById('userPhone').value.trim(),
          type: document.getElementById('helpType').value,
          location: document.getElementById('userLocation').value.trim(),
          message: document.getElementById('message').value.trim(),
          status: 'Urgent',
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert("✓ Your request has been securely sent. The Seva Connect Team will review it shortly.");
        contactForm.reset();
      } catch (error) {
        console.error('Contact form error:', error);
        alert("✗ Failed to send request. Please try again or use the email provided.");
      } finally {
        contactBtn.textContent = originalText;
        contactBtn.disabled = false;
      }
    });
  }

})();
