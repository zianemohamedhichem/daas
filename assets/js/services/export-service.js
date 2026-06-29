window.App = window.App || {};

window.App.ExportService = (function () {
  var DB = window.App.DB;
  var I18n = window.App.I18n;
  var Dates = window.App.Dates;
  var AttendanceService = window.App.AttendanceService;

  var TEACHER_NAME_FR = 'Daas Saïda';
  var TEACHER_NAME_AR = 'دعاس سعيدة';
  var SCHOOL_NAME_FR = 'École Omar Hamroune';
  var SCHOOL_NAME_AR = 'مدرسة عمر حمرون';
  var SUBJECT = 'Français';
  var SCHOOL_YEAR = '2026/2027';
  var WILAYA = 'Bouzareah';

  function exportToPDF(title, content, filename) {
    if (typeof window.jspdf === 'undefined') {
      alert('jsPDF library not loaded');
      return;
    }
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title, 105, 20, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(SCHOOL_NAME_FR + ' — ' + WILAYA, 105, 28, { align: 'center' });
    doc.text(TEACHER_NAME_FR + ' — ' + SUBJECT + ' — ' + SCHOOL_YEAR, 105, 34, { align: 'center' });

    doc.setDrawColor(21, 101, 192);
    doc.setLineWidth(0.5);
    doc.line(20, 38, 190, 38);

    var y = 48;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    if (Array.isArray(content)) {
      for (var i = 0; i < content.length; i++) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        var line = content[i];
        if (typeof line === 'object') {
          if (line.bold) doc.setFont('helvetica', 'bold');
          else doc.setFont('helvetica', 'normal');
          if (line.size) doc.setFontSize(line.size);
          doc.text(line.text, line.x || 20, y, { align: line.align || 'left' });
          y += line.height || 7;
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text(String(line), 20, y);
          y += 6;
        }
      }
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      var lines = doc.splitTextToSize(String(content), 170);
      for (var j = 0; j < lines.length; j++) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(lines[j], 20, y);
        y += 5;
      }
    }

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Généré le ' + (Dates ? Dates.formatDate(new Date(), 'dd/mm/yyyy') : new Date().toLocaleDateString('fr-FR')), 105, 290, { align: 'center' });

    doc.save(filename || (title.replace(/\s+/g, '_') + '.pdf'));
  }

  function exportToExcel(data, filename, sheetName) {
    if (typeof XLSX === 'undefined') {
      alert('SheetJS library not loaded');
      return;
    }
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(data);

    var colWidths = [];
    if (data.length > 0) {
      var keys = Object.keys(data[0]);
      for (var i = 0; i < keys.length; i++) {
        var maxLen = keys[i].length;
        for (var j = 0; j < data.length; j++) {
          var val = data[j][keys[i]];
          if (val !== null && val !== undefined) {
            var len = String(val).length;
            if (len > maxLen) maxLen = len;
          }
        }
        colWidths.push({ wch: maxLen + 2 });
      }
      ws['!cols'] = colWidths;
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Données');
    XLSX.writeFile(wb, filename || 'export.xlsx');
  }

  function generateCoverPageHTML(teacherInfo) {
    var info = teacherInfo || {};
    var teacherFR = info.teacherFR || TEACHER_NAME_FR;
    var teacherAR = info.teacherAR || TEACHER_NAME_AR;
    var schoolFR = info.schoolFR || SCHOOL_NAME_FR;
    var schoolAR = info.schoolAR || SCHOOL_NAME_AR;
    var subject = info.subject || SUBJECT;
    var year = info.year || SCHOOL_YEAR;
    var wilaya = info.wilaya || WILAYA;

    return '<div class="cover-page" style="text-align:center;padding:40px 20px;font-family:Georgia,serif;">' +
      '<div style="border:3px double #1565C0;padding:30px;margin:0 auto;max-width:600px;">' +
      '<div style="font-size:14px;margin-bottom:5px;color:#333;">▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</div>' +
      '<div style="font-size:13px;color:#555;margin-bottom:20px;">République Algérienne Démocratique et Populaire</div>' +
      '<div style="font-size:14px;font-weight:bold;color:#1565C0;margin-bottom:5px;">Ministère de l\'Éducation Nationale</div>' +
      '<div style="font-size:12px;color:#666;margin-bottom:25px;">Direction de l\'Éducation — Wilaya de ' + wilaya + '</div>' +
      '<div style="border-top:2px solid #1565C0;border-bottom:2px solid #1565C0;padding:15px 0;margin:20px 0;">' +
      '<div style="font-size:18px;font-weight:bold;color:#1565C0;margin-bottom:10px;">Registre Officiel de Présence</div>' +
      '<div style="font-size:14px;color:#333;">المسجل الرسمي للحضور</div>' +
      '</div>' +
      '<div style="text-align:left;padding:0 30px;margin:20px 0;">' +
      '<div style="margin-bottom:12px;font-size:13px;"><strong>Enseignant(e) :</strong> ' + teacherFR + '</div>' +
      '<div style="margin-bottom:12px;font-size:13px;text-align:right;direction:rtl;"><strong>المعلم(ة) :</strong> ' + teacherAR + '</div>' +
      '<div style="margin-bottom:12px;font-size:13px;"><strong>École :</strong> ' + schoolFR + '</div>' +
      '<div style="margin-bottom:12px;font-size:13px;text-align:right;direction:rtl;"><strong>المدرسة :</strong> ' + schoolAR + '</div>' +
      '<div style="margin-bottom:12px;font-size:13px;"><strong>Matière :</strong> ' + subject + '</div>' +
      '<div style="margin-bottom:12px;font-size:13px;"><strong>Année Scolaire :</strong> ' + year + '</div>' +
      '</div>' +
      '<div style="font-size:11px;color:#999;margin-top:30px;">▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</div>' +
      '</div></div>';
  }

  function printRegister(classId, month, year) {
    var Promise_all = Promise.all;
    return Promise.all([
      DB.get('classes', classId),
      DB.getByIndex('students', 'classId', classId),
      AttendanceService.getMonthlyStats(classId, year, month)
    ]).then(function (results) {
      var cls = results[0];
      var students = results[1];
      var monthlyStats = results[2];

      if (!cls) throw new Error('Class not found');

      students.sort(function (a, b) {
        return (a.lastName || '').localeCompare(b.lastName || '') ||
               (a.firstName || '').localeCompare(b.firstName || '');
      });

      var monthStr = month < 10 ? '0' + month : '' + month;
      var startDate = year + '-' + monthStr + '-01';
      var lastDay = new Date(year, month, 0).getDate();
      var endDate = year + '-' + monthStr + '-' + (lastDay < 10 ? '0' + lastDay : lastDay);

      return AttendanceService.getAttendanceByDateRange(classId, startDate, endDate).then(function (allRecords) {
        var dateMap = {};
        for (var i = 0; i < allRecords.length; i++) {
          var r = allRecords[i];
          var key = r.studentId + '_' + r.date;
          dateMap[key] = r.status;
        }

        var monthName = '';
        if (I18n.getLanguage() === 'ar') {
          var arMonths = ['جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
          monthName = arMonths[month - 1];
        } else {
          var frMonths = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
          monthName = frMonths[month - 1];
        }

        var statusSymbols = {
          present: { symbol: '✓', color: '#2E7D32', bg: '#E8F5E9' },
          absent: { symbol: '✗', color: '#C62828', bg: '#FFEBEE' },
          late: { symbol: 'R', color: '#F57F17', bg: '#FFF8E1' },
          excused: { symbol: 'E', color: '#0277BD', bg: '#E1F5FE' },
          medical: { symbol: 'M', color: '#7B1FA2', bg: '#F3E5F5' },
          holiday: { symbol: 'V', color: '#00897B', bg: '#E0F2F1' }
        };

        var coverHTML = generateCoverPageHTML();

        var tableHeaders = '<tr><th style="width:40px;text-align:center;">N°</th><th style="min-width:140px;">Nom & Prénom</th>';
        for (var d = 1; d <= lastDay; d++) {
          var dd = d < 10 ? '0' + d : '' + d;
          var fullDate = year + '-' + monthStr + '-' + dd;
          var dt = new Date(year, month - 1, d);
          var dayOfWeek = dt.getDay();
          var isWE = (dayOfWeek === 5 || dayOfWeek === 6);
          var headerStyle = isWE ? 'background-color:#FFF3E0;color:#E65100;font-weight:bold;' : '';
          tableHeaders += '<th style="width:32px;text-align:center;' + headerStyle + '">' + d + '</th>';
        }
        tableHeaders += '<th style="width:40px;text-align:center;background:#E3F2FD;font-weight:bold;">Tot</th>';
        tableHeaders += '<th style="width:40px;text-align:center;background:#E3F2FD;font-weight:bold;">%</th>';
        tableHeaders += '</tr>';

        var tableRows = '';
        for (var s = 0; s < students.length; s++) {
          var student = students[s];
          var row = '<tr><td style="text-align:center;">' + (s + 1) + '</td>';
          row += '<td style="font-weight:500;">' + (student.lastName || '') + ' ' + (student.firstName || '') + '</td>';
          var studentPresent = 0;
          var studentTotal = 0;
          for (var dd2 = 1; dd2 <= lastDay; dd2++) {
            var ddd = dd2 < 10 ? '0' + dd2 : '' + dd2;
            var fullDate2 = year + '-' + monthStr + '-' + ddd;
            var dt2 = new Date(year, month - 1, dd2);
            var dow = dt2.getDay();
            var isWE2 = (dow === 5 || dow === 6);
            var key2 = student.id + '_' + fullDate2;
            var status = dateMap[key2];
            var cellStyle = isWE2 ? 'background-color:#FFF8E1;' : '';
            if (status && statusSymbols[status]) {
              var sym = statusSymbols[status];
              row += '<td style="text-align:center;color:' + sym.color + ';background:' + sym.bg + ';font-weight:bold;font-size:11px;' + cellStyle + '">' + sym.symbol + '</td>';
              if (status === 'present' || status === 'late') studentPresent++;
              if (status !== 'holiday') studentTotal++;
            } else {
              row += '<td style="text-align:center;' + cellStyle + '"></td>';
            }
          }
          var pct = studentTotal > 0 ? Math.round((studentPresent / studentTotal) * 100) : 0;
          row += '<td style="text-align:center;font-weight:bold;background:#E3F2FD;">' + studentPresent + '/' + studentTotal + '</td>';
          row += '<td style="text-align:center;font-weight:bold;background:#E3F2FD;color:' + (pct >= 75 ? '#2E7D32' : pct >= 50 ? '#F57F17' : '#C62828') + ';">' + pct + '%</td>';
          row += '</tr>';
          tableRows += row;
        }

        var totalsRow = '<tr style="background:#E3F2FD;font-weight:bold;"><td></td><td>Total</td>';
        for (var dd3 = 1; dd3 <= lastDay; dd3++) {
          var ddd3 = dd3 < 10 ? '0' + dd3 : '' + dd3;
          var fullDate3 = year + '-' + monthStr + '-' + ddd3;
          var dayCount = 0;
          for (var si = 0; si < students.length; si++) {
            var k = students[si].id + '_' + fullDate3;
            if (dateMap[k] && dateMap[k] !== 'holiday') dayCount++;
          }
          totalsRow += '<td style="text-align:center;font-size:9px;">' + dayCount + '</td>';
        }
        totalsRow += '<td></td><td></td></tr>';

        var registerHTML = '<div class="register-table" style="margin-top:30px;">' +
          '<h2 style="text-align:center;font-size:16px;color:#1565C0;margin-bottom:5px;">' +
          cls.name + ' — ' + monthName + ' ' + year + '</h2>' +
          '<div style="text-align:center;font-size:12px;color:#666;margin-bottom:15px;">' +
          'Légende: ✓ Présent | ✗ Absent | R Retard | E Excusé | M Médical</div>' +
          '<table style="width:100%;border-collapse:collapse;font-size:10px;">' +
          '<thead style="background:#1565C0;color:#fff;">' + tableHeaders + '</thead>' +
          '<tbody>' + tableRows + totalsRow + '</tbody>' +
          '</table></div>';

        var summaryHTML = '<div class="summary-section" style="margin-top:25px;page-break-before:always;">' +
          '<h3 style="text-align:center;color:#1565C0;margin-bottom:15px;">Récapitulatif des Présences</h3>' +
          '<table style="width:100%;border-collapse:collapse;font-size:11px;">' +
          '<thead style="background:#E3F2FD;"><tr>' +
          '<th style="text-align:left;padding:8px;">N°</th>' +
          '<th style="text-align:left;padding:8px;">Nom & Prénom</th>' +
          '<th style="text-align:center;padding:8px;">Présents</th>' +
          '<th style="text-align:center;padding:8px;">Absents</th>' +
          '<th style="text-align:center;padding:8px;">Retards</th>' +
          '<th style="text-align:center;padding:8px;">Excusés</th>' +
          '<th style="text-align:center;padding:8px;">Total Jours</th>' +
          '<th style="text-align:center;padding:8px;">%</th>' +
          '</tr></thead><tbody>';

        for (var ss = 0; ss < students.length; ss++) {
          var stu = students[ss];
          var sp = 0, sa = 0, sl = 0, se = 0, st2 = 0;
          for (var d4 = 1; d4 <= lastDay; d4++) {
            var dd4 = d4 < 10 ? '0' + d4 : '' + d4;
            var fd = year + '-' + monthStr + '-' + dd4;
            var ks = stu.id + '_' + fd;
            var sts = dateMap[ks];
            if (sts === 'present') sp++;
            else if (sts === 'absent') sa++;
            else if (sts === 'late') sl++;
            else if (sts === 'excused') se++;
            if (sts && sts !== 'holiday') st2++;
          }
          var pct2 = st2 > 0 ? Math.round(((sp + sl) / st2) * 100) : 0;
          var pctColor = pct2 >= 75 ? '#2E7D32' : pct2 >= 50 ? '#F57F17' : '#C62828';
          summaryHTML += '<tr style="border-bottom:1px solid #e0e0e0;">' +
            '<td style="padding:8px;">' + (ss + 1) + '</td>' +
            '<td style="padding:8px;font-weight:500;">' + (stu.lastName || '') + ' ' + (stu.firstName || '') + '</td>' +
            '<td style="text-align:center;padding:8px;color:#2E7D32;font-weight:bold;">' + sp + '</td>' +
            '<td style="text-align:center;padding:8px;color:#C62828;font-weight:bold;">' + sa + '</td>' +
            '<td style="text-align:center;padding:8px;color:#F57F17;font-weight:bold;">' + sl + '</td>' +
            '<td style="text-align:center;padding:8px;color:#0277BD;font-weight:bold;">' + se + '</td>' +
            '<td style="text-align:center;padding:8px;font-weight:bold;">' + st2 + '</td>' +
            '<td style="text-align:center;padding:8px;font-weight:bold;color:' + pctColor + ';">' + pct2 + '%</td>' +
            '</tr>';
        }
        summaryHTML += '</tbody></table></div>';

        var printWindow = window.open('', '_blank');
        printWindow.document.write(
          '<!DOCTYPE html><html><head><title>Registre — ' + cls.name + ' — ' + monthName + ' ' + year + '</title>' +
          '<style>' +
          '@media print { body { margin: 0; } .cover-page { page-break-after: always; } .register-table { page-break-after: always; } }' +
          'body { font-family: Georgia, "Times New Roman", serif; color: #333; margin: 0; padding: 20px; }' +
          'table { border: 1px solid #ddd; } th, td { border: 1px solid #ddd; padding: 4px; }' +
          'th { background: #1565C0; color: #fff; font-size: 9px; }' +
          '@page { margin: 10mm; size: landscape; }' +
          '</style></head><body>' +
          coverHTML + registerHTML + summaryHTML +
          '</body></html>'
        );
        printWindow.document.close();
        setTimeout(function () {
          printWindow.print();
        }, 500);
      });
    });
  }

  function exportClassToPDF(classId) {
    return Promise.all([
      DB.get('classes', classId),
      DB.getByIndex('students', 'classId', classId)
    ]).then(function (results) {
      var cls = results[0];
      var students = results[1];
      if (!cls) throw new Error('Class not found');

      students.sort(function (a, b) {
        return (a.lastName || '').localeCompare(b.lastName || '') ||
               (a.firstName || '').localeCompare(b.firstName || '');
      });

      var content = [];
      content.push({ text: 'Liste des Élèves — ' + cls.name, bold: true, size: 14, align: 'center', height: 12 });
      content.push({ text: '', height: 8 });

      for (var i = 0; i < students.length; i++) {
        var stu = students[i];
        content.push(
          (i + 1) + '. ' + (stu.lastName || '') + ' ' + (stu.firstName || '') +
          ' — ' + (stu.gender === 'male' ? 'M' : 'F') +
          (stu.parentPhone ? ' — Tél: ' + stu.parentPhone : '')
        );
      }

      content.push({ text: '', height: 8 });
      content.push({ text: 'Total: ' + students.length + ' élève(s)', bold: true });

      exportToPDF('Liste des Élèves — ' + cls.name, content, 'eleves_' + cls.name.replace(/\s+/g, '_') + '.pdf');
    });
  }

  function exportStatisticsToPDF(classId, year) {
    return Promise.all([
      DB.get('classes', classId),
      AttendanceService.getYearlyStats(classId, year)
    ]).then(function (results) {
      var cls = results[0];
      var stats = results[1];
      if (!cls) throw new Error('Class not found');

      var content = [];
      content.push({ text: 'Statistiques Annuelles — ' + cls.name + ' — ' + year, bold: true, size: 14, align: 'center', height: 12 });
      content.push({ text: '', height: 8 });
      content.push({ text: 'Résumé Général:', bold: true, size: 12, height: 10 });
      content.push('Présents: ' + stats.totals.present + ' (' + stats.percentages.present + '%)');
      content.push('Absents: ' + stats.totals.absent + ' (' + stats.percentages.absent + '%)');
      content.push('Retards: ' + stats.totals.late + ' (' + stats.percentages.late + '%)');
      content.push('Excusés: ' + stats.totals.excused + ' (' + stats.percentages.excused + '%)');
      content.push('Médical: ' + stats.totals.medical + ' (' + stats.percentages.medical + '%)');
      content.push({ text: '', height: 6 });

      content.push({ text: 'Détail Mensuel:', bold: true, size: 12, height: 10 });
      var frMonths = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
      for (var i = 0; i < stats.months.length; i++) {
        var m = stats.months[i];
        if (m.stats.totals.present + m.stats.totals.absent + m.stats.totals.late > 0) {
          var total = m.stats.totals.present + m.stats.totals.absent + m.stats.totals.late + m.stats.totals.excused + m.stats.totals.medical;
          content.push(frMonths[m.month - 1] + ': ' + m.stats.totals.present + 'P / ' + m.stats.totals.absent + 'A / ' + m.stats.totals.late + 'R / Total: ' + total);
        }
      }

      exportToPDF('Statistiques — ' + cls.name + ' — ' + year, content, 'stats_' + cls.name.replace(/\s+/g, '_') + '_' + year + '.pdf');
    });
  }

  return {
    exportToPDF: exportToPDF,
    exportToExcel: exportToExcel,
    printRegister: printRegister,
    exportClassToPDF: exportClassToPDF,
    exportStatisticsToPDF: exportStatisticsToPDF,
    generateCoverPageHTML: generateCoverPageHTML
  };
})();
