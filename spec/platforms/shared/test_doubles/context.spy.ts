/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContextInterface } from '@wikia/ad-engine';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

class ContextSpy implements ContextInterface {
	extend(newContext): void {}

	get(key: string): any {}

	onChange(key: string, callback): void {}

	push(key: string, value: any): void {}

	remove(key: string): void {}

	removeListeners(key: string): void {}

	set(key: string, value: any): void {}
}

export function makeContextSpy(): SinonStubbedInstance<ContextSpy> {
	return createStubInstance(ContextSpy);
}
