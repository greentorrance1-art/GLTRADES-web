// GLTRADES - Trading Analytics Platform
// Main Application JavaScript

class GLTrades {
    constructor() {
        this.trades = [];
        this.playbooks = [];
        this.journalEntries = [];
        this.settings = {
            platformName: 'GLTRADES',
            currency: 'USD',
            brandColor: '#10b981',
            educationalContent: true,
            sampleData: true
        };
        this.charts = {};
        this.currentEditId = null;

        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
        this.renderAllTrades();
        this.renderPlaybooks();
        this.renderJournal();
    }

    // Data Management
    loadData() {
        const savedTrades = localStorage.getItem('gltrades_trades');
        const savedPlaybooks = localStorage.getItem('gltrades_playbooks');
        const savedJournal = localStorage.getItem('gltrades_journal');
        const savedSettings = localStorage.getItem('gltrades_settings');

        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        }

        if (savedTrades) {
            this.trades = JSON.parse(savedTrades);
        } else if (this.settings.sampleData) {
            this.trades = this.generateSampleTrades();
            this.saveData();
        }

        if (savedPlaybooks) {
            this.playbooks = JSON.parse(savedPlaybooks);
        } else if (this.settings.sampleData) {
            this.playbooks = this.generateSamplePlaybooks();
            this.saveData();
        }

        if (savedJournal) {
            this.journalEntries = JSON.parse(savedJournal);
        } else if (this.settings.sampleData) {
            this.journalEntries = this.generateSampleJournal();
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem('gltrades_trades', JSON.stringify(this.trades));
        localStorage.setItem('gltrades_playbooks', JSON.stringify(this.playbooks));
        localStorage.setItem('gltrades_journal', JSON.stringify(this.journalEntries));
        localStorage.setItem('gltrades_settings', JSON.stringify(this.settings));
    }

