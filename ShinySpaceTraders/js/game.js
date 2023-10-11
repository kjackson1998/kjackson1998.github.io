/** @type {typeof import('matter-js')} */
const Matter = window.Matter;
const Vector = Matter.Vector;


window.addEventListener('load', async function() {
    const canvas = document.getElementById("canvas");
    ({ systems:canvas.systems, sysMin: canvas.sysMin, sysMax: canvas.sysMax } = await getSystemsFromGzip());
    canvas.worldOffset = Vector.create(0, 0);
    canvas.worldScale = 1;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.isMouseDown = false;
    canvas.lastMouseX = null;
    canvas.lastMouseY = null;
    canvas.addEventListener("mousedown", canvasMouseDown);
    canvas.addEventListener("mouseup", canvasMouseUp);
    canvas.addEventListener("mousemove", canvasMouseMove);
    canvas.addEventListener("wheel", canvasMouseWheel);

    const ctx = canvas.getContext("2d");
    window.addEventListener("resize", event => windowResize(event, canvas));
    requestAnimationFrame(() => render(canvas, ctx));
});

function windowResize(event, canvas) {
    const oldCornerPos = screenToWorld(canvas, Vector.create(0, 0));
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const newCornerPos = screenToWorld(canvas, Vector.create(0, 0));
    canvas.worldOffset = Vector.add(canvas.worldOffset, Vector.sub(newCornerPos, oldCornerPos));
}

function canvasMouseDown(event) {
    const canvas = event.currentTarget;
    if (event.button === 0) {
        canvas.isMouseDown = true;
        canvas.lastMouseX = event.clientX;
        canvas.lastMouseY = event.clientY;
    }
    if (event.button === 1) {
        newPos = screenToWorld(canvas, Vector.create(event.clientX, event.clientY));
        canvas.systems.push({
            x:newPos.x,
            y:newPos.y,
            symbol:"TEST",
            type:"BLACK_HOLE"
        });
    }
};

function canvasMouseUp(event) {
    const canvas = event.currentTarget;
    if (event.button === 0) {
        canvas.isMouseDown = false;
        canvas.lastMouseX = null;
        canvas.lastMouseY = null;
    }
};

function canvasMouseMove(event) {
    const canvas = event.currentTarget;
    if (canvas.isMouseDown) {
        const oldWorld = screenToWorld(canvas, Vector.create(canvas.lastMouseX, canvas.lastMouseY));
        const newWorld = screenToWorld(canvas, Vector.create(event.clientX, event.clientY));
        canvas.worldOffset = Vector.add(canvas.worldOffset, Vector.sub(newWorld, oldWorld));
        canvas.lastMouseX = event.clientX;
        canvas.lastMouseY = event.clientY;
    }

    if (canvas.systems != null) {
        const worldPos = screenToWorld(canvas, Vector.create(event.clientX, event.clientY));
        let nearestDist = Number.MAX_VALUE;
        let nearestSystem = null;
        for (const system of canvas.systems) {
            const dist = Vector.magnitudeSquared(Vector.sub(worldPos, Vector.create(system.x, system.y)));
            if (dist < nearestDist)
            {
                nearestDist = dist;
                nearestSystem = system;
            }
        }

        const screenDist = Vector.magnitude(
            Vector.sub(
                Vector.create(event.clientX, event.clientY),
                worldToScreen(canvas, Vector.create(nearestSystem.x, nearestSystem.y))));

        if (screenDist < 20)
            document.getElementById('statusBar').innerText = `${nearestSystem.symbol} ${nearestSystem.type}`;
        else
            document.getElementById('statusBar').innerText = ``;
    }
};

function canvasMouseWheel(event) {
    const canvas = event.currentTarget;
    const oldWorld = screenToWorld(canvas, Vector.create(event.clientX, event.clientY));
    for (i = 0; i < Math.abs(event.deltaY); i++) {
        if (event.deltaY < 0)
            canvas.worldScale *= 1.001;
        else
            canvas.worldScale *= 0.999;
    }
    const newWorld = screenToWorld(canvas, Vector.create(event.clientX, event.clientY));
    canvas.worldOffset = Vector.add(canvas.worldOffset, Vector.sub(newWorld, oldWorld));
};

