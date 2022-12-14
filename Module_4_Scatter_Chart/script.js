let margin = { top: 10, right: 30, bottom: 30, left: 60 };
let width = 860 - margin.left - margin.right;
let height = 600 - margin.top - margin.bottom;

var svg = d3
  .select("#chart-container")
  .append("svg")
  .attr("id", "chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((data) => {
    // Adding date property to the data object

    data.forEach((item) => {});

    // Adding X axis
    let xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data.map((item) => item.Year - 1)),
        d3.max(data.map((item) => item.Year + 1)),
      ])
      .range([0, width]);

    svg
      .append("g")
      .call(d3.axisBottom(xScale).tickFormat((d) => d))
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")");

    // Adding Y axis
    let yScale = d3
      .scaleTime()
      .range([0, height])
      .domain([
        d3.min(data.map((item) => timeParser(item.Seconds))),
        d3.max(data.map((item) => timeParser(item.Seconds))),
      ]);

    svg
      .append("g")
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")))
      .attr("id", "y-axis");

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Adding Dots
    svg
      .append("g")
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(timeParser(d.Seconds)))
      .attr("r", 7)
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => timeParser(d.Seconds))
      .style("stroke", "black")
      .style("fill", (d) => color(d.Doping !== ""))
      .style("opacity", 0.7)
      .on("mouseover", (e, d) => {
        d3.select("#tooltip")
          .attr("data-year", d.Year)
          .style("opacity", 0.9)
          .style("top", yScale(timeParser(d.Seconds)) + 100 + "px")
          .style("left", xScale(d.Year) + 130 + "px");
        d3.select("#tooltip-name").text(d.Name);
        d3.select("#tooltip-country").text(d.Nationality);
        d3.select("#tooltip-year").text("Year : " + d.Year);
        d3.select("#tooltip-time").text("Time : " + d.Time);
        d3.select("#tooltip-allegation").text(d.Doping);
      })
      .on("mouseout", function () {
        d3.select("#tooltip")
          .style("opacity", 0)
          .style("top", 0)
          .style("right", 0);
      });

    // adding label to the y axis
    svg
      .append("text")
      .attr("id", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", 0 - height / 2 + 100)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .text("Time in Minutes");

    // Adding the legend
    let legend = svg
      .append("g")
      .attr("id", "legend")
      .selectAll("#legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend-label")
      .attr("transform", function (d, i) {
        return "translate(0," + (height / 2 - i * 20) + ")";
      });

    // Adding the legend rectangles
    legend
      .append("rect")
      .attr("x", width - 205)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    // Adding the legend text
    legend
      .append("text")
      .attr("x", width - 180)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function (d) {
        if (d) {
          return "Riders with doping allegations";
        } else {
          return "No doping allegations";
        }
      });
  })
  .catch((error) => {
    if (error) throw error;
  });

//convert seconds to minutes -> [mm,ss]
function timeParser(seconds) {
  let secs = seconds % 60;
  let mins = (seconds - secs) / 60;

  return new Date(1995, 5, 3, 0, mins, secs);
}