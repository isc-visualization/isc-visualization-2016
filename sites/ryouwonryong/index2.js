d3.csv('https://raw.githubusercontent.com/luwalong/practiceGit/master/justice_case_score.CSV', function(case_data) {
d3.csv('https://raw.githubusercontent.com/luwalong/practiceGit/master/mqs.CSV', function(mqs_data) {
	var mouseIsHere = false;
	var cons=0, libr=0, mindiff = 99, maxdiff = -99;

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
	diff_data = mqs_data.map(function(d,i){
		if(i > 0){
			var p = mqs_data[i - 1],
				rtn = {};
			rtn.key = d.key;
			rtn.values = new Array(9);
			for(k = 0; k < 9; k ++){
				rtn.values[k] = {
					year: rtn.key,
					mqs_diff: parseFloat((d.values[k].mqs - p.values[k].mqs).toFixed(3)),
					rank: k + 1
				};
				(rtn.values[k].mqs_diff > 0) ? cons ++ : libr ++;
				mindiff = (rtn.values[k].mqs_diff < mindiff) ? rtn.values[k].mqs_diff : mindiff;
				maxdiff = (rtn.values[k].mqs_diff > maxdiff) ? rtn.values[k].mqs_diff : maxdiff;
			}
			return rtn;
		}
		else
			return null;
	});
	diff_data.shift();
	console.log(cons + ':' + libr);
	console.log(mindiff + ':' + maxdiff);

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

	var svg = d3.select('#final_project2').append('svg')
		.attr('width', w)
		.attr('height', h)
		.append('g')
		.attr('transform', 'translate('+ [margin.left, margin.top] + ')');

	var xGap = x(1) - x(0);
	var yGap = y(2001) - y(2000);

	svg.append('text')
		.attr('x', centerW - margin.left - 3)
		.attr('y', margin.top)
		.style('font-size', legendHeight + 'px')
		.text('median');

	svg.append('path')
		.style('stroke', 'black')
		.style('stroke-width', '1px')
		.attr('d', 'M' + [centerW - margin.left + xGap / 2, margin.top * 2] + ' L' + [centerW - margin.left + xGap / 2, margin.top * 3])

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
		.data(mqs_data, function(d){return d.key;})
		.enter()
		.append('g')
		.attr('class', 'plot')
		.attr('transform', function(d){return 'translate(' + [centerW - margin.left, y(d.key)] + ')';});

	var legend = svg.selectAll('.legend')
		.data(case_data.map(function(d){return d.key;}))
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('fill-opacity', 0.1)
		.attr('stroke-opacity', 0.1)
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

	var years = plot.selectAll('.year')
		.data(function(d){return [d.values[0]];})
		.enter()
		.append('text')
		.attr('class', 'year')
		.text(function(d){return d.year;})
		.style('font-size', legendHeight + 'px')
		.attr('fill-opacity', 0.1)
		.attr('transform', function(d){
			return 'translate(' + [- centerW * 1/3 - xGap, yGap / 2] + ')';
		});

	var boxes = plot.selectAll('.box')
		.data(function(d){return d.values;})
		.enter()
		.append('rect')
		.attr('class', 'box')
		.attr('fill', function(d){return color(d.mqs);})
		.attr('fill-opacity', 0.1)
		.attr('width', xGap - 0).attr('height', yGap - 0)
		.style('stroke', function(d){return findColor(d.jus_code);})
		.attr('stroke-width', '0px')
		.attr('stroke-dashoffset', yGap)
		.attr('stroke-dasharray', yGap + ',' + (xGap - 2))
		.attr('transform', function(d,i){return 'translate(' + [x(i-4)/*x(d.mqs)*/, 0] + ')';});

	for(i = 0; i < jus_data.length; i ++){
		var l = jus_data[i].values.length - 1;
		if(jus_data[i].values[0].year > yDomain[0]){
			var cx = x(findRank(jus_data[i].key, jus_data[i].values[0].year)) + centerW - margin.left,
				cy = y(jus_data[i].values[0].year),
				name = findName(jus_data[i].key);

			svg.append('polygon')
				.attr('points', (cx + xGap) + ',' + cy + ' ' + (cx + xGap - yGap) + ',' + cy + ' ' + (cx + xGap) + ',' + (cy + yGap))
				.attr('fill', 'white')
				.attr('stroke-width', '0px')
				.append('title')
				.text(name + ' started');
		}

		if(jus_data[i].values[l].year < yDomain[1]){
			var cx = x(findRank(jus_data[i].key, jus_data[i].values[l].year)) + centerW - margin.left,
				cy = y(jus_data[i].values[l].year),
				name = findName(jus_data[i].key);

			svg.append('polygon')
				.attr('points', cx + ',' + cy + ' ' + cx + ',' + (cy + yGap) + ' ' + (cx + yGap) + ',' + (cy + yGap))
				.attr('fill', 'white')
				.attr('stroke-width', '0px')
				.append('title')
				.text(name + ' ended');
		}
	}

	var marker = svg.selectAll('.markerLevel')
		.data(diff_data, function(d){return d.key;})
		.enter()
		.append('g')
		.attr('class', 'markerLevel')
		.attr('transform', function(d){return 'translate(' + [centerW - margin.left, y(d.key)] + ')';});

	marker.selectAll('.markerLevel')
		.data(function(d){return d.values;})
		.enter()
		.append('polygon')
		.attr('class', 'marker')
		.attr('points', function(d, i){
			var cx = x(i-4) + xGap / 2,
				cy = 0;
			if(d.mqs_diff > 0)
				return [cx + xGap / 2, 0] + ' ' + [cx - xGap / 2, -yGap / 2] + ' ' + [cx - xGap / 2, yGap / 2];
			else
				return [cx - xGap / 2, 0] + ' ' + [cx + xGap / 2, -yGap / 2] + ' ' + [cx + xGap / 2, yGap / 2];
		})
		.attr('fill', function(d){return color(d.mqs_diff * 7);})
		.style('stroke', 'none')
		//.attr('stroke-width', '0.2px')
		.append('title')
		.text(function(d){return (d.year - 1) + '~' + d.year + '\nrank #' + d.rank + ' MQs diff: ' + d.mqs_diff;});

	svg.selectAll('.markerLevel')
		.append('text')
		.attr('class', 'liberalCount')
		.text(function(d){
			var count = 0;
			for(k = 0; k < 9; k ++){
				if(d.values[k].mqs_diff < 0)
					count ++;
			}
			return count;
		})
		.style('font-size', yGap * 2/3 + 'px')
		.attr('fill', color(-5))
		.attr('x', x(-5) + xGap / 2)
		.attr('y', yGap / 3);

	svg.selectAll('.markerLevel')
		.append('text')
		.attr('class', 'conservativeCount')
		.text(function(d){
			var count = 0;
			for(k = 0; k < 9; k ++){
				if(d.values[k].mqs_diff > 0)
					count ++;
			}
			return count;
		})
		.style('font-size', yGap * 2/3 + 'px')
		.attr('fill', color(5))
		.attr('x', x(5) + xGap / 2)
		.attr('y', yGap / 3);

	svg.append('text')
		.attr('class', 'liberalCount')
		.text(libr)
		.style('font-size', xGap)
		.attr('fill', color(-5))
		.attr('x', centerW - margin.left + x(-5))
		.attr('y', y('2018'));

	svg.append('text')
		.attr('class', 'liberalCount')
		.text('liberal shift in rank')
		.style('font-size', yGap)
		.attr('fill', color(-5))
		.attr('x', centerW - margin.left + x(-7))
		.attr('y', y('2019'));

	svg.append('text')
		.attr('class', 'conservativeCount')
		.text(cons)
		.style('font-size', xGap)
		.attr('fill', color(5))
		.attr('x', centerW - margin.left + x(5) - xGap / 2)
		.attr('y', y('2018'));

	svg.append('text')
		.attr('class', 'conservativeCount')
		.text('conservative shift in rank')
		.style('font-size', yGap)
		.attr('fill', color(5))
		.attr('x', centerW - margin.left + x(1))
		.attr('y', y('2019'));

	d3.selectAll('.marker')
		.on('mouseover', function(d){
			d3.selectAll('.marker')
				.attr('fill-opacity', function(d2){
					if(d2.mqs_diff * d.mqs_diff > 0)
						return 1.0;
					else
						return 0.1;
				})
				/*.attr('stroke-opacity', function(d2){
					if(d2.mqs_diff * d.mqs_diff > 0)
						return 1.0;
					else
						return 0.1;
				})*/;
			if(d.mqs_diff < 0)
				d3.selectAll('.conservativeCount')
					.attr('fill-opacity', 0.1)
					//.attr('stroke-opacity', 0.1);
			else
				d3.selectAll('.liberalCount')
					.attr('fill-opacity', 0.1)
					//.attr('stroke-opacity', 0.1);
		})
		.on('mouseleave', function(d){
			d3.selectAll('.marker, .liberalCount, .conservativeCount')
				.attr('fill-opacity', 1.0)
				//.attr('stroke-opacity', 1.0);
		});

});
});