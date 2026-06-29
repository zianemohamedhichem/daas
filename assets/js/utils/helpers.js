window.App = window.App || {};

window.App.Helpers = (function () {
  function getInitials(firstName, lastName) {
    var first = (firstName || '').trim();
    var last = (lastName || '').trim();
    var result = '';
    if (first) result += first.charAt(0).toUpperCase();
    if (last) result += last.charAt(0).toUpperCase();
    return result;
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function truncate(str, length) {
    if (!str) return '';
    length = length || 50;
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  }

  function phoneFormat(number) {
    if (!number) return '';
    var cleaned = String(number).replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.substring(0, 2) + ' ' + cleaned.substring(2, 5) + ' ' + cleaned.substring(5, 7) + ' ' + cleaned.substring(7, 9) + ' ' + cleaned.substring(9);
    }
    if (cleaned.length === 9) {
      return '0' + cleaned.substring(0, 1) + ' ' + cleaned.substring(1, 4) + ' ' + cleaned.substring(4, 6) + ' ' + cleaned.substring(6, 8) + ' ' + cleaned.substring(8);
    }
    return number;
  }

  function generatePDF(options) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      console.warn('jsPDF not loaded');
      return null;
    }
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF(options || {});
    return doc;
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (Array.isArray(obj)) return obj.map(function (item) { return deepClone(item); });
    var cloned = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  function sortBy(array, key, direction) {
    if (!array || !Array.isArray(array)) return [];
    direction = direction || 'asc';

    return array.slice().sort(function (a, b) {
      var aVal = typeof key === 'function' ? key(a) : a[key];
      var bVal = typeof key === 'function' ? key(b) : b[key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      var comparison = 0;
      if (aVal < bVal) comparison = -1;
      else if (aVal > bVal) comparison = 1;

      return direction === 'desc' ? -comparison : comparison;
    });
  }

  function groupBy(array, key) {
    if (!array || !Array.isArray(array)) return {};
    var result = {};

    for (var i = 0; i < array.length; i++) {
      var groupKey = typeof key === 'function' ? key(array[i]) : array[i][key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(array[i]);
    }

    return result;
  }

  function calculatePercentage(part, total) {
    if (!total || total === 0) return 0;
    return Math.round((part / total) * 100 * 100) / 100;
  }

  return {
    getInitials: getInitials,
    capitalize: capitalize,
    truncate: truncate,
    phoneFormat: phoneFormat,
    generatePDF: generatePDF,
    escapeHtml: escapeHtml,
    deepClone: deepClone,
    sortBy: sortBy,
    groupBy: groupBy,
    calculatePercentage: calculatePercentage
  };
})();
