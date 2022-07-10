const controlArea = document.getElementById('controls');

let color = '#000000';
function changeColor(event) {
	color = event.srcElement.value;
}

let strokeWidth = 1;
function changeStrokeWidth(event) {
	strokeWidth = event.srcElement.value;
}

function erase() {
	var m = confirm('Want to clear?');
	if (m) {
		ctx.clearRect(
			0,
			0,
			window.innerWidth - 10,
			window.innerHeight - 10 - controlArea.clientHeight
		);
	}
}

// create canvas element and append it to document body
let canvas = document.createElement('canvas');
canvas.classList.add('add-border');
document.body.appendChild(canvas);

// some hotfixes... ( ≖_≖)
document.body.style.margin = 0;
// canvas.style.position = 'fixed';

// get canvas 2D context and set him correct size
let ctx = canvas.getContext('2d');
resize();

// last known position
let pos = { x: 0, y: 0 };

window.addEventListener('resize', resize);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);

// new position from mouse event
function setPosition(e) {
	pos.x = e.clientX;
	pos.y = e.clientY - controlArea.clientHeight;
}

// resize canvas
function resize() {
	ctx.canvas.width = window.innerWidth - 10;
	ctx.canvas.height = window.innerHeight - 10 - controlArea.clientHeight;
}

function draw(e) {
	// mouse left button must be pressed
	if (e.buttons !== 1) return;

	ctx.beginPath(); // begin

	ctx.lineWidth = strokeWidth;
	ctx.lineCap = 'round';
	ctx.strokeStyle = color;

	ctx.moveTo(pos.x, pos.y); // from
	setPosition(e);
	ctx.lineTo(pos.x, pos.y); // to
	socket.emit('draw', {
		lineWidth: strokeWidth,
		lineCap: 'round',
		strokeStyle: color,
		pos,
		e,
		roomId,
	});
	ctx.stroke(); // draw it!
}

socket.on('draw', (data) => {
	// console.log('draw', data);
	// mouse left button must be pressed
	// if (data.e.buttons !== 1) return;

	ctx.beginPath(); // begin

	ctx.lineWidth = data.lineWidth;
	ctx.lineCap = data.lineCap;
	ctx.strokeStyle = data.strokeStyle;

	ctx.moveTo(data.pos.x, data.pos.y); // from
	setPosition(data.e);
	ctx.lineTo(data.pos.x, data.pos.y); // to
	ctx.stroke(); // draw it!
});
