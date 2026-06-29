window.App = window.App || {};
window.App.LandingHTML = (function() {
  function getHTML() {
    return '<div id="landing-page" class="landing-page" style="display:none">' +

      '<div class="landing-bg">' +
        '<div class="landing-rays"></div>' +
        '<div class="landing-particles" id="landing-particles"></div>' +
        '<div class="floating-element floating-el-1">📚</div>' +
        '<div class="floating-element floating-el-2">📖</div>' +
        '<div class="floating-element floating-el-3">ABC</div>' +
        '<div class="floating-element floating-el-4">🌿</div>' +
        '<div class="floating-element floating-el-5">📝</div>' +
        '<div class="floating-element floating-el-6">📚</div>' +
        '<div class="floating-element floating-el-7">📖</div>' +
      '</div>' +

      '<div class="landing-content">' +

        '<div class="landing-left">' +
          '<div class="landing-badge-group">' +
            '<span class="landing-badge badge-offline">📱 Offline Ready</span>' +
            '<span class="landing-badge badge-pwa">⚡ PWA</span>' +
            '<span class="landing-badge badge-secure">🔒 Secure</span>' +
            '<span class="landing-badge badge-fast">🚀 Fast</span>' +
            '<span class="landing-badge badge-github">🐙 GitHub Pages</span>' +
          '</div>' +

          '<h1 class="landing-title">' +
            'Registre d\'Appel<br>Numérique' +
          '</h1>' +

          '<p class="landing-subtitle-ar" dir="rtl">السجل الرقمي للحضور والغياب</p>' +

          '<p class="landing-description">' +
            'A modern digital attendance platform designed for Algerian primary schools.' +
          '</p>' +

          '<div class="landing-welcome-card">' +
            '<div class="welcome-avatar">DS</div>' +
            '<div class="welcome-info">' +
              '<div class="welcome-name">Daas Saïda <span class="welcome-name-ar">دعاس سعيدة</span></div>' +
              '<div class="welcome-role">Enseignante &bull; École Primaire</div>' +
              '<div class="welcome-year">Année scolaire 2025-2026</div>' +
            '</div>' +
          '</div>' +

          '<div class="landing-actions">' +
            '<button id="landing-commencer" class="landing-btn landing-btn-primary">' +
              '<i data-lucide="rocket"></i> Commencer' +
            '</button>' +
            '<button id="landing-decouvrir" class="landing-btn landing-btn-secondary">' +
              '<i data-lucide="eye"></i> Découvrir' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div class="landing-right">' +
          '<div class="smart-board">' +
            '<div class="board-screen">' +
              '<h2>Bonjour !</h2>' +
              '<p>Bienvenue</p>' +
              '<p class="board-subtitle">Registre d\'Appel Numérique</p>' +
              '<p class="board-desc">Gestion intelligente de la présence scolaire</p>' +
              '<div class="board-preview">' +
                '<div class="board-stat">' +
                  '<span class="board-stat-number">20</span>' +
                  '<span class="board-stat-label">Élèves</span>' +
                '</div>' +
                '<div class="board-stat">' +
                  '<span class="board-stat-number">2</span>' +
                  '<span class="board-stat-label">Classes</span>' +
                '</div>' +
                '<div class="board-stat">' +
                  '<span class="board-stat-number">94%</span>' +
                  '<span class="board-stat-label">Présence</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="landing-teacher">' +
            '<img src="assets/images/teacher-landing.svg" alt="Enseignante">' +
          '</div>' +
        '</div>' +

      '</div>' +

      '<div id="landing-loading" class="landing-loading">' +
        '<div class="loading-logo">' +
          '<div class="loading-spinner"></div>' +
          '<div class="loading-emblem">🏫</div>' +
        '</div>' +
        '<div class="loading-bar">' +
          '<div id="loading-progress" class="loading-progress"></div>' +
        '</div>' +
        '<p class="loading-text">Préparation de votre registre...</p>' +
      '</div>' +

    '</div>';
  }
  return { getHTML: getHTML };
})();
