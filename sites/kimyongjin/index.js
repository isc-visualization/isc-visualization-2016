d3.csv('data.csv',callback);
d3.json('data2.json',callback2);
//continent, country,time,gender_wage_gap,parttime_women,employment_women,employment_men,fte_women,fte_men
var data = [];
var years  = d3.range(2003, 2014);

function callback(err, d) {
  if(err) return console.error(err);

  //var countries = d3.set( d.map(function(d){return d.country;} ) ).values();
  var countries = ['United States', 'United Kingdom'
    , 'Sweden'
    // , 'Spain'
    // , 'Slovak Republic'
    // , 'Portugal'
    , 'Poland', 'Norway', 'New Zealand'
    , 'Mexico', 'Korea'
    // , 'Japan'
    , 'Italy'
    // , 'Ireland'
    //, 'Iceland'
    , 'Hungary'
    // , 'Greece'
    , 'Germany', 'France'
    , 'Finland', 'Czech Republic'
    // , 'Canada'
    , 'Belgium', 'Austria', 'Australia'
  ];

  countries.forEach(function(country) {
    data.push({country:country});
  });

  d.forEach(function(d) {
    var country;

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      if (row.country === d.country) {
        country = row;
        break;
      }
    }

    if (country) {
      if (country.continent === undefined) {

        if (country.country == 'Korea') {
          country.continent = 'Korea';
        } else {
          country.continent = d.continent;
        }
      }

      country[d.time] = {};
      // country[d.time].time = Number(d.time);
      country[d.time].gender_wage_gap = Number(d.gender_wage_gap);
      country[d.time].parttime_women = Number(d.parttime_women);
      country[d.time].employment_women = Number(d.employment_women);
      country[d.time].employment_men = Number(d.employment_men);
      country[d.time].fte_women = Number(d.fte_women);
      country[d.time].fte_men = Number(d.fte_men);

      if (country[d.time].gender_wage_gap == 0) {
      	if (d.gender_wage_gap_fill.length) {
      		country[d.time].gender_wage_gap = Number(d.gender_wage_gap_fill);
      	}
      }

      if (country[d.time].fte_women == 0) {
      	if (d.fte_women_fill.length)
      		country[d.time].fte_women = Number(d.fte_women_fill);
      }

      if (country[d.time].fte_men == 0) {
      	if (d.fte_men_fill.length)
      		country[d.time].fte_men = Number(d.fte_men_fill);
      }

      country[d.time].fte_diff = country[d.time].fte_men - country[d.time].fte_women
    }

  });

  console.log(data);
  data.sort(function(a, b) { return d3.ascending(a.continent, b.continent) });
  gender_wage_gap_chart.init();
  fte_diff_and_gender_wage_gap_chart.init();
}

