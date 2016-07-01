var plot = function(elementid, bardata){
  console.log(bardata);
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
  width = 480 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  var colors = d3.scale.linear()
        .domain([0, d3.max(bardata)])
        .range(['#ffb832', '#c61c6f']);

  var yScale = d3.scale.linear()
        .domain([0, d3.max(bardata)])
        .range([0, height]);

  var xScale = d3.scale.ordinal()
       .domain(d3.range(0, bardata.length))
       .rangeBands([0, width]);

 var xAxis = d3.svg.axis()
       .scale(xScale)
       .orient("bottom");

 var yAxis = d3.svg.axis()
     .scale(d3.scale.linear()
           .domain([d3.max(bardata), 0])
           .range([0, height]))
     .orient("left")
     .ticks(5);

  var svg = d3.select(elementid).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  var rect = svg
      .selectAll('rect').data(bardata)
      .enter().append('rect')
        .style('fill', colors)
        .attr('width', xScale.rangeBand())
        .attr('height', 0)
        .attr('x', function(d, i){
           return xScale(i);
        })
        .attr('y', height)
      .on('mouseover', function(d){
        d3.select(this).style('opacity', 0.5);
      })
      .on('mouseout', function(d){
        d3.select(this).style('opacity', 1);
      })

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number");

    rect.transition()
      .attr('height', function(d){
        return yScale(d);
      })
      .attr('y', function(d){
        return height - yScale(d);
      })
      .delay(function(d, i){
        return i*20;
      })
      .duration(1000)
      .ease('elastic')

    // g.selectAll("text")
    //  .data(data)
    //  .enter()
    //  .append('text')
    //  .text(function(d){
    //     return d;
    //   })
    //  .attr('x', function(d, i){
    //      return xScale(i) + 2;
    //   })
    //  .attr('y', function(d, i){
    //     return height - yScale(d) + 15;
    //   })
    //  .attr("font-family", "sans-serif")
    //  .attr("font-size", "11px")
    //  .attr("fill", "white");
}
