업데이트 3
===

SVG 클릭시 데이터가 추가-삭제 되도록 변경
---

- 클릭할 때마다 product 의 값이 알파벳 순서대로 증가하도록, 데이터를 추가하고 맨 앞의 데이터는 삭제
```javascript
var randDataset = (function() {
 var asciiRange = [65, 90], curAscii = 70
 return function() {
   var newVal = {product: String.fromCharCode(curAscii), sales : Math.round(rand())};
   dataset.push(newVal);
   dataset.shift();
   curAscii +=1;
   if(curAscii>asciiRange[1]) curAscii = asciiRange[0];
 }
}());
```

스케일 재설정
---
- 클릭 했을 때, 기존의 x 도메인과, 스케일을 갱신한다.

```javascript
xDomain = dataset.map(function(d){return d.product;});
x.domain(xDomain);
```

- 텍스트도 갱신한다.

```javascript
function updateText(selection) {
  selection.text(function(d){return d.product});
  return selection;
}
```

```javascript
bar.select('text')
  .transition(t)
  .call(updateText);
```



축 재설정
---
- 축이 그려진 요소를 선택하여 다시 축을 그린다.

```javascript
svg.select('.x.axis')
  .transition(t) // 트랜지션을 적용하면 내부적으로 트랜지션 처리
    .call(xAxis);
```

키Key 설정하여 연결하기
---
- `selection.data([data[, key]])`에서 데이터가 binding에 사용되는 key를 key 함수를 통해 설정가능하다. 기본적으로는 array의 index를 가지고 key를 바인딩한다`join-by-index`.  데이터마다 고유한 key를 설정해주면 새로 추가, 삭제된 데이터를 기존 셀렉션과 비교하여 바인딩할 수 있다.
- (참고) http://devdocs.io/d3~4/d3-selection#selection_data

- 데이터를 바인딩하면서 새롭게 키를 설정한다. 이때 bar 변수의 값은 데이터가 새로 바인딩 된 새로운 셀렉션으로 갱신해야한다.

```javascript
bar = bar.data(dataset, function(d){return d.product})
  .call(updateBar);
```


삭제하기 exit and remove
---
- `selection.exit`를 하면 새로 연결된 데이터와 key가 연결되지 않는 셀렉션들만을 선택한다. `selection.remove` 통해 요소를 삭제 가능

```javascript
bar.exit().remove();
```


새로운 요소 추가 enter

- 새로운 key를 갖는 데이터를 위해 요소를 생성한다. 이때 아직 요소를 갖지 않는 셀렉션은 `selection.enter`로 연결된다.

```javascript
var barEnter = bar.enter().append('g')
  .attr('class', 'bar')
```

- 새로 추가된 셀렉션에 rect와 text를 추가한다.

```javascript
barEnter.append('rect')
  .attr('width', x.bandwidth());

barEnter.append('text')
  .attr('dx', x.bandwidth()*0.5)
  .attr('dy', function(d) {return '1em';})
  .attr('text-anchor', 'middle')
  .style('fill', 'white')
  .text(function(d){return d.product});
```

갱신 update
---
- 앞서 선택된 셀렉션과 새로 추가된 enter셀렉션을 merge를 통해 합친 후 업데이트 하고 이를 다시 bar에 저장

```javascript
bar = barEnter.merge(bar)

bar.transition(t)
  .call(translateBar);
```

- 트랜지션되는 요소들도 업데이트 한다.

```javascript
bar.select('rect')
  .transition(t)
  .call(updateRect);
```
