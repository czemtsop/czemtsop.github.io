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
         * Generate CV svg
         /* ---------------------------------------------- */

        $.getJSON('js/career.json', function (data) {

            // Parse dates
            const parseTime = d3.timeParse("%B %Y");
            data.forEach(d => {
                d.startDate = parseTime(d.start);
                d.endDate = d.end === "Present" ? new Date() : parseTime(d.end).setMonth(parseTime(d.end).getMonth() + 1);
            });

            data.forEach(d => {
                d.highlights = d.achievements.reduce((html, achievement) => html + `<li>${achievement}</li>`, "");
            });


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

            const y = d3.scaleBand()
                .domain(data.map(d => d.institution))
                .range([0, height])
                .padding(0.1);

            const color = d3.scaleOrdinal()
                .domain(["work", "school", "certification"])
                .range(["mediumpurple", "darkseagreen", "navajowhite"]);

            // Add X axis
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            // Add rectangles
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", d => x(d.startDate))
                .attr("y", d => y(d.institution))
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
                    "<h5>" + d.title + "</h5>\n" +
                    "<i class=\"fa-solid fa-location-dot\"></i><a href=\"" + d.site + "\" target=\"_blank\"> " + d.institution + " [" + d.location + "]</a><br/>\n" +
                    "<i class=\"fa-solid fa-calendar-week\"></i> " + d.start + " - " + d.end + "<br/>\n" +
                    "<i class=\"fa-solid fa-screwdriver-wrench\"></i> <span class=\"fw-semibold\">Skills Developed: </span>" + d.skills.join(', ') + "<br/>\n" +
                    "<i class=\"fa-solid fa-thumbtack\"></i><span class=\"fw-bold\"> Highlights</span>\n" +
                    "<ul>" + d.highlights +"</ul>")
                .append("image")
                .attr("href", d => 'images/logo/' + d.logo)
                .attr("x", d => x(d.startDate))
                .attr("y", d => y(d.institution) + y.bandwidth() / 4)
                .attr("width", 25)
                .attr("height", 30);

            // Add labels
            svg.selectAll(".label")
                .append("text")
                .append("tspan")
                .attr("class", "title")
                .attr("x", d => x(d.startDate) + 30)
                .attr("y", d => y(d.institution) + y.bandwidth() / 2)
                .attr("dy", ".25em")
                .attr("textLength", "16em")
                .text(d => d.title);

            let tooltipTriggerList = [].slice.call($('[data-bs-toggle="tooltip"], svg g.label'));

            let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
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
                    //nima aria-describedby
                    toolTipID = tooltipTriggerEl.getAttribute("aria-describedby");
                    console.log("tooltipTriggerEl: " + tooltipTriggerEl);
                    console.log("toolTipID: " + toolTipID);

                    // Assign current tooltip to currentToolTip variable
                    currentToolTip = document.querySelector(`#${toolTipID}`);

                    currentToolTip.addEventListener("mouseleave", function () {
                        setTimeout(() => {
                            console.log("currentToolTip doesn't match :hover: " + !currentToolTip.matches(":hover"));
                            if (!tooltipTriggerEl.matches(":hover")) {
                                console.log("tooltipTriggerEl matches :hover: " + tooltipTriggerEl.matches(":hover"));
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
                        console.log("currentToolTip doesn't match :hover: " + !currentToolTip.matches(":hover"));
                        if (!tooltipTriggerEl.matches(":hover")) {
                            console.log("tooltipTriggerEl matches :hover: " + tooltipTriggerEl.matches(":hover"));
                            if (!currentToolTip.matches(":hover")) {
                                tooltip.hide();
                                isHidden = true;
                            }
                        }
                    }, 300)
                });

                return tooltip;

            });

        });
    });
})(jQuery);