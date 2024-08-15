
let breadcrumb = ["ADLチャート"]; // パンくずリストの初期化

let chartsData = {};

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        chartsData = data;
        // 初期表示を開始
        createMandalaChart('mandalaContainer', 'ADLチャート');
    })
    .catch(error => console.error('Error loading JSON data:', error));


function updateBreadcrumb() {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    breadcrumbContainer.innerHTML = '';

    breadcrumb.forEach((crumb, index) => {
        const li = document.createElement('li');
        if (index < breadcrumb.length - 1) {
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = crumb;
            a.onclick = () => {
                createMandalaChart('mandalaContainer', crumb);
                breadcrumb = breadcrumb.slice(0, index + 1);
                updateBreadcrumb();
            };
            li.appendChild(a);
        } else {
            li.textContent = crumb;
        }
        breadcrumbContainer.appendChild(li);
    });
}
function createMandalaChart(containerId, chartName) {
    const container = document.getElementById(containerId);
    
    // 既存のチャートをフェードアウトさせる
    const oldContent = container.innerHTML;
    if (oldContent) {
        container.classList.add('fade-out');
        setTimeout(() => {
            container.innerHTML = ''; // コンテナをクリア
            container.classList.remove('fade-out');
            updateChartContent(containerId, chartName);
        }, 500); // フェードアウトの持続時間に合わせる
    } else {
        updateChartContent(containerId, chartName);
    }
}

function updateChartContent(containerId, chartName) {
    const container = document.getElementById(containerId);

    // テーマの設定
    if (chartName === "食事チャート") {
        container.classList.add('pink-theme');
    } else {
        container.classList.remove('pink-theme');
    }

    const chartData = chartsData[chartName];
    const mandalaData = chartData.data;
    const clickableCells = chartData.clickableCells;

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'mandala-cell fade-in'; // フェードインアニメーションを適用

            if (mandalaData[row][col] !== '') {
                cell.textContent = mandalaData[row][col];
            }

            // センターエリア (3,3 ~ 5,5) の配色
            if (row >= 3 && row <= 5 && col >= 3 && col <= 5) {
                cell.classList.add('center-area');
                if (row === 4 && col === 4) {
                    cell.classList.add('center-area-center');
                }
            }

            // clickableCells の配色
            const isClickable = clickableCells.some(position => position[0] === row && position[1] === col);
            if (isClickable) {
                cell.classList.add('highlight');
                cell.onclick = () => {
                    const nextChartName = chartData.nextCharts[mandalaData[row][col].replace(/\n/g, "")];
                    if (nextChartName) {
                        breadcrumb.push(nextChartName);  // 次のチャート名をパンくずリストに追加
                        updateBreadcrumb();  // パンくずリストを更新
                        container.classList.add('fade-out');
                        setTimeout(() => {
                            createMandalaChart(containerId, nextChartName);
                        }, 500); // フェードアウトの持続時間に合わせる
                    }
                };
            }

            container.appendChild(cell);
        }
    }

    // 新しいチャートをフェードインさせる
    container.classList.add('fade-in');
}

// 初期表示
createMandalaChart('mandalaContainer', 'ADLチャート');
