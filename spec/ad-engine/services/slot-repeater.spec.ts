import { expect } from 'chai';
import sinon from 'sinon';
import { context, slotInjector, slotRepeater } from '../../../src/ad-engine/services';
import adSlotFake from '../ad-slot-fake';

describe('slot-repeater', () => {
	let adSlot;
	let injectedContainer;
	let sandbox;

	afterEach(() => {
		sandbox.restore();
	});

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		injectedContainer = {};
		sandbox.stub(slotInjector, 'inject').callsFake(() => injectedContainer);
		adSlot = { ...adSlotFake };

		context.set('listeners.slot', []);
		context.set('events.pushOnScroll.ids', []);
		context.set('options.slotRepeater', true);
	});

	it('listener is not added when option is disabled', () => {
		context.set('options.slotRepeater', false);

		slotRepeater.init();

		expect(context.get('listeners.slot').length).to.equal(0);
	});

	it('ad-slot is not repeated when it is disabled', () => {
		slotRepeater.init();

		const repeater = context.get('listeners.slot.0');

		adSlot.isEnabled = () => false;

		expect(repeater.onRenderEnded(adSlot)).to.be.false;
	});

	it('ad-slot is not repeated when it is not configured as repeatable', () => {
		slotRepeater.init();

		const repeater = context.get('listeners.slot.0');

		expect(repeater.onRenderEnded(adSlot)).to.be.false;
	});

	it('ad-slot is repeated when it is configured as repeatable', () => {
		slotRepeater.init();

		const repeater = context.get('listeners.slot.0');

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

		expect(repeater.onRenderEnded(adSlot)).to.be.true;
	});

	it('ad-slot is not repeated when it is configured as repeatable but limit is reached', () => {
		slotRepeater.init();

		const repeater = context.get('listeners.slot.0');

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

		expect(repeater.onRenderEnded(adSlot)).to.be.false;
	});

	it('ad-slot is not repeated when it is configured as repeatable and sibling is too close', () => {
		slotRepeater.init();

		const repeater = context.get('listeners.slot.0');

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

		expect(repeater.onRenderEnded(adSlot)).to.be.false;
	});

	it('ad-slot is repeated when it is configured as repeatable and sibling is far away', () => {
		slotRepeater.init();

		const repeater = context.get('listeners.slot.0');

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

		expect(repeater.onRenderEnded(adSlot)).to.be.true;
	});
});
