
  ////SECTION 1

d3.csv('data1.csv', row, callback);
function row(d) {
  for(var k in d) {
    if(d.hasOwnProperty(k) && k !== 'Country') d[k] = + d[k];
  }
  return d;
}

function callback(err, data) {
  if(err) return console.error(err);

  var w = 900, h = 1500;
  var margin = {top:11, right:40, bottom: 20, left: 20};
  var innerW = w - margin.right - margin.left,
      innerH = h - margin.top - margin.bottom;

  var xRange = [0, innerW/2];
  var x2Range = [0, -innerW/2];
  var yRange = [0, innerH];

  var yDomain = data.map(function(d){return d.Country;});
  var xDomain = [0, 36.7]
  // var xDomain = d3.extent(data, function(d){return d.Earning}); //scaleLinear기초작업
  var x2Domain = [0, 61.1]
  // var x2Domain = d3.extent(data, function(d){return d.MenEdu}); //scaleLinear기초작업

  var y = d3.scaleBand()
  .domain(yDomain)
  .range(yRange)
  .paddingInner([0.1])
  .paddingOuter([0.3])
  .align([0.5]);
  var x = d3.scaleLinear()
  .domain(xDomain)
  .range(xRange);
  var x2 = d3.scaleLinear()
  .domain(x2Domain)
  .range(x2Range)

  var xColor = d3.scaleLinear()
              .domain(xDomain)
              .rangeRound([60, 200]);


  var svg1 = d3.select('#graph1').append('svg')
    .attr('width', w)
    .attr('height', h)
    .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

  var xAxis = d3.axisBottom(x)
          .tickSize(0)
          .tickPadding(-10-innerH)
          .tickSizeInner(innerH);

  var x2Axis = d3.axisBottom(x2)
          .tickSize(0)
          .tickPadding(-innerH-10)
          .tickSizeInner(innerH);

  var yAxis = d3.axisLeft(y)
    .tickSizeOuter(0)
    .tickSizeInner(0);

  svg1.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate('+ [innerW/2, 0]+ ')')
  .attr("fill", "black")
  .call(xAxis);

  svg1.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate('+ [innerW/2, 0]+ ')')
  .attr("fill", "black")
  .call(x2Axis);

  var bar = svg1.selectAll('.bar')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .attr('class', 'bar')
            .attr('transform', function(d){
          return 'translate('+ innerW/2 + ',' + (y(d.Country)+5) + ')'
          })
  var rect = bar.append('rect')
        .attr('height', y.bandwidth()-10)
        .attr('width', function(d){return x(d.Earning)})
        .style('fill', function(d){return 'rgb(100,' + xColor(d.Earning) + ',80)'});

  var bar2 = svg1.selectAll('.bar2')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .attr('class', 'bar2')
            .attr('transform', function(d){
                    return 'translate('+ (innerW/2 + x2(d.MenEdu)) + ',' + y(d.Country) + ')'
                    })
  var rect2 = bar2.append('rect')
        .attr('height', y.bandwidth()/2)
        .attr('width', function(d){return -x2(d.MenEdu)})
        .style('fill', function(d){return 'rgb(52,152,219)'})
        .style('opacity', 0.9)

  var bar3 = svg1.selectAll('.bar3')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .attr('class', 'bar3')
            .attr('transform', function(d){
                    return 'translate('+ (innerW/2 + x2(d.WomenEdu)) + ',' + (y(d.Country)+y.bandwidth()/2) + ')'
                    })
  var rect3 = bar3.append('rect')
        .attr('height', y.bandwidth()/2-2)
        .attr('width', function(d){return -x2(d.WomenEdu)})
        .style('fill', function(d){return 'rgb(231,76,60)'})
        .style('opacity', 0.9)

  var bar4 = svg1.selectAll('.bar4')
        .data(data, function(d){return d.Country})
        .enter().append('g')
        .attr('class', 'bar4')
        .attr('transform', function(d){
                if (x2(d.Gap)<0) { return 'translate('+ (innerW/2 + x2(d.Gap)) + ',' + (y(d.Country)+y.bandwidth()/2) + ')'}
                else { return 'translate('+ (innerW/2 - x2(d.Gap)) + ',' + (y(d.Country)+y.bandwidth()/2) + ')'}
                })
  var rect4 = bar4.append('circle')
        .attr('r', 6)
        // .attr('stroke', 'black')
        .style('fill',function(d){
                if (x2(d.Gap)<0) { return 'rgb(206, 66, 2)'}
                else { return 'rgb(0, 86, 224)'}
                })

  svg1.append('g')
  .attr('id', 'yaxis')
  .attr('transform', 'translate('+ [innerW/2, 0]+ ')')
  .call(yAxis)
  .selectAll('text')
  .attr("fill", "white")
  .attr("text-anchor", "middle")
  .attr('font-size', 14)
  .attr('font-style', 'italic')
  .attr('font-weight', 700)

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
      return "<span style='color:white'>" + Math.round(10*d.Earning)/10 + '%' +"</span>";
    })
    tip.offset(function() {
      return [-10, this.getBBox().width/2]
    })

  var tip2 = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    return "<span style='color:white'>" + Math.round(10*d.MenEdu)/10 + '%' +"</span>";
  })
  tip2.offset(function() {
    return [-10, -this.getBBox().width/2]
  })

  var tip3 = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    return "<span style='color:white'>" + Math.round(10*d.WomenEdu)/10 + '%' +"</span>";
  })
  tip3.offset(function() {
    return [-10, -this.getBBox().width/2]
  })

  svg1.call(tip);
  svg1.call(tip2);
  svg1.call(tip3);

  d3.selectAll('.bar')
  .on('mouseenter', tip.show)
  .on('mouseleave', tip.hide)

  d3.selectAll('.bar2')
  .on('mouseenter', tip2.show)
  .on('mouseleave', tip2.hide)

  d3.selectAll('.bar3')
  .on('mouseenter', tip3.show)
  .on('mouseleave', tip3.hide)

  d3.selectAll('#tool2')
  .style('cursor', 'pointer')
  .on('click', function(d) { //바 하나만 선택했을 경우
      var x0 = y.domain(data.sort(
            function(a, b) { return b.Earning - a.Earning; })
            .map(function(d) { return d.Country; }))
            .copy();

        svg1.selectAll(".bar")
            .sort(function(a, b) { return x0(a.Country) - x0(b.Country); });

        var transition = svg1.transition().duration(750)

        transition.selectAll(".bar")
            .attr('transform', function(d){
          return 'translate('+ innerW/2 + ',' + (x0(d.Country)+5) + ')'
          })

        svg1.selectAll(".bar2")
            .sort(function(a, b) { return x0(a.Country) - x0(b.Country); });
        transition.selectAll(".bar2")
        .attr('transform', function(d){
                return 'translate('+ (innerW/2 + x2(d.MenEdu)) + ',' + y(d.Country) + ')'
                })

        svg1.selectAll(".bar3")
            .sort(function(a, b) { return x0(a.Country) - x0(b.Country); });
        transition.selectAll(".bar3")
        .attr('transform', function(d){
                return 'translate('+ (innerW/2 + x2(d.WomenEdu)) + ',' + (y(d.Country)+x0.bandwidth()/2) + ')'
                })

        svg1.selectAll(".bar4")
            .sort(function(a, b) { return x0(a.Country) - x0(b.Country); });
        transition.selectAll(".bar4")
        .attr('transform', function(d){
                if (x2(d.Gap)<0) { return 'translate('+ (innerW/2 + x2(d.Gap)) + ',' + (y(d.Country)+x0.bandwidth()/2) + ')'}
                else { return 'translate('+ (innerW/2 - x2(d.Gap)) + ',' + (y(d.Country)+x0.bandwidth()/2) + ')'}
                })

        transition.select("#yaxis")
          .call(yAxis)
      });

    d3.selectAll('#tool1')
    .style('cursor', 'pointer')
    .on('click', function(d) { //바 하나만 선택했을 경우
        var x0 = y.domain(data.sort(
              function(a, b) { return b.Gap - a.Gap; })
              .map(function(d) { return d.Country; }))
              .copy();

          var transition = svg1.transition().duration(750)

          svg1.selectAll(".bar")
              .sort(function(a, b) { return x0(a.Country) - x0(b.Country); });
          transition.selectAll(".bar")
              .attr('transform', function(d){
            return 'translate('+ innerW/2 + ',' + (x0(d.Country)+5) + ')'
            })

          svg1.selectAll(".bar2")
              .sort(function(a, b) { return x0(a.Country) - x0(b.Country); });
          transition.selectAll(".bar2")
          .attr('transform', function(d){
                  return 'translate('+ (innerW/2 + x2(d.MenEdu)) + ',' + y(d.Country) + ')'
                  })

          svg1.selectAll(".bar3")
              .sort(function(a, b) { return x0(a.Country) - x0(b.Country); });
          transition.selectAll(".bar3")
          .attr('transform', function(d){
                  return 'translate('+ (innerW/2 + x2(d.WomenEdu)) + ',' + (y(d.Country)+x0.bandwidth()/2) + ')'
                  })

          svg1.selectAll(".bar4")
              .sort(function(a, b) { return x0(a.Country) - x0(b.Country); });
          transition.selectAll(".bar4")
          .attr('transform', function(d){
                  if (x2(d.Gap)<0) { return 'translate('+ (innerW/2 + x2(d.Gap)) + ',' + (y(d.Country)+x0.bandwidth()/2) + ')'}
                  else { return 'translate('+ (innerW/2 - x2(d.Gap)) + ',' + (y(d.Country)+x0.bandwidth()/2) + ')'}
                  })

          transition.select("#yaxis")
            .call(yAxis)
        });

}

  ////SECTION 2

