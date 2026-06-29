# 📋 Registre d'Appel Numérique

**Digital Attendance Register for Algerian Primary Schools**

> Registre d'appel numérique pour les écoles primaires algériennes

---

## 📸 Screenshots

| Dashboard | Attendance | Register |
|-----------|-----------|----------|
| ![Dashboard](screenshots/dashboard.png) | ![Attendance](screenshots/attendance.png) | ![Register](screenshots/register.png) |

---

## ✨ Fonctionnalités / Features

### 🎓 Gestion des Classes et Élèves
- Créer, modifier et supprimer des classes (CP, CE1, CE2, CM1, CM2)
- Inscrire les élèves avec informations complètes (nom, prénom, genre, date de naissance, contact parent)
- Organisation par niveau et section

### 📊 Présences
- Marquer les présences jour par jour : **Présent**, **Absent**, **Retard**, **Excusé**, **Médical**, **Vacance**
- Marquer tous les élèves présents ou absents en un clic
- Notes et commentaires par élève
- Prise en charge des jours fériés

### 📒 Registre Officiel
- Registre mensuel avec vue complète (jours en colonnes, élèves en lignes)
- Page de couverture officielle (République Algérienne, Ministère, Wilaya)
- Code couleur : ✓ Présent, ✗ Absent, R Retard, E Excusé, M Médical
- Colonnes de week-end mises en évidence
- Statistiques par élève avec pourcentages

### 📈 Statistiques
- Statistiques mensuelles et annuelles
- Graphiques interactifs (Chart.js)
- Taux de présence par classe et par élève
- Évolution dans le temps

### 🌍 Bilingue (Français / Arabe)
- Interface complète en français et en arabe
- Support RTL (droite à gauche) pour l'arabe
- Basculement instantané entre les langues

### 🌙 Mode Sombre
- Thème clair et sombre
- Basculement automatique selon les préférences système

### 📤 Export et Impression
- Export PDF avec mise en page professionnelle
- Export Excel (fichiers .xlsx)
- Impression directe du registre
- Export des listes d'élèves
- Export des statistiques

### 🔔 Notifications
- Notifications d'absences quotidiennes
- Badge de notifications non lues
- Alertes en temps réel

### ⌨️ Raccourcis Clavier
| Raccourci | Action |
|-----------|--------|
| `Ctrl+K` | Recherche globale |
| `Ctrl+D` | Retour au tableau de bord |
| `Échap` | Fermer la modale |

### 📱 Progressive Web App (PWA)
- Installation sur appareil mobile et bureau
- Fonctionnement hors ligne (Service Worker)
- Icône et écran de démarrage personnalisés
- Mise en cache automatique des ressources

---

## 🛠️ Stack Technique

| Technologie | Usage |
|-------------|-------|
| **HTML5 / CSS3** | Structure et styles |
| **Vanilla JavaScript** | Logique applicative (IIFE pattern) |
| **Bootstrap 5.3** | Composants UI réactifs |
| **Bootstrap Icons** | Icônes |
| **Chart.js 4.4** | Graphiques |
| **SheetJS (xlsx)** | Export Excel |
| **jsPDF 2.5** | Export PDF |
| **IndexedDB** | Base de données locale |
| **Service Worker** | Cache et mode hors ligne |

---

## 🚀 Installation

### Utilisation directe

```bash
# Cloner le dépôt
git clone https://github.com/username/saida.git

# Ouvrir dans le navigateur
# Simple double-clic sur index.html
```

### Serveur local (recommandé pour le PWA)

```bash
# Avec Python
python3 -m http.server 8000

# Avec Node.js
npx serve .

# Avec PHP
php -S localhost:8000
```

Puis ouvrir `http://localhost:8000` dans le navigateur.

---

## 📱 Installation PWA

1. Ouvrir l'application dans le navigateur
2. Cliquer sur **"Installer l'application"** dans les paramètres
3. Ou utiliser le bouton d'installation du navigateur (icône dans la barre d'adresse)
4. L'application apparaîtra sur l'écran d'accueil

---

## 📖 Guide d'Utilisation

### Première utilisation
1. L'application démarre avec des **données de démonstration** (2 classes, 10 élèves chacune)
2. Naviguez avec le **menu latéral** pour accéder aux différentes sections
3. Commencez par créer vos propres classes et élèves

