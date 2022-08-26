import { expect } from 'chai';
import { context } from '../../../src/ad-engine/index';
import { nielsenDeprecated } from '../../../src/ad-services/nielsen-deprecated';

describe('Nielsen service', () => {
	it('is disabled if context variable is set to false', () => {
		context.set('services.nielsen.enabled', false);

		expect(nielsenDeprecated.call()).to.equal(null);
		expect(window.NOLBUNDLE).to.equal(undefined);

		context.set('services.nielsen.enabled', true);
		context.set('services.nielsen.appId', '');

		expect(nielsenDeprecated.call()).to.equal(null);
		expect(window.NOLBUNDLE).to.equal(undefined);
	});
});
