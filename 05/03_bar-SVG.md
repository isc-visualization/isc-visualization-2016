SVG로 바챠트 그리기
===

SVG로 바 그리기
---

- SVG 세팅

```javascript
d3.select('body').append('svg');
```

```javascript
var w = 120;
var h = 500;
var svg = d3.select('body')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

```

- 데이터 연결 후 rect 삽입

```javascript
var dataset= [200, 300, 400, 500, 100];

svg.selectAll('rect')
   .data(dataset)
   .enter().append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 20)
    .attr('height', 500);
```

- 데이터 값에 따라 위치, 높이 설정

```javascript
.attr('x', function(d,i) {
  return i*(20+4);
})
```

```javascript
var padding = 4;
var barWidth = w/dataset.length - padding;

.attr('x', function(d,i) {
  return i*(barWidth + padding);
})
.attr('width', barWidth)
.attr('height', function(d){return d;})
```

```javascript
.attr('y', function(d) {
  return h - d;
})
```

- 스타일링

```javascript
.attr('fill', function(d) {
    return 'rgb(0, 0, ' + (d / 2) + ')';
});

```

레이블 추가 Label
---
- 텍스트 http://devdocs.io/svg/element/text

- 데이터 연결하고 텍스트 추가
```javascript
svg.selectAll('text')
   .data(dataset)
   .enter().append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('text', function(d){return d;})
```


- 위치 바꾸기
```javascript
.attr('x', function(d,i) {
  return i*(barWidth + padding);
})
.attr('y', function(d) {
  return h - d;
})
```

```javascript
.attr('text-anchor', 'middle')
.attr('dx', function(d,i) {
  return barWidth/2;
})
.attr('dy', '1em') //em	Relative to the font-size of the element
```


- 스타일링
```javascript
.style("font-family", "sans-serif")
.style("font-size", "11px")
.style("fill", "white");
```
