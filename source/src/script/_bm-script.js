
;(function() {
	/**
  * Blocky Maps, by Cyrus Firheir; for SugarCube v2
  * requires _bm-styles.css and _bm-passage.tw/_bm-passage-twine.txt
  */

	let _bm = {};

	_bm.version = "v1.0.1";

	/**
	* Returns html for drawing map to screen
	* @constructor
	* @param {Object} mapObj - The Map object/JSON to draw on the map.
	* @param {boolean} [load=true] - Whether to skip loading map into $curMap.
	*/
	_bm.drawMap = function(mapObj, load=true) {
		if (!mapObj) return "";
		if (typeof mapObj === "string") mapObj = JSON.parse(mapObj);
		if (load) variables().curMap = mapObj;
		let rows = mapObj.size.rows;
		let cols = mapObj.size.cols;
		let ret = "";
		ret += `<div id="map" class="${mapObj.cssClass ? mapObj.cssClass : ""}">`;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				let cell = `r${r}c${c}`;
				let _o = Object.assign({}, mapObj._default, mapObj[cell]);

				let css = _o.css ? _o.css : "";
				let cssClass = _o.cssClass ? _o.cssClass : "";
				let content = _o.content ? _o.content : "";

				ret += `<span	id="${cell}" class="map-cell ${cssClass}" style="${css}"><span class="content">${content}</span></span>`;
				if (c === cols - 1) ret += `<br>`;
			}
		}
		ret += `</div>`;
		ret = ret.replace(/[\r\n\s]+/g, " ");
		return ret;
	};

	/**
	* Focuses 'camera' on the target block
	* @constructor
	* @param {string} [target="#r0c0"] - The target block.
	*/
	_bm.cameraFollow = function(target = "#r0c0") {
		let _t = $(`#map-container #map ${target}`);
		if (!_t.length) _t = $(`#map-container #map #r0c0`);
		let _pos = _t.attr("id")
									.replace(/r([0-9]+)?c([0-9]+)?/, "$1_$2")
									.split("_")
									.map(el => Number(el));
		let _map = $("#map-container #map");
		let _padding = _map.css("padding");
		let _margin = _t.css("margin");
		let _w = _t.css("width");
		let _h = _t.css("height");
		let _o = $("#map-container").css("transform-origin").split(" ");
		let size = variables().curMap.size;

		_map.css({
			"top": `calc(${_o[1]} - (${_pos[0]} * ${_h}) - (${_h}/2) - (${_pos[0]} * ${_margin} * 2) - (${_padding}*1.5))`,
			"left": `calc(${_o[0]} - (${_pos[1]} * ${_w}) - (${_w}/2) - (${_pos[1]} * ${_margin} * 2) - (${_padding}*1.5))`,
			"min-width": `calc((${size.cols} * (${_w} + (${_margin} * 2)) + 1.5em)`,
			"min-height": `calc((${size.rows} * (${_h} + (${_margin} * 2)) + 1.5em)`
		});
	};

	setup.zoomLevel = 100;

	/**
	* 'Zooms' map in or out.
	* @constructor
	* @param {number} [level=100] - Percentage zoom.
	*/
	_bm.mapZoom = function(level = 100) {
		let _t = $("#map-container");
		if (!_t.length) return;
		_t.css({
			"transform": `scale(${level/100})`
		});
		$(document).trigger(":map-zoomed");
	};

	/**
	* Moves the 'player' to the specified coordinates
	* @constructor
	* @param {string|Array|Object} coords - Destination coordinates.
	* @param {boolean} [override=false] - Whether to move into solid block.
	*/
	_bm.pMoveCoords = function(coords, override=false) {
		let _p = $("#map-container #map .player");
		if (!_p.length) return;
		let _t = _p;
		switch (typeof coords) {
			case "string":
				_t = coords.trim() ? $(`#map-container #map #${coords}`) : _p;
				break;
			case "object":
				if (Array.isArray(coords)) {
					_t = $(`#map-container #map #r${coords[0]}c${coords[1]}`);
				} else {
					_t = $(`#map-container #map #r${coords.row}c${coords.col}`);
				}
				break;
		}
		if (_t.length) {
			if (!_t.hasClass("solid") || override) {
				_p.removeClass("player");
				_t.addClass("player");
			}
		}
		$(document).trigger(":map-moved");
	};

	/**
	* Moves 'player' towards specified direction by specified distance.
	* @constructor
	* @param {string} dir - Direction of movement either of ["up", "down", "left", "right"].
	* @param {number} [dist=1] - Distance in amount of blocks to move in specified irection.
	*/
	_bm.pMove = function(dir, dist=1) {
		if (!$("#map-container #map .player").length || variables().mapEdit) return;
		let rMove = 0;
		let cMove = 0;
		switch (dir) {
			case "up": 			rMove = -1; 	break;
			case "down": 		rMove = 1; 		break;
			case "left": 		cMove = -1; 	break;
			case "right": 	cMove = 1; 		break;
		}
		for (let d = 0; d < dist; d++) {
			let _p = $("#map-container #map .player");
			let _cur = _p.attr("id")
										.replace(/r([0-9]+)?c([0-9]+)?/, "$1_$2")
										.split("_")
										.map(el => Number(el));
			_bm.pMoveCoords([
				_cur[0] + rMove,
				_cur[1] + cMove
			]);
		}
		$(document).trigger(":map-moved");
	};

	/**
	* Loads map and plays the 'bmPlayMap' passage to show the map.
	* @constructor
	* @param {Object} mapObj - Map Object/JSON.
	* @param {coords} [coords=""] - Specific coordinates to start the player at when map is loaded.
	*/
	_bm.gotoMap = function(mapObj, coords="") {
		variables().curMap = mapObj;
		variables().curPos = coords;
		forget("pCurPos");
		$.wiki(`<<goto "bmPlayMap">>`);
	};

	setup.bm = Object.freeze(_bm);
}());


$(window).on("resize", () => setTimeout(() => $(document).trigger(":map-moved"), 200));

$(document).on(":map-moved", function() {
	setup.bm.cameraFollow(".player");

	let _def = variables().curMap._default;

	let _p = $("#map-container #map .player").attr("id");
	variables().curPos = _p;
	$("#cur-block-pos .content").empty().wiki(_p);
	let _cur = variables().curMap[_p];

	let _o = Object.assign({}, _def, _cur);

	$("#cur-block-name .content").empty().wiki(_o.name ? _o.name : "");
	$("#cur-block-desc .content").empty().wiki(_o.desc ? _o.desc : "");
	$("#cur-block-acts .content").empty().wiki(_o.acts ? _o.acts.replace(/[\r\n]+/g, " ") : "");
	$.wiki(_o.trig ? _o.trig : "");

	memorize("pCurPos", _p);
});

$(document).on("keydown", function(ev) {
	switch (ev.code) {
		case "KeyW": case "ArrowUp":
			setup.bm.pMove("up");
			break;
		case "KeyS": case "ArrowDown":
			setup.bm.pMove("down");
			break;
		case "KeyA": case "ArrowLeft":
			setup.bm.pMove("left");
			break;
		case "KeyD": case "ArrowRight":
			setup.bm.pMove("right");
			break;
		case "PageDown":
			setup.zoomLevel -= 10;
			setup.zoomLevel = setup.zoomLevel.clamp(10, 250);
			setup.bm.mapZoom(setup.zoomLevel);
			break;
		case "PageUp":
			setup.zoomLevel += 10;
			setup.zoomLevel = setup.zoomLevel.clamp(10, 250);
			setup.bm.mapZoom(setup.zoomLevel);
			break;
	}
});
