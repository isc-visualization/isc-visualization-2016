라인 챠트 2 Line chart
---

목표
---
- [Multi-Series Line chart](https://bl.ocks.org/mbostock/3884955)를 그려보자.


데이터 중첩
---
- [샘플 파일](sample/sample.line.json)을 불러와서, `c`를 key로 하여 묶는다.

```javascript
var nest = d3.nest()
  .key(function(d){return d.c})
  .sortValues(function(a,b) {return a.x - b.x;}) //x의 오름차순으로 정리한다.
  .entries(data);
```

스케일 설정
---

- 색상 스케일도 추가한다.

```javascript
var x = d3.scalePoint().domain(d3.range(1, 21)).range([0, innerW]);
var y = d3.scaleLinear().domain([0, 100]).range([innerH, 0]);
var c = d3.scaleOrdinal().domain(nest.map(function(d){return d.key}))
  .range(d3.schemeCategory10);
```

라인 생성기 설정
---

```javascript
var line = d3.line()
  .x(function(d){return x(d.x);})
  .y(function(d){return y(d.y);});
```

DOM 추가
---

- 그룹을 미리 추가
  - `stroke`과 `fill`을 미리 설정해둔다

```javascript
var series = svg.selectAll('.series')
  .data(nest, function(d){return d.key})
  .enter().append('g')
  .style('stroke', function(d){return c(d.key)})
  .style('fill', function(d){return c(d.key)})
  .attr('class', 'series')
```

- path를 추가하고 `d.values`만 넘기고, 라인 생성기를 전달한다.
 - 이때 `selection.data`대신 `selection.datum`을 사용

```javascript
series.append('path')
  .datum(function(d){return d.values})
  .style('fill', 'none')
  .attr('d', line)
```

- 아래와 같이 구현할 수 있다.
```
svg.selectAll('path')
      .data(nest.map(function(d){return d.values}))
      .enter().append('path')
      .style('stroke', function(d){return c(d[0].c)})
      .style('fill', 'none')
      .attr('d', line)
```

(실습) 축을 추가해보자


클리핑Clipping 적용하기
---
- [클리핑](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Clipping_and_masking)은 요소의 일부만이 보이도록 통제하고 싶을때 사용하는 기법 (http://devdocs.io/svg/element/clippath)


- `x` 스케일의 range를 조정한다.
```javascript
var x = d3.scaleLinear().domain([0, 20]).range([0, innerW*2]);
```

- SVG의 `clip-path`를 삽입한다.

```javascript
svg.append('clipPath')
    .attr('id', 'bar-clip')
  .append('rect')
    .attr('width', innerW)
    .attr('height', innerH)
```

```javascript
series.attr('clip-path', 'url(#bar-clip)');
```
