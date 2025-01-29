import { URL_BARS_INFO, URL_MARKET_INFO } from './urls.js';
import  getInfoAboutCryptocurrencyPairs from './getInfoAboutCryptocurrencyPairs.js';
import getMACD from './macd.js';

async function getData (timeframes) {
	var pairs = await getInfoAboutCryptocurrencyPairs({
		url: URL_MARKET_INFO,
		quotedCoin: 'USDT',
		order: 'quoteVolume',
		limit: 100
	});
	pairs = pairs.map((item) => {
			return { pair: item.symbol, timeframes, limit: 100 };
	});

	var data = [];
	var promises = [];
	for ( let item of pairs) {
	    let { timeframes, pair, limit } = item;
	    for (let timeframe of timeframes) {
	        var macd = getMACD({ base: URL_BARS_INFO, pair, timeframe, limit});
			promises.push(macd);
			macd.then((res) => {
				var obj = data.find((item) => item.pair === pair);
				if (obj) {
					obj[`macd_${timeframe}`] = res;
				} else {
					data.push({
						pair,
						[`macd_${timeframe}`]: res
					});
				}

			});
	    }
	}

	return Promise.allSettled(promises)
		.then(() => data);
};

export default getData;
