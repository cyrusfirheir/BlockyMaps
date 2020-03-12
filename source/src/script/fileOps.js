
window.exportJSON = function() {
	let map = variables().curMap;
	let _name = "_map-";
	_name += map.id ? `${map.id}-` : "";
	_name += `${dateTimeString()}`;
	cleanObj(map);
	let content = JSON.stringify(map, null, "\t");
  let blob = new Blob([content], {
   type: "application/json;charset=utf-8"
  });
  saveAs(blob, _name + ".json");
	Dialog.close();
	setup.notify(`Map exported!`, 3000, "success");
};

window.dateTimeString = function() {
  let today = new Date();
  let date = `${today.getFullYear()}${today.getMonth()+1}${today.getDate()}`;
  let time = `${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;
  return date + time;
};
