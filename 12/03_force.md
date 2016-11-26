힘-방향 배치 Force-Directed Placement
===


목표
---
- 네트워크 구조를 힘-방향 배치로 표현
- d3-force, d3-drag 사용에 대한 간단한 이해


d3-force
---
http://devdocs.io/d3~4/d3-force

- 입자의 물리적 운동을 시뮬레이션하는 기능을 제공 https://en.wikipedia.org/wiki/Verlet_integration
- 단위 시간동안 동일한 질량을 가진 입자가 특정 힘을 받을때 입자의 속도와 위치 변화


### d3.forceSimulation
- `nodes`를 전달하고 여러가지 `force`를 적용하여 시뮬레이션
- `alpha` 값이 `tick`마다 `alphaDecay` 비율에 따라 감소하며 `alphaTarget`을 향함. `alphaMin` 보다 `alpha` 값이 작아지면 중단
- `node`에는 자동으로 `x,y,vx,vy`가 설정되며 `fx,fy`를 설정시 다른 값은 무시

### forces
- `vx,vy`나 `x,y`에 지속적인 영향을 줌
- `Centering, Collision, Links, Many-Body, Positioning` 등이 있음


Force-Directed Placement
---


```javascript
var w = 800, h = 600;
var margin = {top:10, right:10, bottom: 10, left: 10};
var innerW = w - margin.right - margin.left,
  innerH = h - margin.top - margin.bottom;

var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', h)
  .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');
var simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(function(d) { return d.id; }))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(innerW / 2, innerH / 2));
```

### 시뮬레이션 설정

- 서로 연결된 노드들은 당기도록 `d3.forceLink`를 사용하고 노드끼리 서로 밀어내도록 `d3.forceManyBody`를, 그리고 중앙에 모이도록 `d3.forceCenter`를 사용
 - `d3.forceCenter`의 경우 속도가 아닌 위치를 직접 중앙으로 이동

```javascript
var simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(function(d) { return d.id; }))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(innerW / 2, innerH / 2));
```

### 스케일 및 DOM 설정

```javascript
d3.json('miserables.json', callback);
function callback(err, data) {
  if(err) return console.error(err);
  var c = d3.scaleOrdinal()
        .domain(d3.set(
            data.nodes.map(function(d){return d.group;})
          ).values().sort(function(a,b){return a-b;})
        )
        .range(d3.schemeCategory20);
  var link = svg.append("g")
     .attr('class', 'links')
   .selectAll('line')
      .data(data.links)
   .enter().append('line');

  var node = svg.append('g')
      .attr('class', 'nodes')
    .selectAll('circle')
      .data(data.nodes)
    .enter().append('circle')
      .attr('r', 4)
      .style('fill', function(d){return c(d.group)});
  }
```

### 시뮬레이션 틱tick 이벤트 설정

- tick마다 node와 link 요소를 이동
 - link의 경우 source, target에 node 데이터가 연결

```javascript
simulation.nodes(data.nodes)
  .on('tick', function() {
    link.attr('x1', function(d){return d.source.x;})
      .attr('y1', function(d){return d.source.y;})
      .attr('x2', function(d){return d.target.x;})
      .attr('y2', function(d){return d.target.y;});
    node.attr('cx', function(d){return d.x;})
      .attr('cy', function(d){return d.y;});
  })
```
- tick 설정 후에 `d3.forceLink`의 링크를 설정
```javascript
simulation.force('link')
  .links(data.links);
```


드래깅 설정
---
- d3-drag를 통해 마우스나 터치 드래깅 동작을 설정 가능
http://devdocs.io/d3~4/d3-drag

```javascript
var drag = d3.drag().on('start', dragStrated)
  .on('drag', dragged)
  .on('end', dragEnded);

node.call(drag);
```

- drag에는 연결된 노드의 데이터가 연결되고, `fx,fy`에 포인터 위치를 전달하면 강제로 노드의 위치가 변경됨
 - drag가 시작될 때 `alphaTarget`을 0보다 크게 설정하면 `alpha`가 `alphaMin` 보다 작아질 수 없어서 계속 운동함


```javascript
function dragStrated(d) {
  if(!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragEnded(d) {
  if(!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
  svg.selectAll('.linked').classed('linked', false);
}

```

간단한 인터액션 추가
---
- `dragStarted` 에 선택한 노드의 링크와 연결된 노드들을 변화 시킴

```javascript
var linked = [];
svg.select('.links').selectAll('line').filter(function(l) {
  if (l.source === d) {
    if(linked.indexOf(l.target)<0) linked.push(l.target);
    return true;
  } else if( l.target === d) {
    if(linked.indexOf(l.source)<0) linked.push(l.source);
    return true;
  }
  return false;
}).classed('linked', true);
svg.select('.nodes').selectAll('circle').filter(function(n) {
  return linked.indexOf(n) >= 0;
}).classed('linked', true);

```

- `dragEnded`에서 설정을 제거

```javascript
svg.selectAll('.linked').classed('linked', false);
```

```css
.links line {
  stroke: #aaa;
}
.links line.linked {
  stroke-width : 2px;
}


.nodes circle {
  pointer-events: all;
  stroke: #eee;
  stroke-width: 2px;
}

.nodes circle.linked {
  stroke: blue;
}
```
