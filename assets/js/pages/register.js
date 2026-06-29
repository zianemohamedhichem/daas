window.App = window.App || {};
window.App.Pages = window.App.Pages || {};

window.App.Pages.Register = (function () {
  var allClasses = [];
  var selectedClassId = null;
  var selectedMonth = 0;
  var selectedYear = 2026;
  var attendanceRecords = [];
  var studentsList = [];

  var STATUS_MAP = {
    present: { abbr: 'P', color: '#2E7D32' },
    absent: { abbr: 'A', color: '#C62828' },
    late: { abbr: 'L', color: '#F57F17' },
    excused: { abbr: 'E', color: '#1565C0' },
    medical: { abbr: 'M', color: '#7B1FA2' },
    holiday: { abbr: 'H', color: '#607D8B' }
  };

  function render() {
    var now = new Date();
    var months = [];
    for (var i = 0; i < 12; i++) {
      months.push({ value: i, name: window.App.Dates.getMonthName(i, window.App.I18n.getLanguage()) });
    }

    var monthOptions = '';
    months.forEach(function (m) {
      monthOptions += '<option value="' + m.value + '">' + m.name + '</option>';
    });

    var yearOptions = '';
    for (var y = 2025; y <= 2028; y++) {
      yearOptions += '<option value="' + y + '"' + (y === now.getFullYear() ? ' selected' : '') + '>' + y + '</option>';
    }

    return '<div class="page-register">' +
      '<div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">' +
        '<h1 class="page-title" data-i18n="register.title">' + window.App.I18n.t('register.title') + '</h1>' +
        '<div class="d-flex gap-2 flex-wrap">' +
          '<button id="register-print" class="btn btn-outline-secondary"><i class="bi bi-printer me-1"></i>' + window.App.I18n.t('register.printRegister') + '</button>' +
          '<button id="register-pdf" class="btn btn-outline-danger"><i class="bi bi-file-earmark-pdf me-1"></i>' + window.App.I18n.t('register.exportPDF') + '</button>' +
          '<button id="register-excel" class="btn btn-outline-success"><i class="bi bi-file-earmark-excel me-1"></i>' + window.App.I18n.t('register.exportExcel') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="row g-3 mb-4">' +
        '<div class="col-md-4"><select id="register-class" class="form-select"><option value="">' + window.App.I18n.t('attendance.selectClass') + '</option></select></div>' +
        '<div class="col-md-3"><select id="register-month" class="form-select">' + monthOptions + '</select></div>' +
        '<div class="col-md-2"><select id="register-year" class="form-select">' + yearOptions + '</select></div>' +
      '</div>' +
      '<div id="register-cover" class="d-none mb-4">' +
        '<div class="card">' +
          '<div class="card-body text-center py-4">' +
            '<p class="mb-1 fw-bold">' + window.App.I18n.t('register.republicOfAlgeria') + '</p>' +
            '<p class="mb-3">' + window.App.I18n.t('register.ministryOfEducation') + '</p>' +
            '<h4 class="mb-3">' + window.App.I18n.t('register.officialRegister') + '</h4>' +
            '<div class="row justify-content-center">' +
              '<div class="col-md-8">' +
                '<table class="table table-borderless mx-auto" style="max-width:500px">' +
                  '<tr><td class="text-end fw-bold">' + window.App.I18n.t('register.teacher') + ':</td><td>Daas Saïda / دعاس سعيدة</td></tr>' +
                  '<tr><td class="text-end fw-bold">' + window.App.I18n.t('register.school') + ':</td><td>École Omar Hamroune / مدرسة عمر حمرون</td></tr>' +
                  '<tr><td class="text-end fw-bold">' + window.App.I18n.t('register.subject') + ':</td><td>Français</td></tr>' +
                  '<tr><td class="text-end fw-bold">' + window.App.I18n.t('register.schoolYear') + ':</td><td id="cover-year">2026/2027</td></tr>' +
                '</table>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="register-table-container" class="table-responsive">' +
        '<p class="text-muted text-center py-4">' + window.App.I18n.t('register.monthlyView') + '</p>' +
      '</div>' +
    '</div>';
  }

  function init() {
    var now = new Date();
    selectedMonth = now.getMonth();
    selectedYear = now.getFullYear();

    var monthSelect = document.getElementById('register-month');
    var yearSelect = document.getElementById('register-year');
    if (monthSelect) monthSelect.value = selectedMonth;
    if (yearSelect) yearSelect.value = selectedYear;

    window.App.DB.getAll('classes').then(function (classes) {
      allClasses = classes || [];
      var select = document.getElementById('register-class');
      if (select) {
        allClasses.forEach(function (c) {
          var opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = c.name + (c.section ? ' — ' + c.section : '');
          select.appendChild(opt);
        });
      }
    });

    var classSelect = document.getElementById('register-class');
    if (classSelect) {
      classSelect.addEventListener('change', function () {
        selectedClassId = classSelect.value ? parseInt(classSelect.value, 10) : null;
        loadRegister();
      });
    }
    if (monthSelect) {
      monthSelect.addEventListener('change', function () {
        selectedMonth = parseInt(monthSelect.value, 10);
        loadRegister();
      });
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', function () {
        selectedYear = parseInt(yearSelect.value, 10);
        loadRegister();
      });
    }

    var printBtn = document.getElementById('register-print');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        if (selectedClassId) window.App.ExportService.printRegister(selectedClassId, selectedMonth + 1, selectedYear);
      });
    }

    var pdfBtn = document.getElementById('register-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', function () {
        var tableEl = document.getElementById('register-table-container');
        if (tableEl) {
          var title = window.App.I18n.t('register.officialRegister') + ' — ' + window.App.Dates.getMonthName(selectedMonth, window.App.I18n.getLanguage()) + ' ' + selectedYear;
          window.App.ExportService.exportToPDF(title, tableEl.innerHTML);
        }
      });
    }

    var excelBtn = document.getElementById('register-excel');
    if (excelBtn) {
      excelBtn.addEventListener('click', function () {
        exportToExcel();
      });
    }
  }

  function loadRegister() {
    if (!selectedClassId) return;

    var cover = document.getElementById('register-cover');
    if (cover) cover.classList.remove('d-none');

    var daysInMonth = window.App.Dates.getDaysInMonth(selectedYear, selectedMonth);
    var monthStr = String(selectedMonth + 1).padStart(2, '0');

    Promise.all([
      window.App.DB.getByIndex('students', 'classId', selectedClassId),
      window.App.DB.getAll('attendance'),
      window.App.DB.getAll('holidays')
    ]).then(function (results) {
      studentsList = results[0] || [];
      var allAtt = results[1] || [];
      var holidays = results[2] || [];

      var holidayDates = {};
      holidays.forEach(function (h) { holidayDates[h.date] = true; });

      attendanceRecords = {};
      allAtt.forEach(function (a) {
        if (a.classId === selectedClassId) {
          var recDate = new Date(a.date);
          if (recDate.getMonth() === selectedMonth && recDate.getFullYear() === selectedYear) {
            var dayNum = recDate.getDate();
            if (!attendanceRecords[a.studentId]) attendanceRecords[a.studentId] = {};
            attendanceRecords[a.studentId][dayNum] = a.status;
          }
        }
      });

      for (var d = 1; d <= daysInMonth; d++) {
        var dateStr = selectedYear + '-' + monthStr + '-' + String(d).padStart(2, '0');
        if (holidayDates[dateStr]) {
          studentsList.forEach(function (s) {
            if (!attendanceRecords[s.id]) attendanceRecords[s.id] = {};
            if (!attendanceRecords[s.id][d]) attendanceRecords[s.id][d] = 'holiday';
          });
        }
      }

      renderRegisterTable(daysInMonth);
    });
  }

  function renderRegisterTable(daysInMonth) {
    var container = document.getElementById('register-table-container');
    if (!container) return;

    if (studentsList.length === 0) {
      container.innerHTML = window.App.UI.createEmptyState('bi-journal', window.App.I18n.t('students.noStudents'));
      return;
    }

    var lang = window.App.I18n.getLanguage();
    var html = '<table class="table table-bordered table-sm register-table" id="register-official-table">';

    html += '<thead class="table-dark"><tr><th class="text-nowrap" style="min-width:120px">#</th><th class="text-nowrap" style="min-width:160px">' + window.App.I18n.t('students.lastName') + ' ' + window.App.I18n.t('students.firstName') + '</th>';
    for (var d = 1; d <= daysInMonth; d++) {
      var dateObj = new Date(selectedYear, selectedMonth, d);
      var dayOfWeek = dateObj.getDay();
      var isWE = (dayOfWeek === 5 || dayOfWeek === 6);
      var dayName = window.App.Dates.getDayName(dateObj, lang);
      var shortDay = dayName.substring(0, 2);
      var bgColor = isWE ? '#757575' : 'transparent';
      html += '<th class="text-center text-nowrap" style="min-width:36px;background:' + bgColor + '" title="' + dayName + ' ' + d + '">' + d + '<br><small>' + shortDay + '</small></th>';
    }
    html += '<th class="text-center text-nowrap" style="background:#2E7D32">Total P</th>';
    html += '<th class="text-center text-nowrap" style="background:#C62828">Total A</th>';
    html += '<th class="text-center text-nowrap" style="background:#1565C0">%</th>';
    html += '</tr></thead>';

    html += '<tbody>';
    studentsList.forEach(function (student, idx) {
      var fullName = window.App.Helpers.capitalize(student.lastName || '') + ' ' + window.App.Helpers.capitalize(student.firstName || '');
      html += '<tr><td class="text-nowrap">' + (idx + 1) + '</td><td class="text-nowrap fw-semibold">' + fullName + '</td>';

      var presentCount = 0;
      var absentCount = 0;

      for (var d = 1; d <= daysInMonth; d++) {
        var dateObj = new Date(selectedYear, selectedMonth, d);
        var dayOfWeek = dateObj.getDay();
        var isWE = (dayOfWeek === 5 || dayOfWeek === 6);
        var status = (attendanceRecords[student.id] && attendanceRecords[student.id][d]) || '';
        var mapped = STATUS_MAP[status];
        var abbr = mapped ? mapped.abbr : '';
        var color = mapped ? mapped.color : (isWE ? '#9E9E9E' : '#BDBDBD');
        var cellBg = isWE ? '#F5F5F5' : '#fff';

        if (status === 'present' || status === 'late') presentCount++;
        else if (status === 'absent') absentCount++;

        html += '<td class="text-center" style="color:' + color + ';font-weight:bold;background:' + cellBg + '">' + abbr + '</td>';
      }

      var totalDays = presentCount + absentCount;
      var pct = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

      html += '<td class="text-center fw-bold" style="background:#E8F5E9">' + presentCount + '</td>';
      html += '<td class="text-center fw-bold" style="background:#FFEBEE">' + absentCount + '</td>';
      html += '<td class="text-center fw-bold" style="background:#E3F2FD">' + pct + '%</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';

    container.innerHTML = html;
  }

  function exportToExcel() {
    if (!selectedClassId || studentsList.length === 0) {
      window.App.UI.showToast('Sélectionnez une classe', 'warning');
      return;
    }

    var daysInMonth = window.App.Dates.getDaysInMonth(selectedYear, selectedMonth);
    var data = [];

    var headers = ['#', window.App.I18n.t('students.lastName'), window.App.I18n.t('students.firstName')];
    for (var d = 1; d <= daysInMonth; d++) { headers.push(String(d)); }
    headers.push('Total P', 'Total A', '%');
    data.push(headers);

    studentsList.forEach(function (student, idx) {
      var row = [idx + 1, student.lastName || '', student.firstName || ''];
      var presentCount = 0;
      var absentCount = 0;

      for (var d = 1; d <= daysInMonth; d++) {
        var status = (attendanceRecords[student.id] && attendanceRecords[student.id][d]) || '';
        var mapped = STATUS_MAP[status];
        row.push(mapped ? mapped.abbr : '');
        if (status === 'present' || status === 'late') presentCount++;
        else if (status === 'absent') absentCount++;
      }

      var totalDays = presentCount + absentCount;
      var pct = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;
      row.push(presentCount, absentCount, pct + '%');
      data.push(row);
    });

    var filename = 'registre_' + selectedYear + '_' + String(selectedMonth + 1).padStart(2, '0');
    window.App.ExportService.exportToExcel(data, filename);
  }

  return { render: render, init: init };
})();
