window.App = window.App || {};

window.App.Landing = (function() {
  var splashEl = null;
  var landingEl = null;
  var loadingEl = null;
  var progressBar = null;

  function init() {
    splashEl = document.getElementById('splash-screen');
    landingEl = document.getElementById('landing-page');

    if (!splashEl && !landingEl) return;

    if (sessionStorage.getItem('landing_seen')) {
      if (splashEl) splashEl.style.display = 'none';
      if (landingEl) landingEl.style.display = 'none';
      return;
    }

    document.body.style.overflow = 'hidden';

    if (splashEl) {
      splashEl.style.display = 'flex';
      splashEl.setAttribute('aria-hidden', 'false');
      runSplash(function() {
        showLanding();
      });
    } else {
      showLanding();
    }
  }

  function runSplash(callback) {
    var titleEl = document.getElementById('splash-title');
    var barEl = document.getElementById('splash-progress-bar');
    var titleText = 'Registre d\'Appel Numérique';
    var charIndex = 0;

    function typeChar() {
      if (charIndex < titleText.length && titleEl) {
        titleEl.textContent += titleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 50 + Math.random() * 30);
      }
    }

    setTimeout(typeChar, 600);

    setTimeout(function() {
      if (barEl) barEl.style.width = '100%';
    }, 800);

    setTimeout(function() {
      if (splashEl) {
        splashEl.classList.add('hidden');
      }
      setTimeout(function() {
        if (splashEl) {
          splashEl.style.display = 'none';
          splashEl.setAttribute('aria-hidden', 'true');
        }
        if (callback) callback();
      }, 600);
    }, 2500);
  }

  function showLanding() {
    if (!landingEl) {
      document.body.style.overflow = '';
      window.location.hash = '#/dashboard';
      return;
    }

    landingEl.style.display = 'block';
    loadingEl = document.getElementById('landing-loading');
    progressBar = document.getElementById('loading-progress');

    createParticles();
    setupButtons();
    setupKeyboard();
  }

  function createParticles() {
    var container = document.getElementById('landing-particles');
    if (!container) return;
    for (var i = 0; i < 20; i++) {
      var particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 6 + 3) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDelay = (Math.random() * 8) + 's';
      particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
      container.appendChild(particle);
    }
  }

  function setupButtons() {
    var commencerBtn = document.getElementById('landing-commencer');
    var decouvrirBtn = document.getElementById('landing-decouvrir');

    if (commencerBtn) {
      commencerBtn.addEventListener('click', startTransition);
    }
    if (decouvrirBtn) {
      decouvrirBtn.addEventListener('click', function() {
        var welcomeCard = document.querySelector('.lp-welcome-card');
        if (welcomeCard) {
          welcomeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(startTransition, 1500);
        } else {
          startTransition();
        }
      });
    }
  }

  function setupKeyboard() {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (landingEl && landingEl.style.display !== 'none') {
          e.preventDefault();
          startTransition();
        }
      }
    });
  }

  function startTransition() {
    if (landingEl) landingEl.classList.add('transitioning');

    setTimeout(function() {
      if (loadingEl) loadingEl.classList.add('active');
      if (progressBar) {
        progressBar.style.width = '100%';
      }

      setTimeout(function() {
        if (landingEl) {
          landingEl.classList.add('fade-out');
        }
        document.body.style.overflow = '';

        setTimeout(function() {
          sessionStorage.setItem('landing_seen', '1');
          if (landingEl) landingEl.style.display = 'none';
          window.location.hash = '#/dashboard';
        }, 800);
      }, 1500);
    }, 500);
  }

  return { init: init };
})();