d3.csv('data2.csv', row, callback2);
function row(d) {
  for(var k in d) {
    if(d.hasOwnProperty(k) && k !== 'Country') d[k] = + d[k];
  }
  return d;
}

function callback2(err, data) {

  if(err) return console.error(err);

  var w = 450, h = 450;
  var margin = {top:10, right:40, bottom: 20, left: 20};
  var innerW = w - margin.right - margin.left,
      innerH = h - margin.top - margin.bottom;

  var xRange = [0, innerW];
  var yRange = [innerH, 0];

  var xDomain = ['1차 교육', '2차 교육', '3차 교육']
  var yDomain = d3.extent(data, function(d){return d.WomenEdu1}); //scaleLinear기초작업

  var svg2 = d3.select('#graph2').append('svg')
    .attr('width', w)
    .attr('height', h)
    .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

  var x = d3.scaleBand()
  .domain(xDomain)
  .range(xRange);
  var y = d3.scaleLinear()
  .domain(yDomain)
  .range(yRange);

  var xAxis = d3.axisBottom(x)
          .tickSize(0)
          .tickPadding(6);

  var yAxis = d3.axisLeft(y)
    .tickSizeOuter(0)
    .tickSizeInner(-innerW);
    //Axis 함수 선언

  svg2.append('g') //g를 먼저 추가하고
  .attr('class', 'x axis')
  .attr('transform', 'translate('+ [0, innerH]+ ')')
  .call(xAxis); //xAxis를 실행

  svg2.append('g')
  .attr('class', 'y axis')
  .call(yAxis);



  var opacity = 0.3
  var rectHeight = 5
  var rectWidth = x.bandwidth()/2

  var bar = svg2.selectAll('.bar')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .filter(function(d) { return d.WomenEdu1 > 0 })
            .attr('class', 'bar')
            .attr('transform', function(d){
            return 'translate(' + x('1차 교육') + ',' + y(d.WomenEdu1) + ')'
            })
  var rect = bar.append('rect')
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .style('fill', function(d){return 'rgb(231,76,60)'})
        .style("opacity", opacity);

  var bar2 = svg2.selectAll('.bar2')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .filter(function(d) { return d.MenEdu1 > 0 })
            .attr('class', 'bar2')
            .attr('transform', function(d){
            return 'translate(' + (x('1차 교육')+rectWidth) + ',' + y(d.MenEdu1) + ')'
            })
  var rect2 = bar2.append('rect')
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .style('fill', function(d){return 'rgb(52,152,219)'})
        .style("opacity", opacity);

  var bar3 = svg2.selectAll('.bar3')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .filter(function(d) { return d.WomenEdu2 > 0 })
            .attr('class', 'bar3')
            .attr('transform', function(d){
            return 'translate(' + x('2차 교육') + ',' + y(d.WomenEdu2) + ')'
            })
  var rect3 = bar3.append('rect')
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .style('fill', function(d){return 'rgb(231,76,60)'})
        .style("opacity", opacity);

  var bar4 = svg2.selectAll('.bar4')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .filter(function(d) { return d.MenEdu2 > 0 })
            .attr('class', 'bar4')
            .attr('transform', function(d){
            return 'translate(' + (x('2차 교육')+rectWidth) + ',' + y(d.MenEdu2) + ')'
            })
  var rect4 = bar4.append('rect')
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .style('fill', function(d){return 'rgb(52,152,219)'})
        .style("opacity", opacity);

  var bar5 = svg2.selectAll('.bar5')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .filter(function(d) { return d.WomenEdu3 > 0 })
            .attr('class', 'bar5')
            .attr('transform', function(d){
            return 'translate(' + x('3차 교육') + ',' + y(d.WomenEdu3) + ')'
            })
  var rect5 = bar5.append('rect')
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .style('fill', function(d){return 'rgb(231,76,60)'})
        .style("opacity", opacity);

  var bar6 = svg2.selectAll('.bar6')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .filter(function(d) { return d.MenEdu3 > 0 })
            .attr('class', 'bar6')
            .attr('transform', function(d){
            return 'translate(' + (x('3차 교육')+rectWidth) + ',' + y(d.MenEdu3) + ')'
            })
  var rect6 = bar6.append('rect')
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .style('fill', function(d){return 'rgb(52,152,219)'})
        .style("opacity", opacity);

  var svg3 = d3.select('#graph2').append('svg')
    .attr('width', w)
    .attr('height', h)
    .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

  var x = d3.scaleBand()
  .domain(xDomain)
  .range(xRange);
  var y = d3.scaleLinear()
  .domain(yDomain)
  .range(yRange);

  var xAxis = d3.axisBottom(x)
          .tickSize(0)
          .tickPadding(6);

  var yAxis = d3.axisLeft(y)
    .tickSizeOuter(0)
    .tickSizeInner(-innerW);
    //Axis 함수 선언

  svg3.append('g') //g를 먼저 추가하고
  .attr('class', 'x axis')
  .attr('transform', 'translate('+ [0, innerH]+ ')')
  .call(xAxis); //xAxis를 실행

  svg3.append('g')
  .attr('class', 'y axis')
  .call(yAxis);

  var opacity = 0.3
  var rectHeight = 5
  var rectWidth = x.bandwidth()

  var bar7 = svg3.selectAll('.bar7')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .filter(function(d) { return d.Earning1 > 0 })
            .attr('class', 'bar7')
            .attr('transform', function(d){
            return 'translate(' + x('1차 교육') + ',' + y(d.Earning1) + ')'
            })
  var rect7 = bar7.append('rect')
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .style('fill', function(d){return 'rgb(76,153,0)'})
        .style("opacity", opacity);

  var bar8 = svg3.selectAll('.bar8')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .filter(function(d) { return d.Earning2 > 0 })
            .attr('class', 'bar8')
            .attr('transform', function(d){
            return 'translate(' + (x('2차 교육')) + ',' + y(d.Earning2) + ')'
            })
  var rect8 = bar8.append('rect')
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .style('fill', function(d){return 'rgb(76,153,0)'})
        .style("opacity", opacity);

  var bar9 = svg3.selectAll('.bar9')
            .data(data, function(d){return d.Country})
            .enter().append('g')
            .filter(function(d) { return d.Earning3 > 0 })
            .attr('class', 'bar9')
            .attr('transform', function(d){
            return 'translate(' + x('3차 교육') + ',' + y(d.Earning3) + ')'
            })
  var rect9 = bar9.append('rect')
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .style('fill', function(d){return 'rgb(76,153,0)'})
        .style("opacity", opacity);
}


  ////SECTION 7