function worldToScreen(canvas, pos) {
    const margin = 0.02;
    const marginMax = Vector.create(
        canvas.sysMax.x + (canvas.sysMax.x - canvas.sysMin.x) * margin,
        canvas.sysMax.y + (canvas.sysMax.y - canvas.sysMin.y) * margin
    );
    const marginMin = Vector.create(
        canvas.sysMin.x - (canvas.sysMax.x - canvas.sysMin.x) * margin,
        canvas.sysMin.y - (canvas.sysMax.y - canvas.sysMin.y) * margin
    );
    const xDist = (marginMax.x - marginMin.x);
    const yDist = (marginMax.y - marginMin.y);

    const scaleBase = Math.min(
        canvas.width / xDist,
        canvas.height / yDist
    )
    const offsetBase = Vector.create(
        (xDist / 2) - (marginMin.x + (xDist / 2)),
        (yDist / 2) - (marginMin.y + (yDist / 2))
    );

    return Vector.create(
        (pos.x + offsetBase.x + canvas.worldOffset.x) * scaleBase * canvas.worldScale,
        (pos.y + offsetBase.y + canvas.worldOffset.y) * scaleBase * canvas.worldScale
    );
}

function screenToWorld(canvas, pos) {
    const margin = 0.02;
    const marginMax = Vector.create(
        canvas.sysMax.x + (canvas.sysMax.x - canvas.sysMin.x) * margin,
        canvas.sysMax.y + (canvas.sysMax.y - canvas.sysMin.y) * margin
    );
    const marginMin = Vector.create(
        canvas.sysMin.x - (canvas.sysMax.x - canvas.sysMin.x) * margin,
        canvas.sysMin.y - (canvas.sysMax.y - canvas.sysMin.y) * margin
    );
    const xDist = (marginMax.x - marginMin.x);
    const yDist = (marginMax.y - marginMin.y);

    const scaleBase = Math.min(
        canvas.width / xDist,
        canvas.height / yDist
    )
    const offsetBase = Vector.create(
        (xDist / 2) - (marginMin.x + (xDist / 2)),
        (yDist / 2) - (marginMin.y + (yDist / 2))
    );

    return Vector.create(
        (pos.x / scaleBase / canvas.worldScale) - offsetBase.x - canvas.worldOffset.x,
        (pos.y / scaleBase / canvas.worldScale) - offsetBase.y - canvas.worldOffset.y
    );
}

function rgb(r, g, b) {
    return `rgb(${r},${g},${b})`;
}

function render(canvas, ctx) {
    requestAnimationFrame(() => render(canvas, ctx));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const system of canvas.systems) {
        ctx.beginPath();
        screenPos = worldToScreen(canvas, Vector.create(system.x, system.y));
        let radius = 4;
        // if (canvas.worldScale > 100)
        //     radius = 6;
        // else if (canvas.worldScale > 25)
        //     radius = 4;
        // else if (canvas.worldScale > 10)
        //     radius = 2;
        // else
        //     radius = 1;
        ctx.arc(
            screenPos.x,
            screenPos.y,
            radius,
            0,
            2 * Math.PI);
        ctx.strokeStyle = "white";
        ctx.strokeWidth = 2;
        switch (system.type) {
            case "BLUE_STAR":
                ctx.fillStyle = rgb(0, 0, 255);
                break;
            case "RED_STAR":
                ctx.fillStyle = rgb(255, 0, 0);
                break;
            case "ORANGE_STAR":
                ctx.fillStyle = rgb(255, 128, 0);
                break;
            case "WHITE_DWARF":
                ctx.fillStyle = rgb(255, 255, 255);
                break;
            case "BLACK_HOLE":
                ctx.fillStyle = rgb(0, 0, 0);
                break;
            case "UNSTABLE":
                ctx.fillStyle = rgb(255, 0, 255);
                break;
            case "NEUTRON_STAR":
                ctx.fillStyle = rgb(128, 128, 255);
                break;
            case "HYPERGIANT":
                ctx.fillStyle = rgb(255, 128, 128);
                break;
            case "YOUNG_STAR":
                ctx.fillStyle = rgb(0, 127, 0);
                break;
            default:
                throw "Unknown system type: " + system.type;
        }
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
}

async function getSystemsFromGzip() {
    const response = await fetch("data/systems.json.gz");
    if (response.status == 404) {
        throw "Could not load systems.";
    }

    const decompressionStream = new DecompressionStream("gzip");
    const pipedStream = response.body.pipeThrough(decompressionStream);

    const reader = pipedStream.getReader();
    const decoder = new TextDecoder();

    let result = '';
    let complete = false;
    while (!complete) {
        const { value, done } = await reader.read();
        if (value) {
            result += decoder.decode(value);
        }
        complete = done;
    }
    const systems = JSON.parse(result);

    const sysMin = Vector.create(Number.MAX_VALUE, Number.MAX_VALUE);
    const sysMax = Vector.create(Number.MIN_VALUE, Number.MIN_VALUE);
    for (const system of systems) {
        sysMin.x = Math.min(sysMin.x, system.x);
        sysMax.x = Math.max(sysMax.x, system.x);
        sysMin.y = Math.min(sysMin.y, system.y);
        sysMax.y = Math.max(sysMax.y, system.y);
    }

    return { systems: systems, sysMin: sysMin, sysMax: sysMax };
}
