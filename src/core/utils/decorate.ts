export function decorate(decorator: any): any {
	return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {
		const fn = descriptor.value;
		descriptor.value = decorator.call(this, fn);
		return descriptor;
	};
}
