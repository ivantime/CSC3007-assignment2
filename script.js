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

yAxis = svg.append('g')
    .attr('class', 'y axis');

svg.append("g")
    .attr("class", "y axis")

function draw(year) {
    var temp_data = data[year]

    var t = d3.transition()
        .duration(500);

    var type = temp_data.map(function (d) {
        return d.level_2;
    });
    x_scale.domain(type);

    var max_value = d3.max(temp_data, function (d) {
        return +d.value;
    });

    y_scale.domain([0, max_value]);
    colour_scale.domain([0, max_value]);

    var bars = svg.selectAll('.bar')
        .data(temp_data)

    bars
        .exit()
        .remove();

    var new_bars = bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) {
            return x_scale(d.level_2);
        })
        .attr('width', x_scale.bandwidth())
        .attr('y', height)
        .attr('height', 0)

    new_bars.merge(bars)
        .transition(t)
        .attr('y', function (d) {
            return y_scale(+d.value);
        })
        .attr('height', function (d) {
            return height - y_scale(+d.value)
        })
        .attr('fill', function (d) {
            return colour_scale(+d.value);
        })

    svg.select('.x.axis')
        .call(x_axis);

    svg.select('.y.axis')
        .transition(t)
        .call(y_axis);

}
data = {}
async function get() {
    requestUrl = 'https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf&limit=100';
    let datastorez = await (await fetch(requestUrl)).json();
    return datastorez.result['records'];
}
(async () => {
    result = await get()
    const unique = [...new Set(result.map(item => item.year))];

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
        draw(this.value)
    });
})()

// var data = []
// data = fetch(requestUrl).json();
// console.log(data)


