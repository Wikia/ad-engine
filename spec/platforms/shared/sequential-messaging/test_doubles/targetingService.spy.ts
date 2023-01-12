import { ChangeCallback, TargetingObject, TargetingServiceInterface } from '@wikia/core';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

class TargetingServiceSpy implements TargetingServiceInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	clear(slotName: string | null): void {}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	dump<T = TargetingObject>(slotName: string | null): T {
		return undefined;
	}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	extend(newTargeting: TargetingObject, slotName: string | null): void {}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	get(key: string, slotName: string | null): any {}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	onChange(callback: ChangeCallback): void {}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	remove(key: string, slotName: string | null): void {}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	removeListeners(): void {}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	set(key: string, value: any, slotName: string | null): void {}
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function makeTargetingServiceSpy(): SinonStubbedInstance<TargetingServiceSpy> {
	return createStubInstance(TargetingServiceSpy);
}
