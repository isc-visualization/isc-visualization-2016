D3의 스케일 사용하기
===

[참고]
- http://devdocs.io/d3~4/d3-scale
- https://medium.com/@mbostock/introducing-d3-scale-61980c51545f#.8wxf9tj17


Scales
----
 - mapping a dimension of abstract data to a visual representation
 - 데이터를 시각적 기호화 visual encoding 하는 작업을 위한 정의와 기능
   - key와 value를 특정한 channel로 변환
 - 예를 들어 카테고리를 컬러 코드로 변환하거나 수치를 위치를 나타내는 픽셀 값으로 변환하는 과정
 - 반드시
 - Domain 에서 Range로 매핑 한다.

Ordinal Scales
---

``` javascript
var w = 120;
var h = 200;
var dataset = [
  {product:'A', sales:200},
  {product:'B', sales:300},
  {product:'C', sales:400},
  {product:'D', sales:500},
  {product:'E', sales:100}
]
```

- scaleOrdinal : categorical한 domain 에서 categorical한 range로 순서대로 매핑한다.

``` javascript
var domain = dataset.map(function(d){return d.product;}); //['A','B' , ...] http://devdocs.io/javascript/global_objects/array/map
var range = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo'];

function map(a) {
  var index = domain.indexOf(a); //http://devdocs.io/javascript/global_objects/array/indexof
  if(index >= 0) return range[index];
  else return null;
}
console.log(map(dataset[0].product));

var ordinalScale = d3.scaleOrdinal()
  .domain(domain)
  .range(range);

console.log(ordinalScale(dataset[0].product)); //scale은 mapping 함수
```

- scaleBand : domain 에서 continuous-numeric한 값으로 이루어진 range로 매핑
![band](https://raw.githubusercontent.com/d3/d3-scale/master/img/band.png)

```javascript
var x = d3.scaleBand()
  .domain(domain)
  .range([0, w]);

console.log(x(dataset[1].product));
console.log(x.bandwidth());
```

```javascript
.attr('x', function(d,i) {
  return x(d.product);
})
.attr('width', x.bandwidth())
```

```javascript
x.padding(0.2) //padding
.rangeRound([0,w])
```

- scalePoint
![band](https://raw.githubusercontent.com/d3/d3-scale/master/img/point.png)
 - categorical type의 attribute를 scatterplot으로 표현하고 싶을 때 사용

```javascript
var x = d3.v()
  .domain(domain)
  .range([0, w]);

.attr('width', x.step());
```


Continuous Scales
---

- [선형보간 Linear Interpolation](https://ko.wikipedia.org/wiki/%EC%84%A0%ED%98%95_%EB%B3%B4%EA%B0%84%EB%B2%95)
- continuous한 domain에서 continuous한 range로 선형적으로 매핑

```javascript
function y(sales) {
  return  (sales - minSales)
      / (maxSales - minSales)
      * h;
}
```

```javascript
function y(sales) {
  return h -
      (sales - minSales)
      / (maxSales - minSales)
      * h;
}
```

- y축 값의 domain을 계산

```javascript
var yDomain = d3.extent(dataset, function(d){return d.sales});
// == [d3.min(dataset, function(d){return d.sales}), d3.max(dataset, function(d){return d.sales})];

console.log(yDomain);
```

```javascript
var y = d3.scaleLinear()
  .domain(yDomain)
  .range([0,h]);
```

- 밑에서부터 높이를 계산하도록 range의 순서를 바꿈

```javascript
var y = d3.scaleLinear()
  .domain(yDomain)
  .range([h, 0]);

  .attr('y', function(d) {
    return y(d.sales);
  })
  .attr('height', function(d){return h - y(d.sales);})

```

- domain의 최소값이 100이므로 최소 높이가 0이됨. 따라서 아래와 같이 변형

```javascript
var yDomain = [0, d3.max(dataset, function(d){return d.sales;})]

```


> 실습 : fill값을 scale을 써서 변환해보세요

[참고] [Interpolator](http://devdocs.io/d3~4/d3-interpolate)
[normalization](https://en.wikipedia.org/wiki/Normalization_(statistics))
