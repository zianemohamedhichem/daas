window.App = window.App || {};
window.App.Pages = window.App.Pages || {};

window.App.Pages.Students = (function () {
  var allStudents = [];
  var allClasses = [];
  var classMap = {};
  var filteredStudents = [];
  var currentPage = 1;
  var perPage = 10;
  var filterClassId = '';
  var searchQuery = '';

  function render() {
    return '<div class="page-students">' +
      '<div class="page-header d-flex justify-content-between align-items-center mb-4">' +
        '<h1 class="page-title" data-i18n="students.title">' + window.App.I18n.t('students.title') + '</h1>' +
        '<button id="add-student-btn" class="btn btn-primary"><i class="bi bi-plus-lg me-1"></i>' + window.App.I18n.t('students.addStudent') + '</button>' +
      '</div>' +
      '<div class="row mb-3">' +
        '<div class="col-md-6 mb-2">' +
          '<div class="input-group">' +
            '<span class="input-group-text"><i class="bi bi-search"></i></span>' +
            '<input type="text" id="student-search" class="form-control" placeholder="' + window.App.I18n.t('students.search') + '">' +
          '</div>' +
        '</div>' +
        '<div class="col-md-3 mb-2">' +
          '<select id="student-class-filter" class="form-select"><option value="">' + window.App.I18n.t('attendance.selectClass') + '</option></select>' +
        '</div>' +
        '<div class="col-md-3 mb-2">' +
          '<div id="student-count" class="form-control-plaintext text-muted pt-2"></div>' +
        '</div>' +
      '</div>' +
      '<div id="students-table-container">' +
        '<div class="text-center py-4"><i class="bi bi-hourglass-split"></i> ' + window.App.I18n.t('common.loading') + '</div>' +
      '</div>' +
      '<div id="students-pagination" class="d-flex justify-content-center mt-3"></div>' +
    '</div>';
  }

  function init() {
    Promise.all([
      window.App.DB.getAll('students'),
      window.App.DB.getAll('classes')
    ]).then(function (results) {
      allStudents = results[0] || [];
      allClasses = results[1] || [];
      classMap = {};
      allClasses.forEach(function (c) { classMap[c.id] = c; });

      populateClassFilter();
      applyFilters();
      setupEventListeners();
    });
  }

  function populateClassFilter() {
    var select = document.getElementById('student-class-filter');
    if (!select) return;
    allClasses.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name + (c.section ? ' — ' + c.section : '');
      select.appendChild(opt);
    });
  }

  function applyFilters() {
    filteredStudents = allStudents.filter(function (s) {
      if (filterClassId && s.classId !== filterClassId) return false;
      if (searchQuery) {
        var fullName = ((s.firstName || '') + ' ' + (s.lastName || '') + ' ' + (s.firstNameAr || '') + ' ' + (s.lastNameAr || '')).toLowerCase();
        if (fullName.indexOf(searchQuery.toLowerCase()) === -1) return false;
      }
      return true;
    });

    var countEl = document.getElementById('student-count');
    if (countEl) {
      countEl.textContent = window.App.I18n.t('students.totalStudents') + ': ' + filteredStudents.length;
    }

    var maxPage = Math.max(1, Math.ceil(filteredStudents.length / perPage));
    if (currentPage > maxPage) currentPage = maxPage;

    renderTable();
    renderPagination();
  }

  function renderTable() {
    var container = document.getElementById('students-table-container');
    if (!container) return;

    if (filteredStudents.length === 0) {
      container.innerHTML = window.App.UI.createEmptyState('bi-people', window.App.I18n.t('students.noStudents'), window.App.I18n.t('students.addStudent'), function () { openStudentModal(null); });
      return;
    }

    var start = (currentPage - 1) * perPage;
    var pageItems = filteredStudents.slice(start, start + perPage);

    var html = '<div class="table-responsive"><table class="table table-hover align-middle">' +
      '<thead class="table-light"><tr>' +
        '<th>#</th>' +
        '<th>' + window.App.I18n.t('students.lastName') + ' / ' + window.App.I18n.t('students.firstName') + '</th>' +
        '<th>' + window.App.I18n.t('students.gender') + '</th>' +
        '<th>' + window.App.I18n.t('students.parentName') + '</th>' +
        '<th>' + window.App.I18n.t('students.parentPhone') + '</th>' +
        '<th>' + window.App.I18n.t('classes.title') + '</th>' +
        '<th>' + window.App.I18n.t('common.actions') + '</th>' +
      '</tr></thead><tbody>';

    pageItems.forEach(function (s, i) {
      var cls = classMap[s.classId] || {};
      var genderBadge = s.gender === 'M'
        ? '<span class="badge bg-primary">M</span>'
        : '<span class="badge bg-danger">F</span>';
      var className = cls.name ? cls.name + (cls.section ? ' — ' + cls.section : '') : '—';

      html += '<tr>' +
        '<td>' + (start + i + 1) + '</td>' +
        '<td><strong>' + window.App.Helpers.capitalize(s.lastName || '') + ' ' + window.App.Helpers.capitalize(s.firstName || '') + '</strong></td>' +
        '<td>' + genderBadge + '</td>' +
        '<td>' + (s.parentName || '') + '</td>' +
        '<td>' + (s.parentPhone || '') + '</td>' +
        '<td>' + className + '</td>' +
        '<td>' +
          '<div class="btn-group btn-group-sm">' +
            '<button class="btn btn-outline-primary student-edit-btn" data-id="' + s.id + '" title="' + window.App.I18n.t('common.edit') + '"><i class="bi bi-pencil"></i></button>' +
            '<button class="btn btn-outline-danger student-delete-btn" data-id="' + s.id + '" title="' + window.App.I18n.t('common.delete') + '"><i class="bi bi-trash"></i></button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;

    container.querySelectorAll('.student-edit-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { openStudentModal(parseInt(btn.getAttribute('data-id'), 10)); });
    });
    container.querySelectorAll('.student-delete-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteStudent(parseInt(btn.getAttribute('data-id'), 10)); });
    });
  }

  function renderPagination() {
    var el = document.getElementById('students-pagination');
    if (!el) return;

    var maxPage = Math.max(1, Math.ceil(filteredStudents.length / perPage));
    if (maxPage <= 1) { el.innerHTML = ''; return; }

    var html = '<nav><ul class="pagination pagination-sm mb-0">';
    html += '<li class="page-item' + (currentPage === 1 ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="' + (currentPage - 1) + '">&laquo;</a></li>';

    for (var i = 1; i <= maxPage; i++) {
      html += '<li class="page-item' + (i === currentPage ? ' active' : '') + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>';
    }

    html += '<li class="page-item' + (currentPage === maxPage ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="' + (currentPage + 1) + '">&raquo;</a></li>';
    html += '</ul></nav>';
    el.innerHTML = html;

    el.querySelectorAll('.page-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var p = parseInt(link.getAttribute('data-page'), 10);
        if (p >= 1 && p <= maxPage) {
          currentPage = p;
          applyFilters();
        }
      });
    });
  }

  function setupEventListeners() {
    var addBtn = document.getElementById('add-student-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function () { openStudentModal(null); });
    }

    var searchInput = document.getElementById('student-search');
    if (searchInput) {
      var debouncedSearch = window.App.UI.debounce(function () {
        searchQuery = searchInput.value.trim();
        currentPage = 1;
        applyFilters();
      }, 300);
      searchInput.addEventListener('input', debouncedSearch);
    }

    var classFilter = document.getElementById('student-class-filter');
    if (classFilter) {
      classFilter.addEventListener('change', function () {
        filterClassId = classFilter.value;
        currentPage = 1;
        applyFilters();
      });
    }
  }

  function openStudentModal(studentId) {
    var student = null;
    if (studentId) {
      student = allStudents.find(function (s) { return s.id === studentId; });
    }
    var isEdit = !!student;
    var title = isEdit ? window.App.I18n.t('students.editStudent') : window.App.I18n.t('students.addStudent');

    var classOptions = '<option value="">—</option>';
    allClasses.forEach(function (c) {
      classOptions += '<option value="' + c.id + '"' + (student && student.classId === c.id ? ' selected' : '') + '>' + c.name + (c.section ? ' — ' + c.section : '') + '</option>';
    });

    var html = '<form id="student-form">' +
      '<div class="row">' +
        '<div class="col-md-6 mb-3">' +
          '<label class="form-label">' + window.App.I18n.t('students.firstName') + ' (FR)</label>' +
          '<input type="text" class="form-control" id="s-firstName" value="' + (student ? student.firstName || '' : '') + '" required>' +
        '</div>' +
        '<div class="col-md-6 mb-3">' +
          '<label class="form-label">' + window.App.I18n.t('students.firstName') + ' (AR)</label>' +
          '<input type="text" class="form-control" id="s-firstNameAr" value="' + (student ? student.firstNameAr || '' : '') + '" dir="rtl">' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="col-md-6 mb-3">' +
          '<label class="form-label">' + window.App.I18n.t('students.lastName') + ' (FR)</label>' +
          '<input type="text" class="form-control" id="s-lastName" value="' + (student ? student.lastName || '' : '') + '" required>' +
        '</div>' +
        '<div class="col-md-6 mb-3">' +
          '<label class="form-label">' + window.App.I18n.t('students.lastName') + ' (AR)</label>' +
          '<input type="text" class="form-control" id="s-lastNameAr" value="' + (student ? student.lastNameAr || '' : '') + '" dir="rtl">' +
        '</div>' +
      '</div>' +
      '<div class="mb-3">' +
        '<label class="form-label">' + window.App.I18n.t('students.gender') + '</label>' +
        '<div class="d-flex gap-3">' +
          '<div class="form-check">' +
            '<input class="form-check-input" type="radio" name="s-gender" id="s-gender-m" value="M"' + (!student || student.gender === 'M' ? ' checked' : '') + '>' +
            '<label class="form-check-label" for="s-gender-m">' + window.App.I18n.t('students.male') + '</label>' +
          '</div>' +
          '<div class="form-check">' +
            '<input class="form-check-input" type="radio" name="s-gender" id="s-gender-f" value="F"' + (student && student.gender === 'F' ? ' checked' : '') + '>' +
            '<label class="form-check-label" for="s-gender-f">' + window.App.I18n.t('students.female') + '</label>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="col-md-6 mb-3">' +
          '<label class="form-label">' + window.App.I18n.t('students.parentName') + '</label>' +
          '<input type="text" class="form-control" id="s-parentName" value="' + (student ? student.parentName || '' : '') + '">' +
        '</div>' +
        '<div class="col-md-6 mb-3">' +
          '<label class="form-label">' + window.App.I18n.t('students.parentPhone') + '</label>' +
          '<input type="tel" class="form-control" id="s-parentPhone" value="' + (student ? student.parentPhone || '' : '') + '">' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="col-md-6 mb-3">' +
          '<label class="form-label">' + window.App.I18n.t('students.dateOfBirth') + '</label>' +
          '<input type="date" class="form-control" id="s-dateOfBirth" value="' + (student ? student.dateOfBirth || '' : '') + '">' +
        '</div>' +
        '<div class="col-md-6 mb-3">' +
          '<label class="form-label">' + window.App.I18n.t('classes.title') + '</label>' +
          '<select class="form-select" id="s-classId">' + classOptions + '</select>' +
        '</div>' +
      '</div>' +
    '</form>';

    window.App.UI.showModal(title, html, {
      confirmText: window.App.I18n.t('common.save'),
      onConfirm: function () {
        var firstName = document.getElementById('s-firstName').value.trim();
        var firstNameAr = document.getElementById('s-firstNameAr').value.trim();
        var lastName = document.getElementById('s-lastName').value.trim();
        var lastNameAr = document.getElementById('s-lastNameAr').value.trim();
        var gender = document.querySelector('input[name="s-gender"]:checked');
        var parentName = document.getElementById('s-parentName').value.trim();
        var parentPhone = document.getElementById('s-parentPhone').value.trim();
        var dateOfBirth = document.getElementById('s-dateOfBirth').value;
        var classId = document.getElementById('s-classId').value;

        if (!firstName || !lastName) {
          window.App.UI.showToast('Le nom et le prénom sont requis', 'warning');
          return;
        }

        var data = {
          firstName: firstName,
          firstNameAr: firstNameAr,
          lastName: lastName,
          lastNameAr: lastNameAr,
          gender: gender ? gender.value : 'M',
          parentName: parentName,
          parentPhone: parentPhone,
          dateOfBirth: dateOfBirth,
          classId: classId ? parseInt(classId, 10) : null
        };

        var promise;
        if (isEdit) {
          data.id = student.id;
          promise = window.App.DB.put('students', data);
        } else {
          promise = window.App.DB.add('students', data);
        }

        promise.then(function () {
          window.App.UI.closeModal();
          window.App.UI.showToast(isEdit ? 'Élève modifié' : 'Élève ajouté', 'success');
          return window.App.DB.getAll('students');
        }).then(function (students) {
          allStudents = students || [];
          applyFilters();
        }).catch(function () {
          window.App.UI.showToast('Erreur', 'error');
        });
      }
    });
  }

  function deleteStudent(id) {
    window.App.UI.confirm(window.App.I18n.t('students.deleteStudent'), window.App.I18n.t('students.confirmDelete')).then(function (confirmed) {
      if (!confirmed) return;
      window.App.DB.delete('students', id).then(function () {
        window.App.UI.showToast('Élève supprimé', 'success');
        return window.App.DB.getAll('students');
      }).then(function (students) {
        allStudents = students || [];
        applyFilters();
      }).catch(function () {
        window.App.UI.showToast('Erreur', 'error');
      });
    });
  }

  return { render: render, init: init };
})();
