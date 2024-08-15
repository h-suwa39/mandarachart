const chartsData = {
    "ADLチャート": {
        "data": [
            ["", "", "", "", "料理を運ぶ", "", "", "歯磨き", ""],
            ["", "階段", "", "料理を食べる", "食事", "食べやすく整える", "爪の手入れ", "整容", "洗顔"],
            ["", "", "", "食事を終える", "料理を口に運ぶ", "", "化粧", "髭剃り", ""],
            ["", "居室内の移動（数ｍ移動）", "", "階段", "食事", "整容", "トイレを出る", "トイレに入る","便座に座る準備をする"],
            ["近所に外出する", "移動", "家の中（居室間）の移動", "移動", "ADL自立", "排泄", "移乗する", "排泄", "便座に座る"],
            ["", "家の外に出る", "", "起居", "入浴", "更衣", "便座から立ち上がる", "後処理をする", "用を足す"],
            ["移乗する", "臥位", "寝返る", "髪の毛を乾かす", "着ている服を脱ぐ", "かけ湯をする", "","着る服を選ぶ", "上衣服を脱ぐ"],
            ["立位", "起居", "起き上がる", "服を着る", "入浴", "浴槽に浸かる", "靴を履く", "更衣", "上衣服を着る"],
            ["立ち上がる", "座る", "端座位をとる", "頭と体を拭く", "髪を洗う", "体を洗う", "靴下を履く", "下衣服を着る", "下衣服を脱ぐ"]
        ],
        "clickableCells": [
            [1, 1], [1, 4], [1, 7],
            [4, 1], [4, 7],
            [7, 1], [7, 4], [7, 7]
        ],
        "nextCharts": {
            "階段": "階段チャート",
            "食事": "食事チャート",
            "整容": "整容チャート",
            "近所に外出する": "近所に外出するチャート",
            "移乗する": "移乗するチャート",
            "着る服を選ぶ": "着る服を選ぶチャート",
            "入浴": "入浴チャート"
        }
    },
    "食事チャート": {
        "data": [
            ["","","", "", "テーブルに着く", "", "", "", ""],
            ["","","", "箸・ｽﾌﾟｰﾝを手にする", "料理を運ぶ", "料理の器を手にする", "", "", ""],
            ["","","", "", "手前に寄せる", "", "", "", ""],
            ["","口を閉じて箸・スプーンを抜く", "", "", "料理を運ぶ", "","", "料理に箸・スプーンを入れる", ""],
            ["食塊を飲み込む", "料理を食べる", "食物をよく噛む", "料理を食べる", "食事", "食べやすく整える","", "食べやすく整える", "一口に入る量を目測する"],
            ["","", "", "食事を終える", "料理を口に運ぶ","", "", "箸ではさむ・スプーンですくう", ""],
            ["状況に応じた摂食スピード", "", "", "料理を口元に近づける", "", "", "", "", ""],
            ["", "食事を終える", "空の器をテーブルに置く", "", "料理を口に運ぶ", "料理の匂い・温度を感知する", "", "", ""],
            ["","箸・スプーンを置く", "", "", "口を開けて料理を入れる", "", "", "", ""]
        ],
        "clickableCells": [
            [1, 1], [1, 4], [1, 7],
            [4, 1], [4, 7],
            [7, 1], [7, 4], [7, 7]
        ],
        "nextCharts": {
            // 次のチャートへのリンク設定
        }
    }
};



let breadcrumb = ["ADLチャート"]; // パンくずリストの初期化

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
    container.innerHTML = ''; // コンテナをクリア

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
            cell.className = 'mandala-cell';

            if (mandalaData[row][col] !== '') {
                cell.textContent = mandalaData[row][col];
            }

            // センターエリア (4,4 ~ 6,6) の配色
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
                        breadcrumb.push(nextChartName);
                        updateBreadcrumb();
                        createMandalaChart(containerId, nextChartName);
                    }
                };
            }

            container.appendChild(cell);
        }
    }
}

// 初期表示
createMandalaChart('mandalaContainer', 'ADLチャート');
