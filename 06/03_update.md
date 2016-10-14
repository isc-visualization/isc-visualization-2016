업데이트 Update 1
===

이벤트 다루기
---
- selection.on http://devdocs.io/d3~4/d3-selection#selection_on
- 특정 이벤트 `typename이` 발생할 때(`click, mouseover, submit ...`), `listener` 함수를 실행시킴
- `listener` 함수는 `d,i,nodes` 를 인자로 받고 현재 `DOM element`를 `this`로 받음. 현재 발생한 이벤트는 `d3.event`로 접근 가능
(참고) [DOM event types](https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events)

```javascript
svg.on('click', function(d) {
  console.log('click');
  /*바 챠트를 업데이트를 시킬 예정*/
})
```

- 커서 모양을 변형해보고, 투명한 영역에서도 클릭 이벤트가 발생하도록 처리해보자
```css
svg {
  cursor:pointer;
  pointer-events: bounding-box; /*SVG2.0 이상에서 작동*/
}
```

랜덤 값 생성
---
- 현재 .bar들의 sales 값만 한꺼번에 변경 시켜보자
- d3.randomUniform 을 이용해 특정 범위 안에서만 값을 임의로 생성 http://devdocs.io/d3~4/d3-random#randomUniform

```javascript
function randDataset() {
   var rand = d3.randomUniform(yDomain[0], yDomain[1]);
   dataset.forEach(function(d) {
     d.sales = Math.round(rand());
   });
}
```


채널 업데이트
---

```javascript
svg.on('click', function(d) {
  randDataset();
  bar.data(dataset)
    .each(function(d) {
      xy.set(this, [x(d.product), y(d.sales)]);
    })
    .attr('transform', function(d){
      return 'translate('+ xy.get(this) + ')'
    });
  bar.select('rect')
    .attr('height', function(d){return innerH - xy.get(this)[1]})
    .style('fill', function(d){return 'rgb(0, 0, ' + color(d.sales) +')'});
})

```


트랜지션Transition
---
- d3-transition http://devdocs.io/d3~4/d3-transition#transition
-  Instead of applying changes instantaneously, transitions smoothly interpolate the DOM from its current state to the desired target state over a given duration.
- selection 다음에 selection.transition을 입력하면, transition이 반환되고 , 이후에  `attr, style`입력하면 현재 값에서 해당 값으로 자연스럽게 변환한다.
- 단, 요소를 append하거나 데이터를 bind하는 동작은 transition이 시작하기 전에 수행되어야함.

(예)
```javascript
d3.select("body")
  .transition()
    .style("background-color", "red");
```

- `y`와 `height`에 트랜지션을 적용해본다.
```javascript
bar.data(dataset)
  .each(function(d) {
    xy.set(this, [x(d.product), y(d.sales)]);
  })
  .transition()
    .attr('transform', function(d){
      return 'translate('+ xy.get(this) + ')'
    });
bar.select('rect')
  .transition()
    .attr('height', function(d){return innerH - xy.get(this)[1]});
    .style('fill', function(d){return 'rgb(0, 0, ' + color(d.sales) +')'});
```

- `transition`를 먼저 선언한 후 공유 할 수 있다.
- ease를 통해 `interpolation` 형태를 결정할 수 있다. `기본은 d3.easeCubic`
 - (참고) [d3-ease](http://devdocs.io/d3~4/d3-ease), [easing-explorer](http://bl.ocks.org/mbostock/248bac3b8e354a9103c4)
```javascript
var t = d3.transition()
  .delay(100)
  .duration(600) //default 400
  .ease(d3.easeLinear);

bar.data(dataset)
  .each(function(d) {
    xy.set(this, [x(d.product), y(d.sales)]);
  })
  .transition(t)
    .attr('transform', function(d){
      return 'translate('+ xy.get(this) + ')'
    });

bar.select('rect')
  .transition(t)
    .attr('height', function(d){return innerH - xy.get(this)[1]})
    .style('fill', function(d){return 'rgb(0, 0, ' + color(d.sales) +')'});
```
