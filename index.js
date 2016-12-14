d3.json('list.json', callback);
var width, height;
var initTransition = d3.transition().delay(800)
  .duration(1000);
var colorMap = {'KBO' : '#DC143C', 'GENDER': '#3D9140', 'MQs':'#1E90FF'};
function callback(err, data) {
  if(err) throw err;
  render(data);
}

function render(data) {
  var nest = d3.nest().key(function(d){return d.category;})
    .entries(data);

  var cards = d3.select('#container').selectAll('.cards')
      .data(nest, function(d){return d.key;})
    .enter().append('div')
      .attr('class', 'cards')
      .attr('id', function(d){return d.key;})

  cards.append('div')
    .attr('class', 'category')
    .text(function(d){return d.key;});

  var card = cards.selectAll('.card')
      .data(function(d){return d.values;}, function(d){return d.name_en;})
    .enter().append('div')
      .attr('class', 'card')
      .on('mouseenter', function() {
        d3.select(this).select('.curtain').transition().duration(400).style('opacity', 0);
      }).on('mouseleave', function() {
        d3.select(this).select('.curtain').transition().duration(400).style('opacity', 1);
      });

  height = +card.style('height').replace('px', '');
  width = +card.style('width').replace('px', '');

  var svg = card.append('a')
    .attr('href', function(d){return 'sites/'+ d.name_en;})
    .append('svg')
    .attr('class', 'canvas');
  svg.call(appendClip);
  svg.append('g')
    .attr('class', 'background')
    .call(appendText);
  svg.append('a').append('image')
    .attr('class', 'screenshot')
    .attr('xlink:href', function(d){return 'screenshot/' + d.name_en + '.png';})
    .attr('x', 0).attr('y', 0)
    .attr('width', width).attr('height', height)
    .attr('clip-path', function(d){return 'url(#clip-'+ d.name_en + ')';});

  svg.append('rect')
    .attr('class', 'curtain')
    .attr('x', 0).attr('y', 0)
    .attr('width', width).attr('height', height)
    .style('fill', function(d){return colorMap[d.category];})
    .attr('clip-path', function(d){return 'url(#clip-'+ d.name_en + ')';});
  svg.append('g')
    .attr('class', 'foreground').call(appendText, true);

  d3.select('#container').transition()
      .duration(800)
      .style('opacity', 1);
}

function appendClip(selection) {
  var clipType = ['area', 'circle'];
  var area = d3.area()
    .y0(function(){return height;})
    .curve(d3.curveCatmullRom.alpha(0.5));
  selection.append('defs')
    .append('clipPath')
  .attr('id', function(d) { return 'clip-' + d.name_en;})
  .each(function(d) {
      var pointNum = Math.max(4, Math.floor(Math.random()*9));
      var x = d3.scalePoint().domain(d3.range(pointNum))
        .range([0,width]);
      var points = d3.range(pointNum).map(function(d) {
        return {x:d, y:height*0.6-Math.round(height*Math.random()*0.3)};
      });
      area.x(function(d){return x(d.x);}).y1(function(d){return height;});
      var path = d3.select(this).append('path')
        .datum(points)
        .attr('d', area);

      area.y1(function(d){return d.y;});
      path.transition(initTransition)
        .ease(d3.easeSin)
        .attr('d', area);

  });

  return selection;
}


function appendText(selection, isClipped) {
  selection.classed('clipped', isClipped);
  selection.style('opacity', 0)
    .transition(initTransition)
    .style('opacity',1);
  if(isClipped) selection.attr('clip-path', function(d){return 'url(#clip-'+ d.name_en + ')';});

  selection.append('text')
    .attr('class', 'name')
    .attr('y', '1em')
    .transition(initTransition)
    .attr('x',width/2)
    .text(function(d){return d.name_kr;});

  selection.append('text')
    .attr('class', 'college')
    .text(function(d){return d.college;})
    .attr('transform', 'rotate(90)')
    .transition(initTransition)
    .attr('transform', 'translate(4, 24) rotate(90)');


  selection.append('text')
    .attr('class', 'department')
    .text(function(d){return d.department;})
    .attr('transform', 'translate('+ (width-4) + ', '+ (height)+ ') rotate(-90)')
    .transition(initTransition)
    .attr('transform', 'translate('+ (width-4) + ', '+ (height-64)+ ') rotate(-90)');

  selection.append('text')
    .attr('class', 'title')
    .attr('x',width/2)
    .attr('y',height)
    .attr('dy', '-1.35em')
    .text(function(d){return d.title;})
    .call(wrap, width)

  return selection;
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", width/2).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width - 24) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", width/2).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
