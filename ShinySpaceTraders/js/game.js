/** @type {typeof import('matter-js')} */
const Matter = window.Matter;
const Vector = Matter.Vector;

window.addEventListener('load', windowLoad);

function windowLoad(event) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const clientRect = canvas.parentElement.getBoundingClientRect();
    canvas.width = clientRect.width;
    canvas.height = clientRect.height;
    canvas.isMouseDown = false;
    canvas.lastMouse = null;
    canvas.worldStack = [];
    canvas.gameOptions = {};

    canvas.addEventListener("mousedown", canvasMouseDown);
    canvas.addEventListener("mouseup", canvasMouseUp);
    canvas.addEventListener("mousemove", canvasMouseMove);
    canvas.addEventListener("wheel", canvasMouseWheel);
    canvas.addEventListener("contextmenu", canvasMouseRightClick);
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target == canvas.parentElement) {
                canvasResize(canvas);
            }
        }
    });
    resizeObserver.observe(canvas.parentElement);

    window.addEventListener('keypress', windowKeyPress);
      
    let starColorSelector = this.document.getElementById('starColorSelector');
    starColorSelector.querySelectorAll('.button').forEach(b => b.addEventListener('click', selectStarColor));
    restoreStarColor(starColorSelector);

    let authKeyInput = this.document.getElementById('authKeyInput');
    if (window.localStorage) {
        authKey = window.localStorage.getItem('authKey');
        if (authKey) {
            authKeyInput.value = authKey;
            Api.authKey = authKey;
        }
    }
    authKeyInput.addEventListener('input', event => {
        window.localStorage.setItem('authKey', event.currentTarget.value);
        Api.authKey = event.currentTarget.value;
    });


    populateShipList();

    requestAnimationFrame(() => render(ctx));

    const safeEvent = copyEvent(event);
    Api.fetchGalaxy()
        .then(systems => {
            const world = new GalaxyWorld(
                systems.map(s => new RenderableSystem(s)),
                canvas.gameOptions);

            const margins = Vector.create(150, 150);
            world.setFullView(
                margins,
                canvas);
            pushWorld(canvas, world);
            canvasMouseMove(safeEvent)
        });
}

function populateShipList() {
    let shipListShipNameTemplate = this.document.getElementById('shipListShipNameTemplate');
    let shipListShipCargoTemplate = this.document.getElementById('shipListShipCargoTemplate');
    let shipListShipFuelTemplate = this.document.getElementById('shipListShipFuelTemplate');
    let shipListShipCooldownTemplate = this.document.getElementById('shipListShipCooldownTemplate');
    
    let shipList = this.document.getElementById('shipList');

    for (let i = 0; i < 15; i++)
    {
        let newNameNode = this.document.importNode(shipListShipNameTemplate.content, true);
        newNameNode.querySelector('.shipListShipName').innerText = `Ship ${i}`;
        shipList.appendChild(newNameNode);

        let newCargoNode = this.document.importNode(shipListShipCargoTemplate.content, true);
        newCargoNode.querySelector('.shipListShipCargoUnits').innerText = `0`;
        newCargoNode.querySelector('.shipListShipCargoCapacity').innerText = `100`;
        shipList.appendChild(newCargoNode);

        let newFuelNode = this.document.importNode(shipListShipFuelTemplate.content, true);
        newFuelNode.querySelector('.shipListShipFuelCurrent').innerText = `100`;
        newFuelNode.querySelector('.shipListShipFuelCapacity').innerText = `9999`;
        shipList.appendChild(newFuelNode);

        let newCooldownNode = this.document.importNode(shipListShipCooldownTemplate.content, true);
        newCooldownNode.querySelector('.shipListShipCooldownRemaining').innerText = `0`;
        newCooldownNode.querySelector('.shipListShipCooldownTotal').innerText = `0`;
        shipList.appendChild(newCooldownNode);
    }
}

function restoreStarColor(starColorSelector) {
    if (!window.localStorage) return;

    const starColor = window.localStorage.getItem('starColor');
    Array.from(starColorSelector.querySelectorAll('.button'))
        .find(b => b.innerText == starColor)
        .click();
}

