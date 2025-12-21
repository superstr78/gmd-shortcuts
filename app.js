document.addEventListener('DOMContentLoaded', function() {
    initSettings();
    initTooltip();
    initSettingsModal();
    initHelpModal();
    initChangelogModal();
    initEditMode();
    initEditModal();
    initChildEditModal();
    initResetModal();
    renderShortcuts();
    renderSidebarSection('사무 업무', 'office-work');
    renderSidebarSection('팀 공간', 'team-spaces');
});

// 편집 모드 상태
let isEditMode = false;

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
    // 다크 모드 토글 (기본값: true)
    const darkModeToggle = document.getElementById('dark-mode');
    if (darkModeToggle) {
        const savedDarkMode = localStorage.getItem('darkMode');
        // 저장된 값이 없으면 기본값 true (다크 모드)
        if (savedDarkMode === null) {
            localStorage.setItem('darkMode', 'true');
        } else {
            darkModeToggle.checked = savedDarkMode === 'true';
            // 라이트 모드일 때 light-mode 클래스 추가
            document.body.classList.toggle('light-mode', savedDarkMode !== 'true');
        }
        darkModeToggle.addEventListener('change', function() {
            localStorage.setItem('darkMode', this.checked);
            document.body.classList.toggle('light-mode', !this.checked);
        });
    }

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
    const resetDataBtn = document.getElementById('open-reset-data');
    const orderList = document.getElementById('category-order-list');

    let tempOrder = [];

    // 모달 열기
    openBtn.addEventListener('click', function() {
        tempOrder = [...getCategoryOrder()];
        renderOrderList();
        modal.classList.add('visible');
    });

    // 데이터 초기화 버튼 클릭
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', function() {
            modal.classList.remove('visible');
            openResetModal();
        });
    }

    // 내보내기 버튼
    const exportBtn = document.getElementById('export-data');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }

    // 가져오기 버튼
    const importBtn = document.getElementById('import-data');
    const importFile = document.getElementById('import-file');
    if (importBtn && importFile) {
        importBtn.addEventListener('click', function() {
            importFile.click();
        });
        importFile.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                importData(e.target.files[0]);
                e.target.value = ''; // 같은 파일 다시 선택 가능하도록
            }
        });
    }

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
        // 로컬 데이터와 병합된 데이터 사용
        const shortcuts = getMergedShortcuts(category);
        // 사이드바 카테고리나 존재하지 않는 카테고리는 제외
        if (!shortcuts || shortcuts.length === 0 || sidebarCategories.includes(category)) continue;

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

                // 자식 바로가기 HTML 생성
                const childrenHtml = shortcut.children.map((child, childIndex) => {
                    const childEditBtn = isEditMode ? `<button class="child-edit-btn" data-child-index="${childIndex}">✏️</button>` : '';
                    const tagName = isEditMode ? 'div' : 'a';
                    const linkAttrs = isEditMode ? '' : `href="${child.url}" target="${getLinkTarget()}" rel="noopener noreferrer"`;
                    return `<${tagName} ${linkAttrs} class="child-link" data-tooltip-name="${child.name}" data-tooltip-desc="${child.description || ''}">
                        ${childEditBtn}
                        <div class="child-icon">${child.icon || '📄'}</div>
                        <div class="child-info">
                            <div class="child-name">${child.name}${getServiceBadge(child.url)}</div>
                            ${child.description ? `<div class="child-desc">${child.description}</div>` : ''}
                        </div>
                    </${tagName}>`;
                }).join('');

                // 자식 추가 버튼 HTML
                const addChildBtnHtml = isEditMode ? `<button class="child-link child-add-btn"><div class="child-icon">➕</div><div class="child-info"><div class="child-name">추가</div></div></button>` : '';

                // 부모 편집 버튼 HTML (이름 옆에 인라인으로 배치)
                const parentEditBtnHtml = isEditMode ? `<button class="parent-edit-btn" data-category="${category}" data-name="${shortcut.name}">✏️</button>` : '';

                cardEl.dataset.tooltipName = shortcut.name;
                cardEl.dataset.tooltipDesc = shortcut.description || '';
                cardEl.innerHTML = `
                    <div class="shortcut-main">
                        <div class="shortcut-icon">${shortcut.icon}</div>
                        <div class="shortcut-info">
                            <div class="shortcut-name">${shortcut.name}${getServiceBadge(shortcut.url)}${parentEditBtnHtml}</div>
                            ${shortcut.description ? `<div class="shortcut-desc">${shortcut.description}</div>` : ''}
                        </div>
                    </div>
                    <div class="shortcut-children">
                        ${childrenHtml}
                        ${addChildBtnHtml}
                    </div>
                `;

                // 편집 버튼 이벤트 (부모)
                const parentEditBtn = cardEl.querySelector('.parent-edit-btn');
                if (parentEditBtn) {
                    parentEditBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        openEditModal(category, shortcut);
                    });
                }

                // 자식 편집 버튼 이벤트
                cardEl.querySelectorAll('.child-edit-btn').forEach((btn, index) => {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        openChildEditModal(category, shortcut.name, shortcut.children[index], index);
                    });
                });

                // 자식 추가 버튼 이벤트
                const addChildBtn = cardEl.querySelector('.child-add-btn');
                if (addChildBtn) {
                    addChildBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        openChildEditModal(category, shortcut.name, null, -1);
                    });
                }

                cardEl.addEventListener('click', function(e) {
                    if (!e.target.closest('.child-link') && !e.target.closest('.parent-edit-btn') && !e.target.closest('.child-edit-btn') && !e.target.closest('.child-add-btn')) {
                        if (isEditMode) return; // 편집 모드에서는 링크 이동 안함
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
                const cardEl = document.createElement(isEditMode ? 'div' : 'a');
                cardEl.className = shortcut.important ? 'shortcut-card important' : 'shortcut-card';
                if (!isEditMode) {
                    cardEl.href = shortcut.url;
                    cardEl.target = getLinkTarget();
                    cardEl.rel = 'noopener noreferrer';
                }
                cardEl.dataset.tooltipName = shortcut.name;
                cardEl.dataset.tooltipDesc = shortcut.description || '';

                // 편집 버튼 HTML
                const editBtnHtml = isEditMode ? `<button class="edit-btn" data-category="${category}" data-name="${shortcut.name}">✏️</button>` : '';

                cardEl.innerHTML = `
                    ${editBtnHtml}
                    <div class="shortcut-icon">${shortcut.icon}</div>
                    <div class="shortcut-info">
                        <div class="shortcut-name">${shortcut.name}${getServiceBadge(shortcut.url)}</div>
                        ${shortcut.description ? `<div class="shortcut-desc">${shortcut.description}</div>` : ''}
                    </div>
                `;

                // 편집 버튼 이벤트
                const editBtn = cardEl.querySelector('.edit-btn');
                if (editBtn) {
                    editBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        openEditModal(category, shortcut);
                    });
                }

                gridEl.appendChild(cardEl);
            }
        });

        // 편집 모드에서 "추가" 버튼 표시
        if (isEditMode) {
            const addBtn = document.createElement('button');
            addBtn.className = 'shortcut-card add-shortcut-btn';
            addBtn.innerHTML = `
                <div class="add-icon">➕</div>
                <div class="add-text">바로가기 추가</div>
            `;
            addBtn.addEventListener('click', function() {
                openEditModal(category, null);
            });
            gridEl.appendChild(addBtn);
        }

        categoryEl.appendChild(headerEl);
        categoryEl.appendChild(gridEl);
        container.appendChild(categoryEl);
    }
}

