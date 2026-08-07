/* =========================================================
   ASEM GLOBAL PLATFORM
   Frontend Application Controller
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const ASEM_API_BASE =
    window.ASEM_API_BASE_URL || "";


/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {

    ar: {
        projects: "المشاريع",
        contact: "تواصل معنا",
        why: "لماذا ASEM؟",
        start: "ابدأ مشروعك مجانًا",
        contactBtn: "تواصل معنا",
        description:
            "مشاريع رقمية مجانية وحلول برمجية مخصصة للأفراد والشركات حول العالم"
    },

    en: {
        projects: "Projects",
        contact: "Contact Us",
        why: "Why ASEM?",
        start: "Start Your Free Project",
        contactBtn: "Contact Us",
        description:
            "Free digital projects and custom software solutions for individuals and companies worldwide"
    },

    fr: {
        projects: "Projets",
        contact: "Contact",
        why: "Pourquoi ASEM ?",
        start: "Commencez votre projet gratuitement",
        contactBtn: "Nous contacter",
        description:
            "Projets numériques gratuits et solutions logicielles personnalisées"
    },

    ja: {
        projects: "プロジェクト",
        contact: "お問い合わせ",
        why: "なぜASEMなのか",
        start: "無料でプロジェクトを開始",
        contactBtn: "お問い合わせ",
        description:
            "個人や企業向けの無料デジタルプロジェクトとカスタムソリューション"
    }

};


/* =========================================================
   LANGUAGE
   ========================================================= */

function applyLanguage(lang) {

    const selected =
        translations[lang]
            ? lang
            : "en";

    const t =
        translations[selected];

    document.documentElement.lang =
        selected;

    document.documentElement.dir =
        selected === "ar"
            ? "rtl"
            : "ltr";


    const projectsTitle =
        document.querySelector("#projects h2");

    if (projectsTitle) {
        projectsTitle.textContent =
            t.projects;
    }


    const contactTitle =
        document.querySelector("#contact h2");

    if (contactTitle) {
        contactTitle.textContent =
            t.contact;
    }


    const heroText =
        document.querySelector(".hero p");

    if (heroText) {
        heroText.textContent =
            t.description;
    }


    const buttons =
        document.querySelectorAll(".btn");

    if (buttons[0]) {
        buttons[0].textContent =
            t.start;
    }

    if (buttons[1]) {
        buttons[1].textContent =
            t.contactBtn;
    }


    /*
       Support elements using data-i18n.
    */

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            if (
                translations[selected] &&
                translations[selected][key]
            ) {
                element.textContent =
                    translations[selected][key];
            }

        });


    localStorage.setItem(
        "lang",
        selected
    );

}


/* =========================================================
   INITIAL LANGUAGE
   ========================================================= */

function initializeLanguage() {

    const browserLang =
        (
            navigator.language || "en"
        )
        .split("-")[0]
        .toLowerCase();


    const savedLang =
        localStorage.getItem("lang");


    const currentLang =
        savedLang ||
        (
            translations[browserLang]
                ? browserLang
                : "en"
        );


    applyLanguage(currentLang);


    const langSwitch =
        document.getElementById("langSwitch");


    if (!langSwitch) {
        return;
    }


    langSwitch.value =
        currentLang;


    langSwitch.addEventListener(
        "change",
        function () {

            applyLanguage(
                this.value
            );

        }
    );

}


/* =========================================================
   DARK MODE
   ========================================================= */

function updateDarkButton() {

    const darkButton =
        document.getElementById(
            "themeToggle"
        );


    if (!darkButton) {
        return;
    }


    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        darkButton.textContent =
            "☀️";

        darkButton.setAttribute(
            "aria-label",
            "Light Mode"
        );

    } else {

        darkButton.textContent =
            "🌙";

        darkButton.setAttribute(
            "aria-label",
            "Dark Mode"
        );

    }

}