### Marquer les présences
1. Aller dans **Présences**
2. Sélectionner la classe et la date
3. Marquer chaque élève (clic sur le bouton correspondant)
4. Cliquer **Enregistrer**

### Imprimer le registre
1. Aller dans **Registre**
2. Sélectionner la classe, le mois et l'année
3. Cliquer **Imprimer** ou **Exporter PDF**

### Consulter les statistiques
1. Aller dans **Statistiques**
2. Sélectionner la classe et la période
3. Visualiser les graphiques et tableaux

---

## ⚙️ Raccourcis Clavier

| Action | Raccourci |
|--------|-----------|
| Rechercher | `Ctrl + K` |
| Tableau de bord | `Ctrl + D` |
| Fermer modale | `Échap` |

---

## 📤 Fonctionnalités d'Export

### PDF
- Registre mensuel complet avec page de couverture
- Liste des élèves par classe
- Rapport de statistiques annuelles

### Excel
- Export de n'importe quel tableau de données
- Largeurs de colonnes automatiques

### Impression
- Registre optimisé pour l'impression paysage
- Mise en page officielle

---

## 📴 Mode Hors Ligne

L'application fonctionne entièrement hors ligne grâce au Service Worker :
- Toutes les données sont stockées localement (IndexedDB)
- Les ressources statiques sont mises en cache
- Les notifications fonctionnent en local
- Synchronisation automatique lors du retour en ligne

---

## 🌐 Navigateurs Supportés

| Navigateur | Version Minimum |
|-----------|----------------|
| Chrome | 80+ |
| Firefox | 78+ |
| Safari | 14+ |
| Edge | 80+ |
| Opera | 67+ |

> ⚠️ Internet Explorer n'est pas supporté.

---

## 📂 Structure du Projet

```
saida/
├── index.html                    # Point d'entrée principal
├── manifest.json                 # Manifest PWA
├── service-worker.js             # Service Worker (cache + hors ligne)
├── generate-icons.html           # Générateur d'icônes PNG
├── assets/
│   ├── css/
│   │   ├── variables.css         # Variables CSS et thème sombre
│   │   ├── main.css              # Styles de base et utilitaires
│   │   ├── components.css        # Styles des composants
│   │   ├── layout.css            # Mise en page sidebar/navbar
│   │   ├── pages.css             # Styles spécifiques aux pages
│   │   ├── dark.css              # Thème sombre
│   │   ├── responsive.css        # Styles responsives
│   │   └── print.css             # Styles d'impression
│   ├── icons/
│   │   ├── icon.svg              # Icône SVG
│   │   ├── icon-192.png          # Icône 192x192
│   │   └── icon-512.png          # Icône 512x512
│   └── js/
│       ├── db.js                 # Service IndexedDB
│       ├── i18n.js               # Internationalisation (FR/AR)
│       ├── ui.js                 # Composants UI réutilisables
│       ├── app.js                # Contrôleur principal + routeur
│       ├── utils/
│       │   ├── helpers.js        # Fonctions utilitaires
│       │   └── dates.js          # Gestion des dates
│       ├── services/
│       │   ├── attendance-service.js    # Logique des présences
│       │   ├── export-service.js        # Export PDF/Excel/Print
│       │   └── notification-service.js  # Notifications
│       └── pages/
│           ├── dashboard.js      # Tableau de bord
│           ├── classes.js        # Gestion des classes
│           ├── students.js       # Gestion des élèves
│           ├── attendance.js     # Marquage des présences
│           ├── register.js       # Registre officiel
│           ├── statistics.js     # Statistiques et graphiques
│           └── settings.js       # Paramètres
```

---

## 👩‍🏫 Enseignante

**Daas Saïda / دعاس سعيدة**

- **École** : École Omar Hamroune / مدرسة عمر حمرون
- **Matière** : Français
- **Wilaya** : Bouzareah
- **Année scolaire** : 2026/2027

---

## 📄 Licence

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Daas Saïda

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Remerciements

- [Bootstrap](https://getbootstrap.com/) — Framework CSS
- [Chart.js](https://www.chartjs.org/) — Graphiques
- [SheetJS](https://sheetjs.com/) — Export Excel
- [jsPDF](https://jspdf.com/) — Export PDF
- [Bootstrap Icons](https://icons.getbootstrap.com/) — Icônes
