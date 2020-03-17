UIBar.destroy();

Config.passages.nobr = true;
Config.passages.transitionOut = 10;

window.App = {
	debug: true
};

//debug keyboard toggles
$(document).on("keydown", function(ev) {
	switch (ev.code) {
		case "Backquote":
			if (App.debug && ev.ctrlKey) Engine.restart();
			break;
	}
});

$("html").on('click', 'a, button, .material-button', ripple);

//disables autocomplete
$("html").on("focus", "input", function(){
  $(this).attr("autocomplete", "off");
});
