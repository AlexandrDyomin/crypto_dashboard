export async function getPrices({ pair, timeframe, limit }) {
    const URL_BARS_INFO = 'https://api.binance.com/api/v1/klines';
    var url = `${URL_BARS_INFO}?symbol=${pair}&interval=${timeframe}&limit=${limit}`;
    return (await requestData(url)).map((item) => +item[4]);
    
    async function requestData(url) {
        try {
            let res = await fetch(url);   
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(`HTTP Error Response: ${res.status} ${res.statusText}`);
            }
        } catch(e) {
            throw e;
        }
    }
};