마크와 채널 Marks And Channels
===

`Visualization Analysis and Design Chapter 3 'Marks and Channels'`


목표
---
마크와 채널의 개념의 이해와 적용
마크와 채널의 표현력과 유효성
채널의 유효성을 측정하는 방식들


마크와 채널의 정의 Defining Marks and Channels
---
- 시각적 기호화 작업의 핵심은 시각 요소인 마크와 마크의 실제 표현을 조절하는 채널을 직교Orthognoal 조합

### 마크 Marks
- 시각적 요소, 도형
- 마크로 사용되는 기하학적 원형으로 형태에 따라 표현 가능한 공간의 차원spatial dimensions 개수가 결정
![geometric primitives](https://cloud.githubusercontent.com/assets/253408/18578797/f0453702-7c2c-11e6-8bbf-353b48543727.png)
`점(0D), 선(1D), 영역(2D), 부피(3D)`

- 네트워크 데이터셋에서는 링크link에 대한 마크를 `연결connection과 봉쇄containment`로 구분
![link marks](https://cloud.githubusercontent.com/assets/253408/18579623/c8e8b922-7c31-11e6-9153-f5ffe132c89a.png)

### 시각적 채널 Visual Channels
- 마크의 실제 표현을 조절하는 방식
- 마크가 가진 기하학적 원형의 차원과 독립
- 구분을 위한 채널(identity, metathetic, what-where)과 크기를 비교하기 위한 채널(magnitude, prothetic, how-much)로 구분
- 공간적인 요소들이 대부분이며 가장 효과적이기도 하다
![visual channels](https://cloud.githubusercontent.com/assets/253408/18579283/bb30fb48-7c2f-11e6-8f7b-c250c060e89c.png)

`예시)`
![using marks and channels](https://cloud.githubusercontent.com/assets/253408/18579334/08a3f81c-7c30-11e6-8432-2fd40d78da77.png)

- 예시와 같이 개별 속성attribute가 1개의 채널만 사용하는 것이 효과적
- 크기size나 형태shape 채널은 모든 종류의 마크에 적용되기 어려움
  - 영역area 마크는 자체적으로 크기와 형태 내포하고 있음 => 색상 채널을 사용
![choropleth](http://indiemapper.com/app/images/unclassed_choropleth_map.jpg)
  - 선Line 마크 역시 길이의 차원을 사용중이므로 넓이를 새로운 채널로 할당할 수 있지만 길이는 그럴 수 없음
  - 점Point 마크는 0D 이기 때문에 크기와 형태 채널을 모두 사용할 수 있음
  ![bubble plot](https://plot.ly/~cimar/211.png)
