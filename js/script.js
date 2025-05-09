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
                d.endDate = d.end === "Present" ? new Date() : parseTime(d.end);
            });

            data.forEach(d => {
                d.highlights = d.achievements.reduce((html, achievement) => html + `<li>${achievement}</li>`, "");
            });


            // Declare the chart dimensions and margins.
            const margin = ({top: 20, right: 200, bottom: 50, left: 10});
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
                .range(["orange", "steelblue", "green"]);

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

            /* Add tooltips
            const tooltip = d3.select("#resume").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("pointer-events", "none")
                .style("top", 0)
                .style("opacity", 0);

            svg.selectAll("rect")
                .on("mouseover", function (event, d) {
                    tooltip.transition()
                        .duration(300)
                        .style("opacity", .9);
                    tooltip.html(`
<h5>${d.title}</h5>
<i class="fa-solid fa-location-dot"></i><a href="${d.site}" target="_blank"> ${d.institution} [${d.location}]</a><br/>
<i class="fa-solid fa-calendar-week"></i> ${d.start} - ${d.end}<br/>
<i class="fa-solid fa-screwdriver-wrench"></i> <span class="fw-semibold">Skills Developed: </span>${d.skills.join(', ')}<br/>
<i class="fa-solid fa-thumbtack"></i><span class="fw-bold"> Highlights</span>
<ul>${d.highlights}</ul>`)
                        .style("left", (event.pageX - 20) + "px")
                        .style("top", (event.pageY - 68) + "px");
                })
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(3000)
                        .style("opacity", 0);
                });
*/

            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"], svg g.label'))
            console.log(tooltipTriggerList);

            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                const tooltip = new bootstrap.Tooltip(tooltipTriggerEl, {
                    trigger: "manual",
                    html: true,
                    'customClass': 'custom-tooltip'
                })

                let tooltipElTimeout;
                let currentToolTip;

                let currentTooltipTimeout;

                tooltipTriggerEl.addEventListener("mouseenter", function () {
                    let toolTipID;

                    // Clear Set Timeout
                    clearTimeout(tooltipElTimeout);
                    clearTimeout(currentTooltipTimeout);

                    // Show Tooltip
                    tooltip.show();

                    // Assign current tooltip ID to toolTipID variable
                    //nima aria-describedby
                    toolTipID = tooltipTriggerEl.getAttribute("aria-describedby");
                    console.log("tooltipTriggerEl: " + tooltipTriggerEl);
                    console.log("toolTipID: " + toolTipID);

                    // Assign current tooltip to currentToolTip variable
                    currentToolTip = document.querySelector(`#${toolTipID}`);

                    // Hide tooltip on tooltip mouse leave

                    currentToolTip.addEventListener("mouseleave", function () {
                        //currentTooltipTimeout = setTimeout(()=>{
                        setTimeout(() => {
                            console.log("currentToolTip doesn't match :hover: " + !currentToolTip.matches(":hover"));
                            if (!tooltipTriggerEl.matches(":hover")) {
                                console.log("tooltipTriggerEl matches :hover: " + tooltipTriggerEl.matches(":hover"));
                                if (!currentToolTip.matches(":hover")) {
                                    tooltip.hide();
                                }
                            }
                        }, 300)
                        //}, 100)
                    });
                });


                tooltipTriggerEl.addEventListener("mouseleave", function () {
                    // SetTimeout before tooltip disappears
                    tooltipTimeout = setTimeout(function () {
                        // Hide tooltip if not hovered.
                        if (!currentToolTip.matches(":hover")) {
                            tooltip.hide();
                        }
                    }, 100);
                });

                return tooltip;

            })

        });
    });
})(jQuery);