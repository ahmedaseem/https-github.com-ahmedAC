"use strict";

/*
 * ============================================================
 * ASEM DIGITAL SOLUTIONS
 * GLOBAL PLATFORM CONTROLLER v2
 * ============================================================
 *
 * Features
 * ------------------------------------------------------------
 * ✓ Tourism
 * ✓ Businesses
 * ✓ Products
 * ✓ Projects
 * ✓ Unified platform search
 * ✓ GPS / browser geolocation
 * ✓ Nearby businesses/products/tourism
 * ✓ Search by text
 * ✓ Search by category
 * ✓ Search by location
 * ✓ Search by GPS coordinates
 * ✓ Theme
 * ✓ Language
 * ✓ Scroll-to-top
 * ✓ Legacy data-section support
 * ✓ New data-platform-action support
 * ✓ Keyboard accessibility
 * ✓ Dynamic API cards
 * ✓ Event delegation
 * ✓ Retry handling
 * ✓ API timeout handling
 * ✓ Abort previous searches
 * ✓ Safe HTML escaping
 *
 * Backend expected:
 *
 * GET /api/tourism
 * GET /api/businesses
 * GET /api/products
 * GET /api/projects
 * GET /api/search?q=...
 * GET /api/nearby?lat=...&lng=...&radius=...
 * ============================================================
 */

