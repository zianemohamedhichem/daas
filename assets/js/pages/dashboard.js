window.App = window.App || {};
window.App.Pages = window.App.Pages || {};

window.App.Pages.Dashboard = (function () {
  var charts = {};

  function render() {
    var now = window.App.Dates.today();
    var dateObj = new Date();
    var dateStr = window.App.Dates.formatDate(now);
    var lang = window.App.I18n.getLanguage();
    var dayName = window.App.Dates.getDayName(now, lang);

    return '<div class="page-dashboard" style="display:flex;flex-direction:column;gap:var(--space-6)">' +

      /* ── 1. Hero Section ──────────────────────────────── */
      '<div class="dashboard-hero" style="background:linear-gradient(135deg,#059669 0%,#10B981 40%,#2563EB 100%);border-radius:var(--radius-2xl);padding:var(--space-8) var(--space-10);display:flex;align-items:center;justify-content:space-between;gap:var(--space-8);position:relative;overflow:hidden;min-height:220px">' +
        '<div style="position:absolute;top:-60px;right:-40px;width:280px;height:280px;background:rgba(255,255,255,0.07);border-radius:50%"></div>' +
        '<div style="position:absolute;bottom:-80px;left:10%;width:200px;height:200px;background:rgba(255,255,255,0.05);border-radius:50%"></div>' +
        '<div style="position:relative;z-index:1;flex:1">' +
          '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-4)">' +
            '<span data-lucide="sun" style="width:20px;height:20px;color:var(--accent-light)"></span>' +
            '<span style="font-size:var(--text-sm);color:rgba(255,255,255,0.85);font-weight:var(--font-medium)">' + dayName + ' — ' + dateStr + '</span>' +
          '</div>' +
          '<div id="dashboard-welcome"></div>' +
          '<div style="display:flex;gap:var(--space-3);margin-top:var(--space-4);flex-wrap:wrap">' +
            '<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);padding:6px 14px;border-radius:var(--radius-full);font-size:var(--text-xs);color:#fff;font-weight:var(--font-medium)">' +
              '<i data-lucide="school" style="width:14px;height:14px"></i>École Omar Hamroune' +
            '</span>' +
            '<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);padding:6px 14px;border-radius:var(--radius-full);font-size:var(--text-xs);color:#fff;font-weight:var(--font-medium)">' +
              '<i data-lucide="book-open" style="width:14px;height:14px"></i>Français' +
            '</span>' +
            '<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);padding:6px 14px;border-radius:var(--radius-full);font-size:var(--text-xs);color:#fff;font-weight:var(--font-medium)">' +
              '<i data-lucide="calendar" style="width:14px;height:14px"></i>2026 / 2027' +
            '</span>' +
          '</div>' +
        '</div>' +
        '<div style="position:relative;z-index:1;flex-shrink:0">' +
          '<img src="assets/images/teacher-illustration.svg" alt="Teacher" style="width:200px;height:200px;object-fit:contain;filter:drop-shadow(0 8px 24px rgba(0,0,0,0.15))" onerror="this.style.display=\'none\'">' +
        '</div>' +
      '</div>' +

      /* ── 2. Teacher Card ──────────────────────────────── */
      '<div style="background:var(--glass-bg);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid var(--glass-border);border-radius:var(--radius-xl);padding:var(--space-6);box-shadow:var(--shadow-sm);display:flex;align-items:center;gap:var(--space-6)">' +
        '<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#10B981,#059669);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 14px rgba(16,185,129,0.35)">' +
          '<span style="font-size:var(--text-2xl);font-weight:var(--font-bold);color:#fff;letter-spacing:1px">DS</span>' +
        '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<h3 style="margin:0 0 2px;font-size:var(--text-lg);font-weight:var(--font-bold);color:var(--text)">Daas Saïda <span style="font-size:var(--text-sm);font-weight:var(--font-normal);color:var(--text-secondary);margin-left:4px" dir="rtl">داس سعيدة</span></h3>' +
          '<div style="display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap;margin-top:var(--space-2)">' +
            '<span style="display:inline-flex;align-items:center;gap:4px;font-size:var(--text-sm);color:var(--text-secondary)"><i data-lucide="book-open" style="width:14px;height:14px;color:var(--primary)"></i>Français</span>' +
            '<span style="display:inline-flex;align-items:center;gap:4px;font-size:var(--text-sm);color:var(--text-secondary)"><i data-lucide="school" style="width:14px;height:14px;color:var(--info)"></i>École Omar Hamroune</span>' +
            '<span style="display:inline-flex;align-items:center;gap:4px;font-size:var(--text-sm);color:var(--text-secondary)"><i data-lucide="map-pin" style="width:14px;height:14px;color:var(--accent)"></i>Saida, Algérie</span>' +
            '<span style="display:inline-flex;align-items:center;gap:4px;font-size:var(--text-sm);color:var(--text-secondary)"><i data-lucide="calendar-days" style="width:14px;height:14px;color:var(--danger)"></i>2026 / 2027</span>' +
          '</div>' +
        '</div>' +
        '<div style="flex-shrink:0;display:flex;align-items:center;gap:var(--space-2);background:var(--success-surface);padding:8px 16px;border-radius:var(--radius-full)">' +
          '<i data-lucide="check-circle" style="width:16px;height:16px;color:var(--success)"></i>' +
          '<span style="font-size:var(--text-xs);font-weight:var(--font-semibold);color:var(--success)">' + window.App.I18n.t('dashboard.title') + '</span>' +
        '</div>' +
      '</div>' +

      /* ── 3. Stats Grid ────────────────────────────────── */
      '<div id="dashboard-stats" role="status" aria-live="polite" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-5)"></div>' +

      /* ── 4. Charts Row ────────────────────────────────── */
      '<div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-6)">' +
        '<div class="chart-container">' +
          '<div class="chart-header">' +
            '<span class="chart-title" data-lucide="bar-chart-3" style="display:inline-flex;align-items:center;gap:var(--space-2)"><span data-lucide="bar-chart-3" style="width:18px;height:18px;color:var(--primary)"></span>' + window.App.I18n.t('dashboard.monthlyChart') + '</span>' +
          '</div>' +
          '<div class="chart-body" style="min-height:280px"><canvas id="attendanceChart"></canvas></div>' +
        '</div>' +
        '<div class="chart-container">' +
          '<div class="chart-header">' +
            '<span class="chart-title" style="display:inline-flex;align-items:center;gap:var(--space-2)"><span data-lucide="pie-chart" style="width:18px;height:18px;color:var(--info)"></span>' + window.App.I18n.t('dashboard.attendanceOverview') + '</span>' +
          '</div>' +
          '<div class="chart-body" style="min-height:280px"><canvas id="distributionChart"></canvas></div>' +
        '</div>' +
      '</div>' +

      /* ── 5. Bottom Row ────────────────────────────────── */
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-6)">' +

        /* Calendar Mini-View */
        '<div class="chart-container">' +
          '<div class="chart-header">' +
            '<span class="chart-title" style="display:inline-flex;align-items:center;gap:var(--space-2)"><span data-lucide="calendar-days" style="width:18px;height:18px;color:var(--info)"></span>' + window.App.Dates.getMonthName(dateObj.getMonth(), lang) + ' ' + dateObj.getFullYear() + '</span>' +
          '</div>' +
          '<div id="dashboard-calendar" style="min-height:200px"></div>' +
        '</div>' +

        /* Quick Actions */
        '<div class="chart-container">' +
          '<div class="chart-header">' +
            '<span class="chart-title" style="display:inline-flex;align-items:center;gap:var(--space-2)"><span data-lucide="zap" style="width:18px;height:18px;color:var(--accent)"></span>' + window.App.I18n.t('dashboard.quickActions') + '</span>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">' +
            '<a href="#/attendance" style="display:flex;flex-direction:column;align-items:center;gap:var(--space-3);padding:var(--space-5);border-radius:var(--radius-lg);background:var(--primary-surface);border:1px solid transparent;text-decoration:none;transition:all var(--transition-base);cursor:pointer" onmouseover="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'var(--shadow-md)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
              '<div style="width:48px;height:48px;border-radius:var(--radius-md);background:linear-gradient(135deg,#10B981,#059669);display:flex;align-items:center;justify-content:center">' +
                '<i data-lucide="clipboard-check" style="width:22px;height:22px;color:#fff"></i>' +
              '</div>' +
              '<span style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text)">' + window.App.I18n.t('attendance.title') + '</span>' +
            '</a>' +
            '<button id="quick-add-student" style="display:flex;flex-direction:column;align-items:center;gap:var(--space-3);padding:var(--space-5);border-radius:var(--radius-lg);background:var(--secondary-surface);border:1px solid transparent;cursor:pointer;transition:all var(--transition-base)" onmouseover="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'var(--shadow-md)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
              '<div style="width:48px;height:48px;border-radius:var(--radius-md);background:linear-gradient(135deg,#2563EB,#1D4ED8);display:flex;align-items:center;justify-content:center">' +
                '<i data-lucide="user-plus" style="width:22px;height:22px;color:#fff"></i>' +
              '</div>' +
              '<span style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text)">' + window.App.I18n.t('students.addStudent') + '</span>' +
            '</button>' +
            '<a href="#/register" style="display:flex;flex-direction:column;align-items:center;gap:var(--space-3);padding:var(--space-5);border-radius:var(--radius-lg);background:var(--accent-surface);border:1px solid transparent;text-decoration:none;transition:all var(--transition-base);cursor:pointer" onmouseover="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'var(--shadow-md)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
              '<div style="width:48px;height:48px;border-radius:var(--radius-md);background:linear-gradient(135deg,#F59E0B,#D97706);display:flex;align-items:center;justify-content:center">' +
                '<i data-lucide="book-text" style="width:22px;height:22px;color:#fff"></i>' +
              '</div>' +
              '<span style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text)">' + window.App.I18n.t('register.title') + '</span>' +
            '</a>' +
            '<button id="quick-print" style="display:flex;flex-direction:column;align-items:center;gap:var(--space-3);padding:var(--space-5);border-radius:var(--radius-lg);background:var(--info-surface);border:1px solid transparent;cursor:pointer;transition:all var(--transition-base)" onmouseover="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'var(--shadow-md)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
              '<div style="width:48px;height:48px;border-radius:var(--radius-md);background:linear-gradient(135deg,#6366F1,#4F46E5);display:flex;align-items:center;justify-content:center">' +
                '<i data-lucide="printer" style="width:22px;height:22px;color:#fff"></i>' +
              '</div>' +
              '<span style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text)">' + window.App.I18n.t('common.print') + '</span>' +
            '</button>' +
          '</div>' +
        '</div>' +

        /* Recent Activity */
        '<div class="chart-container">' +
          '<div class="chart-header">' +
            '<span class="chart-title" style="display:inline-flex;align-items:center;gap:var(--space-2)"><span data-lucide="activity" style="width:18px;height:18px;color:var(--danger)"></span>' + window.App.I18n.t('dashboard.recentActivity') + '</span>' +
          '</div>' +
          '<div id="recent-activity" style="max-height:340px;overflow-y:auto">' +
            '<div style="text-align:center;color:var(--text-tertiary);padding:var(--space-8) 0"><i data-lucide="loader" style="width:20px;height:20px;animation:spin 1s linear infinite"></i></div>' +
          '</div>' +
        '</div>' +

      '</div>' +
    '</div>';
  }

  function init() {
    setTimeout(function() { if (window.lucide) lucide.createIcons(); }, 0);
    loadWelcome();
    loadStats();
    loadRecentActivity();
    initCharts();
    setupQuickActions();
    loadCalendarMini();
  }

  function loadWelcome() {
    var el = document.getElementById('dashboard-welcome');
    if (!el) return;
    el.innerHTML = '<h2 style="margin:0 0 var(--space-2);font-size:var(--text-2xl);font-weight:var(--font-bold);color:#fff">' + window.App.I18n.t('dashboard.welcomeBack') + ', <strong>Daas Saïda</strong></h2>' +
      '<p style="margin:0;font-size:var(--text-sm);color:rgba(255,255,255,0.85);max-width:420px;line-height:1.6">Gérez vos présences et suivez la progression de vos classes en toute simplicité.</p>';
  }

  function loadStats() {
    var el = document.getElementById('dashboard-stats');
    if (!el) return;
    window.App.Loading.show();

    Promise.all([
      window.App.DB.getAll('students'),
      window.App.DB.getAll('classes'),
      getTodayAttendance()
    ]).then(function (results) {
      var students = results[0] || [];
      var classes = results[1] || [];
      var todayData = results[2];

      var presentCount = todayData.filter(function (a) { return a.status === 'present'; }).length;
      var absentCount = todayData.filter(function (a) { return a.status === 'absent'; }).length;

      var stats = [
        { value: students.length, label: window.App.I18n.t('dashboard.totalStudents'), icon: 'users', color: '#2563EB', bg: 'linear-gradient(135deg,#2563EB,#1D4ED8)' },
        { value: classes.length, label: window.App.I18n.t('dashboard.totalClasses'), icon: 'book-open', color: '#10B981', bg: 'linear-gradient(135deg,#10B981,#059669)' },
        { value: presentCount, label: window.App.I18n.t('attendance.presentCount'), icon: 'user-check', color: '#059669', bg: 'linear-gradient(135deg,#059669,#047857)' },
        { value: absentCount, label: window.App.I18n.t('attendance.absentCount'), icon: 'user-x', color: '#EF4444', bg: 'linear-gradient(135deg,#EF4444,#DC2626)' }
      ];

      var html = '';
      stats.forEach(function (s) {
        html += '<div style="background:var(--glass-bg);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid var(--glass-border);border-radius:var(--radius-xl);padding:var(--space-5);box-shadow:var(--shadow-sm);transition:all var(--transition-base);cursor:default" onmouseover="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'var(--shadow-lg)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'var(--shadow-sm)\'">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">' +
            '<div style="width:48px;height:48px;border-radius:var(--radius-md);background:' + s.bg + ';display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px ' + s.color + '33">' +
              '<i data-lucide="' + s.icon + '" style="width:22px;height:22px;color:#fff"></i>' +
            '</div>' +
          '</div>' +
          '<div style="font-size:var(--text-3xl);font-weight:var(--font-bold);color:var(--text);line-height:1;margin-bottom:var(--space-1)" data-count="' + s.value + '">' + s.value + '</div>' +
          '<div style="font-size:var(--text-xs);color:var(--text-secondary);font-weight:var(--font-medium)">' + s.label + '</div>' +
        '</div>';
      });

      el.innerHTML = html;
      if (window.lucide) lucide.createIcons();
      animateCounters();
      window.App.Loading.hide();
    }).catch(function () {
      window.App.Loading.hide();
      el.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--danger);padding:var(--space-8)">Erreur de chargement</div>';
    });
  }

  function getTodayAttendance() {
    var today = window.App.Dates.today();
    return window.App.DB.getAll('attendance').then(function (all) {
      return all.filter(function (a) { return a.date === today; });
    });
  }

  function loadRecentActivity() {
    var el = document.getElementById('recent-activity');
    if (!el) return;

    Promise.all([
      window.App.DB.getAll('attendance'),
      window.App.DB.getAll('students'),
      window.App.DB.getAll('classes')
    ]).then(function (results) {
      var attendance = results[0] || [];
      var students = results[1] || [];
      var classes = results[2] || [];

      var studentMap = {};
      students.forEach(function (s) { studentMap[s.id] = s; });
      var classMap = {};
      classes.forEach(function (c) { classMap[c.id] = c; });

      var sorted = attendance.sort(function (a, b) { return b.date > a.date ? 1 : -1; });
      var recent = sorted.slice(0, 5);

      if (recent.length === 0) {
        el.innerHTML = window.App.UI.createEmptyState('inbox', window.App.I18n.t('common.noData'));
        return;
      }

      var statusColors = { present: '#10B981', absent: '#EF4444', late: '#F59E0B', excused: '#2563EB', medical: '#8B5CF6', holiday: '#64748B' };
      var statusIcons = { present: 'check-circle', absent: 'x-circle', late: 'clock', excused: 'shield', medical: 'heart-pulse', holiday: 'palm-tree' };
      var statusLabels = {
        present: window.App.I18n.t('attendance.present'),
        absent: window.App.I18n.t('attendance.absent'),
        late: window.App.I18n.t('attendance.late'),
        excused: window.App.I18n.t('attendance.excused'),
        medical: window.App.I18n.t('attendance.medical'),
        holiday: window.App.I18n.t('attendance.holiday')
      };

      var html = '';
      recent.forEach(function (record) {
        var student = studentMap[record.studentId] || {};
        var cls = classMap[record.classId] || {};
        var name = (student.firstName || '') + ' ' + (student.lastName || '');
        var color = statusColors[record.status] || '#64748B';
        var label = statusLabels[record.status] || record.status;

        html += '<div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3) 0;border-bottom:1px solid var(--divider)">' +
          '<div style="width:40px;height:40px;border-radius:50%;background:' + color + '15;display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
            '<span style="font-size:var(--text-xs);font-weight:var(--font-bold);color:' + color + '">' + window.App.Helpers.getInitials(student.firstName || '', student.lastName || '') + '</span>' +
          '</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + window.App.Helpers.capitalize(name) + '</div>' +
            '<div style="font-size:var(--text-xs);color:var(--text-tertiary)">' + (cls.name || '') + ' · ' + window.App.Dates.formatDate(record.date) + '</div>' +
          '</div>' +
          '<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:var(--radius-full);font-size:10px;font-weight:var(--font-semibold);color:#fff;background:' + color + ';white-space:nowrap">' + label + '</span>' +
        '</div>';
      });
      el.innerHTML = html;
      if (window.lucide) lucide.createIcons();
    }).catch(function () {
      el.innerHTML = '<div style="text-align:center;color:var(--danger);padding:var(--space-6)">Erreur</div>';
    });
  }

  function initCharts() {
    loadAttendanceChart();
    loadDistributionChart();
  }

  function loadAttendanceChart() {
    var canvas = document.getElementById('attendanceChart');
    if (!canvas) return;

    var dates = [];
    var presentData = [];
    var absentData = [];

    for (var i = 6; i >= 0; i--) {
      var d = window.App.Dates.addDays(window.App.Dates.today(), -i);
      var dateStr = d.toISOString ? d.toISOString().split('T')[0] : String(d);
      var parts = dateStr.split('-');
      if (parts.length === 3) {
        dates.push(parts[2] + '/' + parts[1]);
      } else {
        dates.push(dateStr);
      }
      presentData.push(0);
      absentData.push(0);
    }

    window.App.DB.getAll('attendance').then(function (records) {
      for (var j = 0; j < records.length; j++) {
        var rec = records[j];
        for (var k = 6; k >= 0; k--) {
          var dd = window.App.Dates.addDays(window.App.Dates.today(), -k);
          var ddStr = dd.toISOString ? dd.toISOString().split('T')[0] : String(dd);
          if (rec.date === ddStr) {
            var idx = 6 - k;
            if (rec.status === 'present' || rec.status === 'late') {
              presentData[idx]++;
            } else if (rec.status === 'absent') {
              absentData[idx]++;
            }
          }
        }
      }

      if (charts.attendance) { charts.attendance.destroy(); }
      var ctx = canvas.getContext('2d');
      charts.attendance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [
            { label: window.App.I18n.t('attendance.present'), data: presentData, backgroundColor: 'rgba(16,185,129,0.8)', borderRadius: 6 },
            { label: window.App.I18n.t('attendance.absent'), data: absentData, backgroundColor: 'rgba(239,68,68,0.8)', borderRadius: 6 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.04)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }).catch(function () {});
  }

  function loadDistributionChart() {
    var canvas = document.getElementById('distributionChart');
    if (!canvas) return;

    var counts = { present: 0, absent: 0, late: 0, excused: 0 };

    window.App.DB.getAll('attendance').then(function (records) {
      records.forEach(function (r) {
        if (counts[r.status] !== undefined) {
          counts[r.status]++;
        }
      });

      if (charts.distribution) { charts.distribution.destroy(); }
      var ctx = canvas.getContext('2d');
      charts.distribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [
            window.App.I18n.t('attendance.present'),
            window.App.I18n.t('attendance.absent'),
            window.App.I18n.t('attendance.late'),
            window.App.I18n.t('attendance.excused')
          ],
          datasets: [{
            data: [counts.present, counts.absent, counts.late, counts.excused],
            backgroundColor: ['#10B981', '#EF4444', '#F59E0B', '#2563EB'],
            borderWidth: 3,
            borderColor: 'var(--surface)',
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } } },
          cutout: '65%'
        }
      });
    }).catch(function () {});
  }

  function animateCounters() {
    var counterEls = document.querySelectorAll('#dashboard-stats [data-count]');
    counterEls.forEach(function(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target) || target === 0) return;
      var duration = 1200;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }

      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }

  function loadCalendarMini() {
    var calEl = document.getElementById('dashboard-calendar');
    if (!calEl) return;

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var today = now.getDate();
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var lang = window.App.I18n.getLanguage();
    var dayNames = lang === 'ar'
      ? ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت']
      : ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    var html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">';
    dayNames.forEach(function(d) {
      html += '<div style="text-align:center;font-size:10px;font-weight:600;color:var(--text-tertiary);padding:4px 0">' + d + '</div>';
    });

    for (var i = 0; i < firstDay; i++) {
      html += '<div></div>';
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var isToday = d === today;
      var bg = isToday ? 'var(--primary)' : 'transparent';
      var color = isToday ? '#fff' : 'var(--text)';
      var fw = isToday ? '700' : '400';
      html += '<div style="text-align:center;padding:6px 0;font-size:12px;font-weight:' + fw + ';color:' + color + ';background:' + bg + ';border-radius:8px;cursor:default">' + d + '</div>';
    }
    html += '</div>';
    calEl.innerHTML = html;
  }

  function setupQuickActions() {
    var addStudentBtn = document.getElementById('quick-add-student');
    if (addStudentBtn) {
      addStudentBtn.addEventListener('click', function () {
        window.location.hash = '#/students';
        setTimeout(function () {
          var btn = document.getElementById('add-student-btn');
          if (btn) btn.click();
        }, 500);
      });
    }

    var printBtn = document.getElementById('quick-print');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        var now = window.App.Dates.today();
        var dateObj = new Date(now);
        var month = dateObj.getMonth() + 1;
        var year = dateObj.getFullYear();
        window.App.DB.getAll('classes').then(function (classes) {
          if (classes.length > 0) {
            window.App.ExportService.printRegister(classes[0].id, month, year);
          } else {
            window.App.UI.showToast('Aucune classe disponible', 'warning');
          }
        });
      });
    }
  }

  return { render: render, init: init };
})();
