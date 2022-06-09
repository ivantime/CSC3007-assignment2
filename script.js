//Begin prep for chart
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
    .domain([0, height])
    .range([0, 100]);

// var colour_scale = d3.scaleQuantile()
// .range(["#FA985C", "#8291DB", "#CBF24B", "#DB3941", "#42E7FF", "#5C93FA", "#DB958B", "#CBF24B", "#397FDB"]);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

svg.append('g')
    .attr('class', 'y axis');

function drawOne(year) {
    var temp_data = dataYear[year]
    var type = temp_data.map(function (d) {
        return d.level_2;
    });
    x_scale.domain(type);

    var max_value = d3.max(temp_data, function (d) {
        return +d.value;
    });

    y_scale.domain([0, max_value]);
    // colour_scale.domain([0, max_value]);

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
                // .attr('fill', colour_scale(d.value))

                //Add Color scale according to radius size
                .attr("fill", d => d3.interpolateViridis(colorScale(d.value)))


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
                .attr('y', y_scale(d.value) - 15)
                .attr('height', height - y_scale(d.value) + 15)
                .attr('width', x_scale.bandwidth())
        })

    var slider = d3.select('#year');
    slider.on('change', function () {
        d3.selectAll('.extraBar').remove();
        d3.selectAll('.bar').remove();
        drawOne(this.value)
    });
    svg.selectAll(".extraBar")
        .on('mouseover', function (d, i) {
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


    svg.select('.x.axis')
        .call(x_axis);

    svg.select('.y.axis')
        .transition().duration(500)
        .call(y_axis);

}


function drawTwo(level) {
    var temp_data = dataLevel[level]

    var year = temp_data.map(function (d) {
        return d.year;
    });
    x_scale.domain(year);

    var max_value = d3.max(temp_data, function (d) {
        return +d.value;
    });

    y_scale.domain([0, max_value]);
    // colour_scale.domain([0, max_value]);

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
                .attr('x', x_scale(d.year))
                .attr('width', x_scale.bandwidth())
                .attr('y', height)
                .attr('height', 0)
                .transition().duration(500)
                .attr('y', y_scale(d.value))
                .attr('height', height - y_scale(d.value))
                .attr('x', x_scale(d.year))
                .attr('width', x_scale.bandwidth())
                // .attr('fill', colour_scale(d.value))

                //Add Color scale according to radius size
                .attr("fill", d => d3.interpolateViridis(colorScale(d.value)))


            d3.select(this)
                .append("rect")
                .attr('class', 'extraBar')
                .style("opacity", "0")
                .attr('x', x_scale(d.year))
                .attr('width', x_scale.bandwidth())
                .attr('y', height)
                .attr('height', 0)
                .transition().duration(500)
                .attr('x', x_scale(d.year))
                .attr('y', y_scale(d.value) - 15)
                .attr('height', height - y_scale(d.value) + 15)
                .attr('width', x_scale.bandwidth())
        })

    svg.selectAll(".extraBar")
        .on('mouseover', function (d, i) {
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
                " <br>(<u><b>" + percent(i.value, temp_data) + "%</b></u> of all " + temp_data[0].level_2 + ")<br>")
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


    svg.selectAll("g.barers").append("path")
        .datum(avgCasesByYear)
        .attr("fill", "#69b3a2")
        .attr("fill-opacity", .3)
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x(function (d) { return x_scale(d.year) })
            .y0(height)
            .y1(function (d) { return y_scale(d.total) })
        )

    // Add the line
    svg.selectAll("g.barers").append("path")
        .datum(avgCasesByYear)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 4)
        .attr("d", d3.line()
            .x(function (d) { return x_scale(d.year) })
            .y(function (d) { return y_scale(d.total) })
        )
    // Add the line
    svg.selectAll("g.barers")
        .data(avgCasesByYear)
        .enter()
        .append("circle")
        .attr("fill", "red")
        .attr("cx", function (d) { return x_scale(d.year) })
        .attr("cy", function (d) { return y_scale(d.total) })
        .attr("r", 3)

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
//get data
dataYear = {}
dataLevel = {}

