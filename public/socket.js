let socket = io();
const uid = new ShortUniqueId();

let roomId;

function generateNewRoom() {
	const roomId = uid();
	window.location.href = window.location.href + 'draw?roomId=' + roomId;
}

function joinRoom() {
	const roomId = document.getElementById('roomInputNumber').value;
	window.location.href = window.location.href + 'draw?roomId=' + roomId;
}

function checkRooms() {
	const url = window.location.href.split('/');
	if (
		String(url[url.length - 1]).startsWith('draw') &&
		String(url[url.length - 1]).includes('roomId')
	) {
		roomId = url[url.length - 1].split('=')[1];
		socket.emit('createOrJoin', { roomId });
	}
}

checkRooms();

socket.on('roomCreated', (data) => {
	console.log('roomCreated');
});

socket.on('roomJoined', (data) => {
	console.log('roomJoined');
});
