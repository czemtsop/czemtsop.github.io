
(function(){
    $(document).ready(function() {
        /* ---------------------------------------------- /*
         * Portfolio
         /* ---------------------------------------------- */

        let worksgrid   = $('#project-grid'),
            worksgrid_mode = 'masonry';

        worksgrid.imagesLoaded(function() {
            worksgrid.isotope({
                layoutMode: worksgrid_mode,
                itemSelector: '.grid-item'
            });
        });

        $('#filters a').click(function() {
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

        $.getJSON('js/career.json',function(data){
            console.log('success');

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
                .range(["steelblue", "orange", "green"]);

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
                .append("image")
                .attr("href", d => 'images/logo/'+d.logo)
                .attr("x", d => x(d.startDate))
                .attr("y", d => y(d.institution) + y.bandwidth() / 4)
                .attr("width", 20)
                .attr("height", 20);

            // Add labels
            svg.selectAll(".label")
                .append("text")
                .append("tspan")
                .attr("class", "title")
                .attr("x", d => x(d.startDate) + 28)
                .attr("y", d => y(d.institution) + y.bandwidth() / 2)
                .attr("dy", ".25em")
                .attr("textLength", "16em")
                .text(d => d.title);

            // Add tooltips
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("pointer-events", "none")
                .style("top", 0)
                .style("opacity", 0);

            svg.selectAll("rect")
                .on("mouseover", function(event, d) {
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
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(600)
                        .style("opacity", 0);
                });
        });
    });
})(jQuery);
