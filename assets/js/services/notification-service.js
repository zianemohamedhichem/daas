window.App = window.App || {};

window.App.NotificationService = (function () {
  var STORAGE_KEY = 'notifications';
  var permission = 'default';
  var notifications = [];

  function init() {
    loadNotifications();
    if ('Notification' in window) {
      permission = Notification.permission;
    }
    updateBadge();
  }

  function requestPermission() {
    if (!('Notification' in window)) {
      return Promise.resolve('denied');
    }
    return Notification.requestPermission().then(function (result) {
      permission = result;
      return result;
    });
  }

  function send(title, body, icon) {
    if (!('Notification' in window) || permission !== 'granted') {
      return;
    }
    var notif = new Notification(title, {
      body: body,
      icon: icon || 'assets/icons/icon-192.png',
      badge: 'assets/icons/icon-192.png',
      tag: 'registre-' + Date.now(),
      renotify: true
    });
    notif.onclick = function () {
      window.focus();
      notif.close();
    };
    setTimeout(function () { notif.close(); }, 5000);
  }

  function checkAbsences(classId) {
    var Dates = window.App.Dates;
    var today = Dates ? Dates.today() : new Date().toISOString().split('T')[0];
    var AttendanceService = window.App.AttendanceService;
    var DB = window.App.DB;
    if (!AttendanceService || !DB) return Promise.resolve([]);

    return AttendanceService.getAttendance(classId, today).then(function (records) {
      var absences = records.filter(function (r) {
        return r.status === 'absent';
      });
      if (absences.length > 0) {
        var body = absences.length + ' élève(s) absent(s) aujourd\'hui';
        addNotification('absence', 'Absences du jour', body);
        send('Absences', body);
      }
      return absences;
    });
  }

  function getNotificationCount() {
    var unread = 0;
    for (var i = 0; i < notifications.length; i++) {
      if (!notifications[i].read) unread++;
    }
    return unread;
  }

  function markAllRead() {
    for (var i = 0; i < notifications.length; i++) {
      notifications[i].read = true;
    }
    saveNotifications();
    updateBadge();
  }

  function getNotifications() {
    return notifications.slice().sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  function addNotification(type, title, body) {
    var notification = {
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      type: type,
      title: title,
      body: body,
      read: false,
      createdAt: new Date().toISOString()
    };
    notifications.unshift(notification);
    if (notifications.length > 50) {
      notifications = notifications.slice(0, 50);
    }
    saveNotifications();
    updateBadge();
    return notification;
  }

  function clearAll() {
    notifications = [];
    saveNotifications();
    updateBadge();
  }

  function saveNotifications() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      // silently fail
    }
  }

  function loadNotifications() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        notifications = JSON.parse(stored);
      }
    } catch (e) {
      notifications = [];
    }
  }

  function updateBadge() {
    var count = getNotificationCount();
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

  return {
    init: init,
    requestPermission: requestPermission,
    send: send,
    checkAbsences: checkAbsences,
    getNotificationCount: getNotificationCount,
    markAllRead: markAllRead,
    getNotifications: getNotifications,
    addNotification: addNotification,
    clearAll: clearAll
  };
})();