// 사이드바 섹션 렌더링
function renderSidebarSection(categoryName, containerId) {
    const container = document.getElementById(containerId);
    const items = getMergedShortcuts(categoryName);

    if (!container || !items || !Array.isArray(items)) return;

    items.forEach(item => {
        const cardEl = document.createElement(isEditMode ? 'div' : 'a');
        cardEl.className = 'sidebar-card';
        if (!isEditMode) {
            cardEl.href = item.url;
            cardEl.target = getLinkTarget();
            cardEl.rel = 'noopener noreferrer';
        }
        cardEl.dataset.tooltipName = item.name;
        cardEl.dataset.tooltipDesc = item.description || '';

        // 편집 버튼 HTML
        const editBtnHtml = isEditMode ? `<button class="sidebar-edit-btn" data-category="${categoryName}" data-name="${item.name}">✏️</button>` : '';

        cardEl.innerHTML = `
            ${editBtnHtml}
            <div class="sidebar-icon">${item.icon}</div>
            <div class="sidebar-info">
                <div class="sidebar-name">${item.name}${getServiceBadge(item.url)}</div>
                <div class="sidebar-desc">${item.description}</div>
            </div>
        `;

        // 편집 버튼 이벤트
        const editBtn = cardEl.querySelector('.sidebar-edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openEditModal(categoryName, item);
            });
        }

        container.appendChild(cardEl);
    });

    // 편집 모드에서 "추가" 버튼 표시
    if (isEditMode) {
        const addBtn = document.createElement('button');
        addBtn.className = 'sidebar-card sidebar-add-btn';
        addBtn.innerHTML = `
            <div class="sidebar-icon add-icon">➕</div>
            <div class="sidebar-info">
                <div class="sidebar-name">바로가기 추가</div>
            </div>
        `;
        addBtn.addEventListener('click', function() {
            openEditModal(categoryName, null);
        });
        container.appendChild(addBtn);
    }
}

