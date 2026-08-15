/* ============================================================
   ASEM DIGITAL SOLUTIONS
   app.js
   ============================================================ */

"use strict";

/* ============================================================
   CONFIGURATION
   ============================================================ */

const ASEM_CONFIG = {
    storage: {
        theme: "asem-theme",
        language: "asem-language"
    },

    defaultLanguage: "en",

    supportedLanguages: [
        "auto",
        "ar",
        "en",
        "fr",
        "de",
        "it",
        "es",
        "nl"
    ],

    animationDuration: 300,

    searchMinCharacters: 1
};


/* ============================================================
   TRANSLATIONS
   ============================================================ */

const translations = {

    en: {
        platform: "Global Platform",
        services: "Services",
        projects: "Projects",
        portfolio: "Portfolio",
        about: "About",
        contact: "Contact",

        hero_title: "ASEM Digital Solutions",
        hero_desc: "Free digital projects and custom software solutions for individuals and companies worldwide.",
        start_project: "Start Your Free Project",

        global_platform: "ASEM Global Platform 🌏",
        global_platform_desc:
            "Explore tourism destinations, global businesses, products and digital services through one unified platform.",

        tourism: "Tourism",
        tourism_desc:
            "Discover destinations, attractions and experiences around the world.",

        businesses: "Global Businesses",
        businesses_desc:
            "Explore businesses, restaurants, services and organizations worldwide.",

        products: "Global Products",
        products_desc:
            "Discover products and offerings from businesses around the world.",

        projects_desc:
            "Explore ASEM digital projects and software solutions.",

        portfolio_desc:
            "A selection of our global digital solutions.",

        services_desc:
            "Explore web development, AI, automation and cloud services.",

        contact_desc:
            "Contact ASEM Digital Solutions.",

        global_search: "Global Search",
        global_search_desc:
            "Search across the ASEM platform.",

        web_dev: "Web Development",
        web_dev_desc:
            "Modern, fast, secure websites and digital platforms.",

        ai_auto: "AI & Automation",
        ai_auto_desc:
            "Smart solutions powered by modern artificial intelligence and automation.",

        cloud: "Cloud Solutions",
        cloud_desc:
            "Scalable and reliable cloud infrastructure for modern organizations.",

        why_asem: "Why Choose ASEM",
        secure: "Enterprise-grade security",
        modern_tech: "Modern technologies",
        full_solutions: "Complete digital solutions",
        trusted_world: "Trusted Worldwide",

        trusted_desc:
            "ASEM is building a global digital ecosystem connecting people, businesses, services, tourism and technology.",

        payments: "Supported Payment Methods",

        search_results: "Search Results",
        no_results: "No results found.",
        search_placeholder: "🔍 Search...",

        loading: "Loading...",
        view_project: "View Project",
        learn_more: "Learn More",
        visit: "Visit",
        open: "Open",

        tourism_title: "🏝️ Global Tourism",
        businesses_title: "🌍 Global Businesses",
        products_title: "🛒 Global Products"
    },

    fr: {
        platform: "Plateforme mondiale",
        services: "Services",
        projects: "Projets",
        portfolio: "Portfolio",
        about: "À propos",
        contact: "Contact",

        hero_title: "ASEM Digital Solutions",
        hero_desc:
            "Projets numériques gratuits et solutions logicielles personnalisées pour les particuliers et les entreprises du monde entier.",
        start_project: "Démarrer votre projet gratuit",

        global_platform: "Plateforme mondiale ASEM 🌏",
        global_platform_desc:
            "Découvrez des destinations touristiques, des entreprises, des produits et des services numériques sur une plateforme unifiée.",

        tourism: "Tourisme",
        tourism_desc:
            "Découvrez des destinations, attractions et expériences dans le monde entier.",

        businesses: "Entreprises mondiales",
        businesses_desc:
            "Découvrez des entreprises, restaurants, services et organisations partout dans le monde.",

        products: "Produits mondiaux",
        products_desc:
            "Découvrez des produits et offres provenant d'entreprises du monde entier.",

        projects_desc:
            "Découvrez les projets numériques et solutions logicielles d'ASEM.",

        portfolio_desc:
            "Une sélection de nos solutions numériques mondiales.",

        services_desc:
            "Découvrez nos services de développement web, IA, automatisation et cloud.",

        contact_desc:
            "Contactez ASEM Digital Solutions.",

        global_search: "Recherche mondiale",
        global_search_desc:
            "Recherchez sur toute la plateforme ASEM.",

        web_dev: "Développement web",
        web_dev_desc:
            "Sites web et plateformes numériques modernes, rapides et sécurisés.",

        ai_auto: "IA & Automatisation",
        ai_auto_desc:
            "Solutions intelligentes basées sur l'intelligence artificielle et l'automatisation.",

        cloud: "Solutions cloud",
        cloud_desc:
            "Infrastructure cloud évolutive et fiable pour les organisations modernes.",

        why_asem: "Pourquoi choisir ASEM",
        secure: "Sécurité de niveau entreprise",
        modern_tech: "Technologies modernes",
        full_solutions: "Solutions numériques complètes",
        trusted_world: "Reconnu dans le monde entier",

        trusted_desc:
            "ASEM construit un écosystème numérique mondial reliant les personnes, les entreprises, les services, le tourisme et la technologie.",

        payments: "Modes de paiement pris en charge",

        search_results: "Résultats de recherche",
        no_results: "Aucun résultat trouvé.",
        search_placeholder: "🔍 Rechercher...",

        loading: "Chargement...",
        view_project: "Voir le projet",
        learn_more: "En savoir plus",
        visit: "Visiter",
        open: "Ouvrir",

        tourism_title: "🏝️ Tourisme mondial",
        businesses_title: "🌍 Entreprises mondiales",
        products_title: "🛒 Produits mondiaux"
    },

    ar: {
        platform: "المنصة العالمية",
        services: "الخدمات",
        projects: "المشاريع",
        portfolio: "أعمالنا",
        about: "من نحن",
        contact: "اتصل بنا",

        hero_title: "ASEM Digital Solutions",
        hero_desc:
            "مشاريع رقمية مجانية وحلول برمجية مخصصة للأفراد والشركات حول العالم.",
        start_project: "ابدأ مشروعك المجاني",

        global_platform: "منصة ASEM العالمية 🌏",
        global_platform_desc:
            "اكتشف الوجهات السياحية والشركات والمنتجات والخدمات الرقمية من خلال منصة موحدة.",

        tourism: "السياحة",
        tourism_desc:
            "اكتشف الوجهات والمعالم والتجارب حول العالم.",

        businesses: "الشركات العالمية",
        businesses_desc:
            "استكشف الشركات والمطاعم والخدمات والمنظمات حول العالم.",

        products: "المنتجات العالمية",
        products_desc:
            "اكتشف المنتجات والعروض من الشركات حول العالم.",

        projects_desc:
            "استكشف مشاريع ASEM الرقمية والحلول البرمجية.",

        portfolio_desc:
            "مجموعة مختارة من حلولنا الرقمية العالمية.",

        services_desc:
            "استكشف خدمات تطوير المواقع والذكاء الاصطناعي والأتمتة والحوسبة السحابية.",

        contact_desc:
            "تواصل مع ASEM Digital Solutions.",

        global_search: "البحث العالمي",
        global_search_desc:
            "ابحث في جميع أنحاء منصة ASEM.",

        web_dev: "تطوير الويب",
        web_dev_desc:
            "مواقع ومنصات رقمية حديثة وسريعة وآمنة.",

        ai_auto: "الذكاء الاصطناعي والأتمتة",
        ai_auto_desc:
            "حلول ذكية مدعومة بالذكاء الاصطناعي والأتمتة الحديثة.",

        cloud: "الحلول السحابية",
        cloud_desc:
            "بنية سحابية قابلة للتوسع وموثوقة للمؤسسات الحديثة.",

        why_asem: "لماذا تختار ASEM",
        secure: "أمان بمستوى المؤسسات",
        modern_tech: "تقنيات حديثة",
        full_solutions: "حلول رقمية متكاملة",
        trusted_world: "موثوق عالميًا",

        trusted_desc:
            "تعمل ASEM على بناء نظام رقمي عالمي يربط الأشخاص والشركات والخدمات والسياحة والتكنولوجيا.",

        payments: "طرق الدفع المدعومة",

        search_results: "نتائج البحث",
        no_results: "لم يتم العثور على نتائج.",
        search_placeholder: "🔍 بحث...",

        loading: "جاري التحميل...",
        view_project: "عرض المشروع",
        learn_more: "اعرف المزيد",
        visit: "زيارة",
        open: "فتح",

        tourism_title: "🏝️ السياحة العالمية",
        businesses_title: "🌍 الشركات العالمية",
        products_title: "🛒 المنتجات العالمية"
    },

    de: {
        platform: "Globale Plattform",
        services: "Dienstleistungen",
        projects: "Projekte",
        portfolio: "Portfolio",
        about: "Über uns",
        contact: "Kontakt",

        hero_title: "ASEM Digital Solutions",
        hero_desc:
            "Kostenlose digitale Projekte und individuelle Softwarelösungen für Menschen und Unternehmen weltweit.",
        start_project: "Kostenloses Projekt starten",

        global_platform: "ASEM Globale Plattform 🌏",
        global_platform_desc:
            "Entdecken Sie Reiseziele, Unternehmen, Produkte und digitale Dienstleistungen auf einer Plattform.",

        tourism: "Tourismus",
        tourism_desc:
            "Entdecken Sie Reiseziele, Sehenswürdigkeiten und Erlebnisse weltweit.",

        businesses: "Globale Unternehmen",
        businesses_desc:
            "Entdecken Sie Unternehmen, Restaurants, Dienstleistungen und Organisationen weltweit.",

        products: "Globale Produkte",
        products_desc:
            "Entdecken Sie Produkte und Angebote von Unternehmen aus aller Welt.",

        projects_desc:
            "Entdecken Sie digitale Projekte und Softwarelösungen von ASEM.",

        portfolio_desc:
            "Eine Auswahl unserer globalen digitalen Lösungen.",

        services_desc:
            "Entdecken Sie Webentwicklung, KI, Automatisierung und Cloud-Dienste.",

        contact_desc:
            "Kontaktieren Sie ASEM Digital Solutions.",

        global_search: "Globale Suche",
        global_search_desc:
            "Durchsuchen Sie die gesamte ASEM-Plattform.",

        web_dev: "Webentwicklung",
        web_dev_desc:
            "Moderne, schnelle und sichere Websites und digitale Plattformen.",

        ai_auto: "KI & Automatisierung",
        ai_auto_desc:
            "Intelligente Lösungen mit moderner künstlicher Intelligenz und Automatisierung.",

        cloud: "Cloud-Lösungen",
        cloud_desc:
            "Skalierbare und zuverlässige Cloud-Infrastruktur für moderne Organisationen.",

        why_asem: "Warum ASEM",
        secure: "Sicherheit auf Unternehmensniveau",
        modern_tech: "Moderne Technologien",
        full_solutions: "Komplette digitale Lösungen",
        trusted_world: "Weltweit vertrauenswürdig",

        trusted_desc:
            "ASEM entwickelt ein globales digitales Ökosystem, das Menschen, Unternehmen, Dienstleistungen, Tourismus und Technologie verbindet.",

        payments: "Unterstützte Zahlungsmethoden",

        search_results: "Suchergebnisse",
        no_results: "Keine Ergebnisse gefunden.",
        search_placeholder: "🔍 Suchen...",

        loading: "Wird geladen...",
        view_project: "Projekt ansehen",
        learn_more: "Mehr erfahren",
        visit: "Besuchen",
        open: "Öffnen"
    },

    it: {
        platform: "Piattaforma globale",
        services: "Servizi",
        projects: "Progetti",
        portfolio: "Portfolio",
        about: "Chi siamo",
        contact: "Contatti",

        hero_title: "ASEM Digital Solutions",
        hero_desc:
            "Progetti digitali gratuiti e soluzioni software personalizzate per privati e aziende in tutto il mondo.",
        start_project: "Inizia il tuo progetto gratuito",

        global_platform: "Piattaforma globale ASEM 🌏",
        global_platform_desc:
            "Esplora destinazioni turistiche, aziende, prodotti e servizi digitali attraverso una piattaforma unificata.",

        tourism: "Turismo",
        tourism_desc:
            "Scopri destinazioni, attrazioni ed esperienze in tutto il mondo.",

        businesses: "Aziende globali",
        businesses_desc:
            "Esplora aziende, ristoranti, servizi e organizzazioni in tutto il mondo.",

        products: "Prodotti globali",
        products_desc:
            "Scopri prodotti e offerte di aziende di tutto il mondo.",

        projects_desc:
            "Scopri i progetti digitali e le soluzioni software di ASEM.",

        portfolio_desc:
            "Una selezione delle nostre soluzioni digitali globali.",

        services_desc:
            "Scopri sviluppo web, IA, automazione e servizi cloud.",

        contact_desc:
            "Contatta ASEM Digital Solutions.",

        global_search: "Ricerca globale",
        global_search_desc:
            "Cerca in tutta la piattaforma ASEM.",

        web_dev: "Sviluppo web",
        web_dev_desc:
            "Siti web e piattaforme digitali moderne, veloci e sicure.",

        ai_auto: "IA e Automazione",
        ai_auto_desc:
            "Soluzioni intelligenti basate sull'intelligenza artificiale e sull'automazione.",

        cloud: "Soluzioni cloud",
        cloud_desc:
            "Infrastruttura cloud scalabile e affidabile.",

        why_asem: "Perché scegliere ASEM",
        secure: "Sicurezza di livello aziendale",
        modern_tech: "Tecnologie moderne",
        full_solutions: "Soluzioni digitali complete",
        trusted_world: "Affidabile in tutto il mondo",

        trusted_desc:
            "ASEM sta costruendo un ecosistema digitale globale che collega persone, aziende, servizi, turismo e tecnologia.",

        payments: "Metodi di pagamento supportati",

        search_results: "Risultati della ricerca",
        no_results: "Nessun risultato trovato.",
        search_placeholder: "🔍 Cerca...",

        loading: "Caricamento...",
        view_project: "Visualizza progetto",
        learn_more: "Scopri di più",
        visit: "Visita",
        open: "Apri"
    },

    es: {
        platform: "Plataforma global",
        services: "Servicios",
        projects: "Proyectos",
        portfolio: "Portafolio",
        about: "Acerca de",
        contact: "Contacto",

        hero_title: "ASEM Digital Solutions",
        hero_desc:
            "Proyectos digitales gratuitos y soluciones de software personalizadas para personas y empresas de todo el mundo.",
        start_project: "Inicia tu proyecto gratuito",

        global_platform: "Plataforma global ASEM 🌏",
        global_platform_desc:
            "Explora destinos turísticos, empresas, productos y servicios digitales desde una plataforma unificada.",

        tourism: "Turismo",
        tourism_desc:
            "Descubre destinos, atracciones y experiencias en todo el mundo.",

        businesses: "Empresas globales",
        businesses_desc:
            "Explora empresas, restaurantes, servicios y organizaciones de todo el mundo.",

        products: "Productos globales",
        products_desc:
            "Descubre productos y ofertas de empresas de todo el mundo.",

        projects_desc:
            "Explora los proyectos digitales y soluciones de software de ASEM.",

        portfolio_desc:
            "Una selección de nuestras soluciones digitales globales.",

        services_desc:
            "Explora desarrollo web, IA, automatización y servicios cloud.",

        contact_desc:
            "Contacta con ASEM Digital Solutions.",

        global_search: "Búsqueda global",
        global_search_desc:
            "Busca en toda la plataforma ASEM.",

        web_dev: "Desarrollo web",
        web_dev_desc:
            "Sitios web y plataformas digitales modernas, rápidas y seguras.",

        ai_auto: "IA y Automatización",
        ai_auto_desc:
            "Soluciones inteligentes impulsadas por inteligencia artificial y automatización.",

        cloud: "Soluciones cloud",
        cloud_desc:
            "Infraestructura cloud escalable y fiable.",

        why_asem: "Por qué elegir ASEM",
        secure: "Seguridad empresarial",
        modern_tech: "Tecnologías modernas",
        full_solutions: "Soluciones digitales completas",
        trusted_world: "Confianza mundial",

        trusted_desc:
            "ASEM está construyendo un ecosistema digital global que conecta personas, empresas, servicios, turismo y tecnología.",

        payments: "Métodos de pago compatibles",

        search_results: "Resultados de búsqueda",
        no_results: "No se encontraron resultados.",
        search_placeholder: "🔍 Buscar...",

        loading: "Cargando...",
        view_project: "Ver proyecto",
        learn_more: "Más información",
        visit: "Visitar",
        open: "Abrir"
    },

    nl: {
        platform: "Wereldwijd platform",
        services: "Diensten",
        projects: "Projecten",
        portfolio: "Portfolio",
        about: "Over ons",
        contact: "Contact",

        hero_title: "ASEM Digital Solutions",
        hero_desc:
            "Gratis digitale projecten en maatwerksoftware voor particulieren en bedrijven wereldwijd.",
        start_project: "Start uw gratis project",

        global_platform: "ASEM Wereldwijd Platform 🌏",
        global_platform_desc:
            "Ontdek toeristische bestemmingen, bedrijven, producten en digitale diensten via één platform.",

        tourism: "Toerisme",
        tourism_desc:
            "Ontdek bestemmingen, attracties en ervaringen over de hele wereld.",

        businesses: "Wereldwijde bedrijven",
        businesses_desc:
            "Ontdek bedrijven, restaurants, diensten en organisaties wereldwijd.",

        products: "Wereldwijde producten",
        products_desc:
            "Ontdek producten en aanbiedingen van bedrijven over de hele wereld.",

        projects_desc:
            "Ontdek digitale projecten en softwareoplossingen van ASEM.",

        portfolio_desc:
            "Een selectie van onze wereldwijde digitale oplossingen.",

        services_desc:
            "Ontdek webontwikkeling, AI, automatisering en cloudservices.",

        contact_desc:
            "Neem contact op met ASEM Digital Solutions.",

        global_search: "Wereldwijd zoeken",
        global_search_desc:
            "Zoek binnen het ASEM-platform.",

        web_dev: "Webontwikkeling",
        web_dev_desc:
            "Moderne, snelle en veilige websites en digitale platforms.",

        ai_auto: "AI & Automatisering",
        ai_auto_desc:
            "Slimme oplossingen met moderne kunstmatige intelligentie en automatisering.",

        cloud: "Cloudoplossingen",
        cloud_desc:
            "Schaalbare en betrouwbare cloudinfrastructuur.",

        why_asem: "Waarom ASEM",
        secure: "Beveiliging op bedrijfsniveau",
        modern_tech: "Moderne technologieën",
        full_solutions: "Complete digitale oplossingen",
        trusted_world: "Wereldwijd vertrouwd",

        trusted_desc:
            "ASEM bouwt aan een wereldwijd digitaal ecosysteem dat mensen, bedrijven, diensten, toerisme en technologie verbindt.",

        payments: "Ondersteunde betaalmethoden",

        search_results: "Zoekresultaten",
        no_results: "Geen resultaten gevonden.",
        search_placeholder: "🔍 Zoeken...",

        loading: "Laden...",
        view_project: "Project bekijken",
        learn_more: "Meer informatie",
        visit: "Bezoeken",
        open: "Openen"
    }
};


