import { getMarketInfo } from './network/getMarketInfo.js';
import { getTopCCP } from './processing/getTopCCP.js';
import { calcBOLL, calcMACD } from './processing/techIndicators.js';
import { getPrices } from './network/getPrices.js';
import { drawMACDChart, drawCandles, drawBOLL } from './view/render.js';

var marketInfo = await getMarketInfo();
var topCCP = getTopCCP({ data: marketInfo, quotedCoin: 'USDT', limit: 100 });

var list = document.querySelector('.list');
var listItemTemplate = document.getElementById('list__item')?.content;
topCCP.forEach((item) => {
    var listItemClone = listItemTemplate.cloneNode(true);
    var dashboard = listItemClone.querySelector('.dashboard');  
    dashboard.addEventListener('click', (e) => {
        if (!e.target.classList.contains('dashboard__lamp')) return;
        var lampSelected = e.currentTarget.querySelector('.dashboard__lamp_selected');
        lampSelected.classList.remove('dashboard__lamp_selected');
        e.target.classList.add('dashboard__lamp_selected');
        var timeframe = e.target.dataset.timeframe;
        var pair = topCCP.find((item) => item.symbol === e.target.closest('.list__item').dataset.pair);
        updateCard(pair, timeframe);
    })

    renderCard(
        list, 
        listItemClone, 
        { 
            pair: item.symbol, 
            price: (+item.lastPrice).toFixed(2),
            quoteVolume: item.quoteVolume
         }
    );
});

var timeframes = document.querySelector('.timeframes');
timeframes.querySelectorAll('input[name=timeframe]')
    .forEach((radio) => radio.removeAttribute('disabled'));
timeframes.addEventListener('change', (e) => {
    var targetValue = e.target.value;
    var buttons = document.querySelectorAll(`.dashboard__lamp[data-timeframe="${targetValue}"]`);
    buttons.forEach((btn) => btn.click());
});
var timeframe = timeframes.querySelector('input[checked]').value;
updatePage(timeframe, topCCP);


function updateCard(pair, timeframe) {
    let prices = getPrices({ pair: pair.symbol, timeframe, limit: 100});
        prices
            .then(calcIndicators.bind(null, pair))
            .then((data) => {
                var titles = document.querySelectorAll(`.list__item[data-pair="${data.pair}"] .chart_name span`);
                var boll = {
                    tl: data.boll.tl.at(-1),
                    ml: data.boll.ml.at(-1),
                    bl: data.boll.bl.at(-1),
                };
                titles[0].textContent = ` ${analizeBOLL(data.prices.at(-1), boll)}`;
                titles[1].textContent = ` ${analizeMACD(data.macd)}`;
                return data;
            })
            .then(rerenderCharts);
}

function updatePage(timeframe, data) {
    for (let item of data) {
        updateCard(item, timeframe);
    }
}


function calcIndicators({ symbol, lastPrice, quoteVolume}, prices) {
    var macd = calcMACD(prices);
    var boll = {};
    for (let [key, value]  of Object.entries(calcBOLL(prices))) {
        boll[key] = value.slice(value.length - macd.gist.length);
    }

    return {
        pair: symbol,
        lastPrice: +lastPrice,
        quoteVolume: +quoteVolume,
        prices: prices.slice(prices.length - macd.gist.length),
        macd,
        boll
    };
}

function rerenderCharts(data) {
    let macd = document.querySelector(`.list__item[data-pair="${data.pair}"] .macd`);
    drawMACDChart(macd, data.macd.gist);

    let price = document.querySelector(`.list__item[data-pair="${data.pair}"] .boll`);
    drawCandles(price, data.prices);
    drawBOLL(price, data.boll, data.prices);
}


function renderCard(target, template, data) {
    var listItem = template.querySelector('.list__item');
    listItem.dataset.volume = data.quoteVolume;
    listItem.dataset.pair = data.pair;
    var listLink = template.querySelector('.list__link');
    listLink.textContent = data.pair;
    listLink.href = `https://www.binance.com/ru/trade/${data.pair.replace('USDT', '_USDT')}?type=spot`;
    var listPrice = template.querySelector('.list__price');
    listPrice.textContent += data.price;
    target.append(template);
}

function analizeMACD(data) {
    var messages = {
        buy: '🟢',
        sell: '🔴',
        undefined: '🧐'
    };

    var currentGist = data.gist.at(-1);
    var previousGist = data.gist.at(-2);

    if (currentGist < 0 && currentGist < previousGist) {
        return messages.sell;
    }

    if (currentGist < 0 && currentGist >= previousGist) {
        return messages.buy;
    } 


    if (currentGist >= 0 && currentGist > previousGist) {
        return messages.buy;
    } 

    if (currentGist >= 0 && currentGist <= previousGist) {
        return messages.sell;
    }

    return messages.undefined
}

function analizeBOLL(price, { tl, ml, bl }) {
    var messages = {
        buy: '🟢',
        sell: '🔴',
        undefined: '🧐'
    };

    if (price >= ml + (tl - ml) / 2 ) {
        return messages.sell;
    }

    if (price < ml - (ml - bl) / 2) {
        return messages.buy;
    }

    return messages.undefined;
}