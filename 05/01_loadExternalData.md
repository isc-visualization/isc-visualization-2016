외부 데이터 연결
====
- [d3-request](http://devdocs.io/d3~4/d3-request) 모듈을 활용
- [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)를 이용하여 다양한 종류의 파일을 쉽게 가져올 수 있다.
- 정해진 파일 양식을 가져오는 것 이외에도 커스텀 리퀘스트를 만들 수 있다.

TEXT
---

```javascript
d3.text("sample.txt", function(error, text) {
  if (error) throw error;
  console.log(text);
});
```

DSV
---
- Delimiter Separated Values
- 보통 CSV(Comma)나 TSV(Tab)를 사용한다.

```javascript
d3.csv("sample.csv", function(error, data) {
  if (error) throw error;
  console.log(data);
});
```

- 행 변환 함수(row conversion function)를 전달하여 결과를 미리 변형

```javascript
function row(d) { //row conversion function
  return {
    orderDate : d3.timeParse('%m/%d/%Y')(d['Order Date']),
    orderId : +d["Order ID"],
    sales : d['Sales']
  }  
}

function callback(error, data) {
  if (error) throw error;
  console.log(data);
}

var url = "sample.csv";
d3.csv(url, row, callback);
```

```javascript
d3.csv(url)
  .row(row)
  .get(callback);

d3.request(url)
    .mimeType("text/csv")
    .response(function(xhr) { return d3.csvParse(xhr.responseText, row); })
    .get(callback);
```

```javascript
function callback(error, data) {
  if (error) throw error;
  d3.select('body').selectAll('p')
    .data(data)
    .enter().append('p')
    .text(function(d){return d.orderId + ' | ' + d.orderDate + ' | ' + d.sales})
}
```



JSON
---
- [JSON](http://json.org/)(JavaScript Object Notation) 형식의 파일
- 웹상에서 데이터 전송을 위해 정해진 포맷으로 자바스크립트 오브젝트의 포맷과 동일하다,
- 일반적인 표형식과 달리 위계 구조의 자료를 표기하기 편리하다.

```json
{"menu": {
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {"value": "New", "onclick": "CreateNewDoc()"},
      {"value": "Open", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]
  }
}}
```

```javascript
d3.json('sample.json', function(err, data) {
  if (error) throw error;
  console.log(data);
});
```

```javascript
d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) { return JSON.parse(xhr.responseText); })
    .get(callback);
```