/* ============================================================
   DATA
   ============================================================ */

const tourismData = [
    {
        title: "Paris, France",
        description: "Explore historic landmarks, culture, architecture and world-famous attractions.",
        category: "Destination",
        icon: "🗼"
    },
    {
        title: "Dubai, UAE",
        description: "Discover modern architecture, luxury experiences, shopping and desert adventures.",
        category: "Destination",
        icon: "🏙️"
    },
    {
        title: "Istanbul, Türkiye",
        description: "Experience history, culture, food and the unique connection between Europe and Asia.",
        category: "Destination",
        icon: "🕌"
    },
    {
        title: "Tokyo, Japan",
        description: "Discover technology, traditional culture, food and unforgettable city experiences.",
        category: "Destination",
        icon: "🗾"
    },
    {
        title: "Rome, Italy",
        description: "Explore ancient history, architecture, art and Italian culture.",
        category: "Destination",
        icon: "🏛️"
    },
    {
        title: "New York, USA",
        description: "Experience one of the world's most famous cities, landmarks and cultural centers.",
        category: "Destination",
        icon: "🗽"
    }
];


const businessesData = [
    {
        title: "Technology Businesses",
        description: "Discover technology companies, software providers and digital organizations.",
        category: "Technology",
        icon: "💻"
    },
    {
        title: "Restaurants",
        description: "Find restaurants, cafés and food businesses around the world.",
        category: "Food",
        icon: "🍽️"
    },
    {
        title: "Travel Businesses",
        description: "Explore travel agencies, tour operators and tourism services.",
        category: "Travel",
        icon: "✈️"
    },
    {
        title: "Professional Services",
        description: "Discover consulting, financial, legal and professional service providers.",
        category: "Services",
        icon: "💼"
    },
    {
        title: "Local Businesses",
        description: "Explore businesses and services serving local communities worldwide.",
        category: "Local",
        icon: "🏪"
    },
    {
        title: "Organizations",
        description: "Discover organizations, institutions and global initiatives.",
        category: "Organization",
        icon: "🌐"
    }
];