var gender_wage_gap_chart = {};
gender_wage_gap_chart.w = 600;
gender_wage_gap_chart.h = 400;
gender_wage_gap_chart.margin = {top:20, right:20, bottom: 20, left: 80};
gender_wage_gap_chart.innerW = gender_wage_gap_chart.w -  gender_wage_gap_chart.margin.right -  gender_wage_gap_chart.margin.left;
gender_wage_gap_chart.innerH = gender_wage_gap_chart.h -  gender_wage_gap_chart.margin.top -  gender_wage_gap_chart.margin.bottom;
gender_wage_gap_chart.x = d3.scaleLinear().range([ gender_wage_gap_chart.margin.left,  gender_wage_gap_chart.innerW]);
gender_wage_gap_chart.y = d3.scaleBand().range([ gender_wage_gap_chart.innerH,  gender_wage_gap_chart.margin.top]);
gender_wage_gap_chart.c = d3.scaleOrdinal().range(d3.schemeCategory20);
gender_wage_gap_chart.init = function() {
	var max_wage_gap = d3.max(data, function(d) {
			return d3.max(d3.entries(d), function(entry) {
				if (entry.key == '2013')
					return entry.value.gender_wage_gap;
				else
					return 0;
			});
	});

	this.x.domain([0, max_wage_gap]);

	var countries = d3.set(data.map(function(d){return d.country;})).values();
	this.y.domain(countries);

	var continents = d3.set(data.map(function(d){return d.continent;})).values();
	this.c.domain(continents);

  var svg = d3.select('#div_gender_wage_gap').append('svg')
              .attr('width', this.w)
              .attr('height', this.h);
	gender_wage_gap_chart.svg = svg;

	var xAxis = d3.axisBottom(this.x)
					.tickSize(0)
					.tickPadding(6);

	svg.append('g')
			.attr('class', 'x axis')
			.call(xAxis)
			.attr('transform', 'translate('+ [0, this.innerH]+ ')')

	svg.append('g')
		.attr('class', 'x title')
			.append("text")
			.attr('transform', 'translate('+ [this.innerW/2, this.h]+ ')')
			.style("text-anchor", "middle")
			.style('font-size', '10px')
			.text("GENDER WAGE GAP (%)");

	var yAxis = d3.axisLeft(this.y)
					.tickSize(0)
					//.ticks(10)
						.tickSizeOuter(0)
						//.tickSizeInner(-innerW);

	svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis)
			.attr('transform', 'translate('+ [this.margin.left, 0]+ ')')

  svg.append('g')
     .attr('class', 'content')
		 .attr('transform', 'translate('+ [this.margin.left, this.margin.top] + ')')

	svg.select("g.content").selectAll("rect")
	.data(data)
	.enter().append("rect")
	.attr('height', this.y.bandwidth() * 0.7)
	.attr('width', function(d) {return gender_wage_gap_chart.x(d['2013'].gender_wage_gap) - gender_wage_gap_chart.margin.left; })
	.attr('transform', function(d){
		return 'translate('+ [0, gender_wage_gap_chart.y(d.country)
		  + (gender_wage_gap_chart.y.bandwidth() * 0.3 / 2)
			- gender_wage_gap_chart.margin.top] + ')';
	 })
	 .style('fill', function(d) {return gender_wage_gap_chart.c(d.continent);});

	 var chipHeight = 12;
	 var chipPadding = 2;
	 var legendHeight = 16;
	 var legendPadding = 4;
	 var legend = svg.selectAll('.legend')
	  .data(gender_wage_gap_chart.c.domain())
	    .enter().append('g')
	    .attr('class', 'legend')
	    .attr('transform', function(d,i){
	      return 'translate(' + [gender_wage_gap_chart.innerW + legendHeight, legendHeight + i *(legendHeight + legendPadding)]+ ')'
	    })

	 legend.append('rect')
	  .attr('y', chipPadding)
	  .attr('width', chipHeight).attr('height', chipHeight)
	  .style('fill', function(d){return gender_wage_gap_chart.c(d)});

	 legend.append('text')
	  .attr('x', chipPadding+ chipHeight)
	  .attr('y', chipPadding)
	  .attr('dy', '.71em')
	  .style('font-size', '10px')
	  .text(function(d){return ''+d; })

}

