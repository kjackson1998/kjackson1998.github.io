/** @type {typeof import('matter-js')} */
const Matter = window.Matter;
const Vector = Matter.Vector;

window.addEventListener('load', function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.isMouseDown = false;
    canvas.lastMouseX = null;
    canvas.lastMouseY = null;
    canvas.worldStack = [];

    canvas.addEventListener("mousedown", canvasMouseDown);
    canvas.addEventListener("mouseup", canvasMouseUp);
    canvas.addEventListener("mousemove", canvasMouseMove);
    canvas.addEventListener("wheel", canvasMouseWheel);
    canvas.addEventListener("contextmenu", canvasMouseRightClick);
    window.addEventListener("resize", event => windowResize(event, canvas));

    let contentDiv = this.document.getElementById('content');
    let starColorSelector = contentDiv.querySelector('#starColorSelector');
    if (starColorSelector) {
        contentDiv.removeChild(starColorSelector);
    }
    starColorSelector = Object.assign(this.document.createElement('div'), {
        className: 'radioBar'
    });
    contentDiv.prepend(starColorSelector);
    starColorSelector.appendChild(Object.assign(this.document.createElement('div'), {
        innerText: 'star color',
        className: 'header'
    }));
    let d = starColorSelector.appendChild(Object.assign(this.document.createElement('div'), {
        innerText: 'type',
        className: 'button',
        onclick: e => selectStarColor(e, canvas)
     }));
     starColorSelector.appendChild(Object.assign(this.document.createElement('div'), {
        innerText: 'faction',
        className: 'button',
        onclick: e => selectStarColor(e, canvas)
     }));
     starColorSelector.appendChild(Object.assign(this.document.createElement('div'), {
        innerText: 'waypoints',
        className: 'button',
        onclick: e => selectStarColor(e, canvas)
     }));
     d.click();


    requestAnimationFrame(() => render(canvas, ctx));

    getGalaxyRenderables()
        .then(renderables => pushWorld(canvas, renderables));
});

