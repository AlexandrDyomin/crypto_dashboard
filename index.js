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
            .then(rerenderCharts.bind(null, ['macd', 'price']));
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

function rerenderCharts(chartNames, data) {
    let macd = document.querySelector(`.list__item[data-pair="${data.pair}"] .macd`);
    drawMACDChart(macd, data.macd.gist);

    let price = document.querySelector(`.list__item[data-pair="${data.pair}"] .price`);
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









// import getData from './getData.js';


// var timeframes = document.querySelector('.timeframes');
// timeframes.addEventListener('change', (e) => {
//     var targetValue = e.target.value;
//     var buttons = document.querySelectorAll(`.dashboard__lamp[data-timeframe="${targetValue}"]`);
//     buttons.forEach((btn) => btn.click());
// });

// var display = document.querySelector('.display');
// display.addEventListener('change', (e) => {
//     var data = {
//         '1h': [],
//         '1d': [],
//         '1w': [],
//     };
    
//     display.querySelectorAll('input:checked')
//         .forEach((checkbox) => {
//             data[`${checkbox.id.match(/1\w/)}`].push(checkbox.value);
//         });

//     document.querySelectorAll('.list__item')
//         .forEach((item) => {
//             var [lamp1h, lamp1d, lamp1w] = [...item.querySelectorAll('.dashboard__lamp')];
//             if (
//                 data[lamp1h.dataset.timeframe].includes(lamp1h.textContent) ||
//                 data[lamp1d.dataset.timeframe].includes(lamp1d.textContent) ||
//                 data[lamp1w.dataset.timeframe].includes(lamp1w.textContent)
//             ) {
//                 item.style.display = 'initial';
//             } else {
//                 item.style.display = 'none';
//             }
//         });
// });

// var data = getData();
// Promise.allSettled(data).then((item) => {
//     item.forEach((item) => console.log(item.value))
// })

// var list = document.querySelector('.list');
// var listItemTemplate = document.getElementById('list__item')?.content;

// for (let i = 0; i < data.length; i ++) {
//     var listItem = listItemTemplate?.cloneNode(true);
//     writeDataToTemplate(listItem, data[i]);
//     var dashboard = listItem.querySelector('.dashboard');
    
//     dashboard.addEventListener('click', (e) => {
//         if (!e.target.classList.contains('dashboard__lamp')) return;
//         var lampSelected = e.currentTarget.querySelector('.dashboard__lamp_selected');
//         lampSelected.classList.remove('dashboard__lamp_selected');
//         e.target.classList.add('dashboard__lamp_selected');
//         var timeframe = e.target.dataset.timeframe;
//         var canvas = e.currentTarget.parentElement.nextElementSibling;
//         clearCanvas(canvas);
//         drawChart(canvas, data[i][`macd_${timeframe}`].gist);
//     });

//     list.append(listItem);
// }

// function writeDataToTemplate(template, data) {
//     var listLink = template.querySelector('.list__link');
//     listLink.textContent = data.pair;
//     listLink.href = `https://www.binance.com/ru/trade/${data.pair.replace('USDT', '_USDT')}?type=spot`;

//     var dashboard__lamps = [...template.querySelectorAll('.dashboard__lamp')];
//     for (let prop in data) {
//         if (prop.startsWith('macd')) {
//             let msg = analizeMACD(data[prop]);
//             let lamp = dashboard__lamps.find((item) => item.dataset.timeframe === prop.slice(5));
//             lamp.textContent = msg;
//         }
//     }

//     var canvas = template.querySelector('.macd');
//     var lampSelectedTimeframe = template.querySelector('.dashboard__lamp_selected')?.dataset.timeframe;
//     drawChart(canvas, data[`macd_${lampSelectedTimeframe}`].gist);

//     function analizeMACD(data) {
//         var messages = {
//             buy: '🟢',
//             sell: '🔴',
//             undefined: '🧐'
//         };
    
//         var currentGist = data.gist.at(-1);
//         var previousGist = data.gist.at(-2);
    
//         if (currentGist < 0 && currentGist < previousGist) {
//             return messages.sell;
//         }
    
//         if (currentGist < 0 && currentGist >= previousGist) {
//             return messages.buy;
//         } 
    
    
//         if (currentGist >= 0 && currentGist > previousGist) {
//             return messages.buy;
//         } 
    
//         if (currentGist >= 0 && currentGist <= previousGist) {
//             return messages.sell;
//         }

//         return messages.undefined
//     }

// }

// function drawChart(canvas, data) {
//     var c = canvas.getContext('2d');
//     var w = 2;
//     var gap = 2;
//     var paddingLeft = 2.5;
//     var y = canvas.height / 2;
//     var red = "#b32400";
//     var green = "#00b354"
//     var k = y / Math.max(...data.map((item) => Math.abs(item)));
   
//     for(let i = 1; i < data.length; i++) { 
//         let dp = data[i];
//         let h = dp * k * -1;

//         if (dp > data[i-1] && dp < 0) {
//             c.strokeStyle = red; 
//             c.strokeRect(paddingLeft + i*(w + gap), y+0.5, w, h); 
//         }
//         if (dp < data[i-1] && dp < 0) {
//             c.fillStyle = red; 
//             c.fillRect(paddingLeft + i*(w + gap), y, w, h); 

//         }
//         if (dp > data[i-1] && dp >= 0) {
//             c.strokeStyle = green; 
//             c.strokeRect(paddingLeft + i*(w + gap), y-0.5, w, h); 

//         }
//         if (dp < data[i-1] && dp >= 0) {
//             c.fillStyle = green; 
//             c.fillRect(paddingLeft + i*(w + gap), y, w, h); 
//         }
//     }
// }

// function clearCanvas(canvas) {
//     var c = canvas.getContext('2d');
//     c.clearRect(0, 0, canvas.width, canvas.height);
// }