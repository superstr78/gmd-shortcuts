document.addEventListener('DOMContentLoaded', function() {
    initSettings();
    renderShortcuts();
    renderSidebarSection('사무 업무', 'office-work');
    renderSidebarSection('팀 공간', 'team-spaces');
});

const categoryColors = {
    "제품 개발": "color-orange",
    "프로젝트": "color-blue",
    "일반 공간": "color-green",
    "기타 공간": "color-teal",
    "업무 보조": "color-pink",
    "내부 서버": "color-purple"
};

// 사이드바에 표시할 카테고리 (메인 그리드에서 제외)
const sidebarCategories = ["사무 업무", "팀 공간"];

// 설정 초기화 및 토글 이벤트
function initSettings() {
    const toggle = document.getElementById('open-new-tab');
    const savedSetting = localStorage.getItem('openInNewTab');

    // 저장된 설정 불러오기 (기본값: true)
    if (savedSetting !== null) {
        toggle.checked = savedSetting === 'true';
    }

    // 토글 변경 시 저장
    toggle.addEventListener('change', function() {
        localStorage.setItem('openInNewTab', this.checked);
        updateAllLinks();
    });
}

// 새 창 열기 설정 가져오기
function getOpenInNewTab() {
    const toggle = document.getElementById('open-new-tab');
    return toggle ? toggle.checked : true;
}

// 모든 링크의 target 속성 업데이트
function updateAllLinks() {
    const target = getOpenInNewTab() ? '_blank' : '_self';

    // 모든 바로가기 링크 업데이트
    document.querySelectorAll('.shortcut-card:not(.has-children), .child-link, .sidebar-card').forEach(link => {
        link.target = target;
    });
}

function isConfluenceLink(url) {
    return url.includes('atlassian.net/wiki');
}

function getServiceBadge(url) {
    if (isConfluenceLink(url)) {
        return '<img src="images/conf_icon.png" alt="Confluence" class="service-badge">';
    }
    return '';
}

function getLinkTarget() {
    return getOpenInNewTab() ? '_blank' : '_self';
}

function renderShortcuts() {
    const container = document.getElementById('shortcuts-container');

    for (const [category, shortcuts] of Object.entries(shortcutsData)) {
        // 사이드바 카테고리는 메인에서 제외
        if (sidebarCategories.includes(category)) continue;

        const categoryEl = document.createElement('div');
        categoryEl.className = 'category';

        const colorClass = categoryColors[category] || 'color-blue';
        const headerEl = document.createElement('div');
        headerEl.className = `category-header ${colorClass}`;
        headerEl.innerHTML = `<h2>${category}</h2>`;

        const gridEl = document.createElement('div');
        gridEl.className = 'shortcuts-grid';

        shortcuts.forEach(shortcut => {
            if (shortcut.children && shortcut.children.length > 0) {
                const cardEl = document.createElement('div');
                cardEl.className = shortcut.important ? 'shortcut-card important has-children' : 'shortcut-card has-children';
                cardEl.dataset.parentUrl = shortcut.url;

                const childrenHtml = shortcut.children.map(child =>
                    `<a href="${child.url}" target="${getLinkTarget()}" rel="noopener noreferrer" class="child-link">
                        <div class="child-icon">${child.icon || '📄'}</div>
                        <div class="child-info">
                            <div class="child-name">${child.name}${getServiceBadge(child.url)}</div>
                            ${child.description ? `<div class="child-desc">${child.description}</div>` : ''}
                        </div>
                    </a>`
                ).join('');

                cardEl.innerHTML = `
                    <div class="shortcut-main">
                        <div class="shortcut-icon">${shortcut.icon}</div>
                        <div class="shortcut-info">
                            <div class="shortcut-name">${shortcut.name}${getServiceBadge(shortcut.url)}</div>
                            ${shortcut.description ? `<div class="shortcut-desc">${shortcut.description}</div>` : ''}
                        </div>
                    </div>
                    <div class="shortcut-children">
                        ${childrenHtml}
                    </div>
                `;

                cardEl.addEventListener('click', function(e) {
                    if (!e.target.closest('.child-link')) {
                        const target = getLinkTarget();
                        if (target === '_blank') {
                            window.open(shortcut.url, '_blank', 'noopener,noreferrer');
                        } else {
                            window.location.href = shortcut.url;
                        }
                    }
                });

                gridEl.appendChild(cardEl);
            } else {
                const cardEl = document.createElement('a');
                cardEl.className = shortcut.important ? 'shortcut-card important' : 'shortcut-card';
                cardEl.href = shortcut.url;
                cardEl.target = getLinkTarget();
                cardEl.rel = 'noopener noreferrer';

                cardEl.innerHTML = `
                    <div class="shortcut-icon">${shortcut.icon}</div>
                    <div class="shortcut-info">
                        <div class="shortcut-name">${shortcut.name}${getServiceBadge(shortcut.url)}</div>
                        ${shortcut.description ? `<div class="shortcut-desc">${shortcut.description}</div>` : ''}
                    </div>
                `;

                gridEl.appendChild(cardEl);
            }
        });

        categoryEl.appendChild(headerEl);
        categoryEl.appendChild(gridEl);
        container.appendChild(categoryEl);
    }
}

function renderSidebarSection(categoryName, containerId) {
    const container = document.getElementById(containerId);
    const items = shortcutsData[categoryName];

    if (!items || !container) return;

    items.forEach(item => {
        const cardEl = document.createElement('a');
        cardEl.className = 'sidebar-card';
        cardEl.href = item.url;
        cardEl.target = getLinkTarget();
        cardEl.rel = 'noopener noreferrer';

        cardEl.innerHTML = `
            <div class="sidebar-icon">${item.icon}</div>
            <div class="sidebar-info">
                <div class="sidebar-name">${item.name}${getServiceBadge(item.url)}</div>
                <div class="sidebar-desc">${item.description}</div>
            </div>
        `;

        container.appendChild(cardEl);
    });
}
