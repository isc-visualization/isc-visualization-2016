트리맵2 Treemap2
===

목표
---
- 재귀를 통해 treemap을 구현

위계 구조를 반영하여 그리기
---

- 재귀적으로 자식 노드를 그리는 함수를 정의

```javascript
function node(_selection, d) {
  var el = _selection.selectAll('.node')
    .data(d, function(d){return d.data.key;});
  el.enter().append('g')
    .attr('class', 'node')
    .each(function(d) {
      if(d.children) {
        d3.select(this)
          .call(node, d.children); //자식 노드가 있을 경우 재귀적으로 추가
      } else {
        // 재귀 함수가 종료
      }
    })
  return _selection;
}
```
- 부모노드와 자식노드 별로 추가 요소를 구분

```javascript
el.each(function(d) {
  if(d.children) {
    d3.select(this).call(parent)
      .call(node, d.children);
  } else {
    d3.select(this).call(leaf);
  }
})
```

```javascript
function parent(_selection) {
  _selection.classed('parent', true);
  _selection.append('rect')
    .attr('width', function(d){return d.x1-d.x0;})
    .attr('height', function(d){return paddingTop;})
    .attr('x', function(d){return d.x0;})
    .attr('y', function(d){return d.y0;})
    .style('fill', '#eee')
    .style('stroke', '#ddd')
    .style('cursor', 'pointer');
  _selection.append('text')
    .text(function(d){return d.data.name})
    .attr('dy', function(d){return '1em'})
    .attr('x', function(d){return d.x0;})
    .attr('y', function(d){return d.y0;})
    .style('font-size', '12px')
    .style('font-family', 'sans-serif')
    .style('pointer-events', 'none');
  return _selection;
}
```

```javascript
function leaf(_selection) {
  _selection.classed('leaf', true)
    .append('rect')
    .attr('x', function(d){return d.x0})
    .attr('y', function(d){return d.y0})
    .attr('width', function(d){return d.x1-d.x0})
    .attr('height', function(d){return d.y1-d.y0})
    .style('fill', function(d){return color(findParent(d, 1).data.name)})
    .style('fill-opacity', function(d){return opacity(d.value)});
  return _selection;
}
```


자식-리프노드를 선택하기
---
- `parent` 함수에 간단한 이벤트를 추가

```javascript
_selection.select('rect').on('mouseenter', function(d) {
  d3.event.stopPropagation();
  d3.select(d3.select(this).node().parentNode).selectAll('.leaf > rect')
    .style('fill', 'lemonchiffon');
}).on('mouseleave', function(d) {
  d3.event.stopPropagation();
  d3.select(d3.select(this).node().parentNode).selectAll('.leaf > rect')
    .style('fill', function(d){return color(findParent(d, 1).data.name)});
})
```
