window.App = window.App || {};
window.App.Pages = window.App.Pages || {};

window.App.Pages.Statistics = (function () {
  var allClasses = [];
  var selectedClassId = null;
  var charts = {};
  var attendanceData = [];
  var studentsList = [];
  var classMap = {};

  function render() {
    var now = new Date();
    var months = [];
    for (var i = 0; i < 12; i++) {
      months.push({ value: i, name: window.App.Dates.getMonthName(i, window.App.I18n.getLanguage()) });
    }
    var monthOptions = '';
    months.forEach(function (m) {
      monthOptions += '<option value="' + m.value + '"' + (m.value === now.getMonth() ? ' selected' : '') + '>' + m.name + '</option>';
    });
    var yearOptions = '';
    for (var y = 2025; y <= 2028; y++) {
      yearOptions += '<option value="' + y + '"' + (y === now.getFullYear() ? ' selected' : '') + '>' + y + '</option>';
    }

    return '<div class="page-statistics">' +
      '<div class="page-header mb-4">' +
        '<h1 class="page-title" data-i18n="statistics.title">' + window.App.I18n.t('statistics.title') + '</h1>' +
      '</div>' +
      '<div class="row g-3 mb-4">' +
        '<div class="col-md-4"><select id="stats-class" class="form-select"><option value="">' + window.App.I18n.t('attendance.selectClass') + '</option></select></div>' +
        '<div class="col-md-2"><select id="stats-month" class="form-select">' + monthOptions + '</select></div>' +
        '<div class="col-md-2"><select id="stats-year" class="form-select">' + yearOptions + '</select></div>' +
      '</div>' +
      '<div id="stats-summary" class="row g-3 mb-4"></div>' +
      '<div class="row g-4 mb-4">' +
        '<div class="col-lg-6"><div class="card h-100"><div class="card-header"><h5 class="card-title mb-0">' + window.App.I18n.t('statistics.byStatus') + '</h5></div><div class="card-body"><canvas id="statsStatusChart" height="280"></canvas></div></div></div>' +
        '<div class="col-lg-6"><div class="card h-100"><div class="card-header"><h5 class="card-title mb-0">' + window.App.I18n.t('statistics.chartTitle') + '</h5></div><div class="card-body"><canvas id="statsTrendChart" height="280"></canvas></div></div></div>' +
      '</div>' +
      '<div class="row g-4 mb-4">' +
        '<div class="col-lg-6"><div class="card h-100"><div class="card-header"><h5 class="card-title mb-0">' + window.App.I18n.t('register.monthlyView') + '</h5></div><div class="card-body"><canvas id="statsMonthlyChart" height="280"></canvas></div></div></div>' +
        '<div class="col-lg-6"><div class="card h-100"><div class="card-header"><h5 class="card-title mb-0">' + window.App.I18n.t('statistics.byMonth') + '</h5></div><div class="card-body"><canvas id="statsPieChart" height="280"></canvas></div></div></div>' +
      '</div>' +
      '<div class="card mb-4">' +
        '<div class="card-header d-flex justify-content-between align-items-center">' +
          '<h5 class="card-title mb-0">Par Élève</h5>' +
          '<div class="d-flex gap-2">' +
            '<select id="stats-sort" class="form-select form-select-sm" style="width:auto"><option value="pct-desc">% ↓</option><option value="pct-asc">% ↑</option><option value="name">Nom</option></select>' +
            '<select id="stats-filter-status" class="form-select form-select-sm" style="width:auto"><option value="">Tous</option><option value="low">Faible (&lt;50%)</option><option value="mid">Moyen (50-80%)</option><option value="high">Bon (&gt;80%)</option></select>' +
          '</div>' +
        '</div>' +
        '<div class="card-body" id="stats-student-table"></div>' +
      '</div>' +
    '</div>';
  }

  function init() {
    window.App.DB.getAll('classes').then(function (classes) {
      allClasses = classes || [];
      classMap = {};
      allClasses.forEach(function (c) { classMap[c.id] = c; });
      var select = document.getElementById('stats-class');
      if (select) {
        allClasses.forEach(function (c) {
          var opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = c.name + (c.section ? ' — ' + c.section : '');
          select.appendChild(opt);
        });
      }
    });

    document.querySelectorAll('#stats-class, #stats-month, #stats-year').forEach(function (el) {
      el.addEventListener('change', loadData);
    });

    document.querySelectorAll('#stats-sort, #stats-filter-status').forEach(function (el) {
      el.addEventListener('change', renderStudentTable);
    });
  }

  function loadData() {
    var classSelect = document.getElementById('stats-class');
    var monthSelect = document.getElementById('stats-month');
    var yearSelect = document.getElementById('stats-year');

    selectedClassId = classSelect ? (classSelect.value ? parseInt(classSelect.value, 10) : null) : null;
    var month = monthSelect ? parseInt(monthSelect.value, 10) : new Date().getMonth();
    var year = yearSelect ? parseInt(yearSelect.value, 10) : new Date().getFullYear();

    if (!selectedClassId) {
      clearCharts();
      document.getElementById('stats-summary').innerHTML = '';
      document.getElementById('stats-student-table').innerHTML = '';
      return;
    }

    var monthStr = String(month + 1).padStart(2, '0');
    var daysInMonth = window.App.Dates.getDaysInMonth(year, month);
    var startDate = year + '-' + monthStr + '-01';
    var endDate = year + '-' + monthStr + '-' + String(daysInMonth).padStart(2, '0');

    Promise.all([
      window.App.DB.getByIndex('students', 'classId', selectedClassId),
      window.App.DB.getAll('attendance')
    ]).then(function (results) {
      studentsList = results[0] || [];
      var allAtt = results[1] || [];

      attendanceData = allAtt.filter(function (a) {
        return a.classId === selectedClassId && a.date >= startDate && a.date <= endDate;
      });

      renderSummary(daysInMonth);
      renderStatusChart();
      renderTrendChart(year, month, daysInMonth);
      renderMonthlyChart(month, year);
      renderPieChart();
      renderStudentTable();
    });
  }

  function renderSummary(daysInMonth) {
    var el = document.getElementById('stats-summary');
    if (!el) return;

    var totalRecords = attendanceData.length;
    var presentCount = attendanceData.filter(function (a) { return a.status === 'present'; }).length;
    var absentCount = attendanceData.filter(function (a) { return a.status === 'absent'; }).length;
    var lateCount = attendanceData.filter(function (a) { return a.status === 'late'; }).length;
    var excusedCount = attendanceData.filter(function (a) { return a.status === 'excused'; }).length;

    var totalWithStatus = presentCount + absentCount + lateCount + excusedCount;
    var avgRate = totalWithStatus > 0 ? Math.round((presentCount / totalWithStatus) * 100) : 0;

    var dayStats = {};
    attendanceData.forEach(function (a) {
      if (!dayStats[a.date]) dayStats[a.date] = { present: 0, total: 0 };
      if (a.status === 'present' || a.status === 'late') dayStats[a.date].present++;
      dayStats[a.date].total++;
    });

    var bestDay = '';
    var worstDay = '';
    var bestPct = -1;
    var worstPct = 101;

    Object.keys(dayStats).forEach(function (date) {
      var s = dayStats[date];
      if (s.total > 0) {
        var pct = Math.round((s.present / s.total) * 100);
        if (pct > bestPct) { bestPct = pct; bestDay = date; }
        if (pct < worstPct) { worstPct = pct; worstDay = date; }
      }
    });

    el.innerHTML =
      '<div class="col-xl-3 col-md-6">' +
        '<div class="stat-card"><div class="stat-card-body"><div class="stat-card-value">' + daysInMonth + '</div><div class="stat-card-label">Jours</div></div></div>' +
      '</div>' +
      '<div class="col-xl-3 col-md-6">' +
        '<div class="stat-card"><div class="stat-card-body"><div class="stat-card-value">' + avgRate + '%</div><div class="stat-card-label">' + window.App.I18n.t('statistics.attendanceRate') + '</div></div></div>' +
      '</div>' +
      '<div class="col-xl-3 col-md-6">' +
        '<div class="stat-card"><div class="stat-card-body"><div class="stat-card-value">' + (bestDay ? window.App.Dates.formatDate(bestDay) : '—') + '</div><div class="stat-card-label">Meilleur jour (' + (bestPct >= 0 ? bestPct + '%' : '') + ')</div></div></div>' +
      '</div>' +
      '<div class="col-xl-3 col-md-6">' +
        '<div class="stat-card"><div class="stat-card-body"><div class="stat-card-value">' + (worstDay ? window.App.Dates.formatDate(worstDay) : '—') + '</div><div class="stat-card-label">Pire jour (' + (worstPct <= 100 ? worstPct + '%' : '') + ')</div></div></div>' +
      '</div>';
  }

  function renderStatusChart() {
    var canvas = document.getElementById('statsStatusChart');
    if (!canvas) return;

    var counts = { present: 0, absent: 0, late: 0, excused: 0, medical: 0 };
    attendanceData.forEach(function (a) {
      if (counts[a.status] !== undefined) counts[a.status]++;
    });

    if (charts.statusChart) charts.statusChart.destroy();
    charts.statusChart = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: [
          window.App.I18n.t('attendance.present'),
          window.App.I18n.t('attendance.absent'),
          window.App.I18n.t('attendance.late'),
          window.App.I18n.t('attendance.excused'),
          window.App.I18n.t('attendance.medical')
        ],
        datasets: [{
          data: [counts.present, counts.absent, counts.late, counts.excused, counts.medical],
          backgroundColor: ['#2E7D32', '#C62828', '#F57F17', '#1565C0', '#7B1FA2'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  function renderTrendChart(year, month, daysInMonth) {
    var canvas = document.getElementById('statsTrendChart');
    if (!canvas) return;

    var monthStr = String(month + 1).padStart(2, '0');
    var labels = [];
    var presentData = [];
    var absentData = [];

    for (var d = 1; d <= daysInMonth; d++) {
      var dateStr = year + '-' + monthStr + '-' + String(d).padStart(2, '0');
      labels.push(String(d));

      var dayRecords = attendanceData.filter(function (a) { return a.date === dateStr; });
      var p = dayRecords.filter(function (a) { return a.status === 'present' || a.status === 'late'; }).length;
      var ab = dayRecords.filter(function (a) { return a.status === 'absent'; }).length;
      presentData.push(p);
      absentData.push(ab);
    }

    if (charts.trendChart) charts.trendChart.destroy();
    charts.trendChart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: window.App.I18n.t('attendance.present'), data: presentData, borderColor: '#2E7D32', backgroundColor: 'rgba(46,125,50,0.1)', fill: true, tension: 0.3 },
          { label: window.App.I18n.t('attendance.absent'), data: absentData, borderColor: '#C62828', backgroundColor: 'rgba(198,40,40,0.1)', fill: true, tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  function renderMonthlyChart(month, year) {
    var canvas = document.getElementById('statsMonthlyChart');
    if (!canvas) return;

    var counts = { present: 0, absent: 0, late: 0, excused: 0 };
    attendanceData.forEach(function (a) {
      if (counts[a.status] !== undefined) counts[a.status]++;
    });

    if (charts.monthlyChart) charts.monthlyChart.destroy();
    charts.monthlyChart = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: [window.App.Dates.getMonthName(month, window.App.I18n.getLanguage())],
        datasets: [
          { label: window.App.I18n.t('attendance.present'), data: [counts.present], backgroundColor: '#2E7D32' },
          { label: window.App.I18n.t('attendance.absent'), data: [counts.absent], backgroundColor: '#C62828' },
          { label: window.App.I18n.t('attendance.late'), data: [counts.late], backgroundColor: '#F57F17' },
          { label: window.App.I18n.t('attendance.excused'), data: [counts.excused], backgroundColor: '#1565C0' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true, stacked: true }, x: { stacked: true } }
      }
    });
  }

  function renderPieChart() {
    var canvas = document.getElementById('statsPieChart');
    if (!canvas) return;

    var counts = { present: 0, absent: 0, late: 0, excused: 0, medical: 0 };
    attendanceData.forEach(function (a) {
      if (counts[a.status] !== undefined) counts[a.status]++;
    });

    var hasData = Object.values(counts).some(function (v) { return v > 0; });

    if (charts.pieChart) charts.pieChart.destroy();
    charts.pieChart = new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: [
          window.App.I18n.t('attendance.present'),
          window.App.I18n.t('attendance.absent'),
          window.App.I18n.t('attendance.late'),
          window.App.I18n.t('attendance.excused'),
          window.App.I18n.t('attendance.medical')
        ],
        datasets: [{
          data: hasData ? [counts.present, counts.absent, counts.late, counts.excused, counts.medical] : [1],
          backgroundColor: hasData ? ['#2E7D32', '#C62828', '#F57F17', '#1565C0', '#7B1FA2'] : ['#E0E0E0']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  function renderStudentTable() {
    var container = document.getElementById('stats-student-table');
    if (!container) return;

    if (studentsList.length === 0 || attendanceData.length === 0) {
      container.innerHTML = window.App.UI.createEmptyState('bi-bar-chart', window.App.I18n.t('statistics.noData'));
      return;
    }

    var sortSelect = document.getElementById('stats-sort');
    var filterSelect = document.getElementById('stats-filter-status');
    var sortBy = sortSelect ? sortSelect.value : 'pct-desc';
    var filterStatus = filterSelect ? filterSelect.value : '';

    var studentStats = studentsList.map(function (s) {
      var recs = attendanceData.filter(function (a) { return a.studentId === s.id; });
      var present = recs.filter(function (a) { return a.status === 'present' || a.status === 'late'; }).length;
      var absent = recs.filter(function (a) { return a.status === 'absent'; }).length;
      var total = present + absent;
      var pct = total > 0 ? Math.round((present / total) * 100) : 0;

      var trend = '—';
      if (total > 0) {
        if (pct >= 80) trend = '<span class="text-success"><i class="bi bi-arrow-up"></i></span>';
        else if (pct >= 50) trend = '<span class="text-warning"><i class="bi bi-dash"></i></span>';
        else trend = '<span class="text-danger"><i class="bi bi-arrow-down"></i></span>';
      }

      return { student: s, present: present, absent: absent, pct: pct, trend: trend };
    });

    if (filterStatus === 'low') studentStats = studentStats.filter(function (s) { return s.pct < 50; });
    else if (filterStatus === 'mid') studentStats = studentStats.filter(function (s) { return s.pct >= 50 && s.pct <= 80; });
    else if (filterStatus === 'high') studentStats = studentStats.filter(function (s) { return s.pct > 80; });

    if (sortBy === 'pct-desc') studentStats.sort(function (a, b) { return b.pct - a.pct; });
    else if (sortBy === 'pct-asc') studentStats.sort(function (a, b) { return a.pct - b.pct; });
    else studentStats.sort(function (a, b) {
      var na = (a.student.lastName || '') + ' ' + (a.student.firstName || '');
      var nb = (b.student.lastName || '') + ' ' + (b.student.firstName || '');
      return na.localeCompare(nb);
    });

    var html = '<div class="table-responsive"><table class="table table-hover table-sm align-middle">' +
      '<thead class="table-light"><tr>' +
        '<th>#</th><th>' + window.App.I18n.t('students.lastName') + ' / ' + window.App.I18n.t('students.firstName') + '</th>' +
        '<th>Présent</th><th>Absent</th><th>%</th><th>Tendance</th>' +
      '</tr></thead><tbody>';

    studentStats.forEach(function (s, i) {
      var fullName = window.App.Helpers.capitalize(s.student.lastName || '') + ' ' + window.App.Helpers.capitalize(s.student.firstName || '');
      var pctColor = s.pct >= 80 ? 'text-success' : (s.pct >= 50 ? 'text-warning' : 'text-danger');
      html += '<tr><td>' + (i + 1) + '</td><td>' + fullName + '</td><td>' + s.present + '</td><td>' + s.absent + '</td><td class="fw-bold ' + pctColor + '">' + s.pct + '%</td><td>' + s.trend + '</td></tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
  }

  function clearCharts() {
    Object.keys(charts).forEach(function (key) {
      if (charts[key]) charts[key].destroy();
    });
    charts = {};
  }

  return { render: render, init: init };
})();
