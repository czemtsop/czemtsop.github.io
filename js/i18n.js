/* ---------------------------------------------- *
 * Site translations (English / French)
 *
 * Every element with data-i18n="key" gets its text from here.
 * To add a string: tag the element in index.html, then add the
 * same key to both "en" and "fr" below.
 * ---------------------------------------------- */

const I18N = {
    en: {
        "page.title": "Zemtsop N. C. - Business Intelligence Analyst",
        "lang.toggle": "FR",
        "lang.toggleLabel": "Afficher le site en français",

        "nav.journey": "Journey",
        "nav.skills": "Skills",
        "nav.projects": "Projects",

        "about.title": "About me",
        "about.role": "Business Intelligence Analyst",

        "hero.1.title": "Welcome! I tell data stories ...",
        "hero.1.text": ". . . translating raw data to actionable intelligence.",
        "hero.2.title": "Listening to data ...",
        "hero.2.text": ". . . is an art and a science.",
        "carousel.previous": "Previous",
        "carousel.next": "Next",

        "journey.title": "My Journey",
        "skills.title": "Tech & Skills",
        "skills.statistics": "Statistics",

        "projects.title": "Projects",
        "filter.all": "All",
        "project.marketing.title": "Marketing Analytics",
        "project.marketing.caption": "Project from Data with Danny",
        "project.people.title": "People Analytics",
        "project.jobs.title": "Data jobs",

        "timeline.present": "Present",
        "timeline.skills": "Skills Developed: ",
        "timeline.highlights": "Highlights"
    },
    fr: {
        "page.title": "Zemtsop N. C. - Analyste en intelligence d'affaires",
        "lang.toggle": "EN",
        "lang.toggleLabel": "View the site in English",

        "nav.journey": "Parcours",
        "nav.skills": "Compétences",
        "nav.projects": "Projets",

        "about.title": "À propos",
        "about.role": "Analyste en intelligence d'affaires",

        "hero.1.title": "Bienvenue! Je raconte des histoires avec les données ...",
        "hero.1.text": ". . . en transformant des données brutes en renseignements exploitables.",
        "hero.2.title": "Écouter les données ...",
        "hero.2.text": ". . . est un art et une science.",
        "carousel.previous": "Précédent",
        "carousel.next": "Suivant",

        "journey.title": "Mon parcours",
        "skills.title": "Outils et compétences",
        "skills.statistics": "Statistique",

        "projects.title": "Projets",
        "filter.all": "Tous",
        "project.marketing.title": "Analytique marketing",
        "project.marketing.caption": "Projet de Data with Danny",
        "project.people.title": "Analytique RH",
        "project.jobs.title": "Emplois en données",

        "timeline.present": "aujourd'hui",
        "timeline.skills": "Compétences acquises : ",
        "timeline.highlights": "Faits saillants"
    }
};

/* Month names for the timeline tooltips. Dates in career.json stay in
 * English ("June 2025") because script.js parses them with "%B %Y". */
const DATE_LOCALES = {
    en: d3.timeFormatLocale({
        dateTime: "%x, %X", date: "%-m/%-d/%Y", time: "%-I:%M:%S %p", periods: ["AM", "PM"],
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }),
    fr: d3.timeFormatLocale({
        dateTime: "%A %e %B %Y à %X", date: "%Y-%m-%d", time: "%H:%M:%S", periods: ["", ""],
        days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
        shortDays: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
        months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
        shortMonths: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
    })
};

function t(key, lang) {
    return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}
