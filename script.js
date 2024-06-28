document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const transactionsList = document.getElementById('transactions-list');
    const categoryChartCanvas = document.getElementById('categoryChart').getContext('2d');
    const transactionsChartCanvas = document.getElementById('transactionsChart').getContext('2d');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let categoryChart;
    let transactionsChart;

    function addTransaction(e) {
        e.preventDefault();
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;

        const transaction = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
            category
        };

        transactions.push(transaction);
        updateLocalStorage();
        renderTransactions();
        renderCharts();
        transactionForm.reset();
    }

    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function renderTransactions() {
        transactionsList.innerHTML = '';
        transactions.forEach(transaction => {
            const transactionItem = document.createElement('li');
            transactionItem.classList.add(transaction.category);
            transactionItem.innerHTML = `
                <span>${transaction.description}</span>
                <span>${transaction.amount.toFixed(2)}</span>
                <button onclick="removeTransaction(${transaction.id})">X</button>
            `;
            transactionsList.appendChild(transactionItem);
        });
    }

    window.removeTransaction = function (id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        renderTransactions();
        renderCharts();
    };


    function renderCharts() {
        if (categoryChart) {
            categoryChart.destroy();
        }
        if (transactionsChart) {
            transactionsChart.destroy();
        }

        const categories = ['salary', 'food', 'transport', 'entertainment', 'others'];
        const categoryTotals = categories.map(category => {
            return transactions
                .filter(transaction => transaction.category === category)
                .reduce((sum, transaction) => sum + transaction.amount, 0);
        });

        categoryChart = new Chart(categoryChartCanvas, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Spending by Category',
                    data: categoryTotals,
                    backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0'],
                    borderWidth: 1,
                    hoverBackgroundColor: ['#388e3c', '#f57c00', '#d32f2f', '#1976d2', '#7b1fa2']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#333',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleFont: {
                            size: 16,
                            color: '#fff'
                        },
                        bodyFont: {
                            size: 14,
                            color: '#fff'
                        }
                    }
                }
            }
        });

        const incomes = transactions.filter(t => t.category === 'salary').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.category !== 'salary').reduce((sum, t) => sum + t.amount, 0);

        transactionsChart = new Chart(transactionsChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [incomes, expenses],
                    backgroundColor: ['#4caf50', '#f44336'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#333',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleFont: {
                            size: 16,
                            color: '#fff'
                        },
                        bodyFont: {
                            size: 14,
                            color: '#fff'
                        }
                    }
                }
            }
        });
    }

    transactionForm.addEventListener('submit', addTransaction);
    renderTransactions();
    renderCharts();
});
/* ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡴⠞⠛⣉⡉⠄⠀⠀⠀⠀⠀⠐⠯⣛⡳⢦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡴⢛⡡⠔⠚⣉⡀⠄⠀⠀⠒⠀⠀⠀⠀⠀⠀⠈⠓⠪⣝⡳⢤⣀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣀⡴⢛⡥⢒⡩⠔⣒⣩⡥⠶⠖⠚⠛⠛⠓⠶⠦⢤⣄⣈⠑⠢⢄⡀⠉⠲⢝⠳⣤⡀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣤⠞⢉⣔⡯⢒⣥⠶⠛⣉⣤⣶⣶⣿⣿⣿⣿⣿⣿⠿⢷⣾⣯⣟⡶⣤⣈⠲⠀⠀⠑⢬⠙⢦⡀⠀⠀
⠀⠀⢀⡴⠟⠁⣴⢟⣡⡾⢋⣥⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣤⣤⡈⠻⣿⣿⣿⣯⣻⣦⣅⡀⠀⠀⠀⠙⢷⣄
⣠⡼⠋⠀⠀⣠⡴⣛⣥⣾⣿⣿⣿⢿⡟⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡇⢸⠻⣿⣿⣿⣿⣮⣿⡦⠀⠀⠀⠀⠉
⠉⠀⠀⣠⣾⣯⡾⠟⠋⠀⢻⣿⣿⠘⡇⠙⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⠃⣼⠀⣾⠉⡏⢸⡟⠛⠛⣷⠀⠀
⠀⠀⣨⣷⡟⢹⠀⠀⠀⠀⠀⠈⢻⣆⠹⡄⠀⠈⠛⠿⣿⣿⣿⣿⠿⣫⠎⡰⠃⣼⠃⠘⠁⣼⠁⣠⣾⡏⠀⠁⠀
⠀⠸⣿⣽⣷⣤⣄⡀⠀⡀⠀⠀⠀⠙⠷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠈⣡⠞⣡⠞⠁⠀⠀⢀⣡⣾⣿⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠉⠙⠳⢮⣗⣦⣀⣀⠀⠈⠙⠷⠶⢤⣤⣤⣤⣤⡾⠿⠛⠁⠀⢀⣠⣶⣿⡿⢋⣰⠆⡀⠀⠀⠀⠀
⠀⠙⠛⠛⠛⠳⢦⣄⡀⠀⠈⠙⠻⠾⢿⣶⣦⣄⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣶⣿⠿⠛⢉⣤⠞⣡⠞⠁⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡳⢤⣉⠛⠳⠶⣤⣄⣀⡀⠀⠉⠙⠛⠛⠛⠛⠛⠛⠛⠛⠛⠉⠉⢀⣠⡶⠋⣡⠞⡡⠚⠀
⠀⠀⠀⠀⠰⣝⡳⠮⣭⠂⠀⠀⠈⠉⠙⢛⠶⠶⢶⣤⣤⣄⣀⣀⣠⣤⣴⠶⠟⠋⠁⠰⠋⠕⣊⠴⠂⠀⠀⠀⠀⠀
 */