// ==================== 로컬 데이터 관리 ====================

// 로컬 저장소에서 사용자 편집 데이터 가져오기
function getCustomShortcuts() {
    const saved = localStorage.getItem('customShortcuts');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return {};
        }
    }
    return {};
}

// 로컬 저장소에 사용자 편집 데이터 저장
function saveCustomShortcuts(data) {
    localStorage.setItem('customShortcuts', JSON.stringify(data));
}

// 기본 데이터와 사용자 편집 데이터 병합
function getMergedShortcuts(category) {
    const baseData = shortcutsData[category] || [];
    const customData = getCustomShortcuts()[category] || {};
    const modified = customData.modified || {};
    const hidden = customData.hidden || [];
    const added = customData.added || [];
    const childModified = customData.childModified || {};

    // 기본 데이터에서 숨겨진 항목 제외하고 수정된 항목 적용
    const mergedBase = baseData
        .filter(item => !hidden.includes(item.name))
        .map(item => {
            let mergedItem = { ...item };

            // 부모 수정 사항 적용
            if (modified[item.name]) {
                mergedItem = { ...mergedItem, ...modified[item.name] };
            }

            // 자식 수정 사항 적용
            if (item.children && childModified[item.name]) {
                const childMods = childModified[item.name];
                const childHidden = childMods.hidden || [];
                const childModifiedData = childMods.modified || {};
                const childAdded = childMods.added || [];

                // 기본 자식에서 숨겨진 것 제외, 수정된 것 적용
                const mergedChildren = item.children
                    .map((child, index) => {
                        if (childHidden.includes(index)) return null;
                        if (childModifiedData[index]) {
                            return { ...child, ...childModifiedData[index] };
                        }
                        return child;
                    })
                    .filter(child => child !== null);

                // 추가된 자식 병합
                mergedItem.children = [...mergedChildren, ...childAdded];
            }

            return mergedItem;
        });

    // 추가된 항목 병합
    return [...mergedBase, ...added];
}

// 바로가기 수정
function modifyShortcut(category, originalName, newData) {
    const customData = getCustomShortcuts();
    if (!customData[category]) {
        customData[category] = { modified: {}, hidden: [], added: [] };
    }

    // 추가된 항목인지 확인
    const addedIndex = customData[category].added.findIndex(item => item.name === originalName);
    if (addedIndex !== -1) {
        // 추가된 항목 수정
        customData[category].added[addedIndex] = { ...customData[category].added[addedIndex], ...newData };
    } else {
        // 기본 데이터 수정
        customData[category].modified[originalName] = newData;
    }

    saveCustomShortcuts(customData);
}

// 바로가기 추가
function addShortcut(category, shortcutData) {
    const customData = getCustomShortcuts();
    if (!customData[category]) {
        customData[category] = { modified: {}, hidden: [], added: [] };
    }

    customData[category].added.push(shortcutData);
    saveCustomShortcuts(customData);
}

