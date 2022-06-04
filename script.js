d3.select("#year").property("value", 2011)

var width = document.getElementById('visualizeThisChart')
    .clientWidth;
var height = document.getElementById('visualizeThisChart')
    .clientHeight;

var margin = {
    top: 10,
    bottom: 70,
    left: 70,
    right: 20
}

var svg = d3.select('#visualizeThisChart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;


var x_scale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y_scale = d3.scaleLinear()
    .range([height, 0]);
var yback_scale = d3.scaleLinear()
    .range([0, height]);

let colorScale = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, 20]);

var colour_scale = d3.scaleQuantile()
    .range(["#FA985C", "#8291DB", "#CBF24B", "#DB3941", "#42E7FF", "#5C93FA", "#DB958B", "#CBF24B", "#397FDB"]);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

svg.append('g')
    .attr('class', 'y axis');


function draw(year) {
    var temp_data = data[year]
    var type = temp_data.map(function (d) {
        return d.level_2;
    });
    x_scale.domain(type);

    var max_value = d3.max(temp_data, function (d) {
        return +d.value;
    });

    y_scale.domain([0, max_value]);
    colour_scale.domain([0, max_value]);

    var groups = svg.selectAll("g.barers")
        .data(temp_data)
        .enter()
        .append("g")
        .attr('class', 'barers')


    svg.selectAll("g.barers")
        .each(function (d, i) {
            d3.select(this)
                .append("rect")
                .attr('class', 'bar')
                .attr('x', x_scale(d.level_2))
                .attr('width', x_scale.bandwidth())
                .attr('y', height)
                .attr('height', 0)
                .transition().duration(500)
                .attr('y', y_scale(d.value))
                .attr('height', height - y_scale(d.value))
                .attr('x', x_scale(d.level_2))
                .attr('width', x_scale.bandwidth())
                .attr('fill', colour_scale(d.value))


            d3.select(this)
                .append("rect")
                .attr('class', 'extraBar')
                .style("opacity", "0")
                .attr('x', x_scale(d.level_2))
                .attr('width', x_scale.bandwidth())
                .attr('y', height)
                .attr('height', 0)
                .transition().duration(500)
                .attr('x', x_scale(d.level_2))
                .attr('y', y_scale(d.value)-15)
                .attr('height', height - y_scale(d.value)+15)
                .attr('width', x_scale.bandwidth())
        })

    svg.selectAll(".extraBar")
        .on('mouseover', function (d, i) {
            console.log(d3.select(this))
            //add transition effect for bar
            d3.select(this).transition()

                //add opacity for bar
                .duration('50')
                .attr('opacity', '.85')

                //add outline for bar
                .attr("stroke", "black")
                .attr("stroke-width", 2);

            div.transition()
                .duration(200)
                .style("opacity", .9);

            function totalSum(total) {
                var totalSum = 0;
                total.forEach(function (d) { totalSum = totalSum + parseInt(d.value) })
                return totalSum;
            }

            function percent(curr, total) {
                var per = (parseFloat(curr / totalSum(total)) * 100).toFixed(2);
                return per;
            }

            div.html("Cases: " + i.value +
                " <br>(<u><b>" + percent(i.value, temp_data) + "%</b></u> of " + i.year + ")<br>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mousemove', function (d, i) {
            div
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            d3.select(this).transition()

                //add opacity for bar
                .duration('50')
                .attr('opacity', '1')

                //remove outline for bar
                .attr("stroke", "none");


            div.transition()
                .duration(500)
                .style("opacity", 0);
        });


    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.6)')
        .style('border-radius', '4px')
        .style('color', '#fff');


    console.log("success")

    svg.select('.x.axis')
        .call(x_axis);

    svg.select('.y.axis')
        .transition().duration(500)
        .call(y_axis);

}
data = {}
async function get() {
    requestUrl = 'https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf';
    let datastorez = await (await fetch(requestUrl)).json();
    return datastorez.result['records'];
}
(async () => {
    result = await get()
    const unique = [...new Set(result.map(item => item.year))];
    var minYear = Math.min.apply(null, unique);
    var maxYear = Math.max.apply(null, unique);
    d3.select('#year').attr('min', minYear).attr('max', maxYear);

    for (year in unique) {
        y1 = unique[year];
        data[y1] = result.filter(relevantYear => {
            return relevantYear.year === y1
        })
    }

    //draw first year by default
    draw(unique[0]);

    var slider = d3.select('#year');
    slider.on('change', function () {
        d3.selectAll('.extraBar').remove();
        d3.selectAll('.bar').remove();
        draw(this.value)
    });
})()


