d3.nest 활용하기
===

(참고)
http://devdocs.io/d3~4/d3-collection#nest
http://bl.ocks.org/phoebebright/raw/3176159/

목표
---
- 표 형태의 데이터셋을 중첩된nested 형태로 변환
- d3.nest 함수에 대한 이해와 활용
- aggregate에 대한 이해와 활용



Nesting(groupby)
---
 - `Table -> Hierarchical tree structure`


 ```javascript
 var yields = [
  {yield: 27.00, variety: "Manchuria", year: 1931, site: "University Farm"},
  {yield: 48.87, variety: "Manchuria", year: 1931, site: "Waseca"},
  {yield: 27.43, variety: "Manchuria", year: 1931, site: "Morris"},
  ...
];

var entries = d3.nest()
    .key(function(d) { return d.year; })
    .key(function(d) { return d.variety; })
    .entries(yields);

[{key: "1931", values: [
   {key: "Manchuria", values: [
     {yield: 27.00, variety: "Manchuria", year: 1931, site: "University Farm"},
     {yield: 48.87, variety: "Manchuria", year: 1931, site: "Waseca"},
     {yield: 27.43, variety: "Manchuria", year: 1931, site: "Morris"}, ...]},
   {key: "Glabron", values: [
     {yield: 43.07, variety: "Glabron", year: 1931, site: "University Farm"},
     {yield: 55.20, variety: "Glabron", year: 1931, site: "Waseca"}, ...]}, ...]},
 {key: "1932", values: ...}]

 ```


1-level
---
- [샘플 파일](./sample/sample.nest.json)
- `nest.key` 통해 그룹-키group-key를 설정하고 `nest.entries`에 데이터셋을 전달하여 실행
- 결과는 `key`와 `values`로 나뉘어 저장


```javascript
d3.json('sample/sample.nest.json', function(dataset) {
 var entries = d3.nest()
  .key(function(d){return d.category})
  .entries(dataset);
 console.log(entries);
});
```

2-level
---

```javascript
var entries = d3.nest()
 .key(function(d){return d.category})
 .key(function(d){return d.sub_category})
 .entries(dataset);
```


Rollup
---
- 다양한 집산Aggregation을 위해 `nest.rollup`을 통해 leaf-node들의 값을 변형할 수 있다.
- 이때 값은 `values`가 아닌 `value`로 저장된다.

- 그룹별 아이템 빈도 세기

```javascript
var entries = d3.nest()
 .key(function(d){return d.category})
 .key(function(d){return d.sub_category})
 .rollup(function(values){return values.length})
 .entries(dataset);

```

- 오브젝트를 반환하는 것도 가능
 - `d3.sum` 통해서 array의 값을 합산 http://devdocs.io/d3~4/d3-array#sum
```javascript
var entries = d3.nest()
 .key(function(d){return d.category})
 .key(function(d){return d.sub_category})
 .rollup(function(values){
   return {
     count:values.length,
     sum:d3.sum(values, function(d){return d.value}
   )};
 })
 .entries(dataset);
```

정렬 Sorting
---

- Javascript의 Comparator 생성방법 http://devdocs.io/javascript/global_objects/array/sort

 - 두 값을 비교해서 내놓는 값에 따라 순서가 결정

```javascript
function compare(a, b) {
  if (a is less than b by some ordering criterion) {
    return -1;
  }
  if (a is greater than b by the ordering criterion) {
    return 1;
  }
  // a must be equal to b
  return 0;
}
```

```javascript
function compareNumbers(a,b) { //오름차순으로 정렬
  return a-b; //b-a는 내림차순 정렬
}
```

```javascript
function compareStrings(a,b) { //오름차순으로 정렬
  return a.localeCompare(b); // a가 b보다 작으면 -1, 같으면 0, 크면 1 b-a는 내림차순 정렬
}
```

- Array.sort : 배열 정렬

```javascript
var items = ['réservé', 'premier', 'cliché', 'communiqué', 'café', 'adieu'];
items.sort(function (a, b) {
  return a.localeCompare(b);
});
```

- nest.sortKeys : key의 순서를 정렬

```javascript
.key(function(d){return d.category}).sortKeys(function (a,b) { return a.localeCompare(b);})
.key(function(d){return d.sub_category}).sortKeys(d3.descending)
```

- nest.sortValues : values의 순서를 정렬

```javascript
var entries = d3.nest()
 .key(function(d){return d.category}).sortKeys(function (a,b) { return a.localeCompare(b);})
 .key(function(d){return d.sub_category}).sortKeys(d3.descending)
 .sortValues(function(a,b) {return a.position - b.position}) //position의 오름차순으로 정렬
 .entries(dataset);
```


nest.map
---
- 출력형식을 배열 `[{key:..., values:...}, ...]` 가 아닌 오브젝트 형태`{key1:values1, key2:values2}` 변환

- `nest.entries` 대신에 `nest.object`을 사용
- `nest.entries` 대신에 `nest.map`을 사용
  - `d3.map` 형태로 출력된다. (http://devdocs.io/d3~4/d3-collection#map)
  - `map.get`, `map.set`을 통해 접근

```javascript
var entries = d3.nest()
 .key(function(d){return d.category}).sortKeys(function (a,b) { return a.localeCompare(b);})
 .key(function(d){return d.sub_category}).sortKeys(d3.descending)
 .sortValues(function(a,b) {return a.position - b.position}) //position의 오름차순으로 정렬
 .map(dataset);
```
