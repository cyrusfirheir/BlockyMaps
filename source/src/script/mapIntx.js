
window.gotoMap = function(mapObj) {
	variables().curMap = mapObj;
	$.wiki(`<<goto "playMap">>`);
};

$(document).on(":map-moved", function() {
	$("#map-ui #acts").empty();
	$("#map-ui #name .content").empty();
	$("#map-ui #desc .content").empty();

	//default name, desc, and acts
	let _def = variables().curMap.default;
	if (_def) {
		if (_def.acts) {
			$("#map-ui #acts").wiki(_def.acts.reduce((a, c) => {
				return a + `<<link "${c.name}">>${c.func}<</link>>`;
			}, ""));
		}
		if (_def.name) $("#map-ui #name .content").wiki(_def.name);
		if (_def.desc) $("#map-ui #desc .content").wiki(_def.desc);
	}

	let _p = $("#map-container #map .player").attr("id");
	variables().curPos = _p;
	$("#map-ui #pos .content").empty().wiki(_p);

	//specific name, desc, and acts
	let _cur = variables().curMap[_p];
	if (!_cur) return;
	if (_cur.acts) {
		$("#map-ui #acts").empty().wiki(_cur.acts.reduce((a, c) => {
			return a + `<<link "${c.name}">>${c.func}<</link>>`;
		}, ""));
	}
	if (_cur.name) $("#map-ui #name .content").empty().wiki(_cur.name);
	if (_cur.desc) $("#map-ui #desc .content").empty().wiki(_cur.desc);

});
