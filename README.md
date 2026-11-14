# Risu Bridge (Lumiverse extension)

RisuAI 카드를 **변환하지 않고 원본 그대로** Lumiverse에서 쓰기 위한 Spindle 확장입니다.
Runs original RisuAI cards in Lumiverse without converting them.

## 지금 되는 것 (1~4단계)

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

## 리스 정규식 (3단계)

Lumiverse는 리스 카드의 정규식을 가져올 때 켜짐/꺼짐을 거꾸로 읽어서, 쓰이던 정규식은 꺼지고
제작자가 꺼둔 것은 켜진 채로 들어옵니다. 이 확장은 카드를 처음 쓸 때 그 정규식들을 리스처럼 고칩니다.

- 켜짐/꺼짐을 원본대로, 적용 대상(화면/프롬프트/답변 저장)을 리스 종류에 맞게
- `$1` 같은 캡처를 먼저 넣고 리스 문법을 처리 (리스와 같은 순서)
- 카드의 backgroundHTML 스타일을 상태창 HTML에 같이 넣어서 디자인이 그대로 보이고, Lumiverse 다른 화면에는 새지 않음
- 카드 이미지: `{{raw::이름}}`, `{{path::이름}}`, `{{img::이름}}`, `{{image::이름}}`, `{{assetlist}}`, `{{source::char}}`
- 카드별로 정규식을 `리스 · 카드이름` 폴더에 묶어서 Regex Scripts 화면에서 그룹으로 보입니다 (직접 다른 폴더에 옮긴 건 건드리지 않음)
- 토글 창 아래 "리스 정규식"에서 **원래대로** / **리스처럼 적용**을 고를 수 있음 (원래 값은 보관해 둠)

알려진 한계: Lumiverse가 가져올 때 정규식의 커스텀 플래그(`<move_top>`, `i` 등)를 버려서 복구할 수 없습니다.

## 로어북 (5단계)

리스는 로어북 키워드를 **최근 메시지 몇 개(카드 설정, 기본 5개)** 에서만 찾지만, Lumiverse는 기본으로 채팅 전체를 뒤집니다.
그래서 `/프로필` 같은 명령어를 한 번 치면 그 지시가 영원히 켜져 있었어요. 이 확장은 카드 로어북을 리스처럼 맞춥니다.

- 카드의 스캔 깊이(없으면 5)를 각 항목에 넣음 (직접 정해 둔 값은 그대로)
- 리스 데코레이터 해석 후 내용에서 제거: `@@depth`, `@@end`, `@@scan_depth`, `@@role`, `@@activate`, `@@dont_activate`, `@@recursive`/`@@unrecursive`, `@@probability`, `@@match_full_word`, `@@additional_keys`, `@@exclude_keys`
- 카드 원래 로어북과 내용이 같은 항목만 고치고, 원래 값은 보관해 둠

## 버튼과 Lua (4단계)

Lumiverse는 카드를 가져올 때 리스의 트리거와 Lua를 버립니다. 이 확장은 **카드를 가져오는 순간 원본 파일에서 그 부분을 따로 읽어 자동으로 연결**합니다
(Lumiverse의 캐릭터 가져오기에서 파일을 고르거나 끌어다 놓을 때. 파일은 브라우저에서 읽고, 트리거와 정규식 설정만 캐릭터에 저장해요).

버튼이 있는 카드인데 자동 연결이 안 됐다면 (확장을 켜기 **전에** 가져왔거나 URL로 가져온 경우) ⋯ → 리스 토글 → "카드 속 버튼"의 **원본 파일 연결**에서 원본 파일을 한 번 골라 주세요.

- `risu-btn="..."` → Lua `onButtonClick`, `risu-trigger="이름"` / `{{button::글자::이름}}` → Lua 함수나 수동 트리거
- Lua: `getChatVar`/`setChatVar`, `getGlobalVar`(토글), `reloadDisplay`, `async` + `:await()`, `alertInput`/`alertNormal`/`alertSelect`, `getUserLastMessage`, `listenEdit("editRequest")`(보내기 전 프롬프트 수정: 루안 랜덤 이벤트 등)
- 수동 트리거의 변수 설정(`v2SetVar`, `setvar`)
- 출력(output) 트리거: 캐릭터 답변이 저장된 뒤 Lua `onOutput`과 조건 없는 변수 설정 실행 (답변에 적힌 스탯 반영 등)
- 원본을 연결하면 정규식 커스텀 플래그(`<move_top>`, `i` 등)도 되살립니다
- 리스가 붙이는 `x-risu-` 클래스 접두어를 정리해서 선택 버튼 강조 같은 디자인이 그대로 나옵니다
- 카드 Lua는 파일·네트워크·시스템에 접근할 수 없게 막혀 있습니다

아직 안 되는 것: LLM 호출(`LLM`, `axLLM`), 채팅 내용 직접 수정(`setChat`, `addChat`), 로어북 추가 같은 고급 Lua, 수동 트리거의 조건문.

## 설치

Lumiverse → Extensions → Install from GitHub → 이 저장소 주소.
권한 `macro_interceptor`, `characters`, `chats`, `chat_mutation`(메시지 읽기), `regex_scripts`, `regex_scripts_unrestricted`, `interceptor`(editRequest), `world_books`(로어북), `generation`(답변이 끝난 걸 알기 위해, 답변 후 트리거용)을 허용해 주세요.
0.5.0으로 업데이트하면 `world_books` 권한을 한 번 더 허용해야 로어북 맞춤이 작동합니다.

## 개발

```
bun install
bun test
bun run build   # build.ts: fengari의 파일/프로세스 기능을 빼고 묶습니다
```
