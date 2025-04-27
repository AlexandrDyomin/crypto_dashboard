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
    var p = 0.5;
    var t = p + ((1 - p) / 2);
    var k = ((maxPrice - minPrice) / (canvas.height * p));

    for(let i = 1; i < data.length; i++) { 
        let dp = data[i];
        let x = paddingLeft + i*(w + gap);
        let y = (canvas.height * t) - (dp - minPrice) / k;
        let h = (dp - data[i-1]) / k;

        c.fillStyle = dp > data[i-1] ? green : red;
        c.fillRect(x+0.5, y, w, h); 
    }
}

export function drawBOLL(canvas, data, prices) {
    var c = canvas.getContext('2d');
    var paddingLeft = 2.5;
    var maxPrice = Math.max(...prices);
    var minPrice = Math.min(...prices);
    var w = 2;
    var gap = 2;
    var p = 0.5;
    var t = p + ((1 - p) / 2);
    var k = ((maxPrice - minPrice) / (canvas.height * p));
    drawLine('#c40c68', data.ml);
    drawLine('#0c31c4', data.tl);
    drawLine('#0c31c4', data.bl);

    function drawLine(color, data) {
        c.strokeStyle = color;
        let startX = paddingLeft;
        let startY = (canvas.height * t) - (data[0] - minPrice) / k;

        c.beginPath();
        c.moveTo(startX, startY)
        for(let i = 1; i < data.length; i++) { 
            let dp = data[i];
            let y = (canvas.height * t) - (dp - minPrice) / k;
            let x = startX + i * (w + gap);
            c.lineTo(x, y);
        }
        c.stroke();
    }
}

export function drawRSI(canvas, data) {
    clearCanvas(canvas);
    var c = canvas.getContext('2d');
    var w = 2;
    var gap = 2;
    var paddingLeft = 2.5;

    drawLine(90, '#ab2213');
    drawLine(30, '#13ab16');

    c.beginPath();
    c.strokeStyle = '#7d13ab'
    c.moveTo(paddingLeft, canvas.height - data[0]);
    
    for(let i = 1; i < data.length; i++) {
        let dp = data[i];
        let y = canvas.height - dp;
        let x = paddingLeft + i * (w + gap);
        c.lineTo(x, y);
    }
    c.stroke();

    function drawLine(y, color) {
        c.beginPath();
        c.strokeStyle = color;

        c.moveTo(paddingLeft, canvas.height - y);
        c.lineTo(canvas.width - paddingLeft, canvas.height - y);
        c.stroke();
    }
}

export function clearCanvas(canvas) {
    var c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
}