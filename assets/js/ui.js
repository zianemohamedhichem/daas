window.App = window.App || {};

window.App.UI = (function () {
  var currentModal = null;

  function showToast(message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;

    var existing = document.querySelector('.toast-container');
    if (!existing) {
      var container = document.createElement('div');
      container.className = 'toast-container';
      container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:10px;';
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    var icons = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' };
    var colors = { success: '#2ecc71', error: '#e74c3c', warning: '#f39c12', info: '#3498db' };

    toast.style.cssText = 'display:flex;align-items:center;gap:10px;padding:12px 20px;border-radius:8px;color:#fff;background:' + (colors[type] || colors.info) + ';box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:14px;min-width:250px;max-width:400px;transform:translateX(120%);transition:transform 0.3s ease;cursor:pointer;';

    var iconSpan = document.createElement('span');
    iconSpan.style.cssText = 'font-size:18px;font-weight:bold;';
    iconSpan.textContent = icons[type] || icons.info;

    var textSpan = document.createElement('span');
    textSpan.style.cssText = 'flex:1;';
    textSpan.textContent = message;

    var closeBtn = document.createElement('span');
    closeBtn.style.cssText = 'cursor:pointer;font-size:16px;opacity:0.7;';
    closeBtn.textContent = '×';
    closeBtn.onclick = function () { removeToast(toast); };

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    toast.appendChild(closeBtn);

    var containerEl = document.querySelector('.toast-container');
    containerEl.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(function () { removeToast(toast); }, duration);

    toast.onclick = function () { removeToast(toast); };
  }

  function removeToast(toast) {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }

  function showModal(title, content, options) {
    options = options || {};

    return new Promise(function (resolve) {
      closeModal();

      var overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';

      var modal = document.createElement('div');
      modal.className = 'modal';
      modal.style.cssText = 'background:#fff;border-radius:12px;max-width:' + (options.maxWidth || '500px') + ';width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:modalIn 0.3s ease;';

      var header = document.createElement('div');
      header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #eee;';
      var titleEl = document.createElement('h3');
      titleEl.style.cssText = 'margin:0;font-size:18px;font-weight:600;';
      titleEl.textContent = title;
      var closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = 'background:none;border:none;font-size:24px;cursor:pointer;color:#666;padding:0;line-height:1;';
      closeBtn.onclick = function () {
        closeModal();
        resolve(options.cancelValue !== undefined ? options.cancelValue : null);
      };
      header.appendChild(titleEl);
      header.appendChild(closeBtn);

      var body = document.createElement('div');
      body.style.cssText = 'padding:24px;';
      if (typeof content === 'string') {
        body.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        body.appendChild(content);
      }

      var footer = document.createElement('div');
      footer.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;padding:16px 24px;border-top:1px solid #eee;';

      if (options.showCancel !== false) {
        var cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = (window.App.I18n ? window.App.I18n.t('common.cancel') : 'Annuler');
        cancelBtn.onclick = function () {
          closeModal();
          resolve(options.cancelValue !== undefined ? options.cancelValue : null);
        };
        footer.appendChild(cancelBtn);
      }

      if (options.confirmText !== false) {
        var confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn btn-primary';
        confirmBtn.textContent = options.confirmText || (window.App.I18n ? window.App.I18n.t('common.confirm') : 'Confirmer');
        confirmBtn.onclick = function () {
          closeModal();
          resolve(true);
        };
        footer.appendChild(confirmBtn);
      }

      modal.appendChild(header);
      modal.appendChild(body);
      modal.appendChild(footer);
      overlay.appendChild(modal);

      document.body.appendChild(overlay);
      currentModal = overlay;

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          closeModal();
          resolve(options.cancelValue !== undefined ? options.cancelValue : null);
        }
      });

      if (options.onOpen) {
        options.onOpen(modal, body);
      }
    });
  }

  function closeModal() {
    if (currentModal) {
      currentModal.style.opacity = '0';
      setTimeout(function () {
        if (currentModal && currentModal.parentNode) {
          currentModal.parentNode.removeChild(currentModal);
        }
        currentModal = null;
      }, 200);
    }
  }

  function confirm(title, message) {
    return new Promise(function (resolve) {
      var msgDiv = document.createElement('div');
      msgDiv.style.cssText = 'text-align:center;padding:10px 0;';
      var icon = document.createElement('div');
      icon.style.cssText = 'font-size:48px;margin-bottom:16px;';
      icon.textContent = '⚠️';
      var text = document.createElement('p');
      text.style.cssText = 'font-size:15px;color:#555;margin:0;line-height:1.5;';
      text.textContent = message;
      msgDiv.appendChild(icon);
      msgDiv.appendChild(text);

      showModal(title, msgDiv, { confirmText: window.App.I18n ? window.App.I18n.t('common.yes') : 'Oui', showCancel: true }).then(function (result) {
        resolve(result === true);
      });
    });
  }

  function alert(title, message) {
    return showModal(title, '<p style="margin:0;color:#555;line-height:1.5;">' + escapeHtmlInternal(message) + '</p>', {
      showCancel: false,
      confirmText: window.App.I18n ? window.App.I18n.t('common.ok') : 'OK'
    });
  }

  function escapeHtmlInternal(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function createTable(headers, rows, options) {
    options = options || {};
    var sortable = options.sortable !== false;
    var pageSize = options.pageSize || 10;
    var tableId = options.id || 'table-' + Date.now();

    var html = '<div class="table-container" id="' + tableId + '-container">';
    html += '<table class="data-table" id="' + tableId + '">';

    html += '<thead><tr>';
    for (var h = 0; h < headers.length; h++) {
      var thClass = sortable ? 'sortable' : '';
      html += '<th class="' + thClass + '" data-col="' + h + '">' + escapeHtmlInternal(headers[h]);
      if (sortable) {
        html += '<span class="sort-icon"> ↕</span>';
      }
      html += '</th>';
    }
    html += '</tr></thead>';

    html += '<tbody>';
    if (rows.length === 0) {
      html += '<tr><td colspan="' + headers.length + '" class="empty-row">' + (window.App.I18n ? window.App.I18n.t('common.noData') : 'Aucune donnée') + '</td></tr>';
    } else {
      for (var r = 0; r < rows.length; r++) {
        html += '<tr data-index="' + r + '">';
        for (var c = 0; c < rows[r].length; c++) {
          html += '<td>' + (rows[r][c] !== null && rows[r][c] !== undefined ? rows[r][c] : '') + '</td>';
        }
        html += '</tr>';
      }
    }
    html += '</tbody></table>';

    if (options.pagination !== false && rows.length > pageSize) {
      html += '<div class="pagination" id="' + tableId + '-pagination"></div>';
    }

    html += '</div>';

    if (sortable) {
      setTimeout(function () {
        setupTableSort(tableId, headers.length);
      }, 0);
    }

    if (options.pagination !== false && rows.length > pageSize) {
      setTimeout(function () {
        setupTablePagination(tableId, pageSize, rows.length);
      }, 0);
    }

    return html;
  }

  function setupTableSort(tableId, colCount) {
    var table = document.getElementById(tableId);
    if (!table) return;

    var headers = table.querySelectorAll('th.sortable');
    headers.forEach(function (th) {
      th.addEventListener('click', function () {
        var col = parseInt(th.getAttribute('data-col'));
        var tbody = table.querySelector('tbody');
        var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
        var isAsc = th.classList.contains('sort-asc');

        headers.forEach(function (h) {
          h.classList.remove('sort-asc', 'sort-desc');
          var icon = h.querySelector('.sort-icon');
          if (icon) icon.textContent = ' ↕';
        });

        rows.sort(function (a, b) {
          var aVal = a.children[col] ? a.children[col].textContent.trim() : '';
          var bVal = b.children[col] ? b.children[col].textContent.trim() : '';
          var aNum = parseFloat(aVal);
          var bNum = parseFloat(bVal);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAsc ? bNum - aNum : aNum - bNum;
          }
          return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        });

        th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
        var icon = th.querySelector('.sort-icon');
        if (icon) icon.textContent = isAsc ? ' ↑' : ' ↓';

        rows.forEach(function (row) { tbody.appendChild(row); });
      });
    });
  }

  function setupTablePagination(tableId, pageSize, totalRows) {
    var container = document.getElementById(tableId + '-pagination');
    if (!container) return;

    var totalPages = Math.ceil(totalRows / pageSize);
    var currentPage = 1;

    function renderPagination() {
      createPagination(currentPage, totalPages, function (page) {
        currentPage = page;
        var table = document.getElementById(tableId);
        if (!table) return;
        var tbody = table.querySelector('tbody');
        var rows = tbody.querySelectorAll('tr');
        var start = (page - 1) * pageSize;
        var end = start + pageSize;
        rows.forEach(function (row, i) {
          row.style.display = i >= start && i < end ? '' : 'none';
        });
        renderPagination();
      });
    }

    container.innerHTML = '';
    var pagDiv = document.createElement('div');
    pagDiv.className = 'pagination-controls';
    container.appendChild(pagDiv);

    renderPagination();
  }

  function createPagination(currentPage, totalPages, callback) {
    if (totalPages <= 1) return '';

    var html = '<div class="pagination-controls" style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:16px;">';

    html += '<button class="btn btn-sm pagination-btn" data-page="1" ' + (currentPage === 1 ? 'disabled' : '') + '>«</button>';
    html += '<button class="btn btn-sm pagination-btn" data-page="' + (currentPage - 1) + '" ' + (currentPage === 1 ? 'disabled' : '') + '>‹</button>';

    var start = Math.max(1, currentPage - 2);
    var end = Math.min(totalPages, currentPage + 2);

    if (start > 1) {
      html += '<button class="btn btn-sm pagination-btn" data-page="1">1</button>';
      if (start > 2) html += '<span class="pagination-ellipsis">...</span>';
    }

    for (var i = start; i <= end; i++) {
      html += '<button class="btn btn-sm pagination-btn ' + (i === currentPage ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }

    if (end < totalPages) {
      if (end < totalPages - 1) html += '<span class="pagination-ellipsis">...</span>';
      html += '<button class="btn btn-sm pagination-btn" data-page="' + totalPages + '">' + totalPages + '</button>';
    }

    html += '<button class="btn btn-sm pagination-btn" data-page="' + (currentPage + 1) + '" ' + (currentPage === totalPages ? 'disabled' : '') + '>›</button>';
    html += '<button class="btn btn-sm pagination-btn" data-page="' + totalPages + '" ' + (currentPage === totalPages ? 'disabled' : '') + '>»</button>';

    html += '</div>';

    setTimeout(function () {
      var controls = document.querySelector('.pagination-controls');
      if (!controls) return;
      controls.querySelectorAll('.pagination-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var page = parseInt(btn.getAttribute('data-page'));
          if (page >= 1 && page <= totalPages) {
            callback(page);
          }
        });
      });
    }, 0);

    return html;
  }

  function createEmptyState(icon, message, actionText, actionCallback) {
    var html = '<div class="empty-state" style="text-align:center;padding:60px 20px;">';
    html += '<div class="empty-state-icon" style="font-size:64px;margin-bottom:16px;opacity:0.5;">' + icon + '</div>';
    html += '<p class="empty-state-message" style="font-size:16px;color:#666;margin-bottom:24px;">' + escapeHtmlInternal(message) + '</p>';
    if (actionText && actionCallback) {
      html += '<button class="btn btn-primary empty-state-action">' + escapeHtmlInternal(actionText) + '</button>';
    }
    html += '</div>';

    if (actionText && actionCallback) {
      setTimeout(function () {
        var actionBtn = document.querySelector('.empty-state-action');
        if (actionBtn) actionBtn.addEventListener('click', actionCallback);
      }, 0);
    }

    return html;
  }

  function createStatCard(icon, value, label, color, trend) {
    color = color || '#3498db';
    var html = '<div class="stat-card" style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.08);display:flex;align-items:center;gap:16px;">';
    html += '<div class="stat-icon" style="width:56px;height:56px;border-radius:12px;background:' + color + '15;display:flex;align-items:center;justify-content:center;font-size:24px;">' + icon + '</div>';
    html += '<div class="stat-info">';
    html += '<div class="stat-value" style="font-size:28px;font-weight:700;color:#333;">' + escapeHtmlInternal(String(value)) + '</div>';
    html += '<div class="stat-label" style="font-size:13px;color:#888;margin-top:2px;">' + escapeHtmlInternal(label) + '</div>';
    if (trend !== undefined && trend !== null) {
      var trendColor = trend >= 0 ? '#2ecc71' : '#e74c3c';
      var trendIcon = trend >= 0 ? '↑' : '↓';
      html += '<div class="stat-trend" style="font-size:12px;color:' + trendColor + ';margin-top:4px;">' + trendIcon + ' ' + Math.abs(trend) + '%</div>';
    }
    html += '</div></div>';
    return html;
  }

  function formatDate(date, format) {
    if (!date) return '';
    var d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';

    format = format || 'short';
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var year = d.getFullYear();

    switch (format) {
      case 'short': return day + '/' + month + '/' + year;
      case 'long':
        var months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        return day + ' ' + months[d.getMonth()] + ' ' + year;
      case 'iso': return year + '-' + month + '-' + day;
      default: return day + '/' + month + '/' + year;
    }
  }

  function formatDateInput(date) {
    if (!date) return '';
    var d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var year = d.getFullYear();
    return year + '-' + month + '-' + day;
  }

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this;
      var args = arguments;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay || 300);
    };
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function animateIn(element, animation) {
    if (!element) return;
    animation = animation || 'fadeIn';
    element.classList.add('animate-' + animation);
    element.addEventListener('animationend', function handler() {
      element.classList.remove('animate-' + animation);
      element.removeEventListener('animationend', handler);
    });
  }

  var Loading = {
    _overlay: null,
    show: function (message) {
      if (this._overlay) return;
      var overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.85);z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;';

      var spinner = document.createElement('div');
      spinner.className = 'loading-spinner';
      spinner.style.cssText = 'width:48px;height:48px;border:4px solid #e0e0e0;border-top-color:#3498db;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:16px;';

      var text = document.createElement('div');
      text.className = 'loading-text';
      text.style.cssText = 'font-size:14px;color:#666;';
      text.textContent = message || (window.App.I18n ? window.App.I18n.t('common.loading') : 'Chargement...');

      overlay.appendChild(spinner);
      overlay.appendChild(text);
      document.body.appendChild(overlay);

      if (!document.getElementById('loading-keyframes')) {
        var style = document.createElement('style');
        style.id = 'loading-keyframes';
        style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes modalIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }';
        document.head.appendChild(style);
      }

      this._overlay = overlay;
    },
    hide: function () {
      if (this._overlay) {
        if (this._overlay.parentNode) this._overlay.parentNode.removeChild(this._overlay);
        this._overlay = null;
      }
    }
  };

  return {
    showToast: showToast,
    showModal: showModal,
    closeModal: closeModal,
    confirm: confirm,
    alert: alert,
    createTable: createTable,
    createPagination: createPagination,
    createEmptyState: createEmptyState,
    createStatCard: createStatCard,
    formatDate: formatDate,
    formatDateInput: formatDateInput,
    debounce: debounce,
    generateId: generateId,
    scrollToTop: scrollToTop,
    animateIn: animateIn,
    Loading: Loading
  };
})();
