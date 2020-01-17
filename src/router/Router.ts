import http from 'http';
import path from 'path';
import fs from 'fs';

import { WebTool } from '../tools';
import { COLORS } from '../constant';
import { RouteOptions } from './Route';
import { HomeController, ApiController } from '../controller';

export class Router {
	private _routes: Map<string, IRoute>;
	private _static: Map<string, string>;

	constructor() {
		this._routes = new Map<string, IRoute>();
		this._static = new Map<string, string>();

		let allController = [
			ApiController,
			HomeController
		]
		allController.forEach(controller => {
			const instance = new controller();
			const prefix = Reflect.get(controller, 'prefix');
			const routes: Array<IRoute> = Reflect.get(controller, 'routes');

			routes.forEach(route => {
				route.path = (prefix + route.path).replace(/(\/{2,})+/g, '/');
				route.controllerMethod.bind(instance);
				this.addRoute(route);
			});
		});
	}

	public addRoute(...routes: Array<IRoute>): Router {
		for (let i = 0; i < routes.length; i++) {
			this._routes.set(routes[i].path, routes[i]);
		}
		return this;
	}

	public addStatic(...pathRoute: Array<string>): Router {
		for (let i = 0; i < pathRoute.length; i++) {
			this._static.set(pathRoute[i], path.join(process.cwd(), pathRoute[i]));
		}
		return this;
	}

	public resolve(req: http.IncomingMessage, res: http.ServerResponse): any {
		let body = '<h1>404 Page not found</h1>';
		let statusCode = 404;
		// console.log(req.headers.referer)
		if (req && req.url && this._routes) {
			let activeRoute = this._routes.get(req.url);
			let resUrl = req.url;
			if (activeRoute) {
				if (activeRoute.templateUrl)
					body = activeRoute ? activeRoute.controllerMethod(activeRoute.templateUrl) : body;
				else
					body = activeRoute ? activeRoute.controllerMethod() : body;
				statusCode = activeRoute ? 200 : statusCode;
			} else if (resUrl.lastIndexOf('.') !== -1) {
				this._static.forEach((v, k, m) => {
					try {
						if (!fs.statSync(path.join(v, resUrl)).isFile()) return;
					} catch (err) {
						if (err.code === 'ENOENT') { console.error(`${COLORS.fg.Red}Asking for file not found at ${err.path}${COLORS.Reset}`); return; }
						else throw err;
					}
					let data = fs.readFileSync(path.join(v, resUrl));
					var mimetype = WebTool.getMimeType(resUrl);
					res.writeHead(200, { 'Content-Length': data.byteLength, 'Content-type': mimetype });
					res.end(data);
				})
				res.writeHead(404, "Not Found");
				res.end(`File not found: ${resUrl}`);
			}
		}
		return res
			.writeHead(statusCode, {
				'Content-Length': Buffer.byteLength(body),
				'Content-Type': 'text/html; charset=utf-8'
			})
			.end(body, 'utf-8');
	}
}

export class IRoute implements RouteOptions {
	path: string;
	method: "get" | "post" | "delete" | "options" | "put";
	controllerMethod: Function;
	templateUrl?: string | undefined;

	constructor(
		path: string,
		requestMethod: 'get' | 'post' | 'delete' | 'options' | 'put',
		controllerMethod: Function,
		template?: string
	) {
		this.path = path;
		this.method = requestMethod;
		this.controllerMethod = controllerMethod;
		if (template)
			this.templateUrl = template;
	}
}