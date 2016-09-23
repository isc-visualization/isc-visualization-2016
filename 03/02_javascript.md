Javascript
===

Type
---

```javascript
typeof undefined             // undefined
typeof null                  // object
null === undefined           // false
null == undefined            // true
```

```javascript
/* falsy values*/
false
0
""
null
undefined
NaN
```

```javascript
NaN === NaN;        // false
Number.NaN === NaN; // false
isNaN(NaN);         // true
isNaN(Number.NaN);  // true
isNaN(undefined); // true
isNaN({});        // true
isNaN(true);      // false
isNaN(null);      // false
```

Dynamic Typing
---
- javascript is a *loosely typed* language.
- 실행 시runtime에 타입을 알 수 있다.  

```java
int num = 5;
float val  = 3.14;
boolean isActive = false;
String text ="Javascript는 Java와 아무 상관이 없다.";
```

```javascript
var num = 5;
var val  = 3.14;
var isActive = false;
var text ="Javascript는 Java와 아무 상관이 없다.";

typeof num; //number
num = 'five';
typeof num; //string
```



Hoisting
---
- javascript는 같은 scope 안에서 변수를 나중에 선언declaration 해도 된다. => 끌어올림 Hoisting 되었다.


```javascript
x = 5; //할당 assignment
console.log(x);
var x; //선언 declaration
```

- declaration은 hoisting 되지만, 초기화initializations는 그렇지 않다.

```javascript
var x = 5; // 초기화 Initialize x
console.log(x,y);
var y = 7; // 초기화 Initialize y
```


Function-level Scoping
---
- C나 Java와 같은 block scope({} 밖에서는 안을 알 수 없음)대신 function-level scope을 사용
- function을 기준으로 scope이 결정됨

```javascript
var foo = function() {
  var a = 3, b = 5;
  var bar = function() {
    var b = 7, c = 11;
    a += b+ c;
  }
  bar();
  console.log(a, b, c);
}
foo();
```

```javascript
function foo() {
  var x = 4;
  if(x == 4)
  {
    var y = 15;
    for (var i = 0; i <= x; i++)
    {
      var j = i;
    }
  }

  console.log(y, i, j);

}
foo();
```




Closure
---
- [클로저](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Closures)는 독립적인 (자유) 변수를 가리키는 함수이다. 또는, 클로저 안에 정의된 함수는 만들어진 환경을 '기억한다'.

```javascript
function init() {
  var name = "홍길동"; // init에 있는 지역 변수 name
  function displayName() { // 내부 함수, 즉 클로저인 displayName()
    alert(name); // 부모 함수에 정의된 변수를 사용한다
  }
  displayName();
}
init();
```

```javascript
function makeFunc() {
  var name = "홍길동";
  function displayName() {
    alert(name);
  }
  return displayName;
}

var myFunc = makeFunc();
myFunc();
```

```javascript
var person = function(name) {
  return {
    showName: function() {
      return name;
    }
  }
}
var gilDong = person('홍길동');
console.log(gilDong.showName());
```

```javascript
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);

console.log(add5(2));  // 7
console.log(add10(2)); // 12
```

*[클로져 응용 퀴즈](./00_quiz.md)*


Prototype
---
- 자바스크립트는 클래스를 지원하지 않는다.
- 그렇다면 상속은?
> 모든 오브젝트object는 프로토타입prototype이라는 다른 오브젝트 (또는 null)를 가리키는 내부 링크를 가지고 있다. 한 오브젝트의 프로토타입 또한 프로토타입을 가지고 있고 이것이 반복되다. null 오브젝트를 프로토타입으로 가지는 오브젝트에서 끝난다. 이 오브젝트들의 연쇄를 프로토타입 체인이prototype chain라고 부른다.