d3.csv('data3-1.csv', row, callback3);
function row(d) {
  for(var k in d) {
    if(d.hasOwnProperty(k) && k !== 'Country') d[k] = + d[k];
  }
  return d;
}

function callback3(err, data) {
  if(err) return console.error(err)

  var w = 400;
  var h = 3000;
  var margin = {top:10, right:10, bottom: 10, left: 30};
  var innerW = w - margin.right - margin.left;
  var innerH = h - margin.top - margin.bottom;

  var svg = d3.select('#graph7').append('svg')
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

  var nest = d3.nest()
      .key(function(d) { return d.Country; })
      .entries(data);

  var x = d3.scalePoint()
        .domain(data.map(function(d){console.log(d); return d.Date}))
        .range([0, innerW]);

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){return d.Num})])
    .range([innerH/35, 0]);

  var xAxis = d3.axisBottom(x)
  .ticks(5);

  var yAxis = d3.axisLeft(y)
  .ticks(5);

    //Axis 함수 선언

  var header = d3.set(data.map(function(s){return s.Country;})).values()

  var region = d3.scaleBand()
        .domain(header)
        .range([0, innerH]).padding(.2)

  var line = d3.line()
      .x(function(d) { return x(d.Date); })
      .y(function(d) { return y(d.Num); })

  nest.map(function(d, i){
    for (j = 0; j < 36; j++) {
      var series = svg.selectAll('.series')
        .data(nest, function(d){return d.key})
        .enter().append('g')
        .filter(function(s){return s.key===header[j]})
        .attr('class', 'series')

      series.append('path')
      .datum(function(d){return d.values})
      .style('fill', 'none')
      .style('stroke', 'black')
      .attr('d', line)
      .attr('transform', 'translate('+ 0 + ',' + (region(header[j])) +')')

      series.append('g') //g를 먼저 추가하고
      .attr('class', 'x axis')
      .attr('transform', 'translate('+ 0 + ',' + (region(header[j])+innerH/35) +')')
      .call(xAxis) //xAxis를 실행

      series.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate('+ 0 + ',' + (region(header[j])) +')')
      .call(yAxis)

      series.append('text')
      .attr('transform', 'translate('+ 10 + ',' + ((region(header[j]))+80) +')')
      .text(function(d){return d.key})
    }
  })

}
