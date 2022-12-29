import { assert } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import { targetingService, trackingOptIn } from '../../../src/core';
import { setupNpaContext } from '../../../src/ad-products/utils/npa';

describe('NPA - setup context ', () => {
	const sandbox = createSandbox();
	let isOptedInStub: SinonStub;

	beforeEach(() => {
		isOptedInStub = sandbox.stub(trackingOptIn, 'isOptedIn');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('sets npa targeting for turned off tracking opt-in', () => {
		isOptedInStub.returns(false);
		setupNpaContext();
		assert.equal(targetingService.get('npa'), '1');
	});

	it('sets npa targeting for tracking opt-in', () => {
		isOptedInStub.returns(true);
		setupNpaContext();
		assert.equal(targetingService.get('npa'), '0');
	});
});
