/*
 * Copyright (C) 2013 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @constructor
 * @param {!function()} onHide
 * @extends {WebInspector.HelpScreen}
 */
WebInspector.JSODScreen = function(onHide, name, value)
{
    WebInspector.HelpScreen.call(this);
    this.element.id = "JSOD-screen";

    /** @type {function()} */
    this._onHide = onHide;

    this._tabbedPane = new WebInspector.TabbedPane();
    this._tabbedPane.element.classList.add("help-window-main");
    this._tabbedPane.element.appendChild(this._createCloseButton());

    WebInspector.JSODScreen.Tabs.JSOD = '';
    var jsodTab = new WebInspector.JSODTab(name, value);
    this._tabbedPane.appendTab(WebInspector.JSODScreen.Tabs.JSOD, WebInspector.JSODScreen.Tabs.JSOD, jsodTab);
    this._tabbedPane.selectTab(jsodTab.id);

    this._tabbedPane.shrinkableTabs = false;
    this._tabbedPane.verticalTabLayout = true;
}

WebInspector.JSODScreen.prototype = {
    /**
     * @override
     */
    wasShown: function()
    {
        this._tabbedPane.show(this.element);
        WebInspector.HelpScreen.prototype.wasShown.call(this);
    },

    /**
     * @override
     * @return {boolean}
     */
    isClosingKey: function(keyCode)
    {
        return [
            WebInspector.KeyboardShortcut.Keys.Enter.code,
            WebInspector.KeyboardShortcut.Keys.Esc.code,
        ].indexOf(keyCode) >= 0;
    },

    /**
     * @override
     */
    willHide: function()
    {
        this._onHide();
        WebInspector.HelpScreen.prototype.willHide.call(this);
    },

    __proto__: WebInspector.HelpScreen.prototype
}

WebInspector.JSODScreen.Tabs = {
    JSOD: ""
}

