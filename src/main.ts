import { Socket } from 'net';

import { COLORS } from './constant';
import { Server } from './server';
import { Router } from './router';
import { HomeController } from './controller';
import { ServerService, DatabaseService } from './services';
import { connection } from 'websocket';

process.on('uncaughtException', err => console.log('uncaughtException', err));

const server = new Server({ host: ServerService.getOptions().host, port: ServerService.getOptions().port });
const router = new Router();
const dataAcess = DatabaseService.getInstance();

router
	.addStatic('/public')
	.addRoute({ path: '/', method: 'get', controllerMethod: HomeController.index, templateUrl: 'templates/index.html' });

server.on('request', router.resolve, router);
server.on('clientError', (err: Error, socket: Socket) => {
	console.error(err.stack);
	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.on('error', (e) => {
	if (e.code === 'EADDRINUSE') {
		console.log(`${COLORS.fg.Yellow}Address in use, retrying...${COLORS.Reset}`);
		setTimeout(() => {
			server.close();
			server.listen(ServerService.getOptions().port, ServerService.getOptions().host);
		}, 1000);
	}
});

function isOriginAllowed(origin: string): boolean {
	const o = new URL(origin);
	return o.hostname === ServerService.getOptions().host && o.port === ServerService.getOptions().port.toString();
}

server.ws.on('request', (request) => {
	if (!isOriginAllowed(request.origin)) {
		request.reject();
		console.log(`${COLORS.fg.Red}${new Date()} - Connection from origin ${request.origin} rejected.${COLORS.Reset}`);
		return;
	}
	var client = request.accept('echo-protocol', request.origin);
	console.log(`${COLORS.fg.Green}${new Date()} - Connection accepted.${COLORS.Reset}`);
	client.on('message', (rawMsg) => {
		if (rawMsg.type === 'utf8' && rawMsg.utf8Data) {
			let msg = JSON.parse(rawMsg.utf8Data);
			console.log(`${COLORS.fg.White}${new Date()} - Received Message: ${JSON.stringify(msg)}${COLORS.Reset}`);
			processMessage(client, msg);
		}
	});
	client.on('close', (reasonCode, description) => {
		console.log(`${COLORS.fg.Black}${new Date()} - Peer: ${client.remoteAddress} disconnected.${COLORS.Reset}`);
	});
});

function isInterfaceOk(payload: any): boolean {
	return true;
}

function broadcastChanges(msg: any): void {
	server.ws.broadcast(JSON.stringify(msg));
}

function processMessage(client: connection, msg: any): void {
	if (!isInterfaceOk(msg)) return;
	console.log(msg);
}