function selectStarColor(event) {
    canvas.gameOptions.starColor = event.currentTarget.innerText;
    event.currentTarget.parentNode.querySelectorAll('.button')
        .forEach(b => b.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    if (window.localStorage) {
        window.localStorage.setItem('starColor', event.currentTarget.innerText);
    }
}

function canvasResize(canvas) {
    const clientRect = canvas.parentElement.getBoundingClientRect();
    canvas.width = clientRect.width;
    canvas.height = clientRect.height;

    if (canvas.world == null) return;
    const oldCornerPos = canvas.world.screenToWorld(Vector.create(0, 0));
    const newCornerPos = canvas.world.screenToWorld(Vector.create(0, 0));
    canvas.world.offset = Vector.add(canvas.world.offset, Vector.sub(newCornerPos, oldCornerPos));
}

function windowKeyPress(event) {
    if (event.code == 'KeyS') {
        const control = this.document.querySelector('.mainControlSide');
        if (control.classList.contains('hidden'))
            control.classList.remove('hidden');
        else
        control.classList.add('hidden');
    }
}

function canvasMouseClick(event) {
    const canvas = event.currentTarget;
    if (canvas.hoverRenderable == null) return;

    if (canvas.world) {
        canvas.world.click(event);
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
    const mousePos = eventMousePos(event);
    if (event.button === 0) {
        canvas.isMouseDown = Date.now();
        canvas.lastMouse = mousePos;
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
        canvas.lastMouse = null;
    }
};

function eventMousePos(event) {
    if (event.clientX == null) return Vector.create(event.clientX, event.clientY);
    const rect = event.currentTarget.getBoundingClientRect();
    const eventPos = Vector.create(event.clientX - rect.left, event.clientY - rect.top);
    return eventPos;
}

function canvasMouseWheel(event) {
    const canvas = event.currentTarget;
    const mousePos = eventMousePos(event);
    if (canvas.world != null) {
        const oldWorld = canvas.world.screenToWorld(mousePos);
        for (i = 0; i < Math.abs(event.deltaY); i++) {
            if (event.deltaY < 0)
                canvas.world.scale *= 1.001;
            else
                canvas.world.scale *= 0.999;
        }
        const newWorld = canvas.world.screenToWorld(mousePos);
        canvas.world.offset = Vector.sub(canvas.world.offset, Vector.sub(newWorld, oldWorld));
    }
}

function canvasMouseMove(event) {
    const mousePos = eventMousePos(event);
    const canvas = event.currentTarget;
    if (canvas.isMouseDown) {
        if (canvas.world != null) {
            const oldWorld = canvas.world.screenToWorld(canvas.lastMouse);
            const newWorld = canvas.world.screenToWorld(mousePos);
            canvas.world.offset = Vector.sub(canvas.world.offset, Vector.sub(newWorld, oldWorld));
        }
        canvas.lastMouse = mousePos;
        canvas.mouseMoved = true;
    }

    if (canvas.world != null) {
        let nearestSquaredDist = Number.MAX_VALUE;
        let nearestRenderable = null;
        for (const renderable of canvas.world.renderables) {
            const squaredDist = Vector.magnitudeSquared(Vector.sub(mousePos, renderable.getScreenPos(canvas.world)));
            if (squaredDist < nearestSquaredDist)
            {
                const hitRadius = renderable.getScreenHitRadius();
                const hitRadiusSquared = hitRadius * hitRadius;
                if (squaredDist < hitRadiusSquared)
                {
                    nearestSquaredDist = squaredDist;
                    nearestRenderable = renderable;
                }
            }
        }

        if (nearestRenderable != null) {
            document.getElementById('statusBar').innerText = nearestRenderable.getTooltipText();
            canvas.hoverRenderable = nearestRenderable;
        } else {
            document.getElementById('statusBar').innerText = ``;
            canvas.hoverRenderable = null;
        }
    }
};

function pushWorld(canvas, world) {
    if (canvas.world) {
        canvas.worldStack.push(canvas.world);
    }

    canvas.world = world;
}

function popWorld(canvas) {
    if (canvas.worldStack.length == 0) return;
    canvas.world = canvas.worldStack.pop();
}

function render(ctx) {
    requestAnimationFrame(() => render(ctx));

    if (ctx.canvas.world != null) {
        ctx.canvas.world.render(ctx);
    } else {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    renderDebug(ctx);
}

function renderDebug(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    renderDebugTarget(ctx, Vector.create(0, 0));
    renderDebugTarget(ctx, Vector.create(width, 0));
    renderDebugTarget(ctx, Vector.create(0, height));
    renderDebugTarget(ctx, Vector.create(width, height));
    renderDebugTarget(ctx, Vector.create(width/2, height/2));
    renderDebugTarget(ctx, Vector.create(width-1, height/2));
    renderDebugTarget(ctx, Vector.create(width/2, height-1));
}

function renderDebugTarget(ctx, pos) {
    pos.x += 0.5;
    pos.y += 0.5;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 13, 0, 2 * Math.PI);
    ctx.moveTo(pos.x - 20, pos.y);
    ctx.lineTo(pos.x + 20, pos.y);
    ctx.moveTo(pos.x + 20, pos.y);
    ctx.lineTo(pos.x - 20, pos.y);
    ctx.moveTo(pos.x, pos.y - 20);
    ctx.lineTo(pos.x, pos.y + 20);
    ctx.moveTo(pos.x, pos.y + 20);
    ctx.lineTo(pos.x, pos.y - 20);
    ctx.closePath();

    ctx.strokeWidth = 1;
    ctx.strokeStyle = rgb(255, 0, 255);
    ctx.stroke();
}

class Api {
    static baseUrl = "https://api.spacetraders.io/v2/";
    static authKey = null;

    static fixBase(url) {
        try {
            new URL(url);
            return url;
        }
        catch (error) {
            return Api.baseUrl + url;
        }
    }

    static async callApiPaged(url, method, bodyJsonObj) {
        url = this.fixBase(url);

        const data = [];
        const limit = 20;
        let page = 1;
        let json;
        do {
            url = new URL(url);
            url.searchParams.set('limit', limit);
            url.searchParams.set('page', page);
            url = url.toString();

            const response = await Api.callApi(url, method, bodyJsonObj)
            if (response.status == 404) {
                throw "Could not load data from " + url;
            }
            json = await response.json();
            data.push(...json.data);
            page++;
        } while (json.meta.page < json.meta.total / json.meta.limit);

        return data;
    }

    static async callApi(url, method, bodyJsonObj) {
        url = this.fixBase(url);

        const headers = {
            "Accept": "application/json"
        }
        if (Api.authKey) {
            headers["Authorization"] = "Bearer " + Api.authKey;
        }
        const options = {
            headers: headers,
        };
        if (method) {
            options.method = method
        }
        if (bodyJsonObj) {
            options.body = JSON.stringify(bodyJsonObj);
        }
        return await fetch(url, options);
    }

    static async fetchGalaxy() {
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
        return JSON.parse(result);
    }

    static async fetchSystem(systemSymbol) {
        const response = await Api.callApi(`systems/${systemSymbol}`);
        if (response.status != 200) {
            throw "Could not load system data: " + await response.text();
        }
        const json = await response.json();
        const system = json.data;

        system.waypoints = await Api.callApiPaged(`systems/${system.symbol}/waypoints`)
    
        let waypointMap = { [system.symbol]: system };
        system.waypoints.forEach(w => waypointMap[w.symbol] = w);

        Object.values(waypointMap).forEach(w => w.children = []);
        system.waypoints.forEach(w => {
            // get parent symbol
            let parentSymbol = w.orbits;
            if (parentSymbol == null) parentSymbol = system.symbol;
    
            // add parent-child
            w.parent = waypointMap[parentSymbol];
            waypointMap[parentSymbol].children.push(w);
        });

        // if (system.children[0]) {
        //     for (let i = 0; i < 20; i++) {
        //         system.children[0].children.push({
        //             "systemSymbol": system.children[0].systemSymbol,
        //             "symbol": "test " + i,
        //             "type": "MOON",
        //             "x": system.children[0].x,
        //             "y": system.children[0].y,
        //             "orbitals": [],
        //             "traits": [{symbol: "TEST", name: "test"}],
        //             "faction": [],
        //             parent: system.children[0],
        //             children: []
        //         });
        //     }
        // }            
    
        return system;
    }
}

class Renderable {
    getAbsoluteWorldPos() {
        throw "Not implemented";
    }

    getScreenPos(world) {
        throw "Not implemented";
    }

    render(ctx, pass, world) {     
        throw "Not implemented";
    }

    getScreenHitRadius() {
        throw "Not implemented";
    }

    getTooltipText() {
        throw "Not implemented";
    }
}

class RenderableSystem extends Renderable {
    static radius = 4;

    constructor(system, asOrigin) {
        super();
        this.system = system;
        this.asOrigin = asOrigin;
    }

    getAbsoluteWorldPos() {
        if (this.asOrigin) return Vector.create(0, 0);
        return Vector.create(this.system.x, this.system.y);
    }

    getScreenPos(world) {
        if (!this.asOrigin)
            return world.worldToScreen(Vector.create(this.system.x, this.system.y));

        return world.worldToScreen(Vector.create(0, 0));
    }

    getScreenHitRadius() {
        return RenderableSystem.radius * 4;
    }

    getTooltipText() {
        return `${this.system.symbol} ${this.system.type}`;
    }        

    render(ctx, pass, world) {
        if (pass == 0) return true;

        const screenPos = this.getScreenPos(world);

        // draw the system
        ctx.beginPath();
        ctx.arc(
            screenPos.x,
            screenPos.y,
            RenderableSystem.radius,
            0,
            2 * Math.PI);
        ctx.closePath();
        ctx.strokeWidth = 2;
        const starColor = world.getOption('starColor');
        if (starColor == 'type') {
            this.setStyleBySystemType(ctx);
        } else if (starColor == 'faction') {
            this.setStyleBySystemFaction(ctx);
        } else if (starColor == 'waypoints') {
            this.setStyleBySystemWaypoints(ctx);
        } else if (starColor == 'jumpgates') {
            this.setStyleBySystemJumpgates(ctx);
        }
        ctx.stroke();
        ctx.fill();
    }

    setStyleBySystemJumpgates(ctx) {
        ctx.strokeStyle = rgba(255, 255, 255, 0.5);
        const hasJumpgate = this.system.waypoints.some(w => w.type == 'JUMP_GATE');
        if (hasJumpgate) {
            ctx.fillStyle = rgb(48, 128, 48);
        } else {
            ctx.fillStyle = rgb(0, 0, 0);
        }
    }        

    setStyleBySystemWaypoints(ctx) {
        ctx.strokeStyle = rgba(255, 255, 255, 0.5);
        const waypointCount = this.system.waypoints?.length ?? 0;
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

    setStyleBySystemType(ctx) {
        ctx.strokeStyle = rgba(255, 255, 255, 0.1);
        switch (this.system.type) {
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
                ctx.strokeStyle = rgba(255, 255, 255, 1);
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
    }

    setStyleBySystemFaction(ctx) {
        ctx.strokeStyle = rgba(255, 255, 255, 1);
        if (this.system.factions?.length > 1) {
            throw 'multiple factions: ' + JSON.stringify(this.system);
        }
        const faction = this.system.factions[0]?.symbol ?? null;
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
                ctx.strokeStyle = rgba(255, 255, 255, 0.2);
                ctx.fillStyle = rgba(0, 0, 0, 0);
                break;
            default:
                ctx.fillStyle = rgb(255, 255, 255);
                console.log("Unknown system faction: " + faction);
                break;
        }
    }
}

class RenderableWaypoint extends Renderable {
    static radius = 6;

    constructor(waypoint) {
        super();
        this.waypoint = waypoint;
    }

    getAbsoluteWorldPos() {
        return Vector.create(this.waypoint.x, this.waypoint.y);
    }
    
    getScreenPos(world) {
        let system = this.waypoint;
        while (system.parent != null) system = system.parent;

        // if this is a top level waypoint, it's just world to screen
        if (this.waypoint.parent == system)
            return world.worldToScreen(Vector.create(this.waypoint.x, this.waypoint.y));

        
        // For children, it's screenspace offset from parent    
        if (this.waypoint.parent != null && this.waypoint.parent != system) {
            // If the renderable has a parent, and it's not the star, it's a moon or something
            // as such, offset the screen position by the index in the parent's children

            const parentPos = world.worldToScreen(Vector.create(this.waypoint.parent.x, this.waypoint.parent.y));
            const idx = this.waypoint.parent.children.indexOf(this.waypoint);
            const idxToSin = -(idx * ((Math.PI * 2) / 8.5));
            const idxToMult = (RenderableWaypoint.radius * 4) + (idx * RenderableWaypoint.radius * 1);

            const offset = Vector.mult(Vector.create(Math.cos(idxToSin), Math.sin(idxToSin)), idxToMult);
            return Vector.add(parentPos, offset);
        }
        else
        {
            return world.worldToScreen(Vector.create(this.waypoint.x, this.waypoint.y));
        }
    }

    getScreenHitRadius() {
        return RenderableWaypoint.radius * 4;
    }

    getTooltipText() {
        return `${this.waypoint.symbol} ${this.waypoint.type} [${this.waypoint.traits.map(t => t.name).join(", ")}]`;
    }        

    render(ctx, pass, world) {
        const screenPos = this.getScreenPos(world);

        let system = this.waypoint;
        while (system.parent != null) system = system.parent;

        // draw the orbit only if there is a parent (the center star doesn't have an orbit)
        if (pass == 0 && this.waypoint.parent != null) {
            ctx.beginPath();
            let originPos;
            if (this.waypoint.parent == system) {
                originPos = world.worldToScreen(Vector.create(0, 0));
            }
            else {
                originPos = world.worldToScreen(Vector.create(this.waypoint.parent.x, this.waypoint.parent.y));
            }
            ctx.arc(
                originPos.x,
                originPos.y,
                Vector.magnitude(Vector.sub(screenPos, originPos)),
                0,
                2 * Math.PI);
            ctx.strokeWidth = 1;
            ctx.strokeStyle = rgb(64, 64, 64);
            ctx.closePath();
            if (this.waypoint.parent == system)
                ctx.setLineDash([10, 5]); // dashed lines for planets
            ctx.stroke();
            ctx.setLineDash([]);
        }

        if (pass == 0) return true;

        // draw the waypoint
        ctx.beginPath();
        ctx.arc(
            screenPos.x,
            screenPos.y,
            RenderableWaypoint.radius,
            0,
            2 * Math.PI);
        ctx.closePath();
        ctx.strokeWidth = 2;
        ctx.strokeStyle = rgb(255, 255, 255);
        switch (this.waypoint.type) {
            default:
                ctx.fillStyle = rgb(0, 0, 255);
                break;
        }
        ctx.stroke();
        ctx.fill();
    }
}

async function delay(ms) {
    await new Promise(r => setTimeout(r, ms));
}

class World {
    /** @param {Renderable[]} renderables */
    constructor(renderables, globalOptions) {
        this.renderables = renderables;
        this.options = {
            global: globalOptions
        }

        this.scale = 1;
        this.offset = Vector.create(0, 0);
        this.computeWorldBounds();
    }

    computeWorldBounds() {
        this.worldMin = Vector.create(Number.MAX_VALUE, Number.MAX_VALUE);
        this.worldMax = Vector.create(Number.MIN_VALUE, Number.MIN_VALUE);
        for (const renderable of this.renderables) {
            const pos = renderable.getAbsoluteWorldPos();
            this.worldMin.x = Math.min(this.worldMin.x, pos.x);
            this.worldMax.x = Math.max(this.worldMax.x, pos.x);
            this.worldMin.y = Math.min(this.worldMin.y, pos.y);
            this.worldMax.y = Math.max(this.worldMax.y, pos.y);
        }
    
        if (this.worldMin.x == Number.MAX_VALUE) this.worldMin.x = -1;
        if (this.worldMin.y == Number.MAX_VALUE) this.worldMin.y = -1;
        if (this.worldMax.x == Number.MIN_VALUE) this.worldMax.x = 1;
        if (this.worldMax.y == Number.MIN_VALUE) this.worldMax.y = 1;
    }

    setFullView(margins, canvas) {
        // identity
        this.offset = Vector.create(0, 0);
        this.scale = 1;
    
        const screenPointMin = Vector.create(0, 0);
        const screenPointMax = Vector.create(canvas.width, canvas.height);

        const screenPointMinWithMargin = Vector.add(screenPointMin, margins);
        const screenPointMaxWithMargin = Vector.sub(screenPointMax, margins);
    
        // Compute the scale based on the ratio of screen distances to world distances
        const screenDist = Vector.sub(screenPointMaxWithMargin, screenPointMinWithMargin);
        const worldDist = Vector.sub(this.worldMax, this.worldMin);
        const scaleX = screenDist.x / worldDist.x;
        const scaleY = screenDist.y / worldDist.y;
        this.scale = Math.min(scaleX, scaleY);
    
        // Offset is the world center distance from the screen center
        const screenCenter = Vector.add(screenPointMinWithMargin, Vector.div(Vector.sub(screenPointMaxWithMargin, screenPointMinWithMargin), 2));
        const worldCenter = Vector.add(this.worldMin, Vector.div(Vector.sub(this.worldMax, this.worldMin), 2));
        this.offset = Vector.sub(worldCenter, this.screenToWorld(screenCenter));
    }

    screenToWorld(pos) {
        pos = Vector.div(pos, this.scale);
        pos = Vector.add(pos, this.offset);
        return pos;
    }
    
    worldToScreen(pos) {
        pos = Vector.sub(pos,  this.offset);
        pos = Vector.mult(pos, this.scale);
        return pos;
    }

    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let pass = 0;
        let needPass = this.renderables ?? [];
        do {
            let thisPass = needPass;
            needPass = [];
            for (const renderable of thisPass) {
                if (renderable.render(ctx, pass, this)) {
                    needPass.push(renderable);
                }
            }
            pass++;
        } while (needPass.length > 0);
    }

    getOption(optionName) {
        return this.options[optionName] ?? this.options.global[optionName];
    }

    click(event) {
    }
}

class SystemWorld extends World {
}

class GalaxyWorld extends World {
    click(event) {
        const canvas = event.currentTarget;
        if (canvas.hoverRenderable == null) return;

        canvas.worldCache = canvas.worldCache ?? {};
        const world = canvas.worldCache[canvas.hoverRenderable.system.symbol];
        if (world) {
            pushWorld(canvas, world);
            canvasMouseMove(event);
            return;
        }

        const safeEvent = copyEvent(event);
        Api.fetchSystem(canvas.hoverRenderable.system.symbol)
            .then(system => {
                const renderables = [];
                renderables.push(new RenderableSystem(system, true));
                function addChildren(waypoint) {
                    waypoint.children.forEach(w => {
                        renderables.push(new RenderableWaypoint(w))
                        addChildren(w);
                    });
                }
                addChildren(system);

                const world = new SystemWorld(renderables, canvas.gameOptions);
                const margins = Vector.create(150, 150);
                world.setFullView(margins, canvas);
                canvas.worldCache[system.symbol] = world;
                pushWorld(canvas, world);
                canvasMouseMove(safeEvent);
            });        
    }
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

function rgba(r, g, b, a) {
    return `rgb(${r},${g},${b},${a})`;
}
