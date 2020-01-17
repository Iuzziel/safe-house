import { IRoute } from './Router';

export var routes: Array<IRoute> = new Array<IRoute>();
export const Route = (routeOptions: RouteOptions): MethodDecorator => {
	return (target, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void => {
		if (!Reflect.get(target, 'routes')) {
			Reflect.set(target, 'routes', []);
		}
		routes = Reflect.get(target, 'routes') as Array<IRoute>;
		let newRoute: IRoute = {
			method: routeOptions.method,
			path: routeOptions.path,
			controllerMethod: descriptor.value
		};
		if (routeOptions.templateUrl)
			newRoute.templateUrl = routeOptions.templateUrl;
		routes.push(newRoute);
		Reflect.set(target, 'routes', routes);
	};
};

export interface RouteOptions {
	path: string;
	method: 'get' | 'post' | 'delete' | 'options' | 'put';
	templateUrl?: string
}