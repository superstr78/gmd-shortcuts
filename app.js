document.addEventListener('DOMContentLoaded', function() {
    renderShortcuts();
});

function renderShortcuts() {
    const container = document.getElementById('shortcuts-container');

    for (const [category, shortcuts] of Object.entries(shortcutsData)) {
        const categoryEl = document.createElement('div');
        categoryEl.className = 'category';

        const headerEl = document.createElement('div');
        headerEl.className = 'category-header';
        headerEl.innerHTML = `<h2>${category}</h2>`;

        const gridEl = document.createElement('div');
        gridEl.className = 'shortcuts-grid';

        shortcuts.forEach(shortcut => {
            if (shortcut.children && shortcut.children.length > 0) {
                const cardEl = document.createElement('div');
                cardEl.className = shortcut.important ? 'shortcut-card important has-children' : 'shortcut-card has-children';

                const childrenHtml = shortcut.children.map(child =>
                    `<a href="${child.url}" target="_blank" rel="noopener noreferrer" class="child-link">${child.name}</a>`
                ).join('');

                cardEl.innerHTML = `
                    <a href="${shortcut.url}" target="_blank" rel="noopener noreferrer" class="shortcut-main">
                        <div class="shortcut-icon">${shortcut.icon}</div>
                        <div class="shortcut-info">
                            <div class="shortcut-name">${shortcut.name}</div>
                            ${shortcut.description ? `<div class="shortcut-desc">${shortcut.description}</div>` : ''}
                        </div>
                    </a>
                    <div class="shortcut-children">
                        ${childrenHtml}
                    </div>
                `;

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
                        <div class="shortcut-name">${shortcut.name}</div>
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
