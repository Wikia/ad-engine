import { Nielsen } from '@wikia/ad-services/nielsen';
import { InstantConfigService } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('Nielsen service', () => {
	it('is disabled if ICBM variable is set to false', () => {
		const sandbox = createSandbox();
		const instantConfigStub = sandbox.createStubInstance(InstantConfigService);
		const nielsen = new Nielsen(instantConfigStub);

		instantConfigStub.get.withArgs('icNielsen').returns(false);

		expect(nielsen.call()).to.equal(null);
		expect(window.NOLBUNDLE).to.equal(undefined);
	});
});
