평행좌표 Parallel Coordinates
===

(참고)
https://bl.ocks.org/jasondavies/1341281

목표
---
- 평행좌표를 간단히 구현
- 브러쉬 기능을 적용


기본 설정
---

- x축은 상단에 위치
- y축을 위한 스케일은 개별 축에 따라 접근할 수 있도록 오브젝트로 설정
- 선 생성자를 미리 세팅
- brush는 y축 방향으로만 조절 가능하므로 `d3.brushY` 사용

```javascript
var w = 800, h = 600;
var margin = {top:20, right:20, bottom: 20, left: 20};
var innerW = w - margin.right - margin.left,
  innerH = h - margin.top - margin.bottom;
var brush = d3.brushY();
var xAxis = d3.axisBottom().tickSize(0).tickPadding(-12);
var yAxis = d3.axisLeft();
var x = d3.scalePoint().range([0, innerW]).padding(0.04);
var y = {};
var c = d3.scaleOrdinal().range(d3.schemeCategory10);
var line  = d3.line().x(function(d){return d.x}).y(function(d){return d.y;});
var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', h)
  .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');
```

- x축은 레이블만 남도록 세팅

```css
.x.axis .domain{
  stroke : none;
}
```

스케일 설정
---
- 헤더 요소 뽑기

```javascript
var headers = data.columns.slice(0,4);
headers = headers.map(function(h) {
  var domain = d3.extent(data, function(d){return d[h];});
  return {name:h, domain:domain};
});

```

- 축마다 서로 다른 스케일을 갖도록 설정

```javascript
headers.map(function(h) {
  y[h.name] = d3.scaleLinear().domain(h.domain).range([innerH, 0]);
});

x.domain(headers.map(function(d){return d.name;}));
c.domain(d3.set(data, function(d){return d.species;}).values());
```

선 그리기
---

- 개별 아이템을 선 생성자에 전달할 수 있도록 구조를 바꿈

```javascript
function series(d) {
  return x.domain().map(function(h) {
    return {x:x(h), y:y[h](d[h])};
  });
}
```

- 데이터를 추가하고 `path`추가 할때 위에서 만든 `series` 함수를 이용해 데이터 형태를 변환

```javascript
svg.selectAll('.series')
  .data(data)
    .enter().append('g')
  .attr('class', 'series')
  .style('stroke', function(d){return c(d.species)})
    .selectAll('path')
  .data(function(d){return [series(d)]})
    .enter().append('path')
    .attr('d', line);
```

```css
.series path {
  fill : none;
}
```

축 그리기
---

- Y축은 `headers`를 전달하여 개별적으로 추가

```javascript
svg.selectAll('.y.axis')
    .data(headers, function(d){return d.name;})
  .enter().append('g')
    .attr('class', 'y axis')
    .attr('transform', function(d) {return 'translate(' + [x(d.name), 0] + ')';})
    .each(function(d) {
      yAxis.scale(y[d.name]);
      d3.select(this).call(yAxis)
    })
```

- X축은 그대로 추가

```javascript
xAxis.scale(x);
svg.append('g')
  .attr('class', 'x axis')
  .call(xAxis);
```


브러쉬 추가
---
- 개별 축 영역에 브러쉬를 설정

- 브러쉬 영역을 설정하고 이벤트 리스너 등록
```javascript
brush = brush.extent([[-12, 0], [12, innerH]])
  .on('brush', brushed)
  .on('end', brushEnded);
```

- 브러쉬가 진행되면 축마다 선택된 영역을 저장하고, 선택되지 않은 아이템을 `.hidden`설정
  - `d3.brushY` 사용시에 `d3.event.selection`은 `[y0, y1]`
- 브러쉬가 끝날 때 아무 영역이 선택되지 않았다면 해당 축의 범위는 제거

```javascript
var conditions = {};
function brushed(d) {
  conditions[d.name] = d3.event.selection.map(y[d.name].invert);
  hide();
}
function brushEnded(d) {
  if(d3.event.selection === null) {
    delete conditions[d.name];
    hide();
  }
}
function hide() {
  svg.selectAll('.series').classed('hidden', function(d) {
    var result = false;
    for(var k in conditions) {
      var domain = conditions[k];
      result = result || (d[k] < domain[1]  || d[k] > domain[0])
    }
    return result;
  });
}
```

```css
.series.hidden path {
  stroke : #ddd !important;
}
```