var  fte_diff_and_gender_wage_gap_chart = {};
fte_diff_and_gender_wage_gap_chart.w = 800;
fte_diff_and_gender_wage_gap_chart.h = 400;
fte_diff_and_gender_wage_gap_chart.margin = {top:20, right:20, bottom: 20, left: 20};
fte_diff_and_gender_wage_gap_chart.innerW = fte_diff_and_gender_wage_gap_chart.w -  fte_diff_and_gender_wage_gap_chart.margin.right -  fte_diff_and_gender_wage_gap_chart.margin.left;
fte_diff_and_gender_wage_gap_chart.innerH = fte_diff_and_gender_wage_gap_chart.h -  fte_diff_and_gender_wage_gap_chart.margin.top -  fte_diff_and_gender_wage_gap_chart.margin.bottom;
fte_diff_and_gender_wage_gap_chart.x = d3.scaleLinear().range([ fte_diff_and_gender_wage_gap_chart.margin.left,  fte_diff_and_gender_wage_gap_chart.innerW]);
// var x = d3.scaleLinear().range([innerW, margin.left]);
fte_diff_and_gender_wage_gap_chart.y = d3.scaleLinear().range([ fte_diff_and_gender_wage_gap_chart.innerH,  fte_diff_and_gender_wage_gap_chart.margin.top]);
//var y = d3.scaleBand().range([innerH, 0]);
fte_diff_and_gender_wage_gap_chart.r = d3.scaleLinear().range([1, 60]);
fte_diff_and_gender_wage_gap_chart.c = d3.scaleOrdinal().range(d3.schemeCategory20);
fte_diff_and_gender_wage_gap_chart.selectedYear = 2003;
fte_diff_and_gender_wage_gap_chart.status = 'stopped'
fte_diff_and_gender_wage_gap_chart.duration = 1000;
fte_diff_and_gender_wage_gap_chart.transition = d3.transition().duration(fte_diff_and_gender_wage_gap_chart.duration).delay(0).ease(d3.easeElastic);
fte_diff_and_gender_wage_gap_chart.init = function() {

		d3.select('#select_gap_scatter_transition').selectAll('option')
	 .data(years)
	 .enter().append('option')
	 .text(function(d) {
	   return d;
	 });

	 d3.select('#select_gap_scatter_transition').on('change', function() {
	   var val = d3.select("#select_gap_scatter_transition").property('value');
	   fte_diff_and_gender_wage_gap_chart.changeYear(Number(val));
	 });

	 d3.select('#btn_start_gap_scatter_transition').on('click', function() {
			if (fte_diff_and_gender_wage_gap_chart.status == 'running') {
		 		return;
		 	}
	    fte_diff_and_gender_wage_gap_chart.startRotate();
	 });

	 d3.select('#btn_stop_gap_scatter_transition').on('click', function() {
	   fte_diff_and_gender_wage_gap_chart.status = 'interrupted';
	 });

    var max_wage_gap = d3.max(data, function(d) {
        return d3.max(d3.entries(d), function(year) {
          return year.value.gender_wage_gap;
        });
    });
		this.x.domain([0, max_wage_gap]);

    var yVals = [0];
    data.forEach(function(d) {
      d3.entries(d).forEach(function(y) {
         if (y.value.fte_diff) {
           //yVals.push(y.value.fte_women);
           yVals.push(y.value.fte_diff);
         }
      });
    });
    this.y.domain(d3.extent(yVals));
    //y.domain(countries);

    //var countries = d3.set(data.map(function(d){return d.country;})).values();
		var continents = d3.set(data.map(function(d){return d.continent;})).values();
    //r.domain(d3.extent(data, function(d) { return d.gender_wage_gap; }));
    //c = d3.scaleOrdinal().range(d3.schemeCategory20).domain(countries);
    this.c.domain(continents);

	  var svg = d3.select('#div_gap_scatter_transition').append('svg')
                .attr('width', this.w)
                .attr('height', this.h);
		fte_diff_and_gender_wage_gap_chart.svg = svg;

		var xAxis = d3.axisBottom(this.x)
    				.tickSize(0)
        		.tickPadding(6);

    svg.append('g')
    	  .attr('class', 'x axis')
    	  .call(xAxis)
    	  .attr('transform', 'translate('+ [0, this.innerH]+ ')')

    svg.append('g')
    	.attr('class', 'x title')
    		.append("text")
    		.attr('transform', 'translate('+ [this.innerW/2, this.h]+ ')')
    		.style("text-anchor", "middle")
				.style('font-size', '10px')
        .text("GENDER WAGE GAP (%)");

		var yAxis = d3.axisLeft(this.y)
    				.tickSize(0)
    				//.ticks(10)
      				.tickSizeOuter(0)
      				//.tickSizeInner(-innerW);

    svg.append('g')
    	  .attr('class', 'y axis')
    	  .call(yAxis)
    	  .attr('transform', 'translate('+ [this.margin.left, 0]+ ')')

    svg.append('g')
    	.attr('class', 'y title')
    		.append("text")
    		//.attr('transform', 'translate('+ [0, innerH/2]+ ')')
    		.attr('transform', 'translate('+ [0, this.margin.top]+ ')')
    		.style("text-anchor", "right")
				.style('font-size', '10px')
        .text("FULLTIME-EQUIVALENT EMPLOYMENT RATE GAP (%)");

    svg.append('g')
       .attr('class', 'content')
       .attr('transform', 'translate('+ [this.margin.left, this.margin.top] + ')')

     svg.select("g.content").selectAll("circle")
     .data(data)
     .enter().append("circle")
		 .attr("cx", fte_diff_and_gender_wage_gap_chart.dataX)
		 .attr("cy", fte_diff_and_gender_wage_gap_chart.dataY)
    //  .attr("cx", function(d) { return 40; })
     //.attr("cy", function(d) { return y(d.country); })
    //  .attr("cy", function(d) { return 0; })
     //.attr("r", function(d) { return y.bandwidth()/2; })
     .attr("r", function(d) { return 10; })
     //.style('fill', function(d){return continentColor(d.continent)})
     .style('fill', function(d){return fte_diff_and_gender_wage_gap_chart.c(d.continent)})
     .style("stroke-opacity", .2)
     .style("stroke-width", 3)

    //  svg.select("g.content").selectAll("text")
    //     .data(data)
    //     .enter().append("text")
    //     .attr("x", fte_diff_and_gender_wage_gap_chart.dataX)
    //     .attr("y", fte_diff_and_gender_wage_gap_chart.dataY)
    //   .style("text-anchor", "middle")
    //   .text(function(d) {return d.country;});

			var chipHeight = 12;
	 	 var chipPadding = 2;
	 	 var legendHeight = 16;
	 	 var legendPadding = 4;
	 	 var legend = svg.selectAll('.legend')
	 	  .data(fte_diff_and_gender_wage_gap_chart.c.domain())
	 	    .enter().append('g')
	 	    .attr('class', 'legend')
	 	    .attr('transform', function(d,i){
	 	      return 'translate(' + [fte_diff_and_gender_wage_gap_chart.innerW - (100) + legendHeight , legendHeight + i *(legendHeight + legendPadding)]+ ')'
	 	    })

	 	 legend.append('rect')
	 	  .attr('y', chipPadding)
	 	  .attr('width', chipHeight).attr('height', chipHeight)
	 	  .style('fill', function(d){return fte_diff_and_gender_wage_gap_chart.c(d)});

	 	 legend.append('text')
	 	  .attr('x', chipPadding+ chipHeight)
	 	  .attr('y', chipPadding)
	 	  .attr('dy', '.71em')
	 	  .style('font-size', '10px')
	 	  .text(function(d){return ''+d; })
}

