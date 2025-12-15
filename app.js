document.addEventListener('DOMContentLoaded', function() {
    initSettings();
    initTooltip();
    initSettingsModal();
    initHelpModal();
    initChangelogModal();
    renderShortcuts();
    renderSidebarSection('사무 업무', 'office-work');
    renderSidebarSection('팀 공간', 'team-spaces');
});

// 카테고리별 헤더 색상
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

// 기본 카테고리 순서
const defaultCategoryOrder = ["제품 개발", "프로젝트", "일반 공간", "기타 공간", "업무 보조", "내부 서버"];

// 설정 초기화 및 토글 이벤트
function initSettings() {
    // 새 창에서 열기 토글 (기본값: true)
    const newTabToggle = document.getElementById('open-new-tab');
    if (newTabToggle) {
        const savedNewTab = localStorage.getItem('openInNewTab');
        // 저장된 값이 없으면 기본값 true 저장
        if (savedNewTab === null) {
            localStorage.setItem('openInNewTab', 'true');
        } else {
            newTabToggle.checked = savedNewTab === 'true';
        }
        newTabToggle.addEventListener('change', function() {
            localStorage.setItem('openInNewTab', this.checked);
            updateAllLinks();
        });
    }

    // 간략하게 표시 토글 (기본값: true)
    const compactToggle = document.getElementById('compact-mode');
    if (compactToggle) {
        const savedCompact = localStorage.getItem('compactMode');
        // 저장된 값이 없으면 기본값 true 저장
        if (savedCompact === null) {
            localStorage.setItem('compactMode', 'true');
            document.body.classList.add('compact-mode');
        } else {
            compactToggle.checked = savedCompact === 'true';
            document.body.classList.toggle('compact-mode', savedCompact === 'true');
        }
        compactToggle.addEventListener('change', function() {
            localStorage.setItem('compactMode', this.checked);
            document.body.classList.toggle('compact-mode', this.checked);
        });
    }
}

// 링크 타겟 속성 반환 (_blank 또는 _self)
function getLinkTarget() {
    const toggle = document.getElementById('open-new-tab');
    return (toggle && toggle.checked) ? '_blank' : '_self';
}

// 모든 링크의 target 속성 업데이트
function updateAllLinks() {
    const target = getLinkTarget();
    document.querySelectorAll('a[href].shortcut-card, .child-link, .sidebar-card').forEach(link => {
        link.target = target;
    });
}

// Confluence 링크 여부 확인
function isConfluenceLink(url) {
    return url && url.includes('atlassian.net/wiki');
}

// Confluence 뱃지 HTML 반환
function getServiceBadge(url) {
    if (isConfluenceLink(url)) {
        return '<img src="images/conf_icon.png" alt="Confluence" class="service-badge">';
    }
    return '';
}

// 커스텀 툴팁 초기화
function initTooltip() {
    const tooltip = document.getElementById('custom-tooltip');
    const titleEl = tooltip.querySelector('.custom-tooltip-title');
    const descEl = tooltip.querySelector('.custom-tooltip-desc');

    document.addEventListener('mouseover', function(e) {
        const target = e.target.closest('[data-tooltip-name]');
        if (target) {
            const name = target.dataset.tooltipName;
            const desc = target.dataset.tooltipDesc || '';

            titleEl.textContent = name;
            descEl.textContent = desc;
            descEl.style.display = desc ? 'block' : 'none';

            tooltip.classList.add('visible');
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (tooltip.classList.contains('visible')) {
            const x = e.clientX + 12;
            const y = e.clientY + 12;

            // 화면 밖으로 나가지 않도록 조정
            const rect = tooltip.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width - 10;
            const maxY = window.innerHeight - rect.height - 10;

            tooltip.style.left = Math.min(x, maxX) + 'px';
            tooltip.style.top = Math.min(y, maxY) + 'px';
        }
    });

    document.addEventListener('mouseout', function(e) {
        const target = e.target.closest('[data-tooltip-name]');
        if (target) {
            tooltip.classList.remove('visible');
        }
    });
}

// 접힌 카테고리 상태 저장
function saveCollapsedState() {
    const collapsed = [];
    document.querySelectorAll('.category.collapsed').forEach(el => {
        collapsed.push(el.dataset.category);
    });
    localStorage.setItem('collapsedCategories', JSON.stringify(collapsed));
}

// 카테고리 순서 가져오기
function getCategoryOrder() {
    const saved = localStorage.getItem('categoryOrder');
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultCategoryOrder;
}

// 설정 모달 초기화
function initSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('open-settings');
    const closeBtn = document.getElementById('close-settings');
    const resetBtn = document.getElementById('reset-order');
    const saveBtn = document.getElementById('save-order');
    const orderList = document.getElementById('category-order-list');

    let tempOrder = [];

    // 모달 열기
    openBtn.addEventListener('click', function() {
        tempOrder = [...getCategoryOrder()];
        renderOrderList();
        modal.classList.add('visible');
    });

    // 모달 닫기
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('visible');
    });

    // 오버레이 클릭 시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('visible');
        }
    });

    // 초기화 버튼
    resetBtn.addEventListener('click', function() {
        tempOrder = [...defaultCategoryOrder];
        renderOrderList();
    });

    // 저장 버튼
    saveBtn.addEventListener('click', function() {
        localStorage.setItem('categoryOrder', JSON.stringify(tempOrder));
        modal.classList.remove('visible');
        // 페이지 새로고침하여 순서 적용
        location.reload();
    });

    // 순서 목록 렌더링
    function renderOrderList() {
        orderList.innerHTML = tempOrder.map((category, index) => `
            <div class="category-order-item" data-index="${index}">
                <span class="drag-handle">☰</span>
                <span class="category-name">${category}</span>
                <div class="order-buttons">
                    <button class="order-btn move-up" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="order-btn move-down" ${index === tempOrder.length - 1 ? 'disabled' : ''}>↓</button>
                </div>
            </div>
        `).join('');

        // 버튼 이벤트 바인딩
        orderList.querySelectorAll('.move-up').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.closest('.category-order-item');
                const index = parseInt(item.dataset.index);
                if (index > 0) {
                    [tempOrder[index], tempOrder[index - 1]] = [tempOrder[index - 1], tempOrder[index]];
                    renderOrderList();
                }
            });
        });

        orderList.querySelectorAll('.move-down').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.closest('.category-order-item');
                const index = parseInt(item.dataset.index);
                if (index < tempOrder.length - 1) {
                    [tempOrder[index], tempOrder[index + 1]] = [tempOrder[index + 1], tempOrder[index]];
                    renderOrderList();
                }
            });
        });
    }
}

