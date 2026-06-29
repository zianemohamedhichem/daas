window.App = window.App || {};
window.App.Pages = window.App.Pages || {};

window.App.Pages.Classes = (function () {
  var allClasses = [];
  var studentCounts = {};

  function render() {
    return '<div class="page-classes">' +
      '<div class="page-header d-flex justify-content-between align-items-center mb-4">' +
        '<h1 class="page-title" data-i18n="classes.title">' + window.App.I18n.t('classes.title') + '</h1>' +
        '<button id="add-class-btn" class="btn btn-primary"><i class="bi bi-plus-lg me-1"></i>' + window.App.I18n.t('classes.addClass') + '</button>' +
      '</div>' +
      '<div id="classes-container" class="row g-3">' +
        '<div class="col-12 text-center py-4"><i class="bi bi-hourglass-split"></i> ' + window.App.I18n.t('common.loading') + '</div>' +
      '</div>' +
    '</div>';
  }

  function init() {
    loadClasses();
    var addBtn = document.getElementById('add-class-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function () { openClassModal(null); });
    }
  }

  function loadClasses() {
    window.App.Loading.show();
    Promise.all([
      window.App.DB.getAll('classes'),
      window.App.DB.getAll('students')
    ]).then(function (results) {
      allClasses = results[0] || [];
      var students = results[1] || [];

      studentCounts = {};
      students.forEach(function (s) {
        if (!studentCounts[s.classId]) studentCounts[s.classId] = 0;
        studentCounts[s.classId]++;
      });

      renderClasses();
      window.App.Loading.hide();
    }).catch(function () {
      window.App.Loading.hide();
      renderClasses();
    });
  }

  function renderClasses() {
    var container = document.getElementById('classes-container');
    if (!container) return;

    if (allClasses.length === 0) {
      container.innerHTML = window.App.UI.createEmptyState('bi-book', window.App.I18n.t('classes.noClasses'), window.App.I18n.t('classes.addClass'), function () { openClassModal(null); });
      return;
    }

    var html = '';
    allClasses.forEach(function (cls) {
      var count = studentCounts[cls.id] || 0;
      html += '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">' +
        '<div class="card class-card h-100" data-class-id="' + cls.id + '">' +
          '<div class="card-body cursor-pointer" data-action="view-details" data-id="' + cls.id + '">' +
            '<div class="d-flex justify-content-between align-items-start mb-2">' +
              '<h5 class="card-title mb-0">' + window.App.Helpers.capitalize(cls.name || '') + '</h5>' +
              '<span class="badge bg-primary">' + (cls.section || '') + '</span>' +
            '</div>' +
            '<p class="card-text text-muted mb-2">' +
              '<i class="bi bi-layers me-1"></i>' + window.App.I18n.t('classes.level') + ' ' + (cls.level || '') +
            '</p>' +
            '<p class="card-text">' +
              '<i class="bi bi-people me-1"></i>' + count + ' ' + window.App.I18n.t('classes.students') +
            '</p>' +
            '<p class="card-text"><small class="text-muted"><i class="bi bi-calendar me-1"></i>' + (cls.year || '') + '</small></p>' +
          '</div>' +
          '<div class="card-footer bg-transparent border-top-0">' +
            '<div class="btn-group btn-group-sm w-100">' +
              '<button class="btn btn-outline-primary" data-action="edit" data-id="' + cls.id + '" title="' + window.App.I18n.t('common.edit') + '"><i class="bi bi-pencil"></i></button>' +
              '<button class="btn btn-outline-danger" data-action="delete" data-id="' + cls.id + '" title="' + window.App.I18n.t('common.delete') + '"><i class="bi bi-trash"></i></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    container.innerHTML = html;

    container.querySelectorAll('[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var action = btn.getAttribute('data-action');
        var id = parseInt(btn.getAttribute('data-id'), 10);
        if (action === 'edit') {
          openClassModal(id);
        } else if (action === 'delete') {
          deleteClass(id);
        } else if (action === 'view-details') {
          viewClassDetails(id);
        }
      });
    });
  }

  function openClassModal(classId) {
    var cls = null;
    if (classId) {
      cls = allClasses.find(function (c) { return c.id === classId; });
    }
    var isEdit = !!cls;
    var title = isEdit ? window.App.I18n.t('classes.editClass') : window.App.I18n.t('classes.addClass');

    var sections = ['A', 'B', 'C', 'D'];
    var levels = [1, 2, 3, 4, 5, 6];

    var sectionOptions = '<option value="">—</option>';
    sections.forEach(function (s) {
      sectionOptions += '<option value="' + s + '"' + (cls && cls.section === s ? ' selected' : '') + '>' + s + '</option>';
    });

    var levelOptions = '<option value="">—</option>';
    levels.forEach(function (l) {
      levelOptions += '<option value="' + l + '"' + (cls && cls.level === l ? ' selected' : '') + '>' + l + '</option>';
    });

    var html = '<form id="class-form">' +
      '<div class="mb-3">' +
        '<label class="form-label">' + window.App.I18n.t('classes.className') + ' (FR)</label>' +
        '<input type="text" class="form-control" id="class-name" value="' + (cls ? cls.name || '' : '') + '" required>' +
      '</div>' +
      '<div class="mb-3">' +
        '<label class="form-label">' + window.App.I18n.t('classes.className') + ' (AR)</label>' +
        '<input type="text" class="form-control" id="class-name-ar" value="' + (cls ? cls.nameAr || '' : '') + '" dir="rtl">' +
      '</div>' +
      '<div class="row">' +
        '<div class="col-md-4 mb-3">' +
          '<label class="form-label">' + window.App.I18n.t('classes.section') + '</label>' +
          '<select class="form-select" id="class-section">' + sectionOptions + '</select>' +
        '</div>' +
        '<div class="col-md-4 mb-3">' +
          '<label class="form-label">' + window.App.I18n.t('classes.level') + '</label>' +
          '<select class="form-select" id="class-level">' + levelOptions + '</select>' +
        '</div>' +
        '<div class="col-md-4 mb-3">' +
          '<label class="form-label">Année</label>' +
          '<input type="text" class="form-control" id="class-year" value="' + (cls ? cls.year || '2026/2027' : '2026/2027') + '">' +
        '</div>' +
      '</div>' +
    '</form>';

    window.App.UI.showModal(title, html, {
      confirmText: window.App.I18n.t('common.save'),
      onConfirm: function () {
        var name = document.getElementById('class-name').value.trim();
        var nameAr = document.getElementById('class-name-ar').value.trim();
        var section = document.getElementById('class-section').value;
        var level = document.getElementById('class-level').value;
        var year = document.getElementById('class-year').value.trim();

        if (!name) {
          window.App.UI.showToast('Le nom est requis', 'warning');
          return;
        }

        var data = { name: name, nameAr: nameAr, section: section, level: parseInt(level, 10) || 0, year: year };

        var promise;
        if (isEdit) {
          data.id = cls.id;
          promise = window.App.DB.put('classes', data);
        } else {
          promise = window.App.DB.add('classes', data);
        }

        promise.then(function () {
          window.App.UI.closeModal();
          window.App.UI.showToast(isEdit ? 'Classe modifiée' : 'Classe ajoutée', 'success');
          loadClasses();
        }).catch(function () {
          window.App.UI.showToast('Erreur', 'error');
        });
      }
    });
  }

  function deleteClass(id) {
    window.App.UI.confirm(window.App.I18n.t('classes.deleteClass'), window.App.I18n.t('classes.confirmDelete')).then(function (confirmed) {
      if (!confirmed) return;
      window.App.DB.delete('classes', id).then(function () {
        window.App.UI.showToast('Classe supprimée', 'success');
        loadClasses();
      }).catch(function () {
        window.App.UI.showToast('Erreur', 'error');
      });
    });
  }

  function viewClassDetails(classId) {
    var cls = allClasses.find(function (c) { return c.id === classId; });
    if (!cls) return;

    window.App.DB.getByIndex('students', 'classId', classId).then(function (students) {
      var html = '<div class="class-details">' +
        '<div class="mb-3">' +
          '<p><strong>' + window.App.I18n.t('classes.level') + ':</strong> ' + (cls.level || '') + '</p>' +
          '<p><strong>' + window.App.I18n.t('classes.section') + ':</strong> ' + (cls.section || '') + '</p>' +
          '<p><strong>Année:</strong> ' + (cls.year || '') + '</p>' +
        '</div>' +
        '<h6>' + window.App.I18n.t('classes.students') + ' (' + students.length + ')</h6>';

      if (students.length === 0) {
        html += '<p class="text-muted">' + window.App.I18n.t('students.noStudents') + '</p>';
      } else {
        html += '<div class="table-responsive"><table class="table table-sm table-striped"><thead><tr><th>#</th><th>' + window.App.I18n.t('students.lastName') + '</th><th>' + window.App.I18n.t('students.firstName') + '</th><th>' + window.App.I18n.t('students.gender') + '</th></tr></thead><tbody>';
        students.forEach(function (s, i) {
          var genderBadge = s.gender === 'M'
            ? '<span class="badge bg-primary">M</span>'
            : '<span class="badge bg-danger">F</span>';
          html += '<tr><td>' + (i + 1) + '</td><td>' + window.App.Helpers.capitalize(s.lastName || '') + '</td><td>' + window.App.Helpers.capitalize(s.firstName || '') + '</td><td>' + genderBadge + '</td></tr>';
        });
        html += '</tbody></table></div>';
      }
      html += '</div>';

      window.App.UI.showModal(window.App.I18n.t('classes.classDetails') + ' — ' + cls.name, html, {
        confirmText: window.App.I18n.t('common.close'),
        showCancel: false,
        onConfirm: function () { window.App.UI.closeModal(); }
      });
    });
  }

  return { render: render, init: init };
})();
