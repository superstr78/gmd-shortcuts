# GMD Shortcuts 프로젝트 지침

## 배포

코드 변경 후 GitHub Pages에 배포하려면 반드시 수동으로 커밋하고 푸시해야 합니다.

```bash
cd "D:\AI 자동화\GMD 바로가기\gmd-shortcuts"
git add .
git commit -m "커밋 메시지"
git push
```

푸시하면 GitHub Actions 워크플로우가 자동으로 실행되어 GitHub Pages에 배포됩니다.

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

## 향후 작업

- Confluence API 연동 (목업 → 실제 데이터)
- Teams API 연동 (목업 → 실제 데이터)
