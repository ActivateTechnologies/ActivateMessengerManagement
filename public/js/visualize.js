var plot = function(elementid, bardata){

  var height = 400, width = 600, barWidth = 50, barOffset = 5;

  var colors = d3.scale.linear()
                .domain([0, d3.max(bardata)])
                .range(['#ffb832', '#c61c6f']);

  var yScale = d3.scale.linear()
                .domain([0, d3.max(bardata)])
                .range([0, height]);

  var xScale = d3.scale.ordinal()
               .domain(d3.range(0, bardata.length))
               .rangeBands([0, width]);

  var myChart = d3.select(elementid).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
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

  myChart.transition()
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

}

plot("#newusersperweek", <%= newUsersWeekly %>)