function initializeDarkMode() {

    const darkButton =
        document.getElementById(
            "themeToggle"
        );


    if (
        localStorage.getItem("dark")
        === "true"
    ) {

        document.body.classList.add(
            "dark"
        );

    }


    updateDarkButton();


    if (!darkButton) {
        return;
    }


    darkButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark"
            );


            localStorage.setItem(
                "dark",
                document.body.classList.contains(
                    "dark"
                )
            );


            updateDarkButton();

        }
    );

}


/* =========================================================
   API HELPERS
   ========================================================= */

function apiUrl(endpoint) {

    return (
        ASEM_API_BASE.replace(
            /\/$/,
            ""
        ) +
        "/api/" +
        endpoint.replace(
            /^\//,
            ""
        )
    );

}


async function fetchApi(
    endpoint
) {

    const response =
        await fetch(
            apiUrl(endpoint),
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


/* =========================================================
   UI HELPERS
   ========================================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function findContainer(
    selectors
) {

    for (
        const selector of selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (element) {
            return element;
        }

    }


    return null;

}


function showLoading(
    container,
    message = "Loading..."
) {

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="card loading-card">
            <p>${escapeHtml(message)}</p>
        </div>
    `;

}


function showApiError(
    container,
    message = "Unable to load data."
) {

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="card error-card">
            <p>${escapeHtml(message)}</p>
        </div>
    `;

}


/* =========================================================
   GENERIC DATA CARD
   ========================================================= */

function createDataCard(
    item,
    type
) {

    const name =
        item.name ||
        item.title ||
        "ASEM Global";

    const image =
        item.image || "";


    let details = "";


    if (item.category) {

        details += `
            <p>
                <strong>Category:</strong>
                ${escapeHtml(item.category)}
            </p>
        `;

    }


    if (item.description) {

        details += `
            <p>
                ${escapeHtml(
                    item.description
                )}
            </p>
        `;

    }


    if (item.address) {

        details += `
            <p>
                <strong>Address:</strong>
                ${escapeHtml(
                    item.address
                )}
            </p>
        `;

    }


    if (item.rating !== undefined) {

        details += `
            <p>
                ⭐ ${escapeHtml(
                    item.rating
                )}
            </p>
        `;

    }


    if (
        type === "tourism" &&
        item.opening_hours
    ) {

        details += `
            <p>
                🕐 ${escapeHtml(
                    item.opening_hours
                )}
            </p>
        `;

    }


    if (
        type === "tourism" &&
        item.ticket_price !== null &&
        item.ticket_price !== undefined
    ) {

        details += `
            <p>
                🎟️ ${escapeHtml(
                    item.ticket_price
                )}
            </p>
        `;

    }


    const imageHtml =
        image
            ? `
                <img
                    src="${escapeHtml(image)}"
                    alt="${escapeHtml(name)}"
                    loading="lazy"
                >
              `
            : "";


    return `
        <article
            class="card global-data-card"
            data-type="${escapeHtml(type)}"
        >

            ${imageHtml}

            <h3>
                ${escapeHtml(name)}
            </h3>

            ${details}

        </article>
    `;

}


/* =========================================================
   RENDER DATA
   ========================================================= */

function renderData(
    container,
    data,
    type
) {

    if (!container) {
        return;
    }


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        container.innerHTML = `
            <div class="card">
                <p>No data available yet.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        data
            .map(
                item =>
                    createDataCard(
                        item,
                        type
                    )
            )
            .join("");

}


/* =========================================================
   TOURISM
   ========================================================= */

async function loadTourism() {

    const container =
        findContainer([
            "#tourismGrid",
            "#tourismContainer",
            "#globalTourismGrid"
        ]);


    if (!container) {

        console.warn(
            "Tourism container not found."
        );

        return;

    }


    showLoading(
        container,
        "Loading global tourism..."
    );


    try {

        const data =
            await fetchApi(
                "tourism"
            );


        renderData(
            container,
            data,
            "tourism"
        );


    } catch (error) {

        console.error(
            "Tourism API error:",
            error
        );


        showApiError(
            container,
            "Tourism service is currently unavailable."
        );

    }

}


/* =========================================================
   BUSINESSES / RESTAURANTS
   ========================================================= */

async function loadBusinesses() {

    const container =
        findContainer([
            "#businessesGrid",
            "#businessesContainer",
            "#restaurantsGrid",
            "#restaurantsContainer"
        ]);


    if (!container) {

        console.warn(
            "Businesses container not found."
        );

        return;

    }


    showLoading(
        container,
        "Loading restaurants and businesses..."
    );


    try {

        const data =
            await fetchApi(
                "businesses"
            );


        renderData(
            container,
            data,
            "businesses"
        );


    } catch (error) {

        console.error(
            "Businesses API error:",
            error
        );


        showApiError(
            container,
            "Restaurants and business service is currently unavailable."
        );

    }

}


/* =========================================================
   PRODUCTS
   ========================================================= */

async function loadProducts() {

    const container =
        findContainer([
            "#productsGrid",
            "#productsContainer",
            "#globalProductsGrid"
        ]);


    if (!container) {

        console.warn(
            "Products container not found."
        );

        return;

    }


    showLoading(
        container,
        "Loading global products..."
    );


    try {

        const data =
            await fetchApi(
                "products"
            );


        renderData(
            container,
            data,
            "products"
        );


    } catch (error) {

        console.error(
            "Products API error:",
            error
        );


        showApiError(
            container,
            "Products service is currently unavailable."
        );

    }

}


/* =========================================================
   COUNTRIES
   ========================================================= */

async function loadCountries() {

    const container =
        findContainer([
            "#countriesGrid",
            "#countriesContainer"
        ]);


    if (!container) {
        return;
    }


    showLoading(
        container,
        "Loading countries..."
    );


    try {

        const data =
            await fetchApi(
                "countries"
            );


        renderData(
            container,
            data,
            "countries"
        );


    } catch (error) {

        console.error(
            "Countries API error:",
            error
        );


        showApiError(
            container,
            "Countries service is currently unavailable."
        );

    }

}


/* =========================================================
   CITIES
   ========================================================= */

async function loadCities() {

    const container =
        findContainer([
            "#citiesGrid",
            "#citiesContainer"
        ]);


    if (!container) {
        return;
    }


    showLoading(
        container,
        "Loading cities..."
    );


    try {

        const data =
            await fetchApi(
                "cities"
            );


        renderData(
            container,
            data,
            "cities"
        );


    } catch (error) {

        console.error(
            "Cities API error:",
            error
        );


        showApiError(
            container,
            "Cities service is currently unavailable."
        );

    }

}


/* =========================================================
   GLOBAL PLATFORM ACTIONS
   ========================================================= */

function initializeGlobalActions() {

    document.addEventListener(
        "click",
        function (event) {

            const actionElement =
                event.target.closest(
                    "[data-action]"
                );


            if (!actionElement) {
                return;
            }


            const action =
                actionElement.dataset.action;


            switch (action) {

                case "tourism":
                    loadTourism();
                    break;


                case "businesses":
                    loadBusinesses();
                    break;


                case "restaurants":
                    loadBusinesses();
                    break;


                case "products":
                    loadProducts();
                    break;


                case "countries":
                    loadCountries();
                    break;


                case "cities":
                    loadCities();
                    break;

            }

        }
    );

}


/* =========================================================
   EXISTING PROJECTS
   ========================================================= */

async function loadProjects() {

    const grid =
        document.getElementById(
            "projectsGrid"
        );


    if (!grid) {
        return;
    }


    try {

        const response =
            await fetch(
                "projects.json"
            );


        if (!response.ok) {

            throw new Error(
                `Projects request failed: ${response.status}`
            );

        }


        const projects =
            await response.json();


        grid.innerHTML = "";


        if (
            !Array.isArray(projects) ||
            projects.length === 0
        ) {

            grid.innerHTML = `
                <div class="card">
                    <p>No projects available.</p>
                </div>
            `;

            return;

        }


        projects.forEach(
            project => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card project-card";


                const features =
                    Array.isArray(
                        project.features
                    )
                        ? project.features
                        : [];


                card.innerHTML = `

                    ${
                        project.image
                            ? `
                                <img
                                    src="${escapeHtml(project.image)}"
                                    alt="${escapeHtml(project.name || "Project")}"
                                    loading="lazy"
                                >
                              `
                            : ""
                    }

                    <h3>
                        ${escapeHtml(
                            project.name
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            project.status
                        )}
                    </p>

                    <p>
                        ${escapeHtml(
                            project.level
                        )}
                    </p>

                    ${
                        features.length
                            ? `
                                <ul>
                                    ${
                                        features
                                            .map(
                                                item =>
                                                    `<li>${escapeHtml(item)}</li>`
                                            )
                                            .join("")
                                    }
                                </ul>
                              `
                            : ""
                    }

                    ${
                        project.page
                            ? `
                                <a href="${escapeHtml(project.page)}">
                                    View Project
                                </a>
                              `
                            : ""
                    }

                `;


                grid.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Projects loading error:",
            error
        );


        grid.innerHTML = `
            <div class="card error-card">
                <p>
                    Projects could not be loaded.
                </p>
            </div>
        `;

    }

}


/* =========================================================
   PROJECT SEARCH
   ========================================================= */

function initializeSearch() {

    const searchBox =
        document.getElementById(
            "searchBox"
        );


    if (!searchBox) {
        return;
    }


    searchBox.addEventListener(
        "input",
        function () {

            const value =
                this.value
                    .trim()
                    .toLowerCase();


            const cards =
                document.querySelectorAll(
                    ".project-card"
                );


            cards.forEach(
                card => {

                    const text =
                        card.textContent
                            .toLowerCase();


                    card.style.display =
                        text.includes(value)
                            ? ""
                            : "none";

                }
            );

        }
    );

}


/* =========================================================
   SERVICE WORKER
   ========================================================= */

function initializeServiceWorker() {

    if (
        !("serviceWorker" in navigator)
    ) {
        return;
    }


    window.addEventListener(
        "load",
        function () {

            const serviceWorkerUrl =
                new URL(
                    "service-worker.js",
                    document.baseURI
                );


            navigator.serviceWorker
                .register(
                    serviceWorkerUrl.pathname
                )
                .catch(
                    error => {

                        console.warn(
                            "Service Worker registration failed:",
                            error
                        );

                    }
                );

        }
    );

}


/* =========================================================
   GLOBAL FUNCTIONS
   =========================================================
   These allow existing inline HTML buttons such as:

   onclick="loadTourism()"
   onclick="loadBusinesses()"
   onclick="loadProducts()"

   to work.
   ========================================================= */

window.loadTourism =
    loadTourism;

window.loadBusinesses =
    loadBusinesses;

window.loadRestaurants =
    loadBusinesses;

window.loadProducts =
    loadProducts;

window.loadCountries =
    loadCountries;

window.loadCities =
    loadCities;


/* =========================================================
   APPLICATION START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeLanguage();

        initializeDarkMode();

        initializeGlobalActions();

        initializeSearch();

        loadProjects();

        initializeServiceWorker();

    }
);
/* =========================================================
   GLOBAL PLATFORM BUTTONS
   Connects the new HTML platform cards to existing functions.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const platformActions =
        document.querySelectorAll(
            "[data-platform-action]"
        );

    platformActions.forEach(function (button) {

        button.addEventListener(
            "click",
            async function () {

                const action =
                    this.dataset.platformAction;

                if (action === "tourism") {

                    await loadTourism();

                }

                else if (action === "businesses") {

                    await loadBusinesses();

                }

                else if (action === "products") {

                    await loadProducts();

                }

                else if (action === "search") {

                    if (typeof openSearch === "function") {

                        openSearch();

                    } else {

                        const searchBox =
                            document.getElementById(
                                "searchBox"
                            );

                        if (searchBox) {

                            searchBox.focus();

                            searchBox.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });

                        }

                    }

                }

            }

        );

    });

});
