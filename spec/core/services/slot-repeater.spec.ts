import { communicationService } from '@wikia/communication';
import { AdSlot } from '@wikia/core';
import { context, slotInjector, slotRepeater } from '@wikia/core/services';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { adSlotFake } from '../ad-slot-fake';

describe('slot-repeater', () => {
	let adSlot;
	let injectedContainer;
	let handleSlotRepeating;
	let sandbox;

	afterEach(() => {
		sandbox.restore();
	});

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		injectedContainer = {};
		handleSlotRepeating = null;
		sandbox.stub(slotInjector, 'inject').callsFake(() => injectedContainer);
		sandbox.stub(communicationService, 'onSlotEvent').callsFake((key, callback) => {
			handleSlotRepeating = callback;
		});
		adSlot = { ...adSlotFake };

		context.set('events.pushOnScroll.ids', []);
		context.set('slots.adStack', []);
	});

	it('ad-slot is not repeated when it is disabled', () => {
		slotRepeater.init();

		adSlot.isEnabled = () => false;
		adSlot.emit(AdSlot.SLOT_RENDERED_EVENT);

		expect(handleSlotRepeating({ slot: adSlot })).to.be.false;
	});

	it('ad-slot is not repeated when it is not configured as repeatable', () => {
		slotRepeater.init();

		expect(handleSlotRepeating({ slot: adSlot })).to.be.false;
	});

	it('ad-slot is repeated when it is configured as repeatable', () => {
		slotRepeater.init();

		adSlot.isRepeatable = () => true;
		adSlot.config.repeat = {
			index: 1,
			insertBeforeSelector: '.foo bar',
			limit: null,
			slotNamePattern: 'repeatable_boxad_{slotConfig.repeat.index}',
			updateProperties: {
				'targeting.rv': '{slotConfig.repeat.index}',
			},
		};

		expect(handleSlotRepeating({ slot: adSlot })).to.be.true;
	});

	it('ad-slot is not repeated when it is configured as repeatable but limit is reached', () => {
		slotRepeater.init();

		adSlot.isRepeatable = () => true;
		adSlot.config.repeat = {
			index: 2,
			insertBeforeSelector: '.foo bar',
			limit: 2,
			slotNamePattern: 'repeatable_boxad_{slotConfig.repeat.index}',
			updateProperties: {
				'targeting.rv': '{slotConfig.repeat.index}',
			},
		};

		expect(handleSlotRepeating({ slot: adSlot })).to.be.false;
	});

	it('ad-slot is not repeated when it is configured as repeatable and sibling is too close', () => {
		slotRepeater.init();

		adSlot.isRepeatable = () => true;
		adSlot.config.repeat = {
			index: 1,
			insertBeforeSelector: '.foo bar',
			limit: null,
			slotNamePattern: 'repeatable_boxad_{slotConfig.repeat.index}',
			updateProperties: {
				'targeting.rv': '{slotConfig.repeat.index}',
			},
		};
		injectedContainer = null;

		expect(handleSlotRepeating({ slot: adSlot })).to.be.false;
	});

	it('ad-slot is repeated when it is configured as repeatable and sibling is far away', () => {
		slotRepeater.init();

		adSlot.isRepeatable = () => true;
		adSlot.config.repeat = {
			index: 1,
			insertBeforeSelector: '.foo bar',
			limit: null,
			slotNamePattern: 'repeatable_boxad_{slotConfig.repeat.index}',
			updateProperties: {
				'targeting.rv': '{slotConfig.repeat.index}',
			},
		};

		expect(handleSlotRepeating({ slot: adSlot })).to.be.true;
	});
});