uniqueLevel = {}
avgCasesByYear = {}

async function get() {
    requestUrl = 'https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf';
    let datastorez = await (await fetch(requestUrl)).json();
    return datastorez.result['records'];
}
(async () => {
    result = await get()
    const uniqueYear = [...new Set(result.map(item => item.year))];


    var minYear = Math.min.apply(null, uniqueYear);
    var maxYear = Math.max.apply(null, uniqueYear);


    d3.select('#year').attr('min', minYear).attr('max', maxYear);

    for (year in uniqueYear) {
        y1 = uniqueYear[year];
        dataYear[y1] = result.filter(relevantYear => {
            return relevantYear.year === y1
        })
    }

    uniqueLevel = [...new Set(result.map(item => item.level_2))];

    for (level in uniqueLevel) {
        l1 = uniqueLevel[level];
        dataLevel[l1] = result.filter(relevantLevel => {
            return relevantLevel.level_2 === l1
        })
    }

    for (index in uniqueYear) {
        //get number of cases per year
        const currYear = dataYear[uniqueYear[index]].filter(data => data.year === uniqueYear[index])

        //get the average of cases per year (with rounding down)
        avgCasesByYear[index] = {
            "total": Math.round(currYear.reduce((total, next) => total + parseInt(next.value), 0)),
            "year": uniqueYear[index]
        }
    }
    console.log(avgCasesByYear)

    //reset dropdownlist values if any and refill for Trend
    d3.select("#dropDownList")
        .selectAll('myOptions')
        .data(uniqueLevel)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    var dropdownlist = d3.select('#dropDownList');
    dropdownlist.on('change', function () {

        d3.selectAll('.extraBar').remove();
        d3.selectAll('.bar').remove();
        drawTwo(this.value)
    });



    //draw first year by default
    drawOne(uniqueYear[0]);
    //by default show year slider, text and current year and set year as first year
    d3.select("#year").style("visibility", "visible")
    d3.select("#year").property("value", uniqueYear[0])

    d3.select("#slider_selected_year").style("visibility", "visible")
    d3.select("#slider_selected_year").property("value", uniqueYear[0])

    d3.select("#yearLabel").style("visibility", "visible")



    if (d3.select("#myCheckbox").on("click", function (d) {
        var check = this.checked;

        //switch currently at plot by TREND
        if (check == true) {
            console.log("By Trend")


            //hide year slider, text and current year
            d3.select("#year").style("visibility", "hidden")
            d3.select("#slider_selected_year").style("visibility", "hidden")
            d3.select("#yearLabel").style("visibility", "hidden")

            //show dropdownlist and level Label
            d3.select("#dropDownList").style("visibility", "visible")
            d3.select("#levelLabel").style("visibility", "visible")

            //remove current bars
            d3.selectAll('.extraBar').remove();
            d3.selectAll('.bar').remove();

            //redraw for the level plot
            drawTwo(uniqueLevel[0])


        }
        //switch currently at plot by YEAR
        else {
            console.log("By Year")

            //show year slider, text and current year
            d3.select("#year").style("visibility", "visible")
            d3.select("#year").property("value", uniqueYear[0])
            d3.select("#slider_selected_year").style("visibility", "visible")
            d3.select("#slider_selected_year").property("value", uniqueYear[0])
            d3.select("#yearLabel").style("visibility", "visible")


            //hide dropdownlist and level Label
            d3.select("#dropDownList").style("visibility", "hidden")
            d3.select("#levelLabel").style("visibility", "hidden")

            //remove current bars
            d3.selectAll('.extraBar').remove();
            d3.selectAll('.bar').remove();

            //redraw for the year plot
            drawOne(uniqueYear[0]);

        }
    }));
})()

//by default set as year
d3.select("#myCheckbox").property('checked', false);