const productsData = [
    {
        title: "Software Solutions",
        description: "Digital software products designed to improve business and personal productivity.",
        category: "Software",
        icon: "💾"
    },
    {
        title: "Digital Services",
        description: "Professional digital services for companies, organizations and individuals.",
        category: "Digital",
        icon: "⚙️"
    },
    {
        title: "Business Tools",
        description: "Useful tools and solutions designed for modern businesses.",
        category: "Business",
        icon: "🧰"
    },
    {
        title: "AI Solutions",
        description: "Modern artificial intelligence solutions and automation tools.",
        category: "AI",
        icon: "🤖"
    },
    {
        title: "Cloud Products",
        description: "Cloud-based solutions for modern digital organizations.",
        category: "Cloud",
        icon: "☁️"
    },
    {
        title: "Digital Products",
        description: "Useful digital products and resources from global creators.",
        category: "Digital",
        icon: "📦"
    }
];


const projectsData = [
    {
        title: "ASEM Global Platform",
        description:
            "A unified digital platform connecting tourism, businesses, products, services and technology.",
        category: "Platform",
        icon: "🌍",
        status: "Active"
    },
    {
        title: "ASEM Business Directory",
        description:
            "A global directory concept for discovering businesses and professional services.",
        category: "Business",
        icon: "🏢",
        status: "Development"
    },
    {
        title: "ASEM Tourism Platform",
        description:
            "A digital tourism experience for discovering destinations, attractions and travel services.",
        category: "Tourism",
        icon: "🏝️",
        status: "Development"
    },
    {
        title: "ASEM AI Solutions",
        description:
            "Artificial intelligence and automation tools designed for modern digital workflows.",
        category: "AI",
        icon: "🤖",
        status: "Development"
    }
];