WebInspector.JSODTab = function(name, value) {
    WebInspector.VBox.call(this);
    this.value = value;

    var toolbar = this.element.createChild("div");
    toolbar.classList.add('JSOD-toolbar');

    var table = toolbar.createChild("table");
    table.classList.add('JSOD-table');
    table.setAttribute('align', 'center');

    var tr1 = table.createChild("tr");
    tr1.createChild("td");
    tr1.createChild("td");
    tr1.createChild("td");
    var tr1td4 = tr1.createChild("td");
    var panNorthWestButton = tr1td4.createChild("button");panNorthWestButton.classList.add('JSOD-button');panNorthWestButton.createTextChild('\u25E4');
    var tr1td5 = tr1.createChild("td");
    var panNorthButton = tr1td5.createChild("button");panNorthButton.classList.add('JSOD-button');panNorthButton.createTextChild('\u25B2');
    var tr1td6 = tr1.createChild("td");
    var panNorthEastButton = tr1td6.createChild("button");panNorthEastButton.classList.add('JSOD-button');panNorthEastButton.createTextChild('\u25E5');
    tr1.createChild("td");
    tr1.createChild("td");
    tr1.createChild("td");

    var tr2 = table.createChild("tr");
    var tr2td1 = tr2.createChild("td");
    var zoomOutButton = tr2td1.createChild("button");zoomOutButton.classList.add('JSOD-button');zoomOutButton.createTextChild('\uFF0D');
    var tr2td2 = tr2.createChild("td");
    var zoomRange     = tr2td2.createChild("input");zoomRange.classList.add('JSOD-range');zoomRange.setAttribute("type", "range");zoomRange.setAttribute("min", "-3");zoomRange.setAttribute("max", "3");
    var tr2td3 = tr2.createChild("td");
    var zoomInButton  = tr2td3.createChild("button");zoomInButton.classList.add('JSOD-button');zoomInButton.createTextChild('\uff0b');
    var tr2td4 = tr2.createChild("td");
    var panWestButton = tr2td4.createChild("button");panWestButton.classList.add('JSOD-button');panWestButton.createTextChild('\u25c0');
    var tr2td5 = tr2.createChild("td");
    var homeButton = tr2td5.createChild("button");homeButton.classList.add('JSOD-button');homeButton.createTextChild('\u25A3');
    var tr2td6 = tr2.createChild("td");
    var panEastButton = tr2td6.createChild("button");panEastButton.classList.add('JSOD-button');panEastButton.createTextChild('\u25B6');
    var tr2td7 = tr2.createChild("td");
    var expressionInput = tr2td7.createChild("input");
    expressionInput.setAttribute('type', 'text');
    var tr2td8 = tr2.createChild("td");
    var evaluateExpression = tr2td8.createChild("button");evaluateExpression.classList.add('JSOD-button');evaluateExpression.createTextChild('=');
    var tr2td9 = tr2.createChild("td");
    var resultValue = tr2td9.createChild("input");
    resultValue.setAttribute('type', 'text');
    resultValue.setAttribute('size', '20');
    resultValue.setAttribute('readonly', 'true');

    var tr3 = table.createChild("tr");
    tr3.createChild("td");
    var tr3d2 = tr3.createChild("td");
    var zoomPercent = tr3d2.createChild("span");
    zoomPercent.textContent = '100%';
    tr3.createChild("td");
    var tr3td4 = tr3.createChild("td");
    var panSouthWestButton = tr3td4.createChild("button");panSouthWestButton.classList.add('JSOD-button');panSouthWestButton.createTextChild('\u25E3');
    var tr3td5 = tr3.createChild("td");
    var panSouthButton = tr3td5.createChild("button");panSouthButton.classList.add('JSOD-button');panSouthButton.createTextChild('\u25BC');
    var tr3td6 = tr3.createChild("td");
    var panSouthEastButton = tr3td6.createChild("button");panSouthEastButton.classList.add('JSOD-button');panSouthEastButton.createTextChild('\u25E2');
    tr3.createChild("td");
    tr3.createChild("td");
    tr3.createChild("td");

    this.element.createChild("hr")

    var svgDiv= this.element.createChild("div");
    svgDiv.classList.add('JSOD');

    $(svgDiv).svg(function(svg) {

        var zoomlevel = 1.0;
        var ox = 0;
        var oy = 0;

        var zoomlevel = 1.0;

        var ox = 0;
        var oy = 0;
        var panzoom = function() {
            $(svg.root().childNodes[1]).animate({svgTransform:'translate(' + ox + ',' + oy + ') scale(' + zoomlevel + ')'}, 0);
        }

        var zoomPercents = [0.25, 0.50, 0.75, 1.00, 1.25, 1.5, 2.00];
        var zoom = function(level) {
            zoomPercent.textContent = '' + (zoomPercents[parseInt(level)+3] * 100) + '%';
            zoomlevel = zoomPercents[parseInt(level)+3];
            panzoom();
        }

        var zoomIn = function() {
            var zoomedAt = zoomRange.value;
            zoomedAt = Math.min(zoomedAt, 3);
            zoomedAt = Math.max(zoomedAt, -3);
            zoomedAt++;
            zoomedAt = Math.min(zoomedAt, 3);
            zoomedAt = Math.max(zoomedAt, -3);
            zoomRange.value = zoomedAt;
            zoom(zoomRange.value);
        }

        var zoomTo = function() {
            zoom(zoomRange.value);
        }

        var zoomOut = function() {
            var zoomedAt = zoomRange.value;
            zoomedAt = Math.min(zoomedAt, 3);
            zoomedAt = Math.max(zoomedAt, -3);
            zoomedAt--;
            zoomedAt = Math.min(zoomedAt, 3);
            zoomedAt = Math.max(zoomedAt, -3);
            zoomRange.value = zoomedAt;
            zoom(zoomRange.value);
        }

        var pan = function(dx, dy) {
            ox += dx;
            oy += dy;
            panzoom();
        }

        var panNorthWest = function() {
            pan(-100, -100);
        }

        var panNorth = function() {
            pan(0, -100);
        }

        var panNorthEast = function() {
            pan(+100, -100);
        }

        var panWest = function() {
            pan(-100, 0);
        }

        var homeClicked = false;
        var home = function() {
            ox = 0;
            oy = 0;
            if (homeClicked) {
                homeClicked = false;
                homeButton.classList.remove('JSOD-home-clicked');
                zoomRange.value = 0;
                zoomTo();
            } else {
                panzoom();
                homeClicked = true;
                homeButton.classList.add('JSOD-home-clicked');
                setTimeout(function() {
                    homeClicked = false;
                    homeButton.classList.remove('JSOD-home-clicked');
                }, 1000);
            }
        }

        var panEast = function() {
            pan(100, 0);
        }

        var panSouthWest = function() {
            pan(-100, +100);
        }

        var panSouth = function() {
            pan(0, +100);
        }

        var panSouthEast = function() {
            pan(100, +100);
        }

        $(zoomInButton).on('click', zoomIn);
        $(zoomRange).on('change', zoomTo);
        $(zoomOutButton).on('click', zoomOut);

        $(panNorthWestButton).on('click', panNorthWest);
        $(panNorthButton).on('click', panNorth);
        $(panNorthEastButton).on('click', panNorthEast);
        $(panWestButton).on('click', panWest);
        $(homeButton).on('click', home);
        $(panEastButton).on('click', panEast);
        $(panSouthWestButton).on('click', panSouthWest);
        $(panSouthButton).on('click', panSouth);
        $(panSouthEastButton).on('click', panSouthEast);

        var defs = svg.defs(null, "jsoddefs")
        var arrow = svg.marker(defs, 'arrow', 9, 6, 13, 13);
        var arrowHead = svg.createPath();
        svg.path(arrow, arrowHead.move(2,2).line(2,11).
        line(10, 6).line(2,2).close(), {fill: '#000000'});
        var g = svg.group({fontFamily: 'Courier', fontSize: '12'});

        var dragging = false;
        var dragStartX = 0;
        var dragStartY = 0;
        $(svg.root()).on('mousedown', function(e) {
            dragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            svg.root().classList.add('JSOD-dragging');
        });
        $(svg.root()).on('mouseup', function(e) {
            if (dragging) {
                svg.root().classList.remove('JSOD-dragging');
                pan(e.clientX - dragStartX, e.clientY - dragStartY);
                dragStartX = 0;
                dragStartY = 0;
            }
            dragging = false;
        });

        $(svg.root()).on('mousewheel', function(e) {
            var delta = 50;
            if (e.originalEvent.wheelDeltaX === 0) {
                if (e.originalEvent.wheelDeltaY > 0) {
                    if (e.ctrlKey) {
                        zoomIn();
                        e.preventDefault();
                    } else {
                        pan(0, -delta);
                    }
                    e.stopPropagation();
                } else if (e.originalEvent.wheelDeltaY < 0) {
                    if (e.ctrlKey) {
                        zoomOut();
                        e.preventDefault();
                    } else {
                        pan(0, delta);
                    }
                    e.stopPropagation();
                }
            } else {
                if (e.originalEvent.wheelDeltaX > 0) {
                    pan(-delta, 0);
                    e.stopPropagation();
                } else if (e.originalEvent.wheelDeltaX < 0) {
                    pan(delta, 0);
                    e.stopPropagation();
                }
            }
        });

        function drawGraph(svg, gr, name, value) {
            if (value) {
                var boxWidth = 320;
                var boxHeight = 24;
                var x = boxWidth/4;
                var y = boxHeight;
                drawJavascriptObject(svg, gr, name, value, x, y, boxWidth, boxHeight);
            }
        }

        function clear() {
            if (g) {
                while (g.firstChild) {
                    g.removeChild(g.firstChild);
                }
            }
        }

        var loadProperty = function(propertyLabel, propetyValue, e) {
            e.stopPropagation();
            e.preventDefault();
            expressionInput.value = '';
            drawGraph(svg, g, propertyLabel, propetyValue);
        }

        function evaluate() {
            function expressionEvaluated(e) {
                try {
                    if (e && e.data) {
                        clear();
                        if (e.data.wasThrown) {
                            expressionInput.classList.add('JSOD-error');
                        }
                        if (e.data.result.type === 'object' || e.data.result.type === 'function') {
                            drawGraph(svg, g, expressionInput.value, e.data.result);
                        } else {
                            resultValue.value = '' + e.data.result.value;
                        }
                    }
                } finally {
                    WebInspector.console.removeEventListener(WebInspector.ConsoleModel.Events.CommandEvaluated, expressionEvaluated, this);
                }
            }
            if (expressionInput.value) {
                WebInspector.console.addEventListener(WebInspector.ConsoleModel.Events.CommandEvaluated, expressionEvaluated, this);
                WebInspector.console.evaluateCommand(expressionInput.value, true);
            }
        }
        $(evaluateExpression).on('click', evaluate);

        function evaluateOnEnter(e) {
            expressionInput.classList.remove('JSOD-error');
            resultValue.value = '';
            if (e.keyCode === 13) {
                noop(e);
                evaluate();
                return;
            }

        }

        function noop(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        $(expressionInput).on('keydown', evaluateOnEnter);

        function drawJavascriptObject(svg, gr, label, value, ox, oy, boxWidth, boxHeight) {
            var g = svg.group(gr, 'g', {fontFamily: 'Courier', fontSize: '12'});

            function functionName(functionString) {
                try {
                    return /^function\s*(([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\([^)]*\))\s*/.exec('' + functionString)[1];
                } catch(e) {
                    return functionString.substring(9, 39);
                }
            }

            function doDrawJavascriptObjectProperties(x, y, borderColor, properties, internalProperties) {
                var props = [];
                var tooltip;

                function compareText(a, b) {
                    return a.text.localeCompare(b.text);
                }
                for(var prop = 0; prop < properties.length; prop++) {
                    var propName = properties[prop].name;
                    var propValue = properties[prop].value;
                    // Skip __proto__ as we already rendered it above
                    if ('__proto__' == propName) {
                        continue;
                    }

                    if (propValue) {
                        if (propValue.type === 'function') {
                            continue;
                        } else if (propValue.type === 'object') {
                            props.push({text:propName + 'O', value: propValue});
                        } else if (propValue.type === 'number') {
                            props.push({text:propName + ' : ' + propValue.value + '#', value: propValue});
                        } else if (propValue.type === 'string') {
                            props.push({text:propName + ' : \'' + propValue.value.substring(0,36) + '\'S', value: propValue});
                        } else {
                            props.push({text:propName + ' : ' + propValue.value + (propValue.type === 'boolean' ? 'B' : '-'), value: propValue});
                        }
                    }
                }
                props.sort(compareText);

                var funcs = [];
                for(var prop = 0; prop < properties.length; prop++) {
                    var propName = properties[prop].name;
                    var propValue = properties[prop].value;

                    if (propValue) {
                        if (propValue.type == "function") {
                            funcs.push({text:propName + '()F', value: propValue});
                        }
                    }
                }
                funcs.sort(compareText);

                props = props.concat(funcs);

                for(var i = 0; i < props.length; i++) {
                    y += boxHeight;
                    var text = props[i].text;
                    var type = text.substring(text.length - 1);
                    text = text.substring(0, text.length - 1);
                    var propertyLabel = text;
                    var propetyValue = props[i].value;
                    tooltip = text;
                    if (type == 'O' || type === 'A' || type === 'F' || type === 'N') {
                    } else {
                        text = text.substring(0, text.indexOf(' : ') + 30);
                    }
                    var rect = svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: borderColor, strokeWidth: '1'});
                    svg.title(rect, tooltip);
                    svg.text(g, x+20, y+16, text, {fill: 'black'});

                    if (type === 'A') {
                        svg.text(g, x+5, y+15, '[]', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                    } else if (type === 'O') {
                        svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                    } else if (type === 'S') {
                        svg.text(g, x+5, y+15, '\'\'', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                    } else if (type === 'F') {
                        svg.text(g, x+5, y+15, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                    } else if (type === 'B') {
                        svg.text(g, x+4, y+15, '0|1', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                    } else if (type === '#') {
                        svg.text(g, x+7, y+15, '#', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                    } else if (type === '-') {
                        svg.text(g, x+6, y+15, '-', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                    } else if (type === 'N') {
                    }
                    if (type === 'O' || type === 'A' || type === 'F') {
                        var loadButton = svg.rect(g, x+boxWidth-20, y+(boxHeight/2)-8, 16, 16, {fill: 'WhiteSmoke', stroke: 'lightgray', strokeWidth: '1'});
                        $(loadButton).on('click', loadProperty.bind(this, propertyLabel, propetyValue));
                    }
                }
            }

            function doDrawJavascriptObject(ox, oy, value, properties, internalProperties, hasConstructorAsOwnProperty, __proto__Object, constructorObject, __proto____proto__Object) {
                var x = ox;
                var y = oy;
                // Normal object i.e. not a prototype like
                // i.e. does not have constructor as it's own property
                if (!hasConstructorAsOwnProperty) {

                    svg.line(g, x-(boxWidth/4), y+12, x, y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});
                    svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black', strokeWidth: '1'});

                    if (value.type === "object" && value.subtype == "array") {
                        svg.text(g, x+5, y+16, '[]', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        svg.text(g, x+20, y+16, label + ' : ' + value.description, {fill: 'black'});
                    } else if (value.type === "function") {
                        svg.text(g, x+5, y+16, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        svg.text(g, x+20, y+16, label + ' : ' + functionName(value.description), {fill: 'black'});
                    } else {
                        svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        svg.text(g, x+20, y+16, label + ' : ' + value.description, {fill: 'black'});
                    }

                    if (__proto__Object) {
                        y += boxHeight;
                        svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray', fill: 'ivory'});
                        svg.text(g, x+5, y+16, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        svg.text(g, x+20, y+16, 'constructor : ' + (value.constructor.name || ''), {fill: 'lightGray'});
                        if (constructorObject) {
                            var cfr = svg.line(g, x+boxWidth, y+12, x+(3*boxWidth), y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});
                            svg.title(cfr, 'Inherited constructor property - reference to Constructor function.');
                        }

                        y += boxHeight;
                        svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black'});
                        svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                        svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});
                        if (__proto__Object) {
                            var pr = svg.line(g, x+boxWidth, y+12, x+(boxWidth+(boxWidth/4)), y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});
                            svg.title(pr, 'Hidden reference to prototype object.');
                        }
                    }

                    doDrawJavascriptObjectProperties(x, y, 'black', properties, internalProperties);
                }

                if (!hasConstructorAsOwnProperty  && !__proto__Object ) {
                    return;
                }

                // prototype object
                if (hasConstructorAsOwnProperty) {
                    x = ox;
                    y = oy + 2*boxHeight;
                } else {
                    x = ox+boxWidth+boxWidth/4;
                    y = oy + 2*boxHeight;
                }

                if (hasConstructorAsOwnProperty) {
                    var tp = svg.line(g, x-(boxWidth/4), y+12-(2*boxHeight), x-(boxWidth/8), y+12-(2*boxHeight), {stroke: 'black'});
                    var tp = svg.line(g, x-(boxWidth/8), y+12-(2*boxHeight), x, y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});
                }
                svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray', strokeWidth: '1'});
                svg.text(g, x+6, y+15, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                if (__proto____proto__Object && __proto____proto__Object.description) {
                    svg.text(g, x+20, y+16, '{} : ' + __proto____proto__Object.description, {fill: 'black'});
                } else {
                    svg.text(g, x+20, y+16, '{} : ' + __proto__Object.description, {fill: 'black'});
                }
                var c2pr = svg.line(g, x+(boxWidth+(boxWidth/4)), y+12, x+boxWidth, y+12, {stroke: 'black', markerEnd: 'url(#arrow)'});
                svg.title(c2pr, 'Reference to prototype object from Constructor function.');

                y += boxHeight;
                svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray'});
                svg.text(g, x+5, y+15, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                svg.text(g, x+20, y+16, 'constructor', {fill: 'black'});
                var p2cr = svg.line(g, x+boxWidth, y+12, x+(boxWidth+(boxWidth/8)), y+12,  {stroke: 'black'});
                svg.title(p2cr, 'Reference to Constructor function.');
                p2cr = svg.line(g, x+(boxWidth+(boxWidth/8)), y+12, x+(boxWidth+(boxWidth/8)), y-(boxHeight+(boxHeight/2)),  {stroke: 'black'});
                svg.title(p2cr, 'Reference to Constructor function.');
                p2cr = svg.line(g, x+(boxWidth+(boxWidth/8)), y-(boxHeight+(boxHeight/2)), x+(boxWidth+(boxWidth/4)), y-(boxHeight+(boxHeight/2)), {stroke: 'black', markerEnd: 'url(#arrow)'});
                svg.title(p2cr, 'Reference to Constructor function.');
                y += boxHeight;
                svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray'});
                svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                if (__proto____proto__Object) {
                    svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});
                    var ppr = svg.line(g, x+boxWidth, y+12, x+(boxWidth*2.375), y+12,  {stroke: 'black'});
                    svg.title(ppr, 'Hidden reference to prototype object.');
                } else {
                    svg.text(g, x+20, y+16, '__proto__', {fill: 'red'});
                    svg.line(g, x+boxWidth, y+12, x+(boxWidth+(boxWidth/8)), y+12,  {stroke: 'black'});
                    svg.line(g, x+(boxWidth+(boxWidth/8)), y+3, x+(boxWidth+(boxWidth/8)), y+21,  {stroke: 'black'});
                    svg.line(g, x+(boxWidth+(boxWidth/8))+3, y+6, x+(boxWidth+(boxWidth/8))+3, y+18,  {stroke: 'black'});
                    svg.line(g, x+(boxWidth+(boxWidth/8))+6, y+9, x+(boxWidth+(boxWidth/8))+6, y+15,  {stroke: 'black'});
                }

                if (hasConstructorAsOwnProperty) {
                    doDrawJavascriptObjectProperties(x, y, 'gray', properties, internalProperties);
                } else {
                    function get__proto__Properties(x, y, properties, internalProperties) {
                        doDrawJavascriptObjectProperties(x, y, 'gray', properties, internalProperties);
                    }
                    WebInspector.RemoteObject.loadFromObjectPerProto(__proto__Object, get__proto__Properties.bind(this, x, y));
                }

                if (hasConstructorAsOwnProperty) {
                    x = ox+boxWidth+boxWidth/4;
                    y = oy;
                } else {
                    x = ox+boxWidth+boxWidth/4+boxWidth+boxWidth/4;
                    y = oy;
                }

                // Constructor function
                y += boxHeight;
                y -= boxHeight;
                svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
                svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                svg.text(g, x+20, y+16, '__proto__', {fill: 'lightGray'});

                y += boxHeight;
                svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
                svg.text(g, x+5, y+16, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                svg.text(g, x+20, y+16, 'function ' + functionName(constructorObject.description), {fill: 'black'});
                y += boxHeight;
                svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
                svg.text(g, x+20, y+16, 'prototype', {fill: 'black'});
                svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                // y += boxHeight;
                // svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
                // svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                // svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});

                function getConstructorObjectProperties(x, y, properties, internalProperties) {
                    doDrawJavascriptObjectProperties(x, y, 'lightGray', properties, internalProperties);
                }
                WebInspector.RemoteObject.loadFromObjectPerProto(constructorObject, getConstructorObjectProperties.bind(this, x, y));
            }

            function callback(ox, oy, value, properties, internalProperties)
            {
                if (!properties)
                    return;

                var hasConstructorAsOwnProperty = false;
                var constructorObject;
                var __proto__Object;
                for(var ci = 0; ci < properties.length; ci++) {
                    if ('constructor' === properties[ci].name) {
                        constructorObject = properties[ci].value;
                        hasConstructorAsOwnProperty = true;
                    } else if ('__proto__' === properties[ci].name && properties[ci].value) {
                        __proto__Object = properties[ci].value;
                    }
                }

                if (hasConstructorAsOwnProperty) {
                    // the value is really the __proto__Object
                    doDrawJavascriptObject(ox, oy, value, properties, internalProperties, hasConstructorAsOwnProperty, value, constructorObject, __proto__Object);
                    // __proto__Object is really the __proto____proto__Object for the next level, so also draw the next level
                    if (__proto__Object) {
                        ox += 800;
                        oy += 96;
                        drawJavascriptObject(svg, gr, '{}', __proto__Object, ox, oy, boxWidth, boxHeight);
                    }
                    return;
                }

                var __proto____proto__Object;
                function get__proto____proto__Object(ox, oy, __proto__properties, internalProperties) {
                    for(var ci = 0; ci < __proto__properties.length; ci++) {
                        if ('constructor' === __proto__properties[ci].name) {
                             constructorObject = __proto__properties[ci].value;
                        }
                        if ('__proto__' === __proto__properties[ci].name && __proto__properties[ci].value) {
                            __proto____proto__Object = __proto__properties[ci].value;
                        }
                    }
                    doDrawJavascriptObject(ox, oy, value, properties, internalProperties, hasConstructorAsOwnProperty, __proto__Object, constructorObject, __proto____proto__Object);
                    // Recurse
                    if (__proto____proto__Object) {
                        // Initially just use the passed in name as label
                        if (hasConstructorAsOwnProperty) {
                            ox += 800;
                        } else {
                            ox += 1200;
                        }
                        oy += 96;
                        drawJavascriptObject(svg, gr, '{}', __proto____proto__Object, ox, oy, boxWidth, boxHeight);
                    }
                }
                if (__proto__Object) {
                    WebInspector.RemoteObject.loadFromObjectPerProto(__proto__Object, get__proto____proto__Object.bind(this, ox, oy));
                } else {
                    doDrawJavascriptObject(ox, oy, value, properties, internalProperties, false);
                }
            }

            WebInspector.RemoteObject.loadFromObjectPerProto(value, callback.bind(this, ox, oy, value));
        }
        expressionInput.value = name;
        if (value.type === 'object' || value.type === 'function') {
            drawGraph(svg, g, name, value);
        } else {
            resultValue.value = '' + value.value;
        }
    });
}

WebInspector.JSODTab.prototype = {
    __proto__: WebInspector.VBox.prototype
}