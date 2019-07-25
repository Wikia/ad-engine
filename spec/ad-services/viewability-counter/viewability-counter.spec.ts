import { expect } from 'chai';
import { context } from '../../../src/ad-engine/index';
import { viewabilityCounter } from '../../../src/ad-services/viewability-counter';

describe.only('Viewability counter service', () => {
	beforeEach(() => {
		context.set('services.viewabilityCounter.enabled', true);
		context.set('services.viewabilityCounter.ignoredSlots', ['ignoredSlot']);
	});

	it('viewability is counted properly', () => {
		expect(viewabilityCounter.getViewability()).to.equal('0.500');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');

		viewabilityCounter.updateStatus('loaded', 'ignoredSlot');

		expect(viewabilityCounter.getViewability()).to.equal('0.500');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');

		viewabilityCounter.updateStatus('loaded', 'otherSlot');

		expect(viewabilityCounter.getViewability()).to.equal('0.000');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');

		viewabilityCounter.updateStatus('viewed', 'otherSlot');

		expect(viewabilityCounter.getViewability()).to.equal('1.000');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');

		viewabilityCounter.updateStatus('loaded', 'slot');

		expect(viewabilityCounter.getViewability()).to.equal('0.500');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.000');

		viewabilityCounter.updateStatus('viewed', 'slot');

		expect(viewabilityCounter.getViewability()).to.equal('1.000');
		expect(viewabilityCounter.getViewability('slot')).to.equal('1.000');

		viewabilityCounter.updateStatus('loaded', 'slot1');
		viewabilityCounter.updateStatus('loaded', 'slot2');
		viewabilityCounter.updateStatus('loaded', 'slot3');
		viewabilityCounter.updateStatus('loaded', 'slot4');
		viewabilityCounter.updateStatus('loaded', 'slot5');
		viewabilityCounter.updateStatus('loaded', 'slot6');
		viewabilityCounter.updateStatus('loaded', 'slot');
		viewabilityCounter.updateStatus('loaded', 'otherSlot');

		expect(viewabilityCounter.getViewability()).to.equal('0.200');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');
		expect(viewabilityCounter.getViewability('otherSlot')).to.equal('0.500');
		expect(viewabilityCounter.getViewability('slot1')).to.equal('0.000');

		viewabilityCounter.updateStatus('viewed', 'slot1');
		viewabilityCounter.updateStatus('viewed', 'slot2');
		viewabilityCounter.updateStatus('viewed', 'slot3');
		viewabilityCounter.updateStatus('viewed', 'slot4');
		viewabilityCounter.updateStatus('viewed', 'slot5');
		viewabilityCounter.updateStatus('viewed', 'otherSlot');

		expect(viewabilityCounter.getViewability()).to.equal('0.800');
		expect(viewabilityCounter.getViewability('slot')).to.equal('0.500');
		expect(viewabilityCounter.getViewability('otherSlot')).to.equal('1.000');
		expect(viewabilityCounter.getViewability('slot1')).to.equal('1.000');

		viewabilityCounter.updateStatus('viewed', 'slot6');
		viewabilityCounter.updateStatus('viewed', 'slot');

		expect(viewabilityCounter.getViewability()).to.equal('1.000');
		expect(viewabilityCounter.getViewability('slot')).to.equal('1.000');
	});
});
