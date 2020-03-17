
window.createMap = function(size = {
	rows: 3,
	cols: 3
}) {
	let retObj = {
		id: "uniqueMapID",
		size: size,
		zoom: 100,
		cssClass: "",
		_default: {
			name: "",
			desc: "",
			acts: "",
			trig: "",
			content: "",
			cssClass: "",
			css: ""
		}
	};
	for (let r = 0; r < size.rows; r++) {
		for (let c = 0; c < size.cols; c++) {
			let cell = `r${r}c${c}`;
			retObj[cell] = {
				name: "",
				desc: "",
				acts: "",
				trig: "",
				content: "",
				cssClass: "",
				css: ""
			};
		}
	}
	return retObj;
};
