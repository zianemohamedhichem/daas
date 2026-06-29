window.App = window.App || {};

window.App.AttendanceService = (function () {
  var DB = window.App.DB;
  var VALID_STATUSES = ['present', 'absent', 'late', 'excused', 'medical', 'holiday'];

  function markAttendance(classId, date, studentId, status, note) {
    note = note || '';
    if (VALID_STATUSES.indexOf(status) === -1) {
      return Promise.reject(new Error('Invalid status: ' + status));
    }
    return DB.getByIndex('attendance', 'classId_date', [classId, date]).then(function (records) {
      var existing = null;
      for (var i = 0; i < records.length; i++) {
        if (records[i].studentId === studentId) {
          existing = records[i];
          break;
        }
      }
      var record = {
        classId: classId,
        date: date,
        studentId: studentId,
        status: status,
        note: note,
        updatedAt: new Date().toISOString()
      };
      if (existing) {
        record.id = existing.id;
        record.createdAt = existing.createdAt;
        return DB.put('attendance', record);
      }
      record.createdAt = new Date().toISOString();
      return DB.add('attendance', record);
    });
  }

  function getAttendance(classId, date) {
    return DB.getByIndex('attendance', 'classId_date', [classId, date]);
  }

  function getAttendanceByDateRange(classId, startDate, endDate) {
    return DB.getByRange('attendance', 'classId_date', [classId, startDate], [classId, endDate]);
  }

  function getStudentAttendance(studentId, startDate, endDate) {
    return DB.getByRange('attendance', 'studentId_date', [studentId, startDate], [studentId, endDate]);
  }

  function getStudentStats(studentId, classId) {
    var startDate = classId ? null : null;
    return DB.getAll('attendance').then(function (records) {
      var filtered = records.filter(function (r) {
        var matchStudent = r.studentId === studentId;
        var matchClass = classId ? r.classId === classId : true;
        return matchStudent && matchClass;
      });
      return computeStats(filtered);
    });
  }

  function computeStats(records) {
    var stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      medical: 0,
      holiday: 0,
      total: 0,
      percentage: 0
    };
    for (var i = 0; i < records.length; i++) {
      var s = records[i].status;
      if (s === 'present') stats.present++;
      else if (s === 'absent') stats.absent++;
      else if (s === 'late') stats.late++;
      else if (s === 'excused') stats.excused++;
      else if (s === 'medical') stats.medical++;
      else if (s === 'holiday') stats.holiday++;
    }
    stats.total = records.length;
    var attended = stats.present + stats.late;
    stats.percentage = stats.total > 0 ? Math.round((attended / stats.total) * 100) : 0;
    return stats;
  }

  function computeDayStats(records) {
    var stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      medical: 0,
      total: 0
    };
    for (var i = 0; i < records.length; i++) {
      var s = records[i].status;
      if (s === 'present') stats.present++;
      else if (s === 'absent') stats.absent++;
      else if (s === 'late') stats.late++;
      else if (s === 'excused') stats.excused++;
      else if (s === 'medical') stats.medical++;
    }
    stats.total = records.length;
    return stats;
  }

  function getClassStats(classId, date) {
    return getAttendance(classId, date).then(function (records) {
      return computeDayStats(records);
    });
  }

  function getMonthlyStats(classId, year, month) {
    var monthStr = month < 10 ? '0' + month : '' + month;
    var startDate = year + '-' + monthStr + '-01';
    var lastDay = new Date(year, month, 0).getDate();
    var endDate = year + '-' + monthStr + '-' + (lastDay < 10 ? '0' + lastDay : lastDay);
    return getAttendanceByDateRange(classId, startDate, endDate).then(function (records) {
      var dateMap = {};
      for (var i = 0; i < records.length; i++) {
        var d = records[i].date;
        if (!dateMap[d]) dateMap[d] = [];
        dateMap[d].push(records[i]);
      }
      var days = [];
      var totals = { present: 0, absent: 0, late: 0, excused: 0, medical: 0 };
      var totalRecords = 0;
      var dates = Object.keys(dateMap).sort();
      for (var j = 0; j < dates.length; j++) {
        var dayRecords = dateMap[dates[j]];
        var dayStat = { date: dates[j], present: 0, absent: 0, late: 0, excused: 0, medical: 0 };
        for (var k = 0; k < dayRecords.length; k++) {
          var st = dayRecords[k].status;
          if (st === 'present') { dayStat.present++; totals.present++; }
          else if (st === 'absent') { dayStat.absent++; totals.absent++; }
          else if (st === 'late') { dayStat.late++; totals.late++; }
          else if (st === 'excused') { dayStat.excused++; totals.excused++; }
          else if (st === 'medical') { dayStat.medical++; totals.medical++; }
        }
        totalRecords += dayRecords.length;
        days.push(dayStat);
      }
      var attended = totals.present + totals.late;
      var percentages = {
        present: totalRecords > 0 ? Math.round((totals.present / totalRecords) * 100) : 0,
        absent: totalRecords > 0 ? Math.round((totals.absent / totalRecords) * 100) : 0,
        late: totalRecords > 0 ? Math.round((totals.late / totalRecords) * 100) : 0,
        excused: totalRecords > 0 ? Math.round((totals.excused / totalRecords) * 100) : 0,
        medical: totalRecords > 0 ? Math.round((totals.medical / totalRecords) * 100) : 0
      };
      return { days: days, totals: totals, percentages: percentages };
    });
  }

  function getYearlyStats(classId, year) {
    var months = [];
    var promises = [];
    for (var m = 1; m <= 12; m++) {
      (function (month) {
        promises.push(getMonthlyStats(classId, year, month).then(function (stats) {
          months.push({ month: month, stats: stats });
        }));
      })(m);
    }
    return Promise.all(promises).then(function () {
      months.sort(function (a, b) { return a.month - b.month; });
      var yearlyTotals = { present: 0, absent: 0, late: 0, excused: 0, medical: 0 };
      for (var i = 0; i < months.length; i++) {
        var t = months[i].stats.totals;
        yearlyTotals.present += t.present;
        yearlyTotals.absent += t.absent;
        yearlyTotals.late += t.late;
        yearlyTotals.excused += t.excused;
        yearlyTotals.medical += t.medical;
      }
      var totalRecords = yearlyTotals.present + yearlyTotals.absent + yearlyTotals.late + yearlyTotals.excused + yearlyTotals.medical;
      var yearlyPercentages = {
        present: totalRecords > 0 ? Math.round((yearlyTotals.present / totalRecords) * 100) : 0,
        absent: totalRecords > 0 ? Math.round((yearlyTotals.absent / totalRecords) * 100) : 0,
        late: totalRecords > 0 ? Math.round((yearlyTotals.late / totalRecords) * 100) : 0,
        excused: totalRecords > 0 ? Math.round((yearlyTotals.excused / totalRecords) * 100) : 0,
        medical: totalRecords > 0 ? Math.round((yearlyTotals.medical / totalRecords) * 100) : 0
      };
      return { months: months, totals: yearlyTotals, percentages: yearlyPercentages };
    });
  }

  function markAllPresent(classId, date) {
    return DB.getByIndex('students', 'classId', classId).then(function (students) {
      var promises = [];
      for (var i = 0; i < students.length; i++) {
        promises.push(markAttendance(classId, date, students[i].id, 'present'));
      }
      return Promise.all(promises);
    });
  }

  function markAllAbsent(classId, date) {
    return DB.getByIndex('students', 'classId', classId).then(function (students) {
      var promises = [];
      for (var i = 0; i < students.length; i++) {
        promises.push(markAttendance(classId, date, students[i].id, 'absent'));
      }
      return Promise.all(promises);
    });
  }

  function getDailySummary(classId, date) {
    return getAttendance(classId, date).then(function (records) {
      var summary = {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        medical: 0,
        holiday: 0,
        total: records.length,
        date: date,
        classId: classId
      };
      for (var i = 0; i < records.length; i++) {
        var s = records[i].status;
        if (summary[s] !== undefined) summary[s]++;
      }
      return summary;
    });
  }

  function addHoliday(date, name, nameAr) {
    nameAr = nameAr || '';
    return DB.add('holidays', {
      date: date,
      name: name,
      nameAr: nameAr,
      createdAt: new Date().toISOString()
    });
  }

  function removeHoliday(id) {
    return DB.delete('holidays', id);
  }

  function getHolidays() {
    return DB.getAll('holidays');
  }

  function importAttendance(data) {
    if (!Array.isArray(data)) {
      return Promise.reject(new Error('Import data must be an array'));
    }
    var validRecords = [];
    for (var i = 0; i < data.length; i++) {
      var record = data[i];
      if (record.classId && record.date && record.studentId && record.status) {
        if (VALID_STATUSES.indexOf(record.status) !== -1) {
          validRecords.push({
            classId: record.classId,
            date: record.date,
            studentId: record.studentId,
            status: record.status,
            note: record.note || '',
            createdAt: record.createdAt || new Date().toISOString(),
            updatedAt: record.updatedAt || new Date().toISOString()
          });
        }
      }
    }
    return DB.bulkAdd('attendance', validRecords);
  }

  return {
    markAttendance: markAttendance,
    getAttendance: getAttendance,
    getAttendanceByDateRange: getAttendanceByDateRange,
    getStudentAttendance: getStudentAttendance,
    getStudentStats: getStudentStats,
    getClassStats: getClassStats,
    getMonthlyStats: getMonthlyStats,
    getYearlyStats: getYearlyStats,
    markAllPresent: markAllPresent,
    markAllAbsent: markAllAbsent,
    getDailySummary: getDailySummary,
    addHoliday: addHoliday,
    removeHoliday: removeHoliday,
    getHolidays: getHolidays,
    importAttendance: importAttendance
  };
})();
