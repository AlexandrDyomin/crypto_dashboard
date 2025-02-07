import  getTopCCP from './getTopCCP.js';
import getPrices from './getPrices.js';
import { calcBOLL, calcMACD } from './techIndicators.js';

const getData = await (async function () {
	var topPairs = await getTopCCP({ quotedCoin: 'USDT', limit: 100 });
	var data = [];
	var timeframes = ['1h', '1d', '1w'];
	for (let pair of topPairs) {
		for (let timeframe of timeframes) {
			data.push(calcIndicatorsFor(pair.symbol, timeframe));
		}
	}
	return () => data;
})();

async function calcIndicatorsFor(pair, timeframe) {
	var prices = await getPrices({ pair, timeframe, limit: 100 });
	var data = { pair };
	data.macd = { [timeframe] : calcMACD(prices) };
	data.boll = { [timeframe] : calcBOLL(prices) };
	return data;	
};


export default getData;