// 바로가기 삭제 (숨김 처리)
function deleteShortcut(category, name) {
    const customData = getCustomShortcuts();
    if (!customData[category]) {
        customData[category] = { modified: {}, hidden: [], added: [] };
    }

    // 추가된 항목인지 확인
    const addedIndex = customData[category].added.findIndex(item => item.name === name);
    if (addedIndex !== -1) {
        // 추가된 항목은 완전히 삭제
        customData[category].added.splice(addedIndex, 1);
    } else {
        // 기본 데이터는 숨김 처리
        if (!customData[category].hidden.includes(name)) {
            customData[category].hidden.push(name);
        }
        // 수정 데이터도 삭제
        delete customData[category].modified[name];
    }

    saveCustomShortcuts(customData);
}

// 모든 사용자 편집 데이터 초기화
function resetAllCustomData() {
    localStorage.removeItem('customShortcuts');
}

// ==================== 편집 모드 ====================

// 편집 모드 초기화
function initEditMode() {
    const toggleBtn = document.getElementById('toggle-edit-mode');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function() {
        isEditMode = !isEditMode;
        document.body.classList.toggle('edit-mode', isEditMode);
        toggleBtn.classList.toggle('active', isEditMode);

        // 편집 모드 전환 시 페이지 다시 렌더링
        rerenderAll();
    });
}

// 전체 다시 렌더링
function rerenderAll() {
    // 메인 컨테이너 비우기
    const shortcutsContainer = document.getElementById('shortcuts-container');
    if (shortcutsContainer) {
        shortcutsContainer.innerHTML = '';
    }

    // 사이드바 비우기
    const officeWork = document.getElementById('office-work');
    const teamSpaces = document.getElementById('team-spaces');
    if (officeWork) officeWork.innerHTML = '';
    if (teamSpaces) teamSpaces.innerHTML = '';

    // 다시 렌더링
    renderShortcuts();
    renderSidebarSection('사무 업무', 'office-work');
    renderSidebarSection('팀 공간', 'team-spaces');
}

// ==================== 편집 모달 ====================

function initEditModal() {
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('close-edit');
    const cancelBtn = document.getElementById('cancel-edit');
    const deleteBtn = document.getElementById('delete-shortcut');
    const form = document.getElementById('edit-form');

    if (!modal) return;

    // 모달 닫기
    const closeModal = () => modal.classList.remove('visible');

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // 삭제 버튼
    deleteBtn.addEventListener('click', function() {
        const category = document.getElementById('edit-category').value;
        const originalName = document.getElementById('edit-original-name').value;
        const isNew = document.getElementById('edit-is-new').value === 'true';

        if (isNew) {
            // 새로 추가 중인 항목은 그냥 닫기
            closeModal();
            return;
        }

        if (confirm('이 바로가기를 삭제하시겠습니까?')) {
            deleteShortcut(category, originalName);
            closeModal();
            rerenderAll();
        }
    });

    // 폼 제출
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const category = document.getElementById('edit-category').value;
        const originalName = document.getElementById('edit-original-name').value;
        const isNew = document.getElementById('edit-is-new').value === 'true';

        const newData = {
            name: document.getElementById('edit-name').value.trim(),
            url: document.getElementById('edit-url').value.trim(),
            icon: document.getElementById('edit-icon').value.trim() || '📄',
            description: document.getElementById('edit-description').value.trim(),
            important: document.getElementById('edit-important').checked
        };

        if (isNew) {
            addShortcut(category, newData);
        } else {
            modifyShortcut(category, originalName, newData);
        }

        closeModal();
        rerenderAll();
    });
}

// 편집 모달 열기
function openEditModal(category, shortcut = null) {
    const modal = document.getElementById('edit-modal');
    const title = document.getElementById('edit-modal-title');
    const deleteBtn = document.getElementById('delete-shortcut');

    const isNew = !shortcut;

    document.getElementById('edit-category').value = category;
    document.getElementById('edit-original-name').value = shortcut ? shortcut.name : '';
    document.getElementById('edit-is-new').value = isNew ? 'true' : 'false';

    document.getElementById('edit-name').value = shortcut ? shortcut.name : '';
    document.getElementById('edit-url').value = shortcut ? shortcut.url : '';
    document.getElementById('edit-icon').value = shortcut ? (shortcut.icon.startsWith('<img') ? '' : shortcut.icon) : '';
    document.getElementById('edit-description').value = shortcut ? (shortcut.description || '') : '';
    document.getElementById('edit-important').checked = shortcut ? shortcut.important : false;

    title.textContent = isNew ? '➕ 바로가기 추가' : '✏️ 바로가기 편집';
    deleteBtn.style.display = isNew ? 'none' : 'block';

    modal.classList.add('visible');
}

