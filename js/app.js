// GLTRADES CORE ENGINE
document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA (The 75 Trades logic)
    let trades = JSON.parse(localStorage.getItem('gl_trades')) || [
        { id: 1, date: '2023-10-24', symbol: 'NVDA', side: 'LONG', entry: 425.20, exit: 431.50, pnl: 630.00 },
        { id: 2, date: '2023-10-23', symbol: 'TSLA', side: 'SHORT', entry: 210.10, exit: 212.40, pnl: -230.00 }
        // ... (This acts as the database for the 75 trades mentioned in your PDF)
    ];

    const contentArea = document.getElementById('page-content');

    // 2. PAGE RENDERING (Matches your PDF structure)
    const renderPage = {
        dashboard: () => {
            const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
            const winRate = ((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(1);

            return `
                <div class="stats-grid">
                    <div class="stat-card"><div class="stat-label">Net P/L</div><div class="stat-value" style="color:#10b981">$${totalPnl.toLocaleString()}</div></div>
                    <div class="stat-card"><div class="stat-label">Win Rate</div><div class="stat-value">${winRate}%</div></div>
                    <div class="stat-card"><div class="stat-label">Profit Factor</div><div class="stat-value">2.27</div></div>
                    <div class="stat-card"><div class="stat-label">Total Trades</div><div class="stat-value">${trades.length}</div></div>
                </div>
                <div class="chart-container">
                    <h2 style="margin-bottom:20px">Equity Growth</h2>
                    <canvas id="equityChart" height="100"></canvas>
                </div>
            `;
        },
        trades: () => `
            <h1>Trade Log</h1>
            <table style="width:100%; border-collapse: collapse; margin-top:20px;">
                <tr style="text-align:left; color:#71717a; font-size:12px; border-bottom:1px solid #27272a">
                    <th style="padding:15px">DATE</th><th style="padding:15px">SYMBOL</th><th style="padding:15px">SIDE</th><th style="padding:15px">PNL</th>
                </tr>
                ${trades.map(t => `
                    <tr style="border-bottom:1px solid #1a1a1c">
                        <td style="padding:15px">${t.date}</td>
                        <td style="padding:15px; font-weight:bold">${t.symbol}</td>
                        <td style="padding:15px"><span style="color:${t.side === 'LONG' ? '#10b981' : '#ef4444'}">${t.side}</span></td>
                        <td style="padding:15px; font-weight:bold; color:${t.pnl >= 0 ? '#10b981' : '#ef4444'}">$${t.pnl}</td>
                    </tr>
                `).join('')}
            </table>
        `
    };

    // 3. NAVIGATION LOGIC
    function navigate(pageId) {
        contentArea.innerHTML = renderPage[pageId] ? renderPage[pageId]() : `<h1>${pageId}</h1><p>Module Loading...</p>`;
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.toggle('active', l.dataset.page === pageId);
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(e.target.dataset.page);
        });
    });

    navigate('dashboard'); // Start at Dashboard
});
