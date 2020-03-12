# Blocky Maps
`v1.0.0`

A tool made to facilitate an interactive and easy to set-up map/world-navigation system for projects made with [Twine](http://twinery.org/) and using the [SugarCube 2](https://www.motoslave.net/sugarcube/2/) storyformat.

### The maps in game:
Live demo [here](https://cyrusfirheir.github.io/BlockyMaps/#demo).
(Icons are not included with the library)

![](https://imgur.com/mNMAZm5.png)

![](https://imgur.com/4lSksCp.png)

### The editor in action:  

![](https://imgur.com/g3QsAAJ.png)

![](https://imgur.com/qVdZoF5.png)

## Overview

Blocky Maps is both an interactive app to create such maps, as well as a library which can be added to Twine projects using the SugarCube 2 storyformat to display and run such maps in them.

The system uses JSON to store and move around the data associated with a map, and is as extendable as the user wants it to be.

## Installation

Download the latest version of Blocky Maps from the [releases](https://github.com/cyrusfirheir/BlockyMaps/releases) page and extract the `.zip` file. This includes both the library and the offline version of the editor.

To add it to your project:

- If using the Twine app (web or desktop):

	Copy the *contents* of the following files from the `bm-library` directory into your project as mentioned:

	`bm-script.js` → `Story JavaScript`  
	`bm-styles.css` → `Story StyleSheet`  
	`bm-passage-twine.txt` → A passage titled 'bmPlayMap'.

- If using a Twee compiler ([Tweego](thttps://www.motoslave.net/tweego/) or [Extwee](https://www.npmjs.com/package/extwee)):

	Copy the following files from the `bm-library` directory into your project source:

	`bm-script.js`  
	`bm-styles.css`  
	`bm-passage.tw`

## Usage

## The Library

As mentioned earlier, map data is handled as a JSON object, and this allows for a lot of flexibility in regards to management of multiple maps.

The simplest map object might look something like this (*See [Map Object Template](#map-object-template) for more details*):

```json
{
	"id": "uniqueMapID",
	"size": {
		"rows": 3,
		"cols": 3
	},
	"zoom": 1,
	"r1c1": {
		"cssClass": "player"
	}
}
```

Global Twine variables currently used by the library:  
> `$curMap` : (*object*) Map object which is currently being displayed.  
> `$curPos` : (*string*) Position of the player on the map.

### Functions

#### Note!
> All library functions are under the `setup.bm` namespace.

---
<span id="lib-fn-gotoMap"></span>

#### `setup.bm.gotoMap(mapObj)`
<br>

Loads and goes to the `bmPlayMap` passage to display a map. Adds a moment to the history.

**Since:**
- `v1.0.0`

**Parameters:**
- `mapObj` : (*object* | *string*) A valid JSON string or a JavaScript object containing valid map data. *See [Map Object Template](#map-object-template) for more details.*

**Example:**
```
// the quickest way to load and run a map in a project
// (in JavaScript)
setup.bm.loadMap(mapObj);
```

---
<span id="lib-fn-pMove"></span>

#### `setup.bm.pMove(dir [, dist])`
<br>

Moves the `player` CSS class across the map in the specified direction, and optionally, by the specified amount of blocks.

Focuses the camera on the player.

**Since:**
- `v1.0.0`

**Parameters:**
- `dir` : (*string*) The direction of movement (either one of `"up"`, `"left"`, `"right"`, or `"down"`).
- `dist` : (optional, *non-negative integer*) The amount of blocks to move in specified direction. Default is 1.

**Example:**
```
// moves a block down
setup.bm.pMove("down");

// moves two blocks to the left
setup.bm.pMove("left", 2);
```

---
<span id="lib-fn-pMoveCoords"></span>

#### `setup.bm.pMoveCoords(coords [, override])`
<br>

Moves the `player` CSS class across the map to the specified coordinates, and optionally, even to `solid` CSS class blocks, which the player isn't supposed to be able to move through otherwise.

Focuses the camera on the player.

**Since:**
- `v1.0.0`

**Parameters:**
- `coords` : (*string* | *array* | *object*) The coordinates where to move the player. Accepts three kinds of input:  
		As a string with the format "r(row)c(column)":
			e.g. - "r0c0"
		As an array with the format [row, column]:
			e.g. - [0, 2]
		As an object with the format {row: row, col: column}:
			e.g. - {row: 2, col: 3}
- `override` : (optional, *boolean*) Whether to override normal behavior and move the player into a solid block.

**Example:**
```
// using a string
setup.bm.pMoveCoords("r0c0");

//using an array
setup.bm.pMoveCoords([0, 2]);

//using an object
setup.bm.pMoveCoords({row: 2, col: 3});
```

---
<span id="lib-fn-cameraFollow"></span>

#### `setup.bm.cameraFollow([target])`
<br>

Focuses the 'camera' on the specified target. Defaults to focusing on the very first block of the map.

**Since:**
- `v1.0.0`

**Parameters:**
- `target` : (optional, *string*) A CSS selector for the camera to target. Defaults to `"#r0c0"`, which is the first block of the map.

**Example:**
```
// focusing on the player
setup.bm.cameraFollow(".player");
```

---
<span id="lib-fn-mapZoom"></span>

#### `setup.bm.mapZoom([level])`
<br>

'Zooms' the camera in or out of the map to the specified level.

**Since:**
- `v1.0.0`

**Parameters:**
- `level` : (optional, *integer*) Percentage of the zoom. Ranges from 10 to 250. Default is 100.

**Example:**
```
// zooming in
setup.bm.mapZoom(150);

// zooming out
setup.bm.mapZoom(50);
```

---
<span id="lib-fn-drawMap"></span>

#### `setup.bm.drawMap(mapObj)` → *string*
<br>

Returns a string of html to be displayed on a passage. *Usually,* this function is not needed to be used directly, as the drawing to a passage is already handled entirely by the [`gotoMap()`](#lib-fn-gotoMap) function.

**Since:**
- `v1.0.0`

**Parameters:**
- `mapObj` : (*object* | *string*) A valid JSON string or a JavaScript object containing valid map data. *See [Map Object Template](#map-object-template) for more details.*

**Example:**
```
// returns a html string needed to draw the map stored as JSON in the 'forest-map' passage
<<= setup.bm.drawMap(Story.get("forest-map").text)>>
```

---

### Map Object Template
(This section is a work in progress)

---

## The Editor
(This section is a work in progress)

---

## Customization
(This section is a work in progress)

---

## Changelog

- `v1.0.0`
	- First release.
