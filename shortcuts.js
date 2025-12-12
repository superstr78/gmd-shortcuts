const shortcutsData = {
    "제품 개발": [
        {
            name: "제품 정책 및 배포 전략",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/nj9Tfeun93mA/overview",
            icon: "📋",
            description: "제품 출시 정책, 버전 관리 및 배포 일정",
            important: true
        },
        {
            name: "다국어 요청",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/Shared/overview",
            icon: "🌐",
            description: "번역 요청 및 다국어 리소스 관리",
            important: true
        },
        {
            name: "제품 규격",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/Shared/pages/29435811/Product+Specification",
            icon: "📐",
            description: "제품별 상세 기능 명세서"
        },
        {
            name: "패키지 관리",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/PKGMGR/overview",
            icon: "📦",
            description: "설치 패키지 구성 및 배포 관리"
        },
        {
            name: "UX 라이팅",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/TechnicalWriting/overview",
            icon: "✏️",
            description: "UI 문구 작성 가이드라인"
        }
    ],
    "프로젝트": [
        {
            name: "MD-RED4",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/MDRED4/overview",
            icon: '<img src="images/RED.jpg" alt="MD-RED4">',
            description: "MD-RED 4세대 프로젝트",
            important: true,
            children: [
                { name: "로드맵", url: "https://gmdsoft.atlassian.net/wiki/spaces/Shared/pages/29435913/MD-RED4", icon: "🗺️", description: "MD-RED4 개발 로드맵" },
                { name: "제품 규격", url: "https://gmdsoft.atlassian.net/wiki/spaces/Shared/pages/29436026/MD-RED4", icon: "📐", description: "MD-RED4 제품 규격" },
                { name: "MD-EXP4", url: "https://gmdsoft.atlassian.net/wiki/spaces/EXP4/overview", icon: "🧪", description: "MD-EXP 4세대" }
            ]
        },
        {
            name: "MD-RED3",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/MDRED/overview",
            icon: '<img src="images/RED.jpg" alt="MD-RED3">',
            description: "MD-RED 3세대 프로젝트",
            important: true,
            children: [
                { name: "MD-EXP3", url: "https://gmdsoft.atlassian.net/wiki/spaces/REDEXP/overview", icon: "🧪", description: "MD-EXP 3세대" },
                { name: "KMV", url: "https://gmdsoft.atlassian.net/wiki/spaces/KMV/overview", icon: "👁️", description: "KMV 뷰어" }
            ]
        },
        {
            name: "MD-LIVE",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/MDLIVE/overview",
            icon: '<img src="images/LIVE.jpg" alt="MD-LIVE">',
            description: "MD-LIVE 프로젝트",
            important: true,
            children: [
                { name: "로드맵", url: "https://gmdsoft.atlassian.net/wiki/spaces/Shared/pages/29435939/MD-LIVE3", icon: "🗺️", description: "MD-LIVE3 개발 로드맵" },
                { name: "제품 규격", url: "https://gmdsoft.atlassian.net/wiki/spaces/Shared/pages/29435810/MD-LIVE3", icon: "📐", description: "MD-LIVE3 제품 규격" }
            ]
        },
        {
            name: "MD-MEDIA",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/MDRECOVERY/overview",
            icon: '<img src="images/VIDEO.jpg" alt="MD-MEDIA">',
            description: "MD-MEDIA 프로젝트",
            important: true,
            children: [
                { name: "로드맵", url: "https://gmdsoft.atlassian.net/wiki/spaces/Shared/pages/29435711/MD-VIDEO", icon: "🗺️", description: "MD-VIDEO 개발 로드맵" },
                { name: "제품 규격", url: "https://gmdsoft.atlassian.net/wiki/spaces/Shared/pages", icon: "📐", description: "MD-MEDIA 제품 규격" }
            ]
        },
        {
            name: "MD-NEXT",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/MDEXTRACTORS/overview",
            icon: '<img src="images/NEXT.jpg" alt="MD-NEXT">',
            description: "MD-NEXT 프로젝트",
            important: true,
            children: [
                { name: "로드맵", url: "https://gmdsoft.atlassian.net/wiki/spaces/Shared/pages/29435780/MD-NEXT", icon: "🗺️", description: "MD-NEXT 개발 로드맵" },
                { name: "제품 규격", url: "https://gmdsoft.atlassian.net/wiki/spaces/Shared/pages/29435937/MD-NEXT", icon: "📐", description: "MD-NEXT 제품 규격" },
                { name: "MD-X", url: "https://gmdsoft.atlassian.net/wiki/spaces/MDX/overview?homepageId=50496563", icon: "🔧", description: "MD-X 프로젝트" }
            ]
        }
    ],
    "일반 공간": [
        {
            name: "개발자 네트워크",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/HSDN/overview",
            icon: "🔗",
            description: "기술 공유 및 개발자 커뮤니티",
            important: true,
            children: [
                { name: "코딩 규칙", url: "https://gmdsoft.atlassian.net/wiki/spaces/HSDN/pages/29004302", icon: "📝", description: "코드 작성 표준 및 컨벤션" },
                { name: "스크럼", url: "https://gmdsoft.atlassian.net/wiki/spaces/HSDN/pages/29002639", icon: "🔄", description: "애자일 스크럼 프로세스" },
                { name: "지식 공유", url: "https://gmdsoft.atlassian.net/wiki/spaces/HSDN/pages/29002207", icon: "💡", description: "기술 세미나 및 공유 자료" }
            ]
        },
        {
            name: "용어",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/terms/overview",
            icon: "📖",
            description: "사내 표준 용어 사전"
        },
        {
            name: "출장 보고서",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/Report/overview",
            icon: "✈️",
            description: "국내외 출장 결과 보고"
        }
    ],
    "사무 업무": [
        {
            name: "그룹웨어",
            url: "https://login.office.hiworks.com/gmdsoft.com",
            icon: "📧",
            description: "하이웍스 오피스"
        },
        {
            name: "ERP",
            url: "https://gmd.ksystemace.com/",
            icon: "📊",
            description: "전사 자원 관리"
        },
        {
            name: "메타페이",
            url: "https://gmdsoft.gopay.co.kr/",
            icon: "💳",
            description: "급여 및 복리후생"
        }
    ],
    "팀 공간": [
        {
            name: "개발1팀",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/1/overview",
            icon: "👥",
            description: "백엔드 코어 개발"
        },
        {
            name: "개발2팀",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/DEV2TEAM/overview",
            icon: "👥",
            description: "모바일 앱 개발"
        },
        {
            name: "개발4팀",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/DEV4/overview",
            icon: "👥",
            description: "데스크탑 클라이언트 개발"
        },
        {
            name: "AI팀",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/AI/overview",
            icon: "🤖",
            description: "AI/ML 모델 연구 및 개발"
        },
        {
            name: "프론트팀",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/TS/overview",
            icon: "🎨",
            description: "웹 프론트엔드 개발"
        },
        {
            name: "QA팀",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/QATeam/overview",
            icon: "🔍",
            description: "품질 보증 및 테스트 자동화"
        },
        {
            name: "글로벌사업팀",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/FB/overview",
            icon: "🌍",
            description: "해외 시장 영업 및 파트너십"
        },
        {
            name: "마케팅기획팀",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/Marketing/overview",
            icon: "📢",
            description: "마케팅 전략 및 캠페인 기획"
        },
        {
            name: "팀장 페이지",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/Manager/overview",
            icon: "👔",
            description: "팀장 전용 리더십 자료"
        }
    ],
    "기타 공간": [
        {
            name: "AI 자동화 TF",
            url: "https://gmdsoft.atlassian.net/wiki/spaces/AIAUTO/overview",
            icon: "⚡",
            description: "업무 자동화 프로젝트"
        }
    ],
    "업무 보조": [
        {
            name: "허브스팟",
            url: "https://app-na2.hubspot.com/",
            icon: "🔶",
            description: "CRM 및 마케팅 자동화 플랫폼",
            important: true
        },
        {
            name: "가상머신1",
            url: "https://172.16.253.25/ui/#/host",
            icon: "💻",
            description: "VMware vSphere 호스트 #1"
        },
        {
            name: "가상머신2",
            url: "https://172.16.253.26/ui/#/host",
            icon: "💻",
            description: "VMware vSphere 호스트 #2"
        }
    ],
    "내부 서버": [
        {
            name: "KMV 서버",
            url: "http://172.16.3.204:8888/viewer/web/#loaded",
            icon: "🖥️",
            description: "파일 뷰어 웹 서비스"
        },
        {
            name: "KDF 서버",
            url: "http://172.16.3.204/nemosmart/auth/tempLogin",
            icon: "🖥️",
            description: "NemoSmart 인증 서버"
        }
    ]
};
