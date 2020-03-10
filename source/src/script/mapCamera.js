
window.cameraFollow = function(target = ".player") {
	let _t = $(`#map-container #map ${target}`);
	if (!_t.length) return;
	let _pos = _t.attr("id")
								.replace(/r([0-9]+)?c([0-9]+)?/, "$1_$2")
								.split("_")
								.map(el => Number(el));
	let _map = $("#map-container #map");
	let _padding = _map.css("padding");
	_map.css({
		"top": `calc(40% - ${_pos[0] * 3.5 + 1.75}em - ${_padding})`,
		"left": `calc(50% - ${_pos[1] * 3.5 + 1.75}em - ${_padding})`
	});
};

$(document).on(":map-moved", () => cameraFollow());

window.mapZoom = function(level = 1) {
	let _t = $("#map-container");
	if (!_t.length) return;
	_t.css({
		"transform": `scale(${level})`
	});
};

$(document).on("keydown", function(ev) {
	switch (ev.code) {
		case "PageDown":
			setup.zoomLevel -= 0.1;
			setup.zoomLevel = setup.zoomLevel.clamp(0.1, 2.5);
			mapZoom(setup.zoomLevel);
			break;
		case "PageUp":
			setup.zoomLevel += 0.1;
			setup.zoomLevel = setup.zoomLevel.clamp(0.1, 2.5);
			mapZoom(setup.zoomLevel);
			break;
	}
});