fte_diff_and_gender_wage_gap_chart.dataX = function(d) {
	var o = d[fte_diff_and_gender_wage_gap_chart.selectedYear];
	if (o) {
			return fte_diff_and_gender_wage_gap_chart.x(o.gender_wage_gap) - fte_diff_and_gender_wage_gap_chart.margin.left;
	} else {
			return 0;
	}
 }

 fte_diff_and_gender_wage_gap_chart.dataY = function(d) {
	 var o = d[fte_diff_and_gender_wage_gap_chart.selectedYear];
	 if (o) {
			 //return y(o.fte_women);
			 return fte_diff_and_gender_wage_gap_chart.y(o.fte_diff) - fte_diff_and_gender_wage_gap_chart.margin.top;
	 } else {
			 return 0;
	 }
 }

fte_diff_and_gender_wage_gap_chart.startRotate = function() {
	if (fte_diff_and_gender_wage_gap_chart.status == 'interrupted') {
		fte_diff_and_gender_wage_gap_chart.status = 'stopped';
		return;
	}
  if (fte_diff_and_gender_wage_gap_chart.selectedYear >= 2013) {
		fte_diff_and_gender_wage_gap_chart.status = 'stopped';
		return;
	}

	fte_diff_and_gender_wage_gap_chart.status = 'running';

  setTimeout(function() {
    d3.select('#select_gap_scatter_transition').property('value', fte_diff_and_gender_wage_gap_chart.selectedYear+1);
    d3.select('#select_gap_scatter_transition').on("change")();
    fte_diff_and_gender_wage_gap_chart.startRotate();
  }, fte_diff_and_gender_wage_gap_chart.duration);
}

