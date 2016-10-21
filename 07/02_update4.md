업데이트 3
===


자연스러운 트랜지션 만들기
---
- enter 되는 요소는 우측에서 오고 처음에는 투명하도록 세팅한다.

```javascript
var barEnter = bar.enter().append('g')
  .attr('class', 'bar')
  .call(updateBar)
  .attr('transform', function(d) {
    return 'translate('+ [x.range()[1], xyc.get(this).y] + ')';
  })
  .style('opacity', 0);
```

```javascript
bar.transition(t)
  .style('opacity', 1)
  .call(translateBar);
```
- rect는 형태가 계속 고정되도록 변경

```javascript
barEnter.append('rect')
  .attr('width', x.bandwidth())
  .call(updateRect);
```


** (실습) 삭제되는 막대도 자연스럽게 왼쪽으로 사라지게 하기 ( 힌트 : `transition.remove`를 트랜지션 마지막에 쓰면 트랜지션이 종료된 후 알아서 삭제한다.) **

클리핑Clipping 적용하기
---
- [클리핑](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Clipping_and_masking)은 요소의 일부만이 보이도록 통제하고 싶을때 사용하는 기법 (http://devdocs.io/svg/element/clippath)

- SVG의 `clip-path`를 활용한다.

```javascript
svg.append('clipPath')
    .attr('id', 'bar-clip')
  .append('rect')
    .attr('width', innerW)
    .attr('height', innerH)

barEnter.attr('clip-path', 'url(#bar-clip)'); //작동 안함. transform 이 적용된 경우 clip-path도 transform이 동시에 적용

```

- axis 등을 다 그리고 `g`를 하나더 추가한 후 `clip-path`를 적용
```javascript
svg = svg.append('g')
  .attr('clip-path', 'url(#bar-clip)');
```
