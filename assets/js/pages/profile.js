window.App = window.App || {};
window.App.Pages = window.App.Pages || {};

window.App.Pages.Profile = (function () {
  var profileData = {};

  function render() {
    return '<div class="page-profile">' +
      '<div class="page-header mb-4">' +
        '<h1 class="page-title" data-i18n="nav.profile">' + window.App.I18n.t('nav.profile') + '</h1>' +
      '</div>' +
      '<div class="row g-4">' +
        '<div class="col-lg-4">' +
          '<div class="card mb-4">' +
            '<div class="card-body text-center py-4">' +
              '<div class="profile-avatar mx-auto mb-3">' +
                '<div class="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto" style="width:96px;height:96px">' +
                  '<span class="text-white fw-bold" style="font-size:32px" id="profile-initials">DS</span>' +
                '</div>' +
              '</div>' +
              '<h4 id="profile-name" class="mb-1">Daas Saïda</h4>' +
              '<p class="text-muted mb-1" id="profile-name-ar">دعاس سعيدة</p>' +
              '<span class="badge bg-primary" id="profile-subject">Français</span>' +
            '</div>' +
          '</div>' +
          '<div class="card mb-4">' +
            '<div class="card-header"><h5 class="card-title mb-0"><i class="bi bi-building me-2"></i>' + window.App.I18n.t('register.school') + '</h5></div>' +
            '<div class="card-body" id="school-info">' +
              '<table class="table table-borderless mb-0">' +
                '<tr><td class="fw-semibold">' + window.App.I18n.t('register.school') + '</td><td id="school-name">École Omar Hamroune</td></tr>' +
                '<tr><td class="fw-semibold">Nom AR</td><td id="school-name-ar">مدرسة عمر حمرون</td></tr>' +
                '<tr><td class="fw-semibold">Localisation</td><td id="school-location">Bouzareah, Algeria</td></tr>' +
                '<tr><td class="fw-semibold">' + window.App.I18n.t('register.schoolYear') + '</td><td id="school-year">2026/2027</td></tr>' +
              '</table>' +
            '</div>' +
          '</div>' +
          '<div class="card mb-4">' +
            '<div class="card-header"><h5 class="card-title mb-0"><i class="bi bi-bar-chart me-2"></i>Statistiques Rapides</h5></div>' +
            '<div class="card-body">' +
              '<div class="d-flex justify-content-around text-center">' +
                '<div><div class="fs-3 fw-bold text-primary" id="profile-classes">0</div><small class="text-muted">' + window.App.I18n.t('dashboard.totalClasses') + '</small></div>' +
                '<div><div class="fs-3 fw-bold text-success" id="profile-students">0</div><small class="text-muted">' + window.App.I18n.t('dashboard.totalStudents') + '</small></div>' +
                '<div><div class="fs-3 fw-bold text-info" id="profile-years">1</div><small class="text-muted">Années</small></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="col-lg-8">' +
          '<div class="card">' +
            '<div class="card-header"><h5 class="card-title mb-0"><i class="bi bi-pencil-square me-2"></i>Modifier le Profil</h5></div>' +
            '<div class="card-body">' +
              '<form id="profile-form">' +
                '<h6 class="text-muted mb-3">Enseignant</h6>' +
                '<div class="row">' +
                  '<div class="col-md-6 mb-3">' +
                    '<label class="form-label">Nom (FR)</label>' +
                    '<input type="text" class="form-control" id="p-teacherName" value="">' +
                  '</div>' +
                  '<div class="col-md-6 mb-3">' +
                    '<label class="form-label">Nom (AR)</label>' +
                    '<input type="text" class="form-control" id="p-teacherNameAr" value="" dir="rtl">' +
                  '</div>' +
                '</div>' +
                '<div class="mb-3">' +
                  '<label class="form-label">' + window.App.I18n.t('register.subject') + '</label>' +
                  '<input type="text" class="form-control" id="p-subject" value="">' +
                '</div>' +
                '<hr>' +
                '<h6 class="text-muted mb-3">' + window.App.I18n.t('register.school') + '</h6>' +
                '<div class="row">' +
                  '<div class="col-md-6 mb-3">' +
                    '<label class="form-label">Nom (FR)</label>' +
                    '<input type="text" class="form-control" id="p-schoolName" value="">' +
                  '</div>' +
                  '<div class="col-md-6 mb-3">' +
                    '<label class="form-label">Nom (AR)</label>' +
                    '<input type="text" class="form-control" id="p-schoolNameAr" value="" dir="rtl">' +
                  '</div>' +
                '</div>' +
                '<div class="row">' +
                  '<div class="col-md-6 mb-3">' +
                    '<label class="form-label">Localisation</label>' +
                    '<input type="text" class="form-control" id="p-location" value="">' +
                  '</div>' +
                  '<div class="col-md-6 mb-3">' +
                    '<label class="form-label">' + window.App.I18n.t('register.schoolYear') + '</label>' +
                    '<input type="text" class="form-control" id="p-schoolYear" value="">' +
                  '</div>' +
                '</div>' +
                '<div class="text-end mt-3">' +
                  '<button type="submit" class="btn btn-primary"><i class="bi bi-check-lg me-1"></i>' + window.App.I18n.t('common.save') + '</button>' +
                '</div>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function init() {
    loadProfile().then(function () {
      loadQuickStats();
      setupForm();
    });
  }

  function loadProfile() {
    var keys = ['teacherName', 'teacherNameAr', 'subject', 'schoolName', 'schoolNameAr', 'location', 'schoolYear'];
    var defaults = {
      teacherName: 'Daas Saïda',
      teacherNameAr: 'دعاس سعيدة',
      subject: 'Français',
      schoolName: 'École Omar Hamroune',
      schoolNameAr: 'مدرسة عمر حمرون',
      location: 'Bouzareah, Algeria',
      schoolYear: '2026/2027'
    };

    var promises = keys.map(function (key) {
      return window.App.DB.get('settings', key).then(function (result) {
        profileData[key] = result ? result.value : defaults[key];
      }).catch(function () {
        profileData[key] = defaults[key];
      });
    });

    return Promise.all(promises).then(function () {
      updateProfileDisplay();
      populateForm();
    });
  }

  function updateProfileDisplay() {
    var name = profileData.teacherName || 'Daas Saïda';
    var nameAr = profileData.teacherNameAr || '';
    var subject = profileData.subject || '';

    var nameParts = name.split(' ');
    var initials = nameParts.length >= 2
      ? (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
      : name.substring(0, 2).toUpperCase();

    var initialsEl = document.getElementById('profile-initials');
    if (initialsEl) initialsEl.textContent = initials;

    var nameEl = document.getElementById('profile-name');
    if (nameEl) nameEl.textContent = name;

    var nameArEl = document.getElementById('profile-name-ar');
    if (nameArEl) nameArEl.textContent = nameAr;

    var subjectEl = document.getElementById('profile-subject');
    if (subjectEl) subjectEl.textContent = subject;

    var schoolName = profileData.schoolName || '';
    var schoolNameAr = profileData.schoolNameAr || '';
    var location = profileData.location || '';
    var schoolYear = profileData.schoolYear || '';

    var sn = document.getElementById('school-name');
    if (sn) sn.textContent = schoolName;
    var sna = document.getElementById('school-name-ar');
    if (sna) sna.textContent = schoolNameAr;
    var sl = document.getElementById('school-location');
    if (sl) sl.textContent = location;
    var sy = document.getElementById('school-year');
    if (sy) sy.textContent = schoolYear;
  }

  function populateForm() {
    var fields = ['teacherName', 'teacherNameAr', 'subject', 'schoolName', 'schoolNameAr', 'location', 'schoolYear'];
    fields.forEach(function (field) {
      var input = document.getElementById('p-' + field);
      if (input) input.value = profileData[field] || '';
    });
  }

  function loadQuickStats() {
    Promise.all([
      window.App.DB.getAll('classes'),
      window.App.DB.getAll('students')
    ]).then(function (results) {
      var classes = results[0] || [];
      var students = results[1] || [];

      var classesEl = document.getElementById('profile-classes');
      if (classesEl) classesEl.textContent = classes.length;

      var studentsEl = document.getElementById('profile-students');
      if (studentsEl) studentsEl.textContent = students.length;
    });
  }

  function setupForm() {
    var form = document.getElementById('profile-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var keys = ['teacherName', 'teacherNameAr', 'subject', 'schoolName', 'schoolNameAr', 'location', 'schoolYear'];
      var promises = keys.map(function (key) {
        var input = document.getElementById('p-' + key);
        var value = input ? input.value.trim() : '';
        profileData[key] = value;
        return window.App.DB.put('settings', { key: key, value: value });
      });

      Promise.all(promises).then(function () {
        window.App.UI.showToast('Profil enregistré', 'success');
        updateProfileDisplay();
      }).catch(function () {
        window.App.UI.showToast('Erreur', 'error');
      });
    });
  }

  return { render: render, init: init };
})();
