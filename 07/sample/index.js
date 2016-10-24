var w = 320;
var h = 200;
var dataset = [
  {product:'A', sales:200},
  {product:'B', sales:300},
  {product:'C', sales:400},
  {product:'D', sales:500},
  {product:'E', sales:100}
];

var margin = {top: 20, right: 20, bottom:20, left:30};
var innerW = w - margin.left - margin.right,
 innerH = h - margin.top - margin.bottom;

var xRange = [0, innerW];
var yRange = [innerH, 0];

var xDomain = dataset.map(function(d){return d.product;});
var x = d3.scaleBand()
  .domain(xDomain)
  .rangeRound(xRange)
  .padding(0.1);

var yDomain = d3.extent(dataset, function(d){return d.sales;});
yDomain[0] = 0;

var y = d3.scaleLinear()
  .domain(yDomain)
  .rangeRound(yRange);

var color = d3.scaleLinear()
  .domain(yDomain)
  .rangeRound([0, 255]);

var xAxis = d3.axisBottom(x)
  .tickSize(0)
  .tickPadding(6);

var yAxis = d3.axisLeft(y)
  .ticks(5)
  .tickSize(-innerW);
var rand = d3.randomUniform(yDomain[0], yDomain[1]);
var svg = d3.select('#vertical')
  .append('svg')
    .attr('width', w)
    .attr('height', h)
  .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

var xAxisG = svg.append('g') //g를 먼저 추가하고
  .attr('class', 'x axis')
  .attr('transform', 'translate('+ [0, innerH]+ ')')
  .call(xAxis);
var yAxisG = svg.append('g') //g를 먼저 추가하고
  .attr('class', 'y axis')
  .call(yAxis);


var xyc = d3.local();
var bar = svg.selectAll('.bar')
  .data(dataset, function(d){return d.product;})
  .enter().append('g')
    .attr('class', 'bar')
    .call(updateBar)
    .call(translateBar);

var rect = bar.append('rect')
    .attr('width', x.bandwidth())
    .attr('height', function(d){return innerH - xyc.get(this).y;})
    .style('fill', function(d){return 'rgb(0, 0, ' + xyc.get(this).c +')';});

var text = bar.append('text')
  .attr('dx', x.bandwidth()*0.5)
  .attr('dy', function(d) {return '1em';})
  .attr('text-anchor', 'middle')
  .style('fill', 'white')
  .text(function(d){return d.product;});
bar.on('click', function(d){
  d3.event.stopPropagation();
  var b = d3.select(this);
  var t = d3.transition()
    .duration(600)
    .ease(d3.easeBounce);
  b.datum(function(d) {
    d.sales = Math.round(rand());
    return d;
  })
  .call(updateBar)
  .transition(t)
  .call(translateBar);
  b.select('rect')
    .transition(t)
  .call(updateRect);
});
svg.on('click', function(d) {
  randDataset();
  xDomain = dataset.map(function(d){return d.product;});
  x.domain(xDomain);

  var t = d3.transition()
    .duration(800);
  xAxisG.transition(t).call(xAxis);
  bar = bar.data(dataset, function(d){return d.product;})
    .call(updateBar);
  bar.exit().transition(t)
  .attr('transform', function(d) {
    return 'translate('+ [x.range()[0]-x.bandwidth(), xyc.get(this).y] + ')';
  })
  .style('opacity', 0)
  .remove();
  var barEnter = bar.enter().append('g')
    .call(updateBar)
    .attr('class', 'bar')
    .attr('transform', function(d) {
      return 'translate('+ [x.range()[1], xyc.get(this).y] + ')';
    })
    .style('opacity', 0);
  barEnter.append('rect')
     .attr('width', x.bandwidth())
     .call(updateRect);

  barEnter.append('text')
    .attr('dx', x.bandwidth()*0.5)
    .attr('dy', function(d) {return '1em';})
    .attr('text-anchor', 'middle')
    .style('fill', 'white')
    .text(function(d){return d.product;});

  bar = barEnter.merge(bar);

  bar.transition(t)
    .style('opacity', 1)
    .call(translateBar);
  // bar.select('rect')
  //   .transition(t)
  //   .call(updateRect);
  //bar.select('text')
    //.call(updateText);
});
function updateBar(selection) {
  selection.each(function(d) {
    var o = {};
    o.x = x(d.product);
    o.y = y(d.sales);
    o.c = color(d.sales);
    xyc.set(this, o);
  });
  return selection;
}
function translateBar(selection) {
  selection.attr('transform', function(d){
    return 'translate('+ [xyc.get(this).x, xyc.get(this).y] + ')';
  });
  return selection;
}
function updateRect(selection) {
  selection.attr('height', function(d){return innerH - xyc.get(this).y;})
   .style('fill', function(d){return 'rgb(0, 0, ' + xyc.get(this).c +')';});
  return selection;
}
function updateText(selection) {
  selection.text(function(d){return d.product;});
  return selection;
}
var randDataset = (function() {
var asciiRange = [65, 90], curAscii = 70;
return function() {
 var newVal = {product: String.fromCharCode(curAscii),
   sales : Math.round(rand())};
 dataset.push(newVal);
 dataset.shift();
 curAscii +=1;
 if(curAscii>asciiRange[1]) curAscii = asciiRange[0];
};
}());
