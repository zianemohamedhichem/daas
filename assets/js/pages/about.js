window.App = window.App || {};
window.App.Pages = window.App.Pages || {};

window.App.Pages.About = (function () {
  function render() {
    var lang = window.App.I18n.getLanguage();
    var I18n = window.App.I18n;

    return '<div class="page-about">' +
      '<div class="page-header mb-4">' +
        '<h1 class="page-title">' + (lang === 'ar' ? 'حول التطبيق' : 'À Propos') + '</h1>' +
      '</div>' +

      /* Teacher Card */
      '<div class="about-card about-teacher-card mb-4">' +
        '<div class="about-card-inner" style="display:flex;align-items:center;gap:var(--space-8);flex-wrap:wrap">' +
          '<div class="about-avatar">' +
            '<svg viewBox="0 0 120 120" width="120" height="120" fill="none">' +
              '<defs><linearGradient id="aboutAvatarGrad" x1="0" y1="0" x2="120" y2="120"><stop offset="0%" stop-color="#10B981"/><stop offset="100%" stop-color="#059669"/></linearGradient></defs>' +
              '<circle cx="60" cy="60" r="58" fill="url(#aboutAvatarGrad)"/>' +
              '<text x="60" y="55" text-anchor="middle" dominant-baseline="central" fill="#fff" font-family="\'Playfair Display\', Georgia, serif" font-size="36" font-weight="700">DS</text>' +
              '<text x="60" y="82" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="\'Cairo\', sans-serif" font-size="10">أستاذة</text>' +
            '</svg>' +
          '</div>' +
          '<div class="about-teacher-info" style="flex:1;min-width:240px">' +
            '<h2 style="font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:700;color:var(--text);margin:0 0 4px">Daas Saïda <span dir="rtl" style="font-size:var(--text-lg);color:var(--primary);font-weight:500;margin-inline-start:8px">دعاس سعيدة</span></h2>' +
            '<p style="color:var(--text-secondary);margin:0 0 var(--space-2);font-size:var(--text-sm)">' +
              (lang === 'ar' ? 'أستاذة اللغة الفرنسية' : 'Professeure de Français') +
            '</p>' +
            '<p style="color:var(--text-tertiary);margin:0 0 var(--space-4);font-size:var(--text-xs)">' +
              (lang === 'ar' ? 'مدرسة عمر حمروني، بوزريعة، الجزائر' : 'École Omar Hamroune, Bouzareah, Alger') +
            '</p>' +
            '<div style="background:var(--primary-surface);border-radius:var(--radius-md);padding:var(--space-4);border-inline-start:3px solid var(--primary)">' +
              '<p style="margin:0;font-style:italic;color:var(--text-secondary);font-size:var(--text-sm);line-height:1.6">' +
                (lang === 'ar'
                  ? '"التعليم هو السلاح الأقوى الذي يمكنك استخدامه لتغيير العالم" — نيلسون مانديلا'
                  : '"L\'éducation est l\'arme la plus puissante que vous puissiez utiliser pour changer le monde" — Nelson Mandela') +
              '</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* School Card */
      '<div class="about-card mb-4">' +
        '<div class="about-card-header">' +
          '<span data-lucide="school" style="width:20px;height:20px;color:var(--info)"></span>' +
          '<h3 style="font-family:var(--font-heading);font-size:var(--text-lg);font-weight:600;margin:0">' + (lang === 'ar' ? 'المدرسة' : 'École') + '</h3>' +
        '</div>' +
        '<div class="about-card-body">' +
          '<div class="about-info-grid">' +
            '<div class="about-info-item">' +
              '<span class="about-info-label">' + (lang === 'ar' ? 'الاسم بالفرنسية' : 'Nom (FR)') + '</span>' +
              '<span class="about-info-value">École Omar Hamroune</span>' +
            '</div>' +
            '<div class="about-info-item">' +
              '<span class="about-info-label">' + (lang === 'ar' ? 'الاسم بالعربية' : 'Nom (AR)') + '</span>' +
              '<span class="about-info-value" dir="rtl">مدرسة عمر حمروني</span>' +
            '</div>' +
            '<div class="about-info-item">' +
              '<span class="about-info-label">' + (lang === 'ar' ? 'الولاية' : 'Wilaya') + '</span>' +
              '<span class="about-info-value">' + (lang === 'ar' ? 'الجزائر' : 'Alger') + '</span>' +
            '</div>' +
            '<div class="about-info-item">' +
              '<span class="about-info-label">' + (lang === 'ar' ? 'البلدية' : 'Commune') + '</span>' +
              '<span class="about-info-value">' + (lang === 'ar' ? 'بوزريعة' : 'Bouzareah') + '</span>' +
            '</div>' +
            '<div class="about-info-item">' +
              '<span class="about-info-label">' + (lang === 'ar' ? 'المستوى' : 'Niveau') + '</span>' +
              '<span class="about-info-value">' + (lang === 'ar' ? 'مرحلة ابتدائية' : 'École primaire') + '</span>' +
            '</div>' +
            '<div class="about-info-item">' +
              '<span class="about-info-label">' + (lang === 'ar' ? 'السنة الدراسية' : 'Année scolaire') + '</span>' +
              '<span class="about-info-value">2026–2027</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* Project Card */
      '<div class="about-card mb-4">' +
        '<div class="about-card-header">' +
          '<span data-lucide="code-2" style="width:20px;height:20px;color:var(--accent)"></span>' +
          '<h3 style="font-family:var(--font-heading);font-size:var(--text-lg);font-weight:600;margin:0">' + (lang === 'ar' ? 'المشروع' : 'Projet') + '</h3>' +
        '</div>' +
        '<div class="about-card-body">' +
          '<div style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-bottom:var(--space-4)">' +
            '<span class="about-tech-tag">HTML5</span>' +
            '<span class="about-tech-tag">CSS3</span>' +
            '<span class="about-tech-tag">Bootstrap 5.3</span>' +
            '<span class="about-tech-tag">Vanilla JS</span>' +
            '<span class="about-tech-tag">IndexedDB</span>' +
            '<span class="about-tech-tag">Chart.js</span>' +
            '<span class="about-tech-tag">jsPDF</span>' +
            '<span class="about-tech-tag">SheetJS</span>' +
            '<span class="about-tech-tag">Service Worker</span>' +
            '<span class="about-tech-tag">PWA</span>' +
          '</div>' +
          '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:var(--space-3)">' +
            '<li style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);color:var(--text-secondary)">' +
              '<span style="width:6px;height:6px;border-radius:50%;background:var(--primary);flex-shrink:0"></span>' +
              (lang === 'ar' ? 'تطبيق ويب تقدمي قابل للتثبيت' : 'Progressive Web App installable') +
            '</li>' +
            '<li style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);color:var(--text-secondary)">' +
              '<span style="width:6px;height:6px;border-radius:50%;background:var(--primary);flex-shrink:0"></span>' +
              (lang === 'ar' ? 'يعمل بدون اتصال بالإنترنت' : 'Works fully offline') +
            '</li>' +
            '<li style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);color:var(--text-secondary)">' +
              '<span style="width:6px;height:6px;border-radius:50%;background:var(--primary);flex-shrink:0"></span>' +
              (lang === 'ar' ? 'دعم كامل للعربية والفرنسية' : 'Full bilingual support (AR/FR)') +
            '</li>' +
            '<li style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);color:var(--text-secondary)">' +
              '<span style="width:6px;height:6px;border-radius:50%;background:var(--primary);flex-shrink:0"></span>' +
              (lang === 'ar' ? 'متجاوب مع جميع الأجهزة' : 'Responsive for all devices') +
            '</li>' +
            '<li style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);color:var(--text-secondary)">' +
              '<span style="width:6px;height:6px;border-radius:50%;background:var(--primary);flex-shrink:0"></span>' +
              (lang === 'ar' ? 'تصدير PDF و Excel' : 'PDF and Excel export') +
            '</li>' +
            '<li style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);color:var(--text-secondary)">' +
              '<span style="width:6px;height:6px;border-radius:50%;background:var(--primary);flex-shrink:0"></span>' +
              (lang === 'ar' ? 'متوافق مع GitHub Pages' : 'GitHub Pages compatible') +
            '</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +

      /* Credits */
      '<div class="about-credits text-center mt-6" style="padding:var(--space-8) 0;border-top:1px solid var(--divider)">' +
        '<p style="font-size:var(--text-sm);color:var(--text-secondary);margin:0 0 var(--space-2)">' +
          (lang === 'ar' ? 'صُنع بـ ❤️ من أجل التعليم الجزائري' : 'Développé avec ❤️ pour l\'éducation algérienne') +
        '</p>' +
        '<p style="font-size:var(--text-xs);color:var(--text-tertiary);margin:0">' +
          'Registre d\'Appel Numérique · v1.0.0 · 2026' +
        '</p>' +
      '</div>' +
    '</div>';
  }

  function init() {
    setTimeout(function() { if (window.lucide) lucide.createIcons(); }, 0);
  }

  return { render: render, init: init };
})();
