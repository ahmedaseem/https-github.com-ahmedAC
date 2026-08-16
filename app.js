"use strict";

/*
 * ============================================================
 * ASEM DIGITAL SOLUTIONS
 * GLOBAL PLATFORM CONTROLLER
 * ============================================================
 *
 * HTML compatible controller
 *
 * ✓ Tourism
 * ✓ Businesses
 * ✓ Products
 * ✓ Projects
 * ✓ Portfolio
 * ✓ Services
 * ✓ Contact
 * ✓ Global Search
 * ✓ GPS
 * ✓ Nearby filtering
 * ✓ Dark / Light mode
 * ✓ All HTML languages
 * ✓ Keyboard accessibility
 * ✓ API loading
 * ✓ PostgreSQL backend
 * ✓ Safe HTML rendering
 *
 * Payment systems intentionally disabled for testing phase.
 * ============================================================
 */

(() => {

    "use strict";


    /* =========================================================
       CONFIGURATION
       ========================================================= */

    `${ASEM.api.nearby}?${params}`


    /* =========================================================
       CONFIGURATION
       ========================================================= */

    const ASEM = {

    api: {

        tourism: "/api/tourism",

        businesses: "/api/businesses",

        products: "/api/products",

        projects: "/api/projects",

        search: "/api/search",

        nearby: "/api/nearby"
    },


    storage: {

        theme: "asem-theme",

        language: "asem-language",

        location: "asem-location"
    },


    timeout: 15000,


    gps: {

        enabled: false,

        latitude: null,

        longitude: null,

        accuracy: null
    },


    state: {

        searchQuery: "",

        searchType: "all",

        searchResults: [],

        locationEnabled: false,

        searching: false,

        datasets: {

            tourism: [],

            businesses: [],

            products: [],

            projects: []
        }
    }
};

    


       

     


    /* =========================================================
       DOM HELPERS
       ========================================================= */

    const $ = (
        selector,
        root = document
    ) => root.querySelector(selector);


    const $$ = (
        selector,
        root = document
    ) => Array.from(
        root.querySelectorAll(selector)
    );


    /* =========================================================
       SECURITY
       ========================================================= */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function safeURL(value) {

        if (!value) {
            return "";
        }

        try {

            const base =
    typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost";

const url = new URL(
    String(value),
    base
);

            if (
                url.protocol !== "http:" &&
                url.protocol !== "https:"
            ) {
                return "";
            }

            return url.href;

        } catch (_) {

            return "";
        }
    }


    /* =========================================================
       NORMALIZE API DATA
       ========================================================= */

    function normalizeArray(data) {

        if (Array.isArray(data)) {
            return data;
        }

        if (
            !data ||
            typeof data !== "object"
        ) {
            return [];
        }

        const possibleKeys = [
            "data",
            "items",
            "results",
            "tourism",
            "businesses",
            "products",
            "projects"
        ];

        for (
            const key of possibleKeys
        ) {

            if (
                Array.isArray(data[key])
            ) {

                return data[key];
            }
        }

        return [];
    }


    /* =========================================================
       API REQUEST
       ========================================================= */

    async function apiRequest(
        url,
        options = {}
    ) {

        const controller =
            new AbortController();


        const timeout =
            setTimeout(
                () => controller.abort(),
                options.timeout ||
                ASEM.timeout
            );


        try {

            const response =
                await fetch(
                    url,
                    {
                        method:
                            options.method ||
                            "GET",

                        headers: {
                            "Accept":
                                "application/json",

                            ...(options.headers || {})
                        },

                        credentials:
                            "same-origin",

                        cache:
                            "no-store",

                        signal:
                            controller.signal,

                        body:
                            options.body
                    }
                );


            if (!response.ok) {

                let message =
                    `HTTP ${response.status}`;


                try {

                    const error =
                        await response.json();

                    if (error.message) {
                        message =
                            error.message;
                    }

                } catch (_) {}


                throw new Error(message);
            }


            return await response.json();

        } finally {

            clearTimeout(timeout);
        }
    }


    /* =========================================================
       UI STATES
       ========================================================= */

    function showLoading(
        grid,
        title
    ) {

        if (!grid) {
            return;
        }

        grid.innerHTML = `

            <article class="card platform-state">

                <div
                    class="platform-card-icon"
                    aria-hidden="true">
                    ⏳
                </div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    Please wait...
                </p>

            </article>
        `;
    }


    function showEmpty(
        grid,
        title,
        message
    ) {

        if (!grid) {
            return;
        }

        grid.innerHTML = `

            <article class="card platform-state">

                <div
                    class="platform-card-icon"
                    aria-hidden="true">
                    🌐
                </div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>

            </article>
        `;
    }


    function showError(
        grid,
        title,
        message,
        retryAction = ""
    ) {

        if (!grid) {
            return;
        }

        grid.innerHTML = `

            <article class="card platform-state">

                <div
                    class="platform-card-icon"
                    aria-hidden="true">
                    ⚠️
                </div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>

                ${
                    retryAction
                    ? `
                        <button
                            type="button"
                            class="btn"
                            data-retry="${escapeHTML(
                                retryAction
                            )}">
                            Retry
                        </button>
                    `
                    : ""
                }

            </article>
        `;
    }


    /* =========================================================
       IMAGE
       ========================================================= */

    function imageHTML(
        image,
        name,
        fallback
    ) {

        const url =
            safeURL(image);


        if (!url) {

            return `

                <div
                    class="platform-card-icon"
                    aria-hidden="true">

                    ${fallback}

                </div>
            `;
        }


        return `

            <img
                src="${escapeHTML(url)}"
                alt="${escapeHTML(name)}"
                loading="lazy"
                class="platform-card-image"
                referrerpolicy="no-referrer"
                onerror="this.style.display='none';"
            >
        `;
    }


    /* =========================================================
       TOURISM CARD
       ========================================================= */

    function buildTourismCard(item) {

        const name =
            item.name ||
            "Tourism Destination";


        const description =
            item.description ||
            "Discover this destination.";


        const category =
            item.category ||
            "Tourism";


        return `

            <article
                class="card platform-result-card"
                tabindex="0"
                data-type="tourism"
                data-id="${escapeHTML(item.id || "")}">

                ${imageHTML(
                    item.image,
                    name,
                    "🏝️"
                )}

                <div class="platform-card-content">

                    <span class="platform-card-category">
                        ${escapeHTML(category)}
                    </span>

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(description)}
                    </p>

                    ${
                        item.location
                        ? `
                            <small>
                                📍 ${escapeHTML(
                                    item.location
                                )}
                            </small>
                        `
                        : ""
                    }

                    ${
                        item.latitude !== null &&
                        item.longitude !== null
                        ? `
                            <small>
                                🌐 GPS available
                            </small>
                        `
                        : ""
                    }

                    ${
                        item.rating !== undefined &&
                        item.rating !== null
                        ? `
                            <div class="platform-rating">
                                ⭐ ${escapeHTML(
                                    item.rating
                                )}
                            </div>
                        `
                        : ""
                    }

                </div>

            </article>
        `;
    }


    /* =========================================================
       BUSINESS CARD
       ========================================================= */

    function buildBusinessCard(item) {

        const name =
            item.name ||
            "Global Business";


        const description =
            item.description ||
            "Discover this business.";


        const category =
            item.category ||
            "Business";


        return `

            <article
                class="card platform-result-card"
                tabindex="0"
                data-type="business"
                data-id="${escapeHTML(item.id || "")}">

                ${imageHTML(
                    item.logo ||
                    item.cover_image,
                    name,
                    "🌍"
                )}

                <div class="platform-card-content">

                    <span class="platform-card-category">
                        ${escapeHTML(category)}
                    </span>

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(description)}
                    </p>

                    ${
                        item.address
                        ? `
                            <small>
                                📍 ${escapeHTML(
                                    item.address
                                )}
                            </small>
                        `
                        : ""
                    }

                    ${
                        item.rating !== undefined &&
                        item.rating !== null
                        ? `
                            <div class="platform-rating">
                                ⭐ ${escapeHTML(
                                    item.rating
                                )}
                            </div>
                        `
                        : ""
                    }

                    ${
                        item.distance !== undefined
                        ? `
                            <small>
                                📏 ${escapeHTML(
                                    item.distance
                                )} km away
                            </small>
                        `
                        : ""
                    }

                </div>

            </article>
        `;
    }


    /* =========================================================
       PRODUCT CARD
       ========================================================= */

    function buildProductCard(item) {

        const name =
            item.name ||
            "Global Product";


        const description =
            item.description ||
            "Discover this product.";


        const category =
            item.category ||
            "Product";


        return `

            <article
                class="card platform-result-card"
                tabindex="0"
                data-type="product"
                data-id="${escapeHTML(item.id || "")}">

                ${imageHTML(
                    item.image,
                    name,
                    "🛒"
                )}

                <div class="platform-card-content">

                    <span class="platform-card-category">
                        ${escapeHTML(category)}
                    </span>

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(description)}
                    </p>

                    ${
                        item.price !== undefined &&
                        item.price !== null
                        ? `
                            <strong class="product-price">
                                ${escapeHTML(
                                    item.price
                                )}
                                ${escapeHTML(
                                    item.currency ||
                                    "USD"
                                )}
                            </strong>
                        `
                        : ""
                    }

                    ${
                        item.distance !== undefined
                        ? `
                            <small>
                                📏 ${escapeHTML(
                                    item.distance
                                )} km away
                            </small>
                        `
                        : ""
                    }

                </div>

            </article>
        `;
    }


    /* =========================================================
       PROJECT CARD
       ========================================================= */

    function buildProjectCard(item) {

        const name =
            item.name ||
            "ASEM Project";


        const description =
            item.description ||
            "ASEM Digital Solutions project.";


        return `

            <article
                class="card project-card"
                tabindex="0"
                data-type="project"
                data-id="${escapeHTML(item.id || "")}">

                ${imageHTML(
                    item.image,
                    name,
                    "🚀"
                )}

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

            </article>
        `;
    }


    /* =========================================================
       SEARCH CARD
       ========================================================= */

    function buildSearchCard(item) {

        const type =
            String(
                item.type || ""
            ).toLowerCase();


        if (type === "tourism") {
            return buildTourismCard(item);
        }


        if (
            type === "business" ||
            type === "businesses"
        ) {
            return buildBusinessCard(item);
        }


        if (
            type === "product" ||
            type === "products"
        ) {
            return buildProductCard(item);
        }


        if (type === "project") {
            return buildProjectCard(item);
        }


        return `

            <article class="card platform-result-card">

                <div class="platform-card-icon">
                    🌐
                </div>

                <h3>
                    ${escapeHTML(
                        item.name ||
                        "Platform Result"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        item.description || ""
                    )}
                </p>

            </article>
        `;
    }


    /* =========================================================
       RENDER
       ========================================================= */

    function renderGrid(
        grid,
        items,
        builder,
        emptyTitle,
        emptyMessage
    ) {

        if (!grid) {
            return;
        }


        if (!items.length) {

            showEmpty(
                grid,
                emptyTitle,
                emptyMessage
            );

            return;
        }


        grid.innerHTML =
            items
                .map(builder)
                .join("");
    }


    /* =========================================================
       LOAD TOURISM
       ========================================================= */

    async function loadTourism() {

        const grid =
            $("#tourismGrid");


        const section =
            $("#tourism-section");


        if (!grid) {
            return;
        }


        if (section) {
            section.hidden = false;
        }


        showLoading(
            grid,
            "Loading Global Tourism..."
        );


        try {

            const data =
                await apiRequest(
                    ASEM.api.tourism
                );


            const items =
                normalizeArray(data);


            ASEM.state.datasets.tourism =
                items;


            renderGrid(
                grid,
                items,
                buildTourismCard,
                "No Tourism Results",
                "Tourism destinations will appear here."
            );


            if (section) {

                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        } catch (error) {

            console.error(
                "Tourism error:",
                error
            );


            showError(
                grid,
                "Tourism unavailable",
                error.message,
                "tourism"
            );
        }
    }


    /* =========================================================
       LOAD BUSINESSES
       ========================================================= */

    async function loadBusinesses() {

        const grid =
            $("#businessesGrid");


        const section =
            $("#businesses-section");


        if (!grid) {
            return;
        }


        if (section) {
            section.hidden = false;
        }


        showLoading(
            grid,
            "Loading Global Businesses..."
        );


        try {

            const data =
                await apiRequest(
                    ASEM.api.businesses
                );


            const items =
                normalizeArray(data);


            ASEM.state.datasets.businesses =
                items;


            renderGrid(
                grid,
                items,
                buildBusinessCard,
                "No Businesses",
                "Businesses will appear here."
            );


            if (section) {

                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        } catch (error) {

            console.error(
                "Businesses error:",
                error
            );


            showError(
                grid,
                "Businesses unavailable",
                error.message,
                "businesses"
            );
        }
    }


    /* =========================================================
       LOAD PRODUCTS
       ========================================================= */

    async function loadProducts() {

        const grid =
            $("#productsGrid");


        const section =
            $("#products-section");


        if (!grid) {
            return;
        }


        if (section) {
            section.hidden = false;
        }


        showLoading(
            grid,
            "Loading Global Products..."
        );


        try {

            const data =
                await apiRequest(
                    ASEM.api.products
                );


            const items =
                normalizeArray(data);


            ASEM.state.datasets.products =
                items;


            renderGrid(
                grid,
                items,
                buildProductCard,
                "No Products",
                "Products will appear here."
            );


            if (section) {

                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        } catch (error) {

            console.error(
                "Products error:",
                error
            );


            showError(
                grid,
                "Products unavailable",
                error.message,
                "products"
            );
        }
    }


    /* =========================================================
       LOAD PROJECTS
       ========================================================= */

    async function loadProjects() {

        const grid =
            $("#projectsGrid");


        if (!grid) {
            return;
        }


        showLoading(
            grid,
            "Loading ASEM Projects..."
        );


        try {

            const data =
                await apiRequest(
                    ASEM.api.projects
                );


            const items =
                normalizeArray(data);


            ASEM.state.datasets.projects =
                items;


            renderGrid(
                grid,
                items,
                buildProjectCard,
                "No Projects",
                "ASEM projects will appear here."
            );

        } catch (error) {

            console.error(
                "Projects error:",
                error
            );


            showError(
                grid,
                "Projects unavailable",
                error.message,
                "projects"
            )
        }
    }


    

          /* =========================================================
            GPS
           ========================================================= */

    function updateLocationUI() {

        const buttons =
            $$(
                "[data-platform-action='location'], [data-platform-action='gps']"
            );


        buttons.forEach(button => {

            button.classList.toggle(
                "active",
                ASEM.state.locationEnabled
            );


            if (
                ASEM.state.locationEnabled
            ) {

                button.setAttribute(
                    "aria-label",
                    "Location enabled"
                );

            } else {

                button.setAttribute(
                    "aria-label",
                    "Use my location"
                );
            }
        });


        const status =
            $(
                "#locationStatus"
            );


        if (!status) {
            return;
        }


        if (
            ASEM.state.locationEnabled
        ) {

            status.textContent =
                "📍 Location enabled";

        } else {

            status.textContent =
                "Location not enabled";
        }
    }


    function getCurrentLocation() {

        return new Promise(
            (resolve, reject) => {

                if (
                    !navigator.geolocation
                ) {

                    reject(
                        new Error(
                            "Geolocation is not supported by this browser."
                        )
                    );

                    return;
                }


                navigator.geolocation.getCurrentPosition(
                    position => {

                        const coords =
                            position.coords;


                        ASEM.gps = {

                            enabled: true,

                            latitude:
                                coords.latitude,

                            longitude:
                                coords.longitude,

                            accuracy:
                                coords.accuracy
                        };


                        ASEM.state
                            .locationEnabled =
                            true;


                        try {

                            localStorage.setItem(
                                ASEM.storage.location,
                                JSON.stringify(
                                    ASEM.gps
                                )
                            );

                        } catch (_) {}


                        updateLocationUI();

                        resolve(
                            ASEM.gps
                        );
                    },

                    error => {

                        let message =
                            "Unable to determine your location.";

                        if (
                            error.code ===
                            1
                        ) {
                            message =
                                "Location permission was denied.";
                        }

                        if (
                            error.code ===
                            2
                        ) {
                            message =
                                "Your location could not be determined.";
                        }

                        if (
                            error.code ===
                            3
                        ) {
                            message =
                                "Location request timed out.";
                        }

                        reject(
                            new Error(message)
                        );
                    },

                    {
                        enableHighAccuracy:
                            true,

                        timeout:
                            10000,

                        maximumAge:
                            60000
                    }
                );
            }
        );
    }


    async function enableGPS() {

        try {

            await getCurrentLocation();

            await searchNearby();

        } catch (error) {

            console.warn(
                "ASEM GPS:",
                error
            );

            showLocationMessage(
                error.message
            );
        }
    }


    function showLocationMessage(
        message
    ) {

        const status =
            $(
                "#locationStatus"
            );

        if (status) {
            status.textContent =
                `⚠️ ${message}`;
        }
    }


    async function searchNearby() {

        const grid =
            $(
                "#searchGrid"
            ) ||
            $(
                "#platformSearchGrid"
            );


        if (!grid) {
            return;
        }


        if (
            !ASEM.gps.latitude ||
            !ASEM.gps.longitude
        ) {

            await getCurrentLocation();
        }


        showLoading(
            grid,
            "Finding nearby results..."
        );


        const params =
            new URLSearchParams({

                lat:
                    ASEM.gps.latitude,

                lng:
                    ASEM.gps.longitude,

                radius:
                    "25",

                type:
                    ASEM.state.searchType ||
                    "all"
            });


        try {

            const data =
                await apiRequest(
                    `${ASEM.api.nearby}?${params}`
                );


            const results =
                normalizeArray(data);


            renderSearchResults(
                results,
                "No nearby results",
                "There are no platform results within the selected area."
            );


        } catch (error) {

            console.error(
                "ASEM Nearby:",
                error
            );


            showError(
                grid,
                "Nearby search unavailable",
                error.message,
                "location"
            );
        }
    }

    /* =========================================================
       SEARCH
       ========================================================= */

    let searchController = null;


    function openSearchSection() {

        const section =
            $("#platform-search-results");


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


    async function performSearch(
        query
    ) {

        const value =
            String(query || "")
                .trim();


        ASEM.state.searchQuery =
            value;


        if (!value) {

            renderSearchResults(
                [],
                "Global Search",
                "Enter a search term to search the ASEM platform."
            );

            openSearchSection();

            return;
        }


        const grid =
            $("#searchGrid");


        if (!grid) {
            return;
        }


        openSearchSection();


        if (searchController) {

            searchController.abort();
        }


        searchController =
            new AbortController();


        ASEM.state.searching =
            true;


        showLoading(
            grid,
            "Searching the ASEM platform..."
        );


        const params =
            new URLSearchParams();


        params.set(
            "q",
            value
        );


        params.set(
            "type",
            ASEM.state.searchType
        );


        try {

            const data =
                await apiRequest(
                    `${ASEM.api.search}?${params.toString()}`
                );


            const results =
                normalizeArray(data);


            ASEM.state.searchResults =
                results;


            renderSearchResults(
                results,
                "No Results",
                `No results found for "${value}".`
            );

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {
                return;
            }


            console.error(
                "ASEM Search:",
                error
            );


            showError(
                grid,
                "Search unavailable",
                error.message,
                "search"
            );

        } finally {

            ASEM.state.searching =
                false;
        }
    }


    function renderSearchResults(
        results,
        title,
        message
    ) {

        const grid =
            $("#searchGrid");


        if (!grid) {
            return;
        }


        if (!results.length) {

            showEmpty(
                grid,
                title,
                message
            );

            return;
        }


        grid.innerHTML =
            results
                .map(buildSearchCard)
                .join("");
    }


    /* =========================================================
       SEARCH INPUT
       ========================================================= */

    function initializeSearch() {

        const input =
            $("#searchBox");


        if (!input) {
            return;
        }


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    performSearch(
                        input.value
                    );
                }


                if (
                    event.key === "Escape"
                ) {

                    input.value = "";

                    renderSearchResults(
                        [],
                        "Global Search",
                        "Enter a search term to search the platform."
                    );
                }
            }
        );


        input.addEventListener(
            "input",
            event => {

                searchLocal(
                    event.target.value
                );
            }
        );
    }


    function searchLocal(
        value
    ) {

        const query =
            String(value || "")
                .toLowerCase()
                .trim();


        const cards =
            $$(
                ".platform-result-card, .project-card"
            );


        cards.forEach(card => {

            if (!query) {

                card.hidden = false;

                return;
            }


            card.hidden =
                !card.textContent
                    .toLowerCase()
                    .includes(query);
        });
    }


    /* =========================================================
       THEME
       ========================================================= */

    function applyTheme(
        theme
    ) {

        const finalTheme =
            theme === "dark"
                ? "dark"
                : "light";


        document.documentElement
            .setAttribute(
                "data-theme",
                finalTheme
            );


        const button =
            $("#themeToggle");


        if (button) {

            const dark =
                finalTheme === "dark";


            button.textContent =
                dark
                    ? "☀️"
                    : "🌙";


            button.setAttribute(
                "aria-label",
                dark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }


        try {

            localStorage.setItem(
                ASEM.storage.theme,
                finalTheme
            );

        } catch (_) {}
    }


    function initializeTheme() {

        let saved = null;


        try {

            saved =
                localStorage.getItem(
                    ASEM.storage.theme
                );

        } catch (_) {}


        if (
            saved === "dark" ||
            saved === "light"
        ) {

            applyTheme(saved);

            return;
        }


        const prefersDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        applyTheme(
            prefersDark
                ? "dark"
                : "light"
        );
    }


    function toggleTheme() {

        const current =
            document.documentElement
                .getAttribute(
                    "data-theme"
                );


        applyTheme(
            current === "dark"
                ? "light"
                : "dark"
        );
    }


    /* =========================================================
       LANGUAGES
       ========================================================= */

    function applyLanguage(
        language
    ) {

        const supported = [
            "auto",
            "ar",
            "en",
            "fr",
            "de",
            "it",
            "es",
            "nl"
        ];


        const selected =
            supported.includes(language)
                ? language
                : "auto";


        let finalLanguage =
            selected;


        if (
            selected === "auto"
        ) {

            finalLanguage =
                (
                    navigator.language ||
                    "en"
                )
                .substring(0, 2);


            if (
                !supported.includes(
                    finalLanguage
                )
            ) {

                finalLanguage =
                    "en";
            }
        }


        document.documentElement
            .setAttribute(
                "lang",
                finalLanguage
            );


        document.documentElement
            .setAttribute(
                "dir",
                finalLanguage === "ar"
                    ? "rtl"
                    : "ltr"
            );


        try {

            localStorage.setItem(
                ASEM.storage.language,
                selected
            );

        } catch (_) {}


        document.dispatchEvent(
            new CustomEvent(
                "asem:languagechange",
                {
                    detail: {
                        language:
                            finalLanguage
                    }
                }
            )
        );
    }


    function initializeLanguage() {

        const select =
            $("#langSwitch");


        if (!select) {
            return;
        }


        let saved =
            "auto";


        try {

            saved =
                localStorage.getItem(
                    ASEM.storage.language
                ) ||
                "auto";

        } catch (_) {}


        const optionExists =
            Array.from(
                select.options
            )
            .some(
                option =>
                    option.value === saved
            );


        if (optionExists) {

            select.value =
                saved;
        }


        applyLanguage(
            select.value
        );


        select.addEventListener(
            "change",
            event => {

                applyLanguage(
                    event.target.value
                );
            }
        );
    }


    /* =========================================================
       ACTIONS
       ========================================================= */

    const actions = {

        tourism:
            loadTourism,


        businesses:
            loadBusinesses,


        products:
            loadProducts,


        projects:
            async () => {

                const section =
                    $("#projects");

                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth"
                    });
                }

                await loadProjects();
            },


        portfolio:
            () => {

                const section =
                    $("#portfolio");

                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            },


        services:
            () => {

                const section =
                    $("#services");

                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            },


        contact:
            () => {

                window.location.href =
                    "contact.html";
            },


        about:
            () => {

                window.location.href =
                    "about.html";
            },


        search:
            () => {

                const input =
                    $("#searchBox");

                if (input) {

                    input.focus();

                    openSearchSection();
                }
            },


        location:
            enableGPS,


        gps:
            enableGPS,


        nearby:
            enableGPS,


        top:
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
    };


    /* =========================================================
       ACTION ROUTING
       ========================================================= */

    function getAction(
        element
    ) {

        if (!element) {
            return null;
        }


        if (
            element.dataset &&
            element.dataset.platformAction
        ) {

            return element.dataset
                .platformAction;
        }


        if (
            element.dataset &&
            element.dataset.section
        ) {

            const map = {

                "tourism-section":
                    "tourism",

                "businesses-section":
                    "businesses",

                "products-section":
                    "products",

                "projects":
                    "projects",

                "portfolio":
                    "portfolio",

                "services":
                    "services",

                "contact":
                    "contact",

                "about":
                    "about"
            };


            return map[
                element.dataset.section
            ] || null;
        }


        return null;
    }


    function initializeClickRouter() {

        document.addEventListener(
            "click",
            event => {

                const retry =
                    event.target.closest(
                        "[data-retry]"
                    );


                if (retry) {

                    const action =
                        retry.dataset.retry;


                    if (
                        typeof actions[action] ===
                        "function"
                    ) {

                        event.preventDefault();

                        actions[action]();
                    }

                    return;
                }


                const themeButton =
                    event.target.closest(
                        "#themeToggle"
                    );


                if (themeButton) {

                    event.preventDefault();

                    toggleTheme();

                    return;
                }


                const actionElement =
                    event.target.closest(
                        "[data-platform-action], [data-section]"
                    );


                if (!actionElement) {
                    return;
                }


                if (
                    event.ctrlKey ||
                    event.metaKey ||
                    event.shiftKey ||
                    event.altKey
                ) {
                    return;
                }


                const action =
                    getAction(
                        actionElement
                    );


                if (
                    typeof actions[action] ===
                    "function"
                ) {

                    event.preventDefault();

                    actions[action]();
                }
            }
        );
    }

          /* =========================================================
                    document.addEventListener
             ========================================================= *

                       "click",
                      event => {

        const mapButton =
            event.target.closest(
                "[data-open-map]"
            );


        if (mapButton) {

            event.preventDefault();

            const card =
                mapButton.closest(
                    ".platform-result-card"
                );


            if (card) {
                openMapForElement(card);
            }

            });
          }

               return;


        const card =
            event.target.closest(
                ".platform-result-card"
            );


        if (!card) {
            return;
        }


      
        /*
         * Don't intercept a nested
         * button/link.
         */
        if (!card) {
            return;
        }


        /*
         * Don't intercept a nested
         * button/link.
         */
        if (
            event.target.closest(
                "button, a"
            )
        ) {
            return;
        }


        openMapForElement(card);
    }
);
    /* =========================================================
       KEYBOARD
       ========================================================= */

    function initializeKeyboard() {

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {
                    return;
                }


                const element =
                    event.target.closest(
                        "[data-platform-action], [data-section]"
                    );


                if (!element) {
                    return;
                }


                event.preventDefault();


                const action =
                    getAction(element);


                if (
                    typeof actions[action] ===
                    "function"
                ) {

                    actions[action]();
                }
            }
        );
    }


    /* =========================================================
       NAVIGATION
       ========================================================= */

    function initializeNavigation() {

        document.addEventListener(
            "click",
            event => {

                const link =
                    event.target.closest(
                        'a[href^="#"]'
                    );


                if (!link) {
                    return;
                }


                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }


                const id =
                    href.substring(1);


                const section =
                    document.getElementById(id);


                if (!section) {
                    return;
                }


                event.preventDefault();


                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    }


    /* =========================================================
       SCROLL TOP
       ========================================================= */

    function initializeScrollTop() {

        const button =
            $("#scrollTop");


        if (!button) {
            return;
        }


        function update() {

            button.hidden =
                window.scrollY <= 400;
        }


        window.addEventListener(
            "scroll",
            update,
            {
                passive: true
            }
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


    /* =========================================================
       HIDE RESULT SECTIONS
       ========================================================= */

    function initializeResultSections() {

        [
            "tourism-section",
            "businesses-section",
            "products-section"
        ]
        .forEach(id => {

            const element =
                document.getElementById(id);


            if (element) {

                element.hidden =
                    true;
            }
        });
    }


    /* =========================================================
       INITIAL LOAD
       ========================================================= */

    async function preloadPlatformData() {

        /*
         * Load data silently.
         *
         * This makes GPS nearby search work
         * without requiring /api/nearby.
         */

        const requests = [

            apiRequest(
                ASEM.api.tourism
            ),

            apiRequest(
                ASEM.api.businesses
            ),

            apiRequest(
                ASEM.api.products
            ),

            apiRequest(
                ASEM.api.projects
            )
        ];


        try {

            const [
                tourism,
                businesses,
                products,
                projects
            ] = await Promise.all(
                requests
            );


            ASEM.state.datasets.tourism =
                normalizeArray(tourism);


            ASEM.state.datasets.businesses =
                normalizeArray(businesses);


            ASEM.state.datasets.products =
                normalizeArray(products);


            ASEM.state.datasets.projects =
                normalizeArray(projects);


            console.info(
                "ASEM platform data loaded.",
                {
                    tourism:
                        ASEM.state.datasets.tourism.length,

                    businesses:
                        ASEM.state.datasets.businesses.length,

                    products:
                        ASEM.state.datasets.products.length,

                    projects:
                        ASEM.state.datasets.projects.length
                }
            );

        } catch (error) {

            console.warn(
                "ASEM preload:",
                error
            );
        }
    }


    /* =========================================================
       GLOBAL API
       ========================================================= */

                 if (typeof window !== "undefined") {
    window.ASEM = ASEM;
    window.loadTourism = loadTourism;
    window.loadBusinesses = loadBusinesses;
    window.loadProducts = loadProducts;
    window.loadProjects = loadProjects;
    window.performASEMSearch = performSearch;
    window.enableASEMGPS = enableGPS;
    window.searchASEMNearby = enableGPS;
    window.toggleASEMTheme = toggleTheme;
}                



    /* =========================================================
       START
       ========================================================= */

    async function initializeApplication() {

        initializeTheme();

        initializeLanguage();

        initializeSearch();

        initializeClickRouter();

        initializeKeyboard();

        initializeNavigation();

        initializeScrollTop();

        initializeResultSections();

        updateLocationUI();


        console.info(
            "ASEM Global Platform initialized."
        );


        /*
         * Database/API preload.
         */







if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeApplication,
            {
                once: true
            }
        );

    } else {

        initializeApplication();
    }

}
