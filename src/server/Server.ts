import http from 'http';
import websocket from 'websocket';

export class Server {
	private port = Number(process.env.PORT) | 8080;
	private host = 'localhost';
	private server: http.Server;
	public ws: websocket.server;

	constructor(conf?: { port: number, host: string }) {
		if (conf) {
			this.port = conf.port ? conf.port : this.port;
			this.host = conf.host ? conf.host : this.host;
		}

		this.server = http.createServer();
		this.ws = new websocket.server({ httpServer: this.server });
		this.server.listen(this.port, this.host);
		console.log(`Server listening on ${this.host}:${this.port}`)
	}

	public on(event: string, cb: (...a: any) => any, ctx?: any) {
		if (ctx) return this.server.on(event, cb.bind(ctx));
		return this.server.on(event, cb);
	}

	public close(callback?: ((err?: Error | undefined) => void) | undefined): http.Server {
		if (callback) return this.server.close(callback);
		return this.server.close();
	}

	public listen(port?: number | undefined, hostname?: string | undefined, backlog?: number | undefined, listeningListener?: (() => void) | undefined): http.Server {
		return this.server.listen(port, hostname, backlog, listeningListener);
	}
}