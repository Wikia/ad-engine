import { Nielsen } from '@wikia/ad-services/nielsen';
import { InstantConfigService } from '@wikia/core';
import { expect } from 'chai';

describe('Nielsen service', () => {
	it('is disabled if ICBM variable is set to false', () => {
		const instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		const nielsen = new Nielsen(instantConfigStub);

		instantConfigStub.get.withArgs('icNielsen').returns(false);

		expect(nielsen.call()).to.equal(null);
		expect(window.NOLBUNDLE).to.equal(undefined);
	});
});
