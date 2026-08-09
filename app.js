/* =========================================================
       CLICK ROUTER
       ========================================================= */

    function initializeClickRouter() {

        document.addEventListener(
            "click",
            event => {

                const target = event.target;

                if (
                    !target ||
                    typeof target.closest !== "function"
                ) {
                    return;
                }


                /*
                 * Platform buttons and sections
                 */

                const element =
                    target.closest(
                        "[data-platform-action], [data-section]"
                    );


                if (element) {

                    const handled =
                        executeAction(
                            element
                        );


                    if (handled) {

                        event.preventDefault();

                        return;
                    }
                }


                /*
                 * Retry
                 */

                const retry =
                    target.closest(
                        "[data-retry]"
                    );


                if (retry) {

                    const action =
                        retry.dataset.retry;


                    if (
                        actions[action]
                    ) {

                        event.preventDefault();

                        actions[action]();
                    }

                    return;
                }


                /*
                 * Theme button safety net
                 */

                if (
                    target.closest(
                        "#themeToggle"
                    )
                ) {

                    toggleTheme();

                    return;
                }
            }
        );
    }
