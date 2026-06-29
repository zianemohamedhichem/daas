window.App = window.App || {};

window.App.Dates = (function () {
  var frenchMonths = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  var arabicMonths = [
    'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
    'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  var frenchDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  var arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  function today() {
    var d = new Date();
    return formatDateISO(d);
  }

  function formatDateISO(d) {
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var year = d.getFullYear();
    return year + '-' + month + '-' + day;
  }

  function formatDate(date, format) {
    if (!date) return '';
    var d = typeof date === 'string' ? parseDate(date) : date;
    if (!d || isNaN(d.getTime())) return '';

    format = format || 'short';
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var year = d.getFullYear();

    switch (format) {
      case 'short': return day + '/' + month + '/' + year;
      case 'long': return day + ' ' + getMonthName(d.getMonth(), 'fr') + ' ' + year;
      case 'iso': return formatDateISO(d);
      case 'day-month': return day + '/' + month;
      default: return day + '/' + month + '/' + year;
    }
  }

  function parseDate(str) {
    if (!str) return null;
    if (str instanceof Date) return str;
    var parts = str.split('-');
    if (parts.length === 3) {
      var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (!isNaN(d.getTime())) return d;
    }
    parts = str.split('/');
    if (parts.length === 3) {
      var d2 = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      if (!isNaN(d2.getTime())) return d2;
    }
    return null;
  }

  function isWeekend(date) {
    var d = typeof date === 'string' ? parseDate(date) : date;
    if (!d) return false;
    var day = d.getDay();
    return day === 5 || day === 6;
  }

  function isHoliday(date) {
    var d = typeof date === 'string' ? date : formatDateISO(date);
    if (!window.App.DB) return false;

    return window.App.DB.getByIndex('holidays', 'date', d).then(function (holidays) {
      return holidays.length > 0;
    }).catch(function () {
      return false;
    });
  }

  function getMonthDays(year, month) {
    var days = [];
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    for (var i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }

  function getMonthName(month, lang) {
    if (lang === 'ar') {
      return arabicMonths[month] || '';
    }
    return frenchMonths[month] || '';
  }

  function getDayName(date, lang) {
    var d = typeof date === 'string' ? parseDate(date) : date;
    if (!d) return '';
    var dayIndex = d.getDay();
    if (lang === 'ar') {
      return arabicDays[dayIndex] || '';
    }
    return frenchDays[dayIndex] || '';
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getWeekNumber(date) {
    var d = typeof date === 'string' ? parseDate(date) : date;
    if (!d) return 0;
    var oneJan = new Date(d.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((d - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
  }

  function addDays(date, days) {
    var d = typeof date === 'string' ? parseDate(date) : new Date(date.getTime());
    if (!d) return null;
    d.setDate(d.getDate() + days);
    return d;
  }

  function isSameDay(date1, date2) {
    var d1 = typeof date1 === 'string' ? parseDate(date1) : date1;
    var d2 = typeof date2 === 'string' ? parseDate(date2) : date2;
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  function getRange(start, end) {
    var startDate = typeof start === 'string' ? parseDate(start) : start;
    var endDate = typeof end === 'string' ? parseDate(end) : end;
    if (!startDate || !endDate) return [];

    var dates = [];
    var current = new Date(startDate.getTime());
    while (current <= endDate) {
      dates.push(new Date(current.getTime()));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  function toArabicDate(date) {
    var d = typeof date === 'string' ? parseDate(date) : date;
    if (!d) return '';
    var day = d.getDate();
    var month = arabicMonths[d.getMonth()];
    var year = d.getFullYear();
    return day + ' ' + month + ' ' + year;
  }

  return {
    today: today,
    formatDate: formatDate,
    parseDate: parseDate,
    isWeekend: isWeekend,
    isHoliday: isHoliday,
    getMonthDays: getMonthDays,
    getMonthName: getMonthName,
    getDayName: getDayName,
    getDaysInMonth: getDaysInMonth,
    getWeekNumber: getWeekNumber,
    addDays: addDays,
    isSameDay: isSameDay,
    getRange: getRange,
    toArabicDate: toArabicDate
  };
})();
