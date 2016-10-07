DIV로 바챠트 그리기
===

- HTML 세팅

```html
<div id="horizontal"></div>
<div id="vertical"></div>
```

- CSS 세팅
 - 공유되는 설정과 아닌 것을 구분한다.

```css
.bar {
  background-color: steelblue;
}
#horizontal .bar {
  margin-bottom : 8px;
  text-align: right;
}
#vertical .bar {
  margin-right : 8px;
  display : inline-block;
  position : relative;
}
```

- 가로 방향 그리기 (Horizontal Bar Chart)
 - `width`를 변경한다.

```javascript
var data = [200, 300, 400, 500, 100];
d3.select('#horizontal').selectAll('.bar')
  .data(data)
.enter().append('div')
  .attr('class', 'bar') //.classed("bar", true)
  .style('width', function(d){return d+'px';})
  .text(function(d){return d;})

```

- 세로 방향 그리기 (Vertical Bar Chart | Column Chart)
 - css에서 `display:inline-block`을 사용한다.
 - `height`를 변경한다.
 - 좌표계의 Y축이 반대방향 이므로 `top`을 통해 전체 높이에서 빼주도록 한다.

```javascript
d3.select('#vertical').selectAll('.bar')
  .data(data)
.enter().append('div')
  .attr('class', 'bar')
  .style('top', function(d){return 500 - d + 'px'})
  .style('height', function(d){return d+'px';})
  .text(function(d){return d;})
```

```javascript
var height = d3.max(data);
.style('top', function(d){return height - d + 'px'})
```

```javascript
var randGenerator = d3.randomUniform(100, 500);
var dataset = d3.range(50).map(function() {return Math.floor(randGenerator())});
```
