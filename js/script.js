(function () {
    $(document).ready(function () {
        /* ---------------------------------------------- /*
         * Portfolio
         /* ---------------------------------------------- */

        let worksgrid = $('#project-grid'),
            worksgrid_mode = 'masonry';

        worksgrid.imagesLoaded(function () {
            worksgrid.isotope({
                layoutMode: worksgrid_mode,
                itemSelector: '.grid-item'
            });
        });

        $('#filters a').click(function () {
            $('#filters .active').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');

            worksgrid.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });

            return false;
        });

        /* ---------------------------------------------- /*
         * Language (English / French)
         /* ---------------------------------------------- */

        let currentLang = 'en';

        function setLang(lang) {
            currentLang = lang;
            document.documentElement.lang = lang;
            document.title = t('page.title', lang);

            $('[data-i18n]').each(function () {
                $(this).text(t($(this).attr('data-i18n'), lang));
            });

            $('#lang-toggle')
                .text(t('lang.toggle', lang))
                .attr('lang', lang === 'en' ? 'fr' : 'en')
                .attr('aria-label', t('lang.toggleLabel', lang));

            // Card heights change with the language, so re-run the project layout
            if (worksgrid.data('isotope')) {
                worksgrid.isotope('layout');
            }

            drawTimeline(lang);

            try { localStorage.setItem('lang', lang); } catch (e) { /* storage unavailable */ }

            // Keep ?lang= in the address bar so the current version can be shared
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.history.replaceState(null, '', url);
        }

        function initialLang() {
            const fromUrl = new URLSearchParams(window.location.search).get('lang');
            if (fromUrl === 'en' || fromUrl === 'fr') return fromUrl;

            let saved = null;
            try { saved = localStorage.getItem('lang'); } catch (e) { /* storage unavailable */ }
            if (saved === 'en' || saved === 'fr') return saved;

            return (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
        }

        $('#lang-toggle').on('click', function () {
            setLang(currentLang === 'en' ? 'fr' : 'en');
        });

        /* ---------------------------------------------- /*
         * Generate CV svg
         /* ---------------------------------------------- */

        let careerData = null;

        // French value when there is one (e.g. "title_fr"), English otherwise
        function pick(d, key, lang) {
            return (lang === 'fr' && d[key + '_fr']) || d[key];
        }

        function formatPeriod(d, lang) {
            const format = DATE_LOCALES[lang].format('%B %Y');
            const end = d.end === 'Present' ? t('timeline.present', lang) : format(d.endLabel);
            return format(d.startDate) + ' - ' + end;
        }

        function clearTimeline() {
            // Dispose of Bootstrap tooltips first, or open ones stay on screen
            $('#resume g.label').each(function () {
                const tooltip = bootstrap.Tooltip.getInstance(this);
                if (tooltip) tooltip.dispose();
            });
            d3.select('#resume').selectAll('*').remove();
        }

        function drawTimeline(lang) {
            if (!careerData) return; // drawn once the data has loaded
            const data = careerData;

            clearTimeline();

            // Declare the chart dimensions and margins.
            const margin = ({top: 20, right: 50, bottom: 50, left: 10});
            const resume = $('#resume');
            const width = resume.width() - margin.left - margin.right;
            const height = resume.height() - margin.top - margin.bottom;


            // Create SVG
            const svg = d3.select("#resume")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Create scales
            const x = d3.scaleTime()
                .domain(d3.extent(data.flatMap(d => [d.startDate, d.endDate])))
                .range([0, width]);

            // The English short titles are used as row ids in both languages
            const y = d3.scaleBand()
                .domain(data.map(d => d.titleshort))
                .range([0, height])
                .padding(0.1);

            const color = d3.scaleOrdinal()
                .domain(["work", "school", "certification", "project"])
                .range(["mediumpurple", "palevioletred", "navajowhite", "darkseagreen"]);

            // Add X axis
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).tickFormat(DATE_LOCALES[lang].format("%Y")));

            // Add rectangles
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", d => x(d.startDate))
                .attr("y", d => y(d.titleshort))
                .attr("width", d => x(d.endDate) - x(d.startDate))
                .attr("height", y.bandwidth())
                .attr("fill", d => color(d.type));

            // Add labels
            svg.selectAll(".label")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "label")
                .attr("data-bs-toggle", "tooltip")
                .attr("data-bs-placement", "top")
                .attr("data-bs-html", "true")
                .attr("data-bs-title", d => "\n" +
                    "<h5>" + pick(d, 'title', lang) + "</h5>\n" +
                    "<i class=\"fa-solid fa-location-dot\"></i><a href=\"" + d.site + "\" target=\"_blank\"> " + pick(d, 'institution', lang) + " [" + pick(d, 'location', lang) + "]</a><br/>\n" +
                    "<i class=\"fa-solid fa-calendar-week\"></i> " + formatPeriod(d, lang) + "<br/>\n" +
                    "<i class=\"fa-solid fa-screwdriver-wrench\"></i> <span class=\"fw-semibold\">" + t('timeline.skills', lang) + "</span>" + pick(d, 'skills', lang).join(', ') + "<br/>\n" +
                    "<i class=\"fa-solid fa-thumbtack\"></i><span class=\"fw-bold\"> " + t('timeline.highlights', lang) + "</span>\n" +
                    "<ul>" + pick(d, 'achievements', lang).reduce((html, achievement) => html + `<li>${achievement}</li>`, "") + "</ul>")
                .append("image")
                .attr("href", d => 'images/logo/' + d.logo)
                .attr("x", d => x(d.startDate))
                .attr("y", d => y(d.titleshort) + y.bandwidth() / 4)
                .attr("width", 25)
                .attr("height", 30);

            // Add labels
            svg.selectAll(".label")
                .append("text")
                .append("tspan")
                .attr("class", "title")
                .attr("x", d => x(d.startDate) + 30)
                .attr("y", d => y(d.titleshort) + y.bandwidth() / 2)
                .attr("dy", ".25em")
                //.attr("textLength", "16em")
                .text(d => pick(d, 'titleshort', lang) || pick(d, 'title', lang));

            let tooltipTriggerList = [].slice.call($('#resume svg g.label'));

            tooltipTriggerList.map(function (tooltipTriggerEl) {
                const tooltip = new bootstrap.Tooltip(tooltipTriggerEl, {
                    trigger: "manual",
                    'customClass': 'custom-tooltip'
                })

                let isHidden = true,
                    tooltipElTimeout,
                    currentToolTip,
                    currentTooltipTimeout;

                tooltipTriggerEl.addEventListener("mouseenter", function () {
                    let toolTipID;

                    // Clear Set Timeout
                    clearTimeout(tooltipElTimeout);
                    clearTimeout(currentTooltipTimeout);

                    // Show Tooltip
                    if (isHidden) {
                        tooltip.show();
                        isHidden = false;
                    }

                    // Assign current tooltip ID to toolTipID variable
                    toolTipID = tooltipTriggerEl.getAttribute("aria-describedby");

                    // Assign current tooltip to currentToolTip variable
                    currentToolTip = document.querySelector(`#${toolTipID}`);

                    currentToolTip.addEventListener("mouseleave", function () {
                        setTimeout(() => {
                            if (!tooltipTriggerEl.matches(":hover")) {
                                if (!currentToolTip.matches(":hover")) {
                                    tooltip.hide();
                                    isHidden = true;
                                }
                            }
                        }, 300)
                    });
                });

                // Hide tooltip on tooltip mouse leave
                tooltipTriggerEl.addEventListener("mouseleave", function () {
                    setTimeout(() => {
                        if (!tooltipTriggerEl.matches(":hover")) {
                            if (currentToolTip && !currentToolTip.matches(":hover")) {
                                tooltip.hide();
                                isHidden = true;
                            }
                        }
                    }, 300)
                });

                return tooltip;

            });
        }

        $.getJSON('js/career.json', function (data) {

            // Parse dates (kept in English in career.json, e.g. "June 2025")
            const parseTime = d3.timeParse("%B %Y");
            data.forEach(d => {
                d.startDate = parseTime(d.start);
                if (d.end === "Present") {
                    d.endDate = new Date();
                } else {
                    d.endLabel = parseTime(d.end);
                    d.endDate = d3.timeMonth.offset(d.endLabel, 1);
                }
            });

            careerData = data;
            drawTimeline(currentLang);
        });

        setLang(initialLang());
    });
})(jQuery);
