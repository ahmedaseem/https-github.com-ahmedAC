"use strict";

/*
 * ============================================================
 * ASEM DIGITAL SOLUTIONS
 * GLOBAL PLATFORM CONTROLLER
 * ============================================================
 *
 * Frontend controller for:
 *
 * ✓ Tourism
 * ✓ Businesses
 * ✓ Products
 * ✓ Projects
 * ✓ Portfolio
 * ✓ Services
 * ✓ Contact
 * ✓ About
 * ✓ Global Search
 * ✓ GPS / Nearby
 * ✓ Dark / Light mode
 * ✓ Language selection
 * ✓ Keyboard accessibility
 * ✓ API loading
 * ✓ Safe HTML rendering
 * ✓ Local API testing
 * ✓ Production API configuration
 *
 * Payment systems are intentionally not included.
 *
 * ============================================================
 */


/* ============================================================
   APPLICATION
   ============================================================ */

(() => {

    "use strict";


    /* ========================================================
       CONFIGURATION
       ======================================================== */

    const ASEM = {

        app: {
            name: "ASEM Digital Solutions",
            version: "1.0.0"
        },


        /*
         * API configuration
         *
         * LOCAL:
         * Backend is running on:
         * http://localhost:3001
         *
         * PRODUCTION:
         * Change production.baseURL to your real production
         * backend URL when the backend is deployed.
         *
         * Example:
         *
         * production: {
         *     baseURL: "https://api.example.com/api"
         * }
         *
         * If the production frontend and backend use the same
         * domain, "/api" is also valid.
         */

        api: {

            environment:
                window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1"
                    ? "local"
                    : "production",


            local: {
                baseURL:
                    "http://localhost:3001/api"
            },


            production: {
                baseURL:
                    "/api"
            },


            endpoints: {

                tourism:
                    "/tourism",

                businesses:
                    "/businesses",

                products:
                    "/products",

                projects:
                    "/projects",

                search:
                    "/search",

                nearby:
                    "/nearby"
            }
        },


        storage: {

            theme:
                "asem-theme",

            language:
                "asem-language",

            location:
                "asem-location"
        },


        timeout:
            15000,


        gps: {

            enabled:
                false,

            latitude:
                null,

            longitude:
                null,

            accuracy:
                null
        },


        state: {

            searchQuery:
                "",

            searchType:
                "all",

            searchResults:
                [],

            locationEnabled:
                false,

            searching:
                false,

            datasets: {

                tourism:
                    [],

                businesses:
                    [],

                products:
                    [],

                projects:
                    []
            }
        }

    };


    /* ========================================================
       API URL HELPER
       ======================================================== */

    function getAPIBaseURL() {

        /*
         * Allow an optional global override.
         *
         * This is useful for production deployments without
         * modifying the main application logic.
         *
         * Example in HTML before app.js:
         *
         * window.ASEM_API_BASE_URL =
         *     "https://api.example.com/api";
         */

        if (
            typeof window !== "undefined" &&
            typeof window.ASEM_API_BASE_URL === "string" &&
            window.ASEM_API_BASE_URL.trim()
        ) {

            return window.ASEM_API_BASE_URL
                .trim()
                .replace(/\/+$/, "");
        }


        const environment =
            ASEM.api.environment;


        return ASEM.api[environment].baseURL
            .replace(/\/+$/, "");
    }


    function getAPIURL(endpoint) {

        const baseURL =
            getAPIBaseURL();


        const cleanEndpoint =
            String(endpoint || "")
                .replace(/^\/+/, "");


        return `${baseURL}/${cleanEndpoint}`;
    }


    /* ========================================================
       DOM HELPERS
       ======================================================== */

    function $(selector, root = document) {

        return root.querySelector(selector);
    }


    function $$(selector, root = document) {

        return Array.from(
            root.querySelectorAll(selector)
        );
    }


    /* ========================================================
       SECURITY
       ======================================================== */

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
                window.location.origin;


            const url =
                new URL(
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


    /* ========================================================
       NORMALIZE API DATA
       ======================================================== */

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


    /* ========================================================
       API REQUEST
       ======================================================== */

    async function apiRequest(
        endpoint,
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


        /*
         * If the caller supplies its own AbortController,
         * use its signal.
         *
         * Otherwise use our timeout controller.
         */

        const signal =
            options.signal ||
            controller.signal;


        try {

            const response =
                await fetch(
                    endpoint,
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
                            options.credentials ||
                            "include",


                        cache:
                            "no-store",


                        signal,


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


                    if (
                        error &&
                        error.message
                    ) {

                        message =
                            String(
                                error.message
                            );
                    }

                } catch (_) {
                    /*
                     * Response was not JSON.
                     */
                }


                throw new Error(
                    message
                );
            }


            /*
             * Some endpoints may return an empty response.
             */

            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            if (
                contentType
                    .toLowerCase()
                    .includes("application/json")
            ) {

                return await response.json();
            }


            return await response.text();

        } finally {

            clearTimeout(timeout);
        }
    }


    /* ========================================================
       UI STATES
       ======================================================== */

    function showLoading(
        grid,
        title
    ) {

        if (!grid) {

            return;
        }


        grid.setAttribute(
            "aria-busy",
            "true"
        );


        grid.innerHTML = `

            <article
                class="card platform-state"
            >

                <div
                    class="platform-card-icon"
                    aria-hidden="true"
                >
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


        grid.setAttribute(
            "aria-busy",
            "false"
        );


        grid.innerHTML = `

            <article
                class="card platform-state"
            >

                <div
                    class="platform-card-icon"
                    aria-hidden="true"
                >
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


        grid.setAttribute(
            "aria-busy",
            "false"
        );


        const retry =
            retryAction
                ? `

                    <button
                        type="button"
                        class="btn"
                        data-retry="${escapeHTML(
                            retryAction
                        )}"
                    >
                        Retry
                    </button>

                `
                : "";


        grid.innerHTML = `

            <article
                class="card platform-state"
            >

                <div
                    class="platform-card-icon"
                    aria-hidden="true"
                >
                    ⚠️
                </div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>

                ${retry}

            </article>

        `;
    }


    /* ========================================================
       IMAGE RENDERING
       ======================================================== */

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
                    aria-hidden="true"
                >
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


    /* ========================================================
       TOURISM CARD
       ======================================================== */

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


        const hasCoordinates =
            Number.isFinite(
                Number(item.latitude)
            ) &&
            Number.isFinite(
                Number(item.longitude)
            );


        return `

            <article
                class="card platform-result-card"
                tabindex="0"
                data-type="tourism"
                data-id="${escapeHTML(
                    item.id || ""
                )}"
                ${
                    hasCoordinates
                        ? `
                            data-latitude="${escapeHTML(
                                item.latitude
                            )}"
                            data-longitude="${escapeHTML(
                                item.longitude
                            )}"
                        `
                        : ""
                }
            >

                ${imageHTML(
                    item.image,
                    name,
                    "🏝️"
                )}

                <div
                    class="platform-card-content"
                >

                    <span
                        class="platform-card-category"
                    >
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
                                    📍
                                    ${escapeHTML(
                                        item.location
                                    )}
                                </small>

                            `
                            : ""
                    }

                    ${
                        hasCoordinates
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

                                <div
                                    class="platform-rating"
                                >
                                    ⭐
                                    ${escapeHTML(
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


    /* ========================================================
       BUSINESS CARD
       ======================================================== */

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


        const hasCoordinates =
            Number.isFinite(
                Number(item.latitude)
            ) &&
            Number.isFinite(
                Number(item.longitude)
            );


        return `

            <article
                class="card platform-result-card"
                tabindex="0"
                data-type="business"
                data-id="${escapeHTML(
                    item.id || ""
                )}"
                ${
                    hasCoordinates
                        ? `
                            data-latitude="${escapeHTML(
                                item.latitude
                            )}"
                            data-longitude="${escapeHTML(
                                item.longitude
                            )}"
                        `
                        : ""
                }
            >

                ${imageHTML(
                    item.logo ||
                    item.cover_image,
                    name,
                    "🌍"
                )}

                <div
                    class="platform-card-content"
                >

                    <span
                        class="platform-card-category"
                    >
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
                                    📍
                                    ${escapeHTML(
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

                                <div
                                    class="platform-rating"
                                >
                                    ⭐
                                    ${escapeHTML(
                                        item.rating
                                    )}
                                </div>

                            `
                            : ""
                    }

                    ${
                        item.distance !== undefined &&
                        item.distance !== null
                            ? `

                                <small>
                                    📏
                                    ${escapeHTML(
                                        item.distance
                                    )}
                                    km away
                                </small>

                            `
                            : ""
                    }

                </div>

            </article>

        `;
    }


    /* ========================================================
       PRODUCT CARD
       ======================================================== */

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


        const hasCoordinates =
            Number.isFinite(
                Number(item.latitude)
            ) &&
            Number.isFinite(
                Number(item.longitude)
            );


        return `

            <article
                class="card platform-result-card"
                tabindex="0"
                data-type="product"
                data-id="${escapeHTML(
                    item.id || ""
                )}"
                ${
                    hasCoordinates
                        ? `
                            data-latitude="${escapeHTML(
                                item.latitude
                            )}"
                            data-longitude="${escapeHTML(
                                item.longitude
                            )}"
                        `
                        : ""
                }
            >

                ${imageHTML(
                    item.image,
                    name,
                    "🛒"
                )}

                <div
                    class="platform-card-content"
                >

                    <span
                        class="platform-card-category"
                    >
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

                                <strong
                                    class="product-price"
                                >
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
                        item.distance !== undefined &&
                        item.distance !== null
                            ? `

                                <small>
                                    📏
                                    ${escapeHTML(
                                        item.distance
                                    )}
                                    km away
                                </small>

                            `
                            : ""
                    }

                </div>

            </article>

        `;
    }


    /* ========================================================
       PROJECT CARD
       ======================================================== */

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
                data-id="${escapeHTML(
                    item.id || ""
                )}"
            >

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


    /* ========================================================
       SEARCH CARD
       ======================================================== */

    function buildSearchCard(item) {

        const type =
            String(
                item.type || ""
            ).toLowerCase();


        if (
            type === "tourism"
        ) {

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


        if (
            type === "project" ||
            type === "projects"
        ) {

            return buildProjectCard(item);
        }


        return `

            <article
                class="card platform-result-card"
            >

                <div
                    class="platform-card-icon"
                    aria-hidden="true"
                >
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
                        item.description ||
                        ""
                    )}
                </p>

            </article>

        `;
    }


    /* ========================================================
       GRID RENDERING
       ======================================================== */

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


        if (!Array.isArray(items)) {

            items = [];
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


        grid.setAttribute(
            "aria-busy",
            "false"
        );
    }


    /* ========================================================
       SECTION VISIBILITY
       ======================================================== */

    function showSection(
        selector
    ) {

        const section =
            $(selector);


        if (!section) {

            return;
        }


        section.hidden =
            false;


        requestAnimationFrame(() => {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });
    }


    function hideSection(
        selector
    ) {

        const section =
            $(selector);


        if (section) {

            section.hidden =
                true;
        }
    }


    /* ========================================================
       LOAD TOURISM
       ======================================================== */

    async function loadTourism() {

        const grid =
            $("#tourismGrid");


        if (!grid) {

            console.warn(
                "ASEM: #tourismGrid was not found."
            );

            return;
        }


        showSection(
            "#tourism-section"
        );


        showLoading(
            grid,
            "Loading Global Tourism..."
        );


        try {

            const data =
                await apiRequest(
                    getAPIURL(
                        ASEM.api.endpoints.tourism
                    )
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

        } catch (error) {

            console.error(
                "ASEM Tourism:",
                error
            );


            showError(
                grid,
                "Tourism unavailable",
                getErrorMessage(error),
                "tourism"
            );
        }
    }


    /* ========================================================
       LOAD BUSINESSES
       ======================================================== */

    async function loadBusinesses() {

        const grid =
            $("#businessesGrid");


        if (!grid) {

            console.warn(
                "ASEM: #businessesGrid was not found."
            );

            return;
        }


        showSection(
            "#businesses-section"
        );


        showLoading(
            grid,
            "Loading Global Businesses..."
        );


        try {

            const data =
                await apiRequest(
                    getAPIURL(
                        ASEM.api.endpoints.businesses
                    )
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

        } catch (error) {

            console.error(
                "ASEM Businesses:",
                error
            );


            showError(
                grid,
                "Businesses unavailable",
                getErrorMessage(error),
                "businesses"
            );
        }
    }


    /* ========================================================
       LOAD PRODUCTS
       ======================================================== */

    async function loadProducts() {

        const grid =
            $("#productsGrid");


        if (!grid) {

            console.warn(
                "ASEM: #productsGrid was not found."
            );

            return;
        }


        showSection(
            "#products-section"
        );


        showLoading(
            grid,
            "Loading Global Products..."
        );


        try {

            const data =
                await apiRequest(
                    getAPIURL(
                        ASEM.api.endpoints.products
                    )
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

        } catch (error) {

            console.error(
                "ASEM Products:",
                error
            );


            showError(
                grid,
                "Products unavailable",
                getErrorMessage(error),
                "products"
            );
        }
    }


    /* ========================================================
       LOAD PROJECTS
       ======================================================== */

    async function loadProjects() {

        const grid =
            $("#projectsGrid");


        if (!grid) {

            console.warn(
                "ASEM: #projectsGrid was not found."
            );

            return;
        }


        showLoading(
            grid,
            "Loading ASEM Projects..."
        );


        try {

            const data =
                await apiRequest(
                    getAPIURL(
                        ASEM.api.endpoints.projects
                    )
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
                "ASEM Projects:",
                error
            );


            showError(
                grid,
                "Projects unavailable",
                getErrorMessage(error),
                "projects"
            );
        }
    }


    /* ========================================================
       PRELOAD PLATFORM DATA
       ======================================================== */

    async function preloadPlatformData() {

        /*
         * Preloading is intentionally non-blocking.
         *
         * If one endpoint fails, the rest can still load.
         */

        const requests = [

            {
                name: "tourism",
                endpoint:
                    ASEM.api.endpoints.tourism
            },

            {
                name: "businesses",
                endpoint:
                    ASEM.api.endpoints.businesses
            },

            {
                name: "products",
                endpoint:
                    ASEM.api.endpoints.products
            },

            {
                name: "projects",
                endpoint:
                    ASEM.api.endpoints.projects
            }

        ];


        await Promise.allSettled(

            requests.map(
                async request => {

                    try {

                        const data =
                            await apiRequest(
                                getAPIURL(
                                    request.endpoint
                                )
                            );


                        ASEM.state.datasets[
                            request.name
                        ] =
                            normalizeArray(data);

                    } catch (error) {

                        console.warn(
                            `ASEM preload ${request.name}:`,
                            error
                        );
                    }
                }
            )

        );


        console.info(
            "ASEM platform data preloaded.",
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
    }


    /* ========================================================
       LOCATION UI
       ======================================================== */

    function updateLocationUI() {

        const buttons =
            $$(
                "[data-platform-action='location'], " +
                "[data-platform-action='gps'], " +
                "[data-platform-action='nearby']"
            );


        buttons.forEach(
            button => {

                button.classList.toggle(
                    "active",
                    ASEM.state.locationEnabled
                );


                button.setAttribute(
                    "aria-pressed",
                    ASEM.state.locationEnabled
                        ? "true"
                        : "false"
                );


                button.setAttribute(
                    "aria-label",
                    ASEM.state.locationEnabled
                        ? "Location enabled"
                        : "Use my location"
                );

            }
        );


        const status =
            $("#locationStatus");


        if (!status) {

            return;
        }


        status.textContent =
            ASEM.state.locationEnabled
                ? "📍 Location enabled"
                : "Location not enabled";
    }


    /* ========================================================
       LOCATION STORAGE
       ======================================================== */

    function saveLocation() {

        try {

            localStorage.setItem(
                ASEM.storage.location,
                JSON.stringify(
                    ASEM.gps
                )
            );

        } catch (_) {

            /*
             * localStorage may be unavailable.
             */
        }
    }


    function loadSavedLocation() {

        try {

            const saved =
                localStorage.getItem(
                    ASEM.storage.location
                );


            if (!saved) {

                return;
            }


            const location =
                JSON.parse(saved);


            if (
                !location ||
                !Number.isFinite(
                    Number(location.latitude)
                ) ||
                !Number.isFinite(
                    Number(location.longitude)
                )
            ) {

                return;
            }


            ASEM.gps = {

                enabled:
                    true,

                latitude:
                    Number(
                        location.latitude
                    ),

                longitude:
                    Number(
                        location.longitude
                    ),

                accuracy:
                    Number.isFinite(
                        Number(
                            location.accuracy
                        )
                    )
                        ? Number(
                            location.accuracy
                        )
                        : null
            };


            ASEM.state.locationEnabled =
                true;


            updateLocationUI();

        } catch (_) {

            /*
             * Ignore invalid stored location.
             */
        }
    }


    /* ========================================================
       GET CURRENT LOCATION
       ======================================================== */

    function getCurrentLocation() {

        return new Promise(
            (resolve, reject) => {

                if (
                    !("geolocation" in navigator)
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

                            enabled:
                                true,

                            latitude:
                                Number(
                                    coords.latitude
                                ),

                            longitude:
                                Number(
                                    coords.longitude
                                ),

                            accuracy:
                                Number.isFinite(
                                    Number(
                                        coords.accuracy
                                    )
                                )
                                    ? Number(
                                        coords.accuracy
                                    )
                                    : null
                        };


                        ASEM.state.locationEnabled =
                            true;


                        saveLocation();

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
                            error.PERMISSION_DENIED
                        ) {

                            message =
                                "Location permission was denied.";
                        }


                        if (
                            error.code ===
                            error.POSITION_UNAVAILABLE
                        ) {

                            message =
                                "Your location could not be determined.";
                        }


                        if (
                            error.code ===
                            error.TIMEOUT
                        ) {

                            message =
                                "Location request timed out.";
                        }


                        reject(
                            new Error(
                                message
                            )
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


    /* ========================================================
       LOCATION MESSAGE
       ======================================================== */

    function showLocationMessage(
        message
    ) {

        const status =
            $("#locationStatus");


        if (status) {

            status.textContent =
                `⚠️ ${message}`;
        }
    }


    /* ========================================================
       ENABLE GPS
       ======================================================== */

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
                getErrorMessage(error)
            );
        }
    }


    /* ========================================================
       NEARBY SEARCH
       ======================================================== */

    async function searchNearby() {

        const grid =
            $("#searchGrid");


        if (!grid) {

            console.warn(
                "ASEM: #searchGrid was not found."
            );

            return;
        }


        if (
            !Number.isFinite(
                Number(
                    ASEM.gps.latitude
                )
            ) ||
            !Number.isFinite(
                Number(
                    ASEM.gps.longitude
                )
            )
        ) {

            await getCurrentLocation();
        }


        showSection(
            "#platform-search-results"
        );


        showLoading(
            grid,
            "Finding nearby results..."
        );


        const params =
            new URLSearchParams({

                lat:
                    String(
                        ASEM.gps.latitude
                    ),

                lng:
                    String(
                        ASEM.gps.longitude
                    ),

                radius:
                    "25",

                type:
                    ASEM.state.searchType ||
                    "all"
            });


        try {

            const data =
                await apiRequest(
                    `${getAPIURL(
                        ASEM.api.endpoints.nearby
                    )}?${params.toString()}`
                );


            const results =
                normalizeArray(data);


            ASEM.state.searchResults =
                results;


            renderSearchResults(
                results,
                "No Nearby Results",
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
                getErrorMessage(error),
                "location"
            );
        }
    }


    /* ========================================================
       SEARCH
       ======================================================== */

    let searchController =
        null;


    function openSearchSection() {

        showSection(
            "#platform-search-results"
        );
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

            ASEM.state.searchResults =
                [];


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

            console.warn(
                "ASEM: #searchGrid was not found."
            );

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
            ASEM.state.searchType ||
            "all"
        );


        try {

            const data =
                await apiRequest(

                    `${getAPIURL(
                        ASEM.api.endpoints.search
                    )}?${params.toString()}`,

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
                "No Results",
                `No results found for "${value}".`
            );

        } catch (error) {

            if (
                error &&
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
                getErrorMessage(error),
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


        if (!Array.isArray(results)) {

            results = [];
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


        grid.setAttribute(
            "aria-busy",
            "false"
        );
    }


    /* ========================================================
       LOCAL SEARCH FILTER
       ======================================================== */

    function searchLocal(
        value
    ) {

        const query =
            String(value || "")
                .toLowerCase()
                .trim();


        /*
         * Only filter already-rendered result cards.
         *
         * We do not call the API on every keystroke.
         * The API search runs when Enter is pressed.
         */

        const cards =
            $$(
                ".platform-result-card, " +
                ".project-card"
            );


        cards.forEach(
            card => {

                if (!query) {

                    card.hidden =
                        false;

                    return;
                }


                card.hidden =
                    !card.textContent
                        .toLowerCase()
                        .includes(query);

            }
        );
    }


    /* ========================================================
       SEARCH INPUT
       ======================================================== */

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

                    event.preventDefault();

                    input.value =
                        "";

                    ASEM.state.searchQuery =
                        "";

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


    /* ========================================================
       THEME
       ======================================================== */

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


            button.setAttribute(
                "title",
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

        } catch (_) {

            /*
             * Ignore storage errors.
             */
        }
    }


    function initializeTheme() {

        let saved =
            null;


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

            applyTheme(
                saved
            );

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


    /* ========================================================
       LANGUAGE
       ======================================================== */

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
            supported.includes(
                language
            )
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
                    option.value ===
                    saved
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


    /* ========================================================
       ERROR HANDLING
       ======================================================== */

    function getErrorMessage(
        error
    ) {

        if (
            !error
        ) {

            return "An unknown error occurred.";
        }


        if (
            error.name ===
            "AbortError"
        ) {

            return "The request was cancelled.";
        }


        if (
            error instanceof TypeError
        ) {

            return (
                "Unable to connect to the API. " +
                "Check that the backend is running and that " +
                "CORS is configured correctly."
            );
        }


        return (
            error.message ||
            "An unexpected error occurred."
        );
    }


    /* ========================================================
       ACTIONS
       ======================================================== */

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
                        behavior: "smooth",
                        block: "start"
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
                        behavior: "smooth",
                        block: "start"
                    });
                }
            },


        services:
            () => {

                const section =
                    $("#services");


                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
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


                openSearchSection();


                if (input) {

                    input.focus();
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

                    top:
                        0,

                    behavior:
                        "smooth"
                });
            }

    };


    /* ========================================================
       ACTION ROUTING
       ======================================================== */

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


    /* ========================================================
       CLICK ROUTER
       ======================================================== */

    function initializeClickRouter() {

        document.addEventListener(
            "click",
            event => {

                /*
                 * Retry buttons.
                 */

                const retry =
                    event.target.closest(
                        "[data-retry]"
                    );


                if (retry) {

                    event.preventDefault();


                    const action =
                        retry.dataset.retry;


                    if (
                        typeof actions[action] ===
                        "function"
                    ) {

                        actions[action]();
                    }


                    return;
                }


                /*
                 * Theme toggle.
                 */

                const themeButton =
                    event.target.closest(
                        "#themeToggle"
                    );


                if (themeButton) {

                    event.preventDefault();

                    toggleTheme();

                    return;
                }


                /*
                 * Platform action buttons.
                 */

                const actionElement =
                    event.target.closest(
                        "[data-platform-action], " +
                        "[data-section]"
                    );


                if (!actionElement) {

                    return;
                }


                /*
                 * Do not interfere with modifier-clicks.
                 */

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


    /* ========================================================
       KEYBOARD ACCESSIBILITY
       ======================================================== */

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
                        "[data-platform-action], " +
                        "[data-section]"
                    );


                if (!element) {

                    return;
                }


                /*
                 * Native buttons already support Enter/Space.
                 * Avoid triggering them twice.
                 */

                if (
                    element.tagName
                        .toLowerCase() ===
                    "button"
                ) {

                    return;
                }


                event.preventDefault();


                const action =
                    getAction(
                        element
                    );


                if (
                    typeof actions[action] ===
                    "function"
                ) {

                    actions[action]();
                }

            }
        );
    }


    /* ========================================================
       HASH NAVIGATION
       ======================================================== */

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
                    document.getElementById(
                        id
                    );


                if (!section) {

                    return;
                }


                event.preventDefault();


                section.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"
