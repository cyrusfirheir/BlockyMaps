
;(function() {
	/*
  * Blocky Maps, by Cyrus Firheir; for SugarCube v2
  * v1.0.0
  * requires _bm-styles.css and _bm-passage-twee.tw/_bm-passage-twine.txt
  */

	let _bm = {};

	_bm.version = "v1.0.0";

	_bm.drawMap = function(mapObj) {
		if (!mapObj) return "";
		if (typeof mapObj === "string") mapObj = JSON.parse(mapObj);
		variables().curMap = mapObj;
		let rows = mapObj.size.rows;
		let cols = mapObj.size.cols;
		let ret = "";
		ret += `<div id="map" class="${mapObj.cssClass ? mapObj.cssClass : ""}">`;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				let cell = `r${r}c${c}`;
				let css, cssClass, _css, _cssClass;
				let content = "";
				if (mapObj._default) {
					_css = mapObj._default.css;
					_cssClass = mapObj._default.cssClass;
					content = mapObj._default.content
										? mapObj._default.content : content;
				}
				if (mapObj[cell]) {
					css = mapObj[cell].css;
					cssClass = mapObj[cell].cssClass;
					content = mapObj[cell].content
										? mapObj[cell].content : content;
				}
				ret += `<span	id="${cell}" class="map-cell ${cssClass? cssClass : _cssClass ? _cssClass : ""}" style="${css ? css : _css ? _css : ""}"><span class="content">${content}</span></span>`;
				if (c === cols - 1) ret += `<br>`;
			}
		}
		ret += `</div>`;
		ret = ret.replace(/[\r\n\s]+/g, " ");
		return ret;
	};

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
			"top": `calc(${_o[1]} - (${_pos[0]} * ${_h}) - (${_h}/2) - (${_pos[0]} * ${_margin} * 2) - ${_padding})`,
			"left": `calc(${_o[0]} - (${_pos[1]} * ${_w}) - (${_w}/2) - (${_pos[1]} * ${_margin} * 2) - ${_padding})`,
			"min-width": `calc((${size.cols} * (${_w} + (${_margin} * 2)) + 1.5em)`,
			"min-height": `calc((${size.rows} * (${_h} + (${_margin} * 2)) + 1.5em)`
		});
	};

	setup.zoomLevel = 100;

	_bm.mapZoom = function(level = 100) {
		let _t = $("#map-container");
		if (!_t.length) return;
		_t.css({
			"transform": `scale(${level/100})`
		});
	};


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

	_bm.gotoMap = function(mapObj) {
		variables().curMap = mapObj;
		$.wiki(`<<goto "bmPlayMap">>`);
	};

	setup.bm = Object.freeze(_bm);
}());


$(window).on("resize", () => $(document).trigger(":map-moved"));

$(document).on(":map-moved", function() {
	setup.bm.cameraFollow(".player");

	$("#cur-block-acts .content").empty();
	$("#cur-block-name .content").empty();
	$("#cur-block-desc .content").empty();

	let _def = variables().curMap._default;
	if (_def) {
		if (_def.acts) $("#cur-block-acts .content").wiki(_def.acts);
		if (_def.name) $("#cur-block-name .content").wiki(_def.name);
		if (_def.desc) $("#cur-block-desc .content").wiki(_def.desc);
	}

	let _p = $("#map-container #map .player").attr("id");
	variables().curPos = _p;
	$("#cur-block-pos .content").empty().wiki(_p);

	let _cur = variables().curMap[_p];
	if (_cur) {
		if (_cur.acts) $("#cur-block-acts .content").empty().wiki(_cur.acts);
		if (_cur.name) $("#cur-block-name .content").empty().wiki(_cur.name);
		if (_cur.desc) $("#cur-block-desc .content").empty().wiki(_cur.desc);
	}
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
