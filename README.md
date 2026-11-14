# Risu Bridge (Lumiverse extension)

RisuAI 카드를 **변환하지 않고 원본 그대로** Lumiverse에서 쓰기 위한 Spindle 확장입니다.
Runs original RisuAI cards in Lumiverse without converting them.

## 지금 되는 것 (1·2단계)

- 리스 CBS 문법 해석: `{{#when}}`, `{{#if}}`, `{{#if_pure}}`, `{{:else}}`, `{{/}}`, `{{#each}}`/`{{slot}}`, `{{#func}}`/`{{call}}`/`{{arg}}`
- 변수: `{{getvar}}`, `{{setvar}}`, `{{addvar}}`, `{{settempvar}}`/`{{gettempvar}}`, 카드의 기본 변수(defaultVariables)
- 토글: `{{getglobalvar::toggle_이름}}`, `#when::이름::tis::값` — 기본값은 첫 번째 선택지
- 비교·계산: `equal`, `not_equal`, `greater(_equal)`, `less(_equal)`, `all`, `any`, `contains`, `startswith`, `{{? 수식}}`, `{{calc}}`
- 문자열·배열: `split`, `arrayelement`, `trim`, `lower`, `filter`, `spread`, `random` …
- 프롬프트(설명, 로어북, 포스트 히스토리 등)와 채팅 화면 표시 양쪽에 적용
- 리스에서 온 카드(`extensions.risuai`가 있는 카드)에만 작동하고, 다른 카드와 프리셋은 건드리지 않습니다

## 토글 바꾸기

채팅 입력창의 **⋯ (Extras) → 리스 토글**을 누르면 카드의 토글 화면이 열립니다.
카드 제작자가 만든 그룹·설명 문구까지 리스와 같은 순서로 보이고, 바꾼 값은 **그 채팅에만** 저장돼
다음 답변부터 반영됩니다. "기본값으로"를 누르면 처음 상태(첫 번째 선택지)로 돌아갑니다.
(내부적으로는 채팅 변수 `toggle_토글이름`에 저장됩니다.)

## 다음 단계

- 3단계: 리스 정규식 다시 켜기, backgroundHTML(CSS), `move_top`, 카드 이미지(`{{raw}}`, `{{img}}`, `{{asset}}`)
- 4단계: `{{button}}` 메뉴와 간단한 Lua 트리거

## 설치

Lumiverse → Extensions → Install from GitHub → 이 저장소 주소.
권한 `macro_interceptor`, `characters`, `chats`를 허용해 주세요.

## 개발

```
bun install
bun test
bun run build
```
