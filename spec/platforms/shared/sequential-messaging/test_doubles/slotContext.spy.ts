import { PorvataParams } from '@wikia/ad-products';
import { AdSlot } from '@wikia/core';
import { SlotsContextInterface } from '@wikia/platforms/shared';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

class SlotsContextSpy implements SlotsContextInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	addSlotSize(slotName: string, size: [number, number]): void {}
	/* eslint-disable @typescript-eslint/no-unused-vars */
	setSlotSize(slotName: string, size: [number, number]): void {}
	/* eslint-disable @typescript-eslint/no-unused-vars */
	setState(slotName: string, state: boolean, status?: string): void {}
	/* eslint-disable @typescript-eslint/no-unused-vars */
	setupSlotVideoAdUnit(adSlot: AdSlot, params: PorvataParams): void {}

	setupSlotVideoContext(): void {}
}

export function makeSlotsContextSpy(): SinonStubbedInstance<SlotsContextSpy> {
	return createStubInstance(SlotsContextSpy);
}
