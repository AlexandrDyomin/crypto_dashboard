export function drawMACDChart(canvas, data) {
    clearCanvas(canvas);
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

export function drawCandles(canvas, data) {
    clearCanvas(canvas);
    var c = canvas.getContext('2d');
    var w = 2;
    var gap = 2;
    var paddingLeft = 2.5;
    var red = "#b32400";
    var green = "#00b354";
    var maxPrice = Math.max(...data);
    var minPrice = Math.min(...data);
    var k = ((maxPrice - minPrice) / canvas.height);

    for(let i = 1; i < data.length; i++) { 
        let dp = data[i];
        let x = paddingLeft + i*(w + gap);
        let y = canvas.height - (dp - minPrice) / k;
        let h = (dp - data[i-1]) / k;

        c.fillStyle = dp > data[i-1] ? green : red;
        c.fillRect(x+0.5, y, w, h); 
    }
}

export function clearCanvas(canvas) {
    var c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
}