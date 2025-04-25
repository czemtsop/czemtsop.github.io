console.log('%c Proudly Crafted with ZiOn.', 'background: #222; color: #bada55');

/* ---------------------------------------------- /*
 * Preloader
 /* ---------------------------------------------- */
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

            // Flatten the data structure
            const flattenedData = data.flatMap(category =>
                category.activities.map(activity => ({
                    ...activity,
                    type: category.type
                }))
            );

            // Parse dates
            const parseTime = d3.timeParse("%B %Y");
            flattenedData.forEach(d => {
                const dates = d.period.split(" - ");
                d.startDate = parseTime(dates[0]);
                d.endDate = dates[1] === "Present" ? new Date() : parseTime(dates[1]);
            });


            // Declare the chart dimensions and margins.
            const margin = ({top: 20, right: 50, bottom: 50, left: 50});
            const width = Math.max($(window).width(), window.innerWidth) - margin.left - margin.right;
            const height = 450 - margin.top - margin.bottom;


            // Create SVG
            const svg = d3.select("#resume")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Create scales
            const x = d3.scaleTime()
                .domain(d3.extent(flattenedData.flatMap(d => [d.startDate, d.endDate])))
                .range([0, width]);

            const y = d3.scaleBand()
                .domain(flattenedData.map(d => d.institution))
                .range([0, height])
                .padding(0.1);

            const color = d3.scaleOrdinal()
                .domain(["work", "school"])
                .range(["steelblue", "orange"]);

            // Add X axis
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            // Add rectangles
            svg.selectAll("rect")
                .data(flattenedData)
                .enter()
                .append("rect")
                .attr("x", d => x(d.startDate))
                .attr("y", d => y(d.institution))
                .attr("width", d => x(d.endDate) - x(d.startDate))
                .attr("height", y.bandwidth())
                .attr("fill", d => color(d.type));

            // Add labels
            svg.selectAll(".label")
                .data(flattenedData)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", d => x(d.startDate) + 5)
                .attr("y", d => y(d.institution) + y.bandwidth() / 2)
                .attr("dy", ".35em")
                .text(d => d.title)
                .attr("fill", "black")
                .attr("font-size", "14px");

            // Add tooltips
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("pointer-events", "none")
                .style("top", 0)
                .style("opacity", 0)
                .style("background", "white")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("box-shadow", "0 0 10px rgba(0,0,0,.25)")
                .style("line-height", "1.3")
                .style("border", "solid")
                .style("border-width", "1px");

            svg.selectAll("rect")
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(300)
                        .style("opacity", .9);
                    tooltip.html(`${d.title}<br/>${d.institution}<br/>${d.period}`)
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });
    });
})(jQuery);
