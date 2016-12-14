d3.csv('https://raw.githubusercontent.com/luwalong/practiceGit/master/justice_case_score.CSV', function(case_data) {
d3.csv('https://raw.githubusercontent.com/luwalong/practiceGit/master/mqs.CSV', function(mqs_data) {
	var mouseIsHere = false;

	case_data = d3.nest()
		.key(function(d){return d.idx;})
		.entries(case_data);
	jus_data = d3.nest()
		.key(function(d){return d.jus_code;})
		.sortValues(function(a,b) {return a.year - b.year;})
		.entries(mqs_data);
	mqs_data = d3.nest()
		.key(function(d){return d.year;})
		.sortValues(function(a,b) {return a.mqs - b.mqs;})
		.entries(mqs_data);

	jus_data = jus_data.map(function(d){
		d.values = d.values.map(function(d2, i){
			var rtn = d2;
			rtn.rel_mqs = (d2.mqs - d.values[0].mqs).toFixed(3);
			rtn.idx = i;
			rtn.left = d.values.length - i;
			return rtn;
		});
		return d;
	});
	console.log(jus_data);

	case_data = case_data.filter(function(e){
		for(i = 0; i < mqs_data.length; i ++)
			for(j = 0; j < mqs_data[i].values.length; j ++)
				if(mqs_data[i].values[j].jus_code === e.key)
					return true;
		return false;
	});

	function findName(i){
		for(k = 0; k < case_data.length; k ++)
			if(case_data[k].key === i)
				return case_data[k].values[0].jus_name;
	}

	function findRank(c, year){
		year = year - 1976;
		for(k = 0; k < mqs_data[year].values.length; k ++)
			if(mqs_data[year].values[k].jus_code === c)
				return k - 4;
		return 10;
	}

	function findColor(c){
		c = parseInt(c);
		var idx = c % 12,
			drk = Math.floor(c / 12) % 2;
		var colorScheme = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'];
		return d3.color(colorScheme[idx])
			.darker(drk);
	}

	var color = d3.scaleLinear()
		.domain([-5, 0, 5])
		.range(['#67a9cf', '#f7f7f7', '#ef8a62']);
	var x = d3.scaleLinear()
		.domain(xDomain)
		.range(xRange);
	var y = d3.scaleLinear()
		.domain(yDomain)
		.range(yRange);

	var svg = d3.select('#final_project4').append('svg')
		.attr('width', w)
		.attr('height', h)
		.append('g')
		.attr('transform', 'translate('+ [margin.left, margin.top] + ')');

	var yGap = y(2001) - y(2000);
	var xGap = yGap;

	svg.append('text')
		.attr('x', centerW - margin.left - 2)
		.attr('y', margin.top)
		.style('font-size', legendHeight + 'px')
		.text('Zero');

	for(k = -4; k <= 4; k ++){
		var gap = x(1) - x(0)
		svg.append('path')
			.style('stroke', 'black')
			.style('stroke-opacity', 1 / (Math.abs(k) + 1))
			.attr('d', 'M' + [centerW - margin.left + gap * k + xGap / 2, margin.top * 2] + ' L' + [centerW - margin.left + gap * k + xGap / 2, innerH])
	}

	svg.append('text')
		.attr('x', centerW * 2/3 + 20)
		.attr('y', margin.top + legendHeight)
		.style('font-size', legendHeight + 'px')
		.text('liberal');

	svg.append('text')
		.attr('x', centerW * 4/3 - 100)
		.attr('y', margin.top + legendHeight)
		.style('font-size', legendHeight + 'px')
		.text('conservative');

	var plot = svg.selectAll('.plot')
		.data(jus_data, function(d){return d.key;})
		.enter()
		.append('g')
		.attr('class', 'plot');
		//.attr('transform', function(d){return 'translate(' + [centerW - margin.left, y(d.key)] + ')';});

	var legend = svg.selectAll('.legend')
		.data(case_data.map(function(d){return d.key;}))
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', function(d,i){
			return 'translate(' + [innerW - legendWidth - margin.right, i *(legendHeight + legendPadding)]+ ')'
		});

	legend.append('rect')
		.attr('y', chipPadding).attr('x', legendWidth + margin.right - chipPadding)
		.attr('width', chipHeight).attr('height', chipHeight)
		.style('stroke', 'black')
		.style('fill', 'white');

	legend.append('text')
		.attr('x', function(d){return legendWidth - findName(d).length * 6 + chipPadding+ chipHeight;})
		.attr('y', chipPadding)
		.attr('dy', '.71em')
		.style('font-size', legendHeight + 'px')
		.text(function(d){return findName(d);});

	var years = svg.selectAll('.year')
		.data(Array.apply(null, {length: 35}).map(Number.call, Number))
		.enter()
		.append('text')
		.attr('class', 'year')
		.text(function(d){return d;})
		.style('font-size', legendHeight + 'px')
		.attr('transform', function(d){
			return 'translate(' + [centerW * 2/3 - margin.left - x(0)-x(1), y(d + 1976) + yGap / 2] + ')';
		});

	var boxes = plot.selectAll('.box')
		.data(function(d){return d.values;})
		.enter()
		.append('rect')
		.attr('class', 'box')
		.attr('fill', function(d){return color(d.mqs);})
		.attr('width', xGap - 0).attr('height', yGap - 0)
		.style('stroke', function(d){return findColor(d.jus_code);})
		.attr('stroke-width', '0px')
		.attr('stroke-dashoffset', yGap)
		.attr('stroke-dasharray', yGap + ',' + (xGap - 2))
		.attr('transform', function(d,i){return 'translate(' + [centerW - margin.left + x(d.rel_mqs), y(i + 1976)] + ')';});

	svg.append('text')
		.attr('class', 'liberalCount')
		.text(15)
		.style('font-size', x(1)-x(0))
		.attr('fill', color(-5))
		.attr('x', centerW - margin.left + x(-5))
		.attr('y', y('2018'));

	svg.append('text')
		.attr('class', 'liberalCount')
		.text('liberal shift for term')
		.style('font-size', yGap)
		.attr('fill', color(-5))
		.attr('x', centerW - margin.left + x(-7))
		.attr('y', y('2019'));

	svg.append('text')
		.attr('class', 'conservativeCount')
		.text(6)
		.style('font-size', x(1)-x(0))
		.attr('fill', color(5))
		.attr('x', centerW - margin.left + x(5) - xGap)
		.attr('y', y('2018'));

	svg.append('text')
		.attr('class', 'conservativeCount')
		.text('conservative shift for term')
		.style('font-size', yGap)
		.attr('fill', color(5))
		.attr('x', centerW - margin.left + x(1))
		.attr('y', y('2019'));


	function plotUpdate(on){
		var t = d3.transition()
			.duration(on ? 100 : 500);

		boxes.transition(t)
			.attr('fill-opacity', function(d){
				if(d.left === 1)
					return 1;
				else if(selected[d.jus_code] || (!legend_click && !on ) || (on && d.jus_code === on.jus_code))
					return 0.5;
				else
					return 0;
			})
			.attr('width', function(d){
				if(d.left === 1 || selected[d.jus_code])
					return xGap - 2;
				else
					return xGap;
			})
			.attr('x', function(d){
				if(d.left === 1 || selected[d.jus_code])
					return 1;
				else
					return 0;
			})
			.attr('stroke-width', function(d){
				if(selected[d.jus_code])
					return '1.5px';
				else if(d.left === 1)
					return '0.3px';
				else
					return '0px';
			});

		if(mouseIsHere){
			if(svg.selectAll('.mqs').enter()._groups[0].length === 0){
				plot.selectAll('.mqs')
					.data(function(d){return d.values;})
					.enter()
					.append('text')
					.attr('class', 'mqs')
					.text(function(d){
						if(d.jus_code === on.jus_code)
							return d.mqs + ' (' + (d.rel_mqs > 0 ? '+' : '') + d.rel_mqs + ')';
						else
							return '';
					})
					.attr('x', function(d){
						return centerW - margin.left + x(d.rel_mqs) + xGap * 3/2;
					})
					.attr('y', function(d){
						return y(d.idx + 1976) + yGap * 3/4;
					})
					.style('font-size', legendHeight + 'px')
					.attr('fill', 'black')
					.style('fill-opacity', 1.0);
			}
		}
		else{
			svg.selectAll('.mqs').remove();
		}

		legend.selectAll('text')
			.transition(t)
			.attr('fill', function(d){
				if(selected[d] || (on && d === on.jus_code))
					return findColor(d);
				else
					return 'black';
			})
			.attr('stroke', function(d){
				if(on && d === on.jus_code)
					return findColor(d);
				else
					return null;
			});

		legend.selectAll('rect')
			.style('fill', function(d){
				return selected[d] ? findColor(d) : 'white';
			});

		years.transition(t)
			.attr('stroke', function(d){
				if(on && d === on.idx)
					return "#000000";
				else
					return null;
			});
	}

	boxes.on('mouseover', function(d){
		mouseIsHere = true;
		plotUpdate(d);
	}).on('mouseleave', function(d){
		mouseIsHere = false;
		plotUpdate(null);
	}).on('click', function(d){
		d = d.jus_code;
		if(!selected[d]){
			selected[d] = 1;
			legend_click ++;
		}
		else{
			selected[d] = 0;
			legend_click --;
		}
		plotUpdate({jus_code:d});
	});

	legend.selectAll('text, rect')
		.on('mouseover', function(d){
			mouseIsHere = true;
			plotUpdate({jus_code:d});
		}).on('mouseleave', function(d){
			mouseIsHere = false;
			plotUpdate(null);
		}).on('click', function(d){
			if(!selected[d]){
				selected[d] = 1;
				legend_click ++;
			}
			else{
				selected[d] = 0;
				legend_click --;
			}
			plotUpdate(null);
		});

	window.setInterval(function(){
		if(!mouseIsHere) plotUpdate(null);
	}, 300);
});
});