function selectStarColor(event, canvas) {
    canvas.starColor = event.currentTarget.innerText;
    event.currentTarget.parentNode.querySelectorAll('.button')
        .forEach(b => b.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

function windowResize(event, canvas) {
    const oldCornerPos = screenToWorld(canvas, Vector.create(0, 0));
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const newCornerPos = screenToWorld(canvas, Vector.create(0, 0));
    canvas.world.offset = Vector.add(canvas.world.offset, Vector.sub(newCornerPos, oldCornerPos));
}

function canvasMouseClick(event) {
    const canvas = event.currentTarget;
    if (canvas.nearestRenderable == null) return;

    if (canvas.nearestRenderable.click) {
        canvas.nearestRenderable.click(event);
    }
}

async function canvasMouseRightClick(event) {
    event.preventDefault();
    const canvas = event.currentTarget;

    popWorld(canvas);
    canvasMouseMove(event);
}

function canvasMouseDown(event) {
    const canvas = event.currentTarget;
    if (event.button === 0) {
        canvas.isMouseDown = Date.now();
        canvas.lastMouseX = event.clientX;
        canvas.lastMouseY = event.clientY;
        canvas.mouseMoved = false;
    }
};

function canvasMouseUp(event) {
    const canvas = event.currentTarget;
    if (event.button === 0) {
        //if (Date.now() - canvas.isMouseDown < 200 && !canvas.mouseMoved) {
        if (Date.now() - canvas.isMouseDown < 200) {
            canvasMouseClick(event);
        }
        canvas.isMouseDown = 0;
        canvas.lastMouseX = null;
        canvas.lastMouseY = null;
    }
};

function canvasMouseWheel(event) {
    const canvas = event.currentTarget;
    const oldWorld = screenToWorld(canvas, Vector.create(event.clientX, event.clientY));
    for (i = 0; i < Math.abs(event.deltaY); i++) {
        if (event.deltaY < 0)
            canvas.world.scale *= 1.001;
        else
            canvas.world.scale *= 0.999;
    }
    const newWorld = screenToWorld(canvas, Vector.create(event.clientX, event.clientY));
    canvas.world.offset = Vector.sub(canvas.world.offset, Vector.sub(newWorld, oldWorld));
};

function canvasMouseMove(event) {
    const canvas = event.currentTarget;
    if (canvas.isMouseDown) {
        const oldWorld = screenToWorld(canvas, Vector.create(canvas.lastMouseX, canvas.lastMouseY));
        const newWorld = screenToWorld(canvas, Vector.create(event.clientX, event.clientY));
        canvas.world.offset = Vector.sub(canvas.world.offset, Vector.sub(newWorld, oldWorld));
        canvas.lastMouseX = event.clientX;
        canvas.lastMouseY = event.clientY;
        canvas.mouseMoved = true;
    }

    if (canvas.world != null) {
        const worldPos = screenToWorld(canvas, Vector.create(event.clientX, event.clientY));
        let nearestDist = Number.MAX_VALUE;
        let nearestRenderable = null;
        for (const renderable of canvas.world.renderables) {
            const dist = Vector.magnitudeSquared(Vector.sub(worldPos, Vector.create(renderable.worldX, renderable.worldY)));
            if (dist < nearestDist)
            {
                const moustDistSquared = Vector.magnitudeSquared(
                    Vector.sub(
                        Vector.create(event.clientX, event.clientY),
                        worldToScreen(canvas, Vector.create(renderable.worldX, renderable.worldY))));

                if (moustDistSquared < renderable.tooltipRange * renderable.tooltipRange)
                {
                    nearestDist = dist;
                    nearestRenderable = renderable;
                }
            }
        }

        if (nearestRenderable != null) {
            document.getElementById('statusBar').innerText = nearestRenderable.tooltipText;
            canvas.nearestRenderable = nearestRenderable;
        } else {
            document.getElementById('statusBar').innerText = ``;
            canvas.nearestRenderable = null;
        }
    }
};

function pushWorld(canvas, world) {
    if (canvas.world) {
        canvas.worldStack.push(canvas.world);
    }

    canvas.world = world;

    canvas.world.renderMin = Vector.create(Number.MAX_VALUE, Number.MAX_VALUE);
    canvas.world.renderMax = Vector.create(Number.MIN_VALUE, Number.MIN_VALUE);
    for (const renderable of canvas.world.renderables) {
        canvas.world.renderMin.x = Math.min(canvas.world.renderMin.x, renderable.worldX);
        canvas.world.renderMax.x = Math.max(canvas.world.renderMax.x, renderable.worldX);
        canvas.world.renderMin.y = Math.min(canvas.world.renderMin.y, renderable.worldY);
        canvas.world.renderMax.y = Math.max(canvas.world.renderMax.y, renderable.worldY);
    }

    if (canvas.world.renderMin.x == Number.MAX_VALUE) canvas.world.renderMin.x = -1;
    if (canvas.world.renderMin.y == Number.MAX_VALUE) canvas.world.renderMin.y = -1;
    if (canvas.world.renderMax.x == Number.MIN_VALUE) canvas.world.renderMax.x = 1;
    if (canvas.world.renderMax.y == Number.MIN_VALUE) canvas.world.renderMax.y = 1;

    const margins = Vector.create(150, 150);
    computeOffsetAndScale(
        canvas,
        margins,
        canvas.world.renderMin,
        canvas.world.renderMax,
        Vector.create(0, 0),
        Vector.create(canvas.width, canvas.height));
}

function popWorld(canvas) {
    if (canvas.worldStack.length == 0) return;
    canvas.world = canvas.worldStack.pop();
}

function computeOffsetAndScale(canvas, margins, worldPointMin, worldPointMax, screenPointMin, screenPointMax) {
    // identity
    canvas.world.offset = Vector.create(0, 0);
    canvas.world.scale = 1;

    const screenPointMinWithMargin = Vector.add(screenPointMin, margins);
    const screenPointMaxWithMargin = Vector.sub(screenPointMax, margins);

    // Compute the scale based on the ratio of screen distances to world distances
    const screenDist = Vector.sub(screenPointMaxWithMargin, screenPointMinWithMargin);
    const worldDist = Vector.sub(worldPointMax, worldPointMin);
    const scaleX = screenDist.x / worldDist.x;
    const scaleY = screenDist.y / worldDist.y;
    canvas.world.scale = Math.min(scaleX, scaleY);

    // Offset is the world center distance from the screen center
    const screenCenter = Vector.add(screenPointMinWithMargin, Vector.div(Vector.sub(screenPointMaxWithMargin, screenPointMinWithMargin), 2));
    const worldCenter = Vector.add(worldPointMin, Vector.div(Vector.sub(worldPointMax, worldPointMin), 2));
    canvas.world.offset = Vector.sub(worldCenter, screenToWorld(canvas, screenCenter));
}

function screenToWorld(canvas, pos) {
    pos = Vector.div(pos, canvas.world.scale);
    pos = Vector.add(pos, canvas.world.offset);
    return pos;
}

function worldToScreen(canvas, pos) {
    pos = Vector.sub(pos, canvas.world.offset);
    pos = Vector.mult(pos, canvas.world.scale);
    return pos;
}

function render(canvas, ctx) {
    requestAnimationFrame(() => render(canvas, ctx));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const renderable of canvas.world?.renderables ?? []) {
        renderable.render(canvas, ctx);
    }
}

async function getWaypointRenderables(waypoint) {
    const renderables = []
    renderables.push(
        {
            worldX: 0,
            worldY: 0,
            tooltipRange: 20,
            tooltipText: `${waypoint.symbol} ${waypoint.type} [${waypoint.traits.map(t => t.name).join(", ")}]`,
            render: (canvas, ctx) => renderWaypoint(canvas, ctx, waypoint, Vector.create(0, 0), true),
            waypoint: waypoint
        }
    );
    for (const childWaypoint of waypoint.children) {
        const i = Math.abs(hashToInteger(await hashString(childWaypoint.symbol)));
        const mult = (2 * Math.PI);
        const dist = (i % 10.1) + 1;
        const pos = Vector.mult(Vector.create(Math.sin(i % mult), Math.cos(i % mult)), dist);
        renderables.push(
            {
                worldX: pos.x,
                worldY: pos.y,
                tooltipRange: 20,
                tooltipText: `${childWaypoint.symbol} ${childWaypoint.type} [${childWaypoint.traits.map(t => t.name).join(", ")}]`,
                render: (canvas, ctx) => renderWaypoint(canvas, ctx, childWaypoint, pos),
                click: childWaypoint.children.length > 0 ? (event) => {
                    const canvas = event.currentTarget;
                    let eventCopy = copyEvent(event);
                    getWaypointRenderables(canvas.nearestRenderable.waypoint)
                        .then(renderables => pushWorld(canvas, renderables))
                        .then(() => canvasMouseMove(eventCopy));
                } : undefined,
                waypoint: childWaypoint
            }
        );
    }

    return { renderables: renderables };
}

async function getSystemRenderables(system) {
    let response;
    
    response = await fetch(`https://api.spacetraders.io/v2/systems/${system.symbol}`);
    if (response.status == 404) {
        throw "Could not load system data.";
    }

    system = (await response.json()).data;

    const limit = 20;
    let page = 1;
    system.waypoints = [];
    do {
        response = await fetch(`https://api.spacetraders.io/v2/systems/${system.symbol}/waypoints?limit=${limit}&page=${page}`);
        if (response.status == 404) {
            throw "Could not load system data.";
        }
        json = await response.json();
        system.waypoints.push(...json.data);
        page++;
    } while (json.meta.page < json.meta.total / json.meta.limit);

    let waypointMap = {
        [system.symbol]: system
    };
    system.children = [];
    system.waypoints.forEach(w => {
        waypointMap[w.symbol] = w;
        w.children = [];
    });

    system.waypoints.forEach(w => {
        // point at star
        if (w.orbits == null) w.orbits = system.symbol;

        // add children to parent
        waypointMap[w.orbits].children.push(w);

        // set parent
        w.parent = waypointMap[w.orbits];
    });

    const renderables = []
    renderables.push(
        {
            worldX: 0,
            worldY: 0,
            tooltipRange: 20,
            tooltipText: `${system.symbol} ${system.type}`,
            render: (canvas, ctx) => renderSystem(canvas, ctx, system, Vector.create(0, 0)),
            system: system
        }
    );
    for (const waypoint of Object.values(waypointMap).filter(w => w.orbits == system.symbol)) {
        renderables.push(
            {
                worldX: waypoint.x,
                worldY: waypoint.y,
                tooltipRange: 20,
                tooltipText: `${waypoint.symbol} ${waypoint.type} [${waypoint.traits.map(t => t.name).join(", ")}]`,
                render: (canvas, ctx) => renderWaypoint(canvas, ctx, waypoint, Vector.create(waypoint.x, waypoint.y)),
                click: waypoint.children.length > 0 ? (event) => {
                    const canvas = event.currentTarget;
                    let eventCopy = copyEvent(event);
                    getWaypointRenderables(canvas.nearestRenderable.waypoint)
                        .then(renderables => pushWorld(canvas, renderables))
                        .then(() => canvasMouseMove(eventCopy));
                } : undefined,
                waypoint: waypoint
            }
        );
    }

    return { renderables: renderables };
}

function renderWaypoint(canvas, ctx, waypoint, pos, skipCount) {
    const screenPos = worldToScreen(canvas, pos);

    // draw the orbit
    ctx.beginPath();
    const parentPos = worldToScreen(canvas, Vector.create(0, 0));
    ctx.arc(
        parentPos.x,
        parentPos.y,
        Vector.magnitude(Vector.sub(screenPos, parentPos)),
        0,
        2 * Math.PI);
    ctx.strokeStyle = rgb(32, 32, 32);
    ctx.closePath();
    ctx.stroke();

    // draw the waypoint
    let radius = 4;
    ctx.beginPath();
    ctx.arc(
        screenPos.x,
        screenPos.y,
        radius,
        0,
        2 * Math.PI);
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.strokeWidth = 2;
    switch (waypoint.type) {
        default:
            ctx.fillStyle = rgb(0, 0, 255);
            break;
    }
    ctx.stroke();
    ctx.fill();

    // draw the number of children if there are
    if (!skipCount && waypoint.children.length > 0) {
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(waypoint.orbitals.length + 1, screenPos.x + 5, screenPos.y - 10);
    }
}

async function getGalaxyRenderables() {
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

    const renderables = []
    for (const system of systems) {
        renderables.push(
            {
                worldX: system.x,
                worldY: system.y,
                tooltipRange: 20,
                tooltipText: `${system.symbol} ${system.type}`,
                render: (canvas, ctx) => renderSystem(canvas, ctx, system, Vector.create(system.x, system.y)),
                click: (event) => {
                    const canvas = event.currentTarget;
                    let eventCopy = copyEvent(event);
                    getSystemRenderables(canvas.nearestRenderable.system)
                        .then(renderables => pushWorld(canvas, renderables))
                        .then(() => canvasMouseMove(eventCopy));
                },
                system: system
            }
        )
    }

    return { renderables: renderables };
}

function renderSystem(canvas, ctx, system, pos) {
    const screenPos = worldToScreen(canvas, pos);

    // draw the system
    let radius = 4;
    ctx.beginPath();
    ctx.arc(
        screenPos.x,
        screenPos.y,
        radius,
        0,
        2 * Math.PI);
    ctx.closePath();
    ctx.strokeWidth = 2;
    if (canvas.starColor == 'type') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        switch (system.type) {
            case "BLUE_STAR":
                ctx.fillStyle = rgb(0, 0, 128);
                break;
            case "RED_STAR":
                ctx.fillStyle = rgb(64, 0, 0);
                break;
            case "ORANGE_STAR":
                ctx.fillStyle = rgb(128, 64, 0);
                break;
            case "WHITE_DWARF":
                ctx.fillStyle = rgb(192, 192, 192);
                break;
            case "BLACK_HOLE":
                ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
                ctx.fillStyle = rgb(0, 0, 0);
                break;
            case "UNSTABLE":
                ctx.fillStyle = rgb(128, 0, 128);
                break;
            case "NEUTRON_STAR":
                ctx.fillStyle = rgb(128, 128, 255);
                break;
            case "HYPERGIANT":
                ctx.fillStyle = rgb(255, 128, 128);
                break;
            case "YOUNG_STAR":
                ctx.fillStyle = rgb(0, 64, 0);
                break;
            default:
                throw "Unknown system type: " + system.type;
        }
    } else if (canvas.starColor == 'faction') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        if (system.factions?.length > 1) {
            console.log('multiple factions: ' + JSON.stringify(system));
        }
        const faction = system.factions[0]?.symbol ?? null;
        switch (faction) {
            // Reds
            case "QUANTUM":
                ctx.fillStyle = rgb(64, 0, 0);
                break;
            case "DOMINION":
                ctx.fillStyle = rgb(255, 0, 0);
                break;

            // Greens
            case "GALACTIC":
                ctx.fillStyle = rgb(0, 64, 0);
                break;
            case "ECHO":
                ctx.fillStyle = rgb(0, 255, 0);
                break;

            // Blues
            case "VOID":
                ctx.fillStyle = rgb(0, 0, 64);
                break;

            // Yellows
            case "COSMIC":
                ctx.fillStyle = rgb(64, 64, 0);
                break;

            case null:
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                break;
            default:
                ctx.fillStyle = rgb(255, 255, 255);
                console.log("Unknown system faction: " + faction);
                break;
        }
    } else if (canvas.starColor == 'waypoints') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        const waypointCount = system.waypoints?.length ?? 0;
        if (waypointCount <= 0) {
            ctx.fillStyle = rgb(0, 0, 0);
        } else if (waypointCount <= 3) {
            ctx.fillStyle = rgb(16, 32, 16);
        } else if (waypointCount <= 9) {
            ctx.fillStyle = rgb(32, 64, 32);
        } else {
            ctx.fillStyle = rgb(48, 128, 48);
        }
    }
    ctx.stroke();
    ctx.fill();
}

async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    return Array.from(new Uint8Array(hashBuffer));
}

function hashToInteger(hash) {
    const first32BitsArray = hash.slice(0, 4); // Take first 4 bytes (32 bits)

    let integer = 0;
    for (let i = 0; i < first32BitsArray.length; i++) {
        integer = (integer << 8) | first32BitsArray[i];
    }

    return integer;
}

function copyEvent(event) {
    return {
        currentTarget: event.currentTarget,
        button: event.button,
        clientX: event.clientX,
        clientY: event.clientY,
        deltaX: event.deltaX,
        deltaY: event.deltaY
    };
}

function rgb(r, g, b) {
    return `rgb(${r},${g},${b})`;
}