(() => {
    "use strict";

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
            searching: false
        }
    };


    /* =========================================================
       DOM
       ========================================================= */

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        Array.from(root.querySelectorAll(selector));


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

            const url =
                new URL(
                    String(value),
                    window.location.origin
                );

            if (
                ![
                    "http:",
                    "https:"
                ].includes(url.protocol)
            ) {
                return "";
            }

            return url.href;

        } catch (_) {

            return "";
        }
    }


    /* =========================================================
       ARRAY NORMALIZATION
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

        const keys = [
            "data",
            "items",
            "results",
            "tourism",
            "businesses",
            "products",
            "projects"
        ];

        for (const key of keys) {

            if (Array.isArray(data[key])) {
                return data[key];
            }
        }

        return [];
    }


    /* =========================================================
       API
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

                        body:
                            options.body,

                        credentials: "same-origin",

                        cache: "no-store",

                        signal:
                            controller.signal
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
       SECTIONS
       ========================================================= */

    function findSection(type) {

        const names = {
            tourism: [
                "tourism-section",
                "tourism-results"
            ],

            businesses: [
                "businesses-section",
                "businesses-results"
            ],

            products: [
                "products-section",
                "products-results"
            ],

            projects: [
                "projects"
            ],

            portfolio: [
                "portfolio"
            ],

            services: [
                "services"
            ],

            contact: [
                "contact"
            ],

            about: [
                "about"
            ],

            search: [
                "search-results",
                "platform-search-results"
            ]
        };


        for (
            const id of
            names[type] || []
        ) {

            const element =
                document.getElementById(id);

            if (element) {
                return element;
            }
        }

        return null;
    }


    function openPageSection(id) {

        const section =
            document.getElementById(id);

        if (!section) {
            console.warn(
                "ASEM: section not found:",
                id
            );

            return false;
        }


        section.hidden = false;

        section.removeAttribute(
            "aria-hidden"
        );


        requestAnimationFrame(() => {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

        return true;
    }


    function hideSection(id) {

        const section =
            document.getElementById(id);

        if (!section) {
            return;
        }

        section.hidden = true;

        section.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    /* =========================================================
       UI STATES
       ========================================================= */

    function showLoading(
        grid,
        message = "Loading..."
    ) {

        if (!grid) {
            return;
        }

        grid.innerHTML = `
            <article class="card platform-state">
                <div
                    class="loading-spinner"
                    aria-hidden="true">
                </div>

                <h3>
                    ${escapeHTML(message)}
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
        retry
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

                <button
                    type="button"
                    class="btn"
                    data-retry="${escapeHTML(retry)}">
                    Retry
                </button>

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
                onerror="this.remove()"
            >
        `;
    }


    /* =========================================================
       CARDS
       ========================================================= */

    function buildTourismCard(item) {

        const name =
            item.name ||
            item.title ||
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
                    item.image ||
                    item.photo,
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
                                📍 ${escapeHTML(item.location)}
                            </small>
                        `
                        : ""
                    }

                    ${
                        item.rating !== undefined
                        ? `
                            <div class="platform-rating">
                                ⭐ ${escapeHTML(item.rating)}
                            </div>
                        `
                        : ""
                    }

                </div>
            </article>
        `;
    }


    function buildBusinessCard(item) {

        const name =
            item.name ||
            item.title ||
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
                    item.cover_image ||
                    item.image,
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
                                📍 ${escapeHTML(item.address)}
                            </small>
                        `
                        : ""
                    }

                    ${
                        item.distance !== undefined
                        ? `
                            <small>
                                📏 ${escapeHTML(
                                    item.distance
                                )} km
                            </small>
                        `
                        : ""
                    }

                    ${
                        item.rating !== undefined
                        ? `
                            <div class="platform-rating">
                                ⭐ ${escapeHTML(item.rating)}
                            </div>
                        `
                        : ""
                    }

                </div>
            </article>
        `;
    }


    function buildProductCard(item) {

        const name =
            item.name ||
            item.title ||
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
                        item.price !== undefined
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
                                )} km
                            </small>
                        `
                        : ""
                    }

                </div>
            </article>
        `;
    }


    function buildProjectCard(item) {

        const name =
            item.name ||
            item.title ||
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


    function buildSearchCard(item) {

        const type =
            String(
                item.type ||
                item.entity_type ||
                ""
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
            <article
                class="card platform-result-card"
                tabindex="0"
                data-type="${escapeHTML(type)}"
                data-id="${escapeHTML(item.id || "")}">

                <div class="platform-card-icon">
                    🌐
                </div>

                <h3>
                    ${escapeHTML(
                        item.name ||
                        item.title ||
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
       LOADERS
       ========================================================= */

    async function loadEntity(
        type,
        gridID,
        sectionIDs,
        builder,
        title
    ) {

        const grid =
            getGrid(gridID);

        if (!grid) {
            return;
        }


        const section =
            sectionIDs
                .map(id =>
                    document.getElementById(id)
                )
                .find(Boolean);


        if (section) {
            section.hidden = false;
        }


        showLoading(
            grid,
            `Loading ${title}...`
        );


        try {

            const data =
                await apiRequest(
                    ASEM.api[type]
                );

            const items =
                normalizeArray(data);


            renderGrid(
                grid,
                items,
                builder,
                `No ${type} yet`,
                `${title} will appear here.`
            );


            if (section) {

                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }


        } catch (error) {

            console.error(
                `ASEM ${type}:`,
                error
            );


            showError(
                grid,
                `${title} unavailable`,
                `The ${title.toLowerCase()} service could not be reached.`,
                type
            );
        }
    }


    function getGrid(id) {

        return document.getElementById(id);
    }


    async function loadTourism() {

        return loadEntity(
            "tourism",
            "tourismGrid",
            [
                "tourism-section",
                "tourism-results"
            ],
            buildTourismCard,
            "Global Tourism"
        );
    }


    async function loadBusinesses() {

        return loadEntity(
            "businesses",
            "businessesGrid",
            [
                "businesses-section",
                "businesses-results"
            ],
            buildBusinessCard,
            "Global Businesses"
        );
    }


    async function loadProducts() {

        return loadEntity(
            "products",
            "productsGrid",
            [
                "products-section",
                "products-results"
            ],
            buildProductCard,
            "Global Products"
        );
    }


    async function loadProjects() {

        const grid =
            getGrid("projectsGrid");

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


            renderGrid(
                grid,
                items,
                buildProjectCard,
                "ASEM Projects",
                "Projects will appear here."
            );

        } catch (error) {

            console.warn(
                "ASEM Projects:",
                error
            );

            showEmpty(
                grid,
                "ASEM Projects",
                "The project showcase will appear here."
            );
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
       UNIFIED SEARCH
       ========================================================= */

    let searchController =
        null;


    async function performSearch(
        query
    ) {

        const value =
            String(query || "")
                .trim();


        ASEM.state.searchQuery =
            value;


        if (
            !value &&
            !ASEM.state.locationEnabled
        ) {

            return;
        }


        const grid =
            $(
                "#searchGrid"
            ) ||
            $(
                "#platformSearchGrid"
            );


        if (!grid) {

            console.warn(
                "ASEM: search grid not found."
            );

            return;
        }


        const section =
            findSection("search");


        if (section) {
            section.hidden = false;
        }


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


        if (value) {
            params.set(
                "q",
                value
            );
        }


        params.set(
            "type",
            ASEM.state.searchType ||
            "all"
        );


        if (
            ASEM.gps.latitude !== null &&
            ASEM.gps.longitude !== null
        ) {

            params.set(
                "lat",
                ASEM.gps.latitude
            );

            params.set(
                "lng",
                ASEM.gps.longitude
            );
        }


        try {

            const data =
                await apiRequest(
                    `${ASEM.api.search}?${params}`,
                    {
                        signal:
                            searchController.signal
                    }
                );


            const results =
                normalizeArray(data);


            ASEM.state.searchResults =
                results;


            renderSearchResults(
                results,
                "No results",
                `No results found for "${value}".`
            );


            if (section) {

                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }


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
                "The platform search service could not be reached.",
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
            $(
                "#searchGrid"
            ) ||
            $(
                "#platformSearchGrid"
            );


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
       SEARCH INPUTS
       ========================================================= */

    function initializeSearch() {

        const inputs =
            $$(
                "#searchBox, [data-platform-search]"
            );


        inputs.forEach(input => {

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        performSearch(
                            input.value
                        );
                    }


                    if (
                        event.key ===
                        "Escape"
                    ) {

                        input.value = "";

                        ASEM.state
                            .searchQuery =
                            "";

                        searchLocal("");
                    }
                }
            );


            input.addEventListener(
                "input",
                event => {

                    const value =
                        event.target.value
                            .trim();


                    /*
                     * Local filtering is immediate.
                     * Server search is executed on Enter
                     * to avoid hammering the database.
                     */

                    searchLocal(value);
                }
            );
        });


        const searchButton =
            $(
                "[data-platform-search-submit]"
            );


        if (searchButton) {

            searchButton.addEventListener(
                "click",
                () => {

                    const input =
                        $(
                            "#searchBox, [data-platform-search]"
                        );

                    if (input) {
                        performSearch(
                            input.value
                        );
                    }
                }
            );
        }
    }


    function searchLocal(value) {

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

                card.hidden =
                    false;

                return;
            }


            const text =
                card.textContent
                    .toLowerCase();


            card.hidden =
                !text.includes(query);
        });
    }


    /* =========================================================
       SEARCH FILTER
       ========================================================= */

    function setSearchType(type) {

        ASEM.state.searchType =
            [
                "all",
                "tourism",
                "businesses",
                "products",
                "projects"
            ].includes(type)
                ? type
                : "all";


        const queryInput =
            $(
                "#searchBox"
            );


        if (queryInput) {

            performSearch(
                queryInput.value
            );
        }
    }


    /* =========================================================
       THEME
       ========================================================= */

    function applyTheme(theme) {

        const valid =
            theme === "dark"
                ? "dark"
                : "light";


        document.documentElement
            .setAttribute(
                "data-theme",
                valid
            );


        const button =
            $(
                "#themeToggle"
            );


        if (button) {

            const dark =
                valid === "dark";


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
                valid
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


        const dark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        applyTheme(
            dark
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
       LANGUAGE
       ========================================================= */

    function applyLanguage(
        language
    ) {

        const supported = [
            "auto",
            "en",
            "fr",
            "ar",
            "ja"
        ];


        const selected =
            supported.includes(language)
                ? language
                : "auto";


        let finalLanguage =
            selected;


        if (
            selected ===
            "auto"
        ) {

            finalLanguage =
                (
                    navigator.language ||
                    "en"
                )
                .substring(0, 2);


            if (
                ![
                    "en",
                    "fr",
                    "ar",
                    "ja"
                ].includes(
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
            $(
                "#langSwitch"
            );


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


        const exists =
            Array.from(
                select.options
            )
            .some(
                option =>
                    option.value ===
                    saved
            );


        if (exists) {
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
       ACTION ROUTING
       ========================================================= */

    function actionFromElement(
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

            const legacy =
                element.dataset.section;


            const map = {

                "tourism-results":
                    "tourism",

                "tourism-section":
                    "tourism",

                "businesses-results":
                    "businesses",

                "businesses-section":
                    "businesses",

                "products-results":
                    "products",

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


            return map[legacy] ||
                null;
        }


        return null;
    }


    const actions = {

        tourism:
            loadTourism,

        businesses:
            loadBusinesses,

        products:
            loadProducts,

        projects:
            async () => {

                openPageSection(
                    "projects"
                );

                await loadProjects();
            },

        portfolio:
            () => {

                openPageSection(
                    "portfolio"
                );
            },

        services:
            () => {

                openPageSection(
                    "services"
                );
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
                    $(
                        "#searchBox"
                    );

                if (input) {
                    input.focus();
                }
            },

        location:
            enableGPS,

        gps:
            enableGPS,

        nearby:
            searchNearby,

        top:
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
    };


    /* =========================================================
       CLICK ROUTER
       ========================================================= */

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
                        typeof actions[
                            action
                        ] === "function"
                    ) {

                        event.preventDefault();

                        actions[action]();
                    }

                    return;
                }


                const actionElement =
                    event.target.closest(
                        "[data-platform-action], [data-section]"
                    );


                if (
                    actionElement
                ) {

                    const action =
                        actionFromElement(
                            actionElement
                        );


                    const handler =
                        actions[action];


                    if (
                        typeof handler ===
                        "function"
                    ) {

                        /*
                         * Do not interfere with
                         * modifier-click navigation.
                         */

                        if (
                            event.ctrlKey ||
                            event.metaKey ||
                            event.shiftKey ||
                            event.altKey
                        ) {
                            return;
                        }


                        event.preventDefault();

                        handler();

                        return;
                    }
                }


                if (
                    event.target.closest(
                        "#themeToggle"
                    )
                ) {

                    toggleTheme();
                }
            }
        );
    }


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
                    actionFromElement(
                        element
                    );


                if (
                    actions[action]
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


                if (
                    document.getElementById(id)
                ) {

                    event.preventDefault();

                    openPageSection(id);
                }
            }
        );
    }


    /* =========================================================
       SCROLL TOP
       ========================================================= */

    function initializeScrollTop() {

        const button =
            $(
                "#scrollTop"
            );


        if (!button) {
            return;
        }


        const update =
            () => {

                button.classList.toggle(
                    "visible",
                    window.scrollY > 400
                );
            };


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
       RESULT VISIBILITY
       ========================================================= */

    function initializeResultSections() {

        [
            "tourism-section",
            "tourism-results",
            "businesses-section",
            "businesses-results",
            "products-section",
            "products-results"
        ]
        .forEach(hideSection);
    }


    /* =========================================================
       ACCESSIBILITY
       ========================================================= */

    function initializeAccessibility() {

        $$(
            "[data-platform-action], [data-section]"
        )
        .forEach(element => {

            const tag =
                element.tagName
                    .toLowerCase();


            if (
                tag !== "button" &&
                tag !== "a"
            ) {

                element.setAttribute(
                    "role",
                    "button"
                );


                if (
                    !element.hasAttribute(
                        "tabindex"
                    )
                ) {

                    element.setAttribute(
                        "tabindex",
                        "0"
                    );
                }
            }
        });
    }


    /* =========================================================
       GLOBAL API
       ========================================================= */

    window.ASEM =
        ASEM;

    window.loadTourism =
        loadTourism;

    window.loadBusinesses =
        loadBusinesses;

    window.loadProducts =
        loadProducts;

    window.loadProjects =
        loadProjects;

    window.performASEMSearch =
        performSearch;

    window.enableASEMGPS =
        enableGPS;

    window.searchASEMNearby =
        searchNearby;

    window.toggleASEMTheme =
        toggleTheme;

    window.openPageSection =
        openPageSection;


    /* =========================================================
       START
       ========================================================= */

    function initializeApplication() {

        initializeTheme();

        initializeLanguage();

        initializeSearch();

        initializeClickRouter();

        initializeKeyboard();

        initializeNavigation();

        initializeScrollTop();

        initializeAccessibility();

        initializeResultSections();

        updateLocationUI();


        console.info(
            "ASEM Global Platform v2 initialized."
        );
    }


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

})();
