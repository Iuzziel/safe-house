export const Controller = (prefix: string = ''): ClassDecorator => {
	return (target: any) => {
		Reflect.set(target, 'prefix', prefix);

		if (!Reflect.get(target, 'routes')) {
			Reflect.set(target, 'routes', []);
		}
	};
};