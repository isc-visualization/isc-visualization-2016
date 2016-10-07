5주차
===

1. [외부 데이터 연결](./01_loadExternalData.md)
2. [DIV로 바챠트 그리기](./02_bar-div.md)
3. [SVG로 바챠트 그리기](./03_bar-svg.md)
4. [D3의 스케일 사용하기](./04_scames.md)

## 과제05 D3로 스캐터플롯 그려보기
<img width="432"  src="https://cloud.githubusercontent.com/assets/253408/19190504/d8f37f8e-8cd8-11e6-8eb7-072b1d3b008b.png">

1. 너비와 높이가 `400X400px`인 SVG를 세팅합니다.
2. [샘플 JSON 파일](sample/assignment.json)을 불러옵니다.
3. 원을 데이터의 `sales` 속성은 수평, `profit` 속성은 수직 방향으로 적절히 위치시킵니다.(위치가 예시와 정확히 같을 필요는 없지만, 순서는 동일하게 배치되어야 합니다. 또한, 원이 영역을 벗어나지 않도록 적절히 범위를 결정합니다.)
4. 원의 반지름 값은 `2px`입니다.
5. 개별 원의 `category` 속성 값을 각각의 우측 상단에 위치시킵니다.


#### 추가 과제
`추가 과제의 경우, 기본 과제 밑에 추가하세요. 반드시 수행할 필요는 없습니다.`

<img width="419"  src="https://cloud.githubusercontent.com/assets/253408/19190510/db610020-8cd8-11e6-8dc1-76538a1d7314.png">

- 추가 과제의 경우, 1) `category`속성 값을 `{R:'red', G:'green', B:'blue'}`로 매핑하여, 원의 색상을 결정합니다. 2) 또한 `price` 속성 값이 `[4, 16]` 범위에서 반지름 값을 변화시키도록 크기를 변경합니다.

- 제출마감 : `2016-10-14 (금) 18:00`
- 제출방법
 - [제출 폴더](https://www.dropbox.com/request/iYsdP82quiYyxj50mZZc)
 - 제출명 : 폴더명 `이름-학번` (예: honggildong-2013)
 - 제출물 :
   - 결과물은 `index.html` 하나에 모두 작성합니다.
   - 결과물 파일은 모두 `honggildong-2013` 폴더에 넣은 후 압축 없이 폴더 전체를 업로드 합니다.
   - d3 이외의 외부 라이브러리의 사용은 금합니다.
