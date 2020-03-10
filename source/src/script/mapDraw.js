
//accepts valid JSON or plain JS objects.
window.drawMap = function(mapObj) {
	if (typeof mapObj === "string") mapObj = JSON.parse(mapObj);

	variables().curMap = mapObj;
	let rows = mapObj.size.rows;
	let cols = mapObj.size.cols;
	let ret = "";
	ret += `<div
						id="map"
						class="${mapObj.class ? mapObj.class : ""}"
						style = "
							min-width: ${cols * 3.5 + 1.5}em;
							min-height: ${rows * 3.5 + 1.5}em;
						"
					>`;
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			let cell = `r${r}c${c}`;
			let css, cssClass, _css, _cssClass;
			let content = "";
			if (mapObj.default) {
				_css = mapObj.default.css;
				_cssClass = mapObj.default.cssClass;
				content = mapObj.default.content
									? mapObj.default.content : content;
			}
			if (mapObj[cell]) {
				css = mapObj[cell].css;
				cssClass = mapObj[cell].cssClass;
				content = mapObj[cell].content
									? mapObj[cell].content : content;
			}
			ret += `<span
			 					id="${cell}"
								class="
									map-cell
									${_cssClass ? _cssClass : ""}
									${cssClass ? cssClass : ""}
								"
								style="
									${_css ? _css : ""}
									${css ? css : ""}
								"
							>
								<span class="content">
									${content}
								</span>
							</span>`;
			if (c === cols - 1) ret += `<br>`;
		}
	}
	ret += `</div>`;
	ret = ret.replace(/[\r\n\s]+/g, " ");
	return ret;
};
