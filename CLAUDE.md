# GMD Shortcuts 프로젝트 지침

## 중요: 변경 후 반드시 커밋 & 푸시

**모든 코드 변경 작업 완료 후 반드시 git 커밋하고 푸시해야 합니다.** 푸시하지 않으면 GitHub Pages에 반영되지 않습니다.

```bash
cd "D:\AI 자동화\GMD 바로가기\gmd-shortcuts"
git add .
git commit -m "커밋 메시지"
git push
```

푸시하면 GitHub Actions 워크플로우가 자동으로 실행되어 GitHub Pages에 배포됩니다. (1-2분 소요)

## 배포 URL

https://superstr78.github.io/gmd-shortcuts/

## 파일 구조

- `index.html` - 메인 HTML
- `styles.css` - 스타일시트
- `shortcuts.js` - 바로가기 데이터
- `app.js` - 렌더링 로직
- `.github/workflows/deploy.yml` - GitHub Pages 자동 배포 워크플로우

## 바로가기 데이터 수정

`shortcuts.js` 파일에서 바로가기를 추가/수정할 수 있습니다:

```javascript
{
    name: "바로가기 이름",
    url: "https://example.com",
    icon: "📋",
    description: "바로가기 설명"
}
```

## 변경 내역 관리

기능 추가나 변경 시 반드시 다음을 업데이트해야 합니다:

1. **도움말 모달** (`index.html`의 `#help-modal`)
   - 새 기능 추가 시 해당 섹션에 설명 추가
   - 변경 내역 섹션에 버전과 변경 사항 기록

2. **버전 규칙**
   - 버전은 `v1.0`, `v1.1`, `v1.2` 형태로 순번 부여
   - 주요 기능 추가: 소수점 첫째 자리 증가 (v1.0 → v1.1)
   - 대규모 변경: 정수 부분 증가 (v1.x → v2.0)

## 향후 작업

- Confluence API 연동 (목업 → 실제 데이터)
- Teams API 연동 (목업 → 실제 데이터)
