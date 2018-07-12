import { expect } from 'chai';
import sinon from 'sinon';
import adSlotFake from '../ad-slot-fake';
import { context } from '../../src/services/context-service';
import { slotRepeater } from '../../src/services/slot-repeater';

let adSlot,
	elementProperties = {},
	sibling = {};

describe('slot-repeater', () => {
	afterEach(() => {
		document.getElementById.restore();
		document.querySelectorAll.restore();
	});

	beforeEach(() => {
		elementProperties = {
			offsetParent: {
				offsetTop: 0,
				offsetParent: null
			}
		};

		sibling = {
			classList: {
				contains: () => {}
			},
			offsetHeight: 300,
			offsetTop: 5000,
			offsetParent: elementProperties.offsetParent,
			ownerDocument: {},
			parentNode: {
				insertBefore: () => {}
			}
		};

		sinon.stub(document, 'getElementById').withArgs('foo-container').returns({
			classList: {
				contains: () => {}
			},
			offsetHeight: 300,
			offsetTop: 100,
			offsetParent: elementProperties.offsetParent,
			ownerDocument: {}
		});

		sinon.stub(document, 'querySelectorAll').withArgs('.foo bar').returns([sibling]);

		adSlot = Object.assign({}, adSlotFake);

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
				'targeting.rv': '{slotConfig.repeat.index}'
			}
		};

		expect(repeater.onRenderEnded(adSlot)).to.be.true;
		expect(context.get('events.pushOnScroll.ids.0')).to.equal('repeatable_boxad_2');
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
				'targeting.rv': '{slotConfig.repeat.index}'
			}
		};

		expect(repeater.onRenderEnded(adSlot)).to.be.false;
		expect(context.get('events.pushOnScroll.ids').length).to.equal(0);
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
				'targeting.rv': '{slotConfig.repeat.index}'
			}
		};
		sibling.offsetTop = 300;

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
				'targeting.rv': '{slotConfig.repeat.index}'
			}
		};

		expect(repeater.onRenderEnded(adSlot)).to.be.true;
		expect(context.get('events.pushOnScroll.ids.0')).to.equal('repeatable_boxad_2');
	});
});
