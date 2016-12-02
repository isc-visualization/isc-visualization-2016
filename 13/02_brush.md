브러쉬 brush
===

(참고)
http://devdocs.io/d3~4/d3-brush

목표
---
- d3-brush 모듈을 활용하여 산점도 행렬에 브러쉬 적용


브러쉬 brush
---
- 포인팅 제스쳐(클릭, 드래깅, 터치)를 활용하여 일-이차원 영역을 선택하는 인터액션
- 특정 아이템을 선택하거나, 줌인, 크로스필터링 등에 유용
- d3-brush는 SVG 상의 마우스, 터치 이벤트를 활용하여 구현됨
- 브러쉬 이벤트 발생시에 이벤트 리스너에서 아래의 `d3.event`의 속성을 확인 가능
 - target - the associated brush behavior.
 - type - the string “start”, “brush” or “end”; see brush.on.
 - selection - the current brush selection.
 - sourceEvent - the underlying input event, such as mousemove or touchmove.

- 일반적인 사용 패턴은 `brush.on`을 통해 `start, brush, end` 이벤트 발생시 이벤트 리스너를 등록하고, `d3.event.selection`을 통해 현재 선택 영역을 확인



산점도 행렬 브러쉬 적용
---

### 브러쉬 정의
- d3.brush 정의

```javascript
var brush = d3.brush();
```

### 브러쉬 설정
 - 산점도 영역 크기 만큼 적용

```javascript
brush = brush.extent([[0, 0], [region.bandwidth(), region.bandwidth()]]);
```

- 브러쉬 이벤트 리스너 등록

```javascript
brush = brush.extent([[0, 0], [region.bandwidth(), region.bandwidth()]])
  .on('start', brushStarted)
  .on('brush', brushed)
  .on('end', brushEnded);
```

- 브러싱 동작이 개시되면 현재 선택된 요소가 지난 요소와 같은지 확인 후, 다른 경우 초기화

```javascript
var brushCell;
function brushStarted(d) {
  if(brushCell !== this) {
    d3.select(brushCell).call(brush.move, null);
    brushCell = this;
  }
}
```

- 브러싱 동작 도중 `d3.event.selection`을 확인하고 영역 내의 요소 외에는 `.hidden` 클래스를 적용
  - `d3.event.selection` 값은 해당 영역의 `[[x0, y0], [x1,y1]]`을 가리킴

```javascript
function brushed(d) {
  var xName = d.x.name, yName = d.y.name;
  var scale = scales.get(this);
  var domain = d3.event.selection.map(function(d) {
    return [scale.x.invert(d[0]), scale.y.invert(d[1])];
  });
  svg.selectAll('.point').classed('hidden', function(d,i) {
    return d[xName] < domain[0][0] || d[xName] > domain[1][0] || d[yName] > domain[0][1] || d[yName] < domain[1][1];
  })
}

```

- 브러싱이 끝났을 때 혹시 선택 영역이 없으면 모든 `.hidden` 클래스를 제거

```javascript
function brushEnded(d) {
  if(d3.event.selection === null) {
    svg.selectAll('.point').classed('hidden', false);
  }
}
```

- point의 css 속성 설정

```css
.point {
  fill-opacity : .7;
}
.point.hidden {
  fill : #ddd !important;
}
```


### 브러쉬 SVG 삽입
 - 개별 산점도 영역에 각각 `g`를 추가한 후, `brush` 설정을 `call`하여 개별 삽입

```javascript
cell.append('g')
  .attr('class', 'brush')
  .call(brush);
```
