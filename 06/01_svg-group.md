SVG Group 사용하기
===
https://css-tricks.com/transforms-on-svg-elements/


Group으로 먼저 묶기
---

- 다른 요소 이전에 g를 연결
- g : 독자적인 좌표계를 가짐 http://devdocs.io/svg/element/g

```javascript
var bar = svg.selectAll('.bar')
  .data(dataset)
  .enter().append('g')
    .attr('class', 'bar');
```


translate 적용
---
- Transform : SVG의 이동,회전,확대-축소 (참고) http://devdocs.io/svg/attribute/transform https://css-tricks.com/transforms-on-svg-elements/
- translate : 평행 이동, 좌표계가 이동했다고 간주 `translate[x,y]`

```javascript
bar.attr('transform', function(d){
  return 'translate('+ [x(d.product), y(d.sales)] + ')'
})
```



요소 각각 추가하기
---
- 하위 요소들은 상위 요소(g)에 상대적으로 위치
- 하위요소는 기본 `[0,0]` 위치하므로 별도 이동 필요 없음


```javascript
var rect = bar.append('rect')
    .attr('width', x.bandwidth())
    .attr('height', function(d){return h - y(d.sales)})
    .style('fill', function(d){return 'rgb(0, 0, ' + color(d.sales) +')'});

var text = bar.append('text')
    .attr('dx', x.bandwidth()*0.5)
    .attr('dy', function(d) {return '1em';})
    .attr('text-anchor', 'middle')
    .style('fill', 'white')
    .text(function(d){return d.product});

```


재사용 데이터는 미리 저장
---

```javascript
bar.each(function(d) {
  d.x = x(d.product);
  d.y = y(d.sales);
})
  .attr('transform', function(d){
    return 'translate('+ [d.x, d.y] + ')'
  })

rect.attr('height', function(d){return h - d.y});
```


(참고) d3.local http://devdocs.io/d3~4/d3-selection#local
 - local state를 데이터와 독립적으로 저장해야하는 경우에 사용

 ```javascript
 var xy = d3.local();
 bar.each(function(d) {
   xy.set(this, [x(d.product), y(d.sales)]);
 })
 .attr('transform', function(d){
   return 'translate('+ xy.get(this) + ')'
 })

 rect.attr('height', function(d){return h - xy.get(this)[1];}); //this node에서 찾지 못하면 ancestor 살펴봄.
 ```