// 도움말 모달 초기화
function initHelpModal() {
    const modal = document.getElementById('help-modal');
    const openBtn = document.getElementById('open-help');
    const closeBtn = document.getElementById('close-help');
    const closeHelpBtn = document.getElementById('close-help-btn');

    // 모달 열기
    openBtn.addEventListener('click', function() {
        modal.classList.add('visible');
    });

    // 모달 닫기
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('visible');
    });

    closeHelpBtn.addEventListener('click', function() {
        modal.classList.remove('visible');
    });

    // 오버레이 클릭 시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('visible');
        }
    });
}

// 변경 내역 모달 초기화
function initChangelogModal() {
    const modal = document.getElementById('changelog-modal');
    const openBtn = document.getElementById('open-changelog');
    const closeBtn = document.getElementById('close-changelog');
    const closeChangelogBtn = document.getElementById('close-changelog-btn');

    // 모달 열기
    openBtn.addEventListener('click', function() {
        modal.classList.add('visible');
    });

    // 모달 닫기
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('visible');
    });

    closeChangelogBtn.addEventListener('click', function() {
        modal.classList.remove('visible');
    });

    // 오버레이 클릭 시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('visible');
        }
    });
}

// 메인 바로가기 그리드 렌더링
function renderShortcuts() {
    const container = document.getElementById('shortcuts-container');
    if (!container) return;

    // 저장된 순서대로 카테고리 렌더링
    const categoryOrder = getCategoryOrder();

    for (const category of categoryOrder) {
        const shortcuts = shortcutsData[category];
        // 사이드바 카테고리나 존재하지 않는 카테고리는 제외
        if (!shortcuts || sidebarCategories.includes(category)) continue;

        // 정렬: important 우선, 이름 오름차순
        const sortedShortcuts = [...shortcuts].sort((a, b) => {
            if (a.important && !b.important) return -1;
            if (!a.important && b.important) return 1;
            return a.name.localeCompare(b.name, 'ko');
        });

        const categoryEl = document.createElement('div');
        categoryEl.className = 'category';
        categoryEl.dataset.category = category;

        // 저장된 접힘 상태 복원
        const collapsedCategories = JSON.parse(localStorage.getItem('collapsedCategories') || '[]');
        if (collapsedCategories.includes(category)) {
            categoryEl.classList.add('collapsed');
        }

        const colorClass = categoryColors[category] || 'color-blue';
        const headerEl = document.createElement('div');
        headerEl.className = `category-header ${colorClass}`;
        headerEl.innerHTML = `<h2>${category}</h2>`;

        // 헤더 클릭 시 접기/펼치기
        headerEl.addEventListener('click', function() {
            categoryEl.classList.toggle('collapsed');
            saveCollapsedState();
        });

        const gridEl = document.createElement('div');
        gridEl.className = 'shortcuts-grid';

        sortedShortcuts.forEach(shortcut => {
            if (shortcut.children && shortcut.children.length > 0) {
                const cardEl = document.createElement('div');
                cardEl.className = shortcut.important ? 'shortcut-card important has-children' : 'shortcut-card has-children';
                cardEl.dataset.parentUrl = shortcut.url;

                const childrenHtml = shortcut.children.map(child =>
                    `<a href="${child.url}" target="${getLinkTarget()}" rel="noopener noreferrer" class="child-link" data-tooltip-name="${child.name}" data-tooltip-desc="${child.description || ''}">
                        <div class="child-icon">${child.icon || '📄'}</div>
                        <div class="child-info">
                            <div class="child-name">${child.name}${getServiceBadge(child.url)}</div>
                            ${child.description ? `<div class="child-desc">${child.description}</div>` : ''}
                        </div>
                    </a>`
                ).join('');

                cardEl.dataset.tooltipName = shortcut.name;
                cardEl.dataset.tooltipDesc = shortcut.description || '';
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
                cardEl.dataset.tooltipName = shortcut.name;
                cardEl.dataset.tooltipDesc = shortcut.description || '';

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

// 사이드바 섹션 렌더링
function renderSidebarSection(categoryName, containerId) {
    const container = document.getElementById(containerId);
    const items = shortcutsData[categoryName];

    if (!container || !items || !Array.isArray(items)) return;

    items.forEach(item => {
        const cardEl = document.createElement('a');
        cardEl.className = 'sidebar-card';
        cardEl.href = item.url;
        cardEl.target = getLinkTarget();
        cardEl.rel = 'noopener noreferrer';
        cardEl.dataset.tooltipName = item.name;
        cardEl.dataset.tooltipDesc = item.description || '';

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
