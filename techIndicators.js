function calcSMA(data) {
    return data.reduce((acc, price) => {
        return acc + price / data.length;
    }, 0);
}

function calcEma(data, period) {
    if (data.length < period) return [];

    let ema = [];
    let i = 0;
    let sum = 0;
    let price;
    let multiplyingFactor = 2 / (period + 1);

    for (i; i < period; i++) {
        sum += data[i];
    }

    i--;
    let sma = sum / period;
    price = (data[i] - sma) * multiplyingFactor + sma;
    ema.push(price);

    i++;
    for (i; i < data.length; i++) {
        price = (data[i] - ema[ema.length - 1]) 
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

function calcBOLL(data, stdDevNumber = 2) {
    let ml = calcSMA(data);
    let e = data.reduce((acc, price) => acc + (price - ml)**2, 0);
    
    let stdDev = Math.sqrt(e / data.length);
    let tl = (ml + (stdDevNumber * stdDev));
    let bl = (ml - (stdDevNumber * stdDev));
    return { tl, ml, bl };
}

function calcRSI(data) {

}

export { calcEma, calcSMA, calcBOLL, calcMACD };