import { IRoute } from './Router';

export const Route = (routeOptions: RouteOptions): MethodDecorator => {
	return (target, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void => {
		if (!Reflect.get(target.constructor, 'routes')) {
			Reflect.set(target, 'routes', [], target.constructor);
		}
		const routes = Reflect.get(target.constructor, 'routes') as Array<IRoute>;
		let newRoute: IRoute = {
			method: routeOptions.method,
			path: routeOptions.path,
			controllerMethod: descriptor.value
		};
		if (routeOptions.templateUrl)
			newRoute.templateUrl = routeOptions.templateUrl;
		routes.push(newRoute);
		Reflect.set(target, 'routes', routes, target.constructor);
	};
};

export interface RouteOptions {
	path: string;
	method: 'get' | 'post' | 'delete' | 'options' | 'put';
	templateUrl?: string
}