console.debug('Debug enable')

const socket = new WebSocket(`ws://${document.location.host}/wsserver`, 'echo-protocol');
var allGames = new Array();

socket.addEventListener('open', function (event) {
  console.debug('Socket opened');
});

socket.addEventListener('data', function (event) {
  console.debug('Data from server', event);
});

socket.addEventListener('message', function (event) {
  console.debug('Message from server', event);
});

socket.addEventListener('error', function (err) {
  console.error('An error has occured', err);
});

socket.addEventListener('close', function (event) {
  console.info('Disconnected!');
  setTimeout(() => {
    location.reload();
  }, 5000);
});

function sendMessages(client, msg) {
  client.send(JSON.stringify(msg));
}

function refreshApp() {
  let newAppIteration = document.getElementById(`app`).cloneNode(true);
}