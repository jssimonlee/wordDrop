# Word Drop Acid Rain

GitHub Pages에서 바로 실행할 수 있는 산성비 단어 타이핑 게임입니다.

## 실행

단어장을 `fetch`로 불러오므로 로컬에서는 간단한 정적 서버로 실행하는 편이 안전합니다.

```powershell
python -m http.server 8000
```

그다음 브라우저에서 `http://localhost:8000`을 엽니다.

## GitHub Pages 배포

1. 이 폴더의 파일을 GitHub 저장소에 커밋합니다.
2. 저장소의 `Settings` > `Pages`로 이동합니다.
3. `Build and deployment`의 `Source`를 `Deploy from a branch`로 선택합니다.
4. 배포 브랜치와 `/root` 폴더를 선택하고 저장합니다.

## 구성

- `index.html`: 화면 구조
- `styles.css`: 반응형 UI와 낙하 단어 스타일
- `script.js`: 게임 로직, 힌트, 재출제, 파편 효과
- `wordbooks/`: 기본 단어장 파일과 파일 목록

## 단어장 형식

게임 안의 `단어장 입력` 버튼으로 txt, tsv, xls, xlsx 파일을 불러올 수 있습니다.
상단에서 선택한 언어의 단어장으로만 저장됩니다.
`wordbooks` 폴더에 넣은 파일은 `wordbooks/manifest.json`에 등록하면 앱의 `폴더 단어장 불러오기` 목록에 표시됩니다.

영어 단어장:

- TXT/TSV: 탭으로 구분합니다. 1열 영어, 2열 한국어입니다.
- Excel: A열 영어, B열 한국어입니다.

일본어 단어장:

- TXT/TSV: 탭으로 구분합니다. 1열 한자, 2열 히라가나/가타가나, 3열 한국어입니다.
- Excel: A열 한자, B열 히라가나/가타가나, C열 한국어입니다.
- 로마자는 파일에 넣지 않습니다. 프로그램이 가나를 읽어 자동으로 정답 후보를 만듭니다.

예시:

```txt
apple	사과
wind	바람
school	학교
```

```txt
林檎	りんご	사과
学校	がっこう	학교
コーヒー	コーヒー	커피
```

`manifest.json` 예시:

```json
{
  "wordbooks": [
    {
      "language": "english",
      "name": "기본 영어 단어장",
      "file": "english.txt",
      "default": true
    },
    {
      "language": "japanese",
      "name": "기본 일본어 단어장",
      "file": "japanese.xlsx",
      "default": true
    }
  ]
}
```
