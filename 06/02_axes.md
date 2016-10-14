축 axes
===

- 축axis은 특정한 scale 자체를 시각적 형태로 변환한 결과
- [d3-axis](http://devdocs.io/d3~4/d3-axis) 모듈을 활용하여 자동화 한다

여백 미리 설정하기
---

- 여백 지정하고, 스케일 수정

```javascript
var margin = {top: 20, right: 20, bottom:20, left:20};
var innerW = w - margin.left - margin.right,
 innerH = h - margin.top - margin.bottom;


var xRange = [0, innerW];
var yRange = [innerH, 0];
```

- svg에 g부터 삽입하고 기타 요소 추가 하기

```javascript
var svg = d3.select('#vertical')
  .append('svg')
    .attr('width', w)
    .attr('height', h)
  .append('g')
    .attr('transform', 'translate(' +[margin.left, margin.top]+ ')');


rect.attr('height', function(d){return innerH - xy.get(this)[1]}); //h대신 innerH 사용
```


x축 설정하기
---
- d3.axisBottom을 활용
- x 좌표 설정에 사용된 axis를 전달

```javascript
var xAxis = d3.axisBottom(x);
```

- svg에 추가 하기
 - selection.call : 현재 selection을 인자로 받는 함수를 실행시킨다. http://devdocs.io/d3~4/d3-selection#selection_call

```javascript
svg.append('g') //g를 먼저 추가하고
  .attr('class', 'x axis')
  .call(xAxis); //xAxis를 실행
```

- 축 이동시키기

```javascript
  .attr('transform', 'translate('+ [0, innerH]+ ')')
```

- 스타일링

```javascript
xaxis.tickSize(0)
  .tickPadding(6);
```
```css
.axis path.domain {
  stroke : none;
}
```

Y축 추가하기
---

```javascript
var yAxis = d3.axisLeft(y)
  .tickSizeOuter(0)
  .tickSizeInner(-innerW);

svg.append('g')
  .attr('class', 'y axis')
  .call(yAxis);
```

- tick 숫자 조정

```javascript
yAxis.ticks(5);
```

- 혹은, nth-child 사용한 스타일링

```css
.y.axis .tick:nth-child(2n+1) line {
  opacity : .25;
}
.y.axis .tick:nth-child(2n+1) text {
  visibility: hidden;
}
```

??d3-format http://devdocs.io/d3~4/d3-format#format
