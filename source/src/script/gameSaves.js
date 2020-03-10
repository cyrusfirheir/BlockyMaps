
Config.history.controls = false;
Config.history.maxStates = 2;
Config.saves.slots = 6;
Config.saves.autosave = ["autosave"];

Config.passages.descriptions = function () {
	return `${variables().chapters[variables().currentChapter]} - ${variables().currentAct}`;
};

$("body").on("click", "#save-export", function() {
	Save.export();
});

$("html").on("change", "#load-file", function() {
	let file = $("#load-file").prop("files")[0];
	if (!!file) {
		let reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(e) {
			Save.deserialize(e.target.result);
			Dialog.close();
		};
	}
});
$("body").on("click", "#save-import", function() {
	$("#load-file").trigger("click");
});

setup.savesLink = function() {
	UI.saves();
	Dialog.wiki(Story.get("saveOps").processText());
};
$("body").on('click', '#saves-link', () => setup.savesLink());
$(document).on('click', "#saves-list button.delete", () => setup.savesLink());

$("body").on("click", "#save-ops button#delete-all", function() {
	for (let i = 0; i < Save.slots.length; i++) {
		Save.slots.delete(i);
	}
	setup.savesLink();
});

$(document).on(':dialogopening', function () {
	if ($('#ui-dialog-body').hasClass('saves')) {
		$('#ui-dialog-body.saves').prepend(Story.get("saveOpsWarning").processText());
		$('#ui-dialog-body.saves tr').each(function (_, el) {
			let load = $(el).find('button.load');
			if (!load.length) return;
			let slot = load.attr('id').split('-')[2];
			load.parent().append(
				` <button id="saves-update-${slot}" class="update ui-close">Update</button>`
			);
		});
		if (Story.get(passage()).tags.includes("nosave")) {
			$("button.save, button.update").remove();
		}
	}
});

$("body").on("click", "button.update", function() {
	let slot = $(this).attr('id').split('-')[2];
	Save.slots.save(slot);
});
