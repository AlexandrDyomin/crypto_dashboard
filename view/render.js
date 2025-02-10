export function renderCard(target, template, data) {
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

export function drawMACDChart(canvas, data) {
    var c = canvas.getContext('2d');
    var w = 2;
    var gap = 2;
    var paddingLeft = 2.5;
    var y = canvas.height / 2;
    var red = "#b32400";
    var green = "#00b354"
    var k = y / Math.max(...data.map((item) => Math.abs(item)));
   
    for(let i = 1; i < data.length; i++) { 
        let dp = data[i];
        let h = dp * k * -1;

        if (dp > data[i-1] && dp < 0) {
            c.strokeStyle = red; 
            c.strokeRect(paddingLeft + i*(w + gap), y+0.5, w, h); 
        }
        if (dp < data[i-1] && dp < 0) {
            c.fillStyle = red; 
            c.fillRect(paddingLeft + i*(w + gap), y, w, h); 

        }
        if (dp > data[i-1] && dp >= 0) {
            c.strokeStyle = green; 
            c.strokeRect(paddingLeft + i*(w + gap), y-0.5, w, h); 

        }
        if (dp < data[i-1] && dp >= 0) {
            c.fillStyle = green; 
            c.fillRect(paddingLeft + i*(w + gap), y, w, h); 
        }
    }
}

export function clearCanvas(canvas) {
    var c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
}