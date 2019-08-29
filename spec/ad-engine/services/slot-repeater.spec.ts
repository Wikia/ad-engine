import { expect } from 'chai';
import * as sinon from 'sinon';
import { context, eventService, slotInjector, slotRepeater } from '../../../src/ad-engine/services';
import adSlotFake from '../ad-slot-fake';

describe('slot-repeater', () => {
	let adSlot;
	let injectedContainer;
	let repeatResult;
	let sandbox;

	afterEach(() => {
		sandbox.restore();
	});

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		injectedContainer = {};
		repeatResult = false;
		sandbox.stub(slotInjector, 'inject').callsFake(() => injectedContainer);
		adSlot = { ...adSlotFake };
		sandbox.stub(eventService, 'on').callsFake((key, callback) => {
			eventService.once('fake_render_event', (slot) => {
				repeatResult = callback(slot);
			});
		});

		context.set('events.pushOnScroll.ids', []);
		context.set('options.slotRepeater', true);
		context.set('slots.adStack', []);
	});

	it('ad-slot is not repeated when option is disabled', () => {
		context.set('options.slotRepeater', false);

		slotRepeater.init();

		eventService.emit('fake_render_event', adSlot);

		expect(repeatResult).to.be.false;
	});

	it('ad-slot is not repeated when it is disabled', () => {
		slotRepeater.init();

		adSlot.isEnabled = () => false;

		eventService.emit('fake_render_event', adSlot);

		expect(repeatResult).to.be.false;
	});

	it('ad-slot is not repeated when it is not configured as repeatable', () => {
		slotRepeater.init();

		eventService.emit('fake_render_event', adSlot);

		expect(repeatResult).to.be.false;
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

		eventService.emit('fake_render_event', adSlot);

		expect(repeatResult).to.be.true;
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

		eventService.emit('fake_render_event', adSlot);

		expect(repeatResult).to.be.false;
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

		eventService.emit('fake_render_event', adSlot);

		expect(repeatResult).to.be.false;
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

		eventService.emit('fake_render_event', adSlot);

		expect(repeatResult).to.be.true;
	});
});
