
window.mapEditorInit = function() {
	variables().mapEdit = true;
	$("#editor-map-container").draggable({
		disabled: true
	});
	window.editArr = [];
	$("#object-editor")
		.accordion({
			collapsible: true,
			heightStyle: "content",
			animate: 100
		});
	window.cmJSON = CodeMirror(document.getElementById("cm-json-editor"), {
		mode: {
			name: "javascript",
			json: true
		},
		lineNumbers: true,
		lineWrapping: true,
		matchBrackets: true,
		styleActiveLine: true,
		showCursorWhenSelecting: true,
		lint: true,
		theme: "material-palenight"
	});
	$(document).trigger(":obj-ed-open");
	$("#current-edit-array .content").text(editArr.join(", "));
};

$("html").on("click", "#edit-map", () => {
	if ($("#json-editor").hasClass("closed")) $(document).trigger(":json-ed-open");
	else $(document).trigger(":obj-ed-open");
});
$("html").on("click", "#editor-scrim", () => $(document).trigger(":obj-ed-open"));


$("html").on("click", "#re-center-map", () => {
	$("#editor-map-container").css({
		"top": 0,
		"left": 0
	});
});


$("html").on("click", "#play-map", () => {
	variables().editorMode = true;
	$.wiki(`<<goto "bmPlayMap">>`);
});

$("html").on("click", "#map-editor-link", () => {
	$.wiki(`<<goto "editMap">>`);
});


$(document).on("keydown", "textarea", function(ev) {
	if (ev.code === "Tab") {
		let v = this.value,
			s = this.selectionStart,
			e = this.selectionEnd;
		this.value = v.substring(0, s) + '\t' + v.substring(e);
		this.selectionStart = this.selectionEnd = s + 1;
		return false;
	}
});


$(document).on("keydown", function(ev) {
	switch (ev.code) {
		case "Space":
			if ($("#editor-map-container").length) $("#editor-map-container")
				.draggable("option", "disabled", false)
				.addClass("drag-true")
				.find("#map-container #map .map-cell").css("pointer-events", "none");
			break;
	}
});
$(document).on("keyup", function(ev) {
	switch (ev.code) {
		case "Space":
			if ($("#editor-map-container").length) $("#editor-map-container")
				.draggable("option", "disabled", true)
				.removeClass("drag-true")
				.find("#map-container #map .map-cell").css("pointer-events", "all");
			break;
	}
});


window.clipboardJS = new ClipboardJS(".ccJS", {
	text: function() {
		return JSON.stringify(variables().curMap, null, "\t");
	}
});
$("html").on("click", "#c-clipboard", () => setup.notify("Copied to clipboard!", 1000, "success"));


$(document).on(":json-ed-open", function() {
	updateJSON();
	$("#object-editor").addClass("closed");
	$("#json-editor").removeClass("closed");
	$("#edit-map").attr("title", "Edit map object");
	$("#edit-map .material-icons").text("description");
});

$(document).on(":obj-ed-open", function() {
	let _m = variables().curMap;
	_m = Object.assign(createMap(_m.size), _m);

	$("input#mm-id").val(_m.id);
	$("input#mm-size-rows").val(_m.size.rows);
	$("input#mm-size-cols").val(_m.size.cols);
	$("input#mm-zoom").val(_m.zoom);
	$("input#mm-map-css").val(_m.cssClass);

	$("input#cd-name").val(_m.default.name);
	$("textarea#cd-desc").val(_m.default.desc);
	$("textarea#cd-content").val(_m.default.content);
	$("input#cd-css").val(_m.default.cssClass);
	$("textarea#cd-inline").val(_m.default.css);
	$("textarea#cd-acts").val(JSON.stringify(_m.default.acts, null, "\t"));

	$("#json-editor").addClass("closed");
	$("#object-editor").removeClass("closed");
	$("#edit-map").attr("title", "Edit raw JSON");
	$("#edit-map .material-icons").text("code");
});


//update $curMap based on changes
$("html").on("change", "input, textarea", function() {
	variables().curMap = Object.assign(createMap(variables().curMap.size), variables().curMap);

	switch ($(this).attr("id")) {

		case "mm-id":
			variables().curMap.id = $(this).val();
			break;
		case "mm-size-rows":
			variables().curMap.size.rows = Number($(this).val());
			break;
		case "mm-size-cols":
			variables().curMap.size.cols = Number($(this).val());
			break;
		case "mm-zoom":
			variables().curMap.zoom = Number($(this).val());
			break;
		case "mm-map-css":
			variables().curMap.cssClass = $(this).val();
			break;

		case "cd-name":
			variables().curMap.default.name = $(this).val();
			break;
		case "cd-desc":
			variables().curMap.default.desc = $(this).val();
			break;
		case "cd-content":
			variables().curMap.default.content = $(this).val();
			break;
		case "cd-css":
			variables().curMap.default.cssClass = $(this).val();
			break;
		case "cd-inline":
			variables().curMap.default.css = $(this).val();
			break;
		case "cd-acts":
			let _c = $(this).val().replace(/[\r\n]+/g, " ");
			try {
				_c = JSON.parse();
			} catch(error) {
				setup.notify(
					`<i class="material-icons">warning</i> Malformed JSON!<br> Reverting to last stable version.`
					, 3000, "danger"
				);
				_c = variables().curMap.default.acts;
			}
			variables().curMap.default.acts = _c;
			$(this).val(_c);
			break;

		case "cs-name":
			for (let el of editArr) {
				variables().curMap[el].name = $(this).val();
			}
			break;
		case "cs-desc":
			for (let el of editArr) {
				variables().curMap[el].desc = $(this).val();
			}
			break;
		case "cs-content":
			for (let el of editArr) {
				variables().curMap[el].content = $(this).val();
			}
			break;
		case "cs-css":
			for (let el of editArr) {
				variables().curMap[el].cssClass = $(this).val();
			}
			break;
		case "cs-inline":
			for (let el of editArr) {
				variables().curMap[el].css = $(this).val();
			}
			break;
		case "cs-acts":
			for (let el of editArr) {
				let _c = $(this).val().replace(/[\r\n]+/g, " ");
				try {
					_c = JSON.parse(_c);
				} catch(error) {
					setup.notify(
						`<i class="material-icons">warning</i> Malformed JSON!<br> Reverting to last stable version.`
						, 3000, "danger"
					);
					_c = variables().curMap[el].acts;
				}
				variables().curMap[el].acts = _c;
				$(this).val(_c);
			}
			break;
	}

	updateJSON();
	redrawMap();
});