const portfolioData = [
    {
        title: "Global Digital Platform",
        description: "Unified digital ecosystem for global services.",
        category: "Platform",
        icon: "🌐"
    },
    {
        title: "Modern Web Solutions",
        description: "Fast, responsive and accessible web experiences.",
        category: "Web",
        icon: "💻"
    },
    {
        title: "AI & Automation",
        description: "Intelligent automation and digital workflows.",
        category: "AI",
        icon: "🤖"
    },
    {
        title: "Cloud Infrastructure",
        description: "Scalable cloud solutions for modern organizations.",
        category: "Cloud",
        icon: "☁️"
    }
];


/* ============================================================
   DOM HELPERS
   ============================================================ */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));


function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ============================================================
   APPLICATION STATE
   ============================================================ */

const state = {
    language: "en",
    theme: "light",
    activePlatform: null,
    searchTerm: "",
    searchResultsVisible: false
};


/* ============================================================
   LANGUAGE
   ============================================================ */

function detectLanguage() {
    const browserLanguage =
        navigator.language ||
        navigator.userLanguage ||
        "en";

    const shortLanguage =
        browserLanguage.toLowerCase().split("-")[0];

    return translations[shortLanguage]
        ? shortLanguage
        : ASEM_CONFIG.defaultLanguage;
}


