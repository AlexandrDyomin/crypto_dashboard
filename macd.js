function checkStatus(res) {
    if (res.ok) {
        return res;
    } else {
        throw new Error(`HTTP Error Response: ${res.status} ${res.statusText}`);
    }
}

async function requestData(url) {
    try {
        let res = await fetch(url);
        res = checkStatus(res);
        return res.json();
    } catch(e) {
        throw e;
    }
}

async function getPrices(url) {
    return (await requestData(url)).map((item) => item[4]);
}

function prepareUrl({base, pair, timeframe, limit }) {
    return `${base}?symbol=${pair}&interval=${timeframe}&limit=${limit}`;
}

function calcEma(data, period) {
    if (data.length < period) return [];

    let ema = [];
    let i = 0;
    let sum = 0;
    let price;
    let multiplyingFactor = 2 / (period + 1);

    for (i; i < period; i++) {
        sum += +data[i];
    }

    i--;
    let sma = sum / period;
    price = (+data[i] - sma) * multiplyingFactor + sma;
    ema.push(price);

    i++;
    for (i; i < data.length; i++) {
        price = (+data[i] - ema[ema.length - 1]) 
            * multiplyingFactor + ema[ema.length - 1];
        ema.push(price);
    }

    return ema;
}

function calcMACD(data, macdConfig = [12, 26, 9]) {
    var [fast, slow, signal] = macdConfig;
    
    var ema12 = calcEma(data, fast);
    var ema26 = calcEma(data, slow);

    var macd = [];
    for (let i = ema26.length; i >= 1; i--) {
        macd.push(ema12.at(-i) - ema26.at(-i));
    }

    var signals = calcEma(macd, signal);
    
    var gist = [];
    for (let i = signals.length; i >= 1; i--) {
        gist.push(macd.at(-i) - signals.at(-i));
    }

    return {
        macd,
        signals,
        gist
    };
}

const compose = (...fns) => (arg) => 
  fns.reduce(async (composed, f) => f(await composed),arg);

const getMACD = compose(
    prepareUrl,
    getPrices,
    calcMACD,
);

export default getMACD;