// ==================== 초기화 모달 ====================

function initResetModal() {
    const modal = document.getElementById('reset-modal');
    const closeBtn = document.getElementById('close-reset');
    const cancelBtn = document.getElementById('cancel-reset');
    const confirmBtn = document.getElementById('confirm-reset');

    if (!modal) return;

    const closeModal = () => modal.classList.remove('visible');

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    confirmBtn.addEventListener('click', function() {
        resetAllCustomData();
        closeModal();
        rerenderAll();
    });
}

// 초기화 모달 열기
function openResetModal() {
    const modal = document.getElementById('reset-modal');
    if (modal) modal.classList.add('visible');
}

// ==================== 자식 편집 모달 ====================

function initChildEditModal() {
    const modal = document.getElementById('child-edit-modal');
    const closeBtn = document.getElementById('close-child-edit');
    const cancelBtn = document.getElementById('cancel-child-edit');
    const deleteBtn = document.getElementById('delete-child-shortcut');
    const form = document.getElementById('child-edit-form');

    if (!modal) return;

    const closeModal = () => modal.classList.remove('visible');

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // 삭제 버튼
    deleteBtn.addEventListener('click', function() {
        const category = document.getElementById('child-edit-category').value;
        const parentName = document.getElementById('child-edit-parent-name').value;
        const childIndex = parseInt(document.getElementById('child-edit-index').value);
        const isNew = document.getElementById('child-edit-is-new').value === 'true';

        if (isNew) {
            closeModal();
            return;
        }

        if (confirm('이 자식 바로가기를 삭제하시겠습니까?')) {
            deleteChildShortcut(category, parentName, childIndex);
            closeModal();
            rerenderAll();
        }
    });

    // 폼 제출
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const category = document.getElementById('child-edit-category').value;
        const parentName = document.getElementById('child-edit-parent-name').value;
        const childIndex = parseInt(document.getElementById('child-edit-index').value);
        const isNew = document.getElementById('child-edit-is-new').value === 'true';

        const newData = {
            name: document.getElementById('child-edit-name').value.trim(),
            url: document.getElementById('child-edit-url').value.trim(),
            icon: document.getElementById('child-edit-icon').value.trim() || '📄',
            description: document.getElementById('child-edit-description').value.trim()
        };

        if (isNew) {
            addChildShortcut(category, parentName, newData);
        } else {
            modifyChildShortcut(category, parentName, childIndex, newData);
        }

        closeModal();
        rerenderAll();
    });
}

// 자식 편집 모달 열기
function openChildEditModal(category, parentName, child = null, childIndex = -1) {
    const modal = document.getElementById('child-edit-modal');
    const title = document.getElementById('child-edit-modal-title');
    const deleteBtn = document.getElementById('delete-child-shortcut');

    const isNew = !child;

    document.getElementById('child-edit-category').value = category;
    document.getElementById('child-edit-parent-name').value = parentName;
    document.getElementById('child-edit-index').value = childIndex;
    document.getElementById('child-edit-is-new').value = isNew ? 'true' : 'false';

    document.getElementById('child-edit-name').value = child ? child.name : '';
    document.getElementById('child-edit-url').value = child ? child.url : '';
    document.getElementById('child-edit-icon').value = child ? (child.icon || '') : '';
    document.getElementById('child-edit-description').value = child ? (child.description || '') : '';

    title.textContent = isNew ? '➕ 자식 바로가기 추가' : '✏️ 자식 바로가기 편집';
    deleteBtn.style.display = isNew ? 'none' : 'block';

    modal.classList.add('visible');
}

// ==================== 자식 바로가기 데이터 관리 ====================

