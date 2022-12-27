import { expect } from 'chai';
import { context } from '@wikia/core/index';
import { nielsen } from '@wikia/ad-services/nielsen';

describe('Nielsen service', () => {
	it('is disabled if context variable is set to false', () => {
		context.set('services.nielsen.enabled', false);

		expect(nielsen.call()).to.equal(null);
		expect(window.NOLBUNDLE).to.equal(undefined);

		context.set('services.nielsen.enabled', true);
		context.set('services.nielsen.appId', '');

		expect(nielsen.call()).to.equal(null);
		expect(window.NOLBUNDLE).to.equal(undefined);
	});
});
