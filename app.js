document.addEventListener('DOMContentLoaded', function() {
    renderShortcuts();
    renderTeamSpaces();
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
const sidebarCategories = ["팀 공간"];

function isConfluenceLink(url) {
    return url.includes('atlassian.net/wiki');
}

function getServiceBadge(url) {
    if (isConfluenceLink(url)) {
        return '<img src="images/conf_icon.png" alt="Confluence" class="service-badge">';
    }
    return '';
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
                    `<a href="${child.url}" target="_blank" rel="noopener noreferrer" class="child-link">
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
                        window.open(shortcut.url, '_blank', 'noopener,noreferrer');
                    }
                });

                gridEl.appendChild(cardEl);
            } else {
                const cardEl = document.createElement('a');
                cardEl.className = shortcut.important ? 'shortcut-card important' : 'shortcut-card';
                cardEl.href = shortcut.url;
                cardEl.target = '_blank';
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

function renderTeamSpaces() {
    const container = document.getElementById('team-spaces');
    const teamSpaces = shortcutsData["팀 공간"];

    if (!teamSpaces) return;

    teamSpaces.forEach(team => {
        const cardEl = document.createElement('a');
        cardEl.className = 'sidebar-card';
        cardEl.href = team.url;
        cardEl.target = '_blank';
        cardEl.rel = 'noopener noreferrer';

        cardEl.innerHTML = `
            <div class="sidebar-icon">${team.icon}</div>
            <div class="sidebar-info">
                <div class="sidebar-name">${team.name}${getServiceBadge(team.url)}</div>
                <div class="sidebar-desc">${team.description}</div>
            </div>
        `;

        container.appendChild(cardEl);
    });
}
