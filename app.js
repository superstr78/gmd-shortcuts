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
        });

        categoryEl.appendChild(headerEl);
        categoryEl.appendChild(gridEl);
        container.appendChild(categoryEl);
    }
}
