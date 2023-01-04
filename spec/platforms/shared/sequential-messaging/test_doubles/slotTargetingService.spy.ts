import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { SlotTargetingServiceInterface, SlotTargeting, TargetingObject } from '@wikia/core';

class SlotTargetingServiceSpy implements SlotTargetingServiceInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	extend(slotName: string, newTargeting: SlotTargeting): void {}
	/* eslint-disable @typescript-eslint/no-unused-vars */
	get(slotName: string, key: string): any {}
	/* eslint-disable @typescript-eslint/no-unused-vars */
	getAll(): TargetingObject {
		return undefined;
	}
	/* eslint-disable @typescript-eslint/no-unused-vars */
	getSlotTargeting(slotName: string): SlotTargeting {
		return undefined;
	}
	/* eslint-disable @typescript-eslint/no-unused-vars */
	remove(slotName: string, key: string): void {}
	/* eslint-disable @typescript-eslint/no-unused-vars */
	set(slotName: string, key: string, value: any): void {}
}

export function makeSlotsTargetingServiceSpy(): SinonStubbedInstance<SlotTargetingServiceSpy> {
	return createStubInstance(SlotTargetingServiceSpy);
}
