import { communicationService } from '@wikia/communication';
import { AdEngine, AdStackPayload } from '@wikia/core';
import { OldLazyQueue } from '@wikia/core/utils';
import { expect } from 'chai';
import {
	AD_ENGINE_PARTNERS_READY,
	AD_ENGINE_STACK_COMPLETED,
	AD_ENGINE_STACK_START
} from "@wikia/communication/events/events-ad-engine";

describe('AdEngine', () => {
	it('emits AD_ENGINE_STACK_START and AD_ENGINE_STACK_COMPLETED events', async () => {
		const adEngine = new AdEngine();
		adEngine.adStack = {
			start: () => {},
		} as OldLazyQueue<AdStackPayload>;

		const emitSpy = global.sandbox.spy(communicationService, 'emit');

		adEngine.runAdQueue();

		communicationService.emit(AD_ENGINE_PARTNERS_READY);

		expect(emitSpy.calledWith(AD_ENGINE_STACK_START)).to.be.true;
		expect(emitSpy.calledWith(AD_ENGINE_STACK_COMPLETED)).to.be.true;
	});
});
