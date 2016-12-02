산점도 행렬 Scatterplot Matrix SPLOM
===

(참고)
Visual Analysis and Design, Ch.7 Arrange Tables
https://bl.ocks.org/mbostock/4063663


목표
---
- 다변량 구조 데이터의 표현 방법을 비교
- 산점도 행렬을 간단히 구현

다변량 구조 Multivariate structure
---
 - 값value을 나타내는 속성attribute가 다수 일때
 - 다차원multidimensional 구조는 키key 속성이 다수일때

### 직선Rectilinear Layout vs. 평행Parallel Layouts
- 직선 레이아웃 : 두 개의 직교하는 축을 기준으로 위치를 결정
  - 예) 산점도scatterplot
- 평행 레이아웃 : 축을 평행하게 나열
  - 예) 평행좌표parallel coordinates
- 산점도는 두개의 속성만을 비교 가능, 평행 좌표는 하나의 아이템이 선으로 표시polyline되어 여러 속성을 표시 가능
- 산점도 행렬은 상관 관계를 살필 때 유용. 평행좌표는 전체 속성의 오버뷰나 개별 속성의 범위 확인, 특정 범위내의 아이템 선택, 아웃라이어 찾기 등에 유리.

![screen shot 2016-12-02 at 8 19 26 pm](https://cloud.githubusercontent.com/assets/253408/20832268/bcabcf50-b8cc-11e6-940b-c0b4f9020f5e.png)


![screen shot 2016-12-02 at 8 24 01 pm](https://cloud.githubusercontent.com/assets/253408/20832362/4b3969bc-b8cd-11e6-981a-0cfc58bcc0b3.png)

- 평행 좌표에서 두축이 강한 양의 상관 관계이면 선들이 서로 평행. 음의 상관 관계에서는 선이 서로 교차

산점도 행렬 SPLOM
---

### 기본 설정

- 스케일은 값 속성 마다 다르므로 `d3.local`로 설정

```javascript
var w = 800;
var margin = {top:10, right:10, bottom: 10, left: 10};
var innerW = w - margin.right - margin.left;
var brush = d3.brush();
var scales = d3.local();

var xAxis = d3.axisBottom().ticks(6);
var yAxis = d3.axisLeft().ticks(6);

var region = d3.scaleBand().range([0, innerW]).padding(.2);
var c = d3.scaleOrdinal().range(d3.schemeCategory10);
var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', w)
  .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');
```

### 헤더 및 스케일 설정

- 헤더 정보에 해당 값의 범위domain을 계산하여 미리 저장
```javascript
d3.csv('flower.csv', callback);
function callback(err, data) {
  if(err) return console.error(err);
  var headers = data.columns.slice(0,4);
  headers = headers.map(function(h) {
    var domain = d3.extent(data, function(d){return d[h];});
    return {name:h, domain:domain};
  });

  region.domain(headers.map(function(d){return d.name;}));
  c.domain(d3.set(data, function(d){return d.species;}).values());
}
```


### 개별 산점도 영역 그룹 추가

- 헤더의 값이 교차가 되도록 하여 행렬 구조의 데이터로 변형

```javascript
function cross(headers) {
  var result = [];

  headers.forEach(function(a) {
    headers.forEach(function(b){
      result.push({x:a, y:b});
    });
  });

  return result;
}
```

- 개별 영역 마다 축에 해당하는 스케일을 지정
```javascript
var cell = svg.selectAll('.cell')
    .data(cross(headers))
  .enter().append('g')
    .attr('class', 'cell')
    .attr('transform', function(d){return 'translate(' + [region(d.x.name), innerW - region(d.y.name)- region.bandwidth()]+ ')'})
    .each(function(d) {
      var x = d3.scaleLinear().domain(d.x.domain).range([0, region.bandwidth()]);
      var y = d3.scaleLinear().domain(d.y.domain).range([region.bandwidth(), 0]);
      scales.set(this, {x:x, y:y});
    });
```

### 축 그리기

- 영역마다 축을 설정한다

``` javascript
cell.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(' + [0, region.bandwidth()]+ ')')
  .each(function() {
    d3.select(this).call(xAxis.scale(scales.get(this).x));
  });

cell.append('g')
  .attr('class', 'y axis')
  .each(function() {
    d3.select(this).call(yAxis.scale(scales.get(this).y));
  });
```

### 아이템 그리기

- 개별 아이템을 원 형태로 그려서 추가
```javascript
cell.each(function(d) {
  d3.select(this).selectAll('.point')
      .data(data)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('cx', function(p){return scales.get(this).x(p[d.x.name]);})
      .attr('cy', function(p){return scales.get(this).y(p[d.y.name]);})
      .attr('r', 2)
      .style('fill', function(p){return c(p.species);});
});
```
