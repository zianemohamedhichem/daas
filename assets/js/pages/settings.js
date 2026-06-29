window.App = window.App || {};
window.App.Pages = window.App.Pages || {};

window.App.Pages.Settings = (function () {
  var settings = {};
  var deferredPrompt = null;

  function render() {
    return '<div class="page-settings">' +
      '<div class="page-header mb-4">' +
        '<h1 class="page-title" data-i18n="settings.title">' + window.App.I18n.t('settings.title') + '</h1>' +
      '</div>' +
      '<div class="row g-4">' +
        '<div class="col-lg-8">' +
          '<div class="card mb-4">' +
            '<div class="card-header"><h5 class="card-title mb-0"><i class="bi bi-palette me-2"></i>' + window.App.I18n.t('settings.theme') + '</h5></div>' +
            '<div class="card-body">' +
              '<div class="d-flex align-items-center justify-content-between">' +
                '<div><p class="mb-1 fw-semibold">' + window.App.I18n.t('settings.theme') + '</p><p class="text-muted mb-0 small">Clair / Sombre</p></div>' +
                '<div class="form-check form-switch">' +
                  '<input class="form-check-input" type="checkbox" id="setting-theme" style="cursor:pointer">' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="card mb-4">' +
            '<div class="card-header"><h5 class="card-title mb-0"><i class="bi bi-translate me-2"></i>' + window.App.I18n.t('settings.language') + '</h5></div>' +
            '<div class="card-body">' +
              '<div class="d-flex gap-3">' +
                '<button class="btn btn-outline-primary lang-btn" data-lang="fr">Français</button>' +
                '<button class="btn btn-outline-primary lang-btn" data-lang="ar">العربية</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="card mb-4">' +
            '<div class="card-header"><h5 class="card-title mb-0"><i class="bi bi-paint-bucket me-2"></i>' + window.App.I18n.t('settings.weekendColor') + '</h5></div>' +
            '<div class="card-body">' +
              '<div class="row g-3">' +
                '<div class="col-md-6">' +
                  '<label class="form-label">' + window.App.I18n.t('attendance.present') + '</label>' +
                  '<input type="color" class="form-control form-control-color" id="color-present" value="#2E7D32">' +
                '</div>' +
                '<div class="col-md-6">' +
                  '<label class="form-label">' + window.App.I18n.t('attendance.absent') + '</label>' +
                  '<input type="color" class="form-control form-control-color" id="color-absent" value="#C62828">' +
                '</div>' +
                '<div class="col-md-4">' +
                  '<label class="form-label">' + window.App.I18n.t('attendance.late') + '</label>' +
                  '<input type="color" class="form-control form-control-color" id="color-late" value="#F57F17">' +
                '</div>' +
                '<div class="col-md-4">' +
                  '<label class="form-label">' + window.App.I18n.t('attendance.excused') + '</label>' +
                  '<input type="color" class="form-control form-control-color" id="color-excused" value="#1565C0">' +
                '</div>' +
                '<div class="col-md-4">' +
                  '<label class="form-label">' + window.App.I18n.t('attendance.medical') + '</label>' +
                  '<input type="color" class="form-control form-control-color" id="color-medical" value="#7B1FA2">' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="card mb-4">' +
            '<div class="card-header"><h5 class="card-title mb-0"><i class="bi bi-clipboard-check me-2"></i>' + window.App.I18n.t('attendance.title') + '</h5></div>' +
            '<div class="card-body">' +
              '<div class="d-flex align-items-center justify-content-between mb-3">' +
                '<div><p class="mb-1 fw-semibold">' + window.App.I18n.t('settings.autosave') + '</p></div>' +
                '<div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="setting-autosave" checked style="cursor:pointer"></div>' +
              '</div>' +
              '<div>' +
                '<label class="form-label fw-semibold">Statut par défaut</label>' +
                '<select class="form-select" id="setting-default-status" style="max-width:200px">' +
                  '<option value="present">' + window.App.I18n.t('attendance.present') + '</option>' +
                  '<option value="absent">' + window.App.I18n.t('attendance.absent') + '</option>' +
                  '<option value="late">' + window.App.I18n.t('attendance.late') + '</option>' +
                '</select>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="card mb-4">' +
            '<div class="card-header"><h5 class="card-title mb-0"><i class="bi bi-database me-2"></i>Données</h5></div>' +
            '<div class="card-body">' +
              '<div class="d-flex flex-wrap gap-2">' +
                '<button id="setting-export" class="btn btn-outline-primary"><i class="bi bi-download me-1"></i>' + window.App.I18n.t('settings.exportData') + '</button>' +
                '<label class="btn btn-outline-success mb-0"><i class="bi bi-upload me-1"></i>' + window.App.I18n.t('settings.importData') + '<input type="file" id="setting-import" accept=".json" class="d-none"></label>' +
                '<button id="setting-reset" class="btn btn-outline-danger"><i class="bi bi-trash me-1"></i>' + window.App.I18n.t('settings.resetData') + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="card mb-4">' +
            '<div class="card-header"><h5 class="card-title mb-0"><i class="bi bi-info-circle me-2"></i>' + window.App.I18n.t('settings.about') + '</h5></div>' +
            '<div class="card-body">' +
              '<table class="table table-borderless mb-0">' +
                '<tr><td class="fw-semibold">' + window.App.I18n.t('settings.version') + '</td><td>1.0.0</td></tr>' +
                '<tr><td class="fw-semibold">Enseignant</td><td>Daas Saïda / دعاس سعيدة</td></tr>' +
                '<tr><td class="fw-semibold">' + window.App.I18n.t('register.school') + '</td><td>École Omar Hamroune / مدرسة عمر حمرون</td></tr>' +
                '<tr><td class="fw-semibold">' + window.App.I18n.t('register.schoolYear') + '</td><td>2026/2027</td></tr>' +
                '<tr><td class="fw-semibold">Localisation</td><td>Bouzareah, Algeria</td></tr>' +
              '</table>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="col-lg-4">' +
          '<div class="card mb-4 position-sticky" style="top:80px">' +
            '<div class="card-body text-center">' +
              '<i class="bi bi-phone text-primary" style="font-size:48px"></i>' +
              '<h5 class="mt-3">' + window.App.I18n.t('settings.installApp') + '</h5>' +
              '<p class="text-muted small">Installez l\'application pour un accès rapide</p>' +
              '<button id="setting-install" class="btn btn-primary w-100" disabled><i class="bi bi-download me-1"></i>' + window.App.I18n.t('settings.installApp') + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function init() {
    window.beforeinstallprompt = function (e) {
      e.preventDefault();
      deferredPrompt = e;
      var installBtn = document.getElementById('setting-install');
      if (installBtn) installBtn.disabled = false;
    };

    loadSettings().then(function () {
      setupThemeToggle();
      setupLanguageButtons();
      setupColorPickers();
      setupAutosave();
      setupDefaultStatus();
      setupDataActions();
      setupInstallButton();
    });
  }

  function loadSettings() {
    var keys = ['theme', 'language', 'autosave', 'defaultStatus', 'color-present', 'color-absent', 'color-late', 'color-excused', 'color-medical'];
    var promises = keys.map(function (key) {
      return window.App.DB.get('settings', key).then(function (result) {
        settings[key] = result ? result.value : null;
      }).catch(function () {});
    });

    return Promise.all(promises).then(function () {
      var themeToggle = document.getElementById('setting-theme');
      if (themeToggle) themeToggle.checked = settings.theme === 'dark';

      var autosaveToggle = document.getElementById('setting-autosave');
      if (autosaveToggle) autosaveToggle.checked = settings.autosave !== false;

      var defaultStatus = document.getElementById('setting-default-status');
      if (defaultStatus && settings.defaultStatus) defaultStatus.value = settings.defaultStatus;

      var lang = settings.language || window.App.I18n.getLanguage();
      document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        btn.classList.toggle('btn-primary', btn.getAttribute('data-lang') === lang);
        btn.classList.toggle('btn-outline-primary', btn.getAttribute('data-lang') !== lang);
      });

      var colorFields = ['present', 'absent', 'late', 'excused', 'medical'];
      colorFields.forEach(function (field) {
        var input = document.getElementById('color-' + field);
        if (input && settings['color-' + field]) input.value = settings['color-' + field];
      });
    });
  }

  function saveSetting(key, value) {
    settings[key] = value;
    return window.App.DB.put('settings', { key: key, value: value });
  }

  function setupThemeToggle() {
    var toggle = document.getElementById('setting-theme');
    if (!toggle) return;
    toggle.addEventListener('change', function () {
      var theme = toggle.checked ? 'dark' : 'light';
      saveSetting('theme', theme);
      if (toggle.checked) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }

  function setupLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        window.App.I18n.setLanguage(lang);
        saveSetting('language', lang);
        document.querySelectorAll('.lang-btn').forEach(function (b) {
          b.classList.toggle('active', b === btn);
          b.classList.toggle('btn-primary', b === btn);
          b.classList.toggle('btn-outline-primary', b !== btn);
        });
      });
    });
  }

  function setupColorPickers() {
    var fields = ['present', 'absent', 'late', 'excused', 'medical'];
    fields.forEach(function (field) {
      var input = document.getElementById('color-' + field);
      if (!input) return;
      input.addEventListener('change', function () {
        saveSetting('color-' + field, input.value);
        window.App.UI.showToast('Couleur mise à jour', 'success');
      });
    });
  }

  function setupAutosave() {
    var toggle = document.getElementById('setting-autosave');
    if (!toggle) return;
    toggle.addEventListener('change', function () {
      saveSetting('autosave', toggle.checked);
    });
  }

  function setupDefaultStatus() {
    var select = document.getElementById('setting-default-status');
    if (!select) return;
    select.addEventListener('change', function () {
      saveSetting('defaultStatus', select.value);
    });
  }

  function setupDataActions() {
    var exportBtn = document.getElementById('setting-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        Promise.all([
          window.App.DB.getAll('classes'),
          window.App.DB.getAll('students'),
          window.App.DB.getAll('attendance'),
          window.App.DB.getAll('holidays'),
          window.App.DB.getAll('settings')
        ]).then(function (results) {
          var data = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            classes: results[0],
            students: results[1],
            attendance: results[2],
            holidays: results[3],
            settings: results[4]
          };
          var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'registre_backup_' + new Date().toISOString().split('T')[0] + '.json';
          a.click();
          URL.revokeObjectURL(url);
          window.App.UI.showToast('Données exportées', 'success');
        }).catch(function () {
          window.App.UI.showToast('Erreur d\'export', 'error');
        });
      });
    }

    var importInput = document.getElementById('setting-import');
    if (importInput) {
      importInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (event) {
          try {
            var data = JSON.parse(event.target.result);
            var promises = [];
            if (data.classes && data.classes.length) promises.push(window.App.DB.bulkAdd('classes', data.classes));
            if (data.students && data.students.length) promises.push(window.App.DB.bulkAdd('students', data.students));
            if (data.attendance && data.attendance.length) promises.push(window.App.DB.bulkAdd('attendance', data.attendance));
            if (data.holidays && data.holidays.length) promises.push(window.App.DB.bulkAdd('holidays', data.holidays));
            if (data.settings && data.settings.length) promises.push(window.App.DB.bulkAdd('settings', data.settings));

            Promise.all(promises).then(function () {
              window.App.UI.showToast('Données importées', 'success');
            }).catch(function () {
              window.App.UI.showToast('Erreur d\'import', 'error');
            });
          } catch (err) {
            window.App.UI.showToast('Fichier invalide', 'error');
          }
        };
        reader.readAsText(file);
        importInput.value = '';
      });
    }

    var resetBtn = document.getElementById('setting-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        window.App.UI.confirm('Réinitialiser les données', 'Toutes les données seront supprimées. Cette action est irréversible.').then(function (confirmed) {
          if (!confirmed) return;
          Promise.all([
            window.App.DB.clear('classes'),
            window.App.DB.clear('students'),
            window.App.DB.clear('attendance'),
            window.App.DB.clear('holidays')
          ]).then(function () {
            window.App.UI.showToast('Données réinitialisées', 'success');
          }).catch(function () {
            window.App.UI.showToast('Erreur', 'error');
          });
        });
      });
    }
  }

  function setupInstallButton() {
    var installBtn = document.getElementById('setting-install');
    if (!installBtn) return;
    installBtn.addEventListener('click', function () {
      if (!deferredPrompt) {
        window.App.UI.showToast('Application déjà installée', 'info');
        return;
      }
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function (choice) {
        if (choice.outcome === 'accepted') {
          window.App.UI.showToast('Application installée', 'success');
        }
        deferredPrompt = null;
      });
    });
  }

  return { render: render, init: init };
})();
