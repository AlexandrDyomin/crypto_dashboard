export function getTopCCP({ data, quotedCoin, limit }) {
    let filteredPairs = filterByQuotedCryptocurrency(data, quotedCoin);
    filteredPairs.sort(orderDesc);
    return filteredPairs.slice(0, limit);
    
    function filterByQuotedCryptocurrency(pairs, quotedCryptocurrency) {
        return  pairs.reduce((acc, item) => {
            if (!item.symbol.endsWith(quotedCryptocurrency)) return acc;
            acc.push(item);
            return acc;
        }, []);
    }

    function orderDesc(a, b) {
        return b.quoteVolume - a.quoteVolume;
    } 
};