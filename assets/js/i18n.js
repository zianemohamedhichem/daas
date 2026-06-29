window.App = window.App || {};

window.App.I18n = (function () {
  var currentLanguage = 'fr';

  var translations = {
    fr: {
      nav: {
        dashboard: 'Tableau de bord',
        classes: 'Classes',
        students: 'Élèves',
        attendance: 'Présences',
        register: 'Registre',
        statistics: 'Statistiques',
        settings: 'Paramètres',
        profile: 'Profil',
        about: 'À Propos'
      },
      dashboard: {
        title: 'Tableau de bord',
        totalStudents: 'Total Élèves',
        totalClasses: 'Total Classes',
        todayAttendance: 'Présence Aujourd\'hui',
        absentToday: 'Absents Aujourd\'hui',
        welcomeBack: 'Bienvenue',
        recentActivity: 'Activité Récente',
        quickActions: 'Actions Rapides',
        monthlyChart: 'Graphique Mensuel',
        attendanceOverview: 'Aperçu des Présences'
      },
      classes: {
        title: 'Classes',
        addClass: 'Ajouter Classe',
        editClass: 'Modifier Classe',
        deleteClass: 'Supprimer Classe',
        className: 'Nom de la Classe',
        section: 'Section',
        level: 'Niveau',
        students: 'Élèves',
        noClasses: 'Aucune classe trouvée',
        confirmDelete: 'Voulez-vous vraiment supprimer cette classe ?',
        classDetails: 'Détails de la Classe'
      },
      students: {
        title: 'Élèves',
        addStudent: 'Ajouter Élève',
        editStudent: 'Modifier Élève',
        deleteStudent: 'Supprimer Élève',
        firstName: 'Prénom',
        lastName: 'Nom',
        gender: 'Genre',
        male: 'Masculin',
        female: 'Féminin',
        parentName: 'Nom du Parent',
        parentPhone: 'Téléphone du Parent',
        dateOfBirth: 'Date de Naissance',
        noStudents: 'Aucun élève trouvé',
        search: 'Rechercher un élève...',
        confirmDelete: 'Voulez-vous vraiment supprimer cet élève ?',
        totalStudents: 'Total Élèves'
      },
      attendance: {
        title: 'Présences',
        todayDate: 'Date du Jour',
        selectClass: 'Sélectionner une Classe',
        markPresent: 'Marquer Présent',
        markAbsent: 'Marquer Absent',
        markLate: 'Marquer Retard',
        markExcused: 'Marquer Excusé',
        markMedical: 'Marquer Médical',
        markHoliday: 'Marquer Vacance',
        save: 'Enregistrer',
        saved: 'Enregistré !',
        present: 'Présent',
        absent: 'Absent',
        late: 'Retard',
        excused: 'Excusé',
        medical: 'Médical',
        holiday: 'Vacance',
        attendanceFor: 'Présences pour',
        summary: 'Résumé',
        presentCount: 'Présents',
        absentCount: 'Absents',
        lateCount: 'Retards'
      },
      register: {
        title: 'Registre Officiel',
        printRegister: 'Imprimer le Registre',
        exportPDF: 'Exporter PDF',
        exportExcel: 'Exporter Excel',
        coverPage: 'Page de Couverture',
        republicOfAlgeria: 'République Algérienne Démocratique et Populaire',
        ministryOfEducation: 'Ministère de l\'Éducation Nationale',
        teacher: 'Enseignant',
        school: 'École',
        subject: 'Matière',
        schoolYear: 'Année Scolaire',
        monthlyView: 'Vue Mensuelle',
        attendancePercentage: 'Pourcentage de Présence',
        absencePercentage: 'Pourcentage d\'Absence',
        officialRegister: 'Registre Officiel de Présence'
      },
      statistics: {
        title: 'Statistiques',
        monthly: 'Mensuel',
        yearly: 'Annuel',
        attendanceRate: 'Taux de Présence',
        absenceRate: 'Taux d\'Absence',
        byStatus: 'Par Statut',
        byMonth: 'Par Mois',
        chartTitle: 'Graphique des Présences',
        noData: 'Aucune donnée disponible'
      },
      settings: {
        title: 'Paramètres',
        theme: 'Thème',
        language: 'Langue',
        weekendColor: 'Couleur du Week-end',
        autosave: 'Sauvegarde Automatique',
        offlineMode: 'Mode Hors Ligne',
        installApp: 'Installer l\'Application',
        resetData: 'Réinitialiser les Données',
        exportData: 'Exporter les Données',
        importData: 'Importer les Données',
        about: 'À Propos',
        version: 'Version'
      },
      common: {
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        add: 'Ajouter',
        search: 'Rechercher',
        filter: 'Filtrer',
        export: 'Exporter',
        print: 'Imprimer',
        close: 'Fermer',
        confirm: 'Confirmer',
        loading: 'Chargement...',
        noData: 'Aucune donnée',
        success: 'Succès',
        error: 'Erreur',
        warning: 'Attention',
        info: 'Information',
        yes: 'Oui',
        no: 'Non',
        actions: 'Actions',
        back: 'Retour'
      },
      months: {
        january: 'Janvier',
        february: 'Février',
        march: 'Mars',
        april: 'Avril',
        may: 'Mai',
        june: 'Juin',
        july: 'Juillet',
        august: 'Août',
        september: 'Septembre',
        october: 'Octobre',
        november: 'Novembre',
        december: 'Décembre'
      },
      days: {
        sunday: 'Dimanche',
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi'
      },
      offline: {
        banner: 'Mode hors ligne — toutes les données sont sauvegardées localement'
      },
      sync: {
        saving: 'Sauvegarde...'
      }
    },
    ar: {
      nav: {
        dashboard: 'لوحة التحكم',
        classes: 'الأقسام',
        students: 'التلاميذ',
        attendance: 'الحضور',
        register: 'السجل',
        statistics: 'الإحصائيات',
        settings: 'الإعدادات',
        profile: 'الملف الشخصي',
        about: 'حول التطبيق'
      },
      dashboard: {
        title: 'لوحة التحكم',
        totalStudents: 'إجمالي التلاميذ',
        totalClasses: 'إجمالي الأقسام',
        todayAttendance: 'الحضور اليوم',
        absentToday: 'الغائبين اليوم',
        welcomeBack: 'مرحبا بعودتك',
        recentActivity: 'النشاط الأخير',
        quickActions: 'إجراءات سريعة',
        monthlyChart: 'الرسم البياني الشهري',
        attendanceOverview: 'نظرة عامة على الحضور'
      },
      classes: {
        title: 'الأقسام',
        addClass: 'إضافة قسم',
        editClass: 'تعديل القسم',
        deleteClass: 'حذف القسم',
        className: 'اسم القسم',
        section: 'الشعبة',
        level: 'المستوى',
        students: 'التلاميذ',
        noClasses: 'لم يتم العثور على أقسام',
        confirmDelete: 'هل تريد حقاً حذف هذا القسم؟',
        classDetails: 'تفاصيل القسم'
      },
      students: {
        title: 'التلاميذ',
        addStudent: 'إضافة تلميذ',
        editStudent: 'تعديل التلميذ',
        deleteStudent: 'حذف التلميذ',
        firstName: 'الاسم',
        lastName: 'اللقب',
        gender: 'الجنس',
        male: 'ذكر',
        female: 'أنثى',
        parentName: 'اسم الوالد',
        parentPhone: 'هاتف الوالد',
        dateOfBirth: 'تاريخ الميلاد',
        noStudents: 'لم يتم العثور على تلاميذ',
        search: 'بحث عن تلميذ...',
        confirmDelete: 'هل تريد حقاً حذف هذا التلميذ؟',
        totalStudents: 'إجمالي التلاميذ'
      },
      attendance: {
        title: 'الحضور',
        todayDate: 'تاريخ اليوم',
        selectClass: 'اختر قسماً',
        markPresent: 'تحديد حاضر',
        markAbsent: 'تحديد غائب',
        markLate: 'تحديد متأخر',
        markExcused: 'تحديد معذور',
        markMedical: 'تحديد مريض',
        markHoliday: 'تحديد عطلة',
        save: 'حفظ',
        saved: 'تم الحفظ!',
        present: 'حاضر',
        absent: 'غائب',
        late: 'متأخر',
        excused: 'معذور',
        medical: 'مريض',
        holiday: 'عطلة',
        attendanceFor: 'حضور لـ',
        summary: 'ملخص',
        presentCount: 'الحاضرون',
        absentCount: 'الغائبون',
        lateCount: 'المتأخرون'
      },
      register: {
        title: 'السجل الرسمي',
        printRegister: 'طباعة السجل',
        exportPDF: 'تصدير PDF',
        exportExcel: 'تصدير Excel',
        coverPage: 'صفحة الغلاف',
        republicOfAlgeria: 'الجمهورية الجزائرية الديمقراطية الشعبية',
        ministryOfEducation: 'وزارة التربية الوطنية',
        teacher: 'المعلم',
        school: 'المدرسة',
        subject: 'المادة',
        schoolYear: 'السنة الدراسية',
        monthlyView: 'عرض شهري',
        attendancePercentage: 'نسبة الحضور',
        absencePercentage: 'نسبة الغياب',
        officialRegister: 'سجل الحضور الرسمي'
      },
      statistics: {
        title: 'الإحصائيات',
        monthly: 'شهري',
        yearly: 'سنوي',
        attendanceRate: 'نسبة الحضور',
        absenceRate: 'نسبة الغياب',
        byStatus: 'حسب الحالة',
        byMonth: 'حسب الشهر',
        chartTitle: 'الرسم البياني للحضور',
        noData: 'لا تتوفر بيانات'
      },
      settings: {
        title: 'الإعدادات',
        theme: 'المظهر',
        language: 'اللغة',
        weekendColor: 'لون عطلة نهاية الأسبوع',
        autosave: 'الحفظ التلقائي',
        offlineMode: 'وضع عدم الاتصال',
        installApp: 'تثبيت التطبيق',
        resetData: 'إعادة تعيين البيانات',
        exportData: 'تصدير البيانات',
        importData: 'استيراد البيانات',
        about: 'حول',
        version: 'الإصدار'
      },
      common: {
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        edit: 'تعديل',
        add: 'إضافة',
        search: 'بحث',
        filter: 'تصفية',
        export: 'تصدير',
        print: 'طباعة',
        close: 'إغلاق',
        confirm: 'تأكيد',
        loading: 'جاري التحميل...',
        noData: 'لا توجد بيانات',
        success: 'نجاح',
        error: 'خطأ',
        warning: 'تحذير',
        info: 'معلومات',
        yes: 'نعم',
        no: 'لا',
        actions: 'إجراءات',
        back: 'رجوع'
      },
      months: {
        january: 'جانفي',
        february: 'فيفري',
        march: 'مارس',
        april: 'أفريل',
        may: 'ماي',
        june: 'جوان',
        july: 'جويلية',
        august: 'أوت',
        september: 'سبتمبر',
        october: 'أكتوبر',
        november: 'نوفمبر',
        december: 'ديسمبر'
      },
      days: {
        sunday: 'الأحد',
        monday: 'الاثنين',
        tuesday: 'الثلاثاء',
        wednesday: 'الأربعاء',
        thursday: 'الخميس',
        friday: 'الجمعة',
        saturday: 'السبت'
      },
      offline: {
        banner: 'وضع عدم الاتصال — جميع البيانات محفوظة محلياً'
      },
      sync: {
        saving: 'جاري الحفظ...'
      }
    }
  };

  function t(key) {
    var keys = key.split('.');
    var result = translations[currentLanguage];
    for (var i = 0; i < keys.length; i++) {
      if (result && result[keys[i]] !== undefined) {
        result = result[keys[i]];
      } else {
        return key;
      }
    }
    return result;
  }

  function setLanguage(lang) {
    if (lang !== 'fr' && lang !== 'ar') return;
    currentLanguage = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    applyTranslations();
    if (window.App.DB) {
      window.App.DB.put('settings', { key: 'language', value: lang }).catch(function () {});
    }
  }

  function getLanguage() {
    return currentLanguage;
  }

  function isRTL() {
    return currentLanguage === 'ar';
  }

  function applyTranslations() {
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      var translated = t(key);
      if (translated !== key) {
        el.textContent = translated;
      }
    }

    var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < placeholders.length; j++) {
      var ph = placeholders[j];
      var phKey = ph.getAttribute('data-i18n-placeholder');
      var phTranslated = t(phKey);
      if (phTranslated !== phKey) {
        ph.placeholder = phTranslated;
      }
    }

    var titles = document.querySelectorAll('[data-i18n-title]');
    for (var k = 0; k < titles.length; k++) {
      var tl = titles[k];
      var tlKey = tl.getAttribute('data-i18n-title');
      var tlTranslated = t(tlKey);
      if (tlTranslated !== tlKey) {
        tl.title = tlTranslated;
      }
    }
  }

  function init() {
    if (window.App.DB) {
      return window.App.DB.get('settings', 'language').then(function (result) {
        if (result && result.value) {
          currentLanguage = result.value;
        }
        document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLanguage;
        applyTranslations();
      }).catch(function () {
        applyTranslations();
      });
    }
    applyTranslations();
    return Promise.resolve();
  }

  return {
    init: init,
    t: t,
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    isRTL: isRTL,
    applyTranslations: applyTranslations
  };
})();