$("html").on("blur", "#json-editor", () => {
	let json = cmJSON.getValue();
	let map = {};
	try {
		map = JSON.parse(json);
	} catch(error) {
		setup.notify(
			`<i class="material-icons">warning</i> Malformed JSON!<br> Reverting to last stable version.`
			, 3000, "danger"
		);
		map = variables().curMap;
	}
	variables().curMap = map;
	redrawMap();
});


window.redrawMap = function() {
	$("#editor-map-container #map-container").empty().wiki(setup.bm.drawMap(variables().curMap));
	setup.bm.cameraFollow(".player");
	setup.zoomLevel = variables().curMap.zoom;
	setup.bm.mapZoom(setup.zoomLevel);
	State.create(State.passage);
	for (let el of editArr) {
		$(`.map-cell#${el}`).addClass("editing");
	}
}


window.cleanObj = function(obj, path) {
  Object.keys(obj).forEach(function(key) {
    let value = obj[key];
    let type = typeof value;
    if (type === "object") {
      cleanObj(value);
      if (!Object.keys(value).length) {
        delete obj[key]
      }
    } else if (!value) {
      delete obj[key];
    }
  });
};


window.updateJSON = function() {
	cleanObj(variables().curMap);
	cmJSON.setValue(JSON.stringify(variables().curMap, null, "\t"));
};


$("html").on("click", "#editor-map-container #map-container #map .map-cell", function(ev) {
	if (ev.ctrlKey) $(this).toggleClass("editing");
	else {
		$(this).siblings().removeClass("editing");
		$(this).toggleClass("editing");
	}
	$(document).trigger(":selection-changed");
});


$(document).on(":selection-changed", function() {
	editArr = $("#editor-map-container #map-container #map .map-cell.editing")
								.toArray()
								.map( el => el.id );

	$("#current-edit-array .content").text(editArr.join(", "));

	if (editArr.length === 0) return;

	let _m = variables().curMap;
	_m = Object.assign(createMap(_m.size), _m);

	if (editArr.every(
		(el, i ,arr) => _m[el].name === _m[arr[0]].name)
	) $("input#cs-name").val(_m[editArr[0]].name);
	else $("input#cs-name").val("");

	if (editArr.every(
		(el, i ,arr) => _m[el].desc === _m[arr[0]].desc)
	) $("textarea#cs-desc").val(_m[editArr[0]].desc);
	else $("textarea#cs-desc").val("");

	if (editArr.every(
		(el, i ,arr) => _m[el].content === _m[arr[0]].content)
	) $("textarea#cs-content").val(_m[editArr[0]].content);
	else $("textarea#cs-content").val("");

	if (editArr.every(
		(el, i ,arr) => _m[el].cssClass === _m[arr[0]].cssClass)
	) $("input#cs-css").val(_m[editArr[0]].cssClass);
	else $("input#cs-css").val("");

	if (editArr.every(
		(el, i ,arr) => _m[el].css === _m[arr[0]].css)
	) $("textarea#cs-inline").val(_m[editArr[0]].css);
	else $("textarea#cs-inline").val("");

	if (editArr.every(
		(el, i ,arr) => JSON.stringify(_m[el].acts) === JSON.stringify(_m[arr[0]].acts))
	) $("textarea#cs-acts").val(JSON.stringify(_m[editArr[0]].acts, null, "\t"));
	else $("textarea#cs-acts").val("");
});


$("html").on("click", "#menu-link", function() {
	Dialog.setup("Menu", "editor-menu");
	Dialog.wiki(Story.get("editor-menu").processText());
	Dialog.open();
});

$("html").on("change", "#load-JSON", function() {
	let file = $("#load-JSON").prop("files")[0];
	if (!!file) {
		let reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(e) {
			let map;
			try {
				map = JSON.parse(e.target.result);
			} catch(error) {
				Dialog.close();
				setup.notify(
					`<i class="material-icons">warning</i> Malformed JSON!<br> Could not import map.`
					, 3000, "danger"
				);
				return;
			}
			Dialog.close();
			variables().curMap = map;
			$.wiki(`<<goto "editMap">>`);
		};
	}
});
