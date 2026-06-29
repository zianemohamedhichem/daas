window.App = window.App || {};

window.App.Loading = null;

(function () {
  var DB = window.App.DB;
  var I18n = window.App.I18n;
  var Dates = window.App.Dates;
  var NotificationService = window.App.NotificationService;

  if (window.App.UI && window.App.UI.Loading) {
    window.App.Loading = window.App.UI.Loading;
  }

  var Pages = window.App.Pages || {};

  var routes = {
    '#/dashboard': Pages.Dashboard,
    '#/classes': Pages.Classes,
    '#/students': Pages.Students,
    '#/attendance': Pages.Attendance,
    '#/register': Pages.Register,
    '#/statistics': Pages.Statistics,
    '#/settings': Pages.Settings,
    '#/profile': Pages.Profile
  };

  var currentRoute = null;

  function navigate(route) {
    if (!route || route === '#' || route === '#/') {
      route = '#/dashboard';
    }
    var page = routes[route];
    var container = document.getElementById('page-content');
    if (!container) return;

    currentRoute = route;
    window.location.hash = route;

    if (page && typeof page.render === 'function') {
      container.innerHTML = page.render();
      if (typeof page.init === 'function') {
        page.init();
      }
    } else {
      container.innerHTML =
        '<div class="p-8 text-center">' +
        '<i class="bi bi-exclamation-triangle text-warning" style="font-size:3rem;"></i>' +
        '<h3 class="mt-4 text-secondary">Page non trouvée</h3>' +
        '<p>La page demandée n\'existe pas.</p>' +
        '<a href="#/dashboard" class="btn btn-primary mt-3">Retour au tableau de bord</a>' +
        '</div>';
    }

    updateSidebarActive(route);
    window.scrollTo(0, 0);
  }

  function updateSidebarActive(route) {
    var links = document.querySelectorAll('.sidebar-nav .nav-link');
    for (var i = 0; i < links.length; i++) {
      links[i].classList.remove('active');
      var href = links[i].getAttribute('href');
      if (href === route) {
        links[i].classList.add('active');
      }
    }
  }

  function updateNotificationBadge() {
    var count = NotificationService.getNotificationCount();
    var badge = document.getElementById('notification-badge');
    if (badge) {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.remove('d-none');
      } else {
        badge.classList.add('d-none');
      }
    }
  }

  function setupSidebarToggle() {
    var toggle = document.getElementById('sidebar-toggle');
    var sidebar = document.getElementById('sidebar');
    var closeBtn = document.getElementById('sidebar-close');
    if (toggle && sidebar) {
      toggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
    }
    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', function () {
        sidebar.classList.remove('open');
      });
    }
    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay d-lg-none';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:199;';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function () {
      sidebar.classList.remove('open');
      overlay.style.display = 'none';
    });
    if (sidebar) {
      var observer = new MutationObserver(function () {
        overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
      });
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function setupThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    var savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = document.body.getAttribute('data-theme') || 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
        if (DB) {
          DB.put('settings', { key: 'theme', value: next }).catch(function () {});
        }
      });
    }
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    var icon = document.querySelector('#theme-toggle i');
    if (icon) {
      icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    }
  }

  function setupLanguageToggle() {
    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = I18n.getLanguage();
        var next = current === 'fr' ? 'ar' : 'fr';
        I18n.setLanguage(next);
        var label = toggle.querySelector('.lang-label');
        if (label) {
          label.textContent = next === 'fr' ? 'ع' : 'FR';
        }
      });
    }
  }

  function setupGlobalSearch() {
    var input = document.getElementById('search-input');
    if (!input) return;
    var debounceTimer = null;
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        var query = input.value.trim();
        if (query.length < 2) return;
        DB.search('students', 'lastName', query).then(function (results) {
          if (results.length > 0 && currentRoute !== '#/students') {
            window.location.hash = '#/students';
          }
        });
      }, 300);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        input.value = '';
        input.blur();
      }
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        var searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        navigate('#/dashboard');
      }
      if (e.key === 'Escape') {
        var modals = document.querySelectorAll('.modal.show');
        for (var i = 0; i < modals.length; i++) {
          var modalInstance = bootstrap.Modal.getInstance(modals[i]);
          if (modalInstance) modalInstance.hide();
        }
      }
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js').catch(function (err) {
        console.warn('Service worker registration failed:', err);
      });
    }
  }

  function seedDemoData() {
    return DB.count('classes').then(function (count) {
      if (count > 0) return;

      var classes = [
        { name: 'CP 1', level: 'CP', section: 'A', year: '2026/2027', studentCount: 10 },
        { name: 'CE1 2', level: 'CE1', section: 'B', year: '2026/2027', studentCount: 10 }
      ];

      var firstNamesM = ['Mohamed', 'Ahmed', 'Yacine', 'Karim', 'Omar', 'Sofiane', 'Rachid', 'Youcef', 'Samir', 'Nabil', 'Abdelkader', 'Mourad'];
      var firstNamesF = ['Fatima', 'Amina', 'Lina', 'Nadia', 'Sara', 'Meriem', 'Asma', 'Khadija', 'Yasmine', 'Houda', 'Samira', 'Zineb'];
      var lastNames = ['Bouzid', 'Khelifi', 'Mebarki', 'Cherif', 'Hamidi', 'Benali', 'Mansouri', 'Taleb', 'Aoudia', 'Slimani', 'Brahimi', 'Messaoudi'];

      var classIds = [];
      var allStudents = [];

      var classPromises = classes.map(function (cls) {
        return DB.add('classes', {
          name: cls.name,
          level: cls.level,
          section: cls.section,
          year: cls.year,
          createdAt: new Date().toISOString()
        }).then(function (id) {
          classIds.push(id);
          var studentPromises = [];
          for (var i = 0; i < cls.studentCount; i++) {
            var isMale = Math.random() > 0.5;
            var fnPool = isMale ? firstNamesM : firstNamesF;
            var firstName = fnPool[Math.floor(Math.random() * fnPool.length)];
            var lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            studentPromises.push(DB.add('students', {
              classId: id,
              firstName: firstName,
              lastName: lastName,
              gender: isMale ? 'male' : 'female',
              dateOfBirth: (2015 + Math.floor(Math.random() * 4)) + '-' +
                String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') + '-' +
                String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
              parentName: lastName + ' ' + (isMale ? 'père' : 'mère'),
              parentPhone: '055' + String(Math.floor(Math.random() * 10000000)).padStart(7, '0'),
              createdAt: new Date().toISOString()
            }).then(function (stuId) {
              allStudents.push({ id: stuId, classId: id });
              return stuId;
            }));
          }
          return Promise.all(studentPromises);
        });
      });

      return Promise.all(classPromises).then(function () {
        var statuses = ['present', 'absent', 'late', 'excused'];
        var attendancePromises = [];
        var today = Dates ? Dates.today() : new Date().toISOString().split('T')[0];

        for (var dayOffset = 0; dayOffset < 5; dayOffset++) {
          var date = today;
          if (Dates && Dates.addDays) {
            var d = Dates.addDays(new Date(), -(dayOffset + 1));
            date = d.toISOString().split('T')[0];
          }
          if (Dates && Dates.isWeekend && Dates.isWeekend(new Date(date))) continue;

          for (var si = 0; si < allStudents.length; si++) {
            var stu = allStudents[si];
            var status = statuses[Math.floor(Math.random() * statuses.length)];
            attendancePromises.push(
              DB.add('attendance', {
                classId: stu.classId,
                date: date,
                studentId: stu.id,
                status: status,
                note: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })
            );
          }
        }

        return Promise.all(attendancePromises);
      });
    });
  }

  function init() {
    DB.init().then(function () {
      return I18n.init();
    }).then(function () {
      NotificationService.init();
      setupSidebarToggle();
      setupThemeToggle();
      setupLanguageToggle();
      setupGlobalSearch();
      setupKeyboardShortcuts();
      registerServiceWorker();

      return DB.get('settings', 'theme').then(function (result) {
        if (result && result.value) {
          applyTheme(result.value);
        }
      }).catch(function () {});
    }).then(function () {
      return seedDemoData();
    }).then(function () {
      var hash = window.location.hash || '#/dashboard';
      navigate(hash);
    }).catch(function (err) {
      console.error('App initialization failed:', err);
      var container = document.getElementById('page-content');
      if (container) {
        container.innerHTML =
          '<div class="p-8 text-center">' +
          '<i class="bi bi-exclamation-triangle text-danger" style="font-size:3rem;"></i>' +
          '<h3 class="mt-4">Erreur d\'initialisation</h3>' +
          '<p class="text-secondary">' + (err.message || 'Une erreur est survenue') + '</p>' +
          '<button class="btn btn-primary mt-3" onclick="location.reload()">Réessayer</button>' +
          '</div>';
      }
    });

    window.addEventListener('hashchange', function () {
      var hash = window.location.hash || '#/dashboard';
      if (hash !== currentRoute) {
        navigate(hash);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.App.navigate = navigate;
  window.App.getCurrentRoute = function () { return currentRoute; };
})();
