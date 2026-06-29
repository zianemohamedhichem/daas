window.App = window.App || {};

window.App.Landing = (function() {
  var landingEl = null;
  var loadingEl = null;
  var progressBar = null;

  function init() {
    landingEl = document.getElementById('landing-page');
    if (!landingEl) return;

    if (sessionStorage.getItem('landing_seen')) {
      landingEl.style.display = 'none';
      return;
    }

    loadingEl = document.getElementById('landing-loading');
    progressBar = document.getElementById('loading-progress');

    landingEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';

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
        var welcomeCard = document.querySelector('.landing-welcome-card');
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
