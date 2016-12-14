var w = 900, h = 700;
var margin = {top:10, right:20, bottom: 10, left: 20};
var innerW = w - margin.right - margin.left,
	innerH = h - margin.top - margin.bottom - 50,
	centerW = w / 2;
var on_mouse = null;
var legend_click = 0;
var box_click = null;

var chipHeight = 10,
	chipPadding = 2,
	legendWidth = 140,
	legendHeight = 10,
	legendPadding = 5;

var xDomain = [-5, 5],
	yDomain = [1976, 2015],
	xRange = [-centerW / 3, centerW / 3];
	yRange = [0 + margin.top * 3, innerH - margin.bottom];

var selected = Array.apply(null, Array(150))
	.map(function(x, i){return 0;});

