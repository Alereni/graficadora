function drawCoordinates() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const coordinatesInput = document.getElementById('coordinates').value;

    // Hacer el canvas responsive
    resizeCanvas();

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Parsear las coordenadas
    const points = parseCoordinates(coordinatesInput);

    if (points.length > 0) {
        // Calcular escala automática según las coordenadas
        const { minX, maxX, minY, maxY } = getBounds(points);
        
        const margin = 20;
        const padding = 50;  // Espacio adicional en los bordes del canvas
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;
        
        const rangeX = Math.max(maxX - minX, 1);
        const rangeY = Math.max(maxY - minY, 1);
        
        const scaleX = width / rangeX;
        const scaleY = height / rangeY;
        const scale = Math.min(scaleX, scaleY); // Escala uniforme

        const maxScale = 10;
        const finalScale = Math.min(scale, maxScale);

        // Dibujar el eje cartesiano
        drawAxes(ctx, finalScale, minX, maxX, minY, maxY, padding);

        // Animar el dibujo de las líneas
        ctx.strokeStyle = "#007BFF";
        ctx.lineWidth = 2;
        ctx.beginPath();

        points.forEach((point, index) => {
            const canvasX = padding + (point.x - minX) * finalScale;
            const canvasY = canvas.height - (padding + (point.y - minY) * finalScale);

            if (index === 0) {
                ctx.moveTo(canvasX, canvasY);
            } else {
                setTimeout(() => {
                    ctx.lineTo(canvasX, canvasY);
                    ctx.stroke();
                }, index * 100);  // Animación gradual
            }
        });
    }
}

// Ajustar el tamaño del canvas según el tamaño de la ventana
function resizeCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.width = Math.min(window.innerWidth * 0.9, 600);
    canvas.height = canvas.width; // Mantener la relación 1:1
}

// Dibujar los ejes
function drawAxes(ctx, scale, minX, maxX, minY, maxY, padding) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;

    const zeroX = padding - minX * scale;
    const zeroY = height - (padding - minY * scale);

    // Eje X
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(width, zeroY);
    ctx.stroke();

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(zeroX, 0);
    ctx.lineTo(zeroX, height);
    ctx.stroke();
}

// Obtener los límites de las coordenadas
function getBounds(points) {
    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;

    points.forEach(point => {
        if (point.x < minX) minX = point.x;
        if (point.x > maxX) maxX = point.x;
        if (point.y < minY) minY = point.y;
        if (point.y > maxY) maxY = point.y;
    });

    return { minX, maxX, minY, maxY };
}

// Parsear las coordenadas
function parseCoordinates(input) {
    const regex = /\((-?\d+),\s*(-?\d+)\)/g;
    let matches;
    const points = [];

    while ((matches = regex.exec(input)) !== null) {
        const x = parseInt(matches[1]);
        const y = parseInt(matches[2]);
        points.push({ x, y });
    }

    return points;
}
