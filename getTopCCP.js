async function getTopCCP({ quotedCoin, limit }) {
    try {
        let orderDesc = (a, b) => b.quoteVolume - a.quoteVolume;
        let data = await getMarketInfo();
        let filteredPairs = filterByQuotedCryptocurrency(data, quotedCoin);
        filteredPairs.sort(orderDesc);
        return filteredPairs.slice(0, limit);
    } catch(error) {
        throw error;
    }
}

async function getMarketInfo(isSecondAttempt = false) {
    const URL_MARKET_INFO = 'https://api.binance.com/api/v1/ticker/24hr';
    try {
        let response = await fetch(URL_MARKET_INFO, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw Error(`Статусный код ответа: ${response.ok}`);
        return response.json();
    } catch(error) {
        if (isSecondAttempt) {
            throw Error('Вторая попытка получить список криптовалют закончились неудачей');
        }

        if (error.name === 'TimeoutError') {
            console.error('Запрос на получение списка криптовалют отменен. Ожидание ответа сервера более 10000 мс');
        } else {
            console.error('Попытка получить список криптовалют закончились неудачей');
        }

        return getMarketInfo(true);
    }
}   

function filterByQuotedCryptocurrency(pairs, quotedCryptocurrency) {
    return  pairs.reduce((acc, item) => {
        if (!item.symbol.endsWith(quotedCryptocurrency)) return acc;
        acc.push(item);
        return acc;
    }, []);
}

export default getTopCCP;