fte_diff_and_gender_wage_gap_chart.changeYear = function(year) {
  fte_diff_and_gender_wage_gap_chart.selectedYear = year;
  fte_diff_and_gender_wage_gap_chart.svg.select("g.content").call(fte_diff_and_gender_wage_gap_chart.rotate);
}

fte_diff_and_gender_wage_gap_chart.rotate = function(selection) {
  var t = selection.transition(fte_diff_and_gender_wage_gap_chart.transition)

  t.selectAll("circle")
  //.data(data)
  //.transition(t1)
  .attr("cx", fte_diff_and_gender_wage_gap_chart.dataX)
  .attr("cy", fte_diff_and_gender_wage_gap_chart.dataY);

  t.selectAll("text")
  // .data(data)
  // .transition(t1)
  .attr("x", fte_diff_and_gender_wage_gap_chart.dataX)
  .attr("y", fte_diff_and_gender_wage_gap_chart.dataY)
}

var data2;

function callback2(err, d) {
  if(err) return console.error(err);
	data2 = d;
	korea_fte_and_part_and_employ_chart.init();
}


var korea_fte_and_part_and_employ_chart = {};
korea_fte_and_part_and_employ_chart.w = 600;
korea_fte_and_part_and_employ_chart.h = 400;
korea_fte_and_part_and_employ_chart.margin = {top:20, right:20, bottom: 20, left: 80};
korea_fte_and_part_and_employ_chart.innerW = korea_fte_and_part_and_employ_chart.w -  korea_fte_and_part_and_employ_chart.margin.right -  korea_fte_and_part_and_employ_chart.margin.left;
korea_fte_and_part_and_employ_chart.innerH = korea_fte_and_part_and_employ_chart.h -  korea_fte_and_part_and_employ_chart.margin.top -  korea_fte_and_part_and_employ_chart.margin.bottom;
korea_fte_and_part_and_employ_chart.x = d3.scalePoint().range([ korea_fte_and_part_and_employ_chart.margin.left,  korea_fte_and_part_and_employ_chart.innerW]);
korea_fte_and_part_and_employ_chart.y = d3.scaleLinear().range([ korea_fte_and_part_and_employ_chart.innerH,  korea_fte_and_part_and_employ_chart.margin.top]);
korea_fte_and_part_and_employ_chart.c = d3.scaleOrdinal().range(d3.schemeCategory20);
korea_fte_and_part_and_employ_chart.init = function() {

  var svg = d3.select('#div_gap_line').append('svg')
              .attr('width', this.w)
              .attr('height', this.h);
	korea_fte_and_part_and_employ_chart.svg = svg;

	var nest = d3.nest()
	  .key(function(d){return d.p})
	  .sortValues(function(a,b) {return a.year - b.year;})
	  .entries(data2);

	korea_fte_and_part_and_employ_chart.x.domain(years);
	korea_fte_and_part_and_employ_chart.y.domain([0, 100]);
	korea_fte_and_part_and_employ_chart.c.domain(nest.map(function(d){return d.key})).range(d3.schemeCategory10);

	var xAxis = d3.axisBottom(korea_fte_and_part_and_employ_chart.x)
		.tickSize(0)
		.tickPadding(6);

	svg.append('g')
	  .attr('class', 'x axis')
	  .call(xAxis)
	  .attr('transform', 'translate('+ [0, korea_fte_and_part_and_employ_chart.innerH]+ ')')

		var yAxis = d3.axisLeft(korea_fte_and_part_and_employ_chart.y)
						.tickSize(0)
						//.ticks(10)
							.tickSizeOuter(0)
							//.tickSizeInner(-innerW);

		svg.append('g')
				.attr('class', 'y axis')
				.call(yAxis)
				.attr('transform', 'translate('+ [this.margin.left, 0]+ ')')


 var line = d3.line()
		  .x(function(d){return korea_fte_and_part_and_employ_chart.x(d.year);})
		  .y(function(d){return korea_fte_and_part_and_employ_chart.y(d.value);});

 var series = svg.selectAll('.series')
  .data(nest, function(d){return d.key})
  .enter().append('g')
  .style('stroke', function(d){return korea_fte_and_part_and_employ_chart.c(d.key)})
  .style('fill', function(d){return korea_fte_and_part_and_employ_chart.c(d.key)})
  .attr('class', 'series')

	series.append('path')
	  .datum(function(d){return d.values})
	  .style('fill', 'none')
	  .attr('d', line)

	svg.selectAll('path')
	      .data(nest.map(function(d){return d.values}))
	      .enter().append('path')
	      .style('stroke', function(d){return korea_fte_and_part_and_employ_chart.c(d[0].p)})
	      .style('fill', 'none')
	      .attr('d', line)

	var chipHeight = 12;
	var chipPadding = 2;
	var legendHeight = 16;
	var legendPadding = 4;
	var legend = svg.selectAll('.legend')
	   .data(korea_fte_and_part_and_employ_chart.c.domain())
	   .enter().append('g')
	   .attr('class', 'legend')
	   .attr('transform', function(d,i){
	     return 'translate(' + [korea_fte_and_part_and_employ_chart.innerW + legendHeight - 50,
				  legendHeight + i *(legendHeight + legendPadding)]+ ')'
	   })

	legend.append('rect')
	 .attr('y', chipPadding)
	 .attr('width', chipHeight).attr('height', chipHeight)
	 .style('fill', function(d){return korea_fte_and_part_and_employ_chart.c(d)});

	legend.append('text')
	 .attr('x', chipPadding+ chipHeight)
	 .attr('y', chipPadding)
	 .attr('dy', '.71em')
	 .style('font-size', '10px')
	 .text(function(d){return d})

 // ----------------------------

	// var countries = d3.set(data.map(function(d){return d.country;})).values();
	// this.y.domain([0, 100]);
	//
	// var xAxis = d3.axisBottom(this.x)
	// 				.tickSize(0)
	// 				.tickPadding(6);
	//
	// svg.append('g')
	// 		.attr('class', 'x axis')
	// 		.call(xAxis)
	// 		.attr('transform', 'translate('+ [0, this.innerH]+ ')')
	//
	// svg.append('g')
	// 	.attr('class', 'x title')
	// 		.append("text")
	// 		.attr('transform', 'translate('+ [this.innerW/2, this.h]+ ')')
	// 		.style("text-anchor", "middle")
	// 		.style('font-size', '10px')
	// 		.text("GENDER WAGE GAP (%)");
	//
	// var yAxis = d3.axisLeft(this.y)
	// 				.tickSize(0)
	// 				//.ticks(10)
	// 					.tickSizeOuter(0)
	// 					//.tickSizeInner(-innerW);
	//
	// svg.append('g')
	// 		.attr('class', 'y axis')
	// 		.call(yAxis)
	// 		.attr('transform', 'translate('+ [this.margin.left, 0]+ ')')
	//
  // svg.append('g')
  //    .attr('class', 'content')
	// 	 .attr('transform', 'translate('+ [this.margin.left, this.margin.top] + ')')
	//
	// 	 var line = d3.line()
	// 	   .x(function(d){return korea_fte_and_part_and_employ_chart.x(d.x);})
	// 	   .y(function(d){return y(d.y);});
	//
	// 	 var series = svg.selectAll('.series')
	// 	   .data(data, function(d){return d.key})
	// 	   .enter().append('g')
	// 	   .style('stroke', function(d){return korea_fte_and_part_and_employ_chart.c(d.key)})
	// 	   .style('fill', function(d){return korea_fte_and_part_and_employ_chart.c(d.key)})
	// 	   .attr('class', 'series')
	//
	//
	// 	 series.append('path')
	// 	   .datum(function(d){return d.values})
	// 	   .style('fill', 'none')
	// 	   .attr('d', line)
	//
	//
	// 	 svg.selectAll('path')
	// 	       .data(data.map(function(d){return d.values}))
	// 	       .enter().append('path')
	// 	       .style('stroke', function(d){return korea_fte_and_part_and_employ_chart.c(d[0].c)})
	// 	       .style('fill', 'none')
	// 	       .attr('d', line)


}
