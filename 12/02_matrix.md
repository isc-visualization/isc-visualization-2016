매트릭스 Matrix
===

목표
---
- 네트워크 구조를 매트릭스 형태에 간단히 표현


네트워크 구조 데이터 불러오기
---

- nodes의 id와 links의 source,target이 서로 연결

```javascript
var w = 600;
var margin = {top:20, right:20, bottom: 20, left: 20};
var innerW = w - margin.right - margin.left;

var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', w)
  .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

d3.json('miserables.json', callback);
function callback(err, data) {
  if(err) return console.error(err);
  console.log(data);
}
```


스케일
---
- 색상은 group, 위치는 id를 통해 결정

```javascript
var c = d3.scaleOrdinal()
  .domain(data.nodes.map(function(d){return d.group;}))
  .range(d3.schemeCategory20);
var x = d3.scaleBand()
  .domain(data.nodes.map(function(d){return d.id;}))
  .range([0, innerW]);
```

노드
---

```javascript
var xNode = svg.selectAll('.x.node')
    .data(data.nodes)
  .enter().append('rect')
    .attr('class', 'x node')
    .attr('x', function(d){return x(d.id);})
    .attr('y', function(d){return -x.bandwidth()*2;})
    .attr('width', x.bandwidth())
    .attr('height', x.bandwidth())
    .style('fill', function(d){return c(d.group);})
var yNode = svg.selectAll('.y.node')
    .data(data.nodes)
  .enter().append('rect')
    .attr('class', 'y node')
    .attr('x', -x.bandwidth()*2)
    .attr('y', function(d){return x(d.id);})
    .attr('width', x.bandwidth())
    .attr('height', x.bandwidth())
    .style('fill', function(d){return c(d.group);})
```

링크
---

```javascript
var xLink = svg.selectAll('.x.link')
    .data(data.links)
  .enter().append('rect')
    .attr('class', 'x link')
    .attr('x', function(d){return x(d.source);})
    .attr('y', function(d){return x(d.target);})
    .attr('width', x.bandwidth())
    .attr('height', x.bandwidth());

var yLink = svg.selectAll('.y.link')
    .data(data.links)
  .enter().append('rect')
    .attr('class', 'y link')
    .attr('x', function(d){return x(d.target);})
    .attr('y', function(d){return x(d.source);})
    .attr('width', x.bandwidth())
    .attr('height', x.bandwidth());
```