function getLanguage() {
    const saved =
        localStorage.getItem(ASEM_CONFIG.storage.language);

    if (
        saved &&
        ASEM_CONFIG.supportedLanguages.includes(saved)
    ) {
        if (saved === "auto") {
            return detectLanguage();
        }

        return saved;
    }

    return detectLanguage();
}


function applyLanguage(language) {
    if (language === "auto") {
        language = detectLanguage();
    }

    if (!translations[language]) {
        language = ASEM_CONFIG.defaultLanguage;
    }

    state.language = language;

    document.documentElement.lang = language;

    document.documentElement.dir =
        language === "ar"
            ? "rtl"
            : "ltr";

    $$("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;

        if (
            translations[language] &&
            Object.prototype.hasOwnProperty.call(
                translations[language],
                key
            )
        ) {
            element.textContent =
                translations[language][key];
        }
    });

    const searchBox = $("#searchBox");

    if (searchBox) {
        searchBox.placeholder =
            translations[language].search_placeholder ||
            "🔍 Search...";
    }

    localStorage.setItem(
        ASEM_CONFIG.storage.language,
        language
    );

    updateDynamicLanguage();

    performSearch(state.searchTerm);
}


function updateDynamicLanguage() {
    const language = translations[state.language];

    if (!language) {
        return;
    }

    const tourismTitle = $("#tourism-title");

    if (tourismTitle) {
        tourismTitle.textContent =
            language.tourism_title ||
            "🏝️ Global Tourism";
    }

    const businessesTitle = $("#businesses-title");

    if (businessesTitle) {
        businessesTitle.textContent =
            language.businesses_title ||
            "🌍 Global Businesses";
    }

    const productsTitle = $("#products-title");

    if (productsTitle) {
        productsTitle.textContent =
            language.products_title ||
            "🛒 Global Products";
    }
}


function initializeLanguage() {
    const langSwitch = $("#langSwitch");

    const saved =
        localStorage.getItem(
            ASEM_CONFIG.storage.language
        );

    if (
        langSwitch &&
        saved &&
        ASEM_CONFIG.supportedLanguages.includes(saved)
    ) {
        langSwitch.value = saved;
    } else if (langSwitch) {
        langSwitch.value = "auto";
    }

    applyLanguage(
        langSwitch?.value || "auto"
    );
}


/* ============================================================
   THEME
   ============================================================ */

function getPreferredTheme() {
    const saved =
        localStorage.getItem(
            ASEM_CONFIG.storage.theme
        );

    if (saved === "dark" || saved === "light") {
        return saved;
    }

    return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}


