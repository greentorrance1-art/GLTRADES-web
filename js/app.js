document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.getElementById('page-content');

    // Page data and rendering logic
    const pages = {
        dashboard: '<h1>Dashboard</h1><p>Welcome to your Command Center.</p>',
        trades: '<h1>Trade Log</h1><p>Viewing your 75 pre-loaded trades.</p>',
        reports: '<h1>Analytics Reports</h1><p>7 detailed performance reports available.</p>',
        playbooks: '<h1>Playbooks</h1><p>Your strategy repository.</p>',
        journal: '<h1>Daily Journal</h1><p>Psychology and market notes.</p>',
        university: '<h1>GL University</h1><p>6 education modules enabled.</p>',
        settings: '<h1>Settings</h1><p>System configuration.</p>'
    };

    function loadPage(pageId) {
        contentArea.innerHTML = pages[pageId] || '<h1>404</h1><p>Page not found.</p>';
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('data-page') === pageId) link.classList.add('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            loadPage(pageId);
        });
    });

    // Default to dashboard
    loadPage('dashboard');
});