// 자식 바로가기 수정
function modifyChildShortcut(category, parentName, childIndex, newData) {
    const customData = getCustomShortcuts();
    if (!customData[category]) {
        customData[category] = { modified: {}, hidden: [], added: [], childModified: {} };
    }
    if (!customData[category].childModified) {
        customData[category].childModified = {};
    }
    if (!customData[category].childModified[parentName]) {
        customData[category].childModified[parentName] = { modified: {}, hidden: [], added: [] };
    }

    customData[category].childModified[parentName].modified[childIndex] = newData;
    saveCustomShortcuts(customData);
}

// 자식 바로가기 추가
function addChildShortcut(category, parentName, childData) {
    const customData = getCustomShortcuts();
    if (!customData[category]) {
        customData[category] = { modified: {}, hidden: [], added: [], childModified: {} };
    }
    if (!customData[category].childModified) {
        customData[category].childModified = {};
    }
    if (!customData[category].childModified[parentName]) {
        customData[category].childModified[parentName] = { modified: {}, hidden: [], added: [] };
    }

    customData[category].childModified[parentName].added.push(childData);
    saveCustomShortcuts(customData);
}

// 자식 바로가기 삭제
function deleteChildShortcut(category, parentName, childIndex) {
    const customData = getCustomShortcuts();
    if (!customData[category]) {
        customData[category] = { modified: {}, hidden: [], added: [], childModified: {} };
    }
    if (!customData[category].childModified) {
        customData[category].childModified = {};
    }
    if (!customData[category].childModified[parentName]) {
        customData[category].childModified[parentName] = { modified: {}, hidden: [], added: [] };
    }

    // 추가된 자식인지 확인 (기본 자식 수 이상의 인덱스면 추가된 것)
    const baseShortcuts = shortcutsData[category] || [];
    const parentShortcut = baseShortcuts.find(s => s.name === parentName);
    const baseChildCount = parentShortcut && parentShortcut.children ? parentShortcut.children.length : 0;

    if (childIndex >= baseChildCount) {
        // 추가된 자식 삭제
        const addedIndex = childIndex - baseChildCount;
        customData[category].childModified[parentName].added.splice(addedIndex, 1);
    } else {
        // 기본 자식 숨김
        if (!customData[category].childModified[parentName].hidden.includes(childIndex)) {
            customData[category].childModified[parentName].hidden.push(childIndex);
        }
        // 수정 데이터도 삭제
        delete customData[category].childModified[parentName].modified[childIndex];
    }

    saveCustomShortcuts(customData);
}

// ==================== 내보내기/가져오기 ====================

// 데이터 내보내기
function exportData() {
    const customShortcuts = getCustomShortcuts();
    const categoryOrder = localStorage.getItem('categoryOrder');
    const collapsedCategories = localStorage.getItem('collapsedCategories');

    const exportObj = {
        version: '1.7',
        exportDate: new Date().toISOString(),
        customShortcuts: customShortcuts,
        categoryOrder: categoryOrder ? JSON.parse(categoryOrder) : null,
        collapsedCategories: collapsedCategories ? JSON.parse(collapsedCategories) : null
    };

    const dataStr = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `gmd-shortcuts-backup-${date}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('데이터를 내보냈습니다: ' + filename);
}

// 데이터 가져오기
function importData(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importObj = JSON.parse(e.target.result);

            // 유효성 검사
            if (!importObj.customShortcuts && !importObj.categoryOrder) {
                alert('유효하지 않은 백업 파일입니다.');
                return;
            }

            if (confirm('기존 데이터를 덮어쓰시겠습니까?\n\n취소를 선택하면 가져오기를 중단합니다.')) {
                // 데이터 복원
                if (importObj.customShortcuts) {
                    localStorage.setItem('customShortcuts', JSON.stringify(importObj.customShortcuts));
                }
                if (importObj.categoryOrder) {
                    localStorage.setItem('categoryOrder', JSON.stringify(importObj.categoryOrder));
                }
                if (importObj.collapsedCategories) {
                    localStorage.setItem('collapsedCategories', JSON.stringify(importObj.collapsedCategories));
                }

                alert('데이터를 가져왔습니다. 페이지를 새로고침합니다.');
                location.reload();
            }
        } catch (error) {
            alert('파일을 읽는 중 오류가 발생했습니다: ' + error.message);
        }
    };

    reader.onerror = function() {
        alert('파일을 읽을 수 없습니다.');
    };

    reader.readAsText(file);
}
