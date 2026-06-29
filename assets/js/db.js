window.App = window.App || {};

window.App.DB = (function () {
  var DB_NAME = 'registre_db';
  var DB_VERSION = 1;
  var db = null;

  function openStore(storeName, mode) {
    var tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  function promisify(request) {
    return new Promise(function (resolve, reject) {
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function promisifyTransaction(tx) {
    return new Promise(function (resolve, reject) {
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
      tx.onabort = function () { reject(tx.error || new Error('Transaction aborted')); };
    });
  }

  function init() {
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = function (event) {
        var database = event.target.result;

        if (!database.objectStoreNames.contains('classes')) {
          var classesStore = database.createObjectStore('classes', { keyPath: 'id', autoIncrement: true });
          classesStore.createIndex('name', 'name', { unique: false });
          classesStore.createIndex('year', 'year', { unique: false });
          classesStore.createIndex('section', 'section', { unique: false });
        }

        if (!database.objectStoreNames.contains('students')) {
          var studentsStore = database.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
          studentsStore.createIndex('classId', 'classId', { unique: false });
          studentsStore.createIndex('lastName', 'lastName', { unique: false });
          studentsStore.createIndex('firstName', 'firstName', { unique: false });
        }

        if (!database.objectStoreNames.contains('attendance')) {
          var attendanceStore = database.createObjectStore('attendance', { keyPath: 'id', autoIncrement: true });
          attendanceStore.createIndex('classId', 'classId', { unique: false });
          attendanceStore.createIndex('studentId', 'studentId', { unique: false });
          attendanceStore.createIndex('date', 'date', { unique: false });
          attendanceStore.createIndex('classId_date', ['classId', 'date'], { unique: false });
          attendanceStore.createIndex('studentId_date', ['studentId', 'date'], { unique: false });
        }

        if (!database.objectStoreNames.contains('holidays')) {
          var holidaysStore = database.createObjectStore('holidays', { keyPath: 'id', autoIncrement: true });
          holidaysStore.createIndex('date', 'date', { unique: true });
        }

        if (!database.objectStoreNames.contains('settings')) {
          database.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = function (event) {
        db = event.target.result;
        resolve(db);
      };

      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  function add(storeName, data) {
    return new Promise(function (resolve, reject) {
      var store = openStore(storeName, 'readwrite');
      var request = store.add(data);
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function put(storeName, data) {
    return new Promise(function (resolve, reject) {
      var store = openStore(storeName, 'readwrite');
      var request = store.put(data);
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function get(storeName, id) {
    return new Promise(function (resolve, reject) {
      var store = openStore(storeName, 'readonly');
      var request = store.get(id);
      request.onsuccess = function () { resolve(request.result || null); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function getAll(storeName) {
    return new Promise(function (resolve, reject) {
      var store = openStore(storeName, 'readonly');
      var request = store.getAll();
      request.onsuccess = function () { resolve(request.result || []); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function getByIndex(storeName, indexName, value) {
    return new Promise(function (resolve, reject) {
      var store = openStore(storeName, 'readonly');
      var index = store.index(indexName);
      var request = index.getAll(value);
      request.onsuccess = function () { resolve(request.result || []); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function getByRange(storeName, indexName, lower, upper) {
    return new Promise(function (resolve, reject) {
      var store = openStore(storeName, 'readonly');
      var index = store.index(indexName);
      var range = IDBKeyRange.bound(lower, upper);
      var request = index.getAll(range);
      request.onsuccess = function () { resolve(request.result || []); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function deleteRecord(storeName, id) {
    return new Promise(function (resolve, reject) {
      var store = openStore(storeName, 'readwrite');
      var request = store.delete(id);
      request.onsuccess = function () { resolve(true); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function clear(storeName) {
    return new Promise(function (resolve, reject) {
      var store = openStore(storeName, 'readwrite');
      var request = store.clear();
      request.onsuccess = function () { resolve(true); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function bulkAdd(storeName, dataArray) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(storeName, 'readwrite');
      var store = tx.objectStore(storeName);
      var ids = [];

      for (var i = 0; i < dataArray.length; i++) {
        var request = store.add(dataArray[i]);
        (function (idx) {
          request.onsuccess = function () {
            ids[idx] = request.result;
          };
        })(i);
      }

      tx.oncomplete = function () { resolve(ids); };
      tx.onerror = function () { reject(tx.error); };
    });
  }

  function count(storeName) {
    return new Promise(function (resolve, reject) {
      var store = openStore(storeName, 'readonly');
      var request = store.count();
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function search(storeName, fieldName, query) {
    return new Promise(function (resolve, reject) {
      if (!query || query.trim() === '') {
        resolve([]);
        return;
      }
      var lowerQuery = query.toLowerCase();
      var store = openStore(storeName, 'readonly');
      var request = store.getAll();

      request.onsuccess = function () {
        var results = (request.result || []).filter(function (item) {
          var fieldValue = item[fieldName];
          if (fieldValue === null || fieldValue === undefined) return false;
          return String(fieldValue).toLowerCase().indexOf(lowerQuery) !== -1;
        });
        resolve(results);
      };
      request.onerror = function () { reject(request.error); };
    });
  }

  return {
    init: init,
    add: add,
    put: put,
    get: get,
    getAll: getAll,
    getByIndex: getByIndex,
    getByRange: getByRange,
    delete: deleteRecord,
    clear: clear,
    bulkAdd: bulkAdd,
    count: count,
    search: search
  };
})();
