import { expect } from 'chai';
import { context, ViewabilityCounter } from '../../../src/ad-engine/index';

describe('Viewability counter service', () => {
	const viewabilityCounter = ViewabilityCounter.make();

	beforeEach(() => {
		context.set('options.viewabilityCounter.enabled', true);
		context.set('options.viewabilityCounter.ignoredSlots', ['ignoredSlot']);
	});

	it('viewability is counted properly', () => {
		expect(viewabilityCounter.getViewability()).to.equal('0.500');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');

		viewabilityCounter.incrementStatusCounter('loaded', 'ignoredSlot');

		expect(viewabilityCounter.getViewability()).to.equal('0.500');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');

		viewabilityCounter.incrementStatusCounter('loaded', 'otherSlot');

		expect(viewabilityCounter.getViewability()).to.equal('0.000');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');

		viewabilityCounter.incrementStatusCounter('viewed', 'otherSlot');

		expect(viewabilityCounter.getViewability()).to.equal('1.000');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');

		viewabilityCounter.incrementStatusCounter('loaded', 'slot');

		expect(viewabilityCounter.getViewability()).to.equal('0.500');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.000');

		viewabilityCounter.incrementStatusCounter('viewed', 'slot');

		expect(viewabilityCounter.getViewability()).to.equal('1.000');
		expect(viewabilityCounter.getViewability('slot')).to.equal('1.000');

		viewabilityCounter.incrementStatusCounter('loaded', 'slot1');
		viewabilityCounter.incrementStatusCounter('loaded', 'slot2');
		viewabilityCounter.incrementStatusCounter('loaded', 'slot3');
		viewabilityCounter.incrementStatusCounter('loaded', 'slot4');
		viewabilityCounter.incrementStatusCounter('loaded', 'slot5');
		viewabilityCounter.incrementStatusCounter('loaded', 'slot6');
		viewabilityCounter.incrementStatusCounter('loaded', 'slot');
		viewabilityCounter.incrementStatusCounter('loaded', 'otherSlot');

		expect(viewabilityCounter.getViewability()).to.equal('0.200');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');
		expect(viewabilityCounter.getViewability('otherSlot')).to.equal('0.500');
		expect(viewabilityCounter.getViewability('slot1')).to.equal('0.000');

		viewabilityCounter.incrementStatusCounter('viewed', 'slot1');
		viewabilityCounter.incrementStatusCounter('viewed', 'slot2');
		viewabilityCounter.incrementStatusCounter('viewed', 'slot3');
		viewabilityCounter.incrementStatusCounter('viewed', 'slot4');
		viewabilityCounter.incrementStatusCounter('viewed', 'slot5');
		viewabilityCounter.incrementStatusCounter('viewed', 'otherSlot');

		expect(viewabilityCounter.getViewability()).to.equal('0.800');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');
		expect(viewabilityCounter.getViewability('otherSlot')).to.equal('1.000');
		expect(viewabilityCounter.getViewability('slot1')).to.equal('1.000');

		viewabilityCounter.incrementStatusCounter('viewed', 'slot6');
		viewabilityCounter.incrementStatusCounter('viewed', 'slot');

		expect(viewabilityCounter.getViewability()).to.equal('1.000');
		expect(viewabilityCounter.getViewability('slot')).to.equal('1.000');
	});
});