function applyTheme(theme) {
    state.theme = theme;

    document.documentElement.dataset.theme = theme;

    document.body.classList.toggle(
        "dark-mode",
        theme === "dark"
    );

    const toggle = $("#themeToggle");

    if (toggle) {
        toggle.textContent =
            theme === "dark"
                ? "☀️"
                : "🌙";

        toggle.setAttribute(
            "aria-pressed",
            theme === "dark"
                ? "true"
                : "false"
        );

        toggle.setAttribute(
            "aria-label",
            theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

        toggle.title =
            theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode";
    }

    localStorage.setItem(
        ASEM_CONFIG.storage.theme,
        theme
    );
}


function toggleTheme() {
    applyTheme(
        state.theme === "dark"
            ? "light"
            : "dark"
    );
}


function initializeTheme() {
    applyTheme(getPreferredTheme());

    const toggle = $("#themeToggle");

    toggle?.addEventListener(
        "click",
        toggleTheme
    );
}


/* ============================================================
   RESULT CARD RENDERING
   ============================================================ */

function createResultCard(item, type) {
    const article = document.createElement("article");

    article.className = "card result-card";

    article.dataset.searchable =
        `${item.title} ${item.description} ${item.category || ""}`.toLowerCase();

    const statusHTML =
        item.status
            ? `<span class="result-status">${escapeHTML(item.status)}</span>`
            : "";

    article.innerHTML = `
        <div class="platform-icon" aria-hidden="true">
            ${escapeHTML(item.icon || "🌐")}
        </div>

        <h3>
            ${escapeHTML(item.title)}
        </h3>

        <p>
            ${escapeHTML(item.description)}
        </p>

        <div class="result-meta">
            ${
                item.category
                    ? `<span>${escapeHTML(item.category)}</span>`
                    : ""
            }

            ${statusHTML}
        </div>

        ${
            type === "projects"
                ? `
                    <button
                        type="button"
                        class="btn result-action"
                        data-project="${escapeHTML(item.title)}"
                    >
                        ${escapeHTML(
                            translations[state.language]?.view_project ||
                            "View Project"
                        )}
                    </button>
                `
                : ""
        }
    `;

    return article;
}


function renderCollection(
    collection,
    containerId,
    type
) {
    const container = $(`#${containerId}`);

    if (!container) {
        return;
    }

    container.setAttribute("aria-busy", "true");

    container.innerHTML = "";

    if (!Array.isArray(collection) || collection.length === 0) {
        container.innerHTML = `
            <article class="card">
                <p>
                    ${escapeHTML(
                        translations[state.language]?.no_results ||
                        "No results found."
                    )}
                </p>
            </article>
        `;

        container.setAttribute("aria-busy", "false");

        return;
    }

    const fragment = document.createDocumentFragment();

    collection.forEach(item => {
        fragment.appendChild(
            createResultCard(item, type)
        );
    });

    container.appendChild(fragment);

    container.setAttribute("aria-busy", "false");
}


function renderAllCollections() {
    renderCollection(
        tourismData,
        "tourismGrid",
        "tourism"
    );

    renderCollection(
        businessesData,
        "businessesGrid",
        "businesses"
    );

    renderCollection(
        productsData,
        "productsGrid",
        "products"
    );

    renderCollection(
        projectsData,
        "projectsGrid",
        "projects"
    );

    renderPortfolio();
}


/* ============================================================
   PORTFOLIO
   ============================================================ */

function renderPortfolio() {
    const container = $("#portfolioGrid");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const fragment =
        document.createDocumentFragment();

    portfolioData.forEach(item => {
        const card =
            document.createElement("article");

        card.className = "card portfolio-card";

        card.dataset.searchable =
            `${item.title} ${item.description} ${item.category}`
                .toLowerCase();

        card.innerHTML = `
            <div
                class="platform-icon"
                aria-hidden="true"
            >
                ${escapeHTML(item.icon)}
            </div>

            <h3>
                ${escapeHTML(item.title)}
            </h3>

            <p>
                ${escapeHTML(item.description)}
            </p>

            <small>
                ${escapeHTML(item.category)}
            </small>
        `;

        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}


/* ============================================================
   PLATFORM NAVIGATION
   ============================================================ */

function hidePlatformSections() {
    $$(".platform-results").forEach(section => {
        section.hidden = true;
    });
}


function showSection(sectionId) {
    if (!sectionId) {
        return;
    }

    const section =
        document.getElementById(sectionId);

    if (!section) {
        return;
    }

    section.hidden = false;

    requestAnimationFrame(() => {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}


function handlePlatformAction(action) {
    state.activePlatform = action;

    switch (action) {

        case "tourism":
            hidePlatformSections();
            showSection("tourism-section");
            break;

        case "businesses":
            hidePlatformSections();
            showSection("businesses-section");
            break;

        case "products":
            hidePlatformSections();
            showSection("products-section");
            break;

        case "projects":
            hidePlatformSections();
            showSection("projects");
            break;

        case "portfolio":
            hidePlatformSections();
            showSection("portfolio");
            break;

        case "services":
            hidePlatformSections();
            showSection("services");
            break;

        case "contact":
            window.location.href = "contact.html";
            break;

        case "search":
            focusSearch();
            break;

        default:
            console.warn(
                `Unknown platform action: ${action}`
            );
    }
}


function initializePlatformCards() {
    $$("[data-platform-action]")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {
                    handlePlatformAction(
                        card.dataset.platformAction
                    );
                }
            );
        });
}


/* ============================================================
   SEARCH
   ============================================================ */

function getSearchableItems() {
    return [
        ...tourismData.map(item => ({
            ...item,
            type: "Tourism"
        })),

        ...businessesData.map(item => ({
            ...item,
            type: "Business"
        })),

        ...productsData.map(item => ({
            ...item,
            type: "Product"
        })),

        ...projectsData.map(item => ({
            ...item,
            type: "Project"
        })),

        ...portfolioData.map(item => ({
            ...item,
            type: "Portfolio"
        }))
    ];
}


function performSearch(query) {
    const normalized =
        String(query || "")
            .trim()
            .toLowerCase();

    state.searchTerm = query || "";

    const searchableElements =
        $$("[data-searchable]");

    searchableElements.forEach(element => {
        if (!normalized) {
            element.hidden = false;
            return;
        }

        element.hidden =
            !element.dataset.searchable.includes(
                normalized
            );
    });

    if (!normalized) {
        hideSearchResultsMessage();
        return;
    }

    const data =
        getSearchableItems();

    const results =
        data.filter(item => {

            const text =
                `${item.title} ${item.description} ${item.category || ""}`
                    .toLowerCase();

            return text.includes(normalized);
        });

    showSearchResultsMessage(
        normalized,
        results.length
    );
}


function showSearchResultsMessage(
    query,
    count
) {
    let message =
        $("#asemSearchStatus");

    if (!message) {
        message =
            document.createElement("div");

        message.id = "asemSearchStatus";
        message.className = "search-status";

        const main =
            document.querySelector("main");

        if (main) {
            main.prepend(message);
        }
    }

    message.hidden = false;

    const language =
        translations[state.language] ||
        translations.en;

    message.innerHTML = `
        <p>
            <strong>
                ${escapeHTML(language.search_results)}
            </strong>
            ${count > 0
                ? `: ${count}`
                : ""}
        </p>

        ${
            count === 0
                ? `<p>${escapeHTML(language.no_results)}</p>`
                : ""
        }
    `;

    if (count > 0) {
        message.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
}


function hideSearchResultsMessage() {
    const message =
        $("#asemSearchStatus");

    if (message) {
        message.hidden = true;
    }
}


function focusSearch() {
    const searchBox =
        $("#searchBox");

    if (!searchBox) {
        return;
    }

    searchBox.focus();

    searchBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function initializeSearch() {
    const searchBox =
        $("#searchBox");

    if (!searchBox) {
        return;
    }

    searchBox.addEventListener(
        "input",
        event => {
            performSearch(
                event.target.value
            );
        }
    );

    searchBox.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                searchBox.value = "";
                performSearch("");
                searchBox.blur();
            }

            if (
                event.key === "Enter" &&
                searchBox.value.trim()
            ) {
                performSearch(
                    searchBox.value
                );
            }
        }
    );
}


/* ============================================================
   SCROLL TOP
   ============================================================ */

function initializeScrollTop() {
    const button =
        $("#scrollTop");

    if (!button) {
        return;
    }

    const update =
        () => {
            button.hidden =
                window.scrollY < 500;
        };

    window.addEventListener(
        "scroll",
        update,
        { passive: true }
    );

    button.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );

    update();
}


