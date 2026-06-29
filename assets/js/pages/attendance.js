window.App = window.App || {};
window.App.Pages = window.App.Pages || {};

window.App.Pages.Attendance = (function () {
  var currentClassId = null;
  var currentDate = '';
  var attendanceData = {};
  var studentsList = [];
  var allClasses = [];
  var autoSaveTimer = null;
  var hasUnsavedChanges = false;

  var STATUS_COLORS = {
    present: '#2E7D32',
    absent: '#C62828',
    late: '#F57F17',
    excused: '#1565C0',
    medical: '#7B1FA2'
  };

  var STATUS_LABELS = {
    present: function () { return window.App.I18n.t('attendance.present'); },
    absent: function () { return window.App.I18n.t('attendance.absent'); },
    late: function () { return window.App.I18n.t('attendance.late'); },
    excused: function () { return window.App.I18n.t('attendance.excused'); },
    medical: function () { return window.App.I18n.t('attendance.medical'); }
  };

  var STATUSES = ['present', 'absent', 'late', 'excused', 'medical'];

  function render() {
    return '<div class="page-attendance">' +
      '<div class="page-header mb-4">' +
        '<h1 class="page-title" data-i18n="attendance.title">' + window.App.I18n.t('attendance.title') + '</h1>' +
      '</div>' +
      '<div class="attendance-toolbar row g-3 mb-4 align-items-end">' +
        '<div class="col-md-4">' +
          '<label class="form-label fw-semibold">' + window.App.I18n.t('attendance.selectClass') + '</label>' +
          '<select id="attendance-class" class="form-select"><option value="">' + window.App.I18n.t('attendance.selectClass') + '</option></select>' +
        '</div>' +
        '<div class="col-md-3">' +
          '<label class="form-label fw-semibold">' + window.App.I18n.t('attendance.todayDate') + '</label>' +
          '<input type="date" id="attendance-date" class="form-control">' +
        '</div>' +
        '<div class="col-md-3">' +
          '<label class="form-label fw-semibold"><i class="bi bi-search me-1"></i>' + window.App.I18n.t('common.search') + '</label>' +
          '<input type="text" id="attendance-search" class="form-control" placeholder="' + window.App.I18n.t('students.search') + '">' +
        '</div>' +
        '<div class="col-md-2">' +
          '<button id="attendance-save" class="btn btn-primary btn-lg w-100"><i class="bi bi-check-lg me-1"></i>' + window.App.I18n.t('attendance.save') + '</button>' +
        '</div>' +
      '</div>' +
      '<div id="autosave-indicator" class="text-muted mb-2" style="min-height:20px"></div>' +
      '<div id="weekend-message" class="alert alert-warning d-none"><i class="bi bi-calendar-x me-2"></i>' + window.App.I18n.t('attendance.holiday') + ' — ' + window.App.I18n.t('common.noData') + '</div>' +
      '<div id="holiday-message" class="alert alert-info d-none"><i class="bi bi-calendar-event me-2"></i>' + window.App.I18n.t('attendance.holiday') + '</div>' +
      '<div id="student-list"></div>' +
      '<div id="attendance-summary" class="attendance-summary mt-3 p-3 rounded-3 bg-light"></div>' +
    '</div>';
  }

  function init() {
    currentDate = window.App.Dates.today();
    var dateInput = document.getElementById('attendance-date');
    if (dateInput) dateInput.value = currentDate;

    window.App.DB.getAll('classes').then(function (classes) {
      allClasses = classes || [];
      populateClassSelector();
    });

    var classSelect = document.getElementById('attendance-class');
    if (classSelect) {
      classSelect.addEventListener('change', function () {
        currentClassId = classSelect.value ? parseInt(classSelect.value, 10) : null;
        if (currentClassId) loadAttendanceForDate();
      });
    }

    if (dateInput) {
      dateInput.addEventListener('change', function () {
        currentDate = dateInput.value;
        if (currentClassId) loadAttendanceForDate();
      });
    }

    var searchInput = document.getElementById('attendance-search');
    if (searchInput) {
      var debouncedFilter = window.App.UI.debounce(function () {
        renderStudentList();
      }, 300);
      searchInput.addEventListener('input', debouncedFilter);
    }

    var saveBtn = document.getElementById('attendance-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () { saveAttendance(); });
    }
  }

  function populateClassSelector() {
    var select = document.getElementById('attendance-class');
    if (!select) return;
    allClasses.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name + (c.section ? ' — ' + c.section : '');
      select.appendChild(opt);
    });
  }

  function loadAttendanceForDate() {
    if (!currentClassId || !currentDate) return;

    window.App.Loading.show();

    var isWeekendDay = window.App.Dates.isWeekend(currentDate);
    var weekendMsg = document.getElementById('weekend-message');
    var holidayMsg = document.getElementById('holiday-message');

    if (weekendMsg) weekendMsg.classList.toggle('d-none', !isWeekendDay);

    Promise.all([
      window.App.DB.getByIndex('students', 'classId', currentClassId),
      window.App.DB.getAll('attendance'),
      window.App.DB.getAll('holidays')
    ]).then(function (results) {
      studentsList = results[0] || [];
      var allAttendance = results[1] || [];
      var holidays = results[2] || [];

      attendanceData = {};
      allAttendance.forEach(function (a) {
        if (a.classId === currentClassId && a.date === currentDate) {
          attendanceData[a.studentId] = { status: a.status, note: a.note || '', id: a.id };
        }
      });

      var isHoliday = holidays.some(function (h) { return h.date === currentDate; });

      if (holidayMsg) {
        if (isHoliday && !isWeekendDay) {
          holidayMsg.classList.remove('d-none');
          studentsList.forEach(function (s) {
            if (!attendanceData[s.id]) {
              attendanceData[s.id] = { status: 'holiday', note: '' };
            }
          });
        } else {
          holidayMsg.classList.add('d-none');
        }
      }

      if (isWeekendDay && weekendMsg) {
        studentsList.forEach(function (s) {
          if (!attendanceData[s.id]) {
            attendanceData[s.id] = { status: 'absent', note: 'Week-end' };
          }
        });
      }

      var searchVal = document.getElementById('attendance-search');
      if (searchVal) searchVal.value = '';

      renderStudentList();
      updateSummary();
      window.App.Loading.hide();
    }).catch(function () {
      window.App.Loading.hide();
      var listEl = document.getElementById('student-list');
      if (listEl) listEl.innerHTML = '<div class="alert alert-danger">Erreur de chargement</div>';
    });
  }

  function renderStudentList() {
    var container = document.getElementById('student-list');
    if (!container) return;

    var isWeekendDay = window.App.Dates.isWeekend(currentDate);
    var searchVal = (document.getElementById('attendance-search') ? document.getElementById('attendance-search').value : '').trim().toLowerCase();

    var filtered = studentsList.filter(function (s) {
      if (!searchVal) return true;
      var fullName = ((s.firstName || '') + ' ' + (s.lastName || '') + ' ' + (s.firstNameAr || '') + ' ' + (s.lastNameAr || '')).toLowerCase();
      return fullName.indexOf(searchVal) !== -1;
    });

    if (filtered.length === 0) {
      container.innerHTML = window.App.UI.createEmptyState('bi-people', window.App.I18n.t('students.noStudents'));
      return;
    }

    var html = '<div class="student-attendance-list">';
    filtered.forEach(function (student) {
      var current = attendanceData[student.id] || { status: '', note: '' };
      var fullName = window.App.Helpers.capitalize(student.firstName || '') + ' ' + window.App.Helpers.capitalize(student.lastName || '');

      html += '<div class="student-attendance-row card mb-2" data-student-id="' + student.id + '">' +
        '<div class="card-body py-2">' +
          '<div class="d-flex align-items-center">' +
            '<div class="student-info flex-grow-1">' +
              '<div class="d-flex align-items-center">' +
                '<div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-2" style="width:32px;height:32px;min-width:32px">' +
                  '<span class="text-primary fw-bold" style="font-size:11px">' + window.App.Helpers.getInitials(student.firstName || '', student.lastName || '') + '</span>' +
                '</div>' +
                '<div>' +
                  '<div class="fw-semibold">' + fullName + '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="status-buttons d-flex gap-1 flex-wrap justify-content-end">';

      STATUSES.forEach(function (status) {
        var isActive = current.status === status;
        var color = STATUS_COLORS[status];
        var label = STATUS_LABELS[status]();
        html += '<button class="btn btn-sm status-btn' + (isActive ? ' active' : '') + '" ' +
          'data-student-id="' + student.id + '" data-status="' + status + '" ' +
          'style="' + (isActive ? 'background:' + color + ';color:#fff;border-color:' + color : 'color:' + color + ';border-color:' + color + ';background:transparent') + ';white-space:nowrap" ' +
          (isWeekendDay ? 'disabled' : '') + '>' +
          label +
        '</button>';
      });

      html += '<button class="btn btn-sm btn-outline-secondary note-toggle-btn" data-student-id="' + student.id + '" title="Note"><i class="bi bi-chat-left-text"></i></button>' +
            '</div>' +
          '</div>' +
          '<div class="note-row mt-2 d-none" id="note-row-' + student.id + '">' +
            '<input type="text" class="form-control form-control-sm note-input" data-student-id="' + student.id + '" placeholder="Note..." value="' + (current.note || '').replace(/"/g, '&quot;') + '" ' + (isWeekendDay ? 'disabled' : '') + '>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.status-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var studentId = parseInt(btn.getAttribute('data-student-id'), 10);
        var status = btn.getAttribute('data-status');
        setStudentStatus(studentId, status);
      });
    });

    container.querySelectorAll('.note-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var studentId = btn.getAttribute('data-student-id');
        var noteRow = document.getElementById('note-row-' + studentId);
        if (noteRow) noteRow.classList.toggle('d-none');
      });
    });

    container.querySelectorAll('.note-input').forEach(function (input) {
      input.addEventListener('input', function () {
        var studentId = parseInt(input.getAttribute('data-student-id'), 10);
        if (attendanceData[studentId]) {
          attendanceData[studentId].note = input.value;
          hasUnsavedChanges = true;
          scheduleAutoSave();
        }
      });
    });
  }

  function setStudentStatus(studentId, status) {
    if (!attendanceData[studentId]) {
      attendanceData[studentId] = { status: '', note: '' };
    }

    attendanceData[studentId].status = status;
    hasUnsavedChanges = true;

    var row = document.querySelector('.student-attendance-row[data-student-id="' + studentId + '"]');
    if (row) {
      row.querySelectorAll('.status-btn').forEach(function (btn) {
        var btnStatus = btn.getAttribute('data-status');
        var color = STATUS_COLORS[btnStatus];
        if (btnStatus === status) {
          btn.classList.add('active');
          btn.style.background = color;
          btn.style.color = '#fff';
          btn.style.borderColor = color;
          btn.classList.add('status-changed');
          setTimeout(function () { btn.classList.remove('status-changed'); }, 600);
        } else {
          btn.classList.remove('active');
          btn.style.background = 'transparent';
          btn.style.color = color;
          btn.style.borderColor = color;
        }
      });
    }

    updateSummary();
    scheduleAutoSave();
  }

  function updateSummary() {
    var el = document.getElementById('attendance-summary');
    if (!el) return;

    var counts = { present: 0, absent: 0, late: 0, excused: 0, medical: 0 };
    Object.keys(attendanceData).forEach(function (id) {
      var st = attendanceData[id].status;
      if (counts[st] !== undefined) counts[st]++;
    });

    el.innerHTML = '<div class="d-flex flex-wrap gap-3 justify-content-center">' +
      '<span class="badge" style="background:#2E7D32;font-size:14px;padding:8px 14px"><i class="bi bi-check-circle me-1"></i>' + counts.present + ' ' + window.App.I18n.t('attendance.presentCount') + '</span>' +
      '<span class="badge" style="background:#C62828;font-size:14px;padding:8px 14px"><i class="bi bi-x-circle me-1"></i>' + counts.absent + ' ' + window.App.I18n.t('attendance.absentCount') + '</span>' +
      '<span class="badge" style="background:#F57F17;font-size:14px;padding:8px 14px"><i class="bi bi-clock me-1"></i>' + counts.late + ' ' + window.App.I18n.t('attendance.lateCount') + '</span>' +
      '<span class="badge" style="background:#1565C0;font-size:14px;padding:8px 14px"><i class="bi bi-shield-check me-1"></i>' + counts.excused + ' ' + window.App.I18n.t('attendance.excused') + '</span>' +
      '<span class="badge" style="background:#7B1FA2;font-size:14px;padding:8px 14px"><i class="bi bi-heart-pulse me-1"></i>' + counts.medical + ' ' + window.App.I18n.t('attendance.medical') + '</span>' +
    '</div>';
  }

  function scheduleAutoSave() {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(function () {
      if (hasUnsavedChanges) {
        saveAttendance(true);
      }
    }, 2000);
  }

  function saveAttendance(isAutoSave) {
    if (!currentClassId || !currentDate) return;

    var indicator = document.getElementById('autosave-indicator');
    if (indicator) indicator.textContent = window.App.I18n.t('common.loading') + '...';

    var promises = [];
    Object.keys(attendanceData).forEach(function (studentId) {
      var data = attendanceData[studentId];
      if (!data.status) return;

      var record = {
        classId: currentClassId,
        studentId: parseInt(studentId, 10),
        date: currentDate,
        status: data.status,
        note: data.note || ''
      };

      if (data.id) {
        record.id = data.id;
        promises.push(window.App.DB.put('attendance', record));
      } else {
        promises.push(window.App.DB.add('attendance', record).then(function (newId) {
          attendanceData[studentId].id = newId;
        }));
      }
    });

    Promise.all(promises).then(function () {
      hasUnsavedChanges = false;
      if (isAutoSave) {
        if (indicator) {
          indicator.innerHTML = '<i class="bi bi-check-circle text-success me-1"></i>' + window.App.I18n.t('attendance.saved');
          setTimeout(function () { indicator.textContent = ''; }, 3000);
        }
      } else {
        window.App.UI.showToast(window.App.I18n.t('attendance.saved'), 'success');
        if (indicator) indicator.textContent = '';
      }
    }).catch(function () {
      window.App.UI.showToast('Erreur de sauvegarde', 'error');
      if (indicator) indicator.textContent = '';
    });
  }

  return { render: render, init: init };
})();
