function calcSMA(data, period) {
    if (data.length < period) return [];
    let sma = [];

    for (let i = 0; i < data.length - period + 1; i++) {

        let value = data
            .slice(i, period + i)
            .reduce((acc, price, i, arr) => {
                return acc + price / arr.length;
            }, 0)
        sma.push(value);
    }

    return sma
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

function calcBOLL(data, stdDevNumber = 2, period = 21) {
    let ml = calcSMA(data, period);
    let stdDev = [];
    let tl = [];
    let bl = [];
    
    for (let i = 0; i < data.length - period + 1; i++) {
        var a = data.slice(i, i + period);
        let e = a
            .reduce((acc, price) => acc + (price - ml[i])**2, 0);
        stdDev.push(Math.sqrt(e / (a.length)));
        tl.push((ml[i] + (stdDevNumber * stdDev[i])));
        bl.push((ml[i] - (stdDevNumber * stdDev[i])));
    }
    return { tl, ml, bl };
}

function calcRSI(data, period = 6) {
    if (data.length < period) return [];
    var rsi = [];
    var { avgGain, avgLoss } = calcStartDiffs(data);
    var RS = avgGain / avgLoss;
    var RSI = 100 - (100 / (1 + RS));
    rsi.push(RSI);

    for (let i = period; i < data.length; i++) {
        let { avgGainToday, avgLossToday } = calcDiffsToday(avgGain, avgLoss, data[i], data[i - 1]);
        let RS = avgGainToday / avgLossToday;
        let RSI = 100 - (100 / (1 + RS));
        rsi.push(RSI);
        avgGain = avgGainToday;
        avgLoss = avgLossToday;
    }

    function calcStartDiffs(data) {
        var gains = 0;
        var losses = 0;
        
        for (let i = period - 1; i > 0; i--) {
            let diff = data[i] - data[i - 1];
            if (diff >= 0) {
                gains += diff;
            } else {
                losses += diff * -1;
            }
        }

        var avgGain = gains / period;
        var avgLoss = losses / period;

        return { avgGain, avgLoss };
    }

    function calcDiffsToday(avgGainPrev, avgLossPrev, dataCurr, dataPrev) {
        let diff = dataCurr - dataPrev;
        let gainToday = diff >= 0 ? diff : 0;
        let lossToday = diff < 0 ? diff * -1 : 0;  
        let avgGainToday = (avgGainPrev * (period - 1) + gainToday) / period;
        let avgLossToday = (avgLossPrev * (period - 1) + lossToday) / period;

        return { avgGainToday, avgLossToday };
    }

    return rsi;
}

export { calcEma, calcSMA, calcBOLL, calcMACD, calcRSI };