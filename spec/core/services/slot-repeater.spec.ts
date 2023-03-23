import { SlotRepeater, targetingService, TargetingService } from '@wikia/core/services';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';
import { adSlotFake } from '../ad-slot-fake';

describe('slot-repeater', () => {
	let adSlot;
	let slotRepeater;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		adSlot = { ...adSlotFake };
		slotRepeater = new SlotRepeater();
		targetingServiceStub = global.sandbox.stub(targetingService);
	});

	it('ad-slot is repeated when it is configured as repeatable', () => {
		const newSlotName = slotRepeater.repeatSlot(adSlot, {
			index: 2,
			limit: null,
			slotNamePattern: 'repeatable_boxad_{slotConfig.repeat.index}',
			updateProperties: {
				'targeting.rv': '{slotConfig.repeat.index}',
			},
		});

		expect(newSlotName).to.equal('repeatable_boxad_2');
		targetingServiceStub.get.withArgs('rv', 'repeatable_boxad_2').returns(2);
	});

	it('ad-slot is not repeated when limit is reached', () => {
		const newSlotName = slotRepeater.repeatSlot(adSlot, {
			index: 5,
			limit: 4,
			slotNamePattern: 'repeatable_boxad_{slotConfig.repeat.index}',
			updateProperties: {
				'targeting.rv': '{slotConfig.repeat.index}',
			},
		});

		expect(newSlotName).to.be.undefined;
		targetingServiceStub.get.withArgs('rv', 'repeatable_boxad_5').returns(undefined);
	});
});
