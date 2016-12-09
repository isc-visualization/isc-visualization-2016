d3에서의 색상 사용
---

목표
---
- d3-color 모듈 이해
- d3에서 색상을 스케일에 적용하는 방법


d3-color
---
http://devdocs.io/d3~4/d3-color

- 다양한 색상을 색공간에 따라 정의하고, 변경 가능

```javascript
var c = d3.hsl("steelblue"); // {h: 207.27…, s: 0.44, l: 0.4902…, opacity: 1}
console.log(c);

c.h += 90;
c.s += 0.2;
c + ""; // rgb(198, 45, 205)


c.opacity = 0.8;
c.toString(); // rgba(198, 45, 205, 0.8)
```

### d3.color
- css의 컬러 설정 스트링을 변경

```
rgb(255, 255, 255)
rgb(10%, 20%, 30%)
rgba(255, 255, 255, 0.4)
rgba(10%, 20%, 30%, 0.4)
hsl(120, 50%, 20%)
hsla(120, 50%, 20%, 0.4)
#ffeeaa
#fea
steelblue
```

### Color space
- d3.rgb
- d3.hsl
- d3.lab
- d3.hcl
  - The CIELCh color space is a CIELab cube color space, where instead of Cartesian coordinates a*, b*, the cylindrical coordinates C* (chroma, relative saturation) and h° (hue angle, angle of the hue in the CIELab color wheel) are specified.
  ![hcl](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/SRGB_gamut_within_CIELCH_color_space_isosurface.png/1024px-SRGB_gamut_within_CIELCH_color_space_isosurface.png)
  https://bl.ocks.org/mbostock/3e115519a1b495e0bd95

- d3.cubehelix
 - 'cubehelix' -- which is intended to be perceived as increasing in intensity. This is a family of colour schemes that go from black to white, deviating away from a pure greyscale (i.e. the diagonal from black to white in a colour cube) using a tapered helix in the colour cube, while ensuring a continuous increase in perceived intensity.

![](https://www.mrao.cam.ac.uk/~dag/CUBEHELIX/3d-default.png)

https://bl.ocks.org/mbostock/ba8d75e45794c27168b5


d3.scaleSequential
----
http://devdocs.io/d3~4/d3-scale#scaleSequential

- continuous scale 이지만 output range와 interpolator가 고정되어있음

```javascript
var rainbow = d3.scaleSequential(function(t) {
  return d3.hsl(t * 360, 1, 0.5) + ""; //(t는 [0,1])
});

var rainbow = d3.scaleSequential(d3.interpolateRainbow);
rainbow(0.5);
```

- perceptually-uniform color scheme들을 위한 interpolator가 미리 설정되어있음

```
d3.interpolatePlasma(t)
```

d3-scale-chromatic
---

- http://colorbrewer2.org/ 이 다양한 확산, 범주형 컬러 스킴을 제공
- colorbrewer의 컬러스킴은 모두 discrete하지만 이를 순차형이나 확산형으로 스케일에 사용할 수 있게 도와줌


- 일반적인 범주형 스케일을 사용할 경우

```javascript
var color = d3.scaleOrdinal(d3.schemeAccent);
```

- 확산형으로 사용할 경우

```javascript
var color = d3.scaleSequential(d3.interpolatePiYG);
```