/* ============================================================
   HASH NAVIGATION
   ============================================================ */

function handleInitialHash() {
    const hash =
        window.location.hash;

    if (!hash) {
        return;
    }

    const id =
        decodeURIComponent(
            hash.substring(1)
        );

    const target =
        document.getElementById(id);

    if (!target) {
        return;
    }

    setTimeout(() => {
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 150);
}


function initializeHashNavigation() {
    $$('a[href^="#"]').forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute("href");

                if (!href || href === "#") {
                    return;
                }

                const id =
                    href.substring(1);

                const target =
                    document.getElementById(id);

                if (!target) {
                    return;
                }

                event.preventDefault();

                hidePlatformSections();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.pushState(
                    null,
                    "",
                    `#${id}`
                );
            }
        );
    });

    window.addEventListener(
        "hashchange",
        handleInitialHash
    );
}

/* ========================================================
   GPS / GEOLOCATION
======================================================== */

function showLocationStatus(message) {
    const status = DOM.locationStatus;

    if (status) {
        status.textContent = message;
    }

    console.log(`ASEM GPS: ${message}`);
}


async function sendLocationToBackend(location) {
    if (!ASEM.api.location) {
        return null;
    }

    try {
        return await apiRequest(
            ASEM.api.location,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(location)
            }
        );

    } catch (error) {
        console.warn(
            "ASEM: location backend unavailable",
            error
        );

        return null;
    }
}