    generateSampleTrades() {
        const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'SPY', 'QQQ'];
        const strategies = ['Momentum', 'Mean Reversion', 'Breakout', 'Support/Resistance', 'Trend Following', 'Gap Fill'];
        const tags = ['earnings', 'breakout', 'pullback', 'reversal', 'news', 'technical', 'fundamental', 'scalp'];
        const trades = [];

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);

        for (let i = 0; i < 75; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const side = Math.random() > 0.5 ? 'long' : 'short';
            const quantity = Math.floor(Math.random() * 500) + 50;
            const entryPrice = Math.random() * 300 + 50;

            // 60% win rate
            const isWin = Math.random() < 0.6;
            const priceChange = isWin
                ? (Math.random() * 0.05 + 0.01)
                : -(Math.random() * 0.03 + 0.005);

            const exitPrice = side === 'long'
                ? entryPrice * (1 + priceChange)
                : entryPrice * (1 - priceChange);

            const stopLoss = side === 'long'
                ? entryPrice * 0.98
                : entryPrice * 1.02;

            const pl = side === 'long'
                ? (exitPrice - entryPrice) * quantity
                : (entryPrice - exitPrice) * quantity;

            const risk = Math.abs(entryPrice - stopLoss) * quantity;
            const rMultiple = risk > 0 ? pl / risk : 0;

            const tradeTags = [];
            const numTags = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numTags; j++) {
                const tag = tags[Math.floor(Math.random() * tags.length)];
                if (!tradeTags.includes(tag)) tradeTags.push(tag);
            }

            trades.push({
                id: Date.now() + i,
                date: date.toISOString().split('T')[0],
                symbol: symbol,
                side: side,
                quantity: quantity,
                entry: parseFloat(entryPrice.toFixed(2)),
                exit: parseFloat(exitPrice.toFixed(2)),
                stop: parseFloat(stopLoss.toFixed(2)),
                pl: parseFloat(pl.toFixed(2)),
                rMultiple: parseFloat(rMultiple.toFixed(2)),
                strategy: strategies[Math.floor(Math.random() * strategies.length)],
                tags: tradeTags,
                notes: `${isWin ? 'Good' : 'Learning'} trade on ${symbol}`
            });
        }

        return trades.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    generateSamplePlaybooks() {
        return [
            {
                id: Date.now() + 1,
                name: 'Momentum Breakout',
                description: 'Trade stocks breaking out of consolidation with strong volume.',
                entry: '- Stock breaks above resistance\n- Volume 2x average\n- RSI above 60\n- Price above 20 EMA',
                exit: '- Take profit at 2R\n- Trail stop with 20 EMA\n- Exit if volume dries up',
                risk: '- Risk 1% per trade\n- Stop below recent swing low\n- Position size based on ATR',
                trades: 28
            },
            {
                id: Date.now() + 2,
                name: 'Mean Reversion',
                description: 'Fade extended moves on quality stocks at key support levels.',
                entry: '- 2+ standard deviations from mean\n- Oversold on RSI (<30)\n- At major support level\n- Bullish divergence',
                exit: '- Target mean reversion\n- Exit 50% at 1R, rest at 2R\n- Stop if breaks support',
                risk: '- Risk 0.5-1% per trade\n- Tight stop below support\n- Scale in if confirmed',
                trades: 15
            },
            {
                id: Date.now() + 3,
                name: 'Gap Fill Strategy',
                description: 'Trade gap fills on earnings or news events.',
                entry: '- Gap up/down >3%\n- Wait for initial rush\n- Enter on pullback to gap\n- Confirm with volume',
                exit: '- Target gap fill (previous close)\n- Scale out at 50% and 75%\n- Trailing stop on remainder',
                risk: '- Risk 1-1.5% per trade\n- Stop at LOD/HOD\n- Reduce size on wide gaps',
                trades: 12
            }
        ];
    }

    generateSampleJournal() {
        return [
            {
                id: Date.now() + 1,
                date: new Date().toISOString().split('T')[0],
                title: 'Strong Trading Week',
                entry: 'This week was excellent. Stuck to my plan and avoided overtrading. The momentum breakout strategy continues to work well in this market environment. Need to work on taking profits too early - left money on the table on NVDA trade.',
                mood: 'excellent'
            },
            {
                id: Date.now() + 2,
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                title: 'Lesson in Patience',
                entry: 'Forced a trade on TSLA that was not part of my playbook. Lost money and broke my rules. The market will always be there - need to wait for A+ setups only. Going back to reviewing my playbooks before each session.',
                mood: 'frustrated'
            },
            {
                id: Date.now() + 3,
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                title: 'Risk Management Focus',
                entry: 'Focusing on position sizing this week. Realized I was risking too much on lower probability setups. Implemented new rule: only risk 1% on B setups, 1.5% on A setups. This should help smooth out the equity curve.',
                mood: 'good'
            }
        ];
    }

    // Metrics Calculations
    calculateMetrics() {
        if (this.trades.length === 0) {
            return {
                netPL: 0,
                winRate: 0,
                expectancy: 0,
                profitFactor: 0,
                maxDrawdown: 0,
                avgWinLoss: 0,
                totalTrades: 0,
                winningTrades: 0,
                losingTrades: 0,
                avgWin: 0,
                avgLoss: 0
            };
        }

        const netPL = this.trades.reduce((sum, trade) => sum + trade.pl, 0);
        const winningTrades = this.trades.filter(t => t.pl > 0);
        const losingTrades = this.trades.filter(t => t.pl < 0);

        const totalWins = winningTrades.reduce((sum, t) => sum + t.pl, 0);
        const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.pl, 0));

        const winRate = (winningTrades.length / this.trades.length) * 100;
        const avgWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
        const avgLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;

        const expectancy = (winRate / 100 * avgWin) - ((1 - winRate / 100) * avgLoss);
        const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? 999 : 0;
        const avgWinLoss = avgLoss > 0 ? avgWin / avgLoss : 0;

        // Calculate max drawdown
        let peak = 0;
        let maxDrawdown = 0;
        let runningPL = 0;

        const sortedTrades = [...this.trades].sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedTrades.forEach(trade => {
            runningPL += trade.pl;
            if (runningPL > peak) peak = runningPL;
            const drawdown = peak - runningPL;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        });

        return {
            netPL,
            winRate,
            expectancy,
            profitFactor,
            maxDrawdown,
            avgWinLoss,
            totalTrades: this.trades.length,
            winningTrades: winningTrades.length,
            losingTrades: losingTrades.length,
            avgWin,
            avgLoss
        };
    }

    formatCurrency(value) {
        const symbol = this.settings.currency === 'USD' ? '$' : this.settings.currency;
        const formatted = Math.abs(value).toFixed(2);
        return value >= 0 ? `${symbol}${formatted}` : `-${symbol}${formatted}`;
    }

    // Dashboard Rendering
    renderDashboard() {
        const metrics = this.calculateMetrics();

        // Update metric cards
        document.getElementById('metric-net-pl').textContent = this.formatCurrency(metrics.netPL);
        document.getElementById('metric-win-rate').textContent = `${metrics.winRate.toFixed(1)}%`;
        document.getElementById('metric-expectancy').textContent = this.formatCurrency(metrics.expectancy);
        document.getElementById('metric-profit-factor').textContent = metrics.profitFactor.toFixed(2);
        document.getElementById('metric-max-drawdown').textContent = this.formatCurrency(metrics.maxDrawdown);
        document.getElementById('metric-avg-win-loss').textContent = metrics.avgWinLoss.toFixed(2);

        // Add change indicators
        this.updateMetricChange('metric-net-pl-change', metrics.netPL);
        this.updateMetricChange('metric-win-rate-change', metrics.winRate - 50);

        // Render charts
        this.renderEquityChart();
        this.renderWinLossChart();

        // Render recent trades
        this.renderRecentTrades();
    }

    updateMetricChange(elementId, value) {
        const element = document.getElementById(elementId);
        if (value > 0) {
            element.textContent = 'â Positive';
            element.className = 'metric-change positive';
        } else if (value < 0) {
            element.textContent = 'â Negative';
            element.className = 'metric-change negative';
        } else {
            element.textContent = '';
        }
    }

    renderEquityChart() {
        const ctx = document.getElementById('equity-chart');

        // Sort trades by date
        const sortedTrades = [...this.trades].sort((a, b) => new Date(a.date) - new Date(b.date));

        let runningPL = 0;
        const equityData = sortedTrades.map(trade => {
            runningPL += trade.pl;
            return {
                date: trade.date,
                equity: runningPL
            };
        });

        if (this.charts.equity) {
            this.charts.equity.destroy();
        }

        this.charts.equity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: equityData.map(d => d.date),
                datasets: [{
                    label: 'Equity Curve',
                    data: equityData.map(d => d.equity),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    renderWinLossChart() {
        const ctx = document.getElementById('winloss-chart');
        const metrics = this.calculateMetrics();

        if (this.charts.winloss) {
            this.charts.winloss.destroy();
        }

        this.charts.winloss = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Winning Trades', 'Losing Trades'],
                datasets: [{
                    data: [metrics.winningTrades, metrics.losingTrades],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderRecentTrades() {
        const tbody = document.querySelector('#recent-trades-table tbody');
        const recentTrades = this.trades.slice(0, 10);

        tbody.innerHTML = recentTrades.map(trade => `
            <tr>
                <td>${trade.date}</td>
                <td><strong>${trade.symbol}</strong></td>
                <td>${trade.side.toUpperCase()}</td>
                <td>${trade.quantity}</td>
                <td>${this.formatCurrency(trade.entry)}</td>
                <td>${this.formatCurrency(trade.exit)}</td>
                <td class="${this.getPLClass(trade.pl)}">${this.formatCurrency(trade.pl)}</td>
                <td>${trade.strategy}</td>
            </tr>
        `).join('');
    }

    getPLClass(pl) {
        if (pl > 0) return 'trade-positive';
        if (pl < 0) return 'trade-negative';
        return 'trade-breakeven';
    }

    // Trades Page
    renderAllTrades() {
        const tbody = document.querySelector('#all-trades-table tbody');
        const searchTerm = document.getElementById('trade-search')?.value.toLowerCase() || '';
        const filter = document.getElementById('trade-filter')?.value || 'all';

        let filteredTrades = this.trades;

        // Apply search filter
        if (searchTerm) {
            filteredTrades = filteredTrades.filter(trade =>
                trade.symbol.toLowerCase().includes(searchTerm) ||
                trade.strategy.toLowerCase().includes(searchTerm) ||
                trade.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Apply type filter
        if (filter === 'winning') {
            filteredTrades = filteredTrades.filter(t => t.pl > 0);
        } else if (filter === 'losing') {
            filteredTrades = filteredTrades.filter(t => t.pl < 0);
        } else if (filter === 'breakeven') {
            filteredTrades = filteredTrades.filter(t => t.pl === 0);
        }

        tbody.innerHTML = filteredTrades.map(trade => `
            <tr>
                <td>${trade.date}</td>
                <td><strong>${trade.symbol}</strong></td>
                <td>${trade.side.toUpperCase()}</td>
                <td>${trade.quantity}</td>
                <td>${this.formatCurrency(trade.entry)}</td>
                <td>${this.formatCurrency(trade.exit)}</td>
                <td class="${this.getPLClass(trade.pl)}">${this.formatCurrency(trade.pl)}</td>
                <td>${trade.rMultiple.toFixed(2)}R</td>
                <td>${trade.strategy}</td>
                <td>${trade.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</td>
                <td>
                    <button class="btn btn-secondary action-btn" onclick="app.editTrade(${trade.id})">Edit</button>
                    <button class="btn btn-danger action-btn" onclick="app.deleteTrade(${trade.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Trade Management
    addTrade(tradeData) {
        const pl = tradeData.side === 'long'
            ? (tradeData.exit - tradeData.entry) * tradeData.quantity
            : (tradeData.entry - tradeData.exit) * tradeData.quantity;

        const risk = tradeData.stop ? Math.abs(tradeData.entry - tradeData.stop) * tradeData.quantity : 0;
        const rMultiple = risk > 0 ? pl / risk : 0;

        const trade = {
            id: Date.now(),
            ...tradeData,
            pl: parseFloat(pl.toFixed(2)),
            rMultiple: parseFloat(rMultiple.toFixed(2))
        };

        this.trades.unshift(trade);
        this.saveData();
        this.renderDashboard();
        this.renderAllTrades();
    }

    editTrade(id) {
        const trade = this.trades.find(t => t.id === id);
        if (!trade) return;

        this.currentEditId = id;

        // Populate form
        document.getElementById('trade-date').value = trade.date;
        document.getElementById('trade-symbol').value = trade.symbol;
        document.getElementById('trade-side').value = trade.side;
        document.getElementById('trade-quantity').value = trade.quantity;
        document.getElementById('trade-entry').value = trade.entry;
        document.getElementById('trade-exit').value = trade.exit;
        document.getElementById('trade-stop').value = trade.stop || '';
        document.getElementById('trade-strategy').value = trade.strategy;
        document.getElementById('trade-tags').value = trade.tags.join(', ');
        document.getElementById('trade-notes').value = trade.notes || '';

        document.getElementById('modal-title').textContent = 'Edit Trade';
        this.openModal('trade-modal');
    }

    updateTrade(id, tradeData) {
        const index = this.trades.findIndex(t => t.id === id);
        if (index === -1) return;

        const pl = tradeData.side === 'long'
            ? (tradeData.exit - tradeData.entry) * tradeData.quantity
            : (tradeData.entry - tradeData.exit) * tradeData.quantity;

        const risk = tradeData.stop ? Math.abs(tradeData.entry - tradeData.stop) * tradeData.quantity : 0;
        const rMultiple = risk > 0 ? pl / risk : 0;

        this.trades[index] = {
            ...this.trades[index],
            ...tradeData,
            pl: parseFloat(pl.toFixed(2)),
            rMultiple: parseFloat(rMultiple.toFixed(2))
        };

        this.saveData();
        this.renderDashboard();
        this.renderAllTrades();
    }

    deleteTrade(id) {
        if (!confirm('Are you sure you want to delete this trade?')) return;

        this.trades = this.trades.filter(t => t.id !== id);
        this.saveData();
        this.renderDashboard();
        this.renderAllTrades();
    }

    // Reports
    renderReport(type) {
        const ctx = document.getElementById('report-chart');
        const statsContainer = document.getElementById('report-stats');

        if (this.charts.report) {
            this.charts.report.destroy();
        }

        switch (type) {
            case 'drawdown':
                this.renderDrawdownReport(ctx, statsContainer);
                break;
            case 'risk_reward':
                this.renderRiskRewardReport(ctx, statsContainer);
                break;
            case 'tag_performance':
                this.renderTagPerformanceReport(ctx, statsContainer);
                break;
            case 'performance_time':
                this.renderPerformanceTimeReport(ctx, statsContainer);
                break;
            case 'day_of_week':
                this.renderDayOfWeekReport(ctx, statsContainer);
                break;
            case 'strategy_comparison':
                this.renderStrategyComparisonReport(ctx, statsContainer);
                break;
            case 'time_of_day':
                this.renderTimeOfDayReport(ctx, statsContainer);
                break;
        }
    }

    renderDrawdownReport(ctx, statsContainer) {
        const sortedTrades = [...this.trades].sort((a, b) => new Date(a.date) - new Date(b.date));

        let peak = 0;
        let runningPL = 0;
        const drawdownData = sortedTrades.map(trade => {
            runningPL += trade.pl;
            if (runningPL > peak) peak = runningPL;
            const drawdown = peak - runningPL;
            return {
                date: trade.date,
                drawdown: -drawdown
            };
        });

        this.charts.report = new Chart(ctx, {
            type: 'line',
            data: {
                labels: drawdownData.map(d => d.date),
                datasets: [{
                    label: 'Drawdown',
                    data: drawdownData.map(d => d.drawdown),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });

        const maxDD = Math.min(...drawdownData.map(d => d.drawdown));
        statsContainer.innerHTML = `
            <div class="report-stat">
                <div class="report-stat-label">Max Drawdown</div>
                <div class="report-stat-value">${this.formatCurrency(maxDD)}</div>
            </div>
            <div class="report-stat">
                <div class="report-stat-label">Current Drawdown</div>
                <div class="report-stat-value">${this.formatCurrency(drawdownData[drawdownData.length - 1].drawdown)}</div>
            </div>
        `;
    }

    renderRiskRewardReport(ctx, statsContainer) {
        const rMultiples = this.trades.map(t => t.rMultiple).filter(r => r !== 0);
        const bins = {};

        rMultiples.forEach(r => {
            const bin = Math.floor(r);
            bins[bin] = (bins[bin] || 0) + 1;
        });

        const labels = Object.keys(bins).sort((a, b) => a - b).map(k => `${k}R`);
        const data = Object.keys(bins).sort((a, b) => a - b).map(k => bins[k]);

        this.charts.report = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Trade Count',
                    data: data,
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        const avgR = rMultiples.reduce((sum, r) => sum + r, 0) / rMultiples.length;
        statsContainer.innerHTML = `
            <div class="report-stat">
                <div class="report-stat-label">Average R-Multiple</div>
                <div class="report-stat-value">${avgR.toFixed(2)}R</div>
            </div>
            <div class="report-stat">
                <div class="report-stat-label">Total Trades</div>
                <div class="report-stat-value">${rMultiples.length}</div>
            </div>
        `;
    }

    renderTagPerformanceReport(ctx, statsContainer) {
        const tagStats = {};

        this.trades.forEach(trade => {
            trade.tags.forEach(tag => {
                if (!tagStats[tag]) {
                    tagStats[tag] = { pl: 0, count: 0 };
                }
                tagStats[tag].pl += trade.pl;
                tagStats[tag].count += 1;
            });
        });

        const sortedTags = Object.entries(tagStats)
            .sort((a, b) => b[1].pl - a[1].pl)
            .slice(0, 10);

        this.charts.report = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedTags.map(([tag]) => tag),
                datasets: [{
                    label: 'P/L',
                    data: sortedTags.map(([, stats]) => stats.pl),
                    backgroundColor: sortedTags.map(([, stats]) => stats.pl > 0 ? '#10b981' : '#ef4444')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });

        const bestTag = sortedTags[0];
        const worstTag = sortedTags[sortedTags.length - 1];
        statsContainer.innerHTML = `
            <div class="report-stat">
                <div class="report-stat-label">Best Tag</div>
                <div class="report-stat-value">${bestTag[0]}: ${this.formatCurrency(bestTag[1].pl)}</div>
            </div>
            <div class="report-stat">
                <div class="report-stat-label">Worst Tag</div>
                <div class="report-stat-value">${worstTag[0]}: ${this.formatCurrency(worstTag[1].pl)}</div>
            </div>
        `;
    }

    renderPerformanceTimeReport(ctx, statsContainer) {
        const sortedTrades = [...this.trades].sort((a, b) => new Date(a.date) - new Date(b.date));

        const monthlyStats = {};
        sortedTrades.forEach(trade => {
            const month = trade.date.substring(0, 7);
            if (!monthlyStats[month]) {
                monthlyStats[month] = 0;
            }
            monthlyStats[month] += trade.pl;
        });

        const labels = Object.keys(monthlyStats).sort();
        const data = labels.map(month => monthlyStats[month]);

        this.charts.report = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly P/L',
                    data: data,
                    backgroundColor: data.map(pl => pl > 0 ? '#10b981' : '#ef4444')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });

        const bestMonth = labels[data.indexOf(Math.max(...data))];
        const worstMonth = labels[data.indexOf(Math.min(...data))];
        statsContainer.innerHTML = `
            <div class="report-stat">
                <div class="report-stat-label">Best Month</div>
                <div class="report-stat-value">${bestMonth}: ${this.formatCurrency(Math.max(...data))}</div>
            </div>
            <div class="report-stat">
                <div class="report-stat-label">Worst Month</div>
                <div class="report-stat-value">${worstMonth}: ${this.formatCurrency(Math.min(...data))}</div>
            </div>
        `;
    }

    renderDayOfWeekReport(ctx, statsContainer) {
        const dayStats = {
            'Monday': { pl: 0, count: 0 },
            'Tuesday': { pl: 0, count: 0 },
            'Wednesday': { pl: 0, count: 0 },
            'Thursday': { pl: 0, count: 0 },
            'Friday': { pl: 0, count: 0 }
        };

        this.trades.forEach(trade => {
            const day = new Date(trade.date).toLocaleDateString('en-US', { weekday: 'long' });
            if (dayStats[day]) {
                dayStats[day].pl += trade.pl;
                dayStats[day].count += 1;
            }
        });

        const labels = Object.keys(dayStats);
        const data = labels.map(day => dayStats[day].pl);
        const avgData = labels.map(day => dayStats[day].count > 0 ? dayStats[day].pl / dayStats[day].count : 0);

        this.charts.report = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total P/L',
                    data: data,
                    backgroundColor: '#10b981'
                }, {
                    label: 'Avg P/L',
                    data: avgData,
                    backgroundColor: '#34d399'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });

        const bestDay = labels[data.indexOf(Math.max(...data))];
        statsContainer.innerHTML = `
            <div class="report-stat">
                <div class="report-stat-label">Best Day</div>
                <div class="report-stat-value">${bestDay}</div>
            </div>
            <div class="report-stat">
                <div class="report-stat-label">Best Day P/L</div>
                <div class="report-stat-value">${this.formatCurrency(Math.max(...data))}</div>
            </div>
        `;
    }

    renderStrategyComparisonReport(ctx, statsContainer) {
        const strategyStats = {};

        this.trades.forEach(trade => {
            if (!strategyStats[trade.strategy]) {
                strategyStats[trade.strategy] = { pl: 0, count: 0, wins: 0 };
            }
            strategyStats[trade.strategy].pl += trade.pl;
            strategyStats[trade.strategy].count += 1;
            if (trade.pl > 0) strategyStats[trade.strategy].wins += 1;
        });

        const labels = Object.keys(strategyStats);
        const plData = labels.map(s => strategyStats[s].pl);
        const winRateData = labels.map(s => (strategyStats[s].wins / strategyStats[s].count) * 100);

        this.charts.report = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'P/L',
                    data: plData,
                    backgroundColor: '#10b981',
                    yAxisID: 'y'
                }, {
                    label: 'Win Rate %',
                    data: winRateData,
                    backgroundColor: '#34d399',
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: (value) => value + '%'
                        }
                    }
                }
            }
        });

        const bestStrategy = labels[plData.indexOf(Math.max(...plData))];
        statsContainer.innerHTML = `
            <div class="report-stat">
                <div class="report-stat-label">Best Strategy</div>
                <div class="report-stat-value">${bestStrategy}</div>
            </div>
            <div class="report-stat">
                <div class="report-stat-label">Strategy P/L</div>
                <div class="report-stat-value">${this.formatCurrency(Math.max(...plData))}</div>
            </div>
        `;
    }

    renderTimeOfDayReport(ctx, statsContainer) {
        // For demo purposes, showing distribution by hour blocks
        const timeStats = {
            'Pre-Market (4-9am)': { pl: 0, count: 0 },
            'Morning (9-12pm)': { pl: 0, count: 0 },
            'Afternoon (12-3pm)': { pl: 0, count: 0 },
            'Close (3-4pm)': { pl: 0, count: 0 }
        };

        // Randomly distribute trades across time blocks for demo
        this.trades.forEach(trade => {
            const timeBlocks = Object.keys(timeStats);
            const randomBlock = timeBlocks[Math.floor(Math.random() * timeBlocks.length)];
            timeStats[randomBlock].pl += trade.pl;
            timeStats[randomBlock].count += 1;
        });

        const labels = Object.keys(timeStats);
        const data = labels.map(time => timeStats[time].pl);
        const avgData = labels.map(time => timeStats[time].count > 0 ? timeStats[time].pl / timeStats[time].count : 0);

        this.charts.report = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total P/L',
                    data: data,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });

        const bestTime = labels[data.indexOf(Math.max(...data))];
        statsContainer.innerHTML = `
            <div class="report-stat">
                <div class="report-stat-label">Best Time Block</div>
                <div class="report-stat-value">${bestTime}</div>
            </div>
            <div class="report-stat">
                <div class="report-stat-label">P/L</div>
                <div class="report-stat-value">${this.formatCurrency(Math.max(...data))}</div>
            </div>
        `;
    }

    // Playbooks
    renderPlaybooks() {
        const container = document.getElementById('playbooks-grid');

        container.innerHTML = this.playbooks.map(playbook => `
            <div class="playbook-card">
                <h3>${playbook.name}</h3>
                <p>${playbook.description}</p>
                <div class="playbook-section">
                    <h4>Entry Criteria</h4>
                    <p>${playbook.entry.replace(/\n/g, '<br>')}</p>
                </div>
                <div class="playbook-section">
                    <h4>Exit Criteria</h4>
                    <p>${playbook.exit.replace(/\n/g, '<br>')}</p>
                </div>
                <div class="playbook-section">
                    <h4>Risk Management</h4>
                    <p>${playbook.risk.replace(/\n/g, '<br>')}</p>
                </div>
                <div class="playbook-actions">
                    <button class="btn btn-secondary action-btn" onclick="app.deletePlaybook(${playbook.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    addPlaybook(playbookData) {
        const playbook = {
            id: Date.now(),
            ...playbookData,
            trades: 0
        };

        this.playbooks.push(playbook);
        this.saveData();
        this.renderPlaybooks();
    }

    deletePlaybook(id) {
        if (!confirm('Are you sure you want to delete this playbook?')) return;

        this.playbooks = this.playbooks.filter(p => p.id !== id);
        this.saveData();
        this.renderPlaybooks();
    }

    // Journal
    renderJournal() {
        const container = document.getElementById('journal-entries');

        const sortedEntries = [...this.journalEntries].sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = sortedEntries.map(entry => `
            <div class="journal-card">
                <div class="journal-header">
                    <div>
                        <h3>${entry.title}</h3>
                        <div class="journal-date">${entry.date}</div>
                        <span class="journal-mood">${entry.mood}</span>
                    </div>
                    <button class="btn btn-danger action-btn" onclick="app.deleteJournal(${entry.id})">Delete</button>
                </div>
                <div class="journal-content">${entry.entry}</div>
            </div>
        `).join('');
    }

    addJournal(journalData) {
        const entry = {
            id: Date.now(),
            ...journalData
        };

        this.journalEntries.push(entry);
        this.saveData();
        this.renderJournal();
    }

    deleteJournal(id) {
        if (!confirm('Are you sure you want to delete this journal entry?')) return;

        this.journalEntries = this.journalEntries.filter(e => e.id !== id);
        this.saveData();
        this.renderJournal();
    }

    // Modal Management
    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        if (modalId === 'trade-modal') {
            this.currentEditId = null;
            document.getElementById('trade-form').reset();
            document.getElementById('modal-title').textContent = 'Add Trade';
        }
    }

    // Settings
    saveSettings() {
        this.settings = {
            platformName: document.getElementById('setting-platform-name').value,
            currency: document.getElementById('setting-currency').value,
            brandColor: document.getElementById('setting-brand-color').value,
            educationalContent: document.getElementById('setting-educational').checked,
            sampleData: document.getElementById('setting-sample-data').checked
        };

        this.saveData();
        alert('Settings saved successfully!');
        location.reload();
    }

    exportData() {
        const data = {
            trades: this.trades,
            playbooks: this.playbooks,
            journalEntries: this.journalEntries,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gltrades-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    }

    resetData() {
        if (!confirm('Are you sure you want to reset all data? This cannot be undone.')) return;

        localStorage.clear();
        location.reload();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;

                // Update active nav
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Show page
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById(`${page}-page`).classList.add('active');

                // Special handling for reports
                if (page === 'reports') {
                    this.renderReport('drawdown');
                }
            });
        });

        // Add Trade Buttons
        document.getElementById('add-trade-btn').addEventListener('click', () => {
            this.openModal('trade-modal');
            document.getElementById('trade-date').valueAsDate = new Date();
        });

        document.getElementById('add-trade-btn-2').addEventListener('click', () => {
            this.openModal('trade-modal');
            document.getElementById('trade-date').valueAsDate = new Date();
        });

        // Trade Form
        document.getElementById('trade-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const tradeData = {
                date: document.getElementById('trade-date').value,
                symbol: document.getElementById('trade-symbol').value.toUpperCase(),
                side: document.getElementById('trade-side').value,
                quantity: parseInt(document.getElementById('trade-quantity').value),
                entry: parseFloat(document.getElementById('trade-entry').value),
                exit: parseFloat(document.getElementById('trade-exit').value),
                stop: parseFloat(document.getElementById('trade-stop').value) || null,
                strategy: document.getElementById('trade-strategy').value,
                tags: document.getElementById('trade-tags').value.split(',').map(t => t.trim()).filter(t => t),
                notes: document.getElementById('trade-notes').value
            };

            if (this.currentEditId) {
                this.updateTrade(this.currentEditId, tradeData);
            } else {
                this.addTrade(tradeData);
            }

            this.closeModal('trade-modal');
        });

        // Modal Close Buttons
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal('trade-modal'));
        document.getElementById('cancel-trade-btn').addEventListener('click', () => this.closeModal('trade-modal'));

        // Trade Search and Filter
        document.getElementById('trade-search')?.addEventListener('input', () => this.renderAllTrades());
        document.getElementById('trade-filter')?.addEventListener('change', () => this.renderAllTrades());

        // Reports
        document.getElementById('report-type').addEventListener('change', (e) => {
            this.renderReport(e.target.value);
        });

        document.getElementById('export-report-btn').addEventListener('click', () => {
            alert('Report export functionality would be implemented here');
        });

        // Playbooks
        document.getElementById('add-playbook-btn').addEventListener('click', () => {
            this.openModal('playbook-modal');
        });

        document.getElementById('close-playbook-modal').addEventListener('click', () => {
            this.closeModal('playbook-modal');
        });

        document.getElementById('cancel-playbook-btn').addEventListener('click', () => {
            this.closeModal('playbook-modal');
        });

        document.getElementById('playbook-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const playbookData = {
                name: document.getElementById('playbook-name').value,
                description: document.getElementById('playbook-description').value,
                entry: document.getElementById('playbook-entry').value,
                exit: document.getElementById('playbook-exit').value,
                risk: document.getElementById('playbook-risk').value
            };

            this.addPlaybook(playbookData);
            this.closeModal('playbook-modal');
            document.getElementById('playbook-form').reset();
        });

        // Journal
        document.getElementById('add-journal-btn').addEventListener('click', () => {
            this.openModal('journal-modal');
            document.getElementById('journal-date').valueAsDate = new Date();
        });

        document.getElementById('close-journal-modal').addEventListener('click', () => {
            this.closeModal('journal-modal');
        });

        document.getElementById('cancel-journal-btn').addEventListener('click', () => {
            this.closeModal('journal-modal');
        });

        document.getElementById('journal-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const journalData = {
                date: document.getElementById('journal-date').value,
                title: document.getElementById('journal-title').value,
                entry: document.getElementById('journal-entry').value,
                mood: document.getElementById('journal-mood').value
            };

            this.addJournal(journalData);
            this.closeModal('journal-modal');
            document.getElementById('journal-form').reset();
        });

        // Settings
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('export-data-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('reset-data-btn').addEventListener('click', () => {
            this.resetData();
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                const modals = ['trade-modal', 'playbook-modal', 'journal-modal'];
                modals.forEach(modalId => {
                    if (e.target.id === modalId) {
                        this.closeModal(modalId);
                    }
                });
            }
        });
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new GLTrades();
});
