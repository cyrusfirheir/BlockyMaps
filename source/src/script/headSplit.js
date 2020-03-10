//split text by headers (inputText, headerRegex, noOfCaptureGroupsInHeaderToReturn)
window.headSplit = function(text, regexp, caps = 1) {
	let _text = text.trim().split(/\r?\n/);
	let retArr = [];
	let _header = "";
	let _content = "";
	let _caps = "";
	for (let c = 0; c < caps; c++) {
		_caps += ("\$" + (c + 1) + ".____.");
	}
	_caps = _caps.slice(0, -6);
	for (let t = 0; t < _text.length; t++) {
		if (_text[t].match(regexp)) {
			retArr = [...retArr, {
				header: _header.trim(),
				content: _content.trim()
			}];
			_header = _text[t].replace(regexp, _caps);
			_content = "";
		} else {
			_content += (_text[t] + "\n");
		}
		if (t === (_text.length - 1)) {
			retArr = [...retArr, {
				header: _header.trim(),
				content: _content.trim()
			}];
		}
	}
	retArr.shift();
	return retArr;
};
