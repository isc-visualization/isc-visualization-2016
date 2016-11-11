날짜-시간 다루기
===

목표
---
- 자바스크립트의 날짜 객체를 다루기
- D3의 time과 time-format 모듈을 활용하여 날짜를 계산하거나 출력하기


자바스크립트 날짜 객체 Javascript Date Object
---
(참고) https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date

- 자바스크립트의 날짜 객체는 단일한 순간(타임스탬프timestamp)을 가리킴

```javascript
new Date();
new Date(value); //1 January 1970 00:00:00 UTC 이후 milliseconds https://en.wikipedia.org/wiki/Unix_time
new Date(dateString); //RFC 2822 : D, d M Y H:i:s O   | ISO 8601 : YYYY-MM-DDTHH:mm:ss.sssZ
new Date(year, month[, date[, hours[, minutes[, seconds[, milliseconds]]]]]); //month가 0–11까지것에 주의!
```

-ISO 8601
```
YYYY = four-digit year
MM   = two-digit month (01=January, etc.)
DD   = two-digit day of month (01 through 31)
hh   = two digits of hour (00 through 23) (am/pm NOT allowed)
mm   = two digits of minute (00 through 59)
ss   = two digits of second (00 through 59)
s    = one or more digits representing a decimal fraction of a second
TZD  = time zone designator (Z or +hh:mm or -hh:mm)
```

```javascript
var today = new Date();
var birthday = new Date('December 17, 1995 03:24:00');
var birthday = new Date('1995-12-17T03:24:00');
var birthday = new Date(1995, 11, 17);
var birthday = new Date(1995, 11, 17, 3, 24, 0);
```

- 경과 시간 elapsed time 계산 : 두 Date 객체를 빼면 된다.
 - 결과는 milliseconds 단위
```javascript
var start = Date.now();

window.setTimeout(function() {
  var end = Date.now();
  var elapsed = end - start;
  console.log(elapsed);
}, 1000)
```
- 날짜 세기
```javascript
var start = new Date(2016, 01, 01),
    end = Date.now();
(end - start) / 864e5; //1000*3600*24
```

d3-time
---
(참고) http://devdocs.io/d3~4/d3-time

- d3.interval을 활용해서 기간 등의 계산
```javascript
d3.timeDay.count(start, end);
```

```javascript

```

- 특정 단위로 반올림
```javascript
d3.timeMonth(Date.now()); //내림 floor
d3.timeMonth.floor(Date.now());
d3.timeMonth.round(Date.now());
d3.timeMonth.ceil(Date.now());
```

- 특정 단위 이후 이전 알아보기
```javascript
d3.timeWeek.offset(Date.now(), 4);
```

- 기간내 특정 단위별로 날짜 구하기
```javascript
d3.timeDay.range(new Date(2016, 10, 1), new Date(2016, 10, 7), 2);

var now = new Date;
d3.timeWeek.range(d3.timeMonth.floor(now), d3.timeMonth.ceil(now));
```

- 상위 기간의 시작으로부터 일정한 간격으로 기간 구하기
```javascript
d3.timeDay.every(2).range(new Date(2016, 0, 1), new Date(2016, 0, 7));
d3.timeDay.every(2).range(new Date(2016, 0, 2), new Date(2016, 0, 8));
```

d3-time-format
---
- 특정한 형식의 string으로 date 객체를 변환하거나 역으로 파싱parse 가능
(참고) http://devdocs.io/d3~4/d3-time-format

```javascript
var formatTime = d3.timeFormat("%B %d, %Y");
formatTime(new Date); // "June 30, 2015"
```

```javascript
var parseTime = d3.timeParse("%Y-%m-%d");
parseTime('2016-11-07');
```

(참고) 별도의 locale을 설정할 수 있음 d3.timeFormatLocale(definition)
- https://github.com/d3/d3-time-format/blob/master/locale/ko-KR.json

```javascript
var koKR = {
  "dateTime": "%Y/%m/%d %a %X",
  "date": "%Y/%m/%d",
  "time": "%H:%M:%S",
  "periods": ["오전", "오후"],
  "days": ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  "shortDays": ["일", "월", "화", "수", "목", "금", "토"],
  "months": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  "shortMonths": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
};
var locale = d3.timeFormatLocale(koKR);
locale.format("%Y년 %B %d일, %A")(new Date);
locale.parse("%Y년 %B %d일, %A")("2016년 11월 12일, 토요일")
```

(참고) d3-format http://devdocs.io/d3~4/d3-format#format
- 시간 이외 숫자 포매팅