function requestGPS() {
    if (!navigator.geolocation) {
        showLocationStatus(
            "GPS / Geolocation is not supported by this browser."
        );
        return;
    }

    showLocationStatus(
        "Requesting your location..."
    );

    navigator.geolocation.getCurrentPosition(
        async position => {

            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
            };

            window.ASEMLocation = location;

            showLocationStatus(
                `Location detected: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
            );

            await sendLocationToBackend(location);

        },

        error => {

            let message =
                "Unable to get location.";

            switch (error.code) {

                case error.PERMISSION_DENIED:
                    message =
                        "Location permission was denied.";
                    break;

                case error.POSITION_UNAVAILABLE:
                    message =
                        "Location information is unavailable.";
                    break;

                case error.TIMEOUT:
                    message =
                        "Location request timed out.";
                    break;
            }

            showLocationStatus(message);

            console.warn(
                "ASEM GPS:",
                error
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


/*
 * Kept for compatibility.
 * GPS clicks are handled by initializeActionRouter().
 */
function initializeGPS() {
    return true;
}


/* ========================================================
   PLATFORM ACTIONS
======================================================== */

const actions = {

    tourism: () =>
        handleSection(
            "tourism-section",
            loadTourism
        ),

    businesses: () =>
        handleSection(
            "businesses-section",
            loadBusinesses
        ),

    products: () =>
        handleSection(
            "products-section",
            loadProducts
        ),

    projects: () =>
        handleSection(
            "projects",
            loadProjects
        ),

    portfolio: () =>
        openPortfolio(),

    services: () =>
        openPageSection("services"),

    contact: () => {
        const section =
            document.getElementById("contact");

        if (section) {
            return openPageSection("contact");
        }

        const footer =
            document.querySelector("footer");

        if (footer) {
            footer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return true;
        }

        return false;
    },

    search: () =>
        focusSearch(),

    gps: () =>
        requestGPS(),

    location: () =>
        requestGPS(),

    top: () =>
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
};
/* ============================================================
   PROJECT ACTIONS
   ============================================================ */

function handleProjectAction(projectName) {
    const project =
        projectsData.find(
            item =>
                item.title === projectName
        );

    if (!project) {
        return;
    }

    /*
        This is intentionally a front-end action.
        When you have individual project pages,
        change this to a real URL.
    */

    const message =
        `${project.title}\n\n${project.description}\n\nStatus: ${project.status}`;

    window.alert(message);
}


function initializeProjectActions() {
    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-project]"
                );

            if (!button) {
                return;
            }

            handleProjectAction(
                button.dataset.project
            );
        }
    );
}


/* ============================================================
   ACCESSIBILITY
   ============================================================ */

function initializeAccessibility() {
    $$("[data-platform-action]")
        .forEach(button => {

            button.setAttribute(
                "aria-expanded",
                "false"
            );

            button.addEventListener(
                "click",
                () => {

                    $$("[data-platform-action]")
                        .forEach(other => {

                            other.setAttribute(
                                "aria-expanded",
                                "false"
                            );
                        });

                    button.setAttribute(
                        "aria-expanded",
                        "true"
                    );
                }
            );
        });
}


/* ============================================================
   EXTERNAL LINKS
   ============================================================ */

function secureExternalLinks() {
    $$('a[target="_blank"]')
        .forEach(link => {

            const rel =
                link.getAttribute("rel") || "";

            if (!rel.includes("noopener")) {
                link.setAttribute(
                    "rel",
                    `${rel} noopener`
                        .trim()
                );
            }

            if (!rel.includes("noreferrer")) {
                link.setAttribute(
                    "rel",
                    `${link.getAttribute("rel")} noreferrer`
                        .trim()
                );
            }
        });
}


/* ============================================================
   ERROR HANDLING
   ============================================================ */

function initializeErrorHandling() {

    window.addEventListener(
        "error",
        event => {

            console.error(
                "ASEM application error:",
                event.error || event.message
            );
        }
    );

    window.addEventListener(
        "unhandledrejection",
        event => {

            console.error(
                "ASEM unhandled promise rejection:",
                event.reason
            );
        }
    );
}


/* ============================================================
   API READY ARCHITECTURE
   ============================================================ */

/*
    When you create your backend, you can replace the local
    data with API calls.

    Example:

        const response =
            await ASEM_API.get("/api/tourism");

    The rest of the application can remain unchanged.
*/

const ASEM_API = {

    baseURL: "",

    async get(endpoint) {

        if (!this.baseURL) {
            throw new Error(
                "ASEM API baseURL has not been configured."
            );
        }

        const response =
            await fetch(
                `${this.baseURL}${endpoint}`,
                {
                    method: "GET",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }

        return response.json();
    }
};


/* ============================================================
   CONNECTION STATUS
   ============================================================ */

function initializeConnectionStatus() {

    const update =
        () => {

            document.documentElement
                .dataset.online =
                    navigator.onLine
                        ? "true"
                        : "false";
        };

    window.addEventListener(
        "online",
        update
    );

    window.addEventListener(
        "offline",
        update
    );

    update();
}


/* ============================================================
   PERFORMANCE
   ============================================================ */

function initializeLazyBehavior() {

    /*
        Native lazy loading for future images.
    */

    $$("img").forEach(image => {

        if (!image.hasAttribute("loading")) {
            image.loading = "lazy";
        }

        if (!image.hasAttribute("decoding")) {
            image.decoding = "async";
        }
    });
}


/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */

function initializeKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            /*
                Ctrl/Cmd + K
                Focus global search.
            */

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();
                focusSearch();
            }

            /*
                Escape
                Close platform result sections.
            */

            if (event.key === "Escape") {

                const activeElement =
                    document.activeElement;

                if (
                    activeElement &&
                    activeElement.id === "searchBox"
                ) {
                    return;
                }

                hidePlatformSections();
            }
        }
    );
}


/* ============================================================
   PAGE VISIBILITY
   ============================================================ */

function initializeVisibilityHandling() {

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {
                return;
            }

            /*
                Page became visible again.
                Good place for future API refresh logic.
            */
        }
    );
}


/* ============================================================
   SAFE LOCAL STORAGE
   ============================================================ */

function testLocalStorage() {
    try {

        const testKey =
            "__asem_storage_test__";

        localStorage.setItem(
            testKey,
            "1"
        );

        localStorage.removeItem(
            testKey
        );

        return true;

    } catch (error) {

        console.warn(
            "ASEM: localStorage is unavailable.",
            error
        );

        return false;
    }
}


/* ============================================================
   FOOTER YEAR
   ============================================================ */

function updateFooterYear() {

    const paragraphs =
        $$("footer p");

    if (!paragraphs.length) {
        return;
    }

    const currentYear =
        new Date().getFullYear();

    paragraphs.forEach(paragraph => {

        if (
            paragraph.textContent.includes("ASEM")
        ) {
            paragraph.textContent =
                `© ${currentYear} ASEM Digital Solutions`;
        }
    });
}


/* ============================================================
   INITIALIZATION
   ============================================================ */

function initializeASEM() {

    try {

        console.log(
            "ASEM Digital Solutions initializing..."
        );

        testLocalStorage();

        initializeErrorHandling();

        initializeTheme();

        initializeLanguage();

        renderAllCollections();

        initializePlatformCards();

        initializeSearch();

        initializeScrollTop();

        initializeHashNavigation();

        initializeProjectActions();

        initializeAccessibility();

        secureExternalLinks();

        initializeConnectionStatus();

        initializeLazyBehavior();

        initializeKeyboardShortcuts();

        initializeVisibilityHandling();

        updateFooterYear();

        handleInitialHash();

        console.log(
            "ASEM Digital Solutions initialized successfully."
        );

    } catch (error) {

        console.error(
            "ASEM initialization failed:",
            error
        );
    }
}


/* ============================================================
   DOM READY
   ============================================================ */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeASEM,
        { once: true }
    );

} else {

    initializeASEM();
}


/* ============================================================
   PUBLIC ASEM OBJECT
   ============================================================ */

window.ASEM = {

    state,

    config: ASEM_CONFIG,

    data: {
        tourism: tourismData,
        businesses: businessesData,
        products: productsData,
        projects: projectsData,
        portfolio: portfolioData
    },

    translations,

    api: ASEM_API,

    functions: {
        applyLanguage,
        applyTheme,
        toggleTheme,
        performSearch,
        renderAllCollections,
        handlePlatformAction,
        focusSearch
    }

};
