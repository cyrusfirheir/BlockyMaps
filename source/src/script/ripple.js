/* code borrowed from here:
    https://medium.com/@leonardo.monteiro.fernandes/css-techniques-for-material-ripple-effect-3f0ece3062a0
*/

function ripple(evt) {
	let a = $(evt.currentTarget);
	let x = evt.pageX - a.offset().left;
	let y = evt.pageY - a.offset().top;
	let duration = 500;
	let animationFrame, animationStart;
	let animationStep = function(timestamp) {
		if (!animationStart) {
			animationStart = timestamp;
		}
		let frame = timestamp - animationStart;
		if (frame < duration) {
			let easing = (frame / duration) * (2 - (frame / duration));
			let circle = "circle at " + x + "px " + y + "px";
			let color = "rgba(255, 255, 255, " + (0.7 * (1 - easing)) + ")";
			let stop = 90 * easing + "%";
			a.css({
				"background-image": "radial-gradient(" + circle + ", " + color + " " + stop + ", transparent " + stop + ")"
			});
			animationFrame = window.requestAnimationFrame(animationStep);
		} else {
			$(a).css({
				"background-image": "none"
			});
			window.cancelAnimationFrame(animationFrame);
		}
	};
	animationFrame = window.requestAnimationFrame(animationStep);
};
