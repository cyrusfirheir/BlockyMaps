
window.pMove = function(dir, dist=1) {
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
		pMoveCoords([
			_cur[0] + rMove,
			_cur[1] + cMove
		]);
	}
	$(document).trigger(":map-moved");
};

/*
pMoveCoords(coords) -> Accepts three kinds of input
	As a string of the format "r(row)c(column)":
		pMoveCoords("r0c0");
	As an array of the format [row, column]:
		pMoveCoords([0, 2]);
	As an object of the format {row: row, col: column}:
		pMoveCoords({row: 2, col: 3});
Override can be passed a truthy value so that player can move into a solid block.
*/
window.pMoveCoords = function(coords, override=false) {
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

$(document).on("keydown", function(ev) {
	switch (ev.code) {
		case "KeyW": case "ArrowUp":
			pMove("up");
			break;
		case "KeyS": case "ArrowDown":
			pMove("down");
			break;
		case "KeyA": case "ArrowLeft":
			pMove("left");
			break;
		case "KeyD": case "ArrowRight":
			pMove("right");
			break;
	